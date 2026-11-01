import React from 'react';
import { MenuItem } from '@/types';

interface DishDescriptionsProps {
  item: MenuItem;
  isFeatured?: boolean;
}

export const DishDescriptions: React.FC<DishDescriptionsProps> = ({ item, isFeatured }) => {
  if (isFeatured) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-sm leading-relaxed pt-3">
        {item.descriptionKr && (
          <div className="font-kr-serif text-[#1b1c1a] text-xs sm:text-sm leading-relaxed text-left">
            {item.descriptionKr}
          </div>
        )}
        {item.descriptionEn && (
          <div className="font-body-md text-[#2b2b2b] text-xs sm:text-sm leading-relaxed text-left">
            {item.descriptionEn}
          </div>
        )}
        {item.descriptionVi && (
          <div className="font-body-md text-[#2b2b2b] text-xs sm:text-sm leading-relaxed text-left">
            {item.descriptionVi}
          </div>
        )}
        {item.descriptionJp && (
          <div className="font-jp-serif text-[#1b1c1a] text-xs sm:text-sm leading-relaxed text-left">
            {item.descriptionJp}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="hidden md:block space-y-1.5 text-xs sm:text-sm leading-relaxed pt-3">
      {item.descriptionKr && (
        <div className="font-kr-serif text-[#1b1c1a] text-xs sm:text-sm leading-relaxed text-left">
          {item.descriptionKr}
        </div>
      )}
      {item.descriptionEn && (
        <div className="font-body-md text-[#2b2b2b] text-xs sm:text-sm leading-relaxed text-left">
          {item.descriptionEn}
        </div>
      )}
      {item.descriptionVi && (
        <div className="font-body-md text-[#585757] text-xs sm:text-sm leading-relaxed text-left italic">
          {item.descriptionVi}
        </div>
      )}
      {item.descriptionJp && (
        <div className="font-jp-serif text-[#585757] text-xs sm:text-sm leading-relaxed text-left">
          {item.descriptionJp}
        </div>
      )}
    </div>
  );
};

