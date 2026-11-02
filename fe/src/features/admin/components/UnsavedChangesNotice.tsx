import React, { useEffect } from 'react';

interface UnsavedChangesNoticeProps {
  isDirty: boolean;
  isSaving?: boolean;
  onSave?: (e: React.FormEvent | React.MouseEvent) => void;
  onDiscard?: () => void;
  saveButtonText?: string;
  variant?: 'inline' | 'floating' | 'modal';
  customMessage?: string;
}

export const UnsavedChangesNotice: React.FC<UnsavedChangesNoticeProps> = ({
  isDirty,
  isSaving = false,
  onSave,
  onDiscard,
  saveButtonText = 'Save Changes',
  variant = 'inline',
  customMessage,
}) => {
  // Warn browser before leaving if there are unsaved modifications
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (!isDirty) return null;

  const content = (
    <div
      className={`relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:px-4 sm:py-3 rounded border-2 border-amber-400 bg-amber-50/95 text-amber-950 shadow-lg backdrop-blur-xs animate-gentle-shake transition-all`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[19px] animate-pulse">lock</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
              Lưu ý thay đổi
            </span>
            <span className="text-xs font-bold text-amber-950">
              {customMessage || 'Có chỉnh sửa chưa được lưu!'}
            </span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
            Dữ liệu vừa thay đổi chưa được ghi nhận vào hệ thống. Vui lòng nhấn &quot;{saveButtonText}&quot; để hoàn tất.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 justify-end self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/60 w-full sm:w-auto">
        {onDiscard && (
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy thay đổi
          </button>
        )}
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#af101a] hover:bg-[#930010] text-white text-[11px] font-bold uppercase tracking-wider rounded shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-md"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px]">save</span>
                <span>{saveButtonText}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl">
        {content}
      </div>
    );
  }

  return <div className="w-full my-3">{content}</div>;
};

