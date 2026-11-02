import React from 'react';
import { HomepageSection, Language } from '@/types';

interface SectionEditModalProps {
  editingSection: HomepageSection;
  activeLangTab: Language;
  saving: boolean;
  onClose: () => void;
  onTabChange: (lang: Language) => void;
  onUpdateEditingSection: (updated: HomepageSection) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SectionEditModal: React.FC<SectionEditModalProps> = ({
  editingSection,
  activeLangTab,
  saving,
  onClose,
  onTabChange,
  onUpdateEditingSection,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#eae8e5] overflow-hidden">
        <div className="p-6 border-b border-[#eae8e5] flex items-center justify-between bg-[#fbf9f6]">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-[#1b1c1a]">
              Edit Section Titles: {editingSection.sectionKey.toUpperCase()}
            </h3>
            <span className="text-xs text-[#585757]">
              Multilingual titles displayed on the public website header
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#585757] hover:bg-[#eae8e5]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Language Switcher */}
          <div className="flex items-center justify-between border-b border-[#eae8e5] pb-2">
            <span className="text-xs font-bold text-[#5b403d] uppercase tracking-wider">
              Select Language
            </span>
            <div className="inline-flex p-1 bg-[#f5f3f0] rounded border border-[#eae8e5]">
              {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onTabChange(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeLangTab === lang
                      ? 'bg-[#af101a] text-white shadow-xs'
                      : 'text-[#5b403d] hover:text-[#1b1c1a]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {activeLangTab === 'VI' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Tiêu Đề (VI) *</label>
                <input
                  type="text"
                  value={editingSection.titleVi}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, titleVi: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">
                  Tiêu Đề Phụ (Subtitle VI)
                </label>
                <input
                  type="text"
                  value={editingSection.subtitleVi || ''}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, subtitleVi: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>
          )}

          {activeLangTab === 'EN' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Title (EN) *</label>
                <input
                  type="text"
                  value={editingSection.titleEn}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, titleEn: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Subtitle (EN)</label>
                <input
                  type="text"
                  value={editingSection.subtitleEn || ''}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, subtitleEn: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>
          )}

          {activeLangTab === 'KR' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">
                  섹션 타이틀 (KR) *
                </label>
                <input
                  type="text"
                  value={editingSection.titleKr}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, titleKr: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">서브타이틀 (KR)</label>
                <input
                  type="text"
                  value={editingSection.subtitleKr || ''}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, subtitleKr: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>
          )}

          {activeLangTab === 'JP' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">
                  セクション名 (JP) *
                </label>
                <input
                  type="text"
                  value={editingSection.titleJp}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, titleJp: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">サブ見出し (JP)</label>
                <input
                  type="text"
                  value={editingSection.subtitleJp || ''}
                  onChange={(e) =>
                    onUpdateEditingSection({ ...editingSection, subtitleJp: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#eae8e5] bg-white hover:bg-[#f5f3f0] text-[#5b403d] font-label-md text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              Save Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

