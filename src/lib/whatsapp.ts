/** Single source of truth for the OSTAZZE support WhatsApp line. */
export const WHATSAPP_NUMBER = "201130382206";

export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
