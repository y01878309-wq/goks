import React, { useState, useMemo } from 'react';
import {
  X,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  Search,
  Filter,
  Users,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Chat, ContactGroup } from '../types';

interface ContactGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactGroups: ContactGroup[];
  onSaveGroup: (group: ContactGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  chats: Chat[];
  selectedGroupId?: string | null;
  onSelectGroupFilter?: (groupId: string | null) => void;
  editingChatId?: string | null;
  onToggleChatInGroup?: (groupId: string, chatId: string) => void;
  language?: 'ar' | 'en';
}

const PRESET_COLORS = [
  { name: 'Emerald', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
];

const PRESET_NAMES_AR = ['العائلة 👨‍👩‍👧‍👦', 'العمل 💼', 'الأصدقاء 🤝', 'عملاء مهمين ⭐', 'المشروع 🚀', 'شخصي 🔒'];
const PRESET_NAMES_EN = ['Family 👨‍👩‍👧‍👦', 'Work 💼', 'Friends 🤝', 'VIP Clients ⭐', 'Project 🚀', 'Personal 🔒'];

export const ContactGroupsModal: React.FC<ContactGroupsModalProps> = ({
  isOpen,
  onClose,
  contactGroups,
  onSaveGroup,
  onDeleteGroup,
  chats,
  selectedGroupId,
  onSelectGroupFilter,
  editingChatId,
  onToggleChatInGroup,
  language = 'ar',
}) => {
  const isAr = language === 'ar';

  // Mode: 'list' | 'create' | 'edit' | 'quick-assign'
  const [viewMode, setViewMode] = useState<'list' | 'form'>(
    editingChatId ? 'list' : 'list'
  );

  // Form State
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupColor, setGroupColor] = useState(PRESET_COLORS[0].value);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  if (!isOpen) return null;

  // Contact to quickly assign if editingChatId is passed
  const targetChat = editingChatId ? chats.find((c) => c.id === editingChatId) : null;

  // Filtered chats for member selector
  const memberOptions = chats.filter((c) =>
    c.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchMemberQuery))
  );

  const startCreateNew = () => {
    setEditingGroupId(null);
    setGroupName('');
    setGroupColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].value);
    setSelectedChatIds(targetChat ? [targetChat.id] : []);
    setSearchMemberQuery('');
    setViewMode('form');
  };

  const startEditGroup = (group: ContactGroup) => {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupColor(group.color);
    setSelectedChatIds([...group.chatIds]);
    setSearchMemberQuery('');
    setViewMode('form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup: ContactGroup = {
      id: editingGroupId || `group-${Date.now()}`,
      name: groupName.trim(),
      color: groupColor,
      chatIds: selectedChatIds,
    };

    onSaveGroup(newGroup);
    setViewMode('list');
    setEditingGroupId(null);
  };

  const toggleChatSelection = (chatId: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );
  };

  const handleSelectAllMembers = () => {
    if (selectedChatIds.length === memberOptions.length) {
      setSelectedChatIds([]);
    } else {
      setSelectedChatIds(chats.map((c) => c.id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111b21] w-full max-w-xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden text-[#111b21] dark:text-[#e9edef]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-[#f0f2f5]/50 dark:bg-[#202c33]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00a884]/10 text-[#00a884]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
                {isAr ? 'تصنيفات جهات الاتصال' : 'Contact Groups & Labels'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#00a884]/10 text-[#00a884] font-medium">
                  {contactGroups.length}
                </span>
              </h2>
              <p className="text-xs text-[#8696a0]">
                {isAr
                  ? 'تصنيف جهات الاتصال (مثل العائلة، العمل) وتصفية المحادثات بسهولة'
                  : 'Categorize contacts (e.g., Family, Work) and filter chats'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Header (if opened for a specific contact) */}
        {targetChat && viewMode === 'list' && (
          <div className="px-6 py-3 bg-[#00a884]/5 border-b border-[#00a884]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={targetChat.avatar}
                alt={targetChat.name}
                className="w-9 h-9 rounded-full object-cover border border-emerald-500/20"
              />
              <div>
                <span className="text-xs text-[#8696a0] block">
                  {isAr ? 'تخصيص تصنيفات لـ:' : 'Manage labels for:'}
                </span>
                <span className="text-sm font-semibold">{targetChat.name}</span>
              </div>
            </div>
            <span className="text-xs text-[#00a884] font-medium bg-[#00a884]/10 px-2 py-1 rounded-full">
              {contactGroups.filter((g) => g.chatIds.includes(targetChat.id)).length}{' '}
              {isAr ? 'تصنيفات نشطة' : 'active labels'}
            </span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {viewMode === 'list' ? (
            /* ================= VIEW: LIST OF GROUPS ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">
                  {isAr ? 'جميع التصنيفات المتاحة' : 'Available Groups'}
                </span>

                <button
                  type="button"
                  onClick={startCreateNew}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إنشاء تصنيف جديد' : 'New Group'}</span>
                </button>
              </div>

              {contactGroups.length === 0 ? (
                <div className="text-center py-10 px-4 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#00a884]/10 text-[#00a884] flex items-center justify-center mx-auto mb-3">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">
                    {isAr ? 'لا توجد تصنيفات حالياً' : 'No contact groups yet'}
                  </h3>
                  <p className="text-xs text-[#8696a0] max-w-xs mx-auto mb-4">
                    {isAr
                      ? 'أنشئ تصنيفات مثل العائلة أو العمل لتنظيم محادثاتك والوصول إليها بسرعة'
                      : 'Create labels like Family or Work to organize chats and find them faster'}
                  </p>
                  <button
                    type="button"
                    onClick={startCreateNew}
                    className="px-4 py-2 rounded-xl bg-[#00a884] text-white text-xs font-semibold hover:bg-[#008f6f] transition"
                  >
                    {isAr ? 'إنشاء تصنيفك الأول' : 'Create First Group'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {contactGroups.map((group) => {
                    const isFilterActive = selectedGroupId === group.id;
                    const isChatInThisGroup = targetChat
                      ? group.chatIds.includes(targetChat.id)
                      : false;
                    const memberChats = chats.filter((c) => group.chatIds.includes(c.id));

                    return (
                      <div
                        key={group.id}
                        className={`p-3.5 rounded-xl border transition flex flex-col gap-2.5 ${
                          isFilterActive
                            ? 'bg-[#00a884]/10 border-[#00a884]'
                            : 'bg-[#f0f2f5]/40 dark:bg-[#202c33]/40 border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {/* Group Info */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: group.color }}
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold truncate flex items-center gap-2">
                                {group.name}
                                {isFilterActive && (
                                  <span className="text-[10px] bg-[#00a884] text-white px-1.5 py-0.2 rounded-md font-normal">
                                    {isAr ? 'فلتر نشط' : 'Active'}
                                  </span>
                                )}
                              </h4>
                              <span className="text-xs text-[#8696a0] flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {group.chatIds.length}{' '}
                                {isAr ? 'جهات اتصال' : 'contacts'}
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* If viewing for a specific chat, toggle membership */}
                            {targetChat && onToggleChatInGroup && (
                              <button
                                type="button"
                                onClick={() => onToggleChatInGroup(group.id, targetChat.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                  isChatInThisGroup
                                    ? 'bg-[#00a884] text-white'
                                    : 'bg-black/5 dark:bg-white/10 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                                }`}
                              >
                                {isChatInThisGroup ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'مُضاف' : 'Added'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'إضافة' : 'Add'}</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Filter Chats Button */}
                            {onSelectGroupFilter && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectGroupFilter(isFilterActive ? null : group.id);
                                  onClose();
                                }}
                                className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                                  isFilterActive
                                    ? 'bg-[#00a884] text-white'
                                    : 'bg-black/5 dark:bg-white/10 text-[#8696a0] hover:text-[#00a884]'
                                }`}
                                title={
                                  isFilterActive
                                    ? isAr
                                      ? 'إلغاء الفلترة'
                                      : 'Clear Filter'
                                    : isAr
                                    ? 'فلترة المحادثات بهذا التصنيف'
                                    : 'Filter chats by this group'
                                }
                              >
                                <Filter className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Edit button */}
                            <button
                              type="button"
                              onClick={() => startEditGroup(group)}
                              className="p-1.5 rounded-lg text-[#8696a0] hover:text-[#111b21] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                              title={isAr ? 'تعديل التصنيف' : 'Edit group'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    isAr
                                      ? `هل أنت متأكد من حذف تصنيف "${group.name}"؟`
                                      : `Delete group "${group.name}"?`
                                  )
                                ) {
                                  onDeleteGroup(group.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-[#8696a0] hover:text-red-500 hover:bg-red-500/10 transition"
                              title={isAr ? 'حذف التصنيف' : 'Delete group'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Members Avatar Avatars Preview */}
                        {memberChats.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-1 border-t border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
                            <div className="flex -space-x-1.5 rtl:space-x-reverse overflow-hidden shrink-0">
                              {memberChats.slice(0, 5).map((m) => (
                                <img
                                  key={m.id}
                                  src={m.avatar}
                                  alt={m.name}
                                  title={m.name}
                                  className="inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#111b21] object-cover"
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-[#8696a0] truncate">
                              {memberChats
                                .slice(0, 3)
                                .map((m) => m.name.split(' ')[0])
                                .join('، ')}
                              {memberChats.length > 3
                                ? ` +${memberChats.length - 3}`
                                : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ================= VIEW: CREATE / EDIT GROUP FORM ================= */
            <form onSubmit={handleSave} className="space-y-5 animate-in fade-in duration-150">
              {/* Back to list button */}
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-1.5 text-xs text-[#8696a0] hover:text-[#00a884] transition"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isAr ? 'العودة إلى قائمة التصنيفات' : 'Back to groups list'}</span>
              </button>

              {/* Group Name */}
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] mb-1.5">
                  {isAr ? 'اسم التصنيف' : 'Group Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder={isAr ? 'مثال: العائلة، العمل، أصدقاء النادي...' : 'e.g. Family, Work, Gym...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#202c33] border border-black/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                />

                {/* Preset Suggestions */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[11px] text-[#8696a0]">
                    {isAr ? 'اقتراحات سريعة:' : 'Quick presets:'}
                  </span>
                  {(isAr ? PRESET_NAMES_AR : PRESET_NAMES_EN).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setGroupName(preset)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 hover:bg-[#00a884]/20 hover:text-[#00a884] transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Tag Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] mb-2">
                  {isAr ? 'لون الشارة / العلامة' : 'Color Tag'}
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {PRESET_COLORS.map((c) => {
                    const isSelected = groupColor === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setGroupColor(c.value)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                          isSelected ? 'scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#111b21] ring-black/30 dark:ring-white/50 shadow-md' : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Select Contacts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#8696a0]">
                    {isAr ? 'جهات الاتصال في هذا التصنيف' : 'Select Contacts'} ({selectedChatIds.length})
                  </label>

                  <button
                    type="button"
                    onClick={handleSelectAllMembers}
                    className="text-xs text-[#00a884] hover:underline font-semibold"
                  >
                    {selectedChatIds.length === chats.length
                      ? isAr
                        ? 'إلغاء تحديد الكل'
                        : 'Deselect All'
                      : isAr
                      ? 'تحديد الكل'
                      : 'Select All'}
                  </button>
                </div>

                {/* Search Contacts in picker */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-[#8696a0] absolute top-2.5 start-3" />
                  <input
                    type="text"
                    value={searchMemberQuery}
                    onChange={(e) => setSearchMemberQuery(e.target.value)}
                    placeholder={isAr ? 'بحث في الأسماء أو الأرقام...' : 'Search contacts...'}
                    className="w-full ps-9 pe-3 py-1.5 rounded-xl bg-[#f0f2f5] dark:bg-[#202c33] border border-black/5 dark:border-white/5 text-xs focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                  />
                </div>

                {/* Scrollable Contacts Checklist */}
                <div className="max-h-52 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 border border-black/10 dark:border-white/10 rounded-xl bg-[#f0f2f5]/30 dark:bg-[#202c33]/30">
                  {memberOptions.map((c) => {
                    const isSelected = selectedChatIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleChatSelection(c.id)}
                        className={`p-2.5 px-3 flex items-center justify-between cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-[#00a884]/10 dark:bg-[#00a884]/15'
                            : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block truncate">
                              {c.name}
                            </span>
                            <span className="text-[11px] text-[#8696a0] truncate block">
                              {c.isGroup ? (isAr ? 'مجموعة' : 'Group') : c.phone || c.about || ''}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 ms-2">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#00a884]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#8696a0]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim()}
                  className="px-5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingGroupId
                      ? isAr
                        ? 'حفظ التعديلات'
                        : 'Save Changes'
                      : isAr
                      ? 'إنشاء التصنيف'
                      : 'Create Group'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-black/10 dark:border-white/10 bg-[#f0f2f5]/30 dark:bg-[#202c33]/30 flex items-center justify-between text-xs text-[#8696a0]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00a884]" />
            {isAr
              ? 'يمكنك فلترة المحادثات مباشرة من الشريط الجانبي الأيسر'
              : 'Filter chats directly from the left sidebar pills'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#00a884] hover:underline"
          >
            {isAr ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
