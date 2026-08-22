export type UserRole = 'ADMIN' | 'TENANT' | 'DEVELOPER';

export type BottomNavTab = 
  | 'DASHBOARD'
  | 'RESIDENTS'
  | 'PAYMENTS'
  | 'ROOMS'
  | 'SERVICES'
  | 'HOME'
  | 'BILLS'
  | 'UTILITIES'
  | 'MAINTENANCE'
  | 'PROFILE'
  | 'DEV_HOME'
  | 'DESIGN_SYSTEM';

export interface Resident {
  id: string;
  name: string;
  email: string;
  room: string;
  status: 'Paid' | 'Overdue' | 'Pending';
  balance: number;
  avatarUrl?: string | null;
  fcmToken?: string | null;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  occupation?: string;
}

export type TenantLeadSource =
  | 'Mamikos'
  | 'Instagram'
  | 'WhatsApp'
  | 'OLX'
  | 'TikTok'
  | 'Google Maps'
  | 'Facebook Marketplace'
  | 'Direct Walk-in'
  | 'Referral'
  | 'Other';

export interface PotentialTenant {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: TenantLeadSource | string;
  sourceDetails?: string;
  targetUnit?: string;
  budget?: number;
  expectedMoveInDate?: string;
  notes?: string;
  status: 'New' | 'Viewing Scheduled' | 'Follow Up' | 'Converted' | 'Cancelled';
  createdAt: string;
}

export interface UserProfileInfo {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string | null;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  room?: string;
  occupation?: string;
  memberSince?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  isIncome: boolean;
  unitId: string;
  residentId: string;
}

export interface UnitOccupancy {
  id: string;
  unitNumber: string;
  type: string;
  price: number;
  isOccupied: boolean;
  currentResidentId?: string | null;
}

export interface MaintenanceRequest {
  id: string;
  unit: string;
  issue: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  isEmergency?: boolean;
  photoUrl?: string;
}

export interface TokenPurchase {
  id: string;
  unit: string;
  date: string;
  tokenNumber: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
}

export interface MeterReading {
  id: string;
  unit: string;
  initialKwh: number;
  finalKwh: number;
  usage: number;
  ratePerKwh: number;
  totalCost: number;
  date: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'alert';
  requestId?: string;
  unit?: string;
  status?: 'Pending' | 'In Progress' | 'Resolved';
  timestamp: string;
  duration?: number;
}

export interface FeatureFlags {
  bypassAuth: boolean;
  verboseLogging: boolean;
  mockDataMode: boolean;
  forceStagingApi: boolean;
}

