import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  duration?: number;
  waveform?: number[];
  audioBlobUrl?: string;
  isMe?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  duration = 18,
  waveform = [20, 40, 60, 30, 80, 50, 70, 90, 40, 60, 85, 30, 70, 45, 90, 60, 30, 50, 80, 40],
  audioBlobUrl,
  isMe = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // If we have an actual recorded blob URL
  useEffect(() => {
    if (audioBlobUrl) {
      const audio = new Audio(audioBlobUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [audioBlobUrl]);

  // Synthetic playhead timer if no real audio blob
  useEffect(() => {
    if (!audioBlobUrl) {
      if (isPlaying) {
        const interval = 100 / playbackSpeed;
        timerRef.current = window.setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              setIsPlaying(false);
              return 0;
            }
            return prev + 0.1;
          });
        }, interval);
      } else if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPlaying, playbackSpeed, duration, audioBlobUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds: (1 | 1.5 | 2)[] = [1, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-1 px-1 min-w-[240px] max-w-[280px]">
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          isMe
            ? 'bg-[#00a884] text-white hover:bg-[#008f6f]'
            : 'bg-[#00a884] text-white hover:bg-[#008f6f]'
        }`}
        title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-white" />
        ) : (
          <Play className="w-4 h-4 fill-white translate-x-[1px]" />
        )}
      </button>

      {/* Waveform and progress */}
      <div className="flex-1 flex flex-col justify-center gap-1">
        <div
          className="flex items-center gap-[2.5px] h-7 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const newTime = clickPos * duration;
            setCurrentTime(newTime);
            if (audioRef.current) {
              audioRef.current.currentTime = newTime;
            }
          }}
        >
          {waveform.map((height, i) => {
            const barPercent = (i / waveform.length) * 100;
            const isPassed = barPercent <= progressPercent;
            return (
              <div
                key={i}
                style={{ height: `${Math.max(15, (height / 100) * 26)}px` }}
                className={`w-[3px] rounded-full transition-all duration-150 ${
                  isPassed
                    ? isMe ? 'bg-[#111b21] dark:bg-white' : 'bg-[#00a884]'
                    : isMe ? 'bg-[#8696a0]' : 'bg-[#8696a0]/60'
                }`}
              />
            );
          })}
        </div>

        {/* Time and Speed */}
        <div className="flex items-center justify-between text-[11px] text-[#8696a0] font-sans">
          <span>{isPlaying ? formatTime(currentTime) : formatTime(duration)}</span>
          <button
            type="button"
            onClick={handleSpeedChange}
            className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 transition"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </div>
  );
};
