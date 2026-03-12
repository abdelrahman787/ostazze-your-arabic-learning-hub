import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface AudioRecorderProps {
  onRecorded: (audioUrl: string) => void;
  disabled?: boolean;
  userId: string;
  lectureId: string;
}

const AudioRecorder = ({ onRecorded, disabled, userId, lectureId }: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(timerRef.current);
        setDuration(0);

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size === 0) return;

        setUploading(true);
        const fileName = `${userId}/${lectureId}_${Date.now()}.webm`;
        const { error } = await supabase.storage.from("chat-audio").upload(fileName, blob);

        if (!error) {
          const { data: urlData } = supabase.storage.from("chat-audio").getPublicUrl(fileName);
          onRecorded(urlData.publicUrl);
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
      title="تسجيل صوتي"
    >
      <Mic size={16} />
    </motion.button>
  );
};

export default AudioRecorder;
