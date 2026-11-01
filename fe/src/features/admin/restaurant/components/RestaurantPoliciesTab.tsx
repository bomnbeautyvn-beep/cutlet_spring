import React from 'react';
import { RestaurantSettings } from '@/services/admin.service';

interface RestaurantPoliciesTabProps {
  formData: Partial<RestaurantSettings>;
  onChange: (field: keyof RestaurantSettings, value: any) => void;
}

export const RestaurantPoliciesTab: React.FC<RestaurantPoliciesTabProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Capacities */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Counter &amp; Dining Hall Capacities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Chef Counter Theater
            </label>
            <input
              type="number"
              value={formData.capacityCounter ?? 10}
              onChange={(e) => onChange('capacityCounter', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
            />
            <span className="text-[10px] text-[#8f6f6c]">Seats in front of open fryer</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Main Atelier Hall
            </label>
            <input
              type="number"
              value={formData.capacityHall ?? 30}
              onChange={(e) => onChange('capacityHall', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
            />
            <span className="text-[10px] text-[#8f6f6c]">Dining room table seating</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              Default Prep (Mins)
            </label>
            <input
              type="number"
              value={formData.defaultPrepMinutes ?? 18}
              onChange={(e) => onChange('defaultPrepMinutes', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
              VAT Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.vatRate ?? 8.0}
              onChange={(e) => onChange('vatRate', Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Policy: One Dish Per Guest */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Policy 1: One Main Dish Requirement (4 Languages)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="EN: One main dish requirement per seated guest"
            value={formData.policyOneDishEn || ''}
            onChange={(e) => onChange('policyOneDishEn', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="KO: 1인 1메뉴 주문 필수"
            value={formData.policyOneDishKr || ''}
            onChange={(e) => onChange('policyOneDishKr', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="VI: Mỗi thực khách dùng bữa tại chỗ vui lòng gọi tối thiểu một món chính"
            value={formData.policyOneDishVi || ''}
            onChange={(e) => onChange('policyOneDishVi', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="JA: ご着席のお客様1名様につきメインディッシュ1品のご注文をお願いしております"
            value={formData.policyOneDishJp || ''}
            onChange={(e) => onChange('policyOneDishJp', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
        </div>
      </div>

      {/* Policy: VAT Notice */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Policy 2: VAT Tax Notice (4 Languages)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="EN: 8% VAT is not included in list prices"
            value={formData.policyVatEn || ''}
            onChange={(e) => onChange('policyVatEn', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="KO: 메뉴 가격에 8% 부가세(VAT) 미포함"
            value={formData.policyVatKr || ''}
            onChange={(e) => onChange('policyVatKr', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="VI: Giá niêm yết chưa bao gồm 8% thuế GTGT (VAT)"
            value={formData.policyVatVi || ''}
            onChange={(e) => onChange('policyVatVi', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="JA: 表示価格には8%の付加価値税(VAT)は含まれておりません"
            value={formData.policyVatJp || ''}
            onChange={(e) => onChange('policyVatJp', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
        </div>
      </div>

      {/* Policy: Takeout Crispness */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
          Policy 3: Takeout Packaging &amp; Crispness Retention (4 Languages)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="EN: Takeout packaging retains crispness up to 30 mins"
            value={formData.policyTakeoutEn || ''}
            onChange={(e) => onChange('policyTakeoutEn', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="KO: 포장 주문 시 30분 동안 바삭한 식감이 유지됩니다"
            value={formData.policyTakeoutKr || ''}
            onChange={(e) => onChange('policyTakeoutKr', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="VI: Bao bì mang về giữ độ giòn tối ưu trong 30 phút"
            value={formData.policyTakeoutVi || ''}
            onChange={(e) => onChange('policyTakeoutVi', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
          <input
            type="text"
            placeholder="JA: テイクアウト包装は30分間サクサクの食感を保ちます"
            value={formData.policyTakeoutJp || ''}
            onChange={(e) => onChange('policyTakeoutJp', e.target.value)}
            className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

