import { useState, useEffect } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      // Validate all 4 languages are present
      if (
        !formData.nameEn?.trim() ||
        !formData.nameKr?.trim() ||
        !formData.nameVi?.trim() ||
        !formData.nameJp?.trim()
      ) {
        setErrorMessage('All 4 language names (EN, KR, VI, JP) are strictly required.');
        setSaving(false);
        return;
      }
      if (
        !formData.descriptionEn?.trim() ||
        !formData.descriptionKr?.trim() ||
        !formData.descriptionVi?.trim() ||
        !formData.descriptionJp?.trim()
      ) {
        setErrorMessage('All 4 language descriptions (EN, KR, VI, JP) are strictly required.');
        setSaving(false);
        return;
      }

      let savedId = ingredient?.id;
      if (ingredient?.id) {
        await cmsService.updateAdminIngredient(ingredient.id, formData);
      } else {
        const created = await cmsService.createAdminIngredient(formData);
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

