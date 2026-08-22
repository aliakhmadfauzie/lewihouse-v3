import React from 'react';
import { useApp } from './context/AppContext';
import { LoginScreen } from './screens/login/LoginScreen';
import { DashboardScreen } from './screens/dashboard/DashboardScreen';
import { ResidentsScreen } from './screens/residents/ResidentsScreen';
import { PaymentsScreen } from './screens/payments/PaymentsScreen';
import { TokensScreen } from './screens/tokens/TokensScreen';
import { MaintenanceScreen } from './screens/maintenance/MaintenanceScreen';
import { TenantDashboardScreen } from './screens/tenant/TenantDashboardScreen';
import { TenantBillsScreen } from './screens/tenant/TenantBillsScreen';
import { DeveloperDashboardScreen } from './screens/developer/DeveloperDashboardScreen';
import { FoundationsDesignSystemScreen } from './screens/design/FoundationsDesignSystemScreen';
import { RoomsScreen } from './screens/rooms/RoomsScreen';
import { UserProfileScreen } from './screens/profile/UserProfileScreen';
import { AppBottomNavigation } from './components/AppBottomNavigation';
import { ToastContainer } from './components/notifications/ToastContainer';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';

export const App: React.FC = () => {
  const {
    isAuthenticated,
    currentTab,
    userRole,
    toasts,
    removeToast,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen
  } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'DASHBOARD':
        return <DashboardScreen />;
      case 'RESIDENTS':
        return <ResidentsScreen />;
      case 'PAYMENTS':
        return <PaymentsScreen />;
      case 'ROOMS':
        return <RoomsScreen />;
      case 'HOME':
        return <TenantDashboardScreen />;
      case 'BILLS':
        return <TenantBillsScreen />;
      case 'UTILITIES':
        return <TokensScreen />;
      case 'MAINTENANCE':
        return <MaintenanceScreen />;
      case 'PROFILE':
        return <UserProfileScreen />;
      case 'DEV_HOME':
        return <DeveloperDashboardScreen />;
      default:
        return userRole === 'ADMIN' ? <DashboardScreen /> : <TenantDashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFF] text-[#1A1C1E] relative">
      {/* Real-time Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      {renderScreen()}
      <AppBottomNavigation />
    </div>
  );
};

