// Quote storage layer (stable interface, easy to swap implementations).
//
// TODAY: saves PDF and metadata to Netlify Blobs (no DB or server needed).
// LATER: can be replaced with email delivery, Google Drive upload, or a database
//        without touching the function or the rest of the system.
import { getStore } from "@netlify/blobs";

/**
 * How long a quote is kept before it is deleted.
 *
 * This number is a promise made to the user: the privacy notice states a
 * three-month retention period (see LEGAL.retentionPeriod in
 * src/config/legal.ts). Changing one without the other makes the site claim
 * something it does not do.
 */
export const RETENTION_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * Reads the human date the PDF shows ("11 de agosto de 2026") back into a Date.
 *
 * Quotes stored before `storedAt` existed only carry this field, so without
 * this parser the oldest records — precisely the ones due for deletion — would
 * be the ones we could never delete.
 *
 * @returns {Date | null} null when the string is not in the expected shape
 */
function parseSpanishDate(value) {
  const match = /^(\d{1,2}) de ([a-záéíóú]+) de (\d{4})$/i.exec(String(value ?? "").trim());
  if (!match) return null;
  const month = MONTHS_ES.indexOf(match[2].toLowerCase());
  if (month === -1) return null;
  const date = new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Emission date of a quote, preferring the machine-readable field. */
function emittedAt(meta) {
  if (meta?.storedAt) {
    const parsed = new Date(meta.storedAt);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return parseSpanishDate(meta?.date);
}

/**
 * @param {object} p
 *  quoteId: string · pdf: Uint8Array · meta: object with quote data
 * @returns {Promise<boolean>} true if saved successfully
 */
export async function storeQuote({ quoteId, pdf, meta }) {
  try {
    const store = getStore("quotes");
    // ISO timestamp alongside the human date: `date` is formatted for people
    // and is not a reliable basis for deciding what has expired.
    const record = { quoteId, ...meta, storedAt: new Date().toISOString() };
    await store.set(`pdf/${quoteId}.pdf`, new Blob([pdf], { type: "application/pdf" }), {
      metadata: record,
    });
    await store.setJSON(`meta/${quoteId}.json`, record);
    return true;
  } catch (e) {
    // Does not block PDF delivery to the client if storage fails.
    console.error("storeQuote failed:", e?.message);
    return false;
  }
}

/**
 * Deletes every quote older than RETENTION_DAYS, so the retention period the
 * privacy notice promises is actually enforced.
 *
 * Only the `meta/` prefix is listed, which keeps the yearly `counter-YYYY` key
 * out of reach: deleting it would restart quote numbering from 0001.
 *
 * A record whose date cannot be determined is kept and reported rather than
 * deleted. Deleting on a guess is not recoverable; leaving one stale record for
 * a human to look at is.
 *
 * @param {object} [options]
 * @param {Date} [options.now] Injectable clock, for tests.
 * @returns {Promise<{deleted: number, kept: number, undated: string[], failed: number}>}
 */
export async function purgeExpiredQuotes({ now = new Date() } = {}) {
  const summary = { deleted: 0, kept: 0, undated: [], failed: 0 };
  const store = getStore("quotes");
  const { blobs } = await store.list({ prefix: "meta/" });

  for (const blob of blobs) {
    try {
      const meta = await store.get(blob.key, { type: "json" });
      const emitted = emittedAt(meta);

      if (!emitted) {
        summary.undated.push(blob.key);
        continue;
      }
      if (now.getTime() - emitted.getTime() <= RETENTION_DAYS * DAY_MS) {
        summary.kept++;
        continue;
      }

      const quoteId = meta?.quoteId ?? blob.key.slice("meta/".length, -".json".length);
      await store.delete(`pdf/${quoteId}.pdf`);
      await store.delete(blob.key);
      summary.deleted++;
    } catch (e) {
      // One unreadable record must not abort the whole run.
      console.error(`purgeExpiredQuotes: ${blob.key} failed:`, e?.message);
      summary.failed++;
    }
  }

  return summary;
}
