-- 04_additional_rls.sql: Additional Row Level Security Policies for Tela & Tulle
-- Allow users to view their own customer record by matching email
CREATE POLICY "Users view own customer profile" ON customers
  FOR SELECT USING (
    email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- Allow users to view their own rentals
CREATE POLICY "Users view own rentals" ON rentals
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers
      WHERE email = (SELECT email FROM users WHERE id = auth.uid())
    )
  );
