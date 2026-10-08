import React, { useState } from 'react';
import { X, Phone, Video, Search, Bell, Shield, Star, Trash2, Image, FileText, Ban, Archive, ArchiveRestore, Tag, Plus } from 'lucide-react';
import { Chat, Message, ContactGroup } from '../types';

interface ContactInfoDrawerProps {
  chat: Chat;
  messages: Message[];
  onClose: () => void;
  onClearChat: () => void;
  onDeleteChat: () => void;
  onToggleArchive: () => void;
  contactGroups?: ContactGroup[];
  onManageGroups?: () => void;
}

export const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({
  chat,
  messages,
  onClose,
  onClearChat,
  onDeleteChat,
  onToggleArchive,
  contactGroups = [],
  onManageGroups,
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'starred'>('media');

  const mediaMessages = messages.filter((m) => m.type === 'image' && m.mediaUrl);
  const docMessages = messages.filter((m) => m.type === 'document' && m.mediaName);
  const starredMessages = messages.filter((m) => m.isStarred);
  const assignedGroups = contactGroups.filter((g) => g.chatIds.includes(chat.id));

  return (
    <div className="w-full sm:w-[380px] h-full bg-[#ffffff] dark:bg-[#111b21] border-s border-black/10 dark:border-white/10 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 z-30">
      {/* Top Bar */}
      <div className="h-15 px-4 flex items-center gap-4 bg-[#f0f2f5] dark:bg-[#202c33] shrink-0 border-b border-black/5 dark:border-white/5">
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-base text-[#111b21] dark:text-[#e9edef]">
          معلومات جهة الاتصال
        </h3>
      </div>

      {/* Profile Header */}
      <div className="p-6 flex flex-col items-center bg-[#ffffff] dark:bg-[#111b21] border-b border-black/5 dark:border-white/5">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-32 h-32 rounded-full object-cover shadow-md mb-4 ring-2 ring-emerald-500/20"
        />
        <h2 className="text-xl font-bold text-[#111b21] dark:text-[#e9edef] text-center">
          {chat.name}
        </h2>
        {chat.phone && (
          <p className="text-sm text-[#8696a0] mt-1 font-mono text-center" dir="ltr">
            {chat.phone}
          </p>
        )}
      </div>

      {/* About / الأخبار */}
      {chat.about && (
        <div className="p-4 bg-[#ffffff] dark:bg-[#111b21] border-b border-black/5 dark:border-white/5">
          <span className="text-xs text-[#8696a0] block mb-1">الأخبار والمعلومات</span>
          <p className="text-sm text-[#111b21] dark:text-[#e9edef] leading-relaxed">
            {chat.about}
          </p>
        </div>
      )}

      {/* Contact Groups / تصنيفات جهة الاتصال */}
      <div className="p-4 bg-[#ffffff] dark:bg-[#111b21] border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[#8696a0] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#00a884]" />
            تصنيفات جهة الاتصال ({assignedGroups.length})
          </span>
          {onManageGroups && (
            <button
              type="button"
              onClick={onManageGroups}
              className="text-xs text-[#00a884] hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>إدارة التصنيفات</span>
            </button>
          )}
        </div>

        {assignedGroups.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {assignedGroups.map((g) => (
              <span
                key={g.id}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${g.color}18`,
                  color: g.color,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                {g.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8696a0]">
            لم يتم تصنيف جهة الاتصال هذه بعد (مثل: العائلة، العمل، الأصدقاء).
          </p>
        )}
      </div>

      {/* Media, Links & Docs Section */}
      <div className="p-4 bg-[#ffffff] dark:bg-[#111b21] border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#8696a0]">
            الوسائط والمستندات والروابط ({mediaMessages.length + docMessages.length})
          </span>
        </div>

        {/* Media Preview Grid */}
        {mediaMessages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mediaMessages.slice(0, 6).map((m) => (
              <img
                key={m.id}
                src={m.mediaUrl}
                alt="Shared"
                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8696a0] py-2">لا توجد وسائط تم تبادلها بعد</p>
        )}
      </div>

      {/* Starred Messages */}
      <div className="p-4 bg-[#ffffff] dark:bg-[#111b21] border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#111b21] dark:text-[#e9edef]">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium">الرسائل المميزة بنجمة</span>
          </div>
          <span className="text-xs text-[#8696a0] font-mono">{starredMessages.length}</span>
        </div>
      </div>

      {/* Encryption security notice */}
      <div className="p-4 bg-[#ffffff] dark:bg-[#111b21] border-b border-black/5 dark:border-white/5 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#00a884] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
            التشفير التام بين الطرفين
          </h4>
          <p className="text-xs text-[#8696a0] mt-0.5 leading-relaxed">
            الرسائل والمكالمات مشفرة تماماً بين الطرفين. لا أحد خارج هذه الدردشة يمكنه قراءتها أو الاستماع إليها.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2 mt-auto">
        <button
          type="button"
          onClick={onToggleArchive}
          className="w-full flex items-center gap-3 p-3 text-[#00a884] hover:bg-[#00a884]/10 rounded-xl transition text-sm font-semibold"
        >
          {chat.isArchived ? (
            <>
              <ArchiveRestore className="w-5 h-5" />
              <span>إلغاء أرشفة هذه الدردشة</span>
            </>
          ) : (
            <>
              <Archive className="w-5 h-5" />
              <span>أرشفة هذه الدردشة</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClearChat}
          className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition text-sm font-medium"
        >
          <Trash2 className="w-5 h-5" />
          <span>مسح محتوى الدردشة</span>
        </button>

        <button
          type="button"
          onClick={onDeleteChat}
          className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-600/10 rounded-xl transition text-sm font-semibold"
        >
          <Ban className="w-5 h-5" />
          <span>حذف المحادثة بالكامل</span>
        </button>
      </div>
    </div>
  );
};
