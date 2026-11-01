import React, { useState, useEffect } from 'react';
import { adminService, RestaurantSettings } from '@/services/admin.service';

export const RestaurantSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'policies'>('profile');
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

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-3 text-[#8f6f6c]">
        <div className="w-7 h-7 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-wider font-bold">
          Loading Restaurant Settings...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-[#1b1c1a]">
            Restaurant Profile &amp; Settings
          </h1>
          <p className="text-xs text-[#585757] mt-0.5">
            Configure 4-language atelier profile, service hours, dining policies, and Cloudinary branding assets
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#af101a] hover:bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 shadow-sm animate-fade-in ${
            feedback.isError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedback.isError ? 'error' : 'check_circle'}
          </span>
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#eae8e5] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#1b1c1a] text-white shadow-xs'
              : 'text-[#585757] hover:bg-[#f5f3f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          <span>Profile &amp; 4-Language Branding</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hours')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'hours'
              ? 'bg-[#1b1c1a] text-white shadow-xs'
              : 'text-[#585757] hover:bg-[#f5f3f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span>Operating Hours &amp; Sessions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'policies'
              ? 'bg-[#1b1c1a] text-white shadow-xs'
              : 'text-[#585757] hover:bg-[#f5f3f0]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">policy</span>
          <span>Dining Policies &amp; Capacities</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: PROFILE & 4-LANG BRANDING */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Cloudinary Assets Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs">
              {/* Logo */}
              <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
                  Atelier Logo (Cloudinary)
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#fbf9f6] border border-[#eae8e5] p-2 flex items-center justify-center shrink-0">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-gray-300">image</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="text-xs text-[#585757] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1b1c1a] file:text-white cursor-pointer"
                    />
                    <p className="text-[10px] text-[#8f6f6c] mt-1">Recommended transparent PNG</p>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
                  Hero Banner Photo (Cloudinary)
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl bg-[#fbf9f6] border border-[#eae8e5] overflow-hidden flex items-center justify-center shrink-0">
                    {formData.bannerUrl ? (
                      <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-gray-300">photo_library</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="text-xs text-[#585757] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1b1c1a] file:text-white cursor-pointer"
                    />
                    <p className="text-[10px] text-[#8f6f6c] mt-1">Wide landscape photo (16:9)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Names in 4 Languages */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Restaurant Name in 4 Mandatory Languages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    English Name (EN) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn || ''}
                    onChange={(e) => handleChange('nameEn', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    한국어 상호 (KO) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameKr || ''}
                    onChange={(e) => handleChange('nameKr', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Tên Nhà Hàng (VI) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameVi || ''}
                    onChange={(e) => handleChange('nameVi', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    店舗名 (JA) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameJp || ''}
                    onChange={(e) => handleChange('nameJp', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
              </div>
            </div>

            {/* Slogans in 4 Languages */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Atelier Slogan / Headline in 4 Languages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Slogan (EN)
                  </label>
                  <input
                    type="text"
                    value={formData.sloganEn || ''}
                    onChange={(e) => handleChange('sloganEn', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    슬로건 (KO)
                  </label>
                  <input
                    type="text"
                    value={formData.sloganKr || ''}
                    onChange={(e) => handleChange('sloganKr', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Khẩu hiệu (VI)
                  </label>
                  <input
                    type="text"
                    value={formData.sloganVi || ''}
                    onChange={(e) => handleChange('sloganVi', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    キャッチコピー (JA)
                  </label>
                  <input
                    type="text"
                    value={formData.sloganJp || ''}
                    onChange={(e) => handleChange('sloganJp', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
              </div>
            </div>

            {/* Addresses in 4 Languages & Contact */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Contact &amp; Physical Address (4 Languages)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Telephone Direct Line *
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Address (EN) *
                  </label>
                  <input
                    type="text"
                    value={formData.addressEn || ''}
                    onChange={(e) => handleChange('addressEn', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    주소 (KO) *
                  </label>
                  <input
                    type="text"
                    value={formData.addressKr || ''}
                    onChange={(e) => handleChange('addressKr', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Địa chỉ (VI) *
                  </label>
                  <input
                    type="text"
                    value={formData.addressVi || ''}
                    onChange={(e) => handleChange('addressVi', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    住所 (JA) *
                  </label>
                  <input
                    type="text"
                    value={formData.addressJp || ''}
                    onChange={(e) => handleChange('addressJp', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl focus:outline-none focus:border-[#af101a]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OPERATING HOURS & SESSIONS */}
        {activeTab === 'hours' && (
          <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
              Service Shifts &amp; Kitchen Timings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Lunch */}
              <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
                <span className="block text-xs font-bold text-[#af101a] uppercase tracking-wider">
                  Lunch Service Shift
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#585757] font-bold">Start</label>
                    <input
                      type="text"
                      value={formData.openingHourLunchStart || '11:00'}
                      onChange={(e) => handleChange('openingHourLunchStart', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#585757] font-bold">End</label>
                    <input
                      type="text"
                      value={formData.openingHourLunchEnd || '15:00'}
                      onChange={(e) => handleChange('openingHourLunchEnd', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Dinner */}
              <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
                <span className="block text-xs font-bold text-[#af101a] uppercase tracking-wider">
                  Dinner Service Shift
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#585757] font-bold">Start</label>
                    <input
                      type="text"
                      value={formData.openingHourDinnerStart || '17:00'}
                      onChange={(e) => handleChange('openingHourDinnerStart', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#585757] font-bold">End</label>
                    <input
                      type="text"
                      value={formData.openingHourDinnerEnd || '21:00'}
                      onChange={(e) => handleChange('openingHourDinnerEnd', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Last Order */}
              <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
                <span className="block text-xs font-bold text-[#af101a] uppercase tracking-wider">
                  Kitchen Last Call
                </span>
                <div>
                  <label className="block text-[10px] text-[#585757] font-bold">Last Order Time</label>
                  <input
                    type="text"
                    value={formData.lastOrderTime || '20:30'}
                    onChange={(e) => handleChange('lastOrderTime', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#eae8e5] rounded-lg"
                  />
                  <span className="text-[10px] text-[#8f6f6c] mt-1 block">Cutoff for kitchen frying tickets</span>
                </div>
              </div>
            </div>

            {/* Closed Days in 4 Languages */}
            <div className="pt-4 border-t border-[#eae8e5] space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
                Weekly Closing Days (4 Languages)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="EN: Open Daily"
                  value={formData.closedDaysEn || ''}
                  onChange={(e) => handleChange('closedDaysEn', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="KO: 연중무휴"
                  value={formData.closedDaysKr || ''}
                  onChange={(e) => handleChange('closedDaysKr', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="VI: Mở cửa hàng ngày"
                  value={formData.closedDaysVi || ''}
                  onChange={(e) => handleChange('closedDaysVi', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="JA: 年中無休"
                  value={formData.closedDaysJp || ''}
                  onChange={(e) => handleChange('closedDaysJp', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DINING POLICIES & CAPACITIES */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            {/* Capacities */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Counter &amp; Dining Hall Capacities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Chef Counter Theater
                  </label>
                  <input
                    type="number"
                    value={formData.capacityCounter ?? 10}
                    onChange={(e) => handleChange('capacityCounter', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                  />
                  <span className="text-[10px] text-[#8f6f6c]">Seats in front of open fryer</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Main Atelier Hall
                  </label>
                  <input
                    type="number"
                    value={formData.capacityHall ?? 30}
                    onChange={(e) => handleChange('capacityHall', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                  />
                  <span className="text-[10px] text-[#8f6f6c]">Dining room table seating</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    Default Prep (Mins)
                  </label>
                  <input
                    type="number"
                    value={formData.defaultPrepMinutes ?? 18}
                    onChange={(e) => handleChange('defaultPrepMinutes', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#585757] mb-1">
                    VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.vatRate ?? 8.0}
                    onChange={(e) => handleChange('vatRate', Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Policy: One Dish Per Guest */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Policy 1: One Main Dish Requirement (4 Languages)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="EN: One main dish requirement per seated guest"
                  value={formData.policyOneDishEn || ''}
                  onChange={(e) => handleChange('policyOneDishEn', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="KO: 1인 1메뉴 주문 필수"
                  value={formData.policyOneDishKr || ''}
                  onChange={(e) => handleChange('policyOneDishKr', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="VI: Mỗi thực khách dùng bữa tại chỗ vui lòng gọi tối thiểu một món chính"
                  value={formData.policyOneDishVi || ''}
                  onChange={(e) => handleChange('policyOneDishVi', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="JA: ご着席のお客様1名様につきメインディッシュ1品のご注文をお願いしております"
                  value={formData.policyOneDishJp || ''}
                  onChange={(e) => handleChange('policyOneDishJp', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
              </div>
            </div>

            {/* Policy: VAT Notice */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Policy 2: VAT Tax Notice (4 Languages)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="EN: 8% VAT is not included in list prices"
                  value={formData.policyVatEn || ''}
                  onChange={(e) => handleChange('policyVatEn', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="KO: 메뉴 가격에 8% 부가세(VAT) 미포함"
                  value={formData.policyVatKr || ''}
                  onChange={(e) => handleChange('policyVatKr', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="VI: Giá niêm yết chưa bao gồm 8% thuế GTGT (VAT)"
                  value={formData.policyVatVi || ''}
                  onChange={(e) => handleChange('policyVatVi', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="JA: 表示価格には8%の付加価値税(VAT)は含まれておりません"
                  value={formData.policyVatJp || ''}
                  onChange={(e) => handleChange('policyVatJp', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
              </div>
            </div>

            {/* Policy: Takeout Crispness */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae8e5] shadow-xs space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
                Policy 3: Takeout Packaging &amp; Crispness Retention (4 Languages)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="EN: Takeout packaging retains crispness up to 30 mins"
                  value={formData.policyTakeoutEn || ''}
                  onChange={(e) => handleChange('policyTakeoutEn', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="KO: 포장 주문 시 30분 동안 바삭한 식감이 유지됩니다"
                  value={formData.policyTakeoutKr || ''}
                  onChange={(e) => handleChange('policyTakeoutKr', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="VI: Bao bì mang về giữ độ giòn tối ưu trong 30 phút"
                  value={formData.policyTakeoutVi || ''}
                  onChange={(e) => handleChange('policyTakeoutVi', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
                <input
                  type="text"
                  placeholder="JA: テイクアウト包装は30分間サクサクの食感を保ちます"
                  value={formData.policyTakeoutJp || ''}
                  onChange={(e) => handleChange('policyTakeoutJp', e.target.value)}
                  className="px-3 py-2 text-xs bg-[#fbf9f6] border border-[#eae8e5] rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

