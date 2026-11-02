import React from 'react';
import { GoogleReview } from '@/types';

interface ReviewCardProps {
  review: GoogleReview;
  isBusy: boolean;
  onToggleFeatured: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (rev: GoogleReview) => void;
  onDelete: (id: string, author: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review: rev,
  isBusy,
  onToggleFeatured,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`flex flex-col justify-between rounded border bg-white p-5 shadow-xs transition-all duration-300 relative ${
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
          <div className="mt-3 p-2.5 rounded bg-[#f5f3f0] border-l-2 border-[#af101a] text-[11px] text-[#5b403d] space-y-0.5">
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
            onClick={() => onToggleFeatured(rev.id)}
            disabled={isBusy}
            className={`text-[10px] font-bold px-2 py-1 rounded border transition-all cursor-pointer ${
              rev.isFeatured
                ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100'
                : 'border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {rev.isFeatured ? '★ Featured' : '☆ Feature'}
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(rev.id)}
            disabled={isBusy}
            className={`text-[10px] font-bold px-2 py-1 rounded border transition-all cursor-pointer ${
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
            onClick={() => onEdit(rev)}
            className="p-1.5 rounded text-[#5b403d] hover:bg-[#eae8e5] transition-colors cursor-pointer"
            title="Edit Review"
          >
            <span className="material-symbols-outlined text-[17px]">edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(rev.id, rev.reviewerName)}
            disabled={isBusy}
            className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete Review"
          >
            <span className="material-symbols-outlined text-[17px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

