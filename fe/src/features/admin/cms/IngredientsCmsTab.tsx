import React from 'react';
import { useIngredientsCms } from './ingredients/hooks/useIngredientsCms';
import { IngredientCard } from './ingredients/components/IngredientCard';
import { IngredientModal } from './IngredientModal';
import { PublicPlacementGuide } from '@/features/admin/components/PublicPlacementGuide';

export const IngredientsCmsTab: React.FC = () => {
  const {
    ingredients,
    loading,
    selectedIngredient,
    isModalOpen,
    message,
    actionLoadingId,
    loadIngredients,
    setSelectedIngredient,
    setIsModalOpen,
    setMessage,
    handleToggleStatus,
    handleDelete,
  } = useIngredientsCms();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#585757]">
        <div className="w-8 h-8 rounded-full border-2 border-[#af101a] border-t-transparent animate-spin mr-3" />
        <span>Loading Atelier Ingredients...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual Website Placement Guide */}
      <PublicPlacementGuide
        locationTitle="Trang Chủ > Khối Triết Lý Nguyên Liệu (Atelier Philosophy)"
        publicUrl="/#ingredients"
        description="Hiển thị ngay bên dưới khối Hero trên trang chủ. Bao gồm 4 thẻ trụ cột nguyên liệu thủ công: Thịt heo tuyển chọn, Bột chiên Panko tươi, Dầu chiên nhiệt kép và Gạo ngọc dẻo thơm."
        previewHint="Mỗi nguyên liệu có ảnh chụp cận cảnh, huy hiệu xuất xứ và mô tả chi tiết bằng 4 ngôn ngữ (EN, KO, VI, JA)."
      />

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
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#eae8e5] p-6 shadow-xs">
        <div>
          <h3 className="font-headline-sm text-lg font-bold text-[#1b1c1a]">
            Atelier Ingredients (Nguyên Liệu Tuyển Chọn)
          </h3>
          <p className="text-xs text-[#585757]">
            Manage the foundations of Cutlet Spring tonkatsu craft displayed on the public home page
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedIngredient(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-label-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Ingredient</span>
        </button>
      </div>

      {/* Ingredients Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ingredients.map((item) => (
          <IngredientCard
            key={item.id}
            ingredient={item}
            isBusy={actionLoadingId === item.id}
            onToggleStatus={handleToggleStatus}
            onEdit={(it) => {
              setSelectedIngredient(it);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Ingredient Create/Edit Modal */}
      {isModalOpen && (
        <IngredientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadIngredients}
          ingredient={selectedIngredient}
        />
      )}
    </div>
  );
};
