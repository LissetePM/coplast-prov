// Serverless function: generates the quote PDF (sequential ID), saves it,
// sends it by email according to mode, and returns it for download.
//
//  mode "email":    To = client email, CC = Coplast internal email.
//  mode "whatsapp": To = Coplast internal email only (client does not receive).
import { generateQuotePDF } from "../lib/quote-pdf.mjs";
import { nextQuoteId } from "../lib/quote-id.mjs";
import { storeQuote } from "../lib/quote-storage.mjs";
import { sendEmail, buildQuoteEmail, NOTIFY_EMAIL } from "../lib/email.mjs";

const IVA_RATE = 0.16;

export const config = { path: "/api/generate-quote" };

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const money = (v) => "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || ""));

function slugify(s) {
  return String(s || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    .slice(0, 40) || "sin-nombre";
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const mode = body?.mode === "whatsapp" ? "whatsapp" : "email";
  const { companyName = "", contactName = "", location = "", phone = "", email = "", items } = body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return json({ error: "La cotización no tiene productos." }, 400);
  }
  if (mode === "email" && !isValidEmail(email)) {
    return json({ error: "Correo del cliente inválido." }, 400);
  }

  // Sanitize items and recalculate amounts on the server.
  const pdfItems = items.slice(0, 60).map((it) => {
    const unit = it.unit === "pack" ? "pack" : "piece";
    const quantity = Math.max(1, Math.floor(num(it.quantity)) || 1);
    const unitPrice = num(it.unitPrice);
    const packPrice = it.packPrice == null ? null : num(it.packPrice);
    const amount = unit === "pack" && packPrice != null ? quantity * packPrice : quantity * unitPrice;
    return {
      name: String(it.name || "Producto").slice(0, 80),
      sku: String(it.sku || "").slice(0, 20),
      unit,
      piecesPerPack: it.piecesPerPack == null ? null : Math.floor(num(it.piecesPerPack)) || null,
      unitPrice, packPrice, quantity, amount,
      onSale: Boolean(it.onSale),
    };
  })
    // `num()` turns null/NaN into 0 silently, so an item without a confirmed
    // price would otherwise reach the PDF and the email as a legitimate
    // "$0.00" line. Never quote a price we do not have.
    .filter((it) => Number.isFinite(it.unitPrice) && it.unitPrice > 0);

  if (pdfItems.length === 0) {
    return json({ error: "La cotización no tiene productos con precio confirmado." }, 400);
  }

  const now = new Date();
  const quoteId = await nextQuoteId(now);
  const date = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(now);
  const subtotal = pdfItems.reduce((s, it) => s + it.amount, 0);
  const total = subtotal * (1 + IVA_RATE);

  let pdf;
  try {
    pdf = await generateQuotePDF({
      quoteId, date,
      companyName: String(companyName).slice(0, 80),
      contactName: String(contactName).slice(0, 80),
      location: String(location).slice(0, 80),
      phone: String(phone).slice(0, 40),
      email: String(email).slice(0, 80),
      items: pdfItems, ivaRate: IVA_RATE,
    });
  } catch (e) {
    console.error("Error generando PDF:", e);
    return json({ error: "No se pudo generar el PDF." }, 500);
  }

  const fileDate = now.toISOString().slice(0, 10);
  const filename = `Cotizacion_${quoteId}_${fileDate}_${slugify(companyName)}.pdf`;

  // Save copy (Blobs) — best effort, does not block.
  await storeQuote({ quoteId, pdf, meta: { mode, companyName, contactName, location, phone, email, date, subtotal, total, nItems: pdfItems.length } });

  // Send email according to mode.
  const subject = `Cotización ${quoteId}${companyName ? " · " + companyName : ""}`;
  const html = buildQuoteEmail({ quoteId, companyName, date, total: money(total) });
  let emailResult = { sent: false, reason: "no enviado" };
  if (mode === "email") {
    emailResult = await sendEmail({ to: email, cc: NOTIFY_EMAIL || undefined, subject, html, pdf, filename });
  } else {
    // whatsapp: only to Coplast (if configured)
    if (NOTIFY_EMAIL) emailResult = await sendEmail({ to: NOTIFY_EMAIL, subject: subject + " (WhatsApp)", html, pdf, filename });
    else emailResult = { sent: false, reason: "COTIZACION_NOTIFY_EMAIL no configurado" };
  }

  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-Quote-Id": quoteId,
      "X-Email-Sent": String(emailResult.sent),
      "X-Email-Reason": emailResult.reason ? encodeURIComponent(emailResult.reason) : "",
    },
  });
};
