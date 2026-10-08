import React, { useState } from 'react';
import { X, Moon, Sun, Volume2, Globe, Palette, User, Check, Sparkles, BarChart2, Sliders, Smartphone, ShieldCheck, LogOut, Download, Share2 } from 'lucide-react';
import { UserProfile, WallpaperTheme, Message, Chat } from '../types';
import { UsageStatistics } from './UsageStatistics';

interface SettingsModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  isDarkMode: boolean;
  wallpaperTheme: WallpaperTheme;
  soundEnabled: boolean;
  language: 'ar' | 'en';
  messages?: Record<string, Message[]>;
  chats?: Chat[];
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onToggleTheme: () => void;
  onSelectWallpaper: (theme: WallpaperTheme) => void;
  onToggleSound: () => void;
  onToggleLanguage: (lang: 'ar' | 'en') => void;
  onOpenPhoneAuth?: () => void;
  onLogout?: () => void;
  onOpenInstallPublish?: () => void;
}

const WALLPAPERS: { id: WallpaperTheme; nameAr: string; nameEn: string; color: string }[] = [
  { id: 'classic-dark', nameAr: 'نمط واتساب الداكن التقليدي', nameEn: 'Classic Dark Pattern', color: '#0b141a' },
  { id: 'classic-light', nameAr: 'نمط واتساب الفاتح الأصلي', nameEn: 'Classic Light Pattern', color: '#efeae2' },
  { id: 'emerald', nameAr: 'زمردي عميق', nameEn: 'Deep Emerald', color: '#062e26' },
  { id: 'midnight', nameAr: 'سماء منتصف الليل', nameEn: 'Midnight Slate', color: '#111b21' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  isDarkMode,
  wallpaperTheme,
  soundEnabled,
  language,
  messages = {},
  chats = [],
  onClose,
  onUpdateProfile,
  onToggleTheme,
  onSelectWallpaper,
  onToggleSound,
  onToggleLanguage,
  onOpenPhoneAuth,
  onLogout,
  onOpenInstallPublish,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'statistics'>('general');
  const [name, setName] = useState(currentUser.name);
  const [about, setAbout] = useState(currentUser.about);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: name.trim() || currentUser.name, about: about.trim() || currentUser.about });
  };

  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#202c33] rounded-2xl w-full max-w-xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-[#111b21] dark:text-[#e9edef]">
              {isAr ? 'الإعدادات' : 'Settings'}
            </h3>
            {activeTab === 'statistics' && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00a884]/15 text-[#00a884] font-bold">
                {isAr ? 'إحصائيات الاستخدام' : 'Usage Stats'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-black/5 dark:border-white/5 px-4 pt-2 gap-2 bg-[#f9fafb] dark:bg-[#1b252b]">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'general'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isAr ? 'الإعدادات العامة' : 'General Settings'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition relative ${
              activeTab === 'statistics'
                ? 'border-[#00a884] text-[#00a884]'
                : 'border-transparent text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>{isAr ? 'إحصائيات الاستخدام والوسائط' : 'Usage Statistics'}</span>
            <span className="w-2 h-2 rounded-full bg-[#00a884] animate-pulse" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'statistics' ? (
            <UsageStatistics messages={messages} chats={chats} isAr={isAr} />
          ) : (
            <div className="space-y-6">
              {/* User Profile Section */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <h4 className="text-xs font-bold text-[#00a884] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{isAr ? 'الملف الشخصي' : 'Profile'}</span>
                </h4>

                <div className="flex items-center gap-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? 'اسمك' : 'Your name'}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#f0f2f5] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] border border-transparent focus:border-[#00a884] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder={isAr ? 'الأخبار' : 'About'}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#f0f2f5] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] border border-transparent focus:border-[#00a884] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="text-xs font-semibold px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#008f6f] transition"
                >
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </form>

              {/* Phone Number Authentication Section */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                        {isAr ? 'رقم الهاتف المرتبط بالمنصة' : 'Authenticated Phone Number'}
                      </span>
                      <span className="text-sm font-mono font-bold text-[#111b21] dark:text-white" dir="ltr">
                        {currentUser.phone || '+20 100 123 4567'}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{isAr ? 'موثق ونشط' : 'Verified'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-amber-500/20">
                  {onOpenPhoneAuth && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPhoneAuth();
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تغيير رقم الهاتف / ربط جديد' : 'Change / Link New Phone'}</span>
                    </button>
                  )}
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Install & Publish App Section */}
              {onOpenInstallPublish && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#00a884]/10 via-[#25d366]/10 to-transparent border border-[#00a884]/25 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#00a884]" />
                      <span className="text-xs font-bold text-[#111b21] dark:text-[#e9edef]">
                        {isAr ? 'تثبيت وتحميل ونشر التطبيق' : 'Install, Download & Publish'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667781] dark:text-[#8696a0]">
                      {isAr
                        ? 'تثبيت كبرنامج على الموبايل والكمبيوتر، تحويل لـ APK، أو النشر المجاني'
                        : 'Install as app on phone/PC, build APK, or publish online'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenInstallPublish();
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'عرض الطرق' : 'View Options'}</span>
                  </button>
                </div>
              )}

              {/* Appearance & Wallpaper */}
              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <h4 className="text-xs font-bold text-[#00a884] uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>{isAr ? 'المظهر وخلفية المحادثة' : 'Appearance & Wallpaper'}</span>
                </h4>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <span className="text-sm text-[#111b21] dark:text-[#e9edef]">
                      {isAr ? 'الوضع الليلي (Dark Mode)' : 'Dark Mode'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      isDarkMode ? 'bg-[#00a884]' : 'bg-[#8696a0]/30'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        isDarkMode ? 'start-6' : 'start-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Wallpaper choices */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {WALLPAPERS.map((wp) => (
                    <div
                      key={wp.id}
                      onClick={() => onSelectWallpaper(wp.id)}
                      style={{ backgroundColor: wp.color }}
                      className={`p-3 rounded-xl cursor-pointer border transition flex items-center justify-between ${
                        wallpaperTheme === wp.id
                          ? 'border-[#00a884] ring-2 ring-[#00a884]/40'
                          : 'border-white/10 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span className="text-xs font-medium text-white truncate drop-shadow-xs">
                        {isAr ? wp.nameAr : wp.nameEn}
                      </span>
                      {wallpaperTheme === wp.id && (
                        <Check className="w-4 h-4 text-[#00a884] bg-white rounded-full p-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sound & Notifications */}
              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <h4 className="text-xs font-bold text-[#00a884] uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>{isAr ? 'الأصوات والتنبيهات' : 'Sounds & Notifications'}</span>
                </h4>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#111b21] dark:text-[#e9edef]">
                    {isAr ? 'تشغيل نغمات الرسائل والمكالمات' : 'Play message & call sounds'}
                  </span>
                  <button
                    type="button"
                    onClick={onToggleSound}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      soundEnabled ? 'bg-[#00a884]' : 'bg-[#8696a0]/30'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        soundEnabled ? 'start-6' : 'start-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <h4 className="text-xs font-bold text-[#00a884] uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{isAr ? 'لغة التطبيق' : 'App Language'}</span>
                </h4>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleLanguage('ar')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                      language === 'ar'
                        ? 'border-[#00a884] bg-[#00a884]/10 text-[#00a884]'
                        : 'border-black/10 dark:border-white/10 text-[#8696a0]'
                    }`}
                  >
                    العربية (RTL)
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleLanguage('en')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                      language === 'en'
                        ? 'border-[#00a884] bg-[#00a884]/10 text-[#00a884]'
                        : 'border-black/10 dark:border-white/10 text-[#8696a0]'
                    }`}
                  >
                    English (LTR)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
