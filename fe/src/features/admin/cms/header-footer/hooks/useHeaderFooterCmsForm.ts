import { useState, useEffect } from 'react';
import { HeaderFooterSettings, UpdateHeaderFooterRequest, Language } from '@/types';
import { cmsService } from '@/services/cms.service';

export function useHeaderFooterCmsForm() {
  const [settings, setSettings] = useState<HeaderFooterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<Language>('VI');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<UpdateHeaderFooterRequest>({
    phoneNumber: '039 376 2717',
    hotlineVisible: true,
    email: 'contact@cutletspring.com',
    brandNameEn: 'CUTLET SPRING',
    brandNameKr: '봄돈까스',
    brandNameVi: 'CUTLET SPRING',
    brandNameJp: 'カツスプリング',
    brandSloganEn: 'Artisanal Tonkatsu Atelier',
    brandSloganKr: '프리미엄 수제 돈카츠 아틀리에',
    brandSloganVi: 'Xưởng Nghệ Thuật Tonkatsu Thủ Công',
    brandSloganJp: '職人技が光る手作りとんかつアトリエ',
    footerAboutEn:
      'An artisanal Japanese-Korean Tonkatsu atelier crafting precision-fried golden cutlets with heritage culinary discipline.',
    footerAboutKr:
      '타협 없는 정통 기법과 엄선된 원육으로 빚어내는 프리미엄 일식-경양식 수제 돈카츠 아틀리에입니다.',
    footerAboutVi:
      'Nhà hàng Tonkatsu phong cách Nhật-Hàn thủ công, kết hợp tinh hoa ẩm thực truyền thống với tiêu chuẩn chiên giòn đỉnh cao.',
    footerAboutJp:
      '厳選された豚肉と職人技のパン粉づけで揚げる、日韓フュージョン本格手作りとんかつ専門店です。',
    addressEn: '6A Street 9, Thao Dien Ward, Thu Duc City, Ho Chi Minh City',
    addressKr: '호치민시 투득시 타오디엔 9번가 6A',
    addressVi: '6A Đường số 9, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
    addressJp: 'ホーチミン市トゥードゥック市タオディエン9番通り6A',
    closedDaysEn: 'Open Daily (No Regular Closing Days)',
    closedDaysKr: '연중무휴',
    closedDaysVi: 'Mở cửa cả tuần (Không ngày nghỉ)',
    closedDaysJp: '年中無休 (無休営業)',
    policyOneDishEn: 'One main dish requirement per seated guest',
    policyOneDishKr: '1인 1메뉴 주문 필수',
    policyOneDishVi: 'Mỗi thực khách dùng bữa tại chỗ vui lòng gọi tối thiểu một món chính',
    policyOneDishJp: 'ご着席のお客様1名様につきメインディッシュ1品のご注文をお願いしております',
    policyVatEn: '8% VAT is not included in list prices',
    policyVatKr: '메뉴 가격에 8% 부가세(VAT) 미포함',
    policyVatVi: 'Giá niêm yết chưa bao gồm 8% thuế GTGT (VAT)',
    policyVatJp: '表示価格には8%の付加価値税(VAT)は含まれておりません',
    policyTakeoutEn: 'Takeout packaging retains crispness up to 30 mins',
    policyTakeoutKr: '포장 주문 시 30분 동안 바삭한 식감이 유지됩니다',
    policyTakeoutVi: 'Bao bì mang về giữ độ giòn tối ưu trong 30 phút',
    policyTakeoutJp: 'テイクアウト包装は30分間サクサクの食感を保ちます',
    establishedYear: '2023',
    copyrightTextEn: '© 2025 CUTLET SPRING Atelier. All Rights Reserved.',
    copyrightTextKr: '© 2025 CUTLET SPRING 아틀리에. All Rights Reserved.',
    copyrightTextVi: '© 2025 Xưởng CUTLET SPRING. Bảo lưu mọi quyền.',
    copyrightTextJp: '© 2025 CUTLET SPRING アトリエ. 無断転載を禁じます。',
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getAdminHeaderFooter();
      setSettings(data);
      setFormData({
        phoneNumber: data.phoneNumber || '039 376 2717',
        hotlineVisible: data.hotlineVisible !== false,
        email: data.email || 'contact@cutletspring.com',
        brandNameEn: data.brandNameEn || 'CUTLET SPRING',
        brandNameKr: data.brandNameKr || '봄돈까스',
        brandNameVi: data.brandNameVi || 'CUTLET SPRING',
        brandNameJp: data.brandNameJp || 'カツスプリング',
        brandSloganEn: data.brandSloganEn || '',
        brandSloganKr: data.brandSloganKr || '',
        brandSloganVi: data.brandSloganVi || '',
        brandSloganJp: data.brandSloganJp || '',
        footerAboutEn: data.footerAboutEn || '',
        footerAboutKr: data.footerAboutKr || '',
        footerAboutVi: data.footerAboutVi || '',
        footerAboutJp: data.footerAboutJp || '',
        addressEn: data.addressEn || '',
        addressKr: data.addressKr || '',
        addressVi: data.addressVi || '',
        addressJp: data.addressJp || '',
        closedDaysEn: data.closedDaysEn || 'Open Daily',
        closedDaysKr: data.closedDaysKr || '연중무휴',
        closedDaysVi: data.closedDaysVi || 'Mở cửa hàng ngày',
        closedDaysJp: data.closedDaysJp || '年中無休',
        policyOneDishEn: data.policyOneDishEn || '',
        policyOneDishKr: data.policyOneDishKr || '',
        policyOneDishVi: data.policyOneDishVi || '',
        policyOneDishJp: data.policyOneDishJp || '',
        policyVatEn: data.policyVatEn || '',
        policyVatKr: data.policyVatKr || '',
        policyVatVi: data.policyVatVi || '',
        policyVatJp: data.policyVatJp || '',
        policyTakeoutEn: data.policyTakeoutEn || '',
        policyTakeoutKr: data.policyTakeoutKr || '',
        policyTakeoutVi: data.policyTakeoutVi || '',
        policyTakeoutJp: data.policyTakeoutJp || '',
        establishedYear: data.establishedYear || '2023',
        copyrightTextEn: data.copyrightTextEn || '',
        copyrightTextKr: data.copyrightTextKr || '',
        copyrightTextVi: data.copyrightTextVi || '',
        copyrightTextJp: data.copyrightTextJp || '',
      });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to load Header & Footer configuration', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const updated = await cmsService.updateAdminHeaderFooter(formData);
      setSettings(updated);
      setMessage({ text: 'Header & Footer settings updated successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({
        text: 'Failed to save Header/Footer changes. Please verify fields.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage(null);
      const updated = await cmsService.uploadHeaderLogo(file);
      setSettings(updated);
      setMessage({ text: 'Brand logo uploaded to Cloudinary successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to upload logo image', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    uploading,
    activeLangTab,
    setActiveLangTab,
    message,
    setMessage,
    formData,
    setFormData,
    handleSave,
    handleLogoUpload,
  };
}

