import { useState, useEffect } from 'react';
import { Ingredient } from '@/types';
import { cmsService } from '@/services/cms.service';

export interface UseIngredientsCmsReturn {
  ingredients: Ingredient[];
  loading: boolean;
  selectedIngredient: Ingredient | null;
  isModalOpen: boolean;
  message: { text: string; type: 'success' | 'error' } | null;
  actionLoadingId: string | null;
  loadIngredients: () => Promise<void>;
  setSelectedIngredient: (item: Ingredient | null) => void;
  setIsModalOpen: (open: boolean) => void;
  setMessage: (msg: { text: string; type: 'success' | 'error' } | null) => void;
  handleToggleStatus: (id: string) => Promise<void>;
  handleDelete: (id: string, name: string) => void;
  deletingIngredient: { id: string; name: string } | null;
  setDeletingIngredient: (item: { id: string; name: string } | null) => void;
  confirmDeleteIngredient: () => Promise<void>;
}

export const useIngredientsCms = (): UseIngredientsCmsReturn => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deletingIngredient, setDeletingIngredient] = useState<{ id: string; name: string } | null>(null);

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
      setIngredients((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setMessage({
        text: `Ingredient status updated to ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}`,
        type: 'success',
      });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to update ingredient status', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeletingIngredient({ id, name });
  };

  const confirmDeleteIngredient = async () => {
    if (!deletingIngredient) return;
    const { id, name } = deletingIngredient;
    try {
      setActionLoadingId(id);
      await cmsService.deleteAdminIngredient(id);
      setIngredients((prev) => prev.filter((item) => item.id !== id));
      setMessage({ text: `Nguyên liệu "${name}" đã được xóa thành công`, type: 'success' });
      setDeletingIngredient(null);
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Không thể xóa nguyên liệu', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
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
    deletingIngredient,
    setDeletingIngredient,
    confirmDeleteIngredient,
  };
};

