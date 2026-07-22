export type UserRole = 'admin' | 'consignor';
export type InventoryStatus = 'active' | 'archived';
export type RentalStatus = 'pending' | 'booked' | 'out' | 'returned' | 'late' | 'cancelled';
export type PayoutStatus = 'unpaid' | 'paid';

export interface User {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  social_handle?: string;
  shipping_address: string;
  created_at: string;
}

export interface GlobalSettings {
  id: number;
  global_commission_rate: number; // e.g. 0.50 for 50%
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  owner_id: string | null; // Nullable for store-owned
  name: string;
  description: string;
  size: string;
  length_inches: number;
  bust_inches: number;
  waist_inches: number;
  hip_inches: number;
  color: string;
  tags: string[];
  image_urls: string[];
  retail_price: number;
  base_rental_price: number;
  extension_rate_daily: number;
  security_deposit: number;
  status: InventoryStatus;
  created_at: string;
  owner?: User | null;
}

export interface Rental {
  id: string;
  dress_id: string;
  customer_id: string;
  start_date: string; // ISO format 'YYYY-MM-DD'
  end_date: string;   // ISO format 'YYYY-MM-DD'
  amount_due: number;
  amount_paid: number;
  deposit_paid: number;
  amount_retained: number; // Deducted for damages/late fees
  snapshot_commission_rate: number | null; // Captured when booked
  status: RentalStatus;
  created_at: string;
  
  // Joined fields for UI convenience
  dress?: InventoryItem;
  customer?: Customer;
}

export interface ConsignorPayout {
  id: string;
  consignor_id: string;
  payout_month: string; // ISO format 'YYYY-MM-01'
  total_due: number;
  status: PayoutStatus;
  paid_at: string | null;
  created_at: string;
  consignor?: User;
}

export interface FilterOptions {
  searchQuery: string;
  tags: string[];
  color: string;
  size: string;
  bustMin?: number;
  bustMax?: number;
  waistMin?: number;
  waistMax?: number;
  hipMin?: number;
  hipMax?: number;
  lengthMin?: number;
  lengthMax?: number;
  startDate?: string;
  endDate?: string;
}
