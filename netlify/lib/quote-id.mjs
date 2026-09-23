// Sequential quote ID by year, persisted in Netlify Blobs.
// Format: COT-2026-0001, COT-2026-0002, ... (resets each year).
import { getStore } from "@netlify/blobs";

export async function nextQuoteId(date = new Date()) {
  const year = date.getFullYear();
  const key = `counter-${year}`;
  try {
    const store = getStore("quotes");
    const current = Number((await store.get(key)) || 0);
    const next = current + 1;
    await store.set(key, String(next));
    return `COT-${year}-${String(next).padStart(4, "0")}`;
  } catch (e) {
    // If Blobs is unavailable (e.g. local dev without netlify), fall back to a
    // timestamp-based ID so PDF generation is not blocked.
    console.error("nextQuoteId: Blobs unavailable, using timestamp fallback:", e?.message);
    const stamp = String(Date.now()).slice(-5);
    return `COT-${year}-T${stamp}`;
  }
}
