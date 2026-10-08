import React, { useState } from 'react';
import { Search, Smile, ThumbsUp, Heart, Sparkles, Coffee, Lightbulb } from 'lucide-react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose?: () => void;
}

const EMOJI_CATEGORIES = [
  {
    id: 'smileys',
    name: 'الوجوه التعبيرية',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
      '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
      '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸',
      '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
      '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
      '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    ],
  },
  {
    id: 'gestures',
    name: 'الأيدي والإيماءات',
    icon: ThumbsUp,
    emojis: [
      '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘',
      '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖',
      '👋', '🤙', '🤝', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💪',
    ],
  },
  {
    id: 'hearts',
    name: 'القلوب والمشاعر',
    icon: Heart,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '✨',
      '💫', '⭐', '🌟', '💥', '🔥', '🎉', '🎊', '💯',
    ],
  },
  {
    id: 'food',
    name: 'الأطعمة والمشروبات',
    icon: Coffee,
    emojis: [
      '☕', '🍵', '🧋', '🥤', '🍕', '🍔', '🍟', '🌭', '🥪', '🌮',
      '🌯', '🥙', '🥗', '🥘', '🍲', '🍜', '🍝', '🍣', '🍱', '🍦',
      '🍰', '🎂', '🍩', '🍪', '🍫', '🍬', '🍭', '🍓', '🍎', '🍉',
    ],
  },
  {
    id: 'objects',
    name: 'الأشياء والرموز',
    icon: Lightbulb,
    emojis: [
      '💡', '📱', '💻', '⌚', '📷', '📹', '🎙️', '🎧', '🔑', '🔒',
      '🔔', '📌', '📍', '📎', '📁', '📂', '📅', '📝', '✉️', '📦',
      '🚀', '🚗', '✈️', '⚡', '☀️', '🌙', '⭐', '🌧️', '🏖️', '🏆',
    ],
  },
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  const [activeTab, setActiveTab] = useState('smileys');
  const [search, setSearch] = useState('');

  const currentCategory = EMOJI_CATEGORIES.find((c) => c.id === activeTab) || EMOJI_CATEGORIES[0];

  const filteredEmojis = search.trim()
    ? EMOJI_CATEGORIES.flatMap((c) => c.emojis)
    : currentCategory.emojis;

  return (
    <div className="w-[320px] sm:w-[360px] h-[340px] bg-[#ffffff] dark:bg-[#202c33] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col overflow-hidden animate-in fade-in duration-150 z-50">
      {/* Search Bar */}
      <div className="p-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2 bg-[#f0f2f5] dark:bg-[#111b21] px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-[#8696a0]" />
          <input
            type="text"
            placeholder="بحث عن رمز تعبيري..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] focus:outline-none"
          />
        </div>
      </div>

      {/* Categories Tabs (if not searching) */}
      {!search.trim() && (
        <div className="flex items-center justify-around px-2 py-1 bg-[#f0f2f5]/50 dark:bg-[#111b21]/50 border-b border-black/5 dark:border-white/5">
          {EMOJI_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`p-1.5 rounded-lg transition ${
                  isActive
                    ? 'text-[#00a884] bg-[#00a884]/10'
                    : 'text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                }`}
                title={cat.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-2 grid grid-cols-8 gap-1.5 text-2xl select-none content-start">
        {filteredEmojis.map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            type="button"
            onClick={() => onSelectEmoji(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition active:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
