import React from 'react';
import { HomepageSection } from '@/types';

interface SectionOrderItemProps {
  section: HomepageSection;
  index: number;
  totalSections: number;
  isBusy: boolean;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onEdit: (sec: HomepageSection) => void;
  onToggleActive: (sec: HomepageSection) => void;
}

export const SectionOrderItem: React.FC<SectionOrderItemProps> = ({
  section: sec,
  index,
  totalSections,
  isBusy,
  onMove,
  onEdit,
  onToggleActive,
}) => {
  return (
    <div
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
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            className="p-1.5 rounded-lg text-[#5b403d] hover:bg-[#eae8e5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Move Up"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 'down')}
            disabled={index === totalSections - 1}
            className="p-1.5 rounded-lg text-[#5b403d] hover:bg-[#eae8e5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Move Down"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
        </div>

        {/* Edit Titles Button */}
        <button
          type="button"
          onClick={() => onEdit(sec)}
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
            onChange={() => onToggleActive(sec)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#af101a]"></div>
        </label>
      </div>
    </div>
  );
};

