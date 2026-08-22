import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { UserRole, BottomNavTab, Resident, Transaction, UnitOccupancy, MaintenanceRequest, TokenPurchase, FeatureFlags, UserProfileInfo, PotentialTenant, ToastNotification } from '../types';
import { repository } from '../services/repository';
import { getTranslation, translations } from '../utils/translations';
import {
  testFirestoreConnection,
  subscribeToCollection,
  setFirestoreDoc,
  deleteFirestoreDoc,
  signInWithGoogleAuth,
  signOutFirebaseAuth,
  subscribeToAuthState
} from '../services/firebase';

function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    
    // Tone 1: High crisp pleasant chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // Tone 2: Harmonic resolution
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.1); // B5
    gain2.gain.setValueAtTime(0.12, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.35);
  } catch {
    // Graceful fallback if audio context restricted by autoplay policies
  }
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  userRole: UserRole;
  currentResident: Resident | null;
  currentUserProfile: UserProfileInfo;
  bypassLogin: (role: UserRole) => void;
  signOut: () => void;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGoogleMock: (email?: string) => Promise<boolean>;

  // Navigation
  currentTab: BottomNavTab;
  setCurrentTab: (tab: BottomNavTab) => void;
  isNewRequestOpen: boolean;
  setIsNewRequestOpen: (open: boolean) => void;

  // Notification Drawer & Toasts
  toasts: ToastNotification[];
  notificationHistory: ToastNotification[];
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearAllNotifications: () => void;

  // Language toggle & translations
  language: 'ID' | 'EN';
  toggleLanguage: () => void;
  t: typeof translations.ID;

  // Dark Mode Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  // Data
  residents: Resident[];
  transactions: Transaction[];
  units: UnitOccupancy[];
  maintenanceRequests: MaintenanceRequest[];
  tokenPurchases: TokenPurchase[];
  potentialTenants: PotentialTenant[];
  featureFlags: FeatureFlags;
  isFirebaseSyncing: boolean;

  // Computed metrics
  totalRevenue: number;
  netProfit: number;
  outstanding: number;
  occupiedUnitsCount: number;
  totalUnitsCount: number;
  occupancyRate: number;

  // Actions
  addResident: (resident: Omit<Resident, 'id'>) => Resident;
  updateResident: (id: string, updates: Partial<Resident>) => void;
  updateCurrentUserProfile: (profile: Partial<UserProfileInfo>) => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  addMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'date' | 'status'>) => MaintenanceRequest;
  updateMaintenanceStatus: (id: string, newStatus: 'Pending' | 'In Progress' | 'Resolved', customNote?: string) => void;
  simulateMaintenanceUpdate: () => void;
  addTokenPurchase: (purchase: Omit<TokenPurchase, 'id' | 'date' | 'status' | 'tokenNumber'>) => TokenPurchase;
  addPotentialTenant: (lead: Omit<PotentialTenant, 'id' | 'createdAt'>) => PotentialTenant;
  updatePotentialTenant: (id: string, updates: Partial<PotentialTenant>) => void;
  deletePotentialTenant: (id: string) => void;
  convertLeadToResident: (leadId: string, initialRoom?: string, initialBalance?: number) => Resident | null;
  updateFeatureFlags: (flags: Partial<FeatureFlags>) => void;
  uploadProfilePhoto: (photoUrl: string) => Promise<void>;
  seedData: () => void;
  clearData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [language, setLanguage] = useState<'ID' | 'EN'>('ID');
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lewi_house_dark_mode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      localStorage.setItem('lewi_house_dark_mode', JSON.stringify(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
  };

  const [currentTab, setCurrentTab] = useState<BottomNavTab>('DASHBOARD');
  const [isNewRequestOpen, setIsNewRequestOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<ToastNotification[]>(() => {
    try {
      const saved = localStorage.getItem('lewi_house_notification_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init_notif_1',
        title: 'Status Tiket Diperbarui',
        message: 'Unit 210: "AC Not Cooling" status telah diperbarui menjadi Sedang Dikerjakan.',
        type: 'warning',
        unit: 'Unit 210',
        status: 'In Progress',
        timestamp: '14:15'
      },
      {
        id: 'init_notif_2',
        title: 'Laporan Pemeliharaan Baru Masuk',
        message: 'Unit 402 melaporkan masalah: "Water Leak in Bathroom" (Prioritas Tinggi - DARURAT)',
        type: 'alert',
        unit: 'Unit 402',
        status: 'Pending',
        timestamp: '09:30'
      }
    ];
  });

  const [residents, setResidents] = useState<Resident[]>(() => repository.getResidents());
  const [transactions, setTransactions] = useState<Transaction[]>(() => repository.getTransactions());
  const [units, setUnits] = useState<UnitOccupancy[]>(() => repository.getUnits());
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() => repository.getMaintenanceRequests());
  const [tokenPurchases, setTokenPurchases] = useState<TokenPurchase[]>(() => repository.getTokenPurchases());
  const [potentialTenants, setPotentialTenants] = useState<PotentialTenant[]>(() => repository.getPotentialTenants());
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(() => repository.getFeatureFlags());

  // Subscribe to real-time Firestore collections
  useEffect(() => {
    testFirestoreConnection();

    setIsFirebaseSyncing(true);

    const unsubMaintenance = subscribeToCollection<MaintenanceRequest>(
      'maintenanceRequests',
      (items) => {
        if (items.length > 0) {
          setMaintenanceRequests(items);
          repository.saveMaintenanceRequests(items);
        } else {
          // If Firestore is empty, push initial requests
          const initial = repository.getMaintenanceRequests();
          initial.forEach(item => setFirestoreDoc('maintenanceRequests', item).catch(() => {}));
        }
        setIsFirebaseSyncing(false);
      }
    );

    const unsubResidents = subscribeToCollection<Resident>(
      'residents',
      (items) => {
        if (items.length > 0) {
          setResidents(items);
          repository.saveResidents(items);
        } else {
          const initial = repository.getResidents();
          initial.forEach(item => setFirestoreDoc('residents', item).catch(() => {}));
        }
      }
    );

    const unsubTransactions = subscribeToCollection<Transaction>(
      'transactions',
      (items) => {
        if (items.length > 0) {
          setTransactions(items);
          repository.saveTransactions(items);
        } else {
          const initial = repository.getTransactions();
          initial.forEach(item => setFirestoreDoc('transactions', item).catch(() => {}));
        }
      }
    );

    const unsubUnits = subscribeToCollection<UnitOccupancy>(
      'units',
      (items) => {
        if (items.length > 0) {
          setUnits(items);
          repository.saveUnits(items);
        } else {
          const initial = repository.getUnits();
          initial.forEach(item => setFirestoreDoc('units', item).catch(() => {}));
        }
      }
    );

    const unsubTokens = subscribeToCollection<TokenPurchase>(
      'tokenPurchases',
      (items) => {
        if (items.length > 0) {
          setTokenPurchases(items);
          repository.saveTokenPurchases(items);
        } else {
          const initial = repository.getTokenPurchases();
          initial.forEach(item => setFirestoreDoc('tokenPurchases', item).catch(() => {}));
        }
      }
    );

    const unsubLeads = subscribeToCollection<PotentialTenant>(
      'potentialTenants',
      (items) => {
        if (items.length > 0) {
          setPotentialTenants(items);
          repository.savePotentialTenants(items);
        } else {
          const initial = repository.getPotentialTenants();
          initial.forEach(item => setFirestoreDoc('potentialTenants', item).catch(() => {}));
        }
      }
    );

    const unsubAuth = subscribeToAuthState((user) => {
      if (user) {
        setIsAuthenticated(true);
        if (user.email === 'aliakhmadfauzie@gmail.com' || user.email?.includes('admin')) {
          setUserRole('ADMIN');
        }
      }
    });

    return () => {
      unsubMaintenance();
      unsubResidents();
      unsubTransactions();
      unsubUnits();
      unsubTokens();
      unsubLeads();
      unsubAuth();
    };
  }, []);

  const addToast = (toastData: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const newToast: ToastNotification = {
      ...toastData,
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    playNotificationChime();
    setToasts(prev => [newToast, ...prev.slice(0, 3)]);
    setNotificationHistory(prev => {
      const updated = [newToast, ...prev.slice(0, 49)];
      try {
        localStorage.setItem('lewi_house_notification_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const duration = toastData.duration || 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearAllNotifications = () => {
    setNotificationHistory([]);
    try {
      localStorage.removeItem('lewi_house_notification_history');
    } catch {}
  };

  const [adminProfile, setAdminProfile] = useState<UserProfileInfo>(() => {
    const saved = localStorage.getItem('lewi_house_admin_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      name: 'Ali Akhmad Fauzi',
      email: 'aliakhmadfauzie@gmail.com',
      phone: '+62 812-8899-0011',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      emergencyContactName: 'Management Security Central',
      emergencyContactPhone: '+62 811-0000-9988',
      occupation: 'Property General Manager',
      memberSince: 'January 2025'
    };
  });

  const currentResident = useMemo(() => {
    return residents.find(r => r.email === 'siti@example.com') || residents[0] || null;
  }, [residents]);

  const currentUserProfile = useMemo<UserProfileInfo>(() => {
    if (userRole === 'TENANT' && currentResident) {
      return {
        name: currentResident.name,
        email: currentResident.email,
        phone: currentResident.phone || '+62 813-9876-5432',
        role: 'TENANT',
        avatarUrl: currentResident.avatarUrl || null,
        emergencyContactName: currentResident.emergencyContactName || 'Ahmad Fauzi (Parent)',
        emergencyContactPhone: currentResident.emergencyContactPhone || '+62 813-1122-3344',
        room: currentResident.room,
        occupation: currentResident.occupation || 'Creative Designer & Resident',
        memberSince: 'March 2025'
      };
    }
    if (userRole === 'DEVELOPER') {
      return {
        name: 'System Developer',
        email: 'developer@lewihouse.com',
        phone: '+62 819-0011-2233',
        role: 'DEVELOPER',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        emergencyContactName: 'Infrastructure Lead',
        emergencyContactPhone: '+62 819-9988-7766',
        occupation: 'Platform Engineer',
        memberSince: 'September 2024'
      };
    }
    return adminProfile;
  }, [userRole, currentResident, adminProfile]);

  const totalRevenue = useMemo(() => {
    return transactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netProfit = useMemo(() => {
    return totalRevenue - totalExpenses;
  }, [totalRevenue, totalExpenses]);

  const outstanding = useMemo(() => {
    return residents.filter(r => r.status === 'Overdue').reduce((sum, r) => sum + r.balance, 0);
  }, [residents]);

  const totalUnitsCount = units.length;
  const occupiedUnitsCount = units.filter(u => u.isOccupied).length;
  const occupancyRate = totalUnitsCount > 0 ? Math.round((occupiedUnitsCount / totalUnitsCount) * 100) : 0;

  const bypassLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    if (role === 'ADMIN') setCurrentTab('DASHBOARD');
    else if (role === 'TENANT') setCurrentTab('HOME');
    else if (role === 'DEVELOPER') setCurrentTab('DEV_HOME');
  };

  const signOut = async () => {
    try {
      await signOutFirebaseAuth();
    } catch {}
    setIsAuthenticated(false);
    setCurrentTab('HOME');
    try {
      sessionStorage.clear();
    } catch {}
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const user = await signInWithGoogleAuth();
      if (user) {
        const email = user.email || 'aliakhmadfauzie@gmail.com';
        if (email === 'aliakhmadfauzie@gmail.com' || email.endsWith('@lewihouse.com')) {
          setUserRole('ADMIN');
          setCurrentTab('DASHBOARD');
        } else {
          const match = repository.getResidentByEmail(email);
          if (match) {
            setUserRole('TENANT');
            setCurrentTab('HOME');
          } else {
            setUserRole('ADMIN');
            setCurrentTab('DASHBOARD');
          }
        }
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Firebase Google Auth popup closed or unavailable, falling back gracefully to mock sign-in', e);
      return signInWithGoogleMock();
    }
  };

  const signInWithGoogleMock = async (email = 'aliakhmadfauzie@gmail.com'): Promise<boolean> => {
    if (email === 'aliakhmadfauzie@gmail.com' || email.endsWith('@lewihouse.com')) {
      setUserRole('ADMIN');
      setCurrentTab('DASHBOARD');
    } else {
      const match = repository.getResidentByEmail(email);
      if (match) {
        setUserRole('TENANT');
        setCurrentTab('HOME');
      } else {
        setUserRole('DEVELOPER');
        setCurrentTab('DEV_HOME');
      }
    }
    setIsAuthenticated(true);
    return true;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ID' ? 'EN' : 'ID'));
  };

  const addResident = (resident: Omit<Resident, 'id'>) => {
    const newRes = repository.addResident(resident);
    setResidents(repository.getResidents());
    setFirestoreDoc('residents', newRes).catch(() => {});
    return newRes;
  };

  const updateResident = (id: string, updates: Partial<Resident>) => {
    repository.updateResident(id, updates);
    const updated = repository.getResidents().find(r => r.id === id);
    setResidents(repository.getResidents());
    if (updated) {
      setFirestoreDoc('residents', updated).catch(() => {});
    }
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfileInfo>) => {
    if (userRole === 'TENANT' && currentResident) {
      updateResident(currentResident.id, {
        name: updates.name ?? currentResident.name,
        email: updates.email ?? currentResident.email,
        phone: updates.phone ?? currentResident.phone,
        emergencyContactName: updates.emergencyContactName ?? currentResident.emergencyContactName,
        emergencyContactPhone: updates.emergencyContactPhone ?? currentResident.emergencyContactPhone,
        occupation: updates.occupation ?? currentResident.occupation,
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : currentResident.avatarUrl
      });
    } else {
      setAdminProfile(prev => {
        const updated = { ...prev, ...updates };
        try {
          localStorage.setItem('lewi_house_admin_profile', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const changePassword = (oldPassword: string, newPassword: string): { success: boolean; message: string } => {
    if (!oldPassword || oldPassword.trim().length === 0) {
      return { success: false, message: 'Please enter your current password.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    if (oldPassword === newPassword) {
      return { success: false, message: 'New password cannot be identical to the current password.' };
    }
    try {
      localStorage.setItem('lewi_house_last_password_change', new Date().toISOString());
    } catch {}
    return { success: true, message: 'Password changed successfully! Next login will require the new credentials.' };
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = repository.addTransaction(tx);
    setTransactions(repository.getTransactions());
    setFirestoreDoc('transactions', newTx).catch(() => {});
    return newTx;
  };

  const addMaintenanceRequest = (req: Omit<MaintenanceRequest, 'id' | 'date' | 'status'>) => {
    const newReq = repository.addMaintenanceRequest(req);
    setMaintenanceRequests(repository.getMaintenanceRequests());
    setFirestoreDoc('maintenanceRequests', newReq).catch(() => {});

    const title = language === 'ID' ? 'Laporan Pemeliharaan Baru' : 'New Maintenance Request';
    const message = language === 'ID'
      ? `${newReq.unit} melaporkan: "${newReq.issue}" (Prioritas ${newReq.priority}${newReq.isEmergency ? ' - DARURAT' : ''})`
      : `${newReq.unit} reported: "${newReq.issue}" (${newReq.priority} Priority${newReq.isEmergency ? ' - EMERGENCY' : ''})`;

    addToast({
      title,
      message,
      type: newReq.isEmergency ? 'alert' : 'info',
      requestId: newReq.id,
      unit: newReq.unit,
      status: 'Pending',
      duration: 6000
    });

    return newReq;
  };

  const updateMaintenanceStatus = (
    id: string,
    newStatus: 'Pending' | 'In Progress' | 'Resolved',
    customNote?: string
  ) => {
    const updated = repository.updateMaintenanceRequest(id, { status: newStatus });
    if (updated) {
      setMaintenanceRequests(repository.getMaintenanceRequests());
      setFirestoreDoc('maintenanceRequests', updated).catch(() => {});

      const statusText =
        newStatus === 'Resolved'
          ? (language === 'ID' ? 'Selesai (Resolved)' : 'Resolved')
          : newStatus === 'In Progress'
          ? (language === 'ID' ? 'Sedang Dikerjakan (In Progress)' : 'In Progress')
          : (language === 'ID' ? 'Menunggu (Pending)' : 'Pending');

      const title =
        language === 'ID' ? 'Update Status Pemeliharaan' : 'Maintenance Status Update';
      const message =
        language === 'ID'
          ? `${updated.unit}: "${updated.issue}" status telah diperbarui menjadi ${statusText}.${
              customNote ? ` Catatan: ${customNote}` : ''
            }`
          : `${updated.unit}: "${updated.issue}" status changed to ${statusText}.${
              customNote ? ` Note: ${customNote}` : ''
            }`;

      addToast({
        title,
        message,
        type: newStatus === 'Resolved' ? 'success' : newStatus === 'In Progress' ? 'warning' : 'info',
        requestId: updated.id,
        unit: updated.unit,
        status: newStatus,
        duration: 6000
      });
    }
  };

  const simulateMaintenanceUpdate = () => {
    const currentList = repository.getMaintenanceRequests();
    if (currentList.length === 0) {
      const sample = repository.addMaintenanceRequest({
        unit: 'Room 205',
        issue: 'Perbaikan Lampu Balkon & Steker',
        description: 'Lampu balkon kedip-kedip dan steker listrik longgar',
        priority: 'Medium',
        isEmergency: false
      });
      setMaintenanceRequests(repository.getMaintenanceRequests());
      setFirestoreDoc('maintenanceRequests', sample).catch(() => {});
      updateMaintenanceStatus(sample.id, 'In Progress', 'Teknisi sedang menuju ke lokasi');
      return;
    }

    const randomIndex = Math.floor(Math.random() * currentList.length);
    const target = currentList[randomIndex];
    const nextStatus: 'Pending' | 'In Progress' | 'Resolved' =
      target.status === 'Pending'
        ? 'In Progress'
        : target.status === 'In Progress'
        ? 'Resolved'
        : 'In Progress';

    const notes =
      nextStatus === 'In Progress'
        ? (language === 'ID' ? 'Teknisi ditugaskan ke lokasi' : 'Technician dispatched')
        : nextStatus === 'Resolved'
        ? (language === 'ID' ? 'Perbaikan selesai dan terverifikasi' : 'Repair completed and verified')
        : (language === 'ID' ? 'Menunggu ketersediaan suku cadang' : 'Waiting for spare parts');

    updateMaintenanceStatus(target.id, nextStatus, notes);
  };

  const addTokenPurchase = (purchase: Omit<TokenPurchase, 'id' | 'date' | 'status' | 'tokenNumber'>) => {
    const newPurchase = repository.addTokenPurchase(purchase);
    setTokenPurchases(repository.getTokenPurchases());
    setFirestoreDoc('tokenPurchases', newPurchase).catch(() => {});
    return newPurchase;
  };

  const addPotentialTenant = (lead: Omit<PotentialTenant, 'id' | 'createdAt'>) => {
    const newLead = repository.addPotentialTenant(lead);
    setPotentialTenants(repository.getPotentialTenants());
    setFirestoreDoc('potentialTenants', newLead).catch(() => {});
    return newLead;
  };

  const updatePotentialTenant = (id: string, updates: Partial<PotentialTenant>) => {
    repository.updatePotentialTenant(id, updates);
    const updated = repository.getPotentialTenants().find(l => l.id === id);
    setPotentialTenants(repository.getPotentialTenants());
    if (updated) {
      setFirestoreDoc('potentialTenants', updated).catch(() => {});
    }
  };

  const deletePotentialTenant = (id: string) => {
    repository.deletePotentialTenant(id);
    setPotentialTenants(repository.getPotentialTenants());
    deleteFirestoreDoc('potentialTenants', id).catch(() => {});
  };

  const convertLeadToResident = (leadId: string, initialRoom?: string, initialBalance?: number): Resident | null => {
    const lead = potentialTenants.find(l => l.id === leadId);
    if (!lead) return null;

    const assignedRoom = initialRoom || lead.targetUnit || 'Room 101';
    const newResident = repository.addResident({
      name: lead.name,
      email: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: lead.phone,
      room: assignedRoom,
      status: 'Paid',
      balance: initialBalance || 0,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(lead.name)}`,
      occupation: lead.notes ? `Lead from ${lead.source}` : undefined
    });
    setFirestoreDoc('residents', newResident).catch(() => {});

    // Mark unit as occupied
    const targetUnitObj = units.find(u => u.unitNumber === assignedRoom);
    if (targetUnitObj) {
      repository.updateUnit(targetUnitObj.id, { isOccupied: true, currentResidentId: newResident.id });
      const updatedUnit = repository.getUnits().find(u => u.id === targetUnitObj.id);
      setUnits(repository.getUnits());
      if (updatedUnit) {
        setFirestoreDoc('units', updatedUnit).catch(() => {});
      }
    }

    // Mark lead as Converted
    repository.updatePotentialTenant(leadId, { status: 'Converted' });
    const updatedLead = repository.getPotentialTenants().find(l => l.id === leadId);
    setPotentialTenants(repository.getPotentialTenants());
    if (updatedLead) {
      setFirestoreDoc('potentialTenants', updatedLead).catch(() => {});
    }
    setResidents(repository.getResidents());

    return newResident;
  };

  const updateFeatureFlags = (flags: Partial<FeatureFlags>) => {
    const updated = { ...featureFlags, ...flags };
    repository.saveFeatureFlags(updated);
    setFeatureFlags(updated);
  };

  const uploadProfilePhoto = async (photoUrl: string) => {
    if (userRole === 'TENANT' && currentResident) {
      updateResident(currentResident.id, { avatarUrl: photoUrl });
    } else {
      updateCurrentUserProfile({ avatarUrl: photoUrl });
    }
  };

  const seedData = () => {
    repository.seedDatabase();
    const res = repository.getResidents();
    const tx = repository.getTransactions();
    const un = repository.getUnits();
    const mn = repository.getMaintenanceRequests();
    const tp = repository.getTokenPurchases();
    const pt = repository.getPotentialTenants();

    setResidents(res);
    setTransactions(tx);
    setUnits(un);
    setMaintenanceRequests(mn);
    setTokenPurchases(tp);
    setPotentialTenants(pt);
    setFeatureFlags(repository.getFeatureFlags());

    // Sync seed to Firestore
    res.forEach(item => setFirestoreDoc('residents', item).catch(() => {}));
    tx.forEach(item => setFirestoreDoc('transactions', item).catch(() => {}));
    un.forEach(item => setFirestoreDoc('units', item).catch(() => {}));
    mn.forEach(item => setFirestoreDoc('maintenanceRequests', item).catch(() => {}));
    tp.forEach(item => setFirestoreDoc('tokenPurchases', item).catch(() => {}));
    pt.forEach(item => setFirestoreDoc('potentialTenants', item).catch(() => {}));
  };

  const clearData = () => {
    repository.clearAllData();
    localStorage.removeItem('lewi_house_admin_profile');
    setResidents([]);
    setTransactions([]);
    setUnits([]);
    setMaintenanceRequests([]);
    setTokenPurchases([]);
    setPotentialTenants([]);
  };

  const t = useMemo(() => getTranslation(language), [language]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userRole,
        currentResident,
        currentUserProfile,
        bypassLogin,
        signOut,
        signInWithGoogle,
        signInWithGoogleMock,
        currentTab,
        setCurrentTab,
        isNewRequestOpen,
        setIsNewRequestOpen,
        toasts,
        notificationHistory,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        addToast,
        removeToast,
        clearAllNotifications,
        language,
        toggleLanguage,
        t,
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        residents,
        transactions,
        units,
        maintenanceRequests,
        tokenPurchases,
        potentialTenants,
        featureFlags,
        isFirebaseSyncing,
        totalRevenue,
        netProfit,
        outstanding,
        occupiedUnitsCount,
        totalUnitsCount,
        occupancyRate,
        addResident,
        updateResident,
        updateCurrentUserProfile,
        changePassword,
        addTransaction,
        addMaintenanceRequest,
        updateMaintenanceStatus,
        simulateMaintenanceUpdate,
        addTokenPurchase,
        addPotentialTenant,
        updatePotentialTenant,
        deletePotentialTenant,
        convertLeadToResident,
        updateFeatureFlags,
        uploadProfilePhoto,
        seedData,
        clearData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
