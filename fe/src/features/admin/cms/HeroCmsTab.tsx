import React, { useState, useEffect } from 'react';
import { cmsService } from '@/services/cms.service';
import { HomepageHero, UpdateHomepageHeroRequest, Language } from '@/types';

export const HeroCmsTab: React.FC = () => {
  const [hero, setHero] = useState<HomepageHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<Language>('VI');

  // Form states
  const [formData, setFormData] = useState<UpdateHomepageHeroRequest>({
    titleEn: '',
    titleKr: '',
    titleVi: '',
    titleJp: '',
    headlineEn: '',
    headlineKr: '',
    headlineVi: '',
    headlineJp: '',
    taglineEn: '',
    taglineKr: '',
    taglineVi: '',
    taglineJp: '',
    descriptionEn: '',
    descriptionKr: '',
    descriptionVi: '',
    descriptionJp: '',
    ctaTextEn: '',
    ctaTextKr: '',
    ctaTextVi: '',
    ctaTextJp: '',
    ctaTarget: 'menu',
    badgeTextEn: 'Established 2023',
    badgeTextKr: '2023년 개업',
    badgeTextVi: 'Thành lập 2023',
    badgeTextJp: '2023年創業',
    dishTitleEn: 'Signature Hire Katsu Medallion',
    dishTitleKr: '시그니처 히레카츠 메달리온',
    dishTitleVi: 'Mề Đay Tonkatsu Nạc Lưng Đặc Trưng',
    dishTitleJp: '極上ヒレカツ メダリオン',
    dishDescEn: 'Natural Rosy Hue · 100% Fully Cooked',
    dishDescKr: '자연스러운 선홍빛 · 100% 완벽한 조리',
    dishDescVi: 'Sắc hồng tự nhiên · Chín chuẩn 100%',
    dishDescJp: '自然な桜色 · 100%芯まで火入れ',
    metric1Value: '120h',
    metric1LabelEn: 'Wet-Aged Chilled Pork',
    metric1LabelKr: '120시간 습식숙성 냉장육',
    metric1LabelVi: 'Thịt heo mát ủ 120 giờ',
    metric1LabelJp: '120時間熟成チルドポーク',
    metric2Value: '100%',
    metric2LabelEn: 'Never Frozen Quality',
    metric2LabelKr: '비냉동 최상급 원육',
    metric2LabelVi: 'Tuyệt đối không đông lạnh',
    metric2LabelJp: '完全非冷凍のこだわり',
    metric3Value: 'Daily',
    metric3LabelEn: 'Fresh Bakery Panko',
    metric3LabelKr: '매일 새벽 직접 구운 빵가루',
    metric3LabelVi: 'Bột chiên tươi nướng mỗi sáng',
    metric3LabelJp: '毎朝焼き上げる生パン粉',
    isActive: true,
  });

  const loadHero = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getAdminHero();
      setHero(data);
      setFormData({
        titleEn: data.titleEn || '',
        titleKr: data.titleKr || '',
        titleVi: data.titleVi || '',
        titleJp: data.titleJp || '',
        headlineEn: data.headlineEn || '',
        headlineKr: data.headlineKr || '',
        headlineVi: data.headlineVi || '',
        headlineJp: data.headlineJp || '',
        taglineEn: data.taglineEn || '',
        taglineKr: data.taglineKr || '',
        taglineVi: data.taglineVi || '',
        taglineJp: data.taglineJp || '',
        descriptionEn: data.descriptionEn || '',
        descriptionKr: data.descriptionKr || '',
        descriptionVi: data.descriptionVi || '',
        descriptionJp: data.descriptionJp || '',
        ctaTextEn: data.ctaTextEn || '',
        ctaTextKr: data.ctaTextKr || '',
        ctaTextVi: data.ctaTextVi || '',
        ctaTextJp: data.ctaTextJp || '',
        ctaTarget: data.ctaTarget || 'menu',
        badgeTextEn: data.badgeTextEn || 'Established 2023',
        badgeTextKr: data.badgeTextKr || '2023년 개업',
        badgeTextVi: data.badgeTextVi || 'Thành lập 2023',
        badgeTextJp: data.badgeTextJp || '2023年創業',
        dishTitleEn: data.dishTitleEn || 'Signature Hire Katsu Medallion',
        dishTitleKr: data.dishTitleKr || '시그니처 히레카츠 메달리온',
        dishTitleVi: data.dishTitleVi || 'Mề Đay Tonkatsu Nạc Lưng Đặc Trưng',
        dishTitleJp: data.dishTitleJp || '極上ヒレカツ メダリオン',
        dishDescEn: data.dishDescEn || 'Natural Rosy Hue · 100% Fully Cooked',
        dishDescKr: data.dishDescKr || '자연스러운 선홍빛 · 100% 완벽한 조리',
        dishDescVi: data.dishDescVi || 'Sắc hồng tự nhiên · Chín chuẩn 100%',
        dishDescJp: data.dishDescJp || '自然な桜色 · 100%芯まで火入れ',
        metric1Value: data.metric1Value || '120h',
        metric1LabelEn: data.metric1LabelEn || 'Wet-Aged Chilled Pork',
        metric1LabelKr: data.metric1LabelKr || '120시간 습식숙성 냉장육',
        metric1LabelVi: data.metric1LabelVi || 'Thịt heo mát ủ 120 giờ',
        metric1LabelJp: data.metric1LabelJp || '120時間熟成チルドポーク',
        metric2Value: data.metric2Value || '100%',
        metric2LabelEn: data.metric2LabelEn || 'Never Frozen Quality',
        metric2LabelKr: data.metric2LabelKr || '비냉동 최상급 원육',
        metric2LabelVi: data.metric2LabelVi || 'Tuyệt đối không đông lạnh',
        metric2LabelJp: data.metric2LabelJp || '完全非冷凍のこだわり',
        metric3Value: data.metric3Value || 'Daily',
        metric3LabelEn: data.metric3LabelEn || 'Fresh Bakery Panko',
        metric3LabelKr: data.metric3LabelKr || '매일 새벽 직접 구운 빵가루',
        metric3LabelVi: data.metric3LabelVi || 'Bột chiên tươi nướng mỗi sáng',
        metric3LabelJp: data.metric3LabelJp || '毎朝焼き上げる生パン粉',
        isActive: data.isActive,
      });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to load hero configuration', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const updated = await cmsService.updateAdminHero(formData);
      setHero(updated);
      setMessage({ text: 'Hero & Introduction updated successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to save changes. Please ensure all 4 languages are provided.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage(null);
      const updated = await cmsService.uploadHeroImage(file);
      setHero(updated);
      setMessage({ text: 'Hero visual uploaded to Cloudinary successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to upload image. Please verify file format.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Hero Configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
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

      {/* Top Bar: Hero Visual & Status */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="w-full h-48 rounded-xl overflow-hidden bg-[#f3f1ec] border border-[#eae6df] relative flex items-center justify-center group">
            {hero?.imageUrl ? (
              <img
                src={hero.imageUrl}
                alt="Hero Visual"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-[#8f6f6c] gap-1">
                <span className="material-symbols-outlined text-[32px]">image</span>
                <span className="text-xs font-semibold">No Image Uploaded</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading to Cloudinary...
              </div>
            )}
          </div>

          <label className="mt-3 w-full py-2 px-3 border border-[#eae8e5] bg-[#f5f3f0] hover:bg-[#eae8e5] rounded-xl text-xs font-bold text-[#1b1c1a] text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-[#af101a]">cloud_upload</span>
            <span>{uploading ? 'Uploading...' : 'Replace Hero Visual'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eae8e5]">
            <div>
              <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
                Hero Section Status
              </h3>
              <p className="text-xs text-[#585757]">
                Control whether the Hero header is visible on the public dining site
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#af101a]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                CTA Target Route
              </label>
              <input
                type="text"
                value={formData.ctaTarget}
                onChange={(e) => setFormData({ ...formData, ctaTarget: e.target.value })}
                placeholder="menu"
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-medium focus:outline-none focus:border-[#af101a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Metric 1 (Wet Aging)
              </label>
              <input
                type="text"
                value={formData.metric1Value}
                onChange={(e) => setFormData({ ...formData, metric1Value: e.target.value })}
                placeholder="120h"
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-medium focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual 4-Language Tabs */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae8e5]">
          <div>
            <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
              4-Language Content Configuration
            </h3>
            <p className="text-xs text-[#585757]">
              Configure headlines, subtitles, descriptions, and CTAs across all supported languages
            </p>
          </div>

          {/* Language Switcher Tabs */}
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

        {/* Dynamic Fields for Selected Language */}
        {activeLangTab === 'VI' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Tiêu Đề Chính (Headline)
              </label>
              <input
                type="text"
                value={formData.headlineVi}
                onChange={(e) => setFormData({ ...formData, headlineVi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
                placeholder="Nghệ Thuật Tonkatsu Thủ Công"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Tiêu Đề Phụ / Khẩu Hiệu (Title / Secondary)
              </label>
              <input
                type="text"
                value={formData.titleVi}
                onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="Tonkatsu Hoàng Kim Chiên Chuẩn Xác"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Khẩu Hiệu Nhỏ (Tagline)
              </label>
              <input
                type="text"
                value={formData.taglineVi}
                onChange={(e) => setFormData({ ...formData, taglineVi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="Nguyên liệu chuẩn mực và tinh thần nghệ nhân"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Đoạn Văn Giới Thiệu (Description)
              </label>
              <textarea
                rows={4}
                value={formData.descriptionVi}
                onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
                placeholder="Thịt heo mát ủ ẩm 120 giờ, bột chiên xù tươi tự nướng mỗi sáng..."
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  Nút Kêu Gọi Hành Động (CTA Button)
                </label>
                <input
                  type="text"
                  value={formData.ctaTextVi}
                  onChange={(e) => setFormData({ ...formData, ctaTextVi: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                  placeholder="Xem Thực Đơn Đầy Đủ"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  Nhãn Thống Kê 1 (120h)
                </label>
                <input
                  type="text"
                  value={formData.metric1LabelVi}
                  onChange={(e) => setFormData({ ...formData, metric1LabelVi: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                  placeholder="Thịt heo mát ủ 120 giờ"
                />
              </div>
            </div>
          </div>
        )}

        {activeLangTab === 'EN' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Main Headline (EN)
              </label>
              <input
                type="text"
                value={formData.headlineEn}
                onChange={(e) => setFormData({ ...formData, headlineEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
                placeholder="The Art of Hand Crafted Cutlets"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Secondary Title (EN)
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="Precision Fried Golden Tonkatsu"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Tagline (EN)
              </label>
              <input
                type="text"
                value={formData.taglineEn}
                onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="Uncompromising Ingredients and Craftsmanship"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Body Description (EN)
              </label>
              <textarea
                rows={4}
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
                placeholder="120-hour wet-aged chilled pork, house-baked breadcrumbs..."
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  CTA Button Label (EN)
                </label>
                <input
                  type="text"
                  value={formData.ctaTextEn}
                  onChange={(e) => setFormData({ ...formData, ctaTextEn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                  placeholder="Explore Full Menu"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  Metric 1 Label (EN)
                </label>
                <input
                  type="text"
                  value={formData.metric1LabelEn}
                  onChange={(e) => setFormData({ ...formData, metric1LabelEn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                  placeholder="Wet-Aged Chilled Pork"
                />
              </div>
            </div>
          </div>
        )}

        {activeLangTab === 'KR' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                메인 헤드라인 (Headline KR)
              </label>
              <input
                type="text"
                value={formData.headlineKr}
                onChange={(e) => setFormData({ ...formData, headlineKr: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
                placeholder="타협 없는 정통 기법의 황금빛 돈카츠"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                서브 타이틀 (Title KR)
              </label>
              <input
                type="text"
                value={formData.titleKr}
                onChange={(e) => setFormData({ ...formData, titleKr: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="장인정신으로 빚어낸 수제 돈카츠의 미학"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                강조 문구 (Tagline KR)
              </label>
              <input
                type="text"
                value={formData.taglineKr}
                onChange={(e) => setFormData({ ...formData, taglineKr: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="타협하지 않는 원재료와 장인정신"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                본문 설명 (Description KR)
              </label>
              <textarea
                rows={4}
                value={formData.descriptionKr}
                onChange={(e) => setFormData({ ...formData, descriptionKr: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
                placeholder="120시간 저온 습식숙성 프리미엄 원육, 매일 새벽 직접 구워 분쇄한 생빵가루..."
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  CTA 버튼 라벨 (KR)
                </label>
                <input
                  type="text"
                  value={formData.ctaTextKr}
                  onChange={(e) => setFormData({ ...formData, ctaTextKr: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                  placeholder="전체 메뉴 둘러보기"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  지표 1 라벨 (KR)
                </label>
                <input
                  type="text"
                  value={formData.metric1LabelKr}
                  onChange={(e) => setFormData({ ...formData, metric1LabelKr: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                  placeholder="120시간 습식숙성 냉장육"
                />
              </div>
            </div>
          </div>
        )}

        {activeLangTab === 'JP' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                メイン見出し (Headline JP)
              </label>
              <input
                type="text"
                value={formData.headlineJp}
                onChange={(e) => setFormData({ ...formData, headlineJp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm font-semibold focus:outline-none focus:border-[#af101a]"
                placeholder="黄金色に輝く極上とんかつ"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                サブ見出し (Title JP)
              </label>
              <input
                type="text"
                value={formData.titleJp}
                onChange={(e) => setFormData({ ...formData, titleJp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="職人技が紡ぐ手作りとんかつの芸術"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                タグライン (Tagline JP)
              </label>
              <input
                type="text"
                value={formData.taglineJp}
                onChange={(e) => setFormData({ ...formData, taglineJp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm focus:outline-none focus:border-[#af101a]"
                placeholder="妥協なき厳選素材と職人魂"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                説明文 (Description JP)
              </label>
              <textarea
                rows={4}
                value={formData.descriptionJp}
                onChange={(e) => setFormData({ ...formData, descriptionJp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-sm leading-relaxed focus:outline-none focus:border-[#af101a]"
                placeholder="120時間じっくりとウェットエイジング熟成させた極上チルドポーク..."
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  CTA ボタン表記 (JP)
                </label>
                <input
                  type="text"
                  value={formData.ctaTextJp}
                  onChange={(e) => setFormData({ ...formData, ctaTextJp: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
                  placeholder="メニューを見る"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                  指標 1 表記 (JP)
                </label>
                <input
                  type="text"
                  value={formData.metric1LabelJp}
                  onChange={(e) => setFormData({ ...formData, metric1LabelJp: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                  placeholder="120時間熟成チルドポーク"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
        <button
          type="button"
          onClick={loadHero}
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
              <span>Save Hero Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

