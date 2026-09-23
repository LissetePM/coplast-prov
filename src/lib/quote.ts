// Client for the /api/generate-quote serverless function (Netlify).
import type { CartLine } from "@/context/CartContext";

/** Maps a cart line to the format expected by the serverless function. */
export function cartLineToItem(l: CartLine) {
  return {
    name: `${l.product} ${l.variant}`.trim() + (l.color ? ` · ${l.color}` : ""),
    sku: l.sku,
    unit: l.unit,
    piecesPerPack: l.piecesPerPack,
    unitPrice: l.unitPrice,
    packPrice: l.packPrice,
    quantity: l.quantity,
    onSale: l.onSale,
  };
}

export interface QuotePayload {
  mode: "email" | "whatsapp";
  companyName?: string;
  contactName?: string;
  location?: string;
  phone?: string;
  email?: string;
  items: ReturnType<typeof cartLineToItem>[];
}

export interface QuoteResult {
  quoteId: string;
  blob: Blob;
  emailSent: boolean;
}

/** Calls the function, returns PDF blob + quoteId. Throws a readable error on failure. */
export async function generateQuote(payload: QuotePayload): Promise<QuoteResult> {
  const res = await fetch("/api/generate-quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const contentType = res.headers.get("Content-Type") || "";
  if (!res.ok || !contentType.includes("application/pdf")) {
    const msg = contentType.includes("application/json")
      ? (await res.json().catch(() => null))?.error
      : null;
    throw new Error(msg || "The PDF generator requires the Netlify environment (production or `netlify dev`).");
  }
  return {
    quoteId: res.headers.get("X-Quote-Id") || "COT",
    emailSent: res.headers.get("X-Email-Sent") === "true",
    blob: await res.blob(),
  };
}

/** Triggers a browser download for a blob. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
