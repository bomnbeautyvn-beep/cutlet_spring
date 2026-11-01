import { useState } from 'react';
import { MenuItem, DishCategory } from '@/types';
import { adminService, MenuItemPayload } from '@/services/admin.service';

export type ModalTab = 'general' | 'en' | 'ko' | 'vi' | 'ja';

interface UseAdminDishFormProps {
  dish: MenuItem | null;
  onSaved: () => void;
  onClose: () => void;
}

export function useAdminDishForm({ dish, onSaved, onClose }: UseAdminDishFormProps) {
  const isEditing = Boolean(dish);
  const [activeTab, setActiveTab] = useState<ModalTab>('en');

  // General Fields
  const [id, setId] = useState(dish?.id || '');
  const [categoryId, setCategoryId] = useState<DishCategory>(dish?.category || 'japanese');
  const [basePrice, setBasePrice] = useState<number>(dish?.price || 180);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(dish?.prepTimeMinutes || 15);
  const [active, setActive] = useState(dish?.active !== false);
  const [isChefSignature, setIsChefSignature] = useState(Boolean(dish?.isChefSignature));
  const [isBestSeller, setIsBestSeller] = useState(Boolean(dish?.isBestSeller));
  const [isLimited, setIsLimited] = useState(Boolean(dish?.isLimited));
  const [isSpicy, setIsSpicy] = useState(Boolean(dish?.isSpicy));
  const [spiceLevel, setSpiceLevel] = useState<number>(dish?.spiceLevel || 0);
  const [spiceNote, setSpiceNote] = useState(dish?.spiceNote || '');

  // English (EN)
  const [nameEn, setNameEn] = useState(dish?.nameEn || '');
  const [descriptionEn, setDescriptionEn] = useState(dish?.descriptionEn || '');
  const [portionEn, setPortionEn] = useState(dish?.portionEn || '1 serving');

  // Korean (KO)
  const [nameKr, setNameKr] = useState(dish?.nameKr || '');
  const [nameKrSubtitle, setNameKrSubtitle] = useState(dish?.nameKrSubtitle || '');
  const [descriptionKr, setDescriptionKr] = useState(dish?.descriptionKr || '');
  const [portionKr, setPortionKr] = useState(dish?.portionKr || '1인분');

  // Vietnamese (VI)
  const [nameVi, setNameVi] = useState(dish?.nameVi || '');
  const [descriptionVi, setDescriptionVi] = useState(dish?.descriptionVi || '');
  const [portionVi, setPortionVi] = useState(dish?.portionVi || 'Phần 1 người');

  // Japanese (JA)
  const [nameJp, setNameJp] = useState(dish?.nameJp || '');
  const [descriptionJp, setDescriptionJp] = useState(dish?.descriptionJp || '');
  const [portionJp, setPortionJp] = useState(dish?.portionJp || '1人前');

  // Image & Upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(dish?.image || null);
  const [altText, setAltText] = useState(dish?.altText || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation helpers
  const isEnValid = Boolean(nameEn.trim() && descriptionEn.trim() && portionEn.trim());
  const isKoValid = Boolean(nameKr.trim() && descriptionKr.trim() && portionKr.trim());
  const isViValid = Boolean(nameVi.trim() && descriptionVi.trim() && portionVi.trim());
  const isJaValid = Boolean(nameJp.trim() && descriptionJp.trim() && portionJp.trim());
  const isGeneralValid = basePrice > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!nameEn.trim()) errors.nameEn = 'English name (EN) is required';
    if (!descriptionEn.trim()) errors.descriptionEn = 'English description (EN) is required';
    if (!portionEn.trim()) errors.portionEn = 'English portion info (EN) is required';

    if (!nameKr.trim()) errors.nameKr = 'Korean name (KO) is required';
    if (!descriptionKr.trim()) errors.descriptionKr = 'Korean description (KO) is required';
    if (!portionKr.trim()) errors.portionKr = 'Korean portion info (KO) is required';

    if (!nameVi.trim()) errors.nameVi = 'Vietnamese name (VI) is required';
    if (!descriptionVi.trim()) errors.descriptionVi = 'Vietnamese description (VI) is required';
    if (!portionVi.trim()) errors.portionVi = 'Vietnamese portion info (VI) is required';

    if (!nameJp.trim()) errors.nameJp = 'Japanese name (JA) is required';
    if (!descriptionJp.trim()) errors.descriptionJp = 'Japanese description (JA) is required';
    if (!portionJp.trim()) errors.portionJp = 'Japanese portion info (JA) is required';

    if (!basePrice || basePrice <= 0) errors.basePrice = 'Base price must be greater than zero';

    setValidationErrors(errors);

    if (errors.en || errors.nameEn || errors.descriptionEn || errors.portionEn) {
      setActiveTab('en');
    } else if (errors.ko || errors.nameKr || errors.descriptionKr || errors.portionKr) {
      setActiveTab('ko');
    } else if (errors.vi || errors.nameVi || errors.descriptionVi || errors.portionVi) {
      setActiveTab('vi');
    } else if (errors.ja || errors.nameJp || errors.descriptionJp || errors.portionJp) {
      setActiveTab('ja');
    } else if (errors.basePrice) {
      setActiveTab('general');
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      setErrorMessage('Please complete all mandatory 4-language fields (EN, KO, VI, JA).');
      return;
    }

    setIsSubmitting(true);

    const payload: MenuItemPayload = {
      id: id.trim() || undefined,
      categoryId,
      nameEn: nameEn.trim(),
      nameKr: nameKr.trim(),
      nameKrSubtitle: nameKrSubtitle.trim() || undefined,
      nameVi: nameVi.trim(),
      nameJp: nameJp.trim(),
      descriptionEn: descriptionEn.trim(),
      descriptionKr: descriptionKr.trim(),
      descriptionVi: descriptionVi.trim(),
      descriptionJp: descriptionJp.trim(),
      portionEn: portionEn.trim(),
      portionKr: portionKr.trim(),
      portionVi: portionVi.trim(),
      portionJp: portionJp.trim(),
      basePrice: Number(basePrice),
      prepTimeMinutes: Number(prepTimeMinutes),
      altText: altText.trim() || undefined,
      isChefSignature,
      isBestSeller,
      isLimited,
      isSpicy,
      spiceLevel: isSpicy ? spiceLevel : 0,
      spiceNote: isSpicy ? spiceNote.trim() : undefined,
      active,
    };

    try {
      let savedDishId = dish?.id;
      if (isEditing && dish) {
        await adminService.updateMenuItem(dish.id, payload);
      } else {
        const created = await adminService.createMenuItem(payload);
        savedDishId = created.id;
      }

      if (imageFile && savedDishId) {
        await adminService.uploadImage(savedDishId, imageFile);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to save menu dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    activeTab,
    setActiveTab,
    // Fields
    id,
    setId,
    categoryId,
    setCategoryId,
    basePrice,
    setBasePrice,
    prepTimeMinutes,
    setPrepTimeMinutes,
    active,
    setActive,
    isChefSignature,
    setIsChefSignature,
    isBestSeller,
    setIsBestSeller,
    isLimited,
    setIsLimited,
    isSpicy,
    setIsSpicy,
    spiceLevel,
    setSpiceLevel,
    spiceNote,
    setSpiceNote,
    // Languages
    nameEn,
    setNameEn,
    descriptionEn,
    setDescriptionEn,
    portionEn,
    setPortionEn,
    nameKr,
    setNameKr,
    nameKrSubtitle,
    setNameKrSubtitle,
    descriptionKr,
    setDescriptionKr,
    portionKr,
    setPortionKr,
    nameVi,
    setNameVi,
    descriptionVi,
    setDescriptionVi,
    portionVi,
    setPortionVi,
    nameJp,
    setNameJp,
    descriptionJp,
    setDescriptionJp,
    portionJp,
    setPortionJp,
    // Image
    imagePreview,
    handleFileChange,
    // Validation
    isEnValid,
    isKoValid,
    isViValid,
    isJaValid,
    isGeneralValid,
    validationErrors,
    errorMessage,
    isSubmitting,
    handleSubmit,
  };
}

