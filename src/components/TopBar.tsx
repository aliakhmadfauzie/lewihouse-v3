import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogOut,
  UserCircle,
  Bell,
  Languages,
  ChevronDown,
  Moon,
  Sun,
  Shield,
  Home,
  Code2,
  Check
} from 'lucide-react';
import { UserRole } from '../types';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Lewi House' }) => {
  const {
    userRole,
    bypassLogin,
    signOut,
    language,
    toggleLanguage,
    setCurrentTab,
    currentUserProfile,
    currentTab,
    t,
    notificationHistory,
    setIsNotificationDrawerOpen,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const roleBadge = {
    ADMIN: { label: language === 'ID' ? 'Admin' : 'Admin', bg: 'bg-[#D1E4FF] text-[#001D36] dark:bg-[#00497D] dark:text-[#D1E4FF]' },
    TENANT: { label: language === 'ID' ? 'Penghuni' : 'Tenant', bg: 'bg-[#D4F7DC] text-[#005221] dark:bg-[#005221] dark:text-[#D4F7DC]' },
    DEVELOPER: { label: language === 'ID' ? 'Dev' : 'Dev', bg: 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]' }
  }[userRole];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#FDFBFF] dark:bg-[#121316] border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30 transition-colors">
      {/* Left: Brand + Role Badge */}
      <div className="flex items-center gap-2.5">
        <h1 className="text-lg sm:text-xl font-black text-[#1A1C1E] dark:text-[#E2E2E6] tracking-tight">
          {title}
        </h1>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide ${roleBadge.bg}`}
        >
          {roleBadge.label}
        </span>
      </div>

      {/* Right Controls: Single Language IconButton, Notification Bell, Profile/Role Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Single Language Toggle IconButton */}
        <button
          onClick={toggleLanguage}
          title={language === 'ID' ? 'Ganti Bahasa (English)' : 'Switch Language (Bahasa Indonesia)'}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#43474E] dark:text-[#C4C6D0] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139] active:scale-95 transition-all cursor-pointer relative"
          aria-label="Toggle language"
        >
          <Languages className="w-5 h-5 stroke-[2.2px]" />
          <span className="absolute bottom-1 right-1 text-[8px] font-black uppercase px-1 rounded bg-[#0061A4] text-white leading-tight">
            {language}
          </span>
        </button>

        {/* Notification Bell Button */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          title={t.toastNotificationsTitle}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#43474E] dark:text-[#C4C6D0] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139] active:scale-95 transition-all cursor-pointer"
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5 stroke-[2.2px]" />
          {notificationHistory.length > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#BA1A1A] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
              {notificationHistory.length > 9 ? '9+' : notificationHistory.length}
            </span>
          )}
        </button>

        {/* Profile & Role-Switch Menu Dropdown Anchor */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139] transition-all cursor-pointer border border-[#C3C7CF]/40 dark:border-[#44474F]/50 active:scale-95"
            aria-expanded={isMenuOpen}
            aria-label="Open user menu"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D1E4FF] dark:bg-[#00497D] flex items-center justify-center shrink-0">
              {currentUserProfile.avatarUrl ? (
                <img
                  src={currentUserProfile.avatarUrl}
                  alt={currentUserProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserCircle className="w-5 h-5 text-[#0061A4] dark:text-[#D1E4FF]" />
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#43474E] dark:text-[#C4C6D0] pr-0.5" />
          </button>

          {/* Material 3 Surface Container Menu Popover */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#FDFBFF] dark:bg-[#1E2024] border border-[#C3C7CF]/40 dark:border-[#44474F]/50 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              {/* User Header Info */}
              <div className="p-3 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#D1E4FF] dark:bg-[#00497D] flex items-center justify-center shrink-0">
                    {currentUserProfile.avatarUrl ? (
                      <img
                        src={currentUserProfile.avatarUrl}
                        alt={currentUserProfile.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserCircle className="w-6 h-6 text-[#0061A4]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] truncate">
                      {currentUserProfile.name}
                    </p>
                    <p className="text-[10px] text-[#43474E] dark:text-[#8E9099] truncate">
                      {currentUserProfile.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Switcher Section */}
              <div className="py-2 px-1 border-b border-[#C3C7CF]/20 dark:border-[#44474F]/30">
                <span className="text-[9px] font-black uppercase text-[#43474E] dark:text-[#8E9099] px-2.5 tracking-wider">
                  {language === 'ID' ? 'Ganti Tampilan Peran' : 'Switch Portal Role'}
                </span>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      bypassLogin('ADMIN');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      userRole === 'ADMIN'
                        ? 'bg-[#D1E4FF] text-[#001D36] dark:bg-[#00497D] dark:text-[#D1E4FF]'
                        : 'text-[#1A1C1E] dark:text-[#E2E2E6] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#0061A4] dark:text-[#9ECAFF]" />
                      <span>Admin Overview</span>
                    </div>
                    {userRole === 'ADMIN' && <Check className="w-4 h-4 stroke-[3px]" />}
                  </button>

                  <button
                    onClick={() => {
                      bypassLogin('TENANT');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      userRole === 'TENANT'
                        ? 'bg-[#D4F7DC] text-[#005221] dark:bg-[#005221] dark:text-[#D4F7DC]'
                        : 'text-[#1A1C1E] dark:text-[#E2E2E6] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#008938] dark:text-[#67DC8B]" />
                      <span>Tenant Portal</span>
                    </div>
                    {userRole === 'TENANT' && <Check className="w-4 h-4 stroke-[3px]" />}
                  </button>

                  <button
                    onClick={() => {
                      bypassLogin('DEVELOPER');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      userRole === 'DEVELOPER'
                        ? 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]'
                        : 'text-[#1A1C1E] dark:text-[#E2E2E6] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
                      <span>Developer System</span>
                    </div>
                    {userRole === 'DEVELOPER' && <Check className="w-4 h-4 stroke-[3px]" />}
                  </button>
                </div>
              </div>

              {/* General Actions */}
              <div className="py-1 px-1 space-y-0.5">
                <button
                  onClick={() => {
                    setCurrentTab('PROFILE');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139] transition-all cursor-pointer"
                >
                  <UserCircle className="w-4 h-4 text-[#43474E] dark:text-[#C4C6D0]" />
                  <span>{language === 'ID' ? 'Profil & Pengaturan' : 'Profile & Settings'}</span>
                </button>

                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-[#1A1C1E] dark:text-[#E2E2E6] hover:bg-[#F3F0F5] dark:hover:bg-[#2D3139] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {isDarkMode ? <Sun className="w-4 h-4 text-[#FFB951]" /> : <Moon className="w-4 h-4 text-[#43474E]" />}
                    <span>{isDarkMode ? (language === 'ID' ? 'Mode Terang' : 'Light Mode') : (language === 'ID' ? 'Mode Gelap' : 'Dark Mode')}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#0061A4] dark:text-[#9ECAFF]">
                    {isDarkMode ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#BA1A1A] hover:bg-[#FFDAD6]/40 dark:hover:bg-[#93000A]/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#BA1A1A]" />
                  <span>{t.signOut}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
