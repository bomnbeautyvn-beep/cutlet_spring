import React, { useEffect } from 'react';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  itemType?: string;
  warningMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = 'Xác Nhận Xóa',
  itemName,
  itemType,
  warningMessage,
  confirmLabel = 'Xóa Vĩnh Viễn',
  cancelLabel = 'Hủy Bỏ',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded max-w-md w-full border border-red-200 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 bg-red-50 text-red-900 flex items-center gap-3 border-b border-red-200">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 shrink-0">
            <span className="material-symbols-outlined text-[24px]">delete_forever</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm text-red-950 truncate">{title}</h3>
            <p className="text-[11px] text-red-700">Hành động nguy hiểm &amp; không thể hoàn tác</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-red-700/60 hover:text-red-900 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Đóng"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3.5">
          {itemName && (
            <div className="p-3 bg-[#fbf9f6] border border-[#eae8e5] rounded text-xs space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8f6f6c] block">
                {itemType ? `Đối tượng (${itemType})` : 'Mục được chọn:'}
              </span>
              <span className="font-bold text-[#1b1c1a] text-sm break-words block">
                {itemName}
              </span>
            </div>
          )}

          <p className="text-xs text-[#585757] leading-relaxed">
            {warningMessage ||
              'Bạn có chắc chắn muốn xóa mục này không? Thao tác này sẽ loại bỏ dữ liệu khỏi hệ thống và không thể phục hồi lại sau khi xác nhận.'}
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-[#fbf9f6] border-t border-[#eae8e5] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-bold text-[#585757] hover:bg-[#eae8e5] rounded transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang Xóa...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

