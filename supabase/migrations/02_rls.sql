-- 02_rls.sql: Row Level Security Policies for Tela & Tulle

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE consignor_payouts ENABLE ROW LEVEL SECURITY;

-- Helper function to check if auth.uid() is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. users Table Policies
CREATE POLICY "Admins full access to users" ON users
  FOR ALL USING (is_admin());

CREATE POLICY "Consignors view own profile" ON users
  FOR SELECT USING (id = auth.uid());

-- 2. customers Table Policies
CREATE POLICY "Public guest insert customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins full access to customers" ON customers
  FOR ALL USING (is_admin());

-- 3. global_settings Table Policies
CREATE POLICY "Public read global settings" ON global_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins update global settings" ON global_settings
  FOR UPDATE USING (is_admin());

-- 4. inventory Table Policies
CREATE POLICY "Public view active non-archived inventory" ON inventory
  FOR SELECT USING (status = 'active' OR is_admin() OR owner_id = auth.uid());

CREATE POLICY "Admins full access to inventory" ON inventory
  FOR ALL USING (is_admin());

-- 5. rentals Table Policies
CREATE POLICY "Public guest insert pending rentals" ON rentals
  FOR INSERT WITH CHECK (status = 'pending');

CREATE POLICY "Admins full access to rentals" ON rentals
  FOR ALL USING (is_admin());

CREATE POLICY "Consignors view rentals for their owned items" ON rentals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM inventory
      WHERE inventory.id = rentals.dress_id
      AND inventory.owner_id = auth.uid()
    )
  );

-- 6. consignor_payouts Table Policies
CREATE POLICY "Admins full access to consignor_payouts" ON consignor_payouts
  FOR ALL USING (is_admin());

CREATE POLICY "Consignors view own payouts" ON consignor_payouts
  FOR SELECT USING (consignor_id = auth.uid());
