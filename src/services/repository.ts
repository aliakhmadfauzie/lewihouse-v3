import { Resident, Transaction, UnitOccupancy, MaintenanceRequest, TokenPurchase, FeatureFlags, PotentialTenant } from '../types';

const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res_1',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    room: 'Room 101',
    status: 'Paid',
    balance: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+62 812-3456-7890',
    emergencyContactName: 'Dewi Sartika (Spouse)',
    emergencyContactPhone: '+62 812-9988-7766',
    occupation: 'Software Engineer'
  },
  {
    id: 'res_2',
    name: 'Siti Aminah',
    email: 'siti@example.com',
    room: 'Room 205',
    status: 'Overdue',
    balance: 2500000,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+62 813-9876-5432',
    emergencyContactName: 'Ahmad Fauzi (Parent)',
    emergencyContactPhone: '+62 813-1122-3344',
    occupation: 'Graphic Designer'
  },
  {
    id: 'res_3',
    name: 'Ananda Rizky',
    email: 'ananda@example.com',
    room: 'Room 102',
    status: 'Paid',
    balance: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    phone: '+62 811-2233-4455',
    emergencyContactName: 'Rina Kusuma (Sister)',
    emergencyContactPhone: '+62 811-4455-6677',
    occupation: 'Financial Analyst'
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    title: 'Rent Payment - Unit 101',
    amount: 3500000,
    date: 'Oct 24, 2026',
    isIncome: true,
    unitId: '101',
    residentId: 'res_1'
  },
  {
    id: 'tx2',
    title: 'AC Repair - Unit 205',
    amount: 450000,
    date: 'Oct 23, 2026',
    isIncome: false,
    unitId: '205',
    residentId: 'res_2'
  },
  {
    id: 'tx3',
    title: 'Rent Payment - Unit 102',
    amount: 2500000,
    date: 'Today, 09:45 AM',
    isIncome: true,
    unitId: '102',
    residentId: 'res_3'
  },
  {
    id: 'tx4',
    title: 'Water Pump Servicing',
    amount: 850000,
    date: 'Oct 20, 2026',
    isIncome: false,
    unitId: 'Common',
    residentId: ''
  }
];

const INITIAL_UNITS: UnitOccupancy[] = [
  { id: 'u1', unitNumber: 'Room 101', type: 'Deluxe Suite', price: 3500000, isOccupied: true, currentResidentId: 'res_1' },
  { id: 'u2', unitNumber: 'Room 102', type: 'Standard Room', price: 2500000, isOccupied: true, currentResidentId: 'res_3' },
  { id: 'u3', unitNumber: 'Room 205', type: 'Executive Suite', price: 3200000, isOccupied: true, currentResidentId: 'res_2' },
  { id: 'u4', unitNumber: 'Room 206', type: 'Standard Room', price: 2500000, isOccupied: false, currentResidentId: null },
  { id: 'u5', unitNumber: 'Room 301', type: 'Penthouse Unit', price: 5000000, isOccupied: false, currentResidentId: null }
];

const INITIAL_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'm1',
    unit: 'Unit 402',
    issue: 'Water Leak in Bathroom',
    description: 'Pipe under sink is leaking water onto the tile floor continuously.',
    priority: 'High',
    date: 'Today, 09:30 AM',
    status: 'Pending',
    isEmergency: true
  },
  {
    id: 'm2',
    unit: 'Unit 210',
    issue: 'AC Not Cooling',
    description: 'Air conditioning runs but only blows room temperature air.',
    priority: 'Medium',
    date: 'Yesterday, 14:15',
    status: 'In Progress',
    isEmergency: false
  },
  {
    id: 'm3',
    unit: 'Unit 105',
    issue: 'Loose Cabinet Door',
    description: 'Hinge on upper kitchen cabinet came loose.',
    priority: 'Low',
    date: 'Oct 24, 08:00 AM',
    status: 'Pending',
    isEmergency: false
  }
];

const INITIAL_TOKEN_PURCHASES: TokenPurchase[] = [
  { id: 'tp1', unit: 'Unit 101', date: 'Oct 24, 2026', tokenNumber: '4829-1940-2049-5832', amount: 100000, status: 'Success' },
  { id: 'tp2', unit: 'Unit 102', date: 'Oct 22, 2026', tokenNumber: '9182-3849-1029-4729', amount: 200000, status: 'Success' },
  { id: 'tp3', unit: 'Unit 205', date: 'Oct 20, 2026', tokenNumber: '5739-1029-4820-1948', amount: 150000, status: 'Success' }
];

const INITIAL_POTENTIAL_TENANTS: PotentialTenant[] = [
  {
    id: 'lead_1',
    name: 'Dimas Prasetyo',
    phone: '+62 812-7788-9900',
    email: 'dimas.prasetyo@gmail.com',
    source: 'Mamikos',
    sourceDetails: 'Mamikos Listing - Deluxe Unit Inquiry',
    targetUnit: 'Room 206',
    budget: 2500000,
    expectedMoveInDate: '2026-09-01',
    notes: 'Interested in 6-month upfront payment. Inquired about WiFi speed and parking space.',
    status: 'Viewing Scheduled',
    createdAt: 'Oct 24, 2026'
  },
  {
    id: 'lead_2',
    name: 'Jessica Tan',
    phone: '+62 819-3344-5566',
    email: 'jessica.tan@outlook.com',
    source: 'Instagram',
    sourceDetails: 'IG Story DM @lewihouse',
    targetUnit: 'Room 301',
    budget: 5000000,
    expectedMoveInDate: '2026-09-15',
    notes: 'Asking for Penthouse unit photos and pet policy.',
    status: 'New',
    createdAt: 'Oct 25, 2026'
  },
  {
    id: 'lead_3',
    name: 'Reza Firmansyah',
    phone: '+62 878-1122-3344',
    source: 'WhatsApp',
    sourceDetails: 'Direct WA from Google Maps listing',
    targetUnit: 'Room 206',
    budget: 2500000,
    expectedMoveInDate: '2026-09-05',
    notes: 'Needs room with balcony and private bathroom.',
    status: 'Follow Up',
    createdAt: 'Oct 23, 2026'
  },
  {
    id: 'lead_4',
    name: 'Aulia Rahma',
    phone: '+62 856-4455-6677',
    source: 'OLX',
    sourceDetails: 'OLX Kos Jakarta Selatan',
    targetUnit: 'Room 101',
    budget: 3500000,
    expectedMoveInDate: '2026-10-01',
    notes: 'Working nearby in SCBD, looking for quiet workspace environment.',
    status: 'New',
    createdAt: 'Oct 25, 2026'
  }
];

const INITIAL_FLAGS: FeatureFlags = {
  bypassAuth: true,
  verboseLogging: false,
  mockDataMode: true,
  forceStagingApi: false
};

const STORAGE_KEYS = {
  RESIDENTS: 'lewi_house_residents',
  TRANSACTIONS: 'lewi_house_transactions',
  UNITS: 'lewi_house_units',
  MAINTENANCE: 'lewi_house_maintenance',
  TOKENS: 'lewi_house_tokens',
  POTENTIAL_TENANTS: 'lewi_house_potential_tenants',
  FLAGS: 'lewi_house_flags'
};

export class LewiHouseRepository {
  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  // Residents
  getResidents(): Resident[] {
    return this.load<Resident[]>(STORAGE_KEYS.RESIDENTS, INITIAL_RESIDENTS);
  }

  saveResidents(residents: Resident[]): void {
    this.save(STORAGE_KEYS.RESIDENTS, residents);
  }

  getResidentByEmail(email: string): Resident | undefined {
    const residents = this.getResidents();
    return residents.find(r => r.email.toLowerCase() === email.toLowerCase());
  }

  addResident(resident: Omit<Resident, 'id'>): Resident {
    const residents = this.getResidents();
    const newResident: Resident = {
      ...resident,
      id: `res_${Date.now()}`
    };
    this.saveResidents([newResident, ...residents]);
    return newResident;
  }

  updateResident(id: string, updates: Partial<Resident>): void {
    const residents = this.getResidents().map(r => r.id === id ? { ...r, ...updates } : r);
    this.saveResidents(residents);
  }

  // Transactions
  getTransactions(): Transaction[] {
    return this.load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  saveTransactions(transactions: Transaction[]): void {
    this.save(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  getTenantTransactions(residentId: string): Transaction[] {
    return this.getTransactions().filter(t => t.residentId === residentId);
  }

  addTransaction(tx: Omit<Transaction, 'id'>): Transaction {
    const transactions = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`
    };
    this.saveTransactions([newTx, ...transactions]);
    return newTx;
  }

  // Units
  getUnits(): UnitOccupancy[] {
    return this.load<UnitOccupancy[]>(STORAGE_KEYS.UNITS, INITIAL_UNITS);
  }

  saveUnits(units: UnitOccupancy[]): void {
    this.save(STORAGE_KEYS.UNITS, units);
  }

  updateUnit(id: string, updates: Partial<UnitOccupancy>): void {
    const units = this.getUnits().map(u => u.id === id ? { ...u, ...updates } : u);
    this.saveUnits(units);
  }

  // Maintenance
  getMaintenanceRequests(): MaintenanceRequest[] {
    return this.load<MaintenanceRequest[]>(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
  }

  saveMaintenanceRequests(requests: MaintenanceRequest[]): void {
    this.save(STORAGE_KEYS.MAINTENANCE, requests);
  }

  addMaintenanceRequest(req: Omit<MaintenanceRequest, 'id' | 'date' | 'status'>): MaintenanceRequest {
    const requests = this.getMaintenanceRequests();
    const newReq: MaintenanceRequest = {
      ...req,
      id: `m_${Date.now()}`,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending'
    };
    this.saveMaintenanceRequests([newReq, ...requests]);
    return newReq;
  }

  updateMaintenanceRequest(id: string, updates: Partial<MaintenanceRequest>): MaintenanceRequest | null {
    let updatedItem: MaintenanceRequest | null = null;
    const requests = this.getMaintenanceRequests().map(req => {
      if (req.id === id) {
        updatedItem = { ...req, ...updates };
        return updatedItem;
      }
      return req;
    });
    if (updatedItem) {
      this.saveMaintenanceRequests(requests);
    }
    return updatedItem;
  }

  // Token purchases
  getTokenPurchases(): TokenPurchase[] {
    return this.load<TokenPurchase[]>(STORAGE_KEYS.TOKENS, INITIAL_TOKEN_PURCHASES);
  }

  saveTokenPurchases(tokens: TokenPurchase[]): void {
    this.save(STORAGE_KEYS.TOKENS, tokens);
  }

  addTokenPurchase(purchase: Omit<TokenPurchase, 'id' | 'date' | 'status' | 'tokenNumber'>): TokenPurchase {
    const tokens = this.getTokenPurchases();
    const randomToken = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join('-');
    const newPurchase: TokenPurchase = {
      ...purchase,
      id: `tp_${Date.now()}`,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokenNumber: randomToken,
      status: 'Success'
    };
    this.saveTokenPurchases([newPurchase, ...tokens]);
    return newPurchase;
  }

  // Potential Tenants (Leads)
  getPotentialTenants(): PotentialTenant[] {
    return this.load<PotentialTenant[]>(STORAGE_KEYS.POTENTIAL_TENANTS, INITIAL_POTENTIAL_TENANTS);
  }

  savePotentialTenants(leads: PotentialTenant[]): void {
    this.save(STORAGE_KEYS.POTENTIAL_TENANTS, leads);
  }

  addPotentialTenant(lead: Omit<PotentialTenant, 'id' | 'createdAt'>): PotentialTenant {
    const leads = this.getPotentialTenants();
    const newLead: PotentialTenant = {
      ...lead,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    this.savePotentialTenants([newLead, ...leads]);
    return newLead;
  }

  updatePotentialTenant(id: string, updates: Partial<PotentialTenant>): void {
    const leads = this.getPotentialTenants().map(l => l.id === id ? { ...l, ...updates } : l);
    this.savePotentialTenants(leads);
  }

  deletePotentialTenant(id: string): void {
    const leads = this.getPotentialTenants().filter(l => l.id !== id);
    this.savePotentialTenants(leads);
  }

  // Feature Flags
  getFeatureFlags(): FeatureFlags {
    return this.load<FeatureFlags>(STORAGE_KEYS.FLAGS, INITIAL_FLAGS);
  }

  saveFeatureFlags(flags: FeatureFlags): void {
    this.save(STORAGE_KEYS.FLAGS, flags);
  }

  // Reset / Seed
  seedDatabase(): void {
    this.save(STORAGE_KEYS.RESIDENTS, INITIAL_RESIDENTS);
    this.save(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    this.save(STORAGE_KEYS.UNITS, INITIAL_UNITS);
    this.save(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
    this.save(STORAGE_KEYS.TOKENS, INITIAL_TOKEN_PURCHASES);
    this.save(STORAGE_KEYS.POTENTIAL_TENANTS, INITIAL_POTENTIAL_TENANTS);
    this.save(STORAGE_KEYS.FLAGS, INITIAL_FLAGS);
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.RESIDENTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.POTENTIAL_TENANTS);
    localStorage.removeItem(STORAGE_KEYS.FLAGS);
  }
}

export const repository = new LewiHouseRepository();
