/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/stores';
import { useAuthStore } from '@/stores/auth.store';
import { Header, Footer } from '@/components/layout';
import { HomeScreen } from '@/features/home';
import { MenuScreen } from '@/features/menu';
import { AdminLayout, AdminLogin } from '@/features/admin';

export default function App() {
  const { currentView, language, setCurrentView, setLanguage } = useUIStore();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [routePath, setRoutePath] = useState<string>(() => window.location.pathname);

  // Check auth session on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle URL navigation and popstate
  useEffect(() => {
    const handlePopState = () => {
      setRoutePath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dedicated Admin routing: /admin, /admin/login, or /fe/admin
  const isAdminRoute = routePath.startsWith('/admin') || routePath.startsWith('/fe/admin');

  // When unauthenticated, entering any admin route navigates to /admin/login
  useEffect(() => {
    if (isAdminRoute && !isAuthenticated && routePath !== '/admin/login') {
      window.history.replaceState(null, '', '/admin/login');
      setRoutePath('/admin/login');
    }
  }, [isAdminRoute, isAuthenticated, routePath]);

  // When authenticated, if at /admin/login or /fe/admin, normalize to /admin
  useEffect(() => {
    if (isAdminRoute && isAuthenticated && (routePath === '/admin/login' || routePath.startsWith('/fe/admin'))) {
      window.history.replaceState(null, '', '/admin');
      setRoutePath('/admin');
    }
  }, [isAdminRoute, isAuthenticated, routePath]);

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#1b1c1a] flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-md">
            <AdminLogin
              onSuccess={() => {
                window.history.replaceState(null, '', '/admin');
                setRoutePath('/admin');
              }}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  window.history.pushState(null, '', '/');
                  setRoutePath('/');
                }}
                className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Return to Public Atelier
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminLayout
        onExitToPublicSite={() => {
          window.history.pushState(null, '', '/');
          setRoutePath('/');
        }}
      />
    );
  }

  // Public dining website (Zero admin links or buttons)
  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-body-md flex flex-col selection:bg-[#af101a] selection:text-white">
      {/* Sticky Editorial Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content View Container */}
      <main className="w-full pt-14 sm:pt-20 flex-1">
        {currentView === 'home' && (
          <HomeScreen
            setCurrentView={setCurrentView}
            language={language}
          />
        )}

        {currentView === 'menu' && (
          <MenuScreen
            language={language}
          />
        )}

        {currentView === 'about-us' && (
          <HomeScreen
            setCurrentView={setCurrentView}
            language={language}
          />
        )}
      </main>

      {/* Shared Editorial Footer */}
      <Footer
        setCurrentView={setCurrentView}
      />
    </div>
  );
}
