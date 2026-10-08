import React from 'react';
import { X, UserCheck, Smartphone, Check, Plus } from 'lucide-react';
import { AccountProfile } from '../types';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  accounts: AccountProfile[];
  currentSlot: number;
  onClose: () => void;
  onSwitchAccount: (account: AccountProfile) => void;
  onLinkNewPhone?: () => void;
  isAr?: boolean;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  accounts,
  currentSlot,
  onClose,
  onSwitchAccount,
  onLinkNewPhone,
  isAr = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-2xl w-full max-w-md shadow-2xl border border-amber-500/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">
                {isAr ? 'تبديل الحسابات (تشغيل 5 أرقام)' : 'Multi-Account Switcher'}
              </h3>
              <p className="text-[11px] text-amber-100">
                {isAr ? 'بدّل بين أرقامك دون تسجيل خروج' : 'Switch seamlessly between 5 phone numbers'}
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

        {/* Account Slots List */}
        <div className="p-4 space-y-2.5 overflow-y-auto max-h-[60vh]">
          {accounts.map((acc) => {
            const isActive = currentSlot === acc.slotNumber;
            const slotLabels = [
              isAr ? 'الرقم الأول (الأساسي)' : 'Account 1 (Primary)',
              isAr ? 'الرقم الثاني' : 'Account 2',
              isAr ? 'الرقم الثالث' : 'Account 3',
              isAr ? 'الرقم الرابع' : 'Account 4',
              isAr ? 'الرقم الخامس' : 'Account 5',
            ];
            const slotTitle = slotLabels[acc.slotNumber - 1] || `الرقم ${acc.slotNumber}`;

            return (
              <div
                key={acc.id}
                onClick={() => {
                  onSwitchAccount(acc);
                  onClose();
                }}
                className={`p-3 rounded-xl cursor-pointer border transition flex items-center justify-between ${
                  isActive
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30"
                    />
                    <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                      {acc.slotNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider">
                      {slotTitle}
                    </span>
                    <h4 className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                      {acc.name}
                    </h4>
                    <span className="text-xs text-[#8696a0] font-mono" dir="ltr">
                      {acc.phone}
                    </span>
                  </div>
                </div>

                {isActive ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-black font-bold text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isAr ? 'نشط' : 'Active'}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition"
                  >
                    {isAr ? 'التبديل إليه' : 'Switch'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#f4f4f5] dark:bg-[#202024] border-t border-black/5 dark:border-white/5 space-y-2 text-center">
          {onLinkNewPhone && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLinkNewPhone();
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'ربط وتسجيل دخول برقم هاتف جديد' : 'Link & Authenticate New Phone'}</span>
            </button>
          )}
          <p className="text-[11px] text-[#8696a0]">
            {isAr
              ? 'ميزة حصرية بالواتس الذهبي: يمكنك تشغيل حتى 5 حسابات على نفس المتصفح.'
              : 'Exclusive Gold feature: run up to 5 numbers in one app.'}
          </p>
        </div>
      </div>
    </div>
  );
};
