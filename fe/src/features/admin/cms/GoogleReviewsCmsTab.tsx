import React from 'react';
import { useGoogleReviews } from './reviews/hooks/useGoogleReviews';
import { ReviewStatsHeader } from './reviews/components/ReviewStatsHeader';
import { ReviewCard } from './reviews/components/ReviewCard';
import { ReviewModal } from './ReviewModal';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';
import { ConfirmDeleteModal } from '@/features/admin/components/ConfirmDeleteModal';

export const GoogleReviewsCmsTab: React.FC = () => {
  const {
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
    deletingReview,
    setDeletingReview,
    confirmDeleteReview,
  } = useGoogleReviews();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Curated Google Reviews...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Trang Chủ > Khối Đánh Giá Khách Hàng (Google Reviews)"
        publicUrl="/#reviews"
        description="Hiển thị tại phần đánh giá khách hàng trên trang chủ (ngay trên khối Bản đồ). Giúp khách hàng mới thấy các phản hồi chân thực từ Google Maps, điểm xếp hạng trung bình và số lượng review."
        previewHint="Chỉ các bài đánh giá được bật 'Hiển thị công khai' mới xuất hiện trên trang chủ."
      />

      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded flex items-center justify-between text-sm font-medium ${
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
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Summary Banner & Action */}
      <ReviewStatsHeader
        summary={summary}
        onAddReview={() => {
          setSelectedReview(null);
          setIsModalOpen(true);
        }}
      />

      {/* Reviews Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <ReviewCard
            key={rev.id}
            review={rev}
            isBusy={actionLoadingId === rev.id}
            onToggleFeatured={handleToggleFeatured}
            onToggleStatus={handleToggleStatus}
            onEdit={(r) => {
              setSelectedReview(r);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
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

      {/* Delete Review Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingReview)}
        title="Xác Nhận Xóa Đánh Giá"
        itemType="Đánh giá khách hàng"
        itemName={deletingReview ? `Đánh giá từ ${deletingReview.author}` : ''}
        warningMessage="Hành động này sẽ xóa vĩnh viễn đánh giá này khỏi danh sách tuyển chọn trên website. Thao tác không thể hoàn tác."
        confirmLabel="Xác Nhận Xóa"
        isLoading={Boolean(actionLoadingId)}
        onConfirm={confirmDeleteReview}
        onClose={() => setDeletingReview(null)}
      />
    </div>
  );
};
