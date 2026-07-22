-- 01_schema.sql: Database Schema & Relationships for Tela & Tulle

-- Enable btree_gist extension for PostgreSQL exclusion constraint on uuid & daterange
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. users table (Admins & Consignors)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL CHECK (role IN ('admin', 'consignor')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL,
    social_handle TEXT,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. global_settings table (Single row enforcement)
CREATE TABLE IF NOT EXISTS global_settings (
    id INT PRIMARY KEY CHECK (id = 1) DEFAULT 1,
    global_commission_rate NUMERIC NOT NULL DEFAULT 0.50 CHECK (global_commission_rate >= 0 AND global_commission_rate <= 1),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure single row exists
INSERT INTO global_settings (id, global_commission_rate)
VALUES (1, 0.50)
ON CONFLICT (id) DO NOTHING;

-- 4. inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    description TEXT,
    size TEXT NOT NULL,
    length_inches NUMERIC,
    bust_inches NUMERIC,
    hip_inches NUMERIC,
    waist_inches NUMERIC,
    color TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    image_urls TEXT[] DEFAULT '{}',
    retail_price NUMERIC NOT NULL CHECK (retail_price >= 0),
    base_rental_price NUMERIC NOT NULL CHECK (base_rental_price >= 0),
    extension_rate_daily NUMERIC NOT NULL CHECK (extension_rate_daily >= 0),
    security_deposit NUMERIC NOT NULL CHECK (security_deposit >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dress_id UUID NOT NULL REFERENCES inventory(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date >= start_date),
    amount_due NUMERIC NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC NOT NULL DEFAULT 0.00,
    deposit_paid NUMERIC NOT NULL DEFAULT 0.00,
    amount_retained NUMERIC NOT NULL DEFAULT 0.00 CHECK (amount_retained >= 0),
    snapshot_commission_rate NUMERIC,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'out', 'returned', 'late', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partial Exclusion Constraint: Prevent overlapping active/confirmed rentals for the same dress
ALTER TABLE rentals DROP CONSTRAINT IF EXISTS no_overlapping_confirmed_rentals;
ALTER TABLE rentals
ADD CONSTRAINT no_overlapping_confirmed_rentals
EXCLUDE USING gist (
    dress_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
)
WHERE (status IN ('booked', 'out', 'late'));

-- 6. consignor_payouts table
CREATE TABLE IF NOT EXISTS consignor_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consignor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    payout_month DATE NOT NULL,
    total_due NUMERIC NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger Function: Snapshot global_commission_rate when rental becomes 'booked'
CREATE OR REPLACE FUNCTION snapshot_commission_rate_on_booked()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'booked' AND (OLD IS NULL OR OLD.status IS NULL OR OLD.status != 'booked')) THEN
        SELECT global_commission_rate INTO NEW.snapshot_commission_rate
        FROM global_settings
        WHERE id = 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_snapshot_commission_rate ON rentals;
CREATE TRIGGER trg_snapshot_commission_rate
BEFORE INSERT OR UPDATE ON rentals
FOR EACH ROW
EXECUTE FUNCTION snapshot_commission_rate_on_booked();

-- Automation Cron Function: Update status to 'late' if status = 'out' and current date > end_date
CREATE OR REPLACE FUNCTION update_late_rentals()
RETURNS void AS $$
BEGIN
    UPDATE rentals
    SET status = 'late'
    WHERE status = 'out' AND CURRENT_DATE > end_date;
END;
$$ LANGUAGE plpgsql;
