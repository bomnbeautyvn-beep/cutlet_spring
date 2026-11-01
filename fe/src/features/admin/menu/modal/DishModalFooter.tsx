import React from 'react';

interface DishModalFooterProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DishModalFooter: React.FC<DishModalFooterProps> = ({
  isEditing,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="p-4 sm:p-5 border-t border-[#eae8e5] bg-[#fbf9f6] flex items-center justify-between">
      <div className="text-xs text-[#8f6f6c] hidden sm:block">
        All 4 languages (EN, KO, VI, JA) are strictly mandatory.
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#585757] hover:bg-[#eae8e5] rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Dish...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{isEditing ? 'Save Changes' : 'Create Dish'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

