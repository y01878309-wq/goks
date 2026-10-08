import React, { useState } from 'react';
import { X, Plus, Trash2, BarChart2 } from 'lucide-react';
import { PollData } from '../types';

interface PollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (poll: PollData) => void;
}

export const PollModal: React.FC<PollModalProps> = ({ isOpen, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (text: string, index: number) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuestion = question.trim();
    const validOptions = options.map((o) => o.trim()).filter(Boolean);

    if (!cleanQuestion || validOptions.length < 2) return;

    onCreatePoll({
      question: cleanQuestion,
      options: validOptions.map((text, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text,
        votes: [],
      })),
      allowMultiple,
    });

    onClose();
    setQuestion('');
    setOptions(['', '']);
  };

  const isValid = question.trim().length > 0 && options.filter((o) => o.trim()).length >= 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#202c33] rounded-2xl w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 text-[#111b21] dark:text-[#e9edef] font-semibold text-base">
            <BarChart2 className="w-5 h-5 text-[#00a884]" />
            <span>إنشاء استطلاع رأي</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Question */}
          <div>
            <label className="block text-xs font-medium text-[#8696a0] mb-1.5">
              السؤال المطروح
            </label>
            <input
              type="text"
              required
              placeholder="اكتب سؤال الاستطلاع هنا..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] border border-transparent focus:border-[#00a884] focus:outline-none transition"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#8696a0] mb-1">
              الخيارات (خيارين على الأقل)
            </label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`الخيار ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#f0f2f5] dark:bg-[#111b21] text-sm text-[#111b21] dark:text-[#e9edef] border border-transparent focus:border-[#00a884] focus:outline-none transition"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-[#8696a0] hover:text-red-500 rounded-lg transition"
                    title="حذف الخيار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 8 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center gap-1.5 text-xs text-[#00a884] font-semibold py-1.5 hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة خيار آخر</span>
              </button>
            )}
          </div>

          {/* Multiple choices toggle */}
          <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs text-[#111b21] dark:text-[#e9edef]">
              السماح باختيار أكثر من إجابة
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={allowMultiple}
              onClick={() => setAllowMultiple(!allowMultiple)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                allowMultiple ? 'bg-[#00a884]' : 'bg-[#8696a0]/30'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  allowMultiple ? 'start-6' : 'start-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
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
              disabled={!isValid}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#00a884] text-white hover:bg-[#008f6f] disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition"
            >
              نشر الاستطلاع
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
