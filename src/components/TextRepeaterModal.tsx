import React, { useState } from 'react';
import { X, Send, Zap, Phone, Users, ShieldCheck, Check } from 'lucide-react';
import { Chat } from '../types';

interface TextRepeaterModalProps {
  isOpen: boolean;
  chats: Chat[];
  currentChatId: string;
  onClose: () => void;
  onSendRepeatedMessages: (targetChatId: string, text: string, count: number, separateMessages: boolean) => void;
  onSendToNewPhone: (phoneNumber: string, text: string, count: number) => void;
  isAr?: boolean;
}

export const TextRepeaterModal: React.FC<TextRepeaterModalProps> = ({
  isOpen,
  chats,
  currentChatId,
  onClose,
  onSendRepeatedMessages,
  onSendToNewPhone,
  isAr = true,
}) => {
  const [text, setText] = useState('صباح الخير يا غالي 🌹✨');
  const [count, setCount] = useState<number>(10);
  const [targetType, setTargetType] = useState<'current' | 'contacts' | 'newPhone'>('current');
  const [selectedChatId, setSelectedChatId] = useState<string>(currentChatId);
  const [customPhone, setCustomPhone] = useState('+20 100 123 4567');
  const [sendAsSeparate, setSendAsSeparate] = useState(true);

  if (!isOpen) return null;

  const currentChat = chats.find((c) => c.id === currentChatId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || count < 1) return;

    const safeCount = Math.min(Math.max(1, count), 100);

    if (targetType === 'newPhone') {
      if (!customPhone.trim()) return;
      onSendToNewPhone(customPhone.trim(), text.trim(), safeCount);
    } else {
      const destination = targetType === 'current' ? currentChatId : selectedChatId;
      onSendRepeatedMessages(destination, text.trim(), safeCount, sendAsSeparate);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-2xl w-full max-w-lg shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-black/20 rounded-lg">
              <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isAr ? 'قاذف وتكرار الرسائل (Spam Bomber)' : 'Text Repeater / Spammer'}
              </h3>
              <p className="text-[11px] text-amber-100 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                {isAr ? 'إرسال فوري مع حماية ضد حظر الرقم 100%' : 'Instant delivery with 100% Anti-Ban shield'}
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Quick Info Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300">
            <span className="text-base shrink-0">⚡</span>
            <div className="leading-relaxed">
              {isAr
                ? 'حدد الجملة أو الكلمة، ثم حدد عدد المرات واضغط إرسال مرة واحدة وسيتم إرسالها فوراً إلى الرقم أو المحادثة المحددة دون حظر!'
                : 'Enter your phrase, pick how many times to repeat, choose the recipient number, and send instantly!'}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#8696a0]">
                {isAr ? 'الجملة أو الكلمة المراد تكرارها:' : 'Text or phrase to repeat:'}
              </label>
              <div className="flex items-center gap-1">
                {['هلا وغلا 🌹', 'أين أنت؟ 👀', 'تم التحويل بنجاح ✅', 'جمعة مباركة 🕌'].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setText(quick)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 hover:bg-amber-500/20 text-[#8696a0] hover:text-amber-500 transition"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isAr ? 'اكتب الجملة أو الكلمة هنا...' : 'Type message here...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#242429] text-sm text-[#111b21] dark:text-[#f4f4f5] border border-amber-500/20 focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          {/* Quick Count Selection */}
          <div>
            <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
              {isAr ? 'عدد مرات التكرار والإرسال دفعة واحدة:' : 'Repeat count:'}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {[5, 10, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    count === num
                      ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                      : 'border-black/10 dark:border-white/10 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-32 px-3 py-2 rounded-xl bg-[#f4f4f5] dark:bg-[#242429] text-sm font-bold text-center border border-amber-500/20 focus:outline-none"
              />
              <span className="text-xs text-[#8696a0] shrink-0 font-medium">
                {isAr ? 'مرة (أقصى حد آمن ضد الحظر 100 مرة)' : 'times (safe limit: 100)'}
              </span>
            </div>
          </div>

          {/* Destination Target */}
          <div>
            <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
              {isAr ? 'إرسال إلى أي رقم أو محادثة:' : 'Send to destination:'}
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => setTargetType('current')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition text-center truncate ${
                  targetType === 'current'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'border-black/10 dark:border-white/10 text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {currentChat?.name ? `💬 ${currentChat.name}` : (isAr ? 'المحادثة الحالية' : 'Current Chat')}
              </button>

              <button
                type="button"
                onClick={() => setTargetType('contacts')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition text-center truncate flex items-center justify-center gap-1.5 ${
                  targetType === 'contacts'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'border-black/10 dark:border-white/10 text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isAr ? 'اختر من جهات الاتصال' : 'Select Contact'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('newPhone')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition text-center truncate flex items-center justify-center gap-1.5 ${
                  targetType === 'newPhone'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'border-black/10 dark:border-white/10 text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isAr ? 'رقم هاتف محدد' : 'Custom Phone'}</span>
              </button>
            </div>

            {/* If selecting from existing contacts */}
            {targetType === 'contacts' && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto p-1 bg-[#f4f4f5] dark:bg-[#202024] rounded-xl border border-black/5 dark:border-white/5">
                {chats.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedChatId(c.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs ${
                      selectedChatId === c.id
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#111b21] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {selectedChatId === c.id && <Check className="w-4 h-4 text-amber-500 shrink-0" />}
                  </div>
                ))}
              </div>
            )}

            {/* If entering custom phone number */}
            {targetType === 'newPhone' && (
              <div className="p-3 bg-[#f4f4f5] dark:bg-[#202024] rounded-xl border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8696a0]">
                    {isAr ? 'أدخل الرقم مع كود الدولة:' : 'Enter number with country code:'}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold">
                    {isAr ? '✓ غير محفوظ في جهات الاتصال' : '✓ Unsaved number'}
                  </span>
                </div>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="+20 100 000 0000"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#18181b] text-sm font-mono font-bold text-[#111b21] dark:text-[#f4f4f5] border border-amber-500/40 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Mode toggle: separate messages vs single big message */}
          <div className="p-3 rounded-xl bg-[#f4f4f5] dark:bg-[#242429] border border-black/5 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#111b21] dark:text-[#f4f4f5] block">
                  {isAr ? 'إرسال كرسائل متتالية منفصلة' : 'Send as consecutive separate messages'}
                </span>
                <span className="text-[11px] text-[#8696a0] block">
                  {isAr
                    ? 'يرسل كل تكرار في رسالة مستقلة وبسرعة فائقة'
                    : 'Sends each repetition in a separate bubble'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={sendAsSeparate}
                onChange={(e) => setSendAsSeparate(e.target.checked)}
                className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black flex items-center gap-2 shadow-lg active:scale-95 transition cursor-pointer"
            >
              <Send className="w-4 h-4 -rotate-45" />
              <span>
                {isAr ? `إرسال دفعة واحدة (${count} مرة)` : `Send All at Once (${count}x)`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

