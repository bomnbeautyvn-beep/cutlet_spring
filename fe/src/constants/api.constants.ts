const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

export const API_ENDPOINTS = {
  AUTH: {
    CSRF: '/auth/csrf',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_RESET_OTP: '/auth/verify-reset-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  MENU: {
    LIST: '/menu',
    DETAIL: (id: string) => `/menu/${id}`,
    FEATURED: '/menu/featured',
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
  },
  RESTAURANT: {
    SETTINGS: '/restaurant/settings',
  },
  PUBLIC_CMS: {
    HOMEPAGE: '/public/homepage',
    INGREDIENTS: '/public/ingredients',
    REVIEWS: '/public/reviews',
    REVIEWS_SUMMARY: '/public/reviews/summary',
    HEADER_FOOTER: '/public/header-footer',
  },
  ADMIN: {
    DASHBOARD: {
      STATS: '/admin/dashboard/stats',
    },
    CMS: {
      SECTIONS: {
        LIST: '/admin/cms/sections',
        UPDATE: (id: string) => `/admin/cms/sections/${id}`,
        REORDER: '/admin/cms/sections/reorder',
      },
      HERO: {
        GET: '/admin/cms/hero',
        UPDATE: '/admin/cms/hero',
        IMAGE: '/admin/cms/hero/image',
      },
      INGREDIENTS: {
        LIST: '/admin/cms/ingredients',
        DETAIL: (id: string) => `/admin/cms/ingredients/${id}`,
        CREATE: '/admin/cms/ingredients',
        UPDATE: (id: string) => `/admin/cms/ingredients/${id}`,
        TOGGLE_STATUS: (id: string) => `/admin/cms/ingredients/${id}/status`,
        DELETE: (id: string) => `/admin/cms/ingredients/${id}`,
        IMAGE: (id: string) => `/admin/cms/ingredients/${id}/image`,
      },
      REVIEWS: {
        LIST: '/admin/cms/reviews',
        DETAIL: (id: string) => `/admin/cms/reviews/${id}`,
        CREATE: '/admin/cms/reviews',
        UPDATE: (id: string) => `/admin/cms/reviews/${id}`,
        TOGGLE_STATUS: (id: string) => `/admin/cms/reviews/${id}/status`,
        TOGGLE_FEATURED: (id: string) => `/admin/cms/reviews/${id}/featured`,
        DELETE: (id: string) => `/admin/cms/reviews/${id}`,
      },
      HEADER_FOOTER: {
        GET: '/admin/cms/header-footer',
        UPDATE: '/admin/cms/header-footer',
        LOGO: '/admin/cms/header-footer/logo',
      },
    },
    MENU: {
      LIST: '/admin/menu',
      DETAIL: (id: string) => `/admin/menu/${id}`,
      CREATE: '/admin/menu',
      UPDATE: (id: string) => `/admin/menu/${id}`,
      DELETE: (id: string) => `/admin/menu/${id}`,
      TOGGLE_ACTIVE: (id: string) => `/admin/menu/${id}/active`,
      SET_STATUS: (id: string) => `/admin/menu/${id}/status`,
      IMAGE_UPLOAD: (id: string) => `/admin/menu/${id}/image`,
      IMAGE_DELETE: (id: string) => `/admin/menu/${id}/image`,
    },
    CATEGORIES: {
      LIST: '/admin/categories',
      CREATE: '/admin/categories',
      UPDATE: (id: string) => `/admin/categories/${id}`,
      DELETE: (id: string) => `/admin/categories/${id}`,
    },
    RESTAURANT: {
      SETTINGS: '/admin/restaurant/settings',
      LOGO: '/admin/restaurant/settings/logo',
      BANNER: '/admin/restaurant/settings/banner',
    },
    ACCOUNTS: {
      LIST: '/admin/accounts',
      DETAIL: (id: string) => `/admin/accounts/${id}`,
      CREATE: '/admin/accounts',
      UPDATE: (id: string) => `/admin/accounts/${id}`,
      SET_STATUS: (id: string) => `/admin/accounts/${id}/status`,
      RESET_PASSWORD: (id: string) => `/admin/accounts/${id}/reset-password`,
      AUDIT_LOGS: '/admin/accounts/audit-logs',
    },
    EMAIL: {
      GET: '/admin/settings/email',
      UPDATE: '/admin/settings/email',
      TEST_CONNECTION: '/admin/settings/email/test-connection',
      SEND_TEST: '/admin/settings/email/send-test',
    },
  },
} as const;
