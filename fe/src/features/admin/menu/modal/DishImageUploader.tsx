import React from 'react';

interface DishImageUploaderProps {
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DishImageUploader: React.FC<DishImageUploaderProps> = ({
  imagePreview,
  onFileChange,
}) => {
  return (
    <div className="p-4 bg-[#fbf9f6] rounded-xl border border-[#eae8e5] space-y-3">
      <span className="block text-xs font-bold uppercase tracking-wider text-[#585757]">
        Photo &amp; Cloudinary Asset
      </span>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl bg-white border border-[#eae8e5] overflow-hidden shrink-0 flex items-center justify-center">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-2xl text-gray-300">image</span>
          )}
        </div>
        <div className="space-y-1.5 flex-1">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileChange}
            className="text-xs text-[#585757] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#af101a] file:text-white file:cursor-pointer cursor-pointer"
          />
          <p className="text-[10px] text-[#8f6f6c]">
            PNG, JPG, WebP up to 10MB. Uploads directly to Cloudinary storage.
          </p>
        </div>
      </div>
    </div>
  );
};

