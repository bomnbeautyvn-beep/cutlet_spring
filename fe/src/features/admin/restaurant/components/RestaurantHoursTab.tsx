import React from 'react';
import { RestaurantSettings } from '@/services/admin.service';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';

interface RestaurantHoursTabProps {
  formData: Partial<RestaurantSettings>;
  onChange: (field: keyof RestaurantSettings, value: any) => void;
}

export const RestaurantHoursTab: React.FC<RestaurantHoursTabProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Trang Chủ (Khối Bản Đồ/Địa Chỉ), Chân Trang Footer &amp; Popup Đặt Món"
        publicUrl="/#location"
        description="Hiển thị giờ phục vụ ca trưa (Lunch), ca tối (Dinner), giờ gọi món cuối cùng (Kitchen Last Call) và các ngày đóng cửa hàng tuần bằng 4 ngôn ngữ. Xuất hiện tại khối Bản đồ vị trí ở trang chủ, trong Chân trang Footer, và tại popup thông tin nhà hàng khi khách chọn món."
        previewHint="Giờ bếp nhận đơn cuối cùng (Kitchen Last Call) là mốc thời gian chốt đơn chiên trong ngày."
      />

      <div className="bg-white p-6 rounded border border-[#eae8e5] shadow-xs space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Service Shifts &amp; Kitchen Timings
        </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lunch */}
        <div className="p-4 bg-[#fbf9f6] rounded border border-[#eae8e5] space-y-3">
          <span className="block text-xs font-bold text-[#af101a] uppercase tracking-wider">
            Lunch Service Shift
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-[#585757] font-bold">Start</label>
              <input
                type="text"
                value={formData.openingHourLunchStart || '11:00'}
                onChange={(e) => onChange('openingHourLunchStart', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#585757] font-bold">End</label>
              <input
                type="text"
                value={formData.openingHourLunchEnd || '15:00'}
                onChange={(e) => onChange('openingHourLunchEnd', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded"
              />
            </div>
          </div>
        </div>

        {/* Dinner */}
        <div className="p-4 bg-[#fbf9f6] rounded border border-[#eae8e5] space-y-3">
          <span className="block text-xs font-bold text-[#af101a] uppercase tracking-wider">
            Dinner Service Shift
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-[#585757] font-bold">Start</label>
              <input
                type="text"
                value={formData.openingHourDinnerStart || '17:00'}
                onChange={(e) => onChange('openingHourDinnerStart', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#585757] font-bold">End</label>
              <input
                type="text"
                value={formData.openingHourDinnerEnd || '21:00'}
                onChange={(e) => onChange('openingHourDinnerEnd', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded"
              />
            </div>
          </div>
        </div>

        {/* Last Order */}
        <div className="p-4 bg-[#fbf9f6] rounded border border-[#eae8e5] space-y-3">
          <span className="block text-xs font-bold text-[#af101a] uppercase tracking-wider">
            Kitchen Last Call
          </span>
          <div>
            <label className="block text-[10px] text-[#585757] font-bold">Last Order Time</label>
            <input
              type="text"
              value={formData.lastOrderTime || '20:30'}
              onChange={(e) => onChange('lastOrderTime', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded"
            />
            <span className="text-[10px] text-[#8f6f6c] mt-1 block">Cutoff for kitchen frying tickets</span>
          </div>
        </div>
      </div>

      {/* Closed Days in 4 Languages */}
      <div className="pt-4 border-t border-[#eae8e5] space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
          Weekly Closing Days (4 Languages)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="EN: Open Daily"
            value={formData.closedDaysEn || ''}
            onChange={(e) => onChange('closedDaysEn', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded"
          />
          <input
            type="text"
            placeholder="KO: 연중무휴"
            value={formData.closedDaysKr || ''}
            onChange={(e) => onChange('closedDaysKr', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded"
          />
          <input
            type="text"
            placeholder="VI: Mở cửa hàng ngày"
            value={formData.closedDaysVi || ''}
            onChange={(e) => onChange('closedDaysVi', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded"
          />
          <input
            type="text"
            placeholder="JA: 年中無休"
            value={formData.closedDaysJp || ''}
            onChange={(e) => onChange('closedDaysJp', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded"
          />
        </div>
      </div>
    </div>
  </div>
  );
};

