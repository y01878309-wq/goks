import React, { useState } from 'react';
import { X, UserPlus, Users, Check } from 'lucide-react';
import { Chat } from '../types';

interface NewChatModalProps {
  isOpen: boolean;
  contacts: Chat[];
  onClose: () => void;
  onCreateDirectChat: (name: string, phone: string, avatar: string) => void;
  onCreateGroupChat: (name: string, selectedContactIds: string[]) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
];

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  contacts,
  onClose,
  onCreateDirectChat,
  onCreateGroupChat,
}) => {
  const [mode, setMode] = useState<'direct' | 'group'>('direct');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateDirectChat(name.trim(), phone.trim() || '+20 100 000 0000', selectedAvatar);
    onClose();
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedContacts.length === 0) return;
    onCreateGroupChat(name.trim(), selectedContacts);
    onClose();
  };

  const toggleContactSelection = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#202c33] rounded-2xl w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
          <h3 className="font-semibold text-base text-[#111b21] dark:text-[#e9edef]">
            {mode === 'direct' ? 'جهة اتصال جديدة' : 'إنشاء مجموعة جديدة'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-2 bg-[#f0f2f5] dark:bg-[#111b21] border-b border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={() => setMode('direct')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              mode === 'direct'
                ? 'bg-white dark:bg-[#202c33] text-[#00a884] shadow-xs'
                : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>محادثة فردية</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('group')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              mode === 'group'
                ? 'bg-white dark:bg-[#202c33] text-[#00a884] shadow-xs'
                : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>مجموعة جديدة</span>
          </button>
        </div>

        {/* Form Body */}
        {mode === 'direct' ? (
          <form onSubmit={handleDirectSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8696a0] mb-1.5">
                اسم جهة الاتصال
              </label>
              <input
                type="text"
                required
                placeholder="مثال: محمد خالد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] border border-transparent focus:border-[#00a884] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8696a0] mb-1.5">
                رقم الهاتف (اختياري)
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="+20 10X XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] border border-transparent focus:border-[#00a884] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8696a0] mb-2">
                اختر صورة الملف الشخصي
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {AVATAR_OPTIONS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative rounded-full p-0.5 transition shrink-0 ${
                      selectedAvatar === url
                        ? 'ring-2 ring-[#00a884] ring-offset-2 ring-offset-white dark:ring-offset-[#202c33]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt="Avatar"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#00a884] text-white hover:bg-[#008f6f] disabled:opacity-50 transition"
              >
                بدء المحادثة
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleGroupSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8696a0] mb-1.5">
                اسم المجموعة
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أصدقاء الجامعة 🎓"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] border border-transparent focus:border-[#00a884] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8696a0] mb-2">
                إضافة أعضاء للمجموعة ({selectedContacts.length})
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-black/5 dark:divide-white/5">
                {contacts
                  .filter((c) => !c.isGroup)
                  .map((contact) => {
                    const isSelected = selectedContacts.includes(contact.id);
                    return (
                      <div
                        key={contact.id}
                        onClick={() => toggleContactSelection(contact.id)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                          isSelected
                            ? 'bg-[#00a884]/10 text-[#00a884]'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#111b21] dark:text-[#e9edef]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium">{contact.name}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                            isSelected
                              ? 'bg-[#00a884] border-[#00a884] text-white'
                              : 'border-[#8696a0]/40'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!name.trim() || selectedContacts.length === 0}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#00a884] text-white hover:bg-[#008f6f] disabled:opacity-50 transition"
              >
                إنشاء المجموعة
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
