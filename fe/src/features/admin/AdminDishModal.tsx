import React from 'react';
import { MenuItem } from '@/types';
import { useAdminDishForm } from './menu/hooks/useAdminDishForm';
import { DishModalHeader } from './menu/modal/DishModalHeader';
import { DishModalTabs } from './menu/modal/DishModalTabs';
import { DishLanguageFields } from './menu/modal/DishLanguageFields';
import { DishGeneralFields } from './menu/modal/DishGeneralFields';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#eae8e5] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <DishModalHeader dish={dish} isEditing={form.isEditing} onClose={onClose} />

        {/* Tabs */}
        <DishModalTabs
          activeTab={form.activeTab}
          onTabChange={form.setActiveTab}
          isEnValid={form.isEnValid}
          isKoValid={form.isKoValid}
          isViValid={form.isViValid}
          isJaValid={form.isJaValid}
          isGeneralValid={form.isGeneralValid}
        />

        {/* Body */}
        <form onSubmit={form.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {form.errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{form.errorMessage}</span>
            </div>
          )}

          {form.activeTab === 'en' && (
            <DishLanguageFields
              language="en"
              name={form.nameEn}
              onNameChange={form.setNameEn}
              nameError={form.validationErrors.nameEn}
              portion={form.portionEn}
              onPortionChange={form.setPortionEn}
              portionError={form.validationErrors.portionEn}
              description={form.descriptionEn}
              onDescriptionChange={form.setDescriptionEn}
              descriptionError={form.validationErrors.descriptionEn}
            />
          )}

          {form.activeTab === 'ko' && (
            <DishLanguageFields
              language="ko"
              name={form.nameKr}
              onNameChange={form.setNameKr}
              nameError={form.validationErrors.nameKr}
              subtitle={form.nameKrSubtitle}
              onSubtitleChange={form.setNameKrSubtitle}
              portion={form.portionKr}
              onPortionChange={form.setPortionKr}
              portionError={form.validationErrors.portionKr}
              description={form.descriptionKr}
              onDescriptionChange={form.setDescriptionKr}
              descriptionError={form.validationErrors.descriptionKr}
            />
          )}

          {form.activeTab === 'vi' && (
            <DishLanguageFields
              language="vi"
              name={form.nameVi}
              onNameChange={form.setNameVi}
              nameError={form.validationErrors.nameVi}
              portion={form.portionVi}
              onPortionChange={form.setPortionVi}
              portionError={form.validationErrors.portionVi}
              description={form.descriptionVi}
              onDescriptionChange={form.setDescriptionVi}
              descriptionError={form.validationErrors.descriptionVi}
            />
          )}

          {form.activeTab === 'ja' && (
            <DishLanguageFields
              language="ja"
              name={form.nameJp}
              onNameChange={form.setNameJp}
              nameError={form.validationErrors.nameJp}
              portion={form.portionJp}
              onPortionChange={form.setPortionJp}
              portionError={form.validationErrors.portionJp}
              description={form.descriptionJp}
              onDescriptionChange={form.setDescriptionJp}
              descriptionError={form.validationErrors.descriptionJp}
            />
          )}

          {form.activeTab === 'general' && (
            <DishGeneralFields
              id={form.id}
              onIdChange={form.setId}
              isEditing={form.isEditing}
              categoryId={form.categoryId}
              onCategoryChange={form.setCategoryId}
              basePrice={form.basePrice}
              onBasePriceChange={form.setBasePrice}
              prepTimeMinutes={form.prepTimeMinutes}
              onPrepTimeChange={form.setPrepTimeMinutes}
              isChefSignature={form.isChefSignature}
              onChefSignatureChange={form.setIsChefSignature}
              isBestSeller={form.isBestSeller}
              onBestSellerChange={form.setIsBestSeller}
              isLimited={form.isLimited}
              onLimitedChange={form.setIsLimited}
              isSpicy={form.isSpicy}
              onSpicyChange={form.setIsSpicy}
              imagePreview={form.imagePreview}
              onFileChange={form.handleFileChange}
              active={form.active}
              onActiveChange={form.setActive}
            />
          )}
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
