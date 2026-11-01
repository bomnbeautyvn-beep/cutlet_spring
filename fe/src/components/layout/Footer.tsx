import React from 'react';
import { PageView, Language, HeaderFooterSettings } from '@/types';
import { useHeaderFooter } from '@/hooks/useHeaderFooter';

interface FooterProps {
  setCurrentView: (view: PageView) => void;
  onOpenReservation?: () => void;
  language?: Language;
  settings?: HeaderFooterSettings | null;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentView,
  language = 'VI',
  settings: propSettings,
}) => {
  const { settings: fetchedSettings } = useHeaderFooter();
  const settings = propSettings || fetchedSettings;

  const brandNameKr = settings?.brandNameKr || '봄돈까스';
  const brandNameEn = settings?.brandNameEn || 'CUTLET SPRING';

  const getAboutText = () => {
    if (!settings) return 'An artisanal Japanese-Korean Tonkatsu atelier crafting precision-fried golden cutlets with heritage culinary discipline.';
    switch (language) {
      case 'KR': return settings.footerAboutKr || settings.footerAboutEn;
      case 'VI': return settings.footerAboutVi || settings.footerAboutEn;
      case 'JP': return settings.footerAboutJp || settings.footerAboutEn;
      default: return settings.footerAboutEn;
    }
  };

  const getAddress = () => {
    if (!settings) return '6A Đường số 9, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh';
    switch (language) {
      case 'KR': return settings.addressKr || settings.addressEn;
      case 'VI': return settings.addressVi || settings.addressEn;
      case 'JP': return settings.addressJp || settings.addressEn;
      default: return settings.addressEn;
    }
  };

  const getPolicyOneDish = () => {
    if (!settings) return 'One main dish requirement per seated guest';
    switch (language) {
      case 'KR': return settings.policyOneDishKr || '1인 1메뉴 주문 필수';
      case 'VI': return settings.policyOneDishVi || 'Mỗi khách dùng bữa tại chỗ vui lòng gọi tối thiểu 1 món chính';
      case 'JP': return settings.policyOneDishJp || 'ご着席のお客様1名様につきメインディッシュ1品のご注文をお願いしております';
      default: return settings.policyOneDishEn || 'One main dish requirement per seated guest';
    }
  };

  const getPolicyVat = () => {
    if (!settings) return '8% VAT not included';
    switch (language) {
      case 'KR': return settings.policyVatKr || '8% 부가세(VAT) 미포함';
      case 'VI': return settings.policyVatVi || 'Giá niêm yết chưa bao gồm 8% thuế GTGT (VAT)';
      case 'JP': return settings.policyVatJp || '8%の付加価値税(VAT)は含まれておりません';
      default: return settings.policyVatEn || '8% VAT is not included';
    }
  };

  const getPolicyTakeout = () => {
    if (!settings) return 'Takeout packaging retains crispness up to 30 mins';
    switch (language) {
      case 'KR': return settings.policyTakeoutKr || '포장 주문 시 30분 동안 바삭한 식감이 유지됩니다';
      case 'VI': return settings.policyTakeoutVi || 'Bao bì mang về giữ độ giòn tối ưu trong 30 phút';
      case 'JP': return settings.policyTakeoutJp || 'テイクアウト包装は30分間サクサクの食感を保ちます';
      default: return settings.policyTakeoutEn || 'Takeout packaging retains crispness up to 30 mins';
    }
  };

  const getCopyright = () => {
    if (!settings) return '© 2025 CUTLET SPRING Atelier. All Rights Reserved.';
    switch (language) {
      case 'KR': return settings.copyrightTextKr || '© 2025 CUTLET SPRING 아틀리에. All Rights Reserved.';
      case 'VI': return settings.copyrightTextVi || '© 2025 Xưởng CUTLET SPRING. Bảo lưu mọi quyền.';
      case 'JP': return settings.copyrightTextJp || '© 2025 CUTLET SPRING アトリエ. 無断転載を禁じます。';
      default: return settings.copyrightTextEn || '© 2025 CUTLET SPRING Atelier. All Rights Reserved.';
    }
  };

  const phoneNumber = settings?.phoneNumber || '039 376 2717';
  const lunchHours = settings?.lunchHours || '11:00 - 15:00';
  const dinnerHours = settings?.dinnerHours || '17:00 - 21:00';
  const lastOrder = settings?.lastOrderTime || '20:30';
  const establishedYear = settings?.establishedYear || '2023';

  return (
    <footer className="w-full bg-[#f5f3f0] border-t border-[#e4e2df] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-xl font-bold text-[#1b1c1a]">{brandNameKr}</span>
              <span className="font-label-lg text-xs tracking-wider uppercase text-[#1b1c1a]">
                {brandNameEn}
              </span>
            </div>
            <p className="font-body-sm text-xs text-[#585757] leading-relaxed">
              {getAboutText()}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#eae8e5] text-[#5b403d] uppercase tracking-wider">
                Est. {establishedYear}
              </span>
            </div>
          </div>

          {/* Notice & Policy */}
          <div className="space-y-3">
            <span className="font-label-lg text-xs uppercase tracking-widest text-[#1b1c1a] font-bold block">
              Notice &amp; Policy
            </span>
            <ul className="font-body-sm text-xs text-[#5b403d] space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-[#af101a]">•</span>
                <span>{getPolicyOneDish()}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#af101a]">•</span>
                <span>{getPolicyVat()}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#af101a]">•</span>
                <span>{getPolicyTakeout()}</span>
              </li>
            </ul>
          </div>

          {/* Atelier Location */}
          <div className="space-y-3">
            <span className="font-label-lg text-xs uppercase tracking-widest text-[#1b1c1a] font-bold block">
              Atelier Location
            </span>
            <p className="font-body-sm text-xs text-[#5b403d] leading-relaxed">
              {getAddress()}
            </p>
          </div>

          {/* Gourmet Inquiries */}
          <div className="space-y-3">
            <span className="font-label-lg text-xs uppercase tracking-widest text-[#1b1c1a] font-bold block">
              Gourmet Inquiries
            </span>
            <p className="font-body-sm text-xs text-[#5b403d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#af101a]">phone</span>
              <span>Direct Line: {phoneNumber}</span>
            </p>
            <p className="font-body-sm text-xs text-[#5b403d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#585757]">schedule</span>
              <span>Service Hours: {lunchHours} | {dinnerHours} (Last Order: {lastOrder})</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar (Zero admin links) */}
        <div className="pt-6 border-t border-[#e4e2df] flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-xs text-[#585757]">
          <div className="flex items-center gap-2">
            <span>{getCopyright()}</span>
          </div>
          <div className="flex items-center gap-6 font-label-md text-xs uppercase tracking-wider">
            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#5b403d] hover:text-[#1b1c1a] transition-colors cursor-pointer"
            >
              Seasonal Cutlets
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
