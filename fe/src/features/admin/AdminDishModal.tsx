import React from 'react';
import { MenuItem } from '@/types';
import { useAdminDishForm } from './menu/hooks/useAdminDishForm';
import { DishModalHeader } from './menu/modal/DishModalHeader';
import { DishPricingAndImageSection } from './menu/modal/DishPricingAndImageSection';
import { DishBasicInfoSection } from './menu/modal/DishBasicInfoSection';
import { DishBadgesSection } from './menu/modal/DishBadgesSection';
import { DishMultilingualSection } from './menu/modal/DishMultilingualSection';
import { DishModalFooter } from './menu/modal/DishModalFooter';

interface AdminDishModalProps {
  dish: MenuItem | null; // null = new dish
  onClose: () => void;
  onSaved: () => void;
}

export const AdminDishModal: React.FC<AdminDishModalProps> = ({ dish, onClose, onSaved }) => {
  const form = useAdminDishForm({ dish, onSaved, onClose });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[94vh] bg-[#fbf9f6] rounded-2xl shadow-2xl border border-[#eae8e5] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <DishModalHeader dish={dish} isEditing={form.isEditing} onClose={onClose} />

        {/* Unified Single Scrollable Body */}
        <form onSubmit={form.handleSubmit} className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 sm:space-y-5">
          {form.errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
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
          onClose={onClose}
          onSubmit={form.handleSubmit}
        />
      </div>
    </div>
  );
};
