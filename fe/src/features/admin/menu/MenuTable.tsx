import React from 'react';
import { MenuItem } from '@/types';
import { MenuTableRow } from './MenuTableRow';

interface MenuTableProps {
  dishes: MenuItem[];
  isLoading: boolean;
  togglingDishId: string | null;
  onToggleStatus: (dish: MenuItem) => void;
  onEdit: (dish: MenuItem) => void;
  onDelete: (dish: MenuItem) => void;
}

export const MenuTable: React.FC<MenuTableProps> = ({
  dishes,
  isLoading,
  togglingDishId,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-2 text-[#8f6f6c]">
        <div className="w-7 h-7 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-wider font-bold">
          Synchronizing Atelier Dishes...
        </span>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="py-16 text-center text-[#8f6f6c] text-xs">
        No dishes matching your current filter criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#f5f3f0] border-b border-[#eae8e5] text-[#585757] uppercase font-bold tracking-wider">
          <tr>
            <th className="py-3.5 px-4">Dish &amp; Translations</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Portion (EN / VI)</th>
            <th className="py-3.5 px-4">Price</th>
            <th className="py-3.5 px-4 text-center">Public Visibility</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eae8e5]">
          {dishes.map((dish) => (
            <MenuTableRow
              key={dish.id}
              dish={dish}
              isToggling={togglingDishId === dish.id}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

