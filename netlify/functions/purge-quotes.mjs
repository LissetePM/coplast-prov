// Scheduled cleanup: deletes stored quotes once they pass the retention period
// stated in the privacy notice.
//
// Without this the site would promise a three-month retention while keeping
// every customer's name, phone and email in Netlify Blobs forever.
import { purgeExpiredQuotes, RETENTION_DAYS } from "../lib/quote-storage.mjs";

// Runs once a day. The exact hour does not matter: a record is deleted the
// first run after it expires, so the effective window is the period plus at
// most 24 hours.
export const config = { schedule: "@daily" };

export default async () => {
  const startedAt = Date.now();
  try {
    const summary = await purgeExpiredQuotes();
    console.log(
      `purge-quotes: retención ${RETENTION_DAYS} días · ` +
      `${summary.deleted} borradas · ${summary.kept} vigentes · ` +
      `${summary.failed} con error · ${summary.undated.length} sin fecha legible ` +
      `(${Date.now() - startedAt} ms)`,
    );
    // Undated records are the ones a human has to look at, so they are named.
    if (summary.undated.length) {
      console.warn("purge-quotes: sin fecha legible, conservadas:", summary.undated.join(", "));
    }
    return new Response(JSON.stringify(summary), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("purge-quotes failed:", e?.message);
    return new Response(JSON.stringify({ error: e?.message ?? "unknown" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
