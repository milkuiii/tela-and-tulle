'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Customer,
  GlobalSettings,
  InventoryItem,
  Rental,
  ConsignorPayout,
  UserRole,
  RentalStatus,
  PayoutStatus,
  FilterOptions,
} from '@/types/database';
import { checkDressAvailability } from './pricing';

// Mock Initial Data
const INITIAL_USERS: User[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    role: 'admin',
    full_name: 'Sophia Logarta (Admin)',
    email: 'admin@telaandtulle.com',
    phone_number: '+1 (555) 019-2831',
    address: '100 Atelier Boulevard, Suite 500, New York, NY',
    created_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    role: 'consignor',
    full_name: 'Elena Vance',
    email: 'elena.vance@fashionhouse.com',
    phone_number: '+1 (555) 392-0192',
    address: '742 Luxury Way, Beverly Hills, CA',
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    role: 'consignor',
    full_name: 'Chloe Bennett',
    email: 'chloe.b@coutureselect.com',
    phone_number: '+1 (555) 881-2049',
    address: '45 Fifth Avenue, New York, NY',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'Isabella Reed',
    email: 'isabella.r@gmail.com',
    phone_number: '+1 (555) 912-3841',
    social_handle: '@isabella_reed',
    shipping_address: '12 Park Ave, New York, NY',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    full_name: 'Sophia Martinez',
    email: 'sophia.m@outlook.com',
    phone_number: '+1 (555) 482-1920',
    social_handle: '@sophiamartinez',
    shipping_address: '88 Rodeo Drive, Los Angeles, CA',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: GlobalSettings = {
  id: 1,
  global_commission_rate: 0.50,
  updated_at: new Date().toISOString(),
};

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    owner_id: '11111111-1111-1111-1111-111111111111',
    name: 'The Midnight Velvet Gown',
    description: 'A breathtaking floor-length dark velvet gown featuring a dramatic thigh slit, subtle off-the-shoulder draping, and hand-stitched silk lining.',
    size: 'M',
    length_inches: 60.0,
    bust_inches: 35.5,
    waist_inches: 27.5,
    hip_inches: 38.0,
    color: 'Midnight Blue',
    tags: ['Gala', 'Black-Tie', 'Velvet', 'Eveningwear'],
    image_urls: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
    ],
    retail_price: 2800.00,
    base_rental_price: 240.00,
    extension_rate_daily: 45.00,
    security_deposit: 150.00,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    owner_id: '11111111-1111-1111-1111-111111111111',
    name: 'Ethereal Tulle Ballgown',
    description: 'Tiered champagne tulle layers with delicate corset boning and crystal bead embroidery around the waistline.',
    size: 'S',
    length_inches: 58.0,
    bust_inches: 33.5,
    waist_inches: 25.5,
    hip_inches: 36.0,
    color: 'Champagne',
    tags: ['Ballgown', 'Tulle', 'Bridal', 'Formal'],
    image_urls: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80'
    ],
    retail_price: 3500.00,
    base_rental_price: 310.00,
    extension_rate_daily: 60.00,
    security_deposit: 200.00,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Rosé Silk Slip Dress',
    description: '100% Mulberry bias-cut silk slip dress in a glowing rosé blush shade. Flowing cowled neckline and delicate criss-cross strap back.',
    size: 'S',
    length_inches: 54.0,
    bust_inches: 34.0,
    waist_inches: 26.0,
    hip_inches: 37.0,
    color: 'Blush Pink',
    tags: ['Silk', 'Cocktail', 'Summer Formal', 'Minimalist'],
    image_urls: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80'
    ],
    retail_price: 1200.00,
    base_rental_price: 140.00,
    extension_rate_daily: 30.00,
    security_deposit: 100.00,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    owner_id: null,
    name: 'Emerald Sequin Siren',
    description: 'Showstopping emerald green fully-sequined floor-length gown with long fitted sleeves and open cowl back.',
    size: 'L',
    length_inches: 61.0,
    bust_inches: 38.0,
    waist_inches: 30.5,
    hip_inches: 41.0,
    color: 'Emerald Green',
    tags: ['Sequins', 'Red Carpet', 'Glamour', 'Winter Formal'],
    image_urls: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'
    ],
    retail_price: 2200.00,
    base_rental_price: 210.00,
    extension_rate_daily: 40.00,
    security_deposit: 120.00,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    owner_id: '22222222-2222-2222-2222-222222222222',
    name: 'Crimson Satin Gala Dress',
    description: 'Structured corset bodice gown in heavy crimson Italian satin with hidden pockets and an expansive train.',
    size: 'M',
    length_inches: 62.0,
    bust_inches: 36.0,
    waist_inches: 28.0,
    hip_inches: 39.0,
    color: 'Crimson Red',
    tags: ['Satin', 'Gala', 'Couture', 'Statement'],
    image_urls: [
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=1200&q=80'
    ],
    retail_price: 3200.00,
    base_rental_price: 280.00,
    extension_rate_daily: 55.00,
    security_deposit: 180.00,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    owner_id: '11111111-1111-1111-1111-111111111111',
    name: 'Archived Vintage Lace Gown',
    description: 'Intricate French Chantilly lace gown with vintage pearl buttons. Archived for seasonal restoration.',
    size: 'XS',
    length_inches: 56.0,
    bust_inches: 32.0,
    waist_inches: 24.0,
    hip_inches: 34.5,
    color: 'Ivory',
    tags: ['Vintage', 'Lace', 'Archived'],
    image_urls: [
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?auto=format&fit=crop&w=1200&q=80'
    ],
    retail_price: 4000.00,
    base_rental_price: 350.00,
    extension_rate_daily: 70.00,
    security_deposit: 250.00,
    status: 'archived',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_RENTALS: Rental[] = [
  {
    id: 'r0000000-0000-0000-0000-000000000001',
    dress_id: 'd0000000-0000-0000-0000-000000000001',
    customer_id: 'c0000000-0000-0000-0000-000000000001',
    start_date: '2026-07-01',
    end_date: '2026-07-05',
    amount_due: 435.00,
    amount_paid: 435.00,
    deposit_paid: 150.00,
    amount_retained: 0.00,
    snapshot_commission_rate: 0.50,
    status: 'returned',
    created_at: new Date().toISOString(),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000002',
    dress_id: 'd0000000-0000-0000-0000-000000000001',
    customer_id: 'c0000000-0000-0000-0000-000000000002',
    start_date: '2026-07-24',
    end_date: '2026-07-28',
    amount_due: 480.00,
    amount_paid: 480.00,
    deposit_paid: 150.00,
    amount_retained: 0.00,
    snapshot_commission_rate: 0.50,
    status: 'booked',
    created_at: new Date().toISOString(),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000003',
    dress_id: 'd0000000-0000-0000-0000-000000000003',
    customer_id: 'c0000000-0000-0000-0000-000000000002',
    start_date: '2026-07-15',
    end_date: '2026-07-19',
    amount_due: 270.00,
    amount_paid: 270.00,
    deposit_paid: 100.00,
    amount_retained: 25.00,
    snapshot_commission_rate: 0.50,
    status: 'returned',
    created_at: new Date().toISOString(),
  },
  {
    id: 'r0000000-0000-0000-0000-000000000004',
    dress_id: 'd0000000-0000-0000-0000-000000000002',
    customer_id: 'c0000000-0000-0000-0000-000000000001',
    start_date: '2026-07-10',
    end_date: '2026-07-16',
    amount_due: 630.00,
    amount_paid: 630.00,
    deposit_paid: 200.00,
    amount_retained: 0.00,
    snapshot_commission_rate: 0.50,
    status: 'late',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_PAYOUTS: ConsignorPayout[] = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    consignor_id: '11111111-1111-1111-1111-111111111111',
    payout_month: '2026-06-01',
    total_due: 540.00,
    status: 'paid',
    paid_at: '2026-07-02T10:00:00Z',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    consignor_id: '11111111-1111-1111-1111-111111111111',
    payout_month: '2026-07-01',
    total_due: 370.00,
    status: 'unpaid',
    paid_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p0000000-0000-0000-0000-000000000003',
    consignor_id: '22222222-2222-2222-2222-222222222222',
    payout_month: '2026-07-01',
    total_due: 140.00,
    status: 'unpaid',
    paid_at: null,
    created_at: new Date().toISOString(),
  },
];

interface AppContextType {
  currentUser: User | null; // null for public guest
  setCurrentUser: (user: User | null) => void;
  users: User[];
  customers: Customer[];
  inventory: InventoryItem[];
  rentals: Rental[];
  payouts: ConsignorPayout[];
  globalSettings: GlobalSettings;
  
  // Actions
  createCustomerAndRental: (
    customerData: Omit<Customer, 'id' | 'created_at'>,
    rentalData: { dress_id: string; start_date: string; end_date: string; amount_due: number; deposit_paid: number }
  ) => { success: boolean; error?: string; rental?: Rental };

  updateRentalStatus: (rentalId: string, newStatus: RentalStatus) => void;
  updateRentalPayment: (rentalId: string, amountPaid: number, depositPaid: number, amountRetained: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'created_at'>) => void;
  updateInventoryStatus: (itemId: string, status: 'active' | 'archived') => void;
  createConsignorUser: (userData: Omit<User, 'id' | 'created_at' | 'role'>) => void;
  updateGlobalCommissionRate: (newRate: number) => void;
  updatePayoutStatus: (payoutId: string, status: PayoutStatus) => void;
  triggerLateCheckCron: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Guest by default
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [rentals, setRentals] = useState<Rental[]>(INITIAL_RENTALS);
  const [payouts, setPayouts] = useState<ConsignorPayout[]>(INITIAL_PAYOUTS);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);

  // Helper to join dress & customer onto rental objects
  const enrichedRentals = rentals.map((r) => ({
    ...r,
    dress: inventory.find((d) => d.id === r.dress_id),
    customer: customers.find((c) => c.id === r.customer_id),
  }));

  const enrichedInventory = inventory.map((item) => ({
    ...item,
    owner: users.find((u) => u.id === item.owner_id) ?? null,
  }));

  const enrichedPayouts = payouts.map((p) => ({
    ...p,
    consignor: users.find((u) => u.id === p.consignor_id),
  }));

  // Create Customer & Booking
  const createCustomerAndRental: AppContextType['createCustomerAndRental'] = (customerData, rentalData) => {
    // 1. Check availability
    const avail = checkDressAvailability(rentalData.dress_id, rentalData.start_date, rentalData.end_date, rentals);
    if (!avail.isAvailable) {
      return { success: false, error: avail.reason || 'Dress is unavailable for selected dates.' };
    }

    // 2. Find or create customer
    let existingCust = customers.find((c) => c.email.toLowerCase() === customerData.email.toLowerCase());
    let customerId = existingCust?.id;

    if (!existingCust) {
      const newCust: Customer = {
        id: `c${Date.now()}`,
        ...customerData,
        created_at: new Date().toISOString(),
      };
      setCustomers((prev) => [...prev, newCust]);
      customerId = newCust.id;
    }

    // 3. Create pending rental
    const newRental: Rental = {
      id: `r${Date.now()}`,
      dress_id: rentalData.dress_id,
      customer_id: customerId!,
      start_date: rentalData.start_date,
      end_date: rentalData.end_date,
      amount_due: rentalData.amount_due,
      amount_paid: 0.00, // Pending initial payment
      deposit_paid: rentalData.deposit_paid,
      amount_retained: 0.00,
      snapshot_commission_rate: null, // Will snapshot when booked
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setRentals((prev) => [newRental, ...prev]);
    return { success: true, rental: newRental };
  };

  // Update Rental Status (Handles commission snapshot on 'booked')
  const updateRentalStatus = (rentalId: string, newStatus: RentalStatus) => {
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id !== rentalId) return r;

        let snapshotRate = r.snapshot_commission_rate;
        // Snapshot commission rate on status transition to 'booked'
        if (newStatus === 'booked' && r.status !== 'booked') {
          snapshotRate = globalSettings.global_commission_rate;
        }

        return {
          ...r,
          status: newStatus,
          snapshot_commission_rate: snapshotRate,
        };
      })
    );
  };

  // Update Payment details
  const updateRentalPayment = (
    rentalId: string,
    amountPaid: number,
    depositPaid: number,
    amountRetained: number
  ) => {
    setRentals((prev) =>
      prev.map((r) =>
        r.id === rentalId
          ? {
              ...r,
              amount_paid: amountPaid,
              deposit_paid: depositPaid,
              amount_retained: amountRetained,
            }
          : r
      )
    );
  };

  // Add Inventory item
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'created_at'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `d${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  // Update Inventory status ('active' | 'archived')
  const updateInventoryStatus = (itemId: string, status: 'active' | 'archived') => {
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
  };

  // Create Consignor User
  const createConsignorUser = (userData: Omit<User, 'id' | 'created_at' | 'role'>) => {
    const newUser: User = {
      ...userData,
      id: `u${Date.now()}`,
      role: 'consignor',
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  // Global Commission Rate Update
  const updateGlobalCommissionRate = (newRate: number) => {
    setGlobalSettings({
      id: 1,
      global_commission_rate: newRate,
      updated_at: new Date().toISOString(),
    });
  };

  // Payout Status Update
  const updatePayoutStatus = (payoutId: string, status: PayoutStatus) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status,
              paid_at: status === 'paid' ? new Date().toISOString() : null,
            }
          : p
      )
    );
  };

  // Cron Simulation Trigger: Sets status to 'late' for 'out' rentals past end_date
  const triggerLateCheckCron = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setRentals((prev) =>
      prev.map((r) => {
        if (r.status === 'out' && todayStr > r.end_date) {
          return { ...r, status: 'late' };
        }
        return r;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        customers,
        inventory: enrichedInventory,
        rentals: enrichedRentals,
        payouts: enrichedPayouts,
        globalSettings,
        createCustomerAndRental,
        updateRentalStatus,
        updateRentalPayment,
        addInventoryItem,
        updateInventoryStatus,
        createConsignorUser,
        updateGlobalCommissionRate,
        updatePayoutStatus,
        triggerLateCheckCron,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
