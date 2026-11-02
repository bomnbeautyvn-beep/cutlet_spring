import React from 'react';
import { MenuBadge } from '@/types';

interface DishBadgesSectionProps {
  badges: MenuBadge[];
  loadingBadges?: boolean;
  selectedBadgeIds: string[];
  onToggleBadge: (badgeId: string) => void;
  // Optional spicy fine-tuning if spicy-glaze is selected
  isSpicySelected?: boolean;
  spiceLevel?: number;
  onSpiceLevelChange?: (level: number) => void;
  spiceNote?: string;
  onSpiceNoteChange?: (note: string) => void;
}

export const DishBadgesSection: React.FC<DishBadgesSectionProps> = ({
  badges,
  loadingBadges = false,
  selectedBadgeIds,
  onToggleBadge,
  isSpicySelected = false,
  spiceLevel = 1,
  onSpiceLevelChange,
  spiceNote = '',
  onSpiceNoteChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#eae8e5] p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-[#eae8e5]">
        <div>
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-[#1b1c1a]">
            Atelier Badges &amp; Dining Attributes
          </h3>
          <p className="text-[11px] sm:text-xs text-[#585757]">
            Select curated atelier badges loaded dynamically from the backend badge repository
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-[#8f6f6c] bg-[#f5f3f0] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-[#eae8e5]">
            {selectedBadgeIds.length} selected
          </span>
        </div>
      </div>

      {loadingBadges ? (
        <div className="flex items-center justify-center p-6 sm:p-8 text-[11px] sm:text-xs text-[#8f6f6c] gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
          <span>Loading dynamic badges...</span>
        </div>
      ) : badges.length === 0 ? (
        <div className="p-4 sm:p-6 text-center text-[11px] sm:text-xs text-[#8f6f6c] border border-dashed border-[#eae8e5] bg-[#fbf9f6] rounded-xl">
          No active badges found. Configure badges in the Atelier Badges tab.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {badges.map((badge) => {
            const isSelected = selectedBadgeIds.includes(badge.id);
            const iconName = badge.icon || (
              badge.code.includes('chef') ? 'restaurant' :
              badge.code.includes('best') ? 'stars' :
              badge.code.includes('limit') ? 'hourglass_top' :
              badge.code.includes('spic') ? 'local_fire_department' : 'label'
            );

            return (
              <div
                key={badge.id}
                onClick={() => onToggleBadge(badge.id)}
                className={`p-2.5 sm:p-3 border rounded-xl transition-all cursor-pointer select-none relative flex flex-col justify-between min-h-[72px] sm:min-h-[80px] ${
                  isSelected
                    ? 'bg-[#fbf9f6] border-[#af101a] ring-1 ring-[#af101a] shadow-xs'
                    : 'bg-white border-[#eae8e5] hover:border-[#cfcac2] hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        isSelected
                          ? 'bg-[#af101a] text-white shadow-xs'
                          : 'bg-[#f5f3f0] text-[#585757]'
                      }`}
                      style={{
                        backgroundColor: isSelected && badge.badgeColor ? badge.badgeColor : undefined,
                        color: isSelected && badge.badgeColor ? '#ffffff' : undefined,
                      }}
                    >
                      <span className="material-symbols-outlined text-[15px] sm:text-[17px]">{iconName}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] sm:text-xs text-[#1b1c1a] truncate" title={badge.name}>
                        {badge.name}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[#8f6f6c] font-mono truncate">
                        {badge.code}
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by parent onClick
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded text-[#af101a] accent-[#af101a] cursor-pointer mt-0.5 shrink-0"
                  />
                </div>

                {badge.description && (
                  <p className="text-[9px] sm:text-[10px] text-[#585757] line-clamp-2 mt-1.5 leading-tight">
                    {badge.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Spicy Options if Spicy Glaze / Spicy Badge is Selected */}
      {isSpicySelected && onSpiceLevelChange && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-[#fdf8f6] border border-[#f5d0c5] rounded-xl space-y-2.5 sm:space-y-3 animate-fade-in">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#b43419] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">local_fire_department</span>
            <span>Spicy Level Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Spice Level (1 - 5)
              </label>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onSpiceLevelChange(lvl)}
                    className={`flex-1 py-1 sm:py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      spiceLevel >= lvl
                        ? 'bg-[#af101a] text-white border-[#af101a] shadow-xs'
                        : 'bg-white text-[#585757] border-[#eae8e5] hover:bg-gray-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {onSpiceNoteChange && (
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  Spice Profile Note (Optional)
                </label>
                <input
                  type="text"
                  value={spiceNote}
                  onChange={(e) => onSpiceNoteChange(e.target.value)}
                  placeholder="e.g. Sốt ớt Togarashi cay nồng dịu nhẹ"
                  className="w-full px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#eae8e5] bg-white text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
