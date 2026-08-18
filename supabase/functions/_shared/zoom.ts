async function getZoomAccessToken(): Promise<string> {
  const accountId = Deno.env.get("ZOOM_ACCOUNT_ID");
  const clientId = Deno.env.get("ZOOM_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");
  if (!accountId || !clientId || !clientSecret) throw new Error("Missing Zoom credentials in environment.");

  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  const raw = await response.text();
  if (!response.ok) throw new Error(`Zoom token request failed (${response.status}): ${raw}`);
  const payload = JSON.parse(raw) as { access_token?: string };
  if (!payload.access_token) throw new Error("Zoom did not return an access token.");
  return payload.access_token;
}

export async function createZoomMeeting(input: {
  topic: string;
  startTime: string;
  duration?: number;
}): Promise<{ join_url: string; start_url?: string; password?: string; id?: number; start_time?: string }> {
  const accessToken = await getZoomAccessToken();
  const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: input.topic,
      type: 2,
      start_time: input.startTime,
      duration: input.duration || 60,
      timezone: Deno.env.get("ZOOM_TIMEZONE") || "Asia/Riyadh",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        waiting_room: true,
        approval_type: 0,
        meeting_authentication: false,
      },
    }),
  });
  const raw = await response.text();
  if (!response.ok) throw new Error(`Zoom create meeting failed (${response.status}): ${raw}`);
  const meeting = JSON.parse(raw) as { join_url?: string; start_url?: string; password?: string; id?: number; start_time?: string };
  if (!meeting.join_url) throw new Error("Zoom did not return a join URL.");
  return { join_url: meeting.join_url, start_url: meeting.start_url, password: meeting.password, id: meeting.id, start_time: meeting.start_time };
}
