import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Smartphone,
  Globe,
  Laptop,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  QrCode,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAr?: boolean;
}

export const InstallPublishModal: React.FC<InstallPublishModalProps> = ({
  isOpen,
  onClose,
  isAr = true,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'publish' | 'apk' | 'offline'>('install');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://whatsapp-web-clone.app';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isAr ? 'واتساب ويب - WhatsApp Web' : 'WhatsApp Web Clone',
          text: isAr
            ? 'جرب تطبيق واتساب ويب المتكامل مع دعم رقم الهاتف والمميزات الذهبية!'
            : 'Try this WhatsApp Web application with phone verification and gold features!',
          url: currentUrl,
        });
      } catch {
        // Share cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCommand(id);
      setTimeout(() => setCopiedCommand(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#ffffff] dark:bg-[#222e35] text-[#111b21] dark:text-[#e9edef] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10 bg-[#f0f2f5] dark:bg-[#111b21]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00a884] to-[#25d366] flex items-center justify-center text-white shadow-md shadow-[#00a884]/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isAr ? 'تثبيت وتحميل ونشر التطبيق' : 'Install, Download & Publish App'}
              </h2>
              <p className="text-xs text-[#667781] dark:text-[#8696a0]">
                {isAr
                  ? 'تشغيل التطبيق على هاتفك أو كمبيوترك ومشاركته مع أي شخص'
                  : 'Run on your phone, PC or share with anyone'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#667781] dark:text-[#8696a0] transition"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-4 bg-[#f8f9fa] dark:bg-[#182229] border-b border-black/5 dark:border-white/5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'install'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            {isAr ? '📲 التثبيت على جهازك (موبايل/كمبيوتر)' : '📲 Install on Device'}
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'publish'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
            }`}
          >
            <Globe className="w-4 h-4" />
            {isAr ? '🌐 النشر والمشاركة مجاناً' : '🌐 Publish & Share Online'}
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'apk'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
            }`}
          >
            <Package className="w-4 h-4" />
            {isAr ? '🤖 تحويل إلى ملف APK للأندرويد' : '🤖 Convert to Android APK'}
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'offline'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
            }`}
          >
            <Layers className="w-4 h-4" />
            {isAr ? '💻 تشغيل الكود محلياً' : '💻 Run Source Locally'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: INSTALL ON DEVICE */}
          {activeTab === 'install' && (
            <div className="space-y-6">
              {/* Direct Install Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#00a884]/15 to-[#25d366]/15 border border-[#00a884]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00a884] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#00a884]">
                      {isAr ? 'تطبيق ويب تقدمي (PWA) جاهز للتثبيت' : 'Progressive Web App (PWA) Ready'}
                    </h3>
                    <p className="text-xs text-[#667781] dark:text-[#8696a0] mt-0.5">
                      {isInstalled
                        ? isAr
                          ? '✅ التطبيق مثبت بالفعل ويعمل كنافذة مستقلة على جهازك!'
                          : '✅ App is already installed and running standalone!'
                        : isAr
                        ? 'يمكنك تثبيته بنقرة واحدة ليفتح كبرنامج حقيقي بأيقونة على شاشتك وبدون شريط متصفح.'
                        : 'Install with 1-click to launch with a home screen icon and no browser bar.'}
                    </p>
                  </div>
                </div>

                {!isInstalled && isInstallable && (
                  <button
                    onClick={install}
                    className="px-4 py-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-xs rounded-lg shadow-md transition flex items-center justify-center gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    {isAr ? 'تثبيت التطبيق الآن' : 'Install App Now'}
                  </button>
                )}

                {isInstalled && (
                  <span className="px-3 py-1.5 bg-[#00a884]/20 text-[#00a884] text-xs font-bold rounded-lg border border-[#00a884]/30 flex items-center gap-1.5 shrink-0">
                    <Check className="w-4 h-4" />
                    {isAr ? 'مثبت بنجاح' : 'Installed'}
                  </span>
                )}
              </div>

              {/* Step-by-step instructions by platform */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Android / Chrome */}
                <div className="p-4 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00a884]">
                    <Smartphone className="w-4 h-4" />
                    <h4>{isAr ? '📱 هواتف أندرويد (Android)' : '📱 Android Devices'}</h4>
                  </div>
                  <ol className="text-xs text-[#3b4a54] dark:text-[#d1d7db] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>
                      {isAr
                        ? 'افتح الرابط في متصفح Google Chrome على هاتفك.'
                        : 'Open the URL in Chrome on your phone.'}
                    </li>
                    <li>
                      {isAr
                        ? 'اضغط على زر الخيارات (⋮) أعلى يمين أو يسار المتصفح.'
                        : 'Tap the (⋮) menu icon at top.'}
                    </li>
                    <li>
                      {isAr
                        ? 'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية" (Install App / Add to Home screen).'
                        : 'Select "Install app" or "Add to Home screen".'}
                    </li>
                    <li>
                      {isAr
                        ? 'سيظهر تطبيق "واتساب" بأيقونته الخضراء على شاشة هاتفك الرئيسية كأي تطبيق أصلي!'
                        : 'The WhatsApp icon will be added to your home screen!'}
                    </li>
                  </ol>
                </div>

                {/* iPhone / iOS Safari */}
                <div className="p-4 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00a884]">
                    <Smartphone className="w-4 h-4" />
                    <h4>{isAr ? '🍏 هواتف آيفون وآيباد (iPhone / iPad)' : '🍏 iPhone & iPad (iOS)'}</h4>
                  </div>
                  <ol className="text-xs text-[#3b4a54] dark:text-[#d1d7db] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>
                      {isAr
                        ? 'افتح الرابط في متصفح Safari الأساسي.'
                        : 'Open the link in Apple Safari.'}
                    </li>
                    <li>
                      {isAr
                        ? 'اضغط على زر المشاركة (Share ⎋) أسفل الشاشة.'
                        : 'Tap the Share icon at the bottom.'}
                    </li>
                    <li>
                      {isAr
                        ? 'مرر للأسفل واضغط على "إضافة إلى الصفحة الرئيسية" (Add to Home Screen ⊞).'
                        : 'Scroll and tap "Add to Home Screen".'}
                    </li>
                    <li>
                      {isAr
                        ? 'اضغط "إضافة" (Add) لتثبيت التطبيق مباشرة!'
                        : 'Tap "Add" in the top right to finish!'}
                    </li>
                  </ol>
                </div>

                {/* Windows / Mac PC */}
                <div className="p-4 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00a884]">
                    <Laptop className="w-4 h-4" />
                    <h4>{isAr ? '💻 أجهزة الكمبيوتر (Windows / Mac)' : '💻 Desktop Computers'}</h4>
                  </div>
                  <p className="text-xs text-[#3b4a54] dark:text-[#d1d7db] leading-relaxed">
                    {isAr
                      ? 'في متصفح Chrome أو Edge، ستلاحظ ظهور أيقونة كمبيوتر صغيرة أو علامة (+) بجوار شريط العنوان. اضغط عليها واختر "تثبيت" ليعمل التطبيق في نافذة مستقلة وسريعة مثل برنامج واتساب للكمبيوتر الأصلي، ويثبت في شريط المهام (Taskbar) أو قائمة Start.'
                      : 'In Chrome or Edge, click the install icon in the URL address bar to install as a standalone desktop application in your taskbar.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PUBLISH & SHARE */}
          {activeTab === 'publish' && (
            <div className="space-y-6">
              {/* Share Active Link */}
              <div className="p-4 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-[#00a884] flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  {isAr ? 'مشاركة رابط التطبيق الحالي فوراً' : 'Share current app link'}
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-white dark:bg-[#202c33] border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-[#667781] dark:text-[#8696a0] select-all outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {isAr ? 'مشاركة' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Free hosting options */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#667781] dark:text-[#8696a0]">
                  {isAr ? 'أفضل وأسهل طرق النشر المجانية (Deployment)' : 'Free 1-Click Hosting Options'}
                </h4>

                {/* Option 1: Vercel */}
                <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#00a884] transition bg-white dark:bg-[#111b21] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">▲ Vercel (الأسهل والأسرع)</span>
                      <span className="text-[10px] bg-green-500/15 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
                        مجاني 100%
                      </span>
                    </div>
                    <p className="text-xs text-[#667781] dark:text-[#8696a0]">
                      {isAr
                        ? 'ارفع الكود على GitHub ثم ادخل vercel.com واضغط Import. سيعطيك رابط https فوري ومجاني مدى الحياة.'
                        : 'Push code to GitHub, import to Vercel, and get a fast custom URL instantly.'}
                    </p>
                  </div>
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#00a884] hover:underline flex items-center gap-1 shrink-0"
                  >
                    vercel.com
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Option 2: Netlify Drop */}
                <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#00a884] transition bg-white dark:bg-[#111b21] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">🌐 Netlify Drop (بدون كتابة سطر كود)</span>
                      <span className="text-[10px] bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
                        سحب وإفلات
                      </span>
                    </div>
                    <p className="text-xs text-[#667781] dark:text-[#8696a0]">
                      {isAr
                        ? 'قم بعمل بناء للمشروع (npm run build) واسحب مجلد dist مباشرة داخل موقع app.netlify.com/drop لينشر في ثوانٍ!'
                        : 'Run npm run build and drag-and-drop the dist folder to app.netlify.com/drop.'}
                    </p>
                  </div>
                  <a
                    href="https://app.netlify.com/drop"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#00a884] hover:underline flex items-center gap-1 shrink-0"
                  >
                    netlify.com/drop
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Option 3: GitHub Pages */}
                <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#00a884] transition bg-white dark:bg-[#111b21] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-sm">🐙 GitHub Pages</span>
                    <p className="text-xs text-[#667781] dark:text-[#8696a0]">
                      {isAr
                        ? 'استضافة مجانية مباشرة على مستودع GitHub الخاص بك برابط username.github.io/repo.'
                        : 'Free hosting directly from your GitHub repository with GitHub Actions.'}
                    </p>
                  </div>
                  <a
                    href="https://pages.github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#00a884] hover:underline flex items-center gap-1 shrink-0"
                  >
                    pages.github.com
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONVERT TO APK */}
          {activeTab === 'apk' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <Package className="w-5 h-5" />
                  <h3>{isAr ? 'تحويل التطبيق إلى ملف APK لهواتف أندرويد' : 'Convert Web App to Android APK'}</h3>
                </div>
                <p className="text-xs text-[#667781] dark:text-[#8696a0] leading-relaxed">
                  {isAr
                    ? 'بما أن التطبيق تم تصميمه كـ Progressive Web App معتمد، يمكنك تحويله إلى ملف APK حقيقي في دقائق معدودة بدون الحاجة لتعلم برمجة الأندرويد.'
                    : 'Because the app is a fully compliant PWA, you can generate a signed APK in minutes.'}
                </p>
              </div>

              {/* Method 1: PWABuilder (Microsoft) */}
              <div className="p-4 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#00a884] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {isAr ? 'الطريقة 1: أداة PWABuilder المجانية (أسهل طريقة)' : 'Method 1: PWABuilder (Easiest)'}
                  </h4>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#00a884] flex items-center gap-1 hover:underline"
                  >
                    pwabuilder.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ol className="text-xs text-[#3b4a54] dark:text-[#d1d7db] space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    {isAr
                      ? 'انشر التطبيق على Vercel أو Netlify لتحصل على رابط (URL) عام.'
                      : 'Deploy your app to get a public URL.'}
                  </li>
                  <li>
                    {isAr
                      ? 'ادخل موقع pwabuilder.com وضع رابط موقعك.'
                      : 'Visit pwabuilder.com and paste your URL.'}
                  </li>
                  <li>
                    {isAr
                      ? 'اضغط على "Package for Android" ثم اختر "Generate APK / AAB".'
                      : 'Click "Package for Android" and choose "Generate APK".'}
                  </li>
                  <li>
                    {isAr
                      ? 'ستحصل على ملف APK يمكنك تثبيته فوراً على أي هاتف أو رفعه على متجر Google Play!'
                      : 'Download the APK file and install it directly on any Android device!'}
                  </li>
                </ol>
              </div>

              {/* Method 2: Capacitor */}
              <div className="p-4 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-[#00a884] flex items-center gap-2">
                  <Laptop className="w-4 h-4" />
                  {isAr ? 'الطريقة 2: استخدام Ionic Capacitor (للمطورين)' : 'Method 2: Ionic Capacitor (Developers)'}
                </h4>
                <p className="text-xs text-[#667781] dark:text-[#8696a0]">
                  {isAr
                    ? 'نفذ هذه الأوامر في مجلد المشروع لتحويله إلى تطبيق أندرويد و iOS باستخدام أندرويد ستوديو:'
                    : 'Run these commands in your project to build native Android/iOS apps:'}
                </p>
                <div className="p-3 bg-black/90 text-green-400 font-mono text-[11px] rounded-lg space-y-1 overflow-x-auto relative">
                  <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                  <div>npx cap init "واتساب ويب" com.whatsapp.gold</div>
                  <div>npm run build</div>
                  <div>npx cap add android</div>
                  <div>npx cap open android</div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init "WhatsApp Web" com.whatsapp.gold\nnpm run build\nnpx cap add android\nnpx cap open android',
                        'cap'
                      )
                    }
                    className="absolute top-2 end-2 p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition"
                    title={isAr ? 'نسخ الأوامر' : 'Copy'}
                  >
                    {copiedCommand === 'cap' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RUN LOCALLY */}
          {activeTab === 'offline' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] border border-black/5 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-[#00a884]">
                  {isAr ? 'تشغيل المشروع على جهازك (Node.js)' : 'Run Project with Node.js'}
                </h4>
                <p className="text-xs text-[#667781] dark:text-[#8696a0]">
                  {isAr
                    ? 'إذا أردت تشغيل المشروع وتعديل كوده على جهاز الكمبيوتر الخاص بك، اتبع الخطوات التالية:'
                    : 'Follow these steps to run and edit the project locally on your machine:'}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-black/90 text-gray-200 font-mono rounded-lg relative">
                    <span className="text-[#8696a0]"># 1. تثبيت الحزم والمكتبات</span>
                    <div className="text-green-400 mt-1">npm install</div>
                  </div>
                  <div className="p-3 bg-black/90 text-gray-200 font-mono rounded-lg relative">
                    <span className="text-[#8696a0]"># 2. تشغيل السيرفر المحلي للتطوير</span>
                    <div className="text-green-400 mt-1">npm run dev</div>
                    <span className="text-[#8696a0] block mt-1">
                      {isAr ? 'يفتح الموقع على http://localhost:3000' : 'Runs on http://localhost:3000'}
                    </span>
                  </div>
                  <div className="p-3 bg-black/90 text-gray-200 font-mono rounded-lg relative">
                    <span className="text-[#8696a0]"># 3. بناء نسخة الإنتاج الجاهزة للنشر</span>
                    <div className="text-green-400 mt-1">npm run build</div>
                    <span className="text-[#8696a0] block mt-1">
                      {isAr ? 'ينشئ مجلد dist الكامل والجاهز للرفع على أي استضافة' : 'Outputs ready-to-deploy dist folder'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f0f2f5] dark:bg-[#111b21] border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#667781] dark:text-[#8696a0]">
            <ShieldCheck className="w-4 h-4 text-[#00a884]" />
            <span>
              {isAr ? 'تطبيق آمن ويدعم العمل في وضع عدم الاتصال (Offline)' : 'Secure & works offline'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold rounded-lg transition"
          >
            {isAr ? 'تم، حسناً' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
