import { useState, useEffect } from 'react';
import { cmsService } from '@/services/cms.service';
import { HeaderFooterSettings } from '@/types';

export const useHeaderFooter = () => {
  const [settings, setSettings] = useState<HeaderFooterSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    cmsService.getHeaderFooter()
      .then(res => {
        if (isMounted) setSettings(res);
      })
      .catch(err => {
        console.warn('Failed to fetch header-footer settings, using defaults', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading };
};

