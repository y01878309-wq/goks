import React, { useState } from 'react';
import {
  X,
  Shield,
  Eye,
  EyeOff,
  CheckCheck,
  Check,
  Mic,
  PenTool,
  Clock,
  Trash2,
  Lock,
  Wifi,
  Sparkles,
  Share2,
} from 'lucide-react';
import { GoldPrivacySettings } from '../types';

interface GoldPrivacyModalProps {
  isOpen: boolean;
  settings: GoldPrivacySettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<GoldPrivacySettings>) => void;
  isAr?: boolean;
}

export const GoldPrivacyModal: React.FC<GoldPrivacyModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  isAr = true,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'media' | 'security'>('privacy');
  const [customFreezeDate, setCustomFreezeDate] = useState(settings.freezeLastSeenDate || '2026/09/25 10:30 م');
  const [pinCode, setPinCode] = useState('');
  const [appLocked, setAppLocked] = useState(false);

  if (!isOpen) return null;

  const toggle = (key: keyof GoldPrivacySettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-2xl w-full max-w-xl shadow-2xl border border-amber-500/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Gold Header with Crown Badge */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center font-bold text-amber-200">
              👑
            </div>
            <div>
              <h2 className="font-bold text-base tracking-wide flex items-center gap-1.5">
                <span>{isAr ? 'إضافات الذهبي - الخصوصية والأمان' : 'Gold Add-ons & Privacy'}</span>
              </h2>
              <p className="text-[11px] text-amber-100 font-medium">
                {isAr ? 'تحكم كامل في الظهور، الصحين، ومنع الحذف' : 'Total control over ticks, last seen & anti-delete'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-[#f4f4f5] dark:bg-[#202024] p-1.5 border-b border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-black shadow-xs'
                : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            {isAr ? 'الخصوصية التامة' : 'Privacy'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'media'
                ? 'bg-amber-500 text-black shadow-xs'
                : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            {isAr ? 'الحالات والوسائط' : 'Media & Status'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'security'
                ? 'bg-amber-500 text-black shadow-xs'
                : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            {isAr ? 'القفل والحماية' : 'App Lock'}
          </button>
        </div>

        {/* Body Items */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              {/* Hide Last Seen & Freeze */}
              <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between gap-3 border border-amber-500/10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                      {isAr ? 'إخفاء آخر ظهور وتجميده' : 'Freeze & Hide Last Seen'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8696a0]">
                    {isAr
                      ? 'لن يتمكن أحد من معرفة وقت تواجدك، وسيتم تثبيت ظهورك على التاريخ المحدد.'
                      : 'Nobody can see your online status or real last seen.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('hideLastSeen')}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    settings.hideLastSeen ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      settings.hideLastSeen ? 'start-6' : 'start-1'
                    }`}
                  />
                </button>
              </div>

              {/* Hide Blue Ticks (Read) */}
              <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] space-y-2 border border-amber-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                      {isAr ? 'إخفاء صحين القراءة (الصح الأزرق)' : 'Hide Blue Ticks'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8696a0]">
                  {isAr
                    ? 'تقرأ جميع الرسائل دون أن يتحول الصح إلى الأزرق لدى المرسل.'
                    : 'Read all messages without turning ticks blue.'}
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#111b21] dark:text-[#e4e4e7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.hideBlueTicksContacts}
                      onChange={() => toggle('hideBlueTicksContacts')}
                      className="rounded accent-amber-500"
                    />
                    <span>{isAr ? 'جهات الاتصال' : 'Contacts'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#111b21] dark:text-[#e4e4e7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.hideBlueTicksGroups}
                      onChange={() => toggle('hideBlueTicksGroups')}
                      className="rounded accent-amber-500"
                    />
                    <span>{isAr ? 'المجموعات' : 'Groups'}</span>
                  </label>
                </div>
              </div>

              {/* Hide Second Tick (Delivery) */}
              <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] space-y-2 border border-amber-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8696a0]" />
                    <span className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                      {isAr ? 'إخفاء صح الاستلام الثاني' : 'Hide Second Grey Tick'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8696a0]">
                  {isAr
                    ? 'يظهر للمرسل صح واحد فقط كأن هاتفك مغلق تماماً وأنت متصل!'
                    : 'Shows only 1 grey tick to sender as if you are offline.'}
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#111b21] dark:text-[#e4e4e7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.hideSecondTickContacts}
                      onChange={() => toggle('hideSecondTickContacts')}
                      className="rounded accent-amber-500"
                    />
                    <span>{isAr ? 'جهات الاتصال' : 'Contacts'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#111b21] dark:text-[#e4e4e7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.hideSecondTickGroups}
                      onChange={() => toggle('hideSecondTickGroups')}
                      className="rounded accent-amber-500"
                    />
                    <span>{isAr ? 'المجموعات' : 'Groups'}</span>
                  </label>
                </div>
              </div>

              {/* Hide Typing & Recording */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between border border-amber-500/10">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-emerald-500" />
                    <div>
                      <h4 className="font-bold text-xs text-[#111b21] dark:text-[#f4f4f5]">
                        {isAr ? 'إخفاء جاري الكتابة...' : 'Hide Typing...'}
                      </h4>
                      <span className="text-[10px] text-[#8696a0]">{isAr ? 'لا يظهر أنك تكتب' : 'Invisible typing'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle('hideTypingContacts')}
                    className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                      settings.hideTypingContacts ? 'bg-amber-500' : 'bg-gray-400/40'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.hideTypingContacts ? 'start-5' : 'start-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between border border-amber-500/10">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-red-500" />
                    <div>
                      <h4 className="font-bold text-xs text-[#111b21] dark:text-[#f4f4f5]">
                        {isAr ? 'إخفاء جاري التسجيل...' : 'Hide Recording...'}
                      </h4>
                      <span className="text-[10px] text-[#8696a0]">{isAr ? 'لا يظهر تسجيل الصوت' : 'Invisible recording'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle('hideRecording')}
                    className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                      settings.hideRecording ? 'bg-amber-500' : 'bg-gray-400/40'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        settings.hideRecording ? 'start-5' : 'start-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Hide Blue Mic Indicator */}
              <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between border border-amber-500/10">
                <div>
                  <h4 className="font-bold text-xs text-[#111b21] dark:text-[#f4f4f5]">
                    {isAr ? 'إخفاء إشارة تشغيل المقطع الصوتي (المايك الأزرق)' : 'Hide Blue Mic on Listen'}
                  </h4>
                  <p className="text-[11px] text-[#8696a0]">
                    {isAr ? 'استمع للرسائل الصوتية دون علم الطرف الآخر أنك استمعت إليها.' : 'Listen to voice notes invisibly.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('hideBlueMicrophone')}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                    settings.hideBlueMicrophone ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settings.hideBlueMicrophone ? 'start-5.5' : 'start-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Anti-Delete Messages */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4" />
                    <span>{isAr ? 'منع حذف الرسائل (Anti-Delete Messages)' : 'Anti-Delete Messages'}</span>
                  </h4>
                  <p className="text-[11px] text-[#8696a0] mt-0.5">
                    {isAr
                      ? 'تبقى الرسائل ظاهرة لديك حتى لو قام المرسل بحذفها للجميع!'
                      : 'Messages remain readable even if sender deleted for everyone.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('antiDeleteMessages')}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                    settings.antiDeleteMessages ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settings.antiDeleteMessages ? 'start-5.5' : 'start-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-3">
              {/* Hide Status View */}
              <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between border border-amber-500/10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                      {isAr ? 'إخفاء أنك شاهدت الحالة (Ghost Status View)' : 'Hide Status View'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8696a0]">
                    {isAr
                      ? 'شاهد حالات وقصص أصدقائك في الخفاء دون أن يظهر اسمك في قائمة المشاهدات.'
                      : 'View friend statuses without leaving your name in the viewer list.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('hideStatusView')}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                    settings.hideStatusView ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settings.hideStatusView ? 'start-5.5' : 'start-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Anti-Delete Status */}
              <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between border border-amber-500/10">
                <div className="space-y-0.5">
                  <span className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                    {isAr ? 'منع حذف الحالات (Anti-Delete Status)' : 'Anti-Delete Status'}
                  </span>
                  <p className="text-xs text-[#8696a0]">
                    {isAr
                      ? 'تبقى حالات أصدقائك متاحة للمشاهدة لمدة 24 ساعة حتى لو قاموا بحذفها.'
                      : 'Statuses stay visible even after deletion by contact.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('antiDeleteStatus')}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                    settings.antiDeleteStatus ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settings.antiDeleteStatus ? 'start-5.5' : 'start-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Unlimited View Once Media */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400">
                    {isAr ? 'مشاهدة وسائط "العرض لمرة واحدة" بلا حدود' : 'Unlimited View Once Media'}
                  </h4>
                  <p className="text-[11px] text-[#8696a0]">
                    {isAr ? 'افتح الصور والفيديوهات المقفولة بعرض مرة واحدة عدة مرات واحفظها بالأستوديو.' : 'Replay and download View-Once photos freely.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('allowUnlimitedViewOnce')}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                    settings.allowUnlimitedViewOnce ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settings.allowUnlimitedViewOnce ? 'start-5.5' : 'start-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Disable Forwarded Tag */}
              <div className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between border border-amber-500/10">
                <div>
                  <h4 className="font-bold text-xs text-[#111b21] dark:text-[#f4f4f5]">
                    {isAr ? 'إخفاء علامة "رسالة محولة"' : 'Hide Forwarded Tag'}
                  </h4>
                  <p className="text-[11px] text-[#8696a0]">
                    {isAr ? 'إعادة توجيه الرسائل دون أن يظهر للمستلم أنها محولة من شخص آخر.' : 'Forward without the "Forwarded" label.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('disableForwardedTag')}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                    settings.disableForwardedTag ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settings.disableForwardedTag ? 'start-5.5' : 'start-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-center space-y-2">
                <Lock className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                  {isAr ? 'قفل الواتساب برمز سري PIN' : 'WhatsApp Gold PIN Lock'}
                </h3>
                <p className="text-xs text-[#8696a0]">
                  {isAr ? 'قم بحماية محادثاتك من المتطفلين عند فتح التطبيق' : 'Lock your chats with a custom PIN.'}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="****"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-32 px-3 py-2 text-center text-lg tracking-widest font-mono bg-white dark:bg-black/40 rounded-xl border border-amber-500/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pinCode.length >= 4) {
                        setAppLocked(true);
                        localStorage.setItem('wa_gold_pin', pinCode);
                        alert(isAr ? 'تم تفعيل قفل الواتساب الذهبي بنجاح!' : 'PIN Lock Enabled!');
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl transition"
                  >
                    {isAr ? 'تفعيل القفل' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f4f4f5] dark:bg-[#202024] border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            {isAr ? '👑 واتساب الذهبي v12 الأصلي نشط' : '👑 WhatsApp Gold v12 Active'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black transition"
          >
            {isAr ? 'حفظ وإغلاق' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
