'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { createConsignorAccount } from '@/app/actions/auth';
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
} from '@/types/database';
import { checkDressAvailability } from './pricing';

interface AppContextType {
  currentUser: User | null;
  isLoading: boolean;
  users: User[];
  customers: Customer[];
  inventory: InventoryItem[];
  rentals: Rental[];
  payouts: ConsignorPayout[];
  globalSettings: GlobalSettings | null;
  
  // Actions
  logout: () => Promise<void>;
  createCustomerAndRental: (
    customerData: Omit<Customer, 'id' | 'created_at'>,
    rentalData: { dress_id: string; start_date: string; end_date: string; amount_due: number; deposit_paid: number }
  ) => Promise<{ success: boolean; error?: string; rental?: Rental }>;

  updateRentalStatus: (rentalId: string, newStatus: RentalStatus) => Promise<void>;
  updateRentalPayment: (rentalId: string, amountPaid: number, depositPaid: number, amountRetained: number) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'created_at'>) => Promise<void>;
  updateInventoryStatus: (itemId: string, status: 'active' | 'archived') => Promise<void>;
  createConsignorUser: (userData: Omit<User, 'id' | 'created_at' | 'role'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  updateGlobalCommissionRate: (newRate: number) => Promise<void>;
  updatePayoutStatus: (payoutId: string, status: PayoutStatus) => Promise<void>;
  triggerLateCheckCron: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payouts, setPayouts] = useState<ConsignorPayout[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);

  const fetchData = async () => {
    try {
      const [
        { data: usersData },
        { data: customersData },
        { data: inventoryData },
        { data: rentalsData },
        { data: payoutsData },
        { data: settingsData },
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('rentals').select('*'),
        supabase.from('consignor_payouts').select('*'),
        supabase.from('global_settings').select('*').eq('id', 1).single(),
      ]);

      if (usersData) setUsers(usersData);
      if (customersData) setCustomers(customersData);
      if (inventoryData) setInventory(inventoryData);
      if (rentalsData) setRentals(rentalsData);
      if (payoutsData) setPayouts(payoutsData);
      if (settingsData) setGlobalSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      // First check for an existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch all data (including newly inserted users rows)
        await fetchData();
        let { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        let profile = userData;
        if (!profile) {
          const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (customerData) {
            profile = {
              id: customerData.id,
              role: 'customer',
              full_name: customerData.full_name,
              email: customerData.email,
              phone_number: customerData.phone_number,
              address: customerData.shipping_address,
              created_at: customerData.created_at,
            };
          }
        }
        
        if (mounted && profile) setCurrentUser(profile as User);
      } else {
        await fetchData();
      }

      if (mounted) setIsLoading(false);
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Re-fetch all data so any newly created public.users rows are included
        await fetchData();
        let { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        let profile = userData;
        if (!profile) {
          const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (customerData) {
            profile = {
              id: customerData.id,
              role: 'customer',
              full_name: customerData.full_name,
              email: customerData.email,
              phone_number: customerData.phone_number,
              address: customerData.shipping_address,
              created_at: customerData.created_at,
            };
          }
        }
        
        if (mounted && profile) setCurrentUser(profile as User);
        else if (mounted) setCurrentUser(null); // auth'd but no profile row yet
      } else {
        if (mounted) {
          setCurrentUser(null);
          await fetchData(); // Refresh data on logout too
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helpers
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

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const createCustomerAndRental: AppContextType['createCustomerAndRental'] = async (customerData, rentalData) => {
    const avail = checkDressAvailability(rentalData.dress_id, rentalData.start_date, rentalData.end_date, rentals);
    if (!avail.isAvailable) {
      return { success: false, error: avail.reason || 'Dress is unavailable for selected dates.' };
    }

    let existingCust = customers.find((c) => c.email.toLowerCase() === customerData.email.toLowerCase());
    let customerId = existingCust?.id;

    if (!existingCust) {
      const { data, error } = await supabase.from('customers').insert([customerData]).select().single();
      if (error) return { success: false, error: error.message };
      customerId = data.id;
    }

    const { data: rentalRes, error: rentalError } = await supabase.from('rentals').insert([{
      ...rentalData,
      customer_id: customerId!,
      status: 'pending',
    }]).select().single();

    if (rentalError) return { success: false, error: rentalError.message };
    
    await fetchData(); // Refresh state
    return { success: true, rental: rentalRes };
  };

  const updateRentalStatus = async (rentalId: string, newStatus: RentalStatus) => {
    const rental = rentals.find((r) => r.id === rentalId);
    if (!rental) return;

    let snapshotRate = rental.snapshot_commission_rate;
    if (newStatus === 'booked' && rental.status !== 'booked') {
      snapshotRate = globalSettings?.global_commission_rate ?? 0.50;
    }

    const { error } = await supabase.from('rentals').update({
      status: newStatus,
      snapshot_commission_rate: snapshotRate,
    }).eq('id', rentalId);
    
    if (!error) await fetchData();
  };

  const updateRentalPayment = async (rentalId: string, amountPaid: number, depositPaid: number, amountRetained: number) => {
    const { error } = await supabase.from('rentals').update({
      amount_paid: amountPaid,
      deposit_paid: depositPaid,
      amount_retained: amountRetained,
    }).eq('id', rentalId);
    
    if (!error) await fetchData();
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('inventory').insert([item]);
    if (!error) await fetchData();
  };

  const updateInventoryStatus = async (itemId: string, status: 'active' | 'archived') => {
    const { error } = await supabase.from('inventory').update({ status }).eq('id', itemId);
    if (!error) await fetchData();
  };

  const createConsignorUser = async (
    userData: Omit<User, 'id' | 'created_at' | 'role'> & { password: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const { password, ...profile } = userData;
    const result = await createConsignorAccount({
      email: profile.email,
      password,
      fullName: profile.full_name,
      phone: profile.phone_number,
      address: profile.address,
    });
    if (result.success) await fetchData();
    return result;
  };

  const updateGlobalCommissionRate = async (newRate: number) => {
    const { error } = await supabase.from('global_settings').update({ global_commission_rate: newRate }).eq('id', 1);
    if (!error) await fetchData();
  };

  const updatePayoutStatus = async (payoutId: string, status: PayoutStatus) => {
    const { error } = await supabase.from('consignor_payouts').update({
      status,
      paid_at: status === 'paid' ? new Date().toISOString() : null,
    }).eq('id', payoutId);
    if (!error) await fetchData();
  };

  const triggerLateCheckCron = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('rentals')
      .update({ status: 'late' })
      .eq('status', 'out')
      .lt('end_date', todayStr);
      
    if (!error) await fetchData();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoading,
        users,
        customers,
        inventory: enrichedInventory,
        rentals: enrichedRentals,
        payouts: enrichedPayouts,
        globalSettings,
        logout,
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
