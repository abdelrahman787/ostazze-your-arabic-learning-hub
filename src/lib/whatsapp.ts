/** Single source of truth for the OSTAZZE support WhatsApp line. */
import { SITE } from "@/config/site";
export const WHATSAPP_NUMBER = SITE.whatsapp;

export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
