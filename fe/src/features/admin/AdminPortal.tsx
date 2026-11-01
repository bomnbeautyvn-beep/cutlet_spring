import React from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from './AdminLogin';
import { useAuthStore } from '@/stores/auth.store';

export const AdminPortal: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AdminLogin onSuccess={() => {}} />
      </div>
    );
  }

  return (
    <AdminLayout
      onExitToPublicSite={() => {
        window.location.pathname = '/';
      }}
    />
  );
};
