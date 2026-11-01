import React from 'react';
import { Language, RestaurantSettings } from '@/types';

interface LocationMapSectionProps {
  language?: Language;
  restaurant?: RestaurantSettings;
}

export const LocationMapSection: React.FC<LocationMapSectionProps> = ({
  language = 'VI',
  restaurant,
}) => {
  const storeNameEn = restaurant?.nameEn || 'CUTLET SPRING';
  const storeNameKr = restaurant?.nameKr || '봄돈까스';

  const getStoreAddress = () => {
    if (!restaurant) return '6A Street 9, Thao Dien Ward, Thu Duc City, Ho Chi Minh City';
    switch (language) {
      case 'KR': return restaurant.addressKr || restaurant.addressEn;
      case 'VI': return restaurant.addressVi || restaurant.addressEn;
      case 'JP': return restaurant.addressJp || restaurant.addressEn;
      default: return restaurant.addressEn;
    }
  };

  const getClosedDays = () => {
    if (!restaurant) return 'Open Daily from Monday to Sunday';
    switch (language) {
      case 'KR': return restaurant.closedDaysKr || '연중무휴';
      case 'VI': return restaurant.closedDaysVi || 'Mở cửa cả tuần (Không ngày nghỉ)';
      case 'JP': return restaurant.closedDaysJp || '年中無休 (無休営業)';
      default: return restaurant.closedDaysEn || 'Open Daily (No Regular Closing Days)';
    }
  };

  const getPolicyOneDish = () => {
    if (!restaurant) return 'One main dish requirement per seated guest';
    switch (language) {
      case 'KR': return restaurant.policyOneDishKr || '1인 1메뉴 주문 필수';
      case 'VI': return restaurant.policyOneDishVi || 'Mỗi khách dùng bữa tại chỗ vui lòng gọi 1 món chính';
      case 'JP': return restaurant.policyOneDishJp || '1名様につきメインディッシュ1品のご注文をお願いしております';
      default: return restaurant.policyOneDishEn || 'One main dish requirement per seated guest';
    }
  };

  const lunchStart = restaurant?.openingHourLunchStart || '11:00';
  const lunchEnd = restaurant?.openingHourLunchEnd || '15:00';
  const dinnerStart = restaurant?.openingHourDinnerStart || '17:00';
  const dinnerEnd = restaurant?.openingHourDinnerEnd || '21:00';
  const lastOrder = restaurant?.lastOrderTime || '20:30';

  const googleMapsPlaceUrl =
    restaurant?.googleMapsUrl ||
    'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h';

  const embedMapUrl =
    restaurant?.googleMapsEmbedUrl ||
    'https://maps.google.com/maps?q=10.8037915,106.7449356+(%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring)&t=&z=17&ie=UTF8&iwloc=B&output=embed';

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=10.8037915,106.7449356`;

  return (
    <section className="w-full py-16 lg:py-24 border-b border-[#eae8e5] bg-[#f5f3f0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#eae8e5]">
          <div>
            <span className="font-label-md text-xs uppercase tracking-widest text-[#af101a] font-bold block mb-1">
              Atelier Location • Find Us
            </span>
            <h2 className="font-headline-lg text-3xl lg:text-4xl text-[#1b1c1a] font-bold tracking-tight">
              Our Thao Dien Atelier Map
              <span className="block font-title-lg text-base sm:text-lg text-[#5b403d] font-normal mt-1">
                Visit our artisan kitchen &amp; savor freshly fried, crispy Tonkatsu
              </span>
            </h2>
          </div>
          <p className="font-body-md text-xs sm:text-sm text-[#585757] max-w-md mt-4 md:mt-0 leading-relaxed">
            Located in the serene culinary hub of Thao Dien, Cutlet Spring welcomes you with a warm wooden ambience and an open counter theater kitchen.
          </p>
        </div>

        {/* Bento Grid: Info Box + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Store Details & Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-[#eae8e5] p-6 sm:p-8 shadow-xs">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-[#eae8e5]">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-lg font-bold text-[#1b1c1a]">{storeNameKr}</span>
                  <span className="font-label-md text-xs tracking-wider uppercase text-[#5b403d] font-semibold">
                    {storeNameEn} Thao Dien
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#af101a]/10 text-[#af101a] text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#af101a]"></span>
                  Walk-in Only
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#ffdad6]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#af101a]">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <h4 className="font-title-md text-xs uppercase tracking-wider font-bold text-[#1b1c1a]">
                    Store Address
                  </h4>
                  <p className="font-body-md text-xs sm:text-sm text-[#5b403d] mt-0.5 font-medium leading-relaxed">
                    {getStoreAddress()}
                  </p>
                </div>
              </div>

              {/* Service Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#feae2c]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#835500]">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <div>
                  <h4 className="font-title-md text-xs uppercase tracking-wider font-bold text-[#1b1c1a]">
                    Opening Hours
                  </h4>
                  <p className="font-body-md text-xs sm:text-sm text-[#5b403d] mt-0.5 font-medium leading-relaxed">
                    Lunch: {lunchStart} - {lunchEnd} <br />
                    Dinner: {dinnerStart} - {dinnerEnd} <br />
                    <span className="text-xs font-semibold text-[#af101a]">
                      Last Order: {lastOrder}
                    </span>
                  </p>
                  <span className="text-[11px] text-[#786659] block mt-1">
                    ({getClosedDays()})
                  </span>
                </div>
              </div>

              {/* Dining Policy */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#af101a]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#af101a]">
                  <span className="material-symbols-outlined text-[20px]">directions_walk</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-title-md text-xs uppercase tracking-wider font-bold text-[#1b1c1a]">
                      Service Policy
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#af101a] text-white uppercase tracking-wider">
                      Walk-in Only
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-[#5b403d] mt-1 leading-relaxed">
                    {getPolicyOneDish()}
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs: Directions + View on Maps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-[#eae8e5]">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#af101a] text-white hover:bg-[#930010] font-label-md text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <span className="material-symbols-outlined text-[18px]">directions</span>
                <span>Get Directions</span>
              </a>

              <a
                href={googleMapsPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] hover:bg-[#eae8e5] text-[#1b1c1a] font-label-md text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 text-center"
              >
                <span className="material-symbols-outlined text-[18px] text-[#af101a]">map</span>
                <span>View on Maps</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Iframe (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[380px] lg:min-h-full rounded-2xl overflow-hidden border border-[#eae8e5] bg-white shadow-xs relative">
            <iframe
              title="Cutlet Spring Thao Dien Google Maps"
              src={embedMapUrl}
              className="w-full h-full min-h-[380px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-[#eae8e5] flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-label-md text-[11px] font-bold text-[#1b1c1a]">
                Google Maps Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
