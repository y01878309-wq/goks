import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Send, Heart, Download, EyeOff, Check } from 'lucide-react';
import { StatusStory } from '../types';

interface StatusViewerProps {
  statuses: StatusStory[];
  initialIndex?: number;
  onClose: () => void;
  onReplyToStatus: (userId: string, userName: string, replyText: string) => void;
}

export const StatusViewer: React.FC<StatusViewerProps> = ({
  statuses,
  initialIndex = 0,
  onClose,
  onReplyToStatus,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentStory = statuses[currentIndex];

  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  useEffect(() => {
    if (!currentStory || isPaused) return;

    const interval = 50; // update every 50ms
    const totalDuration = 5000; // 5 seconds per status
    const increment = (interval / totalDuration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < statuses.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, statuses.length, onClose, currentStory]);

  if (!currentStory) return null;

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplyToStatus(currentStory.userId, currentStory.userName, `رداً على الحالة: "${replyText.trim()}"`);
    setReplyText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-4 sm:p-6 select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Top Header & Progress bars */}
      <div className="w-full max-w-xl z-20 space-y-3">
        {/* Progress bars */}
        <div className="flex items-center gap-1.5 w-full">
          {statuses.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    i < currentIndex
                      ? '100%'
                      : i === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* User bar */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
            />
            <div>
              <h4 className="font-semibold text-sm leading-tight">
                {currentStory.userName}
              </h4>
              <span className="text-xs text-white/70">{currentStory.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ghost View Badge */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[11px] font-semibold"
              title="مشاهدة مخفية: لن يظهر اسمك لصاحب الحالة"
            >
              <EyeOff className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">مشاهدة مخفية</span>
            </div>

            {/* Download Status Button */}
            <button
              type="button"
              onClick={() => {
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 2500);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition text-white flex items-center gap-1.5 text-xs font-bold"
              title="تحميل الحالة وحفظها في المعرض"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-400">تم الحفظ!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">تحميل</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Story Content Container */}
      <div className="relative w-full max-w-xl flex-1 flex items-center justify-center my-4 overflow-hidden rounded-2xl">
        {/* Tap areas for next / previous */}
        <div
          onClick={handlePrev}
          className="absolute inset-y-0 start-0 w-1/3 z-10 cursor-pointer"
        />
        <div
          onClick={handleNext}
          className="absolute inset-y-0 end-0 w-1/3 z-10 cursor-pointer"
        />

        {/* Left / Right chevron indicators */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute start-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 hidden sm:block"
          >
            <ChevronRight className="w-6 h-6 rtl:hidden" />
            <ChevronLeft className="w-6 h-6 ltr:hidden" />
          </button>
        )}
        {currentIndex < statuses.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute end-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 hidden sm:block"
          >
            <ChevronLeft className="w-6 h-6 rtl:hidden" />
            <ChevronRight className="w-6 h-6 ltr:hidden" />
          </button>
        )}

        {/* Content Type */}
        {currentStory.type === 'image' ? (
          <img
            src={currentStory.content}
            alt="Status"
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200"
          />
        ) : (
          <div
            style={{ backgroundColor: currentStory.bgColor || '#128c7e' }}
            className="w-full h-full min-h-[360px] flex items-center justify-center p-8 rounded-2xl shadow-2xl"
          >
            <p className="text-white text-xl sm:text-2xl font-bold text-center leading-relaxed font-sans">
              {currentStory.content}
            </p>
          </div>
        )}
      </div>

      {/* Reply bar at bottom */}
      <div className="w-full max-w-xl z-20">
        <form
          onSubmit={handleSendReply}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 px-3 rounded-full border border-white/20"
        >
          <input
            type="text"
            placeholder="الرد على الحالة..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/60 focus:outline-none px-2"
          />
          <button
            type="button"
            onClick={() => {
              onReplyToStatus(currentStory.userId, currentStory.userName, '❤️');
              onClose();
            }}
            className="p-1.5 text-white/80 hover:text-red-400 transition"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </button>
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="p-2 rounded-full bg-[#00a884] text-white disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4 -rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
};
