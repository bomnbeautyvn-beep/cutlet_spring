import React from 'react';
import { useSectionsOrder } from './sections/hooks/useSectionsOrder';
import { SectionOrderItem } from './sections/components/SectionOrderItem';
import { SectionEditModal } from './sections/components/SectionEditModal';

export const SectionsOrderCmsTab: React.FC = () => {
  const {
    sections,
    loading,
    savingId,
    editingSection,
    activeLangTab,
    message,
    setEditingSection,
    setActiveLangTab,
    setMessage,
    handleMove,
    handleToggleActive,
    handleSaveEdit,
  } = useSectionsOrder();

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
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
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
        {sections.map((sec, index) => (
          <SectionOrderItem
            key={sec.id}
            section={sec}
            index={index}
            totalSections={sections.length}
            isBusy={savingId === sec.id}
            onMove={handleMove}
            onEdit={setEditingSection}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <SectionEditModal
          editingSection={editingSection}
          activeLangTab={activeLangTab}
          saving={savingId !== null}
          onClose={() => setEditingSection(null)}
          onTabChange={setActiveLangTab}
          onUpdateEditingSection={setEditingSection}
          onSubmit={handleSaveEdit}
        />
      )}
    </div>
  );
};
