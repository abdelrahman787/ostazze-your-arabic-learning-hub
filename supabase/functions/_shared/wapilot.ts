export function normalizeChatId(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.endsWith("@c.us") ? digits : digits;
}

export async function sendWapilotText(chatId: string, text: string): Promise<Record<string, unknown>> {
  const token = Deno.env.get("WAPILOT_API_TOKEN");
  const instanceId = Deno.env.get("WAPILOT_INSTANCE_ID");
  const baseUrl = (Deno.env.get("WAPILOT_API_BASE_URL") || "https://api.wapilot.net/api/v2").replace(/\/$/, "");

  if (!token || !instanceId) {
    throw new Error("WhatsApp integration is not configured.");
  }

  const response = await fetch(`${baseUrl}/${encodeURIComponent(instanceId)}/send-message`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      token,
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({ chat_id: normalizeChatId(chatId), text }),
  });

  const raw = await response.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    payload = { raw };
  }
  if (!response.ok || payload.success === false) {
    throw new Error(`WaPilot request failed (${response.status}): ${raw}`);
  }
  return payload;
}
