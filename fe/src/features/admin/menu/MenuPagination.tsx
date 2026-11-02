import React from 'react';
import { PageResult } from '@/services/admin.service';
import { MenuItem } from '@/types';

interface MenuPaginationProps {
  pageResult: PageResult<MenuItem>;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const MenuPagination: React.FC<MenuPaginationProps> = ({
  pageResult,
  currentPage,
  onPageChange,
}) => {
  if (pageResult.totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-[#eae8e5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#585757] bg-[#fbf9f6]">
      <div className="font-medium text-xs">
        Showing page <span className="font-bold text-[#1b1c1a]">{pageResult.number + 1}</span> of{' '}
        <span className="font-bold text-[#1b1c1a]">{pageResult.totalPages}</span> (Total{' '}
        <span className="font-bold text-[#af101a]">{pageResult.totalElements}</span> dishes)
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-3.5 py-1.5 bg-white border border-[#cfcac2] hover:border-[#af101a] text-[#1b1c1a] rounded-lg font-bold text-xs hover:bg-[#f5f3f0] disabled:opacity-35 disabled:hover:border-[#cfcac2] disabled:hover:bg-white cursor-pointer transition-all shadow-xs flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          <span>Previous</span>
        </button>

        {/* Prominent Page Chip */}
        <div className="px-3 py-1.5 bg-[#af101a] text-white rounded-lg font-bold text-xs shadow-xs">
          Page {currentPage + 1} / {pageResult.totalPages}
        </div>

        <button
          onClick={() => onPageChange(Math.min(pageResult.totalPages - 1, currentPage + 1))}
          disabled={currentPage >= pageResult.totalPages - 1}
          className="px-3.5 py-1.5 bg-white border border-[#cfcac2] hover:border-[#af101a] text-[#1b1c1a] rounded-lg font-bold text-xs hover:bg-[#f5f3f0] disabled:opacity-35 disabled:hover:border-[#cfcac2] disabled:hover:bg-white cursor-pointer transition-all shadow-xs flex items-center gap-1"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
