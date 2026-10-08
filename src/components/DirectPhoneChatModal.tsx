import React, { useState } from 'react';
import {
  X,
  Phone,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Check,
} from 'lucide-react';
import { COUNTRIES, CountryInfo } from './PhoneAuthModal';
import { Chat } from '../types';

interface DirectPhoneChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (phone: string, name?: string, initialMessage?: string) => void;
  existingChats: Chat[];
  isAr?: boolean;
}

export const DirectPhoneChatModal: React.FC<DirectPhoneChatModalProps> = ({
  isOpen,
  onClose,
  onStartChat,
  existingChats,
  isAr = true,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]); // Egypt
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');

  if (!isOpen) return null;

  const fullPhone = `${selectedCountry.dialCode} ${phoneNumber.trim()}`;

  // Check if chat already exists
  const matchingChat = existingChats.find(
    (c) =>
      c.phone &&
      (c.phone.replace(/\s+/g, '') === fullPhone.replace(/\s+/g, '') ||
        c.phone.replace(/\s+/g, '').endsWith(phoneNumber.replace(/\s+/g, '')))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    onStartChat(
      fullPhone,
      contactName.trim() || undefined,
      initialMessage.trim() || undefined
    );
    onClose();
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.nameAr.includes(searchCountry) ||
      c.nameEn.toLowerCase().includes(searchCountry.toLowerCase()) ||
      c.dialCode.includes(searchCountry)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-3xl w-full max-w-md shadow-2xl border border-amber-500/25 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isAr ? 'مراسلة رقم هاتف مباشرة' : 'Direct Message by Phone'}
              </h3>
              <p className="text-[11px] text-amber-100">
                {isAr
                  ? 'راسل أي رقم هاتف فوراً دون الحاجة لتسجيله في جهات الاتصال'
                  : 'Chat with any number without saving to contacts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Country Selector */}
          <div className="relative">
            <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
              {isAr ? 'الدولة / مفتاح الاتصال' : 'Country / Dial Code'}
            </label>
            <button
              type="button"
              onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-amber-500/50 flex items-center justify-between text-start transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-xs font-bold text-[#111b21] dark:text-[#f4f4f5]">
                  {isAr ? selectedCountry.nameAr : selectedCountry.nameEn}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold" dir="ltr">
                  ({selectedCountry.dialCode})
                </span>
              </div>
              <span className="text-[10px] text-[#8696a0] font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                {isAr ? 'تغيير' : 'Change'}
              </span>
            </button>

            {showCountryPicker && (
              <div className="absolute top-full start-0 w-full mt-2 z-20 bg-[#ffffff] dark:bg-[#202024] rounded-2xl shadow-xl border border-black/10 dark:border-white/10 p-2.5 max-h-52 overflow-y-auto">
                <input
                  type="text"
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  placeholder={isAr ? 'بحث عن دولة...' : 'Search...'}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs mb-2 focus:outline-none"
                  autoFocus
                />
                <div className="space-y-1">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(c);
                        setShowCountryPicker(false);
                      }}
                      className="w-full p-2 rounded-lg flex items-center justify-between hover:bg-amber-500/15 text-xs text-start transition"
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="text-[#111b21] dark:text-[#f4f4f5]">{isAr ? c.nameAr : c.nameEn}</span>
                      </div>
                      <span className="font-mono text-amber-600 dark:text-amber-400" dir="ltr">
                        {c.dialCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
              {isAr ? 'رقم الهاتف المطلوب مراسلته' : 'Target Phone Number'}
            </label>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono font-bold text-xs text-amber-600 dark:text-amber-400 select-none" dir="ltr">
                {selectedCountry.dialCode}
              </div>
              <input
                type="tel"
                dir="ltr"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={selectedCountry.formatPlaceholder}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-mono font-bold text-[#111b21] dark:text-white focus:outline-none focus:border-amber-500 transition"
                autoFocus
              />
            </div>
            {matchingChat && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>
                  {isAr
                    ? `جهة الاتصال موجودة بالفعل: "${matchingChat.name}"`
                    : `Contact already exists: "${matchingChat.name}"`}
                </span>
              </p>
            )}
          </div>

          {/* Optional Name */}
          <div>
            <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
              {isAr ? 'اسم جهة الاتصال (اختياري)' : 'Contact Name (Optional)'}
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={isAr ? 'مثال: مهندس أحمد أو عميل VIP' : 'e.g. Alex or VIP Client'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[#111b21] dark:text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Optional First Message */}
          <div>
            <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
              {isAr ? 'نص الرسالة الأولى (اختياري)' : 'First Message (Optional)'}
            </label>
            <textarea
              rows={2}
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder={isAr ? 'السلام عليكم ورحمة الله...' : 'Hello there...'}
              className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[#111b21] dark:text-white focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-bold text-[#8696a0] transition"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isAr ? 'بدء المحادثة بالرقم' : 'Start Chat with Number'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
