import React, { useState } from 'react';
import { X, Search, Check, Sparkles, Download, Palette } from 'lucide-react';
import { GOLD_THEMES_CATALOG } from '../mockData';
import { GoldThemeId } from '../types';

interface GoldThemesStoreModalProps {
  isOpen: boolean;
  activeThemeId: GoldThemeId;
  onClose: () => void;
  onSelectTheme: (themeId: GoldThemeId) => void;
  isAr?: boolean;
}

export const GoldThemesStoreModal: React.FC<GoldThemesStoreModalProps> = ({
  isOpen,
  activeThemeId,
  onClose,
  onSelectTheme,
  isAr = true,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredThemes = GOLD_THEMES_CATALOG.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-2xl w-full max-w-2xl shadow-2xl border border-amber-500/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">
                {isAr ? 'متجر ثيمات الواتساب الذهبي (Gold Themes Store)' : 'GOLDThemes Store'}
              </h3>
              <p className="text-[11px] text-amber-100">
                {isAr ? 'آلاف الثيمات والمؤثرات مجاناً مع التثبيت الفوري' : 'Free custom themes with 1-click install'}
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

        {/* Search Bar */}
        <div className="p-3 border-b border-black/5 dark:border-white/5 bg-[#f4f4f5] dark:bg-[#202024]">
          <div className="flex items-center gap-2 bg-white dark:bg-[#18181b] px-3.5 py-2 rounded-xl border border-amber-500/20">
            <Search className="w-4 h-4 text-amber-500" />
            <input
              type="text"
              placeholder={isAr ? 'البحث في متجر ثيمات الذهبي...' : 'Search GOLDThemes Store...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#f4f4f5] focus:outline-none"
            />
          </div>
        </div>

        {/* Themes Grid / List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-black/5 dark:divide-white/5">
          {filteredThemes.map((theme) => {
            const isInstalled = activeThemeId === theme.id;
            return (
              <div
                key={theme.id}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                {/* Visual Preview Box */}
                <div className="flex items-center gap-3.5">
                  <div
                    style={{ backgroundColor: theme.headerBg }}
                    className="w-16 h-20 rounded-xl border-2 border-black/20 dark:border-white/10 flex flex-col overflow-hidden shadow-md shrink-0 relative"
                  >
                    <div
                      style={{ backgroundColor: theme.accentColor }}
                      className="h-3 w-full opacity-90"
                    />
                    <div
                      style={{ backgroundColor: theme.chatBg }}
                      className="flex-1 p-1 flex flex-col justify-end gap-1"
                    >
                      <div
                        style={{ backgroundColor: theme.accentColor }}
                        className="w-6 h-1.5 rounded-full ms-auto"
                      />
                      <div className="w-8 h-1.5 rounded-full bg-white/30" />
                    </div>
                    <span className="absolute top-1 end-1 text-[8px] px-1 py-0.2 bg-black/60 text-white rounded font-mono">
                      {theme.previewBadge}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#111b21] dark:text-[#f4f4f5]">
                        {theme.name}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {theme.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#8696a0] mt-0.5 line-clamp-1 max-w-sm">
                      {theme.description}
                    </p>
                    <span className="text-[10px] text-[#8696a0] mt-1 block">
                      📥 {theme.downloads} {isAr ? 'عملية تثبيت' : 'installs'}
                    </span>
                  </div>
                </div>

                {/* Install Button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme.id as GoldThemeId);
                    onClose();
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    isInstalled
                      ? 'bg-[#00a884] text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-black shadow-xs'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isAr ? 'مُثبت حالياً' : 'Applied'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تثبيت الثيم' : 'Install'}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
