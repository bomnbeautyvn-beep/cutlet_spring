import React, { useState, useEffect } from 'react';
import { GoogleReview, GoogleReviewsSummary } from '@/types';
import { cmsService } from '@/services/cms.service';
import { ReviewModal } from './ReviewModal';

export const GoogleReviewsCmsTab: React.FC = () => {
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
      setReviews(prev => prev.map(r => (r.id === id ? updated : r)));
      setMessage({ text: `Review status changed to ${updated.isActive ? 'ACTIVE' : 'HIDDEN'}`, type: 'success' });
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
      setReviews(prev => prev.map(r => (r.id === id ? updated : r)));
      setMessage({ text: `Review featured status set to ${updated.isFeatured ? 'FEATURED' : 'STANDARD'}`, type: 'success' });
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
      setReviews(prev => prev.filter(r => r.id !== id));
      setMessage({ text: `Review by "${author}" deleted successfully`, type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to delete review', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Curated Google Reviews...</span>
      </div>
    );
  }

  const avgRating = summary?.averageRating ? Number(summary.averageRating).toFixed(1) : '4.8';
  const totalCount = summary?.totalReviewsCount || 562;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Summary Banner & Action */}
      <div className="bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] flex flex-col items-center justify-center shadow-2xs shrink-0">
            <span className="font-headline-lg text-2xl font-extrabold text-[#1b1c1a] leading-none">
              {avgRating}
            </span>
            <div className="flex items-center text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[12px] fill-1">
                  star
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-md text-xs uppercase tracking-widest text-[#af101a] font-bold">
                Google Maps Verified Feedback
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eae8e5] text-[#5b403d]">
                {totalCount}+ Reviews Total
              </span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a] mt-0.5">
              봄돈까스 - Cutlet Spring Thảo Điền
            </h3>
            <span className="text-xs text-[#585757] block">
              Curate featured guest experiences and publish authentic owner replies
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedReview(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_comment</span>
          <span>Add Curated Review</span>
        </button>
      </div>

      {/* Reviews Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => {
          const isBusy = actionLoadingId === rev.id;
          return (
            <div
              key={rev.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all duration-300 relative ${
                rev.isActive ? 'border-[#eae8e5]' : 'border-gray-300 opacity-60 bg-gray-50'
              }`}
            >
              <div>
                {/* Header: Stars & Language */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] fill-1">
                        star
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {rev.isFeatured && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full">
                        Featured
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-[#f5f3f0] text-[#5b403d] text-[10px] font-bold rounded-full uppercase">
                      {rev.reviewLanguage}
                    </span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#1b1c1a] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {rev.reviewerInitials || rev.reviewerName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-title-md text-xs font-bold text-[#1b1c1a] truncate">
                      {rev.reviewerName}
                    </h4>
                    <span className="text-[10px] text-[#786659] block">
                      {rev.reviewDate} {rev.reviewerMetadata ? `· ${rev.reviewerMetadata}` : ''}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <p className="font-body-md text-xs text-[#2a241f] italic leading-relaxed line-clamp-4">
                  &ldquo;{rev.reviewContent}&rdquo;
                </p>

                {/* Owner Reply */}
                {rev.ownerResponse && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#f5f3f0] border-l-2 border-[#af101a] text-[11px] text-[#5b403d] space-y-0.5">
                    <span className="font-bold text-[#af101a] text-[10px] uppercase block tracking-wider">
                      Phản hồi từ quán:
                    </span>
                    <p className="line-clamp-3 leading-relaxed text-[11px]">
                      {rev.ownerResponse}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-3 border-t border-[#eae8e5] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(rev.id)}
                    disabled={isBusy}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                      rev.isFeatured
                        ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {rev.isFeatured ? '★ Featured' : '☆ Feature'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(rev.id)}
                    disabled={isBusy}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                      rev.isActive
                        ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                        : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {rev.isActive ? 'Hide' : 'Publish'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReview(rev);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#5b403d] hover:bg-[#eae8e5] transition-colors cursor-pointer"
                    title="Edit Review"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rev.id, rev.reviewerName)}
                    disabled={isBusy}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadData}
          review={selectedReview}
        />
      )}
    </div>
  );
};

