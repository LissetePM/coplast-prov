// Business data in one place. Use these constants instead of
// hardcoding phone/email in each component.

export const BUSINESS = {
  name: "Coplast de México",
  /** Number for wa.me links (international format, no symbols). */
  whatsappNumber: "525625289330",
  /** Phone as shown to the user. */
  phone: "56 2528 9330",
  web: "coplastdemexico.com",
  email: "ventas@coplastdemexico.com",
  /** VAT rate applied to quotes. */
  ivaRate: 0.16,
} as const;

/** Builds a WhatsApp link with a pre-encoded message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
