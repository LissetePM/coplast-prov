import { describe, it, expect, vi, beforeEach } from "vitest";

// Exercises the purge against a fake Netlify Blobs store. The rule being
// protected is blunt: this code deletes customer data, so a mistake here is
// not recoverable from the UI.

const store = {
  data: new Map<string, unknown>(),
  list: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@netlify/blobs", () => ({ getStore: () => store }));

const { purgeExpiredQuotes, RETENTION_DAYS } = await import("../../netlify/lib/quote-storage.mjs");

const NOW = new Date("2026-08-11T12:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

function seed(records: Record<string, unknown>) {
  store.data = new Map(Object.entries(records));
  store.list.mockResolvedValue({ blobs: [...store.data.keys()].map((key) => ({ key })) });
  store.get.mockImplementation(async (key: string) => store.data.get(key));
  store.delete.mockImplementation(async (key: string) => void store.data.delete(key));
}

beforeEach(() => vi.clearAllMocks());

describe("purgeExpiredQuotes", () => {
  it("deletes quotes past the retention window and keeps recent ones", async () => {
    seed({
      "meta/COT-2026-0001.json": { quoteId: "COT-2026-0001", storedAt: daysAgo(120) },
      "meta/COT-2026-0002.json": { quoteId: "COT-2026-0002", storedAt: daysAgo(10) },
    });
    const summary = await purgeExpiredQuotes({ now: NOW });

    expect(summary).toMatchObject({ deleted: 1, kept: 1, failed: 0 });
    // Both the metadata and the PDF must go: leaving the PDF would keep the
    // customer's data in storage while looking purged from the index.
    expect(store.delete).toHaveBeenCalledWith("pdf/COT-2026-0001.pdf");
    expect(store.delete).toHaveBeenCalledWith("meta/COT-2026-0001.json");
    expect(store.delete).not.toHaveBeenCalledWith("meta/COT-2026-0002.json");
  });

  it("keeps a quote sitting exactly on the boundary", async () => {
    seed({ "meta/COT-2026-0003.json": { quoteId: "COT-2026-0003", storedAt: daysAgo(RETENTION_DAYS) } });
    expect(await purgeExpiredQuotes({ now: NOW })).toMatchObject({ deleted: 0, kept: 1 });
  });

  it("falls back to the Spanish date of records saved before storedAt existed", async () => {
    seed({
      "meta/COT-2026-0004.json": { quoteId: "COT-2026-0004", date: "3 de enero de 2026" },
      "meta/COT-2026-0005.json": { quoteId: "COT-2026-0005", date: "5 de agosto de 2026" },
    });
    expect(await purgeExpiredQuotes({ now: NOW })).toMatchObject({ deleted: 1, kept: 1 });
    expect(store.delete).toHaveBeenCalledWith("pdf/COT-2026-0004.pdf");
  });

  it("never deletes a record whose date it cannot read", async () => {
    seed({ "meta/COT-2026-0006.json": { quoteId: "COT-2026-0006", date: "el martes pasado" } });
    const summary = await purgeExpiredQuotes({ now: NOW });

    expect(summary.deleted).toBe(0);
    expect(summary.undated).toEqual(["meta/COT-2026-0006.json"]);
    expect(store.delete).not.toHaveBeenCalled();
  });

  it("never touches the yearly counter, which would restart quote numbering", async () => {
    seed({ "meta/COT-2026-0007.json": { quoteId: "COT-2026-0007", storedAt: daysAgo(200) } });
    await purgeExpiredQuotes({ now: NOW });

    expect(store.list).toHaveBeenCalledWith({ prefix: "meta/" });
    expect(store.delete).not.toHaveBeenCalledWith(expect.stringContaining("counter"));
  });

  it("keeps going when a single record cannot be read", async () => {
    seed({
      "meta/COT-2026-0008.json": { quoteId: "COT-2026-0008", storedAt: daysAgo(200) },
      "meta/broken.json": { quoteId: "broken", storedAt: daysAgo(200) },
    });
    store.get.mockImplementation(async (key: string) => {
      if (key === "meta/broken.json") throw new Error("corrupt blob");
      return store.data.get(key);
    });
    expect(await purgeExpiredQuotes({ now: NOW })).toMatchObject({ deleted: 1, failed: 1 });
  });
});
