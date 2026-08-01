-- 05_fix_rentals_rls.sql
-- Allow customers to view their own rentals directly using their auth.uid()
-- This fixes the issue where INSERT ... RETURNING fails for new customers because they aren't in the users table

CREATE POLICY "Customers view own rentals directly" ON rentals
  FOR SELECT USING (
    customer_id = auth.uid()
  );
