import { useState, useEffect } from 'react';
import { GoogleReview, SaveGoogleReviewRequest } from '@/types';
import { cmsService } from '@/services/cms.service';

const DEFAULT_FORM: SaveGoogleReviewRequest = {
  reviewerName: '',
  reviewerInitials: '',
  reviewerMetadata: 'Local Guide · 45 reviews',
  rating: 5,
  reviewLanguage: 'VI',
  reviewContent: '',
  reviewDate: 'Recent',
  ownerResponse: '',
  ownerResponseDate: 'Recent',
  reviewUrl:
    'https://www.google.com/maps/place/%EB%B4%84%EB%8F%88%EA%B9%8C%EC%8A%A4+-+Cutlet+Spring/@10.8037915,106.7400647,17z/data=!3m1!4b1!4m6!3m5!1s0x3175271d5aaa7cd9:0xb1108e646ddecb55!8m2!3d10.8037915!4d106.7449356!16s%2Fg%2F11vd_ltq6h',
  isFeatured: true,
  isActive: true,
  displayOrder: 1,
};

export interface UseReviewFormProps {
  review?: GoogleReview | null;
  isOpen: boolean;
  onSaved: () => void;
  onClose: () => void;
}

export const useReviewForm = ({ review, isOpen, onSaved, onClose }: UseReviewFormProps) => {
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<SaveGoogleReviewRequest>(DEFAULT_FORM);

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
      setFormData(DEFAULT_FORM);
    }
    setErrorMessage(null);
  }, [review, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      if (
        !formData.reviewerName?.trim() ||
        !formData.reviewContent?.trim() ||
        !formData.reviewDate?.trim()
      ) {
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

  return {
    formData,
    setFormData,
    saving,
    errorMessage,
    handleSubmit,
  };
};

