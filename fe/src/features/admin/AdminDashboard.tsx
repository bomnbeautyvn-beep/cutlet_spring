import React, { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats } from '@/services/admin.service';
import { AdminSection } from '@/features/admin/AdminSidebar';

interface AdminDashboardProps {
  onNavigate: (section: AdminSection) => void;
  onOpenNewDish: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenNewDish,
}) => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    adminService
      .getDashboardStats()
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch((err) => console.error('Failed to load dashboard metrics:', err))
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-3 text-[#8f6f6c]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-wider font-bold">Loading Atelier Metrics...</span>
      </div>
    );
  }

  const sessionDisplay =
    stats?.currentSession === 'LUNCH'
      ? { label: 'Lunch Service Active', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' }
      : stats?.currentSession === 'DINNER'
      ? { label: 'Dinner Service Active', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' }
      : stats?.currentSession === 'AFTERNOON_PREP_BREAK'
      ? { label: 'Afternoon Kitchen Prep Break', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' }
      : { label: 'Atelier Currently Closed', color: 'bg-zinc-400', text: 'text-zinc-700', bg: 'bg-zinc-50 border-zinc-200' };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Live Service Status Banner */}
      <div className={`p-4 sm:p-6 rounded-2xl border ${sessionDisplay.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs`}>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className={`w-3.5 h-3.5 rounded-full ${sessionDisplay.color} inline-block`} />
            {stats?.isOpenNow && (
              <span className={`absolute w-3.5 h-3.5 rounded-full ${sessionDisplay.color} animate-ping opacity-75`} />
            )}
          </div>
          <div>
            <div className={`text-sm font-bold uppercase tracking-wider ${sessionDisplay.text}`}>
              {sessionDisplay.label}
            </div>
            <div className="text-xs text-[#585757] mt-0.5">
              Lunch: {stats?.lunchHours || '11:00 - 15:00'} • Dinner: {stats?.dinnerHours || '17:00 - 21:00'} (Last Order: {stats?.lastOrderTime || '20:30'})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('orders')}
            className="px-4 py-2 bg-white hover:bg-[#fbf9f6] text-[#1b1c1a] border border-[#eae8e5] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-[#af101a]">point_of_sale</span>
            <span>Walk-In Desk</span>
          </button>
          <button
            onClick={onOpenNewDish}
            className="px-4 py-2 bg-[#af101a] hover:bg-[#d32f2f] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Dish</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dishes */}
        <div
          onClick={() => onNavigate('menu')}
          className="p-5 bg-white rounded-2xl border border-[#eae8e5] shadow-xs hover:border-[#af101a]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8f6f6c] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Dishes Catalog</span>
            <span className="material-symbols-outlined text-[20px] text-[#af101a]">restaurant_menu</span>
          </div>
          <div className="font-price-numeral text-3xl font-black text-[#1b1c1a] leading-tight">
            {stats?.totalDishes ?? 0}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#585757]">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {stats?.activeDishes ?? 0} Active
            </span>
            <span>•</span>
            <span className="text-zinc-500 font-medium">
              {stats?.inactiveDishes ?? 0} Inactive
            </span>
          </div>
        </div>

        {/* Menu Categories */}
        <div
          onClick={() => onNavigate('menu')}
          className="p-5 bg-white rounded-2xl border border-[#eae8e5] shadow-xs hover:border-[#af101a]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8f6f6c] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
            <span className="material-symbols-outlined text-[20px] text-[#feae2c]">category</span>
          </div>
          <div className="font-price-numeral text-3xl font-black text-[#1b1c1a] leading-tight">
            {stats?.totalCategories ?? 0}
          </div>
          <div className="text-[11px] text-[#585757] mt-2">
            {stats?.activeCategories ?? 0} categories currently serving
          </div>
        </div>

        {/* Atelier Seating */}
        <div
          onClick={() => onNavigate('seating')}
          className="p-5 bg-white rounded-2xl border border-[#eae8e5] shadow-xs hover:border-[#af101a]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8f6f6c] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Capacity</span>
            <span className="material-symbols-outlined text-[20px] text-[#5b403d]">chair_alt</span>
          </div>
          <div className="font-price-numeral text-3xl font-black text-[#1b1c1a] leading-tight">
            {(stats?.capacityHall ?? 30) + (stats?.capacityCounter ?? 10)} Seats
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#585757]">
            <span className="font-bold text-[#af101a]">
              {stats?.capacityCounter ?? 10} Counter
            </span>
            <span>•</span>
            <span>{stats?.capacityHall ?? 30} Main Hall</span>
          </div>
        </div>

        {/* Staff & Admins */}
        <div
          onClick={() => onNavigate('accounts')}
          className="p-5 bg-white rounded-2xl border border-[#eae8e5] shadow-xs hover:border-[#af101a]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8f6f6c] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Staff Accounts</span>
            <span className="material-symbols-outlined text-[20px] text-[#af101a]">badge</span>
          </div>
          <div className="font-price-numeral text-3xl font-black text-[#1b1c1a] leading-tight">
            {stats?.totalAccounts ?? 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {stats?.activeAccounts ?? 0} Active Operators
          </div>
        </div>
      </div>

      {/* Category Distribution Grid */}
      <div className="p-6 bg-white rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-sm font-bold uppercase tracking-wider text-[#1b1c1a]">
            Catalog Distribution by Culinary Category
          </h3>
          <span className="text-xs text-[#8f6f6c]">
            Total {stats?.totalDishes ?? 0} items across {stats?.totalCategories ?? 0} categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats?.categoryDistribution &&
            Object.entries(stats.categoryDistribution).map(([catName, count]) => (
              <div
                key={catName}
                className="p-3.5 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#1b1c1a]">{catName}</div>
                  <div className="text-[10px] text-[#8f6f6c]">Prepared to order</div>
                </div>
                <div className="font-price-numeral text-lg font-black text-[#af101a]">
                  {count}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

