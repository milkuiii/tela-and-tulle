# Project Overview

Build a full-stack dress rental web application using Next.js (TypeScript), Tailwind CSS, Shadcn UI, and Supabase. The platform requires multi-party tracking (Customers, Admins, and Consignors) with automated pricing calculation, dynamic availability logic, historical financial ledger snapshotting, and a secure internal user hierarchy.

# Database Schema & Relationships (Supabase / Postgres)

1. `users` table:
   - `id`: uuid (Primary Key, matches Supabase Auth ID)
   - `role`: text (Options: 'admin' | 'consignor')
   - `full_name`: text (Required)
   - `email`: text (Required, unique)
   - `phone_number`: text (Required)
   - `address`: text (Required, physical address for payouts/dress drop-offs)
   - `created_at`: timestamp

2. `customers` table:
   - `id`: uuid (Primary Key)
   - `full_name`: text (Required)
   - `email`: text (Required, unique)
   - `phone_number`: text (Required)
   - `social_handle`: text (Optional, e.g., Instagram/TikTok)
   - `shipping_address`: text (Required)
   - `created_at`: timestamp

3. `global_settings` table:
   - `id`: integer (Primary Key, single row enforcement)
   - `global_commission_rate`: numeric (Default: 0.50, representing 50%)
   - `updated_at`: timestamp

4. `inventory` table:
   - `id`: uuid (Primary Key)
   - `owner_id`: uuid (Foreign Key pointing to `users.id`, nullable for store-owned items, filled if consigned. `ON DELETE RESTRICT`)
   - `name`: text (Required)
   - `description`: text
   - `size`: text (e.g., 'S', 'M', 'L')
   - `length_inches`, `bust_inches`, `hip_inches`, `waist_inches`: numeric
   - `color`: text
   - `tags`: text[]
   - `image_urls`: text[] (Array of Supabase storage URLs)
   - `retail_price`: numeric
   - `base_rental_price`: numeric (Cost for standard 2-day block)
   - `extension_rate_daily`: numeric (Cost per extra day)
   - `security_deposit`: numeric
   - `status`: text (Default: 'active', options: 'active' | 'archived')

5. `rentals` table:
   - `id`: uuid (Primary Key)
   - `dress_id`: uuid (Foreign Key pointing to `inventory.id`. `ON DELETE RESTRICT`)
   - `customer_id`: uuid (Foreign Key pointing to `customers.id`. `ON DELETE RESTRICT`)
   - `start_date`: date (Required)
   - `end_date`: date (Required)
   - `amount_due`: numeric (Dynamically calculated based on rental length)
   - `amount_paid`: numeric (Manually managed by admin)
   - `deposit_paid`: numeric (Manually managed by admin)
   - `amount_retained`: numeric (Default: 0.00, amount deducted from deposit for damages/late fees)
   - `snapshot_commission_rate`: numeric (Captured from `global_settings` the exact moment status changes to 'booked')
   - `status`: text (Options: 'pending' | 'booked' | 'out' | 'returned' | 'late' | 'cancelled')

6. `consignor_payouts` table:
   - `id`: uuid (Primary Key)
   - `consignor_id`: uuid (Foreign Key pointing to `users.id`. `ON DELETE RESTRICT`)
   - `payout_month`: date (First day of the target month, e.g., '2026-07-01')
   - `total_due`: numeric (Compiled earnings for completed rentals in that month)
   - `status`: text (Options: 'unpaid' | 'paid')
   - `paid_at`: timestamp (Nullable)

---

# Core Architectural & Business Logic

## 1. Concurrency & Overlap Prevention (Conditional Constraint)

- **Partial Exclusion Constraint:** Implement a conditional PostgreSQL database-level exclusion constraint (`EXCLUSION USING gist`) on the `rentals` table.
- **Enforcement Window:** The constraint must **only** trigger and block overlapping records if the rental's status is actively confirmed or ongoing (`WHERE (status IN ('booked', 'out', 'late'))`). Multiple `pending` or `cancelled` requests are allowed to coexist for identical dates without raising database errors.

## 2. Dynamic Calculations & Snapshots

- **Deposit Return Formula:** Generated via a database view or clean backend getter: `deposit_returned = deposit_paid - amount_retained`.
- **Financial Drift Prevention:** When an admin changes a rental's status from `'pending'` to `'booked'`, a trigger must query `global_settings.global_commission_rate` and copy that value directly into `rentals.snapshot_commission_rate`. All downstream payout metrics look strictly at this snapshot field.
- **Archival Protection:** When an item in `inventory` is set to `'archived'`, it must immediately be excluded from all public customer catalogs and public search availability queries. However, it must remain fully visible in historical dashboard records and metrics.

## 3. Automation Cron Job

- **Late Status Trigger:** Implement a daily cron job (via Supabase Edge Functions or `pg_cron`) scheduled to run every day exactly at **8:00 PM local time**.
- **Logic:** For any record in the `rentals` table where `status = 'out'` AND `CURRENT_TIMESTAMP > end_date`, automatically update the `status` to `'late'`.

---

# Views & System Requirements

## 1. Public Customer View

- **Catalog Browsing:** Card grid showing dress pictures (`image_urls[0]`), names, sizes, and pricing. Items flagged as `'archived'` are hidden.
- **Granular Filtering:** Allow filtering by text keywords, tags, color, general sizing, and precise physical measurement ranges.
- **Dynamic Price Calculator:**
  - On the dress modal, a date-range picker lets customers select a rental window.
  - **Availability Rule:** Check the `rentals` table. If the dress has an active confirmed rental (`booked`, `out`, `late`) that overlaps with the chosen dates, flag it as unavailable.
  - **Pricing Formula:** `base_rental_price` + (`extension_rate_daily` \* any extra days past the 2-day baseline) + `security_deposit`.
- **Booking Submission:** Submitting a booking creates/links a `customers` row, generates a `rentals` row with status `'pending'`, and sets `amount_due`.

## 2. Protected Admin Dashboard

- **Consignor Management:** Only Admins can manually create user records with `role: 'consignor'`.
- **Rental Operations:** A centralized operations dashboard tracking all entries. Admins manually mark when a deposit is paid, toggle statuses (`Pending` ➔ `Booked` ➔ `Out` ➔ `Returned`), manage cancellations, input `amount_retained` for damaged pieces, and view color-coded warnings for `'late'` items.
- **Dress Upload:** Form to add dresses, uploading multiple images into `image_urls` arrays, and assigning an `owner_id`.
- **Payout Settlement UI:** A monthly accounting view pulling data from `consignor_payouts`. Admins can review compiled totals for the month and toggle a payout status from `'unpaid'` to `'paid'`.

## 3. Protected Consignor Dashboard

- **Private Isolation:** Consignors log in securely to see _only_ the specific rows in `inventory` where `owner_id` matches their user ID.
- **Performance Metrics:**
  - **Rental History:** Counts how many times their items have successfully completed a lifecycle (`'returned'` or `'out'`).
  - **Expected & Paid Payout Ledger:** Interactive ledger calculated dynamically as: `(base_rental_price + extension_rate_daily) * snapshot_commission_rate` for all completed or ongoing rentals where `amount_paid` matches `amount_due`. Security deposits and unpaid booking amounts are strictly excluded.
  - Displays a clean history of historical payments issued via data fetched from the `consignor_payouts` table.

---

# Security & Row Level Security (RLS) Policies

- **Anonymous/Public Access:** Enable public `INSERT` capabilities on both the `customers` and `rentals` tables so guest checkouts function seamlessly.
- **Data Isolation:** All read and write operations across the dashboard matrices are protected. Only authenticated users with `role: 'admin'` can access global states, compile monthly payouts, or update operational rows. Authenticated users with `role: 'consignor'` are bound to policies preventing them from reading any row in `inventory`, `rentals`, or `consignor_payouts` that does not directly match their `user.id`.
