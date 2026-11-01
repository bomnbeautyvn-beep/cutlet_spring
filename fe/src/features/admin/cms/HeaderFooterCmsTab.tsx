import React, { useState, useEffect } from 'react';
import { HeaderFooterSettings, UpdateHeaderFooterRequest, Language } from '@/types';
import { cmsService } from '@/services/cms.service';

export const HeaderFooterCmsTab: React.FC = () => {
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
    footerAboutEn: 'An artisanal Japanese-Korean Tonkatsu atelier crafting precision-fried golden cutlets with heritage culinary discipline.',
    footerAboutKr: '타협 없는 정통 기법과 엄선된 원육으로 빚어내는 프리미엄 일식-경양식 수제 돈카츠 아틀리에입니다.',
    footerAboutVi: 'Nhà hàng Tonkatsu phong cách Nhật-Hàn thủ công, kết hợp tinh hoa ẩm thực truyền thống với tiêu chuẩn chiên giòn đỉnh cao.',
    footerAboutJp: '厳選された豚肉と職人技のパン粉づけで揚げる、日韓フュージョン本格手作りとんかつ専門店です。',
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
        closedDaysVi: data.closedDaysVi || 'Mở cửa cả tuần',
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
        copyrightTextEn: data.copyrightTextEn || '© 2025 CUTLET SPRING Atelier. All Rights Reserved.',
        copyrightTextKr: data.copyrightTextKr || '© 2025 CUTLET SPRING 아틀리에. All Rights Reserved.',
        copyrightTextVi: data.copyrightTextVi || '© 2025 Xưởng CUTLET SPRING. Bảo lưu mọi quyền.',
        copyrightTextJp: data.copyrightTextJp || '© 2025 CUTLET SPRING アトリエ. 無断転載を禁じます。',
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
      setMessage({ text: 'Header & Footer configuration saved successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to save Header & Footer configuration', type: 'error' });
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
      setMessage({ text: 'Atelier brand logo uploaded to Cloudinary successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to upload logo to Cloudinary', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Header &amp; Footer Settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Strict Security Badge */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-amber-700">security</span>
        <span>
          <strong>Security Policy:</strong> The Admin Portal is private and will NEVER appear in the public website header or footer.
        </span>
      </div>

      {/* Logo & Hotline Configuration */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Brand Logo Upload Frame */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="w-full h-36 rounded-xl bg-[#f5f3f0] border border-[#eae8e5] p-4 flex items-center justify-center relative overflow-hidden group">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Brand Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-[#8f6f6c]">
                <span className="material-symbols-outlined text-[32px] block">branding_watermark</span>
                <span className="text-xs font-semibold">No Logo Uploaded</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </div>
            )}
          </div>

          <label className="mt-3 w-full py-2 px-3 border border-[#eae8e5] bg-[#f5f3f0] hover:bg-[#eae8e5] rounded-xl text-xs font-bold text-[#1b1c1a] text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-[#af101a]">cloud_upload</span>
            <span>{uploading ? 'Uploading...' : 'Replace Brand Logo'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Hotline & Established Controls */}
        <div className="md:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Direct Hotline (Phone Number)
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-bold focus:outline-none focus:border-[#af101a]"
                placeholder="039 376 2717"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Established Year
              </label>
              <input
                type="text"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
                placeholder="2023"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#f5f3f0] rounded-xl border border-[#eae8e5]">
            <div>
              <span className="text-xs font-bold text-[#1b1c1a] block">Show Hotline in Public Header</span>
              <span className="text-[11px] text-[#585757]">
                Displays direct phone call pill in the right corner of the navigation bar
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hotlineVisible}
                onChange={(e) => setFormData({ ...formData, hotlineVisible: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#af101a]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Multilingual Content Tabs */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
          <div>
            <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
              Multilingual Policies &amp; Brand Descriptions
            </h3>
            <p className="text-xs text-[#585757]">
              Notice rules (1-dish requirement, VAT notice, takeout crispness) and copyright texts
            </p>
          </div>

          {/* Language Switcher */}
          <div className="inline-flex p-1 bg-[#f5f3f0] rounded-xl border border-[#eae8e5]">
            {(['VI', 'EN', 'KR', 'JP'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLangTab(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === lang
                    ? 'bg-[#af101a] text-white shadow-xs'
                    : 'text-[#5b403d] hover:text-[#1b1c1a]'
                }`}
              >
                {lang === 'VI' && '🇻🇳 Tiếng Việt'}
                {lang === 'EN' && '🇺🇸 English'}
                {lang === 'KR' && '🇰🇷 한국어'}
                {lang === 'JP' && '🇯🇵 日本語'}
              </button>
            ))}
          </div>
        </div>

        {/* Vietnamese */}
        {activeLangTab === 'VI' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Tên Thương Hiệu (VI) *</label>
                <input
                  type="text"
                  value={formData.brandNameVi}
                  onChange={(e) => setFormData({ ...formData, brandNameVi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Khẩu Hiệu / Slogan (VI)</label>
                <input
                  type="text"
                  value={formData.brandSloganVi || ''}
                  onChange={(e) => setFormData({ ...formData, brandSloganVi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Đoạn Văn Giới Thiệu Chân Trang (Footer About VI)</label>
              <textarea
                rows={2}
                value={formData.footerAboutVi || ''}
                onChange={(e) => setFormData({ ...formData, footerAboutVi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Chính Sách 1 Món / Khách (VI)</label>
                <input
                  type="text"
                  value={formData.policyOneDishVi || ''}
                  onChange={(e) => setFormData({ ...formData, policyOneDishVi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Quy Định Thuế VAT (VI)</label>
                <input
                  type="text"
                  value={formData.policyVatVi || ''}
                  onChange={(e) => setFormData({ ...formData, policyVatVi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Quy Định Đồ Mang Về (VI)</label>
                <input
                  type="text"
                  value={formData.policyTakeoutVi || ''}
                  onChange={(e) => setFormData({ ...formData, policyTakeoutVi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Văn Bản Bản Quyền (Copyright Text VI)</label>
              <input
                type="text"
                value={formData.copyrightTextVi || ''}
                onChange={(e) => setFormData({ ...formData, copyrightTextVi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>
        )}

        {/* English */}
        {activeLangTab === 'EN' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Brand Name (EN) *</label>
                <input
                  type="text"
                  value={formData.brandNameEn}
                  onChange={(e) => setFormData({ ...formData, brandNameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Brand Slogan (EN)</label>
                <input
                  type="text"
                  value={formData.brandSloganEn || ''}
                  onChange={(e) => setFormData({ ...formData, brandSloganEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Footer About Description (EN)</label>
              <textarea
                rows={2}
                value={formData.footerAboutEn || ''}
                onChange={(e) => setFormData({ ...formData, footerAboutEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">One Main Dish Rule (EN)</label>
                <input
                  type="text"
                  value={formData.policyOneDishEn || ''}
                  onChange={(e) => setFormData({ ...formData, policyOneDishEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">VAT Policy Notice (EN)</label>
                <input
                  type="text"
                  value={formData.policyVatEn || ''}
                  onChange={(e) => setFormData({ ...formData, policyVatEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">Takeout Packaging Policy (EN)</label>
                <input
                  type="text"
                  value={formData.policyTakeoutEn || ''}
                  onChange={(e) => setFormData({ ...formData, policyTakeoutEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">Copyright Text (EN)</label>
              <input
                type="text"
                value={formData.copyrightTextEn || ''}
                onChange={(e) => setFormData({ ...formData, copyrightTextEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>
        )}

        {/* Korean */}
        {activeLangTab === 'KR' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">브랜드명 (KR) *</label>
                <input
                  type="text"
                  value={formData.brandNameKr}
                  onChange={(e) => setFormData({ ...formData, brandNameKr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">브랜드 슬로건 (KR)</label>
                <input
                  type="text"
                  value={formData.brandSloganKr || ''}
                  onChange={(e) => setFormData({ ...formData, brandSloganKr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">푸터 브랜드 소개 (KR)</label>
              <textarea
                rows={2}
                value={formData.footerAboutKr || ''}
                onChange={(e) => setFormData({ ...formData, footerAboutKr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">1인 1메뉴 정책 (KR)</label>
                <input
                  type="text"
                  value={formData.policyOneDishKr || ''}
                  onChange={(e) => setFormData({ ...formData, policyOneDishKr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">부가세 정책 안내 (KR)</label>
                <input
                  type="text"
                  value={formData.policyVatKr || ''}
                  onChange={(e) => setFormData({ ...formData, policyVatKr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">포장 정책 안내 (KR)</label>
                <input
                  type="text"
                  value={formData.policyTakeoutKr || ''}
                  onChange={(e) => setFormData({ ...formData, policyTakeoutKr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">저작권 표기 (KR)</label>
              <input
                type="text"
                value={formData.copyrightTextKr || ''}
                onChange={(e) => setFormData({ ...formData, copyrightTextKr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>
        )}

        {/* Japanese */}
        {activeLangTab === 'JP' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">ブランド名 (JP) *</label>
                <input
                  type="text"
                  value={formData.brandNameJp}
                  onChange={(e) => setFormData({ ...formData, brandNameJp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">スローガン (JP)</label>
                <input
                  type="text"
                  value={formData.brandSloganJp || ''}
                  onChange={(e) => setFormData({ ...formData, brandSloganJp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">フッター店舗紹介 (JP)</label>
              <textarea
                rows={2}
                value={formData.footerAboutJp || ''}
                onChange={(e) => setFormData({ ...formData, footerAboutJp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">ワンオーダー制規約 (JP)</label>
                <input
                  type="text"
                  value={formData.policyOneDishJp || ''}
                  onChange={(e) => setFormData({ ...formData, policyOneDishJp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">VAT税規定 (JP)</label>
                <input
                  type="text"
                  value={formData.policyVatJp || ''}
                  onChange={(e) => setFormData({ ...formData, policyVatJp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] mb-1">テイクアウト規定 (JP)</label>
                <input
                  type="text"
                  value={formData.policyTakeoutJp || ''}
                  onChange={(e) => setFormData({ ...formData, policyTakeoutJp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] mb-1">著作権表記 (JP)</label>
              <input
                type="text"
                value={formData.copyrightTextJp || ''}
                onChange={(e) => setFormData({ ...formData, copyrightTextJp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
        <button
          type="button"
          onClick={loadSettings}
          className="px-5 py-2.5 rounded-xl border border-[#eae8e5] bg-white hover:bg-[#f5f3f0] text-[#5b403d] font-label-md text-xs font-bold transition-colors cursor-pointer"
        >
          Reset Unsaved
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Header &amp; Footer Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

