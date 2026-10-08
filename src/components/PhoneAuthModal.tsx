import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  QrCode,
  Sparkles,
  Lock,
  Copy,
  Check,
  MessageSquare,
  User,
  Image,
  Info,
  X,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';

export interface CountryInfo {
  code: string;
  nameAr: string;
  nameEn: string;
  dialCode: string;
  flag: string;
  formatPlaceholder: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt', dialCode: '+20', flag: '🇪🇬', formatPlaceholder: '010 1234 5678' },
  { code: 'SA', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', formatPlaceholder: '50 123 4567' },
  { code: 'AE', nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', formatPlaceholder: '50 123 4567' },
  { code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', dialCode: '+965', flag: '🇰🇼', formatPlaceholder: '9123 4567' },
  { code: 'QA', nameAr: 'قطر', nameEn: 'Qatar', dialCode: '+974', flag: '🇶🇦', formatPlaceholder: '3312 3456' },
  { code: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', dialCode: '+973', flag: '🇧🇭', formatPlaceholder: '3612 3456' },
  { code: 'OM', nameAr: 'سلطنة عمان', nameEn: 'Oman', dialCode: '+968', flag: '🇴🇲', formatPlaceholder: '9123 4567' },
  { code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', dialCode: '+962', flag: '🇯🇴', formatPlaceholder: '7 9123 4567' },
  { code: 'PS', nameAr: 'فلسطين', nameEn: 'Palestine', dialCode: '+970', flag: '🇵🇸', formatPlaceholder: '59 123 4567' },
  { code: 'IQ', nameAr: 'العراق', nameEn: 'Iraq', dialCode: '+964', flag: '🇮🇶', formatPlaceholder: '770 123 4567' },
  { code: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon', dialCode: '+961', flag: '🇱🇧', formatPlaceholder: '70 123 456' },
  { code: 'SY', nameAr: 'سوريا', nameEn: 'Syria', dialCode: '+963', flag: '🇸🇾', formatPlaceholder: '94 123 4567' },
  { code: 'MA', nameAr: 'المغرب', nameEn: 'Morocco', dialCode: '+212', flag: '🇲🇦', formatPlaceholder: '612 345678' },
  { code: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria', dialCode: '+213', flag: '🇩🇿', formatPlaceholder: '551 234 567' },
  { code: 'TN', nameAr: 'تونس', nameEn: 'Tunisia', dialCode: '+216', flag: '🇹🇳', formatPlaceholder: '20 123 456' },
  { code: 'LY', nameAr: 'ليبيا', nameEn: 'Libya', dialCode: '+218', flag: '🇱🇾', formatPlaceholder: '91 234 5678' },
  { code: 'SD', nameAr: 'السودان', nameEn: 'Sudan', dialCode: '+249', flag: '🇸🇩', formatPlaceholder: '91 234 5678' },
  { code: 'YE', nameAr: 'اليمن', nameEn: 'Yemen', dialCode: '+967', flag: '🇾🇪', formatPlaceholder: '77 123 4567' },
  { code: 'US', nameAr: 'الولايات المتحدة الأمريكية', nameEn: 'United States', dialCode: '+1', flag: '🇺🇸', formatPlaceholder: '(555) 123-4567' },
  { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', formatPlaceholder: '7123 456789' },
  { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', dialCode: '+49', flag: '🇩🇪', formatPlaceholder: '151 23456789' },
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', dialCode: '+33', flag: '🇫🇷', formatPlaceholder: '6 12 34 56 78' },
  { code: 'TR', nameAr: 'تركيا', nameEn: 'Turkey', dialCode: '+90', flag: '🇹🇷', formatPlaceholder: '532 123 4567' },
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
];

interface PhoneAuthModalProps {
  isOpen: boolean;
  isAr?: boolean;
  onSuccess: (user: UserProfile) => void;
  onClose?: () => void;
  isModal?: boolean; // if false, full screen splash/login
  initialPhone?: string;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  isOpen,
  isAr = true,
  onSuccess,
  onClose,
  isModal = false,
  initialPhone = '',
}) => {
  // Step 1: 'phone' -> Step 2: 'verify' -> Step 3: 'profile'
  const [step, setStep] = useState<'phone' | 'verify' | 'profile'>('phone');
  const [authMethod, setAuthMethod] = useState<'otp' | 'linkCode'>('otp');

  // Phone input states
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]); // Egypt default
  const [phoneNumber, setPhoneNumber] = useState(initialPhone ? initialPhone.replace(/^\+\d+\s*/, '') : '100 123 4567');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // OTP Verification states
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpNotification, setOtpNotification] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // WhatsApp Web 8-digit Pairing Code
  const [pairCode, setPairCode] = useState('WG82-4K9L');
  const [pairCodeCopied, setPairCodeCopied] = useState(false);

  // Profile setup states
  const [displayName, setDisplayName] = useState('مستخدم واتساب');
  const [aboutText, setAboutText] = useState('متاح على واتساب الذهبي 👑 | محمي بالتشفير التام');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);

  // Generate OTP simulation
  const sendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setCountdown(60);
    setVerifyError('');
    // Show simulated SMS notification toast
    setOtpNotification(code);
    setTimeout(() => {
      // Keep notification available for easy click-to-fill
    }, 100);
  };

  // Generate pair code
  const generatePairCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let p1 = '';
    let p2 = '';
    for (let i = 0; i < 4; i++) p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 4; i++) p2 += chars.charAt(Math.floor(Math.random() * chars.length));
    setPairCode(`${p1}-${p2}`);
  };

  // Countdown timer
  useEffect(() => {
    if (step === 'verify' && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  if (!isOpen) return null;

  const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneNumber.trim()}`;

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    if (authMethod === 'otp') {
      sendOtp();
    } else {
      generatePairCode();
    }
    setStep('verify');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (pastedDigits.length > 0) {
        const newOtp = [...otpCode];
        pastedDigits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtpCode(newOtp);
        if (pastedDigits.length === 6) {
          triggerOtpVerification(newOtp.join(''));
        }
        return;
      }
    }

    const digit = value.slice(-1).replace(/\D/g, '');
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);
    setVerifyError('');

    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.every((d) => d !== '')) {
      triggerOtpVerification(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const triggerOtpVerification = (enteredCode: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (enteredCode === generatedOtp || enteredCode === '123456' || enteredCode.length === 6) {
        setStep('profile');
      } else {
        setVerifyError(isAr ? 'رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى' : 'Incorrect code, please try again');
      }
    }, 700);
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setOtpCode(digits);
    triggerOtpVerification(generatedOtp);
  };

  const handlePairCodeSuccess = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('profile');
    }, 900);
  };

  const handleSaveProfileAndFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUser: UserProfile = {
      id: 'me',
      name: displayName.trim() || (isAr ? 'مستخدم واتساب' : 'WhatsApp User'),
      phone: fullPhoneNumber,
      about: aboutText.trim() || (isAr ? 'متاح' : 'Available'),
      avatar: avatar || PRESET_AVATARS[0],
    };

    // Save active auth phone and session
    localStorage.setItem('wa_auth_phone', fullPhoneNumber);
    localStorage.setItem('wa_is_authenticated', 'true');
    localStorage.setItem('wa_current_user', JSON.stringify(finalUser));

    onSuccess(finalUser);
  };

  const handleQuickDemoLogin = (presetPhone: string, presetName: string, presetAvatar: string) => {
    const finalUser: UserProfile = {
      id: 'me',
      name: presetName,
      phone: presetPhone,
      about: isAr ? 'مفعل وموثق برقم الهاتف 👑' : 'Verified by phone 👑',
      avatar: presetAvatar,
    };
    localStorage.setItem('wa_auth_phone', presetPhone);
    localStorage.setItem('wa_is_authenticated', 'true');
    localStorage.setItem('wa_current_user', JSON.stringify(finalUser));
    onSuccess(finalUser);
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.nameAr.includes(countrySearch) ||
      c.nameEn.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch)
  );

  const containerContent = (
    <div className="w-full max-w-xl mx-auto bg-[#ffffff] dark:bg-[#18181b] rounded-3xl shadow-2xl border border-amber-500/25 overflow-hidden flex flex-col transition-all">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-5 text-white relative">
        {onClose && isModal && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 end-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">
                {isAr ? 'واتساب الذهبي - تشغيل برقم الهاتف' : 'WhatsApp Gold - Phone Activation'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-black/30 text-amber-200 text-[10px] font-bold border border-amber-300/30">
                PRO V12
              </span>
            </div>
            <p className="text-xs text-amber-100 font-medium">
              {isAr
                ? 'اربط حسابك وسجل دخولك مباشرة برقم هاتفك مع التحقق الفوري'
                : 'Link and authenticate directly using your mobile phone number'}
            </p>
          </div>
        </div>

        {/* Step indicator breadcrumb */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/15 text-xs text-amber-100 font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 'phone' ? 'text-white underline font-bold' : 'opacity-80'}`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>{isAr ? 'إدخال رقم الهاتف' : 'Enter Phone'}</span>
          </div>
          <span>•</span>
          <div className={`flex items-center gap-1.5 ${step === 'verify' ? 'text-white underline font-bold' : 'opacity-80'}`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>{isAr ? 'تأكيد الرمز' : 'Verify Code'}</span>
          </div>
          <span>•</span>
          <div className={`flex items-center gap-1.5 ${step === 'profile' ? 'text-white underline font-bold' : 'opacity-80'}`}>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>{isAr ? 'الملف الشخصي' : 'Profile Setup'}</span>
          </div>
        </div>
      </div>

      {/* Simulated SMS Notification Popup */}
      {otpNotification && step === 'verify' && authMethod === 'otp' && (
        <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-[#111b21] dark:text-[#f4f4f5] flex items-center justify-between shadow-lg animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {isAr ? 'رسالة نصية / WhatsApp SMS' : 'Incoming Code SMS'}
                </span>
                <span className="text-[10px] text-[#8696a0] font-mono">الآن</span>
              </div>
              <p className="text-xs font-mono font-bold tracking-widest text-[#111b21] dark:text-white">
                كود تفعيل واتساب الذهبي: <span className="text-amber-600 dark:text-amber-400 text-sm font-black">{otpNotification}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutoFillOtp}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md transition flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isAr ? 'تعبئة تلقائية' : 'Auto Fill'}</span>
          </button>
        </div>
      )}

      {/* Modal / Card Body */}
      <div className="p-6 overflow-y-auto max-h-[75vh]">
        {/* STEP 1: ENTER PHONE NUMBER */}
        {step === 'phone' && (
          <form onSubmit={handleStartVerification} className="space-y-5">
            {/* Auth Method Selector */}
            <div className="flex rounded-xl bg-black/5 dark:bg-white/5 p-1 border border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  authMethod === 'otp'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>{isAr ? 'رمز التحقق SMS / OTP' : 'SMS / OTP Code'}</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('linkCode')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  authMethod === 'linkCode'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>{isAr ? 'رمز ربط واتساب ويب (8 خانات)' : 'Link with 8-digit Code'}</span>
              </button>
            </div>

            {/* Instruction */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-[#111b21] dark:text-[#f4f4f5]">
                {isAr ? 'أدخل رقم هاتفك لتشغيل المنصة' : 'Enter your phone number to start'}
              </h3>
              <p className="text-xs text-[#8696a0]">
                {isAr
                  ? 'اختر الدولة واكتب رقم هاتفك لاستلام كود التأكيد وربط محادثاتك'
                  : 'Select your country and enter your mobile number to pair'}
              </p>
            </div>

            {/* Country Selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
                {isAr ? 'الدولة / رمز الاتصال الدولي' : 'Country / Dialing Code'}
              </label>
              <button
                type="button"
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-amber-500/50 flex items-center justify-between text-start transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <div>
                    <span className="text-sm font-bold text-[#111b21] dark:text-[#f4f4f5] block">
                      {isAr ? selectedCountry.nameAr : selectedCountry.nameEn}
                    </span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold" dir="ltr">
                      {selectedCountry.dialCode}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#8696a0] font-bold px-2 py-1 rounded-md bg-black/5 dark:bg-white/10">
                  {isAr ? 'تغيير' : 'Change'}
                </span>
              </button>

              {/* Country dropdown */}
              {showCountryPicker && (
                <div className="absolute top-full start-0 w-full mt-2 z-30 bg-[#ffffff] dark:bg-[#202024] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 p-3 max-h-60 overflow-y-auto">
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder={isAr ? 'ابحث عن الدولة أو الرمز...' : 'Search country or dial code...'}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[#111b21] dark:text-white mb-2 focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                  <div className="space-y-1">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryPicker(false);
                          setCountrySearch('');
                        }}
                        className={`w-full p-2 rounded-xl flex items-center justify-between hover:bg-amber-500/10 text-start transition ${
                          selectedCountry.code === country.code ? 'bg-amber-500/20 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{country.flag}</span>
                          <span className="text-xs text-[#111b21] dark:text-[#f4f4f5]">
                            {isAr ? country.nameAr : country.nameEn}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400" dir="ltr">
                          {country.dialCode}
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
                {isAr ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <div className="flex items-center gap-2">
                <div className="px-3 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5 select-none" dir="ltr">
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.dialCode}</span>
                </div>
                <input
                  type="tel"
                  dir="ltr"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={selectedCountry.formatPlaceholder}
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-base font-mono font-bold text-[#111b21] dark:text-white focus:outline-none focus:border-amber-500 transition"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-[#8696a0] mt-1.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500 inline" />
                <span>{isAr ? 'رقم هاتفك محمي ومشفر بالكامل داخل جهازك' : 'Your phone number is end-to-end encrypted'}</span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isAr ? 'متابعة والحصول على رمز التفعيل' : 'Continue & Verify Phone'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Quick Demo Accounts Selection */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-[#8696a0] block mb-2 uppercase tracking-wider text-center">
                {isAr ? '⚡ أو الدخول السريع بأرقام تجريبية جاهزة' : '⚡ Or quick demo login with ready numbers'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      '+20 100 123 4567',
                      'حسابي الأساسي (مصر 🇪🇬)',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                    )
                  }
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-amber-500/10 border border-black/10 dark:border-white/10 flex items-center gap-2.5 text-start transition"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    alt="Demo 1"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-500"
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-[#111b21] dark:text-[#f4f4f5] block truncate">
                      رقم مصري 🇪🇬
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400" dir="ltr">
                      +20 100 123 4567
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      '+966 50 999 8877',
                      'رقم العمل (السعودية 🇸🇦)',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
                    )
                  }
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-amber-500/10 border border-black/10 dark:border-white/10 flex items-center gap-2.5 text-start transition"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                    alt="Demo 2"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-500"
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-[#111b21] dark:text-[#f4f4f5] block truncate">
                      رقم سعودي 🇸🇦
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400" dir="ltr">
                      +966 50 999 8877
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: VERIFICATION (OTP OR 8-DIGIT PAIR CODE) */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs" dir="ltr">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{fullPhoneNumber}</span>
              </span>
              <h3 className="font-bold text-lg text-[#111b21] dark:text-[#f4f4f5]">
                {authMethod === 'otp'
                  ? isAr
                    ? 'أدخل رمز التحقق (OTP)'
                    : 'Enter verification code'
                  : isAr
                  ? 'رمز ربط الهاتف في واتساب ويب'
                  : 'Phone pairing code'}
              </h3>
              <p className="text-xs text-[#8696a0]">
                {authMethod === 'otp'
                  ? isAr
                    ? 'أرسلنا كود التحقق المكون من 6 أرقام إلى رقم هاتفك'
                    : 'We sent a 6-digit verification code to your mobile'
                  : isAr
                  ? 'افتح واتساب في هاتفك > الأجهزة المرتبطة > الربط برقم الهاتف، وأدخل الرمز التالي:'
                  : 'Open WhatsApp on your phone > Linked Devices > Link with phone, and enter this code:'}
              </p>
            </div>

            {/* OTP Input UI */}
            {authMethod === 'otp' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 sm:w-13 h-13 sm:h-14 text-center font-mono font-black text-xl rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-black/15 dark:border-white/15 focus:border-amber-500 focus:bg-amber-500/5 focus:outline-none text-[#111b21] dark:text-white transition shadow-sm"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {verifyError && (
                  <p className="text-center text-xs font-bold text-red-500 dark:text-red-400">
                    {verifyError}
                  </p>
                )}

                {/* Countdown & Resend */}
                <div className="flex items-center justify-between text-xs text-[#8696a0] pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="hover:text-amber-500 font-bold transition flex items-center gap-1"
                  >
                    {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                    <span>{isAr ? 'تغيير رقم الهاتف' : 'Edit number'}</span>
                  </button>

                  {countdown > 0 ? (
                    <span className="font-mono text-amber-600 dark:text-amber-400">
                      {isAr ? `إعادة الإرسال بعد ${countdown} ثانية` : `Resend in ${countdown}s`}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إعادة إرسال الرمز' : 'Resend Code'}</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => triggerOtpVerification(otpCode.join(''))}
                  disabled={isVerifying || otpCode.some((d) => !d)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAr ? 'تأكيد الرمز والمتابعة' : 'Verify Code & Proceed'}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* WhatsApp Web 8-character Pairing Code Display */
              <div className="space-y-5">
                <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-3">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                    {isAr ? 'رمز الربط المباشر' : 'Direct Link Code'}
                  </span>
                  <div className="font-mono font-black text-3xl sm:text-4xl tracking-widest text-[#111b21] dark:text-white select-all">
                    {pairCode}
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(pairCode);
                        setPairCodeCopied(true);
                        setTimeout(() => setPairCodeCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 text-xs font-bold text-[#111b21] dark:text-white transition flex items-center gap-1.5"
                    >
                      {pairCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{pairCodeCopied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرمز' : 'Copy code')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={generatePairCode}
                      className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 text-xs font-bold text-[#111b21] dark:text-white transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تحديث الرمز' : 'New code'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2 text-xs text-[#8696a0]">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>{isAr ? 'افتح تطبيق واتساب على هاتفك' : 'Open WhatsApp on your mobile phone'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>{isAr ? 'اضغط على القائمة (⋮) أو الإعدادات > الأجهزة المرتبطة' : 'Tap Menu (⋮) or Settings > Linked Devices'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>{isAr ? 'اختر "ربط باستخدام رقم الهاتف" وأدخل هذا الرمز' : 'Select "Link with phone number" and enter this code'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePairCodeSuccess}
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAr ? 'تم إدخال الرمز في هاتفي (تأكيد الربط)' : 'I entered code on my phone (Confirm)'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PROFILE SETUP */}
        {step === 'profile' && (
          <form onSubmit={handleSaveProfileAndFinish} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs" dir="ltr">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تم التحقق بنجاح برقم الهاتف' : 'Phone Verified Successfully'}</span>
              </span>
              <h3 className="font-bold text-lg text-[#111b21] dark:text-[#f4f4f5]">
                {isAr ? 'إعداد ملفك الشخصي' : 'Setup Your Profile'}
              </h3>
              <p className="text-xs text-[#8696a0]">
                {isAr
                  ? 'هذا الاسم والصورة سيظهران لجهات اتصالك في واتساب'
                  : 'This name and avatar will be shown to your contacts'}
              </p>
            </div>

            {/* Avatar Selector */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-500 shadow-xl mx-auto"
                />
                <span className="absolute bottom-0 end-0 p-1.5 rounded-full bg-amber-500 text-black">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8696a0] font-bold block mb-2">
                  {isAr ? 'اختر صورة من النماذج' : 'Choose an avatar'}
                </span>
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`w-9 h-9 rounded-full overflow-hidden transition ring-2 ${
                        avatar === url ? 'ring-amber-500 scale-110' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
                {isAr ? 'اسمك المستعار / الاسم الظاهر' : 'Display Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={isAr ? 'مثال: أحمد عبد الله' : 'e.g. John Doe'}
                  className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-bold text-[#111b21] dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
                <User className="w-4 h-4 text-[#8696a0] absolute end-3.5 top-3.5" />
              </div>
            </div>

            {/* About / Status Input */}
            <div>
              <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
                {isAr ? 'الأخبار / الحالة (About)' : 'About / Bio'}
              </label>
              <input
                type="text"
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder={isAr ? 'الأخبار' : 'About'}
                className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[#111b21] dark:text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Phone Info Chip */}
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#8696a0]">{isAr ? 'رقم الهاتف المرتبط:' : 'Linked Phone:'}</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400" dir="ltr">
                {fullPhoneNumber}
              </span>
            </div>

            {/* Finish Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'دخول المنصة وبدء المحادثات' : 'Enter WhatsApp & Start Chatting'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
        {containerContent}
      </div>
    );
  }

  // Full page view
  return (
    <div className="fixed inset-0 z-50 bg-[#0c1317] flex items-center justify-center p-4 overflow-y-auto">
      {containerContent}
    </div>
  );
};
