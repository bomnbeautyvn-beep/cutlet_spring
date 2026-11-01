import React, { useState, useEffect } from 'react';
import { Ingredient } from '@/types';
import { cmsService } from '@/services/cms.service';
import { IngredientModal } from './IngredientModal';

export const IngredientsCmsTab: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getAdminIngredients();
      setIngredients(data);
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to load ingredients', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      setActionLoadingId(id);
      const updated = await cmsService.toggleAdminIngredientStatus(id);
      setIngredients(prev => prev.map(item => (item.id === id ? updated : item)));
      setMessage({ text: `Ingredient status updated to ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}`, type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to update ingredient status', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      await cmsService.deleteAdminIngredient(id);
      setIngredients(prev => prev.filter(item => item.id !== id));
      setMessage({ text: `Ingredient "${name}" deleted successfully`, type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to delete ingredient', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

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
        {ingredients.map((item) => {
          const isBusy = actionLoadingId === item.id;
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all duration-300 relative ${
                item.isActive ? 'border-[#eae8e5]' : 'border-gray-300 opacity-60 bg-gray-50'
              }`}
            >
              <div>
                {/* Visual Frame */}
                <div className="w-full h-40 rounded-xl overflow-hidden bg-[#f3f1ec] border border-[#eae6df] mb-4 relative flex items-center justify-center group">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.nameEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center text-[#8f6f6c] p-2">
                      <span className="material-symbols-outlined text-[32px] block">image</span>
                      <span className="text-[11px] font-semibold">No Image</span>
                    </div>
                  )}

                  {/* Order Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    #{item.displayOrder}
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-600' : 'bg-gray-400'}`}
                      />
                      {item.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Multilingual Titles */}
                <div className="space-y-1 pb-3 border-b border-[#eae8e5]">
                  <h4 className="font-kr-serif text-base font-bold text-[#1b1c1a] leading-tight">
                    {item.nameKr}
                  </h4>
                  <div className="font-menu-title text-xs font-bold text-[#af101a] uppercase tracking-wide">
                    {item.nameEn}
                  </div>
                  <div className="text-xs text-[#585757] font-medium">
                    {item.nameVi} · <span className="font-jp-serif">{item.nameJp}</span>
                  </div>
                </div>

                {/* Subtitle */}
                {item.subtitleEn && (
                  <div className="mt-2 text-[11px] font-bold text-[#835500]">
                    {item.subtitleVi || item.subtitleEn}
                  </div>
                )}

                {/* Description snippet */}
                <p className="mt-2 text-xs text-[#5b403d] leading-relaxed line-clamp-3">
                  {item.descriptionVi || item.descriptionEn}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#eae8e5] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item.id)}
                  disabled={isBusy}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    item.isActive
                      ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                      : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {isBusy ? '...' : item.isActive ? 'Hide' : 'Publish'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIngredient(item);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#5b403d] hover:bg-[#eae8e5] transition-colors cursor-pointer"
                    title="Edit Ingredient"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.nameEn)}
                    disabled={isBusy}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Ingredient"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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

