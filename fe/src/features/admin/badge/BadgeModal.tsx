import React, { useState } from 'react';
import { MenuBadge, BadgeRequest } from '@/types';
import { badgeService } from '@/services/badge.service';

interface BadgeModalProps {
  badge: MenuBadge | null; // null = create new
  onClose: () => void;
  onSaved: () => void;
}

const PRESET_ICONS = [
  'restaurant',
  'stars',
  'hourglass_top',
  'local_fire_department',
  'verified',
  'workspace_premium',
  'award_star',
  'eco',
  'local_dining',
  'favorite',
];

export const BadgeModal: React.FC<BadgeModalProps> = ({ badge, onClose, onSaved }) => {
  const isEditing = Boolean(badge);

  const [code, setCode] = useState(badge?.code || '');
  const [name, setName] = useState(badge?.name || '');
  const [nameVi, setNameVi] = useState(badge?.nameVi || '');
  const [nameKr, setNameKr] = useState(badge?.nameKr || '');
  const [nameJp, setNameJp] = useState(badge?.nameJp || '');
  const [description, setDescription] = useState(badge?.description || '');
  const [badgeColor, setBadgeColor] = useState(badge?.badgeColor || '#af101a');
  const [icon, setIcon] = useState(badge?.icon || 'restaurant');
  const [displayOrder, setDisplayOrder] = useState<number>(badge?.displayOrder || 1);
  const [active, setActive] = useState(badge?.active !== false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Badge code is required (e.g. "chef-signature")');
      return;
    }
    if (!name.trim()) {
      setError('Primary badge name is required');
      return;
    }

    setIsSubmitting(true);
    const payload: BadgeRequest = {
      code: code.trim().toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      nameVi: nameVi.trim() || undefined,
      nameKr: nameKr.trim() || undefined,
      nameJp: nameJp.trim() || undefined,
      description: description.trim() || undefined,
      badgeColor,
      icon,
      displayOrder: Number(displayOrder) || 1,
      active,
    };

    try {
      if (isEditing && badge) {
        await badgeService.updateBadge(badge.id, payload);
      } else {
        await badgeService.createBadge(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save badge';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#eae8e5] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eae8e5] bg-[#fbf9f6]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#af101a]">
              Atelier Attributes &amp; Badges
            </span>
            <h2 className="font-headline-md text-lg font-bold text-[#1b1c1a]">
              {isEditing ? `Edit Badge: ${badge?.name}` : 'Create Atelier Badge'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#eae8e5] text-[#585757] hover:text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Code & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Badge Code (Slug) *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. chef-signature"
                className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs font-mono text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
                required
              />
              <span className="text-[10px] text-[#8f6f6c] block mt-1">Unique identifier</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          {/* Names in 4 Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                English Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chef Signature"
                className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Vietnamese Name (VI)
              </label>
              <input
                type="text"
                value={nameVi}
                onChange={(e) => setNameVi(e.target.value)}
                placeholder="Ví dụ: Bếp Trưởng Khuyên Dùng"
                className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Korean Name (KO)
              </label>
              <input
                type="text"
                value={nameKr}
                onChange={(e) => setNameKr(e.target.value)}
                placeholder="예: 쉐프 시그니처"
                className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Japanese Name (JA)
              </label>
              <input
                type="text"
                value={nameJp}
                onChange={(e) => setNameJp(e.target.value)}
                placeholder="例: シェフのおすすめ"
                className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Description / Tooltip
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Món ăn tinh hoa đại diện phong cách ẩm thực của nhà hàng"
              className="w-full px-3 py-2 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#af101a]"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Badge Icon
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                    icon === i
                      ? 'border-[#af101a] bg-[#af101a] text-white shadow-xs'
                      : 'border-[#eae8e5] bg-[#fbf9f6] text-[#585757] hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{i}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection & Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="w-9 h-9 p-0 border border-[#eae8e5] rounded-lg cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="w-28 px-2.5 py-1.5 rounded-lg border border-[#eae8e5] font-mono text-xs text-[#1b1c1a]"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Live Badge Preview
              </label>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#eae8e5] bg-[#fbf9f6]">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white"
                  style={{ backgroundColor: badgeColor }}
                >
                  <span className="material-symbols-outlined text-[14px]">{icon}</span>
                </div>
                <span className="text-xs font-bold text-[#1b1c1a]">
                  {name || 'Sample Badge'}
                </span>
              </div>
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:bg-[#af101a]"></div>
            </label>
            <span className="text-xs font-semibold text-[#1b1c1a]">
              {active ? 'Active (Selectable in menu editor)' : 'Inactive (Hidden)'}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#585757] hover:bg-[#eae8e5] border border-[#eae8e5] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#af101a] hover:bg-[#930010] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{isEditing ? 'Save Badge' : 'Create Badge'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
