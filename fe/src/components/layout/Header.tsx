import React from 'react';
import { Language, PageView, HeaderFooterSettings } from '@/types';
import { useHeaderFooter } from '@/hooks/useHeaderFooter';

interface HeaderProps {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  language?: Language;
  setLanguage?: (lang: Language) => void;
  settings?: HeaderFooterSettings | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  settings: propSettings,
}) => {
  const { settings: fetchedSettings } = useHeaderFooter();
  const settings = propSettings || fetchedSettings;

  const logoSrc = settings?.logoUrl || '/images/common/1-removebg-preview.png';
  const phoneNumber = settings?.phoneNumber || '039 376 2717';
  const showHotline = settings?.hotlineVisible !== false;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fbf9f6]/95 backdrop-blur-xl border-b border-[#eae8e5] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-14 sm:h-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center text-left group cursor-pointer shrink-0 z-10 py-1"
        >
          <img
            src={logoSrc}
            alt="봄돈까스 CUTLET SPRING"
            className="h-9 sm:h-12 md:h-14 w-auto object-contain"
          />
        </button>

        {/* Center: Navigation Tabs (Home, Menu) */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 sm:gap-10 md:gap-12 z-10">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-menu-bar text-sm sm:text-base md:text-lg uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'home'
                ? 'text-[#af101a] font-bold border-b-2 border-[#af101a] pb-0.5'
                : 'text-[#5b403d] hover:text-[#1b1c1a]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-menu-bar text-sm sm:text-base md:text-lg uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'menu'
                ? 'text-[#af101a] font-bold border-b-2 border-[#af101a] pb-0.5'
                : 'text-[#5b403d] hover:text-[#1b1c1a]'
            }`}
          >
            Menu
          </button>
        </nav>

        {/* Right Info: Phone Number strictly aligned to the right (No Admin link!) */}
        <div className="flex items-center justify-end shrink-0 z-10">
          {showHotline && (
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              aria-label={`Call ${phoneNumber}`}
              title={phoneNumber}
              className="flex items-center justify-center gap-2 p-1.5 sm:px-3.5 sm:py-2 border border-[#eae8e5] bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#1b1c1a] hover:text-[#af101a] rounded-none transition-colors font-label-md tracking-wider font-bold shadow-2xs"
            >
              <span className="material-symbols-outlined text-[17px] sm:text-[19px] text-[#af101a]">call</span>
              <span className="hidden sm:inline font-price-numeral tracking-tight text-xs sm:text-sm md:text-[14px] font-bold whitespace-nowrap">
                {phoneNumber}
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
