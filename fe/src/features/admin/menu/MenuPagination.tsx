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
    <div className="p-4 border-t border-[#eae8e5] flex items-center justify-between text-xs text-[#585757] bg-[#fbf9f6]">
      <span>
        Showing page {pageResult.number + 1} of {pageResult.totalPages} (Total{' '}
        {pageResult.totalElements} dishes)
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-3 py-1.5 bg-white border border-[#eae8e5] rounded-lg font-bold text-xs hover:bg-[#eae8e5] disabled:opacity-40 cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(pageResult.totalPages - 1, currentPage + 1))}
          disabled={currentPage >= pageResult.totalPages - 1}
          className="px-3 py-1.5 bg-white border border-[#eae8e5] rounded-lg font-bold text-xs hover:bg-[#eae8e5] disabled:opacity-40 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

