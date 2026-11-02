import { useState, useEffect, useMemo } from 'react';
import { Ingredient, SaveIngredientRequest, Language } from '@/types';
import { cmsService } from '@/services/cms.service';

interface UseIngredientModalFormProps {
  ingredient?: Ingredient | null;
  isOpen: boolean;
  onSaved: () => void;
  onClose: () => void;
}

export function useIngredientModalForm({
  ingredient,
  isOpen,
  onSaved,
  onClose,
}: UseIngredientModalFormProps) {
  const [activeLangTab, setActiveLangTab] = useState<Language>('VI');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SaveIngredientRequest>({
    nameEn: '',
    nameKr: '',
    nameVi: '',
    nameJp: '',
    subtitleEn: '',
    subtitleKr: '',
    subtitleVi: '',
    subtitleJp: '',
    descriptionEn: '',
    descriptionKr: '',
    descriptionVi: '',
    descriptionJp: '',
    displayOrder: 1,
    isActive: true,
  });

  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (ingredient) {
      setFormData({
        id: ingredient.id,
        nameEn: ingredient.nameEn || '',
        nameKr: ingredient.nameKr || '',
        nameVi: ingredient.nameVi || '',
        nameJp: ingredient.nameJp || '',
        subtitleEn: ingredient.subtitleEn || '',
        subtitleKr: ingredient.subtitleKr || '',
        subtitleVi: ingredient.subtitleVi || '',
        subtitleJp: ingredient.subtitleJp || '',
        descriptionEn: ingredient.descriptionEn || '',
        descriptionKr: ingredient.descriptionKr || '',
        descriptionVi: ingredient.descriptionVi || '',
        descriptionJp: ingredient.descriptionJp || '',
        displayOrder: ingredient.displayOrder,
        isActive: ingredient.isActive,
      });
      setCurrentImageUrl(ingredient.imageUrl);
      setImageFile(null);
    } else {
      setFormData({
        nameEn: '',
        nameKr: '',
        nameVi: '',
        nameJp: '',
        subtitleEn: '',
        subtitleKr: '',
        subtitleVi: '',
        subtitleJp: '',
        descriptionEn: '',
        descriptionKr: '',
        descriptionVi: '',
        descriptionJp: '',
        displayOrder: 1,
        isActive: true,
      });
      setCurrentImageUrl(undefined);
      setImageFile(null);
    }
    setErrorMessage(null);
  }, [ingredient, isOpen]);

  const isDirty = useMemo(() => {
    if (!ingredient) {
      return Boolean(
        formData.nameEn?.trim() ||
        formData.nameKr?.trim() ||
        formData.nameVi?.trim() ||
        formData.nameJp?.trim() ||
        formData.descriptionEn?.trim() ||
        formData.descriptionKr?.trim() ||
        formData.descriptionVi?.trim() ||
        formData.descriptionJp?.trim() ||
        imageFile
      );
    }
    return (
      (formData.nameEn || '') !== (ingredient.nameEn || '') ||
      (formData.nameKr || '') !== (ingredient.nameKr || '') ||
      (formData.nameVi || '') !== (ingredient.nameVi || '') ||
      (formData.nameJp || '') !== (ingredient.nameJp || '') ||
      (formData.descriptionEn || '') !== (ingredient.descriptionEn || '') ||
      (formData.descriptionKr || '') !== (ingredient.descriptionKr || '') ||
      (formData.descriptionVi || '') !== (ingredient.descriptionVi || '') ||
      (formData.descriptionJp || '') !== (ingredient.descriptionJp || '') ||
      (formData.subtitleEn || '') !== (ingredient.subtitleEn || '') ||
      (formData.subtitleKr || '') !== (ingredient.subtitleKr || '') ||
      (formData.subtitleVi || '') !== (ingredient.subtitleVi || '') ||
      (formData.subtitleJp || '') !== (ingredient.subtitleJp || '') ||
      formData.displayOrder !== ingredient.displayOrder ||
      formData.isActive !== ingredient.isActive ||
      Boolean(imageFile)
    );
  }, [formData, ingredient, imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      // English (EN) is strictly required; VI, KR, JA are optional
      if (!formData.nameEn?.trim()) {
        setErrorMessage('English ingredient name (EN) is required.');
        setActiveLangTab('EN');
        setSaving(false);
        return;
      }
      if (!formData.descriptionEn?.trim()) {
        setErrorMessage('English ingredient description (EN) is required.');
        setActiveLangTab('EN');
        setSaving(false);
        return;
      }

      const payload: SaveIngredientRequest = {
        ...formData,
        nameEn: formData.nameEn.trim(),
        nameVi: formData.nameVi?.trim() || undefined,
        nameKr: formData.nameKr?.trim() || undefined,
        nameJp: formData.nameJp?.trim() || undefined,
        subtitleEn: formData.subtitleEn?.trim() || undefined,
        subtitleVi: formData.subtitleVi?.trim() || undefined,
        subtitleKr: formData.subtitleKr?.trim() || undefined,
        subtitleJp: formData.subtitleJp?.trim() || undefined,
        descriptionEn: formData.descriptionEn.trim(),
        descriptionVi: formData.descriptionVi?.trim() || undefined,
        descriptionKr: formData.descriptionKr?.trim() || undefined,
        descriptionJp: formData.descriptionJp?.trim() || undefined,
      };

      let savedId = ingredient?.id;
      if (ingredient?.id) {
        await cmsService.updateAdminIngredient(ingredient.id, payload);
      } else {
        const created = await cmsService.createAdminIngredient(payload);
        savedId = created?.id;
      }

      // If a local image file was staged, upload to Cloudinary
      if (imageFile && savedId) {
        setUploading(true);
        await cmsService.uploadIngredientImage(savedId, imageFile);
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save ingredient');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const processFile = async (file: File) => {
    // Basic validation
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Chỉ chấp nhận file định dạng JPG, PNG hoặc WEBP');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh không được vượt quá 10MB');
      return;
    }

    setErrorMessage(null);

    // If editing existing ingredient, upload directly to Cloudinary
    if (ingredient?.id) {
      try {
        setUploading(true);
        const updated = await cmsService.uploadIngredientImage(ingredient.id, file);
        setCurrentImageUrl(updated.imageUrl);
        setImageFile(null);
        onSaved();
      } catch (err: unknown) {
        console.error(err);
        setErrorMessage('Failed to upload image. Please verify file format.');
      } finally {
        setUploading(false);
      }
    } else {
      // If creating new ingredient, store file and show instant object preview
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCurrentImageUrl(previewUrl);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileDrop = (file: File) => {
    processFile(file);
  };

  return {
    isDirty,
    activeLangTab,
    setActiveLangTab,
    saving,
    uploading,
    errorMessage,
    formData,
    setFormData,
    currentImageUrl,
    handleSubmit,
    handleImageUpload,
    handleFileDrop,
  };
}

