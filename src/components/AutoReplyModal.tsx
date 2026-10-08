import React, { useState } from 'react';
import { X, Bot, Clock, Plus, Trash2, Check, Send } from 'lucide-react';
import { AutoReplyRule, ScheduledMessage, Chat } from '../types';

interface AutoReplyModalProps {
  isOpen: boolean;
  chats: Chat[];
  onClose: () => void;
  isAr?: boolean;
}

export const AutoReplyModal: React.FC<AutoReplyModalProps> = ({
  isOpen,
  chats,
  onClose,
  isAr = true,
}) => {
  const [activeTab, setActiveTab] = useState<'autoreply' | 'schedule'>('autoreply');

  // Auto-reply state
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(() => {
    return localStorage.getItem('wa_gold_autoreply_enabled') === 'true';
  });
  const [autoReplyText, setAutoReplyText] = useState(() => {
    return localStorage.getItem('wa_gold_autoreply_text') || 'أهلاً بك! أنا غير متاح حالياً، سأقوم بالرد عليك في أقرب وقت. (رد تلقائي من الواتس الذهبي 🤖)';
  });
  const [autoReplyDelay, setAutoReplyDelay] = useState(2);

  // Scheduled messages state
  const [scheduledList, setScheduledList] = useState<ScheduledMessage[]>(() => {
    const saved = localStorage.getItem('wa_gold_scheduled');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'sch-1',
            chatId: 'chat-1',
            contactName: 'أحمد محمد',
            text: 'كل عام وأنت بألف خير بمناسبة عيد الفطر المبارك! 🎉',
            time: 'غداً 08:00 ص',
            sent: false,
          },
        ];
  });

  const [newSchChatId, setNewSchChatId] = useState(chats[0]?.id || '');
  const [newSchText, setNewSchText] = useState('');
  const [newSchTime, setNewSchTime] = useState('اليوم 21:00');

  if (!isOpen) return null;

  const handleSaveAutoReply = () => {
    localStorage.setItem('wa_gold_autoreply_enabled', String(autoReplyEnabled));
    localStorage.setItem('wa_gold_autoreply_text', autoReplyText);
    alert(isAr ? 'تم حفظ إعدادات الرد التلقائي بنجاح!' : 'Auto-reply settings saved!');
  };

  const handleAddScheduled = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchText.trim()) return;
    const targetChat = chats.find((c) => c.id === newSchChatId);
    const item: ScheduledMessage = {
      id: `sch-${Date.now()}`,
      chatId: newSchChatId,
      contactName: targetChat?.name || 'محادثة',
      text: newSchText.trim(),
      time: newSchTime || 'اليوم',
      sent: false,
    };
    const updated = [...scheduledList, item];
    setScheduledList(updated);
    localStorage.setItem('wa_gold_scheduled', JSON.stringify(updated));
    setNewSchText('');
  };

  const handleDeleteScheduled = (id: string) => {
    const updated = scheduledList.filter((s) => s.id !== id);
    setScheduledList(updated);
    localStorage.setItem('wa_gold_scheduled', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-2xl w-full max-w-lg shadow-2xl border border-amber-500/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">
                {isAr ? 'الرد التلقائي والرسائل المجدولة' : 'Auto Reply & Scheduled Messages'}
              </h3>
              <p className="text-[11px] text-amber-100">
                {isAr ? 'أدوات ذكية متطورة لإدارة رسائلك' : 'Automate messages like a pro'}
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

        {/* Tab Buttons */}
        <div className="flex items-center bg-[#f4f4f5] dark:bg-[#202024] p-1.5 border-b border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('autoreply')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'autoreply'
                ? 'bg-amber-500 text-black shadow-xs'
                : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{isAr ? 'الرد التلقائي' : 'Auto Reply'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-amber-500 text-black shadow-xs'
                : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? 'الرسائل المجدولة' : 'Scheduled'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'autoreply' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-amber-700 dark:text-amber-300">
                    {isAr ? 'تشغيل الرد التلقائي على جميع الرسائل' : 'Enable Auto-Reply'}
                  </h4>
                  <p className="text-[11px] text-[#8696a0]">
                    {isAr ? 'يرد فوراً على أي محادثة واردة بالنص المخصص.' : 'Replies automatically to any incoming chat.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    autoReplyEnabled ? 'bg-amber-500' : 'bg-gray-400/40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      autoReplyEnabled ? 'start-6' : 'start-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
                  {isAr ? 'نص الرد التلقائي:' : 'Auto Reply Message:'}
                </label>
                <textarea
                  rows={4}
                  value={autoReplyText}
                  onChange={(e) => setAutoReplyText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4f4f5] dark:bg-[#242429] text-sm text-[#111b21] dark:text-[#f4f4f5] border border-amber-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8696a0] mb-1.5">
                  {isAr ? 'التأخير بالرد (ثواني):' : 'Reply delay (seconds):'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={autoReplyDelay}
                  onChange={(e) => setAutoReplyDelay(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-xl bg-[#f4f4f5] dark:bg-[#242429] text-sm text-center font-bold border border-amber-500/20"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveAutoReply}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition shadow-xs"
              >
                {isAr ? 'حفظ إعدادات الرد التلقائي' : 'Save Auto-Reply'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleAddScheduled} className="p-3.5 rounded-xl bg-black/5 dark:bg-[#242429] space-y-3 border border-amber-500/20">
                <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400">
                  {isAr ? 'جدولة رسالة جديدة' : 'Schedule New Message'}
                </h4>

                <div>
                  <label className="block text-[11px] text-[#8696a0] mb-1">
                    {isAr ? 'إرسال إلى:' : 'Send to:'}
                  </label>
                  <select
                    value={newSchChatId}
                    onChange={(e) => setNewSchChatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#18181b] text-xs font-semibold border border-amber-500/20 focus:outline-none"
                  >
                    {chats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8696a0] mb-1">
                    {isAr ? 'نص الرسالة المجدولة:' : 'Message:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'اكتب الرسالة المجدولة...' : 'Type message...'}
                    value={newSchText}
                    onChange={(e) => setNewSchText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#18181b] text-xs border border-amber-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#8696a0] mb-1">
                    {isAr ? 'موعد الإرسال:' : 'Time:'}
                  </label>
                  <input
                    type="text"
                    value={newSchTime}
                    onChange={(e) => setNewSchTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#18181b] text-xs font-mono border border-amber-500/20 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة إلى الرسائل المجدولة' : 'Add Scheduled Message'}</span>
                </button>
              </form>

              {/* List */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-[#8696a0] uppercase tracking-wider">
                  {isAr ? 'الرسائل المجدولة الحالية' : 'Scheduled Queue'} ({scheduledList.length})
                </h5>
                {scheduledList.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-3 rounded-xl bg-black/5 dark:bg-[#242429] flex items-center justify-between border border-black/5 dark:border-white/5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111b21] dark:text-[#f4f4f5]">
                          {sch.contactName}
                        </span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                          ⏰ {sch.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#8696a0] mt-0.5 truncate max-w-xs">
                        {sch.text}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteScheduled(sch.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
