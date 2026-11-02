import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { useAdminDishForm } from './menu/hooks/useAdminDishForm';
import { DishModalHeader } from './menu/modal/DishModalHeader';
import { DishPricingAndImageSection } from './menu/modal/DishPricingAndImageSection';
import { DishBasicInfoSection } from './menu/modal/DishBasicInfoSection';
import { DishBadgesSection } from './menu/modal/DishBadgesSection';
import { DishMultilingualSection } from './menu/modal/DishMultilingualSection';
import { DishModalFooter } from './menu/modal/DishModalFooter';
import { UnsavedChangesNotice } from './components/UnsavedChangesNotice';

interface AdminDishModalProps {
  dish: MenuItem | null; // null = new dish
  onClose: () => void;
  onSaved: () => void;
}

export const AdminDishModal: React.FC<AdminDishModalProps> = ({ dish, onClose, onSaved }) => {
  const form = useAdminDishForm({ dish, onSaved, onClose });
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleRequestClose = () => {
    if (form.isDirty) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
      onClick={handleRequestClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[94vh] bg-[#fbf9f6] rounded shadow-2xl border border-[#eae8e5] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <DishModalHeader dish={dish} isEditing={form.isEditing} onClose={handleRequestClose} />

        {/* Exit confirmation dialog overlay */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded p-5 max-w-md w-full border-2 border-amber-400 shadow-2xl animate-gentle-shake text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">lock</span>
              </div>
              <h3 className="font-bold text-[#1b1c1a] text-base">Bạn có thay đổi chưa được lưu!</h3>
              <p className="text-xs text-[#585757] leading-relaxed">
                Các chỉnh sửa về giá, thông tin hoặc bản dịch sẽ bị hủy nếu đóng lúc này. Bạn có chắc chắn muốn thoát mà không lưu?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="px-4 py-2 bg-[#af101a] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#930010] shadow-xs cursor-pointer"
                >
                  Tiếp tục chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#eae8e5] text-[#585757] text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-100 cursor-pointer"
                >
                  Xác nhận thoát
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unified Single Scrollable Body */}
        <form onSubmit={form.handleSubmit} className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 sm:space-y-5">
          {form.isDirty && (
            <UnsavedChangesNotice
              isDirty={form.isDirty}
              isSaving={form.isSubmitting}
              onSave={form.handleSubmit}
              saveButtonText={form.isEditing ? 'Save Dish' : 'Create Dish'}
              customMessage="Đang có chỉnh sửa món ăn chưa lưu!"
            />
          )}

          {form.errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[17px]">error</span>
              <span className="font-medium">{form.errorMessage}</span>
            </div>
          )}

          {/* Pricing & Image */}
          <DishPricingAndImageSection
            basePrice={form.basePrice}
            onBasePriceChange={form.setBasePrice}
            prepTimeMinutes={form.prepTimeMinutes}
            onPrepTimeChange={form.setPrepTimeMinutes}
            hasSizes={form.hasSizes}
            onHasSizesChange={form.toggleHasSizes}
            sizes={form.sizes}
            onAddSize={form.addSize}
            onRemoveSize={form.removeSize}
            onUpdateSize={form.updateSize}
            sizesError={form.validationErrors.sizes}
            imagePreview={form.imagePreview}
            onFileChange={form.handleFileChange}
            onDropFile={form.handleFileDrop}
            uploading={form.uploading}
            uploadError={form.uploadError}
          />

          {/* Basic Information */}
          <DishBasicInfoSection
            id={form.id}
            onIdChange={form.setId}
            isEditing={form.isEditing}
            categoryId={form.categoryId}
            onCategoryChange={form.setCategoryId}
            categories={form.categories}
            active={form.active}
            onActiveChange={form.setActive}
          />

          {/* Atelier Badges & Dining Attributes */}
          <DishBadgesSection
            badges={form.badges}
            loadingBadges={form.loadingBadges}
            selectedBadgeIds={form.selectedBadgeIds}
            onToggleBadge={form.toggleBadge}
            isSpicySelected={form.isSpicySelected}
            spiceLevel={form.spiceLevel}
            onSpiceLevelChange={form.setSpiceLevel}
            spiceNote={form.spiceNote}
            onSpiceNoteChange={form.setSpiceNote}
          />

          {/* Multilingual Menu Content */}
          <DishMultilingualSection
            activeLang={form.activeLangTab}
            onActiveLangChange={form.setActiveLangTab}
            // Vietnamese
            nameVi={form.nameVi}
            onNameViChange={form.setNameVi}
            portionVi={form.portionVi}
            onPortionViChange={form.setPortionVi}
            descriptionVi={form.descriptionVi}
            onDescriptionViChange={form.setDescriptionVi}
            // English
            nameEn={form.nameEn}
            onNameEnChange={form.setNameEn}
            portionEn={form.portionEn}
            onPortionEnChange={form.setPortionEn}
            descriptionEn={form.descriptionEn}
            onDescriptionEnChange={form.setDescriptionEn}
            // Korean
            nameKr={form.nameKr}
            onNameKrChange={form.setNameKr}
            nameKrSubtitle={form.nameKrSubtitle}
            onNameKrSubtitleChange={form.setNameKrSubtitle}
            portionKr={form.portionKr}
            onPortionKrChange={form.setPortionKr}
            descriptionKr={form.descriptionKr}
            onDescriptionKrChange={form.setDescriptionKr}
            // Japanese
            nameJp={form.nameJp}
            onNameJpChange={form.setNameJp}
            portionJp={form.portionJp}
            onPortionJpChange={form.setPortionJp}
            descriptionJp={form.descriptionJp}
            onDescriptionJpChange={form.setDescriptionJp}
            errors={form.validationErrors}
          />
        </form>

        {/* Footer */}
        <DishModalFooter
          isEditing={form.isEditing}
          isSubmitting={form.isSubmitting}
          isDirty={form.isDirty}
          onClose={handleRequestClose}
          onSubmit={form.handleSubmit}
        />
      </div>
    </div>
  );
};
