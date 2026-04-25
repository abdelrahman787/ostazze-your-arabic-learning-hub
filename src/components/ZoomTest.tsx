import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MeetingResult {
  id: number | string;
  join_url: string;
  start_url: string;
  password?: string;
  topic?: string;
  start_time?: string;
}

export default function ZoomTest() {
  const [tokenStatus, setTokenStatus] = useState<string>("");
  const [tokenLoading, setTokenLoading] = useState(false);

  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meeting, setMeeting] = useState<MeetingResult | null>(null);
  const [meetingError, setMeetingError] = useState<string>("");

  const testToken = async () => {
    setTokenLoading(true);
    setTokenStatus("");
    try {
      const { data, error } = await supabase.functions.invoke("zoom-get-token");
      if (error) throw error;
      if (data?.success && data.access_token) {
        setTokenStatus(
          `✅ Token received (length: ${String(data.access_token).length})`,
        );
      } else {
        setTokenStatus(`❌ ${data?.error || "Unknown response"}`);
      }
    } catch (err) {
      setTokenStatus(
        `❌ ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setTokenLoading(false);
    }
  };

  const createMeeting = async () => {
    setMeetingLoading(true);
    setMeeting(null);
    setMeetingError("");
    try {
      const { data, error } = await supabase.functions.invoke(
        "zoom-create-meeting",
        {
          body: {
            topic: "OSTAZE Test Session",
            duration: 30,
            start_time: new Date(Date.now() + 3600000).toISOString(),
          },
        },
      );
      if (error) throw error;
      if (data?.success && data.meeting) {
        setMeeting(data.meeting);
      } else {
        setMeetingError(data?.error || "Unknown response");
      }
    } catch (err) {
      setMeetingError(err instanceof Error ? err.message : String(err));
    } finally {
      setMeetingLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-card text-card-foreground rounded-xl border border-border">
      <h2 className="text-2xl font-bold">Zoom Integration Test</h2>

      <section className="space-y-2">
        <button
          onClick={testToken}
          disabled={tokenLoading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
        >
          {tokenLoading ? "Loading..." : "Test Zoom Connection"}
        </button>
        {tokenStatus && (
          <p className="text-sm font-mono break-all">{tokenStatus}</p>
        )}
      </section>

      <section className="space-y-2">
        <button
          onClick={createMeeting}
          disabled={meetingLoading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
        >
          {meetingLoading ? "Creating..." : "Create Test Meeting"}
        </button>

        {meetingError && (
          <p className="text-sm text-destructive font-mono break-all">
            ❌ {meetingError}
          </p>
        )}

        {meeting && (
          <div className="space-y-2 text-sm bg-muted p-4 rounded-md">
            <p>
              <strong>Meeting ID:</strong> {meeting.id}
            </p>
            <p>
              <strong>Topic:</strong> {meeting.topic}
            </p>
            <p>
              <strong>Start time:</strong> {meeting.start_time}
            </p>
            <p>
              <strong>Password:</strong> {meeting.password}
            </p>
            <p className="break-all">
              <strong>Join URL:</strong>{" "}
              <a
                href={meeting.join_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                {meeting.join_url}
              </a>
            </p>
            <p className="break-all">
              <strong>Start URL (host):</strong>{" "}
              <a
                href={meeting.start_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                {meeting.start_url}
              </a>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
