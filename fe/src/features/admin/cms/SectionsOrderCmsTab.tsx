import React, { useState, useEffect } from 'react';
import { HomepageSection, Language, UpdateHomepageSectionRequest } from '@/types';
import { cmsService } from '@/services/cms.service';

export const SectionsOrderCmsTab: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<Language>('VI');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getAdminSections();
      setSections(data);
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to load homepage sections', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Optimistically update
    setSections(reordered);

    try {
      const ids = reordered.map((s) => s.id);
      const updated = await cmsService.reorderAdminSections(ids);
      setSections(updated);
      setMessage({ text: 'Section order updated and saved successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to save section ordering', type: 'error' });
      loadSections();
    }
  };

  const handleToggleActive = async (sec: HomepageSection) => {
    try {
      setSavingId(sec.id);
      const payload: UpdateHomepageSectionRequest = {
        sectionKey: sec.sectionKey,
        titleEn: sec.titleEn,
        titleKr: sec.titleKr,
        titleVi: sec.titleVi,
        titleJp: sec.titleJp,
        subtitleEn: sec.subtitleEn,
        subtitleKr: sec.subtitleKr,
        subtitleVi: sec.subtitleVi,
        subtitleJp: sec.subtitleJp,
        displayOrder: sec.displayOrder,
        isActive: !sec.isActive,
      };
      const updated = await cmsService.updateAdminSection(sec.id, payload);
      setSections((prev) => prev.map((s) => (s.id === sec.id ? updated : s)));
      setMessage({
        text: `Section "${sec.titleEn}" is now ${updated.isActive ? 'ACTIVE' : 'HIDDEN'} on website`,
        type: 'success',
      });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to update section visibility', type: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      setSavingId(editingSection.id);
      const payload: UpdateHomepageSectionRequest = {
        sectionKey: editingSection.sectionKey,
        titleEn: editingSection.titleEn,
        titleKr: editingSection.titleKr,
        titleVi: editingSection.titleVi,
        titleJp: editingSection.titleJp,
        subtitleEn: editingSection.subtitleEn,
        subtitleKr: editingSection.subtitleKr,
        subtitleVi: editingSection.subtitleVi,
        subtitleJp: editingSection.subtitleJp,
        displayOrder: editingSection.displayOrder,
        isActive: editingSection.isActive,
      };
      const updated = await cmsService.updateAdminSection(editingSection.id, payload);
      setSections((prev) => prev.map((s) => (s.id === editingSection.id ? updated : s)));
      setEditingSection(null);
      setMessage({ text: `Section "${updated.titleEn}" titles updated successfully!`, type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to save section titles', type: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Section Configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs">
        <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
          Section Ordering &amp; Visibility Controls
        </h3>
        <p className="text-xs text-[#585757]">
          Adjust the presentation order and toggle the visibility of dynamic sections on the Cutlet Spring homepage
        </p>
      </div>

      {/* Reorderable Section List */}
      <div className="space-y-3">
        {sections.map((sec, index) => {
          const isBusy = savingId === sec.id;
          return (
            <div
              key={sec.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                sec.isActive ? 'border-[#eae8e5]' : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {/* Left Order Number & Icon */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#f5f3f0] border border-[#eae8e5] flex items-center justify-center font-bold text-xs text-[#1b1c1a] shrink-0">
                  #{index + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline-sm text-sm sm:text-base font-bold text-[#1b1c1a]">
                      {sec.titleVi}
                    </span>
                    <span className="text-xs text-[#af101a] font-semibold">({sec.titleEn})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eae8e5] text-[#5b403d] uppercase tracking-wider">
                      {sec.sectionKey}
                    </span>
                  </div>
                  <p className="text-xs text-[#786659] mt-0.5 truncate">
                    {sec.subtitleVi || sec.subtitleEn || 'No subtitle configured'}
                  </p>
                </div>
              </div>

              {/* Right Controls: Move Buttons, Toggle, and Edit */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {/* Move Up / Down */}
                <div className="inline-flex rounded-xl border border-[#eae8e5] p-0.5 bg-[#fbf9f6]">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-[#5b403d] hover:bg-[#eae8e5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1.5 rounded-lg text-[#5b403d] hover:bg-[#eae8e5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </button>
                </div>

                {/* Edit Titles Button */}
                <button
                  type="button"
                  onClick={() => setEditingSection(sec)}
                  className="px-3 py-1.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] hover:bg-[#eae8e5] text-xs font-bold text-[#1b1c1a] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit</span>
                </button>

                {/* Active Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sec.isActive}
                    disabled={isBusy}
                    onChange={() => handleToggleActive(sec)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#af101a]"></div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#eae8e5] overflow-hidden">
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
                onClick={() => setEditingSection(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#585757] hover:bg-[#eae8e5]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Language Switcher */}
              <div className="flex items-center justify-between border-b border-[#eae8e5] pb-2">
                <span className="text-xs font-bold text-[#5b403d] uppercase tracking-wider">
                  Select Language
                </span>
                <div className="inline-flex p-1 bg-[#f5f3f0] rounded-xl border border-[#eae8e5]">
                  {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLangTab(lang)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                      onChange={(e) => setEditingSection({ ...editingSection, titleVi: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5b403d] mb-1">Tiêu Đề Phụ (Subtitle VI)</label>
                    <input
                      type="text"
                      value={editingSection.subtitleVi || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, subtitleVi: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
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
                      onChange={(e) => setEditingSection({ ...editingSection, titleEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5b403d] mb-1">Subtitle (EN)</label>
                    <input
                      type="text"
                      value={editingSection.subtitleEn || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, subtitleEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                    />
                  </div>
                </div>
              )}

              {activeLangTab === 'KR' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5b403d] mb-1">섹션 타이틀 (KR) *</label>
                    <input
                      type="text"
                      value={editingSection.titleKr}
                      onChange={(e) => setEditingSection({ ...editingSection, titleKr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5b403d] mb-1">서브타이틀 (KR)</label>
                    <input
                      type="text"
                      value={editingSection.subtitleKr || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, subtitleKr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                    />
                  </div>
                </div>
              )}

              {activeLangTab === 'JP' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5b403d] mb-1">セクション名 (JP) *</label>
                    <input
                      type="text"
                      value={editingSection.titleJp}
                      onChange={(e) => setEditingSection({ ...editingSection, titleJp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5b403d] mb-1">サブ見出し (JP)</label>
                    <input
                      type="text"
                      value={editingSection.subtitleJp || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, subtitleJp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-xl border border-[#eae8e5] bg-white hover:bg-[#f5f3f0] text-[#5b403d] font-label-md text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingId !== null}
                  className="px-5 py-2 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

