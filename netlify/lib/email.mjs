// Email delivery via SMTP (nodemailer). All configuration comes from
// environment variables, so switching between test Gmail and Coplast's
// mail provider requires only env var changes (no code changes):
//
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (optional)
//   EMAIL_FROM              -> sender, e.g. "Coplast de México <ventas@coplastdemexico.com>"
//   COTIZACION_NOTIFY_EMAIL -> Coplast internal email that receives a copy (configurable)
import nodemailer from "nodemailer";

/** Coplast internal email (copy of each quote). Configurable via env. */
export const NOTIFY_EMAIL = process.env.COTIZACION_NOTIFY_EMAIL || "";

let _transport = null;
function getTransport() {
  if (_transport) return _transport;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null; // SMTP not configured
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  _transport = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  return _transport;
}

/**
 * Sends the quote by email.
 * @returns {Promise<{sent:boolean, reason?:string}>}
 */
export async function sendEmail({ to, cc, subject, html, pdf, filename }) {
  const transport = getTransport();
  if (!transport) return { sent: false, reason: "SMTP no configurado" };
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  try {
    await transport.sendMail({
      from,
      to: to || undefined,
      cc: cc || undefined,
      subject,
      html,
      attachments: [{ filename, content: Buffer.from(pdf), contentType: "application/pdf" }],
    });
    return { sent: true };
  } catch (e) {
    console.error("sendEmail failed:", e?.message);
    return { sent: false, reason: e?.message };
  }
}

/** Simple, readable HTML body for the quote email. */
export function buildQuoteEmail({ quoteId, companyName, date, total }) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#1F2A33;line-height:1.5">
    <p>Hola${companyName ? " " + escapeHtml(companyName) : ""},</p>
    <p>Adjuntamos tu cotización <strong>${escapeHtml(quoteId)}</strong> del ${escapeHtml(date)}.</p>
    ${total != null ? `<p>Total estimado (con IVA): <strong>${escapeHtml(total)}</strong></p>` : ""}
    <p>Para confirmar disponibilidad, descuentos por volumen o dudas, responde este correo
       o escríbenos por WhatsApp al 56 2528 9330.</p>
    <p style="color:#6B7680;font-size:13px">Coplast de México · Hecho en México · Precios en MXN · Vigencia 15 días.</p>
  </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}
