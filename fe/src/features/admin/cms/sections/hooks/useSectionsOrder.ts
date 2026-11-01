import { useState, useEffect } from 'react';
import { HomepageSection, Language, UpdateHomepageSectionRequest } from '@/types';
import { cmsService } from '@/services/cms.service';

export interface UseSectionsOrderReturn {
  sections: HomepageSection[];
  loading: boolean;
  savingId: string | null;
  editingSection: HomepageSection | null;
  activeLangTab: Language;
  message: { text: string; type: 'success' | 'error' } | null;
  setEditingSection: (sec: HomepageSection | null) => void;
  setActiveLangTab: (lang: Language) => void;
  setMessage: (msg: { text: string; type: 'success' | 'error' } | null) => void;
  handleMove: (index: number, direction: 'up' | 'down') => Promise<void>;
  handleToggleActive: (sec: HomepageSection) => Promise<void>;
  handleSaveEdit: (e: React.FormEvent) => Promise<void>;
}

export const useSectionsOrder = (): UseSectionsOrderReturn => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<Language>('VI');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getAdminSections();
      setSections(data);
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to load homepage sections', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Optimistically update
    setSections(reordered);

    try {
      const ids = reordered.map((s) => s.id);
      const updated = await cmsService.reorderAdminSections(ids);
      setSections(updated);
      setMessage({ text: 'Section order updated and saved successfully!', type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to save section ordering', type: 'error' });
      loadSections();
    }
  };

  const handleToggleActive = async (sec: HomepageSection) => {
    try {
      setSavingId(sec.id);
      const payload: UpdateHomepageSectionRequest = {
        sectionKey: sec.sectionKey,
        titleEn: sec.titleEn,
        titleKr: sec.titleKr,
        titleVi: sec.titleVi,
        titleJp: sec.titleJp,
        subtitleEn: sec.subtitleEn,
        subtitleKr: sec.subtitleKr,
        subtitleVi: sec.subtitleVi,
        subtitleJp: sec.subtitleJp,
        displayOrder: sec.displayOrder,
        isActive: !sec.isActive,
      };
      const updated = await cmsService.updateAdminSection(sec.id, payload);
      setSections((prev) => prev.map((s) => (s.id === sec.id ? updated : s)));
      setMessage({
        text: `Section "${sec.titleEn}" is now ${updated.isActive ? 'ACTIVE' : 'HIDDEN'} on website`,
        type: 'success',
      });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to update section visibility', type: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      setSavingId(editingSection.id);
      const payload: UpdateHomepageSectionRequest = {
        sectionKey: editingSection.sectionKey,
        titleEn: editingSection.titleEn,
        titleKr: editingSection.titleKr,
        titleVi: editingSection.titleVi,
        titleJp: editingSection.titleJp,
        subtitleEn: editingSection.subtitleEn,
        subtitleKr: editingSection.subtitleKr,
        subtitleVi: editingSection.subtitleVi,
        subtitleJp: editingSection.subtitleJp,
        displayOrder: editingSection.displayOrder,
        isActive: editingSection.isActive,
      };
      const updated = await cmsService.updateAdminSection(editingSection.id, payload);
      setSections((prev) => prev.map((s) => (s.id === editingSection.id ? updated : s)));
      setEditingSection(null);
      setMessage({ text: `Section "${updated.titleEn}" titles updated successfully!`, type: 'success' });
    } catch (err: unknown) {
      console.error(err);
      setMessage({ text: 'Failed to save section titles', type: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  return {
    sections,
    loading,
    savingId,
    editingSection,
    activeLangTab,
    message,
    setEditingSection,
    setActiveLangTab,
    setMessage,
    handleMove,
    handleToggleActive,
    handleSaveEdit,
  };
};

