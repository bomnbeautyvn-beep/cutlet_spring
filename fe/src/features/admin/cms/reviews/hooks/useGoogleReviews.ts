import { useState, useEffect } from 'react';
import { GoogleReview, GoogleReviewsSummary } from '@/types';
import { cmsService } from '@/services/cms.service';

export interface UseGoogleReviewsReturn {
  reviews: GoogleReview[];
  summary: GoogleReviewsSummary | null;
  loading: boolean;
  selectedReview: GoogleReview | null;
  isModalOpen: boolean;
  message: { text: string; type: 'success' | 'error' } | null;
  actionLoadingId: string | null;
  loadData: () => Promise<void>;
  setSelectedReview: (rev: GoogleReview | null) => void;
  setIsModalOpen: (open: boolean) => void;
  setMessage: (msg: { text: string; type: 'success' | 'error' } | null) => void;
  handleToggleStatus: (id: string) => Promise<void>;
  handleToggleFeatured: (id: string) => Promise<void>;
  handleDelete: (id: string, author: string) => Promise<void>;
}

export const useGoogleReviews = (): UseGoogleReviewsReturn => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [summary, setSummary] = useState<GoogleReviewsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [revList, sumData] = await Promise.all([
        cmsService.getAdminReviews(),
        cmsService.getReviewsSummary(),
      ]);
      setReviews(revList);
      setSummary(sumData);
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to load Google reviews data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      setActionLoadingId(id);
      const updated = await cmsService.toggleAdminReviewStatus(id);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setMessage({
        text: `Review status changed to ${updated.isActive ? 'ACTIVE' : 'HIDDEN'}`,
        type: 'success',
      });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to update review status', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      setActionLoadingId(id);
      const updated = await cmsService.toggleAdminReviewFeatured(id);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setMessage({
        text: `Review featured status set to ${updated.isFeatured ? 'FEATURED' : 'STANDARD'}`,
        type: 'success',
      });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to toggle featured status', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, author: string) => {
    if (!window.confirm(`Are you sure you want to delete review by "${author}"?`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      await cmsService.deleteAdminReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setMessage({ text: `Review by "${author}" deleted successfully`, type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to delete review', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
    reviews,
    summary,
    loading,
    selectedReview,
    isModalOpen,
    message,
    actionLoadingId,
    loadData,
    setSelectedReview,
    setIsModalOpen,
    setMessage,
    handleToggleStatus,
    handleToggleFeatured,
    handleDelete,
  };
};

