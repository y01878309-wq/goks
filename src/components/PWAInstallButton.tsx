import React, { useState } from 'react';
import { Download, Check, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  isAr?: boolean;
  onOpenGuide?: () => void;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  isAr = true,
  onOpenGuide,
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed, show subtle badge or return null
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold shadow-sm transition animate-pulse hover:animate-none ${className}`}
        title={isAr ? 'تثبيت التطبيق على جهازك' : 'Install app on your device'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isAr ? 'تثبيت التطبيق' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => (onOpenGuide ? onOpenGuide() : setShowIOSModal(true))}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#00a884]/15 hover:bg-[#00a884]/25 text-[#00a884] text-xs font-semibold border border-[#00a884]/30 transition ${className}`}
          title={isAr ? 'تثبيت على الآيفون' : 'Install on iOS'}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isAr ? 'تثبيت على الآيفون' : 'Install on iPhone'}</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#222e35] p-5 shadow-2xl border border-black/10 dark:border-white/10"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <h3 className="text-base font-bold text-[#111b21] dark:text-[#e9edef]">
                {isAr ? 'تثبيت التطبيق على الآيفون والآيباد' : 'Install on iPhone & iPad'}
              </h3>
              <p className="mt-3 text-xs text-[#667781] dark:text-[#8696a0] leading-relaxed">
                {isAr ? (
                  <>
                    1. اضغط على زر <strong>المشاركة (Share ⎋)</strong> في أسفل شاشة Safari.<br />
                    2. مرر للأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen ⊞)</strong>.<br />
                    3. اضغط على <strong>إضافة (Add)</strong> بالأعلى لتثبيت التطبيق فوراً.
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> icon in Safari toolbar.<br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                    3. Tap <strong>Add</strong> to finish installing.
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-4 w-full rounded-lg bg-[#00a884] py-2 text-xs font-bold text-white hover:bg-[#008f6f] transition"
              >
                {isAr ? 'فهمت' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button to open the full guide
  return (
    <button
      onClick={() => onOpenGuide && onOpenGuide()}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#667781] dark:text-[#8696a0] hover:text-[#00a884] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium transition ${className}`}
      title={isAr ? 'تحميل أو نشر التطبيق' : 'Download or publish app'}
    >
      <Download className="w-3.5 h-3.5 text-[#00a884]" />
      <span className="hidden sm:inline">{isAr ? 'تنزيل / نشر' : 'Download / Publish'}</span>
    </button>
  );
};
