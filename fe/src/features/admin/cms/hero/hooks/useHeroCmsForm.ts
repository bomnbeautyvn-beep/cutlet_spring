import { useState, useEffect } from 'react';
import { cmsService } from '@/services/cms.service';
import { HomepageHero, UpdateHomepageHeroRequest, Language } from '@/types';

export function useHeroCmsForm() {
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
    metric1LabelJp: '120시간熟成チルドポーク',
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
      setMessage({
        text: 'Failed to save changes. Please ensure all 4 languages are provided.',
        type: 'error',
      });
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

  return {
    hero,
    loading,
    saving,
    uploading,
    message,
    setMessage,
    activeLangTab,
    setActiveLangTab,
    formData,
    setFormData,
    handleSave,
    handleImageUpload,
  };
}

