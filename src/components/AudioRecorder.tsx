import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const isMediaRecorderSupported = () =>
  typeof window !== "undefined" &&
  typeof navigator.mediaDevices?.getUserMedia === "function" &&
  typeof window.MediaRecorder !== "undefined";

interface AudioRecorderProps {
  onRecorded: (audioUrl: string) => void;
  disabled?: boolean;
  userId: string;
  lectureId: string;
}

const AudioRecorder = ({ onRecorded, disabled, userId, lectureId }: AudioRecorderProps) => {
  const { t } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const startRecording = useCallback(async () => {
    if (!isMediaRecorderSupported()) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(timerRef.current);
        setDuration(0);

        const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
        const ext = mimeType === "audio/webm" ? "webm" : "ogg";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size === 0) return;

        setUploading(true);
        const fileName = `${userId}/${lectureId}_${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("chat-audio").upload(fileName, blob);

        if (!error) {
          // Store storage path; AudioPlayer signs on demand
          onRecorded(fileName);
        }
        setUploading(false);
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      console.error("Microphone access denied");
    }
  }, [userId, lectureId, onRecorded]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!isMediaRecorderSupported()) {
    return (
      <div
        className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center opacity-40 cursor-not-allowed"
        title={t("mic_not_supported")}
      >
        <MicOff size={16} className="text-muted-foreground" />
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
        <Loader2 size={16} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (recording) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-destructive font-mono animate-pulse">{formatTime(duration)}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={stopRecording}
          className="w-9 h-9 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center"
        >
          <Square size={14} />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={startRecording}
      disabled={disabled}
      className="w-9 h-9 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-secondary/80 transition-colors"
      title={t("audio_message")}
    >
      <Mic size={16} />
    </motion.button>
  );
};

export default AudioRecorder;
