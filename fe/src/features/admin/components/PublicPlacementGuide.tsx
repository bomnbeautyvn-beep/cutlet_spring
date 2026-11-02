import React from 'react';

interface PublicPlacementGuideProps {
  locationTitle: string;
  badge?: string;
  description: string;
  publicUrl?: string;
  previewHint?: string;
}

export const PublicPlacementGuide: React.FC<PublicPlacementGuideProps> = ({
  locationTitle,
  badge = 'VỊ TRÍ HIỂN THỊ TRÊN WEBSITE',
  description,
  publicUrl = '/',
  previewHint,
}) => {
  return (
    <div className="bg-[#fbf9f6] border border-[#e6e2da] border-l-4 border-l-[#af101a] rounded p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eae8e5]/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="material-symbols-outlined text-[18px] text-[#af101a]">
            explore
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8f6f6c]">
            {badge}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#1b1c1a] text-white text-[11px] font-bold">
            {locationTitle}
          </span>
        </div>

        {publicUrl && (
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#af101a] hover:text-[#930010] transition-colors cursor-pointer shrink-0"
          >
            <span>Xem trực tiếp trên web</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        )}
      </div>

      <div className="pt-2 text-xs text-[#585757] leading-relaxed">
        <p>{description}</p>
        {previewHint && (
          <p className="text-[11px] text-[#8f6f6c] mt-1 italic font-medium">
            💡 {previewHint}
          </p>
        )}
      </div>
    </div>
  );
};

