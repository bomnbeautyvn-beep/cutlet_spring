import React from 'react';
import { RestaurantSettings } from '@/services/admin.service';

interface RestaurantAddressCardProps {
  formData: Partial<RestaurantSettings>;
  onChange: (field: keyof RestaurantSettings, value: any) => void;
}

export const RestaurantAddressCard: React.FC<RestaurantAddressCardProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="bg-white p-6 rounded border border-[#eae8e5] shadow-xs space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
        Contact &amp; Physical Address (4 Languages)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Telephone Direct Line *
          </label>
          <input
            type="text"
            value={formData.phoneNumber || ''}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Contact Email *
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Address (EN) *
          </label>
          <input
            type="text"
            value={formData.addressEn || ''}
            onChange={(e) => onChange('addressEn', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            주소 (KO) *
          </label>
          <input
            type="text"
            value={formData.addressKr || ''}
            onChange={(e) => onChange('addressKr', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            Địa chỉ (VI) *
          </label>
          <input
            type="text"
            value={formData.addressVi || ''}
            onChange={(e) => onChange('addressVi', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
            住所 (JA) *
          </label>
          <input
            type="text"
            value={formData.addressJp || ''}
            onChange={(e) => onChange('addressJp', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded focus:outline-none focus:border-[#af101a]"
          />
        </div>
      </div>
    </div>
  );
};

