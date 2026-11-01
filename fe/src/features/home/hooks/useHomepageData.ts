import { useState, useEffect, useCallback } from 'react';
import { cmsService } from '@/services/cms.service';
import { HomepagePublicData } from '@/types';

export const useHomepageData = () => {
  const [data, setData] = useState<HomepagePublicData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await cmsService.getHomepageData();
      setData(res);
    } catch (err: unknown) {
      console.error('Failed to load homepage CMS data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load homepage data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, reload: fetchData };
};

