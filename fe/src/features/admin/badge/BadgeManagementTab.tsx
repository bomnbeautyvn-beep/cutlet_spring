import React, { useState, useEffect } from 'react';
import { MenuBadge } from '@/types';
import { badgeService } from '@/services/badge.service';
import { BadgeModal } from './BadgeModal';

export const BadgeManagementTab: React.FC = () => {
  const [badges, setBadges] = useState<MenuBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [modalBadge, setModalBadge] = useState<MenuBadge | null | 'NEW'>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await badgeService.getAdminBadges();
      setBadges(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load atelier badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const handleToggleStatus = async (badge: MenuBadge) => {
    try {
      const nextStatus = !badge.active;
      await badgeService.updateBadge(badge.id, {
        code: badge.code,
        name: badge.name,
        nameVi: badge.nameVi,
        nameKr: badge.nameKr,
        nameJp: badge.nameJp,
        description: badge.description,
        badgeColor: badge.badgeColor,
        icon: badge.icon,
        displayOrder: badge.displayOrder,
        active: nextStatus,
      });
      setBadges((prev) =>
        prev.map((b) => (b.id === badge.id ? { ...b, active: nextStatus } : b))
      );
      setSuccessToast(`Badge "${badge.name}" is now ${nextStatus ? 'active' : 'inactive'}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to toggle badge status');
    }
  };

  const handleDelete = async (badge: MenuBadge) => {
    if (badge.assignedCount && badge.assignedCount > 0) {
      alert(
        `Cannot delete badge "${badge.name}" because it is currently assigned to ${badge.assignedCount} dish(es). Remove it from those dishes first.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete badge "${badge.name}"?`)) {
      return;
    }

    try {
      setDeletingId(badge.id);
      await badgeService.deleteBadge(badge.id);
      setBadges((prev) => prev.filter((b) => b.id !== badge.id));
      setSuccessToast(`Badge "${badge.name}" deleted successfully`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete badge');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast & Alert */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-none flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-none flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#eae8e5] rounded-none">
        <div>
          <h2 className="text-sm font-bold text-[#1b1c1a] uppercase tracking-wider">
            Atelier Badges &amp; Dining Attributes
          </h2>
          <p className="text-xs text-[#585757]">
            Manage dynamic visual badges (Chef Signature, Best Seller, Spicy Glaze, etc.) displayed on menus
          </p>
        </div>

        <button
          onClick={() => setModalBadge('NEW')}
          className="px-4 py-2 bg-[#af101a] hover:bg-[#930010] text-white text-xs font-bold uppercase tracking-wider rounded-none shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Atelier Badge</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#eae8e5] rounded-none overflow-x-auto shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[#585757] text-xs gap-2">
            <div className="w-5 h-5 border-2 border-[#af101a] border-t-transparent rounded-full animate-spin" />
            <span>Loading badges...</span>
          </div>
        ) : badges.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8f6f6c]">
            No badges found. Create a badge to highlight special dish qualities.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eae8e5] bg-[#fbf9f6] text-[10px] uppercase font-bold text-[#5b403d] tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Badge Visual</th>
                <th className="py-3 px-4">Code / Slug</th>
                <th className="py-3 px-4">Multilingual Titles</th>
                <th className="py-3 px-4">Assigned Dishes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e5]">
              {badges.map((b) => (
                <tr key={b.id} className="hover:bg-[#fcfbf9] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#585757]">
                    #{b.displayOrder || 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none border border-[#eae8e5] bg-[#fbf9f6]">
                      <div
                        className="w-4 h-4 rounded-none flex items-center justify-center text-white"
                        style={{ backgroundColor: b.badgeColor || '#af101a' }}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {b.icon || 'label'}
                        </span>
                      </div>
                      <span className="font-bold text-[#1b1c1a]">{b.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#af101a] font-semibold">
                    {b.code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-0.5 text-[11px]">
                      {b.nameVi && <div>🇻🇳 {b.nameVi}</div>}
                      {b.nameKr && <div>🇰🇷 {b.nameKr}</div>}
                      {b.nameJp && <div>🇯🇵 {b.nameJp}</div>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-mono bg-[#f5f3f0] text-[#1b1c1a] border border-[#eae8e5]">
                      {b.assignedCount ?? 0} dishes
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-none border cursor-pointer transition-colors ${
                        b.active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{b.active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setModalBadge(b)}
                        className="p-1.5 text-[#585757] hover:text-[#1b1c1a] hover:bg-[#eae8e5] rounded-none transition-colors cursor-pointer"
                        title="Edit badge"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        disabled={deletingId === b.id}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-none transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete badge"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Badge Modal */}
      {modalBadge && (
        <BadgeModal
          badge={modalBadge === 'NEW' ? null : modalBadge}
          onClose={() => setModalBadge(null)}
          onSaved={() => {
            loadBadges();
            setSuccessToast('Badge saved successfully');
            setTimeout(() => setSuccessToast(null), 3000);
          }}
        />
      )}
    </div>
  );
};

