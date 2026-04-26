import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { getSignedFileUrl } from "@/lib/storageUrls";

interface AudioPlayerProps {
  src: string;
  isMe: boolean;
}

const AudioPlayer = ({ src, isMe }: AudioPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Resolve a signed URL for the chat-audio bucket (or use src as-is if it's already a full URL)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = await getSignedFileUrl("chat-audio", src, 3600);
      if (!cancelled) setResolvedSrc(url || src);
    })();
    return () => { cancelled = true; };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      {resolvedSrc && (
        <audio
          ref={audioRef}
          src={resolvedSrc}
          preload="metadata"
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onTimeUpdate={() => {
            const a = audioRef.current;
            if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
          }}
          onEnded={() => { setPlaying(false); setProgress(0); }}
        />
      )}
      <button
        onClick={toggle}
        disabled={!resolvedSrc}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isMe ? "bg-primary-foreground/20 text-primary-foreground" : "bg-foreground/10 text-foreground"
        }`}
      >
        {playing ? <Pause size={12} /> : <Play size={12} className="mr-[-1px]" />}
      </button>
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isMe ? "bg-primary-foreground/60" : "bg-primary/60"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`text-[0.6rem] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {formatTime(playing ? (audioRef.current?.currentTime || 0) : duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
