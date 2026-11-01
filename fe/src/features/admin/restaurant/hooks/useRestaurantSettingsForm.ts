import { useState, useEffect } from 'react';
import { adminService, RestaurantSettings } from '@/services/admin.service';
import { SettingsTab } from '../components/RestaurantSettingsTabs';

export function useRestaurantSettingsForm() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError?: boolean } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<RestaurantSettings>>({});

  const showFeedback = (message: string, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  useEffect(() => {
    let mounted = true;
    adminService
      .getRestaurantSettings()
      .then((data) => {
        if (mounted) {
          setSettings(data);
          setFormData(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load restaurant settings:', err);
        showFeedback('Failed to load restaurant configuration', true);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field: keyof RestaurantSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await adminService.updateRestaurantSettings(formData);
      setSettings(updated);
      setFormData(updated);
      showFeedback('Atelier settings, operating hours, and dining policies successfully saved!');
    } catch (err: any) {
      showFeedback(`Failed to update settings: ${err?.message || 'Server error'}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      showFeedback('Uploading logo to Cloudinary...');
      const updated = await adminService.uploadRestaurantLogo(file);
      setSettings(updated);
      setFormData(updated);
      showFeedback('Atelier logo successfully uploaded to Cloudinary');
    } catch (err: any) {
      showFeedback(`Failed to upload logo: ${err?.message}`, true);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      showFeedback('Uploading banner to Cloudinary...');
      const updated = await adminService.uploadRestaurantBanner(file);
      setSettings(updated);
      setFormData(updated);
      showFeedback('Atelier hero banner successfully uploaded to Cloudinary');
    } catch (err: any) {
      showFeedback(`Failed to upload banner: ${err?.message}`, true);
    }
  };

  return {
    settings,
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    feedback,
    formData,
    handleChange,
    handleSave,
    handleLogoUpload,
    handleBannerUpload,
  };
}

