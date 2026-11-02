import React from 'react';
import { RestaurantSettings } from '@/services/admin.service';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';

interface RestaurantPoliciesTabProps {
  formData: Partial<RestaurantSettings>;
  onChange: (field: keyof RestaurantSettings, value: any) => void;
  onNavigateToHomepage?: () => void;
}

export const RestaurantPoliciesTab: React.FC<RestaurantPoliciesTabProps> = ({
  formData,
  onChange,
  onNavigateToHomepage,
}) => {
  return (
    <div className="space-y-6">
      {/* Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Vận Hành Nội Bộ & Hệ Thống Đặt Bàn / Tính Thuế VAT"
        description="Quản lý các thông số vận hành nội bộ: Sức chứa quầy bar bếp mở (Counter Theater), Chỗ ngồi sảnh chính (Main Hall), Thời gian chuẩn bị món ước tính mặc định, và Tỷ lệ thuế suất VAT (%) áp dụng tự động trong đơn hàng."
        previewHint="Các câu chữ giải thích chính sách (Quy định 1 món chính, Giải thích VAT, Hướng dẫn mang về) đã được chuyển sang quản lý tại [Homepage CMS > Header & Footer] để tránh trùng lặp."
      />

      {/* Capacities & Operating Metrics */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Sức Chứa Chỗ Ngồi &amp; Vận Hành Bếp (Operational Capacities)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Chef Counter Theater (Ghế)
            </label>
            <input
              type="number"
              value={formData.capacityCounter ?? 10}
              onChange={(e) => onChange('capacityCounter', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
            <span className="text-[10px] text-[#8f6f6c]">Ghế quầy bar trước bếp mở chiên katsu</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Main Atelier Hall (Ghế)
            </label>
            <input
              type="number"
              value={formData.capacityHall ?? 30}
              onChange={(e) => onChange('capacityHall', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
            <span className="text-[10px] text-[#8f6f6c]">Tổng số ghế bàn tại sảnh dùng bữa</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Default Prep (Phút)
            </label>
            <input
              type="number"
              value={formData.defaultPrepMinutes ?? 18}
              onChange={(e) => onChange('defaultPrepMinutes', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
            <span className="text-[10px] text-[#8f6f6c]">Thời gian chiên &amp; chuẩn bị set mặc định</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Thuế VAT Thực Tế (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.vatRate ?? 8.0}
              onChange={(e) => onChange('vatRate', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
            />
            <span className="text-[10px] text-[#8f6f6c]">Tỷ lệ thuế GTGT tính trong bill</span>
          </div>
        </div>
      </div>

      {/* Sync Notice for Text Policies */}
      <div className="bg-[#fbf9f6] border border-[#eae8e5] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[22px] text-emerald-600 shrink-0 mt-0.5">
            verified
          </span>
          <div>
            <div className="text-xs font-bold text-[#1b1c1a] uppercase tracking-wider">
              Nội Dung Chính Sách Dùng Bữa Đã Được Chuyển Sang Homepage CMS
            </div>
            <p className="text-xs text-[#585757] mt-1 leading-relaxed">
              Các câu chữ chính sách hiển thị cho thực khách (Quy định gọi 1 món chính / người, Ghi chú thuế VAT 8%, và Khuyến cáo độ giòn khi mang về trong 4 ngôn ngữ) hiện được quản lý tại <strong>Homepage CMS &gt; Header &amp; Footer</strong> để đảm bảo thống nhất một nguồn duy nhất.
            </p>
          </div>
        </div>

        {onNavigateToHomepage && (
          <button
            type="button"
            onClick={onNavigateToHomepage}
            className="px-4 py-2 bg-white hover:bg-[#eae8e5] text-[#1b1c1a] border border-[#eae8e5] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs shrink-0"
          >
            <span className="material-symbols-outlined text-[16px] text-[#af101a]">open_in_new</span>
            <span>Xem Tại Homepage CMS</span>
          </button>
        )}
      </div>
    </div>
  );
};

