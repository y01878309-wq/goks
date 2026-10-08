import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Send, Mic } from 'lucide-react';
import { playRecordStartSound } from '../utils/soundEffects';

interface VoiceRecorderProps {
  onCancel: () => void;
  onSend: (audioData: { duration: number; blobUrl?: string; waveform: number[] }) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onCancel, onSend }) => {
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    playRecordStartSound();

    // Start timer
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Attempt real audio recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          mediaRecorder.start();
        })
        .catch(() => {
          // If microphone permission is blocked or unavailable, recording proceeds in simulated waveform mode
        });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinishAndSend = () => {
    const finalDuration = Math.max(1, seconds);
    // Generate realistic randomized wave bars
    const waveform = Array.from({ length: 22 }, () => Math.floor(Math.random() * 70) + 25);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const blobUrl = URL.createObjectURL(audioBlob);
        onSend({ duration: finalDuration, blobUrl, waveform });
      };
      mediaRecorderRef.current.stop();
    } else {
      onSend({ duration: finalDuration, waveform });
    }
  };

  const handleCancel = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onCancel();
  };

  return (
    <div className="flex items-center justify-between w-full h-11 px-3 bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl border border-emerald-500/30 animate-in fade-in duration-200">
      {/* Delete / Cancel button */}
      <button
        type="button"
        onClick={handleCancel}
        className="p-2 text-[#8696a0] hover:text-red-500 hover:bg-red-500/10 rounded-full transition"
        title="إلغاء التسجيل"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Recording indicator & timer */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] font-mono">
            {formatTimer(seconds)}
          </span>
        </div>

        {/* Live Audio bars simulation */}
        <div className="flex items-center gap-1 h-5 px-2">
          {[40, 75, 90, 50, 85, 60, 95, 45, 70].map((h, i) => (
            <div
              key={i}
              style={{
                height: `${Math.max(6, Math.min(22, (h * (seconds % 2 === 0 ? 0.8 : 1.2))))}px`,
              }}
              className="w-[2.5px] bg-[#00a884] rounded-full transition-all duration-300 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Send voice note */}
      <button
        type="button"
        onClick={handleFinishAndSend}
        className="w-9 h-9 rounded-full bg-[#00a884] text-white hover:bg-[#008f6f] flex items-center justify-center shadow-md active:scale-95 transition"
        title="إرسال التسجيل الصوتي"
      >
        <Send className="w-4 h-4 -rotate-45 translate-x-[-1px]" />
      </button>
    </div>
  );
};
