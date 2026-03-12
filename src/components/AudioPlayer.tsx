import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  isMe: boolean;
}

const AudioPlayer = ({ src, isMe }: AudioPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
        }}
        onEnded={() => { setPlaying(false); setProgress(0); }}
      />
      <button
        onClick={toggle}
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
