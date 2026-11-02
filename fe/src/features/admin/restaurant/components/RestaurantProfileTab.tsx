import React from 'react';
import { RestaurantSettings } from '@/services/admin.service';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';

interface RestaurantProfileTabProps {
  formData: Partial<RestaurantSettings>;
  onChange?: (field: keyof RestaurantSettings, value: any) => void;
  onLogoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNavigateToHomepage?: () => void;
}

export const RestaurantProfileTab: React.FC<RestaurantProfileTabProps> = ({
  formData,
  onNavigateToHomepage,
}) => {
  return (
    <div className="space-y-6">
      {/* Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Toàn Bộ Website > Quản Lý Tập Trung Tại Homepage CMS"
        publicUrl="/"
        description="Để đảm bảo tính nhất quán và loại bỏ việc chỉnh sửa trùng lặp, toàn bộ thông tin nhận diện thương hiệu (Atelier Logo, Tên nhà hàng 4 ngôn ngữ, Slogan, Hotline, Email và Địa chỉ nhà hàng) hiện được quản lý tập trung tại [Homepage Management > Header & Footer]."
        previewHint="Mọi thay đổi lưu tại Homepage CMS sẽ tự động cập nhật đồng bộ cho cả thanh Header, Chân trang Footer, Khối Bản đồ và toàn bộ website Cutlet Spring."
      />

      {/* Sync Banner & Informational Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#eae8e5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-emerald-600">
                sync_saved_locally
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1b1c1a]">
                Thông Tin Thương Hiệu &amp; Nhận Diện (Đang Áp Dụng)
              </h3>
            </div>
            <p className="text-xs text-[#585757] mt-1">
              Dữ liệu này được đồng bộ từ Homepage CMS. Các trường nhập trùng lặp tại tab này đã được ẩn để tránh xung đột dữ liệu.
            </p>
          </div>

          {onNavigateToHomepage && (
            <button
              type="button"
              onClick={onNavigateToHomepage}
              className="px-4 py-2.5 bg-[#af101a] hover:bg-[#930010] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Chỉnh Sửa Tại Homepage CMS</span>
            </button>
          )}
        </div>

        {/* Read-only Data Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Logo */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8f6f6c] block mb-2">
              Atelier Logo
            </span>
            <div className="w-full h-14 flex items-center justify-center bg-white rounded-lg border border-[#eae8e5]/60 p-1">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-zinc-400 italic text-[11px]">Chưa tải lên logo</span>
              )}
            </div>
          </div>

          {/* Restaurant Names */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#8f6f6c] block">
              Tên Nhà Hàng (4 Ngôn Ngữ)
            </span>
            <div className="font-bold text-[#1b1c1a]">{formData.nameEn || 'CUTLET SPRING'} <span className="text-[10px] text-[#8f6f6c] font-normal">(EN)</span></div>
            <div className="text-[#585757] font-kr-serif">{formData.nameKr || '봄돈까스'} <span className="text-[10px] text-[#8f6f6c] font-normal">(KO)</span></div>
            <div className="text-[#585757] text-[11px]">{formData.nameVi || 'CUTLET SPRING'} <span className="text-[10px] text-[#8f6f6c] font-normal">(VI)</span></div>
            <div className="text-[#585757] text-[11px]">{formData.nameJp || 'カツスプリング'} <span className="text-[10px] text-[#8f6f6c] font-normal">(JA)</span></div>
          </div>

          {/* Contact */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#8f6f6c] block">
              Hotline &amp; Email Liên Hệ
            </span>
            <div className="font-mono font-bold text-[#af101a] text-sm">
              {formData.phoneNumber || '039 376 2717'}
            </div>
            <div className="text-[#585757] font-medium text-[11px]">
              {formData.email || 'contact@cutletspring.com'}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold uppercase mt-2">
              ✓ Đang hiển thị ở Header &amp; Footer
            </div>
          </div>

          {/* Address */}
          <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#8f6f6c] block">
              Địa Chỉ Thực Tế
            </span>
            <div className="text-[#1b1c1a] font-medium text-[11px] line-clamp-3">
              {formData.addressVi || formData.addressEn || '6A Đường số 9, P. Thảo Điền, TP. Thủ Đức, TP. HCM'}
            </div>
            <span className="text-[10px] text-[#8f6f6c] block mt-1">
              (Bao gồm bản dịch EN, KO, VI, JA)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

