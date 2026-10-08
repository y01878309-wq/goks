import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC<{ isAr?: boolean }> = ({ isAr = true }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="fixed bottom-4 end-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-bounce"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <WifiOff className="w-4 h-4" />
      <span>
        {isAr
          ? 'وضع عدم الاتصال — يعمل التطبيق من الذاكرة المخزنة (Offline)'
          : 'Offline Mode — Cached data is in use.'}
      </span>
    </div>
  );
};
