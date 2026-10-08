import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { RingtonePlayer } from '../utils/soundEffects';

interface CallModalProps {
  contactName: string;
  contactAvatar: string;
  isVideo: boolean;
  onEndCall: (duration: number) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  contactName,
  contactAvatar,
  isVideo,
  onEndCall,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideo);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const ringtoneRef = useRef<RingtonePlayer | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Start ringtone
    const player = new RingtonePlayer();
    ringtoneRef.current = player;
    player.start();

    // Auto connect after 3 seconds for realistic simulation
    const connectTimer = window.setTimeout(() => {
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
      }
      setCallStatus('connected');
    }, 2800);

    // If video call requested, request camera stream
    if (isVideo) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Camera not available or denied
          });
      }
    }

    return () => {
      clearTimeout(connectTimer);
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isVideo]);

  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEnd = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    onEndCall(duration);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111b21] flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-200">
      {/* Background or video feed */}
      {isVideoEnabled ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1] opacity-70 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#0b141a]/95 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[300px] rounded-full bg-[#00a884]/5 blur-3xl" />
        </div>
      )}

      {/* Top Details */}
      <div className="relative z-10 flex flex-col items-center text-center mt-8 space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">{contactName}</h2>
        <p className="text-sm text-[#00a884] font-medium">
          {callStatus === 'ringing'
            ? 'جاري الاتصال...'
            : `${isVideo ? 'مكالمة فيديو مشفرة تماماً' : 'مكالمة صوتية'} · ${formatTimer(duration)}`}
        </p>
      </div>

      {/* Middle Avatar (if audio or camera off) */}
      <div className="relative z-10 flex flex-col items-center my-auto">
        <div className="relative">
          <img
            src={contactAvatar}
            alt={contactName}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 shadow-2xl transition duration-500 ${
              callStatus === 'ringing'
                ? 'border-[#00a884] animate-pulse ring-8 ring-[#00a884]/20'
                : 'border-white/20'
            }`}
          />
          {callStatus === 'ringing' && (
            <span className="absolute -bottom-2 start-1/2 -translate-x-1/2 bg-[#00a884] text-white text-[11px] px-3 py-0.5 rounded-full font-medium whitespace-nowrap shadow">
              رنين...
            </span>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 mb-4">
        <div className="flex items-center justify-center gap-5 sm:gap-6 bg-black/40 backdrop-blur-md py-3.5 px-6 rounded-full border border-white/10 shadow-xl">
          {/* Mute mic */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition active:scale-95 ${
              isMuted ? 'bg-red-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
            title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            type="button"
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition active:scale-95 ${
              !isVideoEnabled ? 'bg-red-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
            title={isVideoEnabled ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Speaker toggle */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition active:scale-95 ${
              isSpeakerOn ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-black/50 text-white/50'
            }`}
            title={isSpeakerOn ? 'مكبر الصوت يعمل' : 'إيقاف مكبر الصوت'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={handleEnd}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-90 transition"
            title="إنهاء المكالمة"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
