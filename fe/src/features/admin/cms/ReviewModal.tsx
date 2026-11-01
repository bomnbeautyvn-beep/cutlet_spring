import React, { useState, useEffect } from 'react';
import { GoogleReview, SaveGoogleReviewRequest } from '@/types';
import { cmsService } from '@/services/cms.service';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  review?: GoogleReview | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  review,
}) => {
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SaveGoogleReviewRequest>({
    reviewerName: '',
    reviewerInitials: '',
    reviewerMetadata: 'Local Guide · 45 reviews',
    rating: 5,
    reviewLanguage: 'VI',
    reviewContent: '',
    reviewDate: '1 week ago',
    ownerResponse: '',
    ownerResponseDate: '1 week ago',
    reviewUrl: 'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  });

  useEffect(() => {
    if (review) {
      setFormData({
        id: review.id,
        reviewerName: review.reviewerName || '',
        reviewerInitials: review.reviewerInitials || '',
        reviewerAvatarUrl: review.reviewerAvatarUrl || '',
        reviewerMetadata: review.reviewerMetadata || '',
        rating: review.rating || 5,
        reviewLanguage: review.reviewLanguage || 'VI',
        reviewContent: review.reviewContent || '',
        reviewDate: review.reviewDate || '',
        ownerResponse: review.ownerResponse || '',
        ownerResponseDate: review.ownerResponseDate || '',
        reviewUrl: review.reviewUrl || '',
        isFeatured: review.isFeatured,
        isActive: review.isActive,
        displayOrder: review.displayOrder,
      });
    } else {
      setFormData({
        reviewerName: '',
        reviewerInitials: '',
        reviewerMetadata: 'Local Guide · 45 reviews',
        rating: 5,
        reviewLanguage: 'VI',
        reviewContent: '',
        reviewDate: 'Recent',
        ownerResponse: '',
        ownerResponseDate: 'Recent',
        reviewUrl: 'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
        isFeatured: true,
        isActive: true,
        displayOrder: 1,
      });
    }
    setErrorMessage(null);
  }, [review, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      if (!formData.reviewerName?.trim() || !formData.reviewContent?.trim() || !formData.reviewDate?.trim()) {
        setErrorMessage('Reviewer Name, Review Content, and Date are required.');
        setSaving(false);
        return;
      }

      if (review?.id) {
        await cmsService.updateAdminReview(review.id, formData);
      } else {
        await cmsService.createAdminReview(formData);
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#eae8e5] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#eae8e5] flex items-center justify-between bg-[#fbf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-[22px]">reviews</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
                {review ? 'Edit Curated Google Review' : 'Add Curated Google Review'}
              </h2>
              <span className="text-xs text-[#585757]">
                Live guest review with restaurant owner response
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#585757] hover:bg-[#eae8e5] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Reviewer Name *
              </label>
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                placeholder="e.g. Bích Trâm 한유미"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Initials (Optional)
              </label>
              <input
                type="text"
                maxLength={4}
                value={formData.reviewerInitials || ''}
                onChange={(e) => setFormData({ ...formData, reviewerInitials: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-semibold focus:outline-none focus:border-[#af101a]"
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Rating (1 - 5) *
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
                <option value={2}>2 Stars ★★☆☆☆</option>
                <option value={1}>1 Star ★☆☆☆☆</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Language
              </label>
              <select
                value={formData.reviewLanguage}
                onChange={(e) => setFormData({ ...formData, reviewLanguage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
              >
                <option value="VI">🇻🇳 Tiếng Việt</option>
                <option value="EN">🇺🇸 English</option>
                <option value="KR">🇰🇷 한국어</option>
                <option value="JA">🇯🇵 日本語</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Date Label *
              </label>
              <input
                type="text"
                value={formData.reviewDate}
                onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
                placeholder="1 week ago"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Local Guide Badge / Credential Tag
            </label>
            <input
              type="text"
              value={formData.reviewerMetadata || ''}
              onChange={(e) => setFormData({ ...formData, reviewerMetadata: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs focus:outline-none focus:border-[#af101a]"
              placeholder="e.g. Local Guide · 85 reviews · 232 photos"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
              Review Content (Guest Quote) *
            </label>
            <textarea
              rows={3}
              value={formData.reviewContent}
              onChange={(e) => setFormData({ ...formData, reviewContent: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="Guest feedback and dining experience..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#af101a] uppercase tracking-wider mb-1">
              Restaurant Owner Response (Phản hồi từ Cutlet Spring)
            </label>
            <textarea
              rows={2}
              value={formData.ownerResponse || ''}
              onChange={(e) => setFormData({ ...formData, ownerResponse: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#eae8e5] bg-[#fbf9f6] text-xs leading-relaxed focus:outline-none focus:border-[#af101a]"
              placeholder="Thank you for visiting Cutlet Spring! We look forward to welcoming you again."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#5b403d] uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-1.5 rounded-lg border border-[#eae8e5] bg-[#fbf9f6] text-xs font-bold focus:outline-none focus:border-[#af101a]"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-bold text-[#1b1c1a] mb-1">Featured Review</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-bold text-[#1b1c1a] mb-1">Active Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#af101a]"></div>
              </label>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae8e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#eae8e5] bg-white hover:bg-[#f5f3f0] text-[#5b403d] font-label-md text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{review ? 'Save Review' : 'Create Review'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

