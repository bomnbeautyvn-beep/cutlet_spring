import { useState, useEffect } from 'react';
import { MenuItem, DishCategory, MenuCategory, MenuBadge, Language } from '@/types';
import { adminService, MenuItemPayload } from '@/services/admin.service';
import { badgeService } from '@/services/badge.service';

export type ModalTab = 'general' | 'en' | 'ko' | 'vi' | 'ja';

interface UseAdminDishFormProps {
  dish: MenuItem | null;
  onSaved: () => void;
  onClose: () => void;
}

export function useAdminDishForm({ dish, onSaved, onClose }: UseAdminDishFormProps) {
  const isEditing = Boolean(dish);

  // Active in-section language tab (VI, EN, KR, JP)
  const [activeLangTab, setActiveLangTab] = useState<Language>('VI');
  // Legacy top-tab for backward compatibility
  const [activeTab, setActiveTab] = useState<ModalTab>('general');

  // Dynamic Categories & Badges
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [badges, setBadges] = useState<MenuBadge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

  // Section 1: Pricing & Prep
  const [basePrice, setBasePrice] = useState<number>(dish?.price || 180);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(dish?.prepTimeMinutes || 15);
  const [hasSizes, setHasSizes] = useState<boolean>(
    () => Boolean(dish?.sizes && dish.sizes.length > 0)
  );
  const [sizes, setSizes] = useState<Array<{ id?: string; label: string; price: number; displayOrder?: number }>>(
    () => dish?.sizes?.map((s, i) => ({ ...s, displayOrder: s.displayOrder || i + 1 })) || []
  );

  // Section 2: Basic Info
  const [id, setId] = useState(dish?.id || '');
  const [categoryId, setCategoryId] = useState<string>(dish?.category || 'japanese');
  const [active, setActive] = useState(dish?.active !== false);

  // Section 3: Dynamic Badges & Attributes
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>(() => {
    if (dish?.badgeIds && dish.badgeIds.length > 0) {
      return dish.badgeIds;
    }
    if (dish?.badges && dish.badges.length > 0) {
      return dish.badges.map((b) => b.id);
    }
    return [];
  });

  const [isChefSignature, setIsChefSignature] = useState(
    Boolean(dish?.isChefSignature ?? dish?.chefSignature)
  );
  const [isBestSeller, setIsBestSeller] = useState(
    Boolean(dish?.isBestSeller ?? dish?.bestSeller)
  );
  const [isLimited, setIsLimited] = useState(
    Boolean(dish?.isLimited ?? dish?.limited)
  );
  const [isSpicy, setIsSpicy] = useState(
    Boolean(dish?.isSpicy ?? dish?.spicy)
  );
  const [spiceLevel, setSpiceLevel] = useState<number>(dish?.spiceLevel || 1);
  const [spiceNote, setSpiceNote] = useState(dish?.spiceNote || '');

  // Section 4: Multilingual Content
  // Vietnamese (VI)
  const [nameVi, setNameVi] = useState(dish?.nameVi || '');
  const [descriptionVi, setDescriptionVi] = useState(dish?.descriptionVi || '');
  const [portionVi, setPortionVi] = useState(dish?.portionVi || 'Phần 1 người');

  // English (EN)
  const [nameEn, setNameEn] = useState(dish?.nameEn || '');
  const [descriptionEn, setDescriptionEn] = useState(dish?.descriptionEn || '');
  const [portionEn, setPortionEn] = useState(dish?.portionEn || '1 serving');

  // Korean (KR)
  const [nameKr, setNameKr] = useState(dish?.nameKr || '');
  const [nameKrSubtitle, setNameKrSubtitle] = useState(dish?.nameKrSubtitle || '');
  const [descriptionKr, setDescriptionKr] = useState(dish?.descriptionKr || '');
  const [portionKr, setPortionKr] = useState(dish?.portionKr || '1인분');

  // Japanese (JP)
  const [nameJp, setNameJp] = useState(dish?.nameJp || '');
  const [descriptionJp, setDescriptionJp] = useState(dish?.descriptionJp || '');
  const [portionJp, setPortionJp] = useState(dish?.portionJp || '1人前');

  // Image & Upload State (matching Hero-Introduction pattern)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(dish?.image || null);
  const [altText, setAltText] = useState(dish?.altText || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Categories & Badges
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoadingBadges(true);
        const [cats, badgeList] = await Promise.all([
          adminService.getCategories(),
          badgeService.getAdminBadges(),
        ]);

        if (!isMounted) return;

        setCategories(cats);
        setBadges(badgeList);

        // If creating new and categoryId isn't set, pick first available
        if (!dish && cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].code || cats[0].id);
        }

        // Synchronize legacy booleans to badgeIds if initial dish had booleans but no badgeIds
        if ((!dish?.badgeIds || dish.badgeIds.length === 0) && (!dish?.badges || dish.badges.length === 0)) {
          const matchedIds: string[] = [];
          badgeList.forEach((b) => {
            if (b.code === 'chef-signature' && (dish?.isChefSignature || dish?.chefSignature)) {
              matchedIds.push(b.id);
            }
            if (b.code === 'best-seller' && (dish?.isBestSeller || dish?.bestSeller)) {
              matchedIds.push(b.id);
            }
            if (b.code === 'limited-batch' && (dish?.isLimited || dish?.limited)) {
              matchedIds.push(b.id);
            }
            if (b.code === 'spicy-glaze' && (dish?.isSpicy || dish?.spicy)) {
              matchedIds.push(b.id);
            }
          });
          if (matchedIds.length > 0) {
            setSelectedBadgeIds(matchedIds);
          }
        }
      } catch (err) {
        console.error('Failed to load menu metadata:', err);
      } finally {
        if (isMounted) setLoadingBadges(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [dish]);

  // Badge toggle handler
  const toggleBadge = (badgeId: string) => {
    setSelectedBadgeIds((prev) => {
      const exists = prev.includes(badgeId);
      const next = exists ? prev.filter((id) => id !== badgeId) : [...prev, badgeId];

      // Sync legacy booleans based on badge codes
      const targetBadge = badges.find((b) => b.id === badgeId);
      if (targetBadge) {
        const isNowActive = !exists;
        if (targetBadge.code === 'chef-signature') setIsChefSignature(isNowActive);
        if (targetBadge.code === 'best-seller') setIsBestSeller(isNowActive);
        if (targetBadge.code === 'limited-batch') setIsLimited(isNowActive);
        if (targetBadge.code === 'spicy-glaze') setIsSpicy(isNowActive);
      }

      return next;
    });
  };

  // Check if spicy badge is selected
  const isSpicySelected = Boolean(
    isSpicy ||
    badges.some(
      (b) => selectedBadgeIds.includes(b.id) && (b.code === 'spicy-glaze' || b.code.includes('spic'))
    )
  );

  // Size Options Handlers
  const toggleHasSizes = (enabled: boolean) => {
    setHasSizes(enabled);
    if (enabled && sizes.length === 0) {
      setSizes([
        { label: 'Phần tiêu chuẩn (Standard)', price: basePrice, displayOrder: 1 },
        { label: 'Phần lớn (Large)', price: basePrice > 0 ? basePrice + 30 : 200, displayOrder: 2 },
      ]);
    }
  };

  const addSize = (label: string = '', price: number = basePrice) => {
    setSizes((prev) => [...prev, { label, price, displayOrder: prev.length + 1 }]);
  };

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: 'label' | 'price', value: string | number) => {
    setSizes((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const processSelectedFile = (file: File) => {
    setUploadError(null);
    // Validation
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Supported formats: JPG, PNG, WEBP.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Image Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (file: File) => {
    processSelectedFile(file);
  };

  // Validations
  const isViValid = Boolean(nameVi.trim() && descriptionVi.trim() && portionVi.trim());
  const isEnValid = Boolean(nameEn.trim() && descriptionEn.trim() && portionEn.trim());
  const isKoValid = Boolean(nameKr.trim() && descriptionKr.trim() && portionKr.trim());
  const isJaValid = Boolean(nameJp.trim() && descriptionJp.trim() && portionJp.trim());
  const isGeneralValid =
    basePrice > 0 &&
    (!hasSizes || sizes.some((s) => s.label.trim().length > 0 && Number(s.price) >= 0));

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!basePrice || Number(basePrice) <= 0) {
      errors.basePrice = 'Base price must be greater than zero';
    }

    if (hasSizes) {
      const validSizes = sizes.filter((s) => s.label.trim().length > 0 && Number(s.price) >= 0);
      if (validSizes.length === 0) {
        errors.sizes = 'Vui lòng nhập ít nhất một kích cỡ hợp lệ hoặc tắt tùy chọn chia size.';
      }
    }

    if (!nameVi.trim()) errors.nameVi = 'Tên món ăn (VI) là bắt buộc';
    if (!descriptionVi.trim()) errors.descriptionVi = 'Mô tả món ăn (VI) là bắt buộc';
    if (!portionVi.trim()) errors.portionVi = 'Định lượng khẩu phần (VI) là bắt buộc';

    if (!nameEn.trim()) errors.nameEn = 'English name (EN) is required';
    if (!descriptionEn.trim()) errors.descriptionEn = 'English description (EN) is required';
    if (!portionEn.trim()) errors.portionEn = 'English portion info (EN) is required';

    if (!nameKr.trim()) errors.nameKr = 'Korean name (KO) is required';
    if (!descriptionKr.trim()) errors.descriptionKr = 'Korean description (KO) is required';
    if (!portionKr.trim()) errors.portionKr = 'Korean portion info (KO) is required';

    if (!nameJp.trim()) errors.nameJp = 'Japanese name (JA) is required';
    if (!descriptionJp.trim()) errors.descriptionJp = 'Japanese description (JA) is required';
    if (!portionJp.trim()) errors.portionJp = 'Japanese portion info (JA) is required';

    setValidationErrors(errors);

    // Switch to first tab with error in Section 4 if needed
    if (errors.nameVi || errors.descriptionVi || errors.portionVi) {
      setActiveLangTab('VI');
    } else if (errors.nameEn || errors.descriptionEn || errors.portionEn) {
      setActiveLangTab('EN');
    } else if (errors.nameKr || errors.descriptionKr || errors.portionKr) {
      setActiveLangTab('KR');
    } else if (errors.nameJp || errors.descriptionJp || errors.portionJp) {
      setActiveLangTab('JP');
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUploadError(null);

    if (!validateForm()) {
      setErrorMessage('Please check all mandatory fields across Pricing, Details, and 4-Language Content.');
      return;
    }

    setIsSubmitting(true);

    const payload: MenuItemPayload = {
      id: id.trim() || undefined,
      categoryId,
      nameVi: nameVi.trim(),
      descriptionVi: descriptionVi.trim(),
      portionVi: portionVi.trim(),
      nameEn: nameEn.trim(),
      descriptionEn: descriptionEn.trim(),
      portionEn: portionEn.trim(),
      nameKr: nameKr.trim(),
      nameKrSubtitle: nameKrSubtitle.trim() || undefined,
      descriptionKr: descriptionKr.trim(),
      portionKr: portionKr.trim(),
      nameJp: nameJp.trim(),
      descriptionJp: descriptionJp.trim(),
      portionJp: portionJp.trim(),
      basePrice: Number(basePrice),
      prepTimeMinutes: Number(prepTimeMinutes),
      altText: altText.trim() || undefined,
      isChefSignature,
      isBestSeller,
      isLimited,
      isSpicy: isSpicySelected,
      spiceLevel: isSpicySelected ? spiceLevel : 0,
      spiceNote: isSpicySelected ? spiceNote.trim() : undefined,
      badgeIds: selectedBadgeIds,
      active,
      sizes: hasSizes
        ? sizes
            .filter((s) => s.label.trim().length > 0 && Number(s.price) >= 0)
            .map((s, idx) => ({
              label: s.label.trim(),
              price: Number(s.price),
              displayOrder: idx + 1,
            }))
        : [],
    };

    try {
      let savedDishId = dish?.id;
      if (isEditing && dish) {
        await adminService.updateMenuItem(dish.id, payload);
      } else {
        const created = await adminService.createMenuItem(payload);
        savedDishId = created.id;
      }

      // If user uploaded a new image file, upload it directly to Cloudinary via BE endpoint
      if (imageFile && savedDishId) {
        setUploading(true);
        await adminService.uploadImage(savedDishId, imageFile);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save menu dish';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return {
    isEditing,
    // Active tabs
    activeLangTab,
    setActiveLangTab,
    activeTab,
    setActiveTab,
    // Dynamic metadata
    categories,
    badges,
    loadingBadges,
    selectedBadgeIds,
    toggleBadge,
    // Section 1: Pricing & Image
    basePrice,
    setBasePrice,
    prepTimeMinutes,
    setPrepTimeMinutes,
    hasSizes,
    toggleHasSizes,
    sizes,
    setSizes,
    addSize,
    removeSize,
    updateSize,
    imagePreview,
    handleFileChange,
    handleFileDrop,
    uploading,
    uploadError,
    // Section 2: Basic Info
    id,
    setId,
    categoryId,
    setCategoryId,
    active,
    setActive,
    altText,
    setAltText,
    // Section 3: Badges & Attributes
    isChefSignature,
    setIsChefSignature,
    isBestSeller,
    setIsBestSeller,
    isLimited,
    setIsLimited,
    isSpicy,
    setIsSpicy,
    isSpicySelected,
    spiceLevel,
    setSpiceLevel,
    spiceNote,
    setSpiceNote,
    // Section 4: Multilingual Fields
    nameVi,
    setNameVi,
    portionVi,
    setPortionVi,
    descriptionVi,
    setDescriptionVi,
    nameEn,
    setNameEn,
    portionEn,
    setPortionEn,
    descriptionEn,
    setDescriptionEn,
    nameKr,
    setNameKr,
    nameKrSubtitle,
    setNameKrSubtitle,
    portionKr,
    setPortionKr,
    descriptionKr,
    setDescriptionKr,
    nameJp,
    setNameJp,
    portionJp,
    setPortionJp,
    descriptionJp,
    setDescriptionJp,
    // Validation & Submission
    isViValid,
    isEnValid,
    isKoValid,
    isJaValid,
    isGeneralValid,
    validationErrors,
    errorMessage,
    isSubmitting,
    handleSubmit,
  };
}
