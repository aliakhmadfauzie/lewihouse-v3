import React from 'react';
import { useApp } from '../context/AppContext';
import { BottomNavTab } from '../types';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  DoorOpen,
  CreditCard,
  Sparkles,
  Home,
  Receipt,
  UserCircle,
  Settings2
} from 'lucide-react';

interface TabItem {
  id: BottomNavTab;
  titleKey: string;
  defaultTitle: string;
  idTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ('ADMIN' | 'TENANT' | 'DEVELOPER')[];
}

const BOTTOM_TABS: TabItem[] = [
  // 1. Overview / Dashboard
  {
    id: 'DASHBOARD',
    titleKey: 'navOverview',
    defaultTitle: 'Overview',
    idTitle: 'Ringkasan',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'DEVELOPER']
  },

  // 2. Rooms & Residents (Admin)
  {
    id: 'ROOMS',
    titleKey: 'navRooms',
    defaultTitle: 'Rooms',
    idTitle: 'Kamar',
    icon: DoorOpen,
    roles: ['ADMIN']
  },

  // 3. Finance & Payments (Admin & Dev)
  {
    id: 'PAYMENTS',
    titleKey: 'navFinance',
    defaultTitle: 'Finance',
    idTitle: 'Keuangan',
    icon: CreditCard,
    roles: ['ADMIN', 'DEVELOPER']
  },

  // 4. Tenant Tabs
  {
    id: 'HOME',
    titleKey: 'navHome',
    defaultTitle: 'Home',
    idTitle: 'Beranda',
    icon: Home,
    roles: ['TENANT']
  },
  {
    id: 'BILLS',
    titleKey: 'navBills',
    defaultTitle: 'Bills',
    idTitle: 'Tagihan',
    icon: Receipt,
    roles: ['TENANT']
  },

  // 5. Unified Services (All roles)
  {
    id: 'SERVICES',
    titleKey: 'navServices',
    defaultTitle: 'Services',
    idTitle: 'Layanan',
    icon: Sparkles,
    roles: ['ADMIN', 'TENANT', 'DEVELOPER']
  },

  // 6. Tenant Profile Tab (4th tab for tenant)
  {
    id: 'PROFILE',
    titleKey: 'navProfile',
    defaultTitle: 'Profile',
    idTitle: 'Profil',
    icon: UserCircle,
    roles: ['TENANT']
  },

  // 7. Developer System Tab
  {
    id: 'DEV_HOME',
    titleKey: 'navSystem',
    defaultTitle: 'System',
    idTitle: 'Sistem',
    icon: Settings2,
    roles: ['DEVELOPER']
  }
];

export const AppBottomNavigation: React.FC = () => {
  const { currentTab, setCurrentTab, userRole, setIsNewRequestOpen, language } = useApp();

  // Filter exactly for current role - capped to 4 max
  const activeTabs = BOTTOM_TABS.filter(tab => tab.roles.includes(userRole)).slice(0, 4);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBFF] dark:bg-[#121316] border-t border-[#C3C7CF]/30 dark:border-[#44474F]/40 shadow-xl transition-colors"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-around px-2 py-1 safe-area-bottom">
        {activeTabs.map(tab => {
          const isSelected =
            currentTab === tab.id ||
            (tab.id === 'PAYMENTS' && (currentTab === 'RESIDENTS' || currentTab === 'PAYMENTS')) ||
            (tab.id === 'SERVICES' && (currentTab === 'MAINTENANCE' || currentTab === 'UTILITIES' || currentTab === 'SERVICES'));

          const IconComponent = tab.icon;
          const label = language === 'ID' ? tab.idTitle : tab.defaultTitle;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setIsNewRequestOpen(false);
                setCurrentTab(tab.id);
              }}
              className="flex-1 flex flex-col items-center justify-center min-h-[56px] py-1 px-1 rounded-2xl group transition-all cursor-pointer relative"
              aria-selected={isSelected}
            >
              {/* Material 3 Pill Indicator Container */}
              <div className="relative flex items-center justify-center h-8 px-5 rounded-full">
                {isSelected && (
                  <motion.div
                    layoutId="m3-nav-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-[#D1E4FF] dark:bg-[#00497D] rounded-full -z-10 shadow-2xs"
                  />
                )}
                <IconComponent
                  className={`w-5 h-5 transition-all duration-200 ${
                    isSelected
                      ? 'text-[#001D36] dark:text-[#D1E4FF] stroke-[2.5px] scale-105'
                      : 'text-[#43474E] dark:text-[#C4C6D0] group-hover:text-[#1A1C1E] dark:group-hover:text-white stroke-2'
                  }`}
                />
              </div>

              {/* Navigation Label */}
              <span
                className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                  isSelected
                    ? 'font-black text-[#001D36] dark:text-[#D1E4FF]'
                    : 'font-semibold text-[#43474E] dark:text-[#8E9099] group-hover:text-[#1A1C1E]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
