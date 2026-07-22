-- 03_seed.sql: Seed initial demo data for Tela & Tulle

-- 1. Insert Users (Admin & Consignors)
INSERT INTO users (id, role, full_name, email, phone_number, address)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Sophia Logarta (Admin)', 'admin@telaandtulle.com', '+1 (555) 019-2831', '100 Atelier Boulevard, Suite 500, New York, NY'),
  ('11111111-1111-1111-1111-111111111111', 'consignor', 'Elena Vance', 'elena.vance@fashionhouse.com', '+1 (555) 392-0192', '742 Luxury Way, Beverly Hills, CA'),
  ('22222222-2222-2222-2222-222222222222', 'consignor', 'Chloe Bennett', 'chloe.b@coutureselect.com', '+1 (555) 881-2049', '45 Fifth Avenue, New York, NY')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 2. Insert Customers
INSERT INTO customers (id, full_name, email, phone_number, social_handle, shipping_address)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Isabella Reed', 'isabella.r@gmail.com', '+1 (555) 912-3841', '@isabella_reed', '12 Park Ave, New York, NY'),
  ('c0000000-0000-0000-0000-000000000002', 'Sophia Martinez', 'sophia.m@outlook.com', '+1 (555) 482-1920', '@sophiamartinez', '88 Rodeo Drive, Los Angeles, CA'),
  ('c0000000-0000-0000-0000-000000000003', 'Camilla Zhang', 'camilla.z@design.co', '+1 (555) 671-8833', '@camillazhang', '340 Beacon St, Boston, MA')
ON CONFLICT (id) DO NOTHING;

-- 3. Global Settings
INSERT INTO global_settings (id, global_commission_rate)
VALUES (1, 0.50)
ON CONFLICT (id) DO UPDATE SET global_commission_rate = EXCLUDED.global_commission_rate;

-- 4. Inventory Items
INSERT INTO inventory (
  id, owner_id, name, description, size, length_inches, bust_inches, waist_inches, hip_inches, color, tags, image_urls, retail_price, base_rental_price, extension_rate_daily, security_deposit, status
)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'The Midnight Velvet Gown',
    'A breathtaking floor-length dark velvet gown featuring a dramatic thigh slit, subtle off-the-shoulder draping, and hand-stitched silk lining. Perfect for black-tie galas.',
    'M', 60.0, 35.5, 27.5, 38.0,
    'Midnight Blue',
    ARRAY['Gala', 'Black-Tie', 'Velvet', 'Eveningwear'],
    ARRAY[
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
    ],
    2800.00, 240.00, 45.00, 150.00, 'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'Ethereal Tulle Ballgown',
    'Tiered champagne tulle layers with delicate corset boning and crystal bead embroidery around the waistline.',
    'S', 58.0, 33.5, 25.5, 36.0,
    'Champagne',
    ARRAY['Ballgown', 'Tulle', 'Bridal', 'Formal'],
    ARRAY[
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80'
    ],
    3500.00, 310.00, 60.00, 200.00, 'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'Rosé Silk Slip Dress',
    '100% Mulberry bias-cut silk slip dress in a glowing rosé blush shade. Flowing cowled neckline and delicate criss-cross strap back.',
    'S', 54.0, 34.0, 26.0, 37.0,
    'Blush Pink',
    ARRAY['Silk', 'Cocktail', 'Summer Formal', 'Minimalist'],
    ARRAY[
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80'
    ],
    1200.00, 140.00, 30.00, 100.00, 'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    NULL, -- Store owned
    'Emerald Sequin Siren',
    'Showstopping emerald green fully-sequined floor-length gown with long fitted sleeves and open cowl back.',
    'L', 61.0, 38.0, 30.5, 41.0,
    'Emerald Green',
    ARRAY['Sequins', 'Red Carpet', 'Glamour', 'Winter Formal'],
    ARRAY[
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'
    ],
    2200.00, 210.00, 40.00, 120.00, 'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000005',
    '22222222-2222-2222-2222-222222222222',
    'Crimson Satin Gala Dress',
    'Structured corset bodice gown in heavy crimson Italian satin with hidden pockets and an expansive train.',
    'M', 62.0, 36.0, 28.0, 39.0,
    'Crimson Red',
    ARRAY['Satin', 'Gala', 'Couture', 'Statement'],
    ARRAY[
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=1200&q=80'
    ],
    3200.00, 280.00, 55.00, 180.00, 'active'
  ),
  (
    'd0000000-0000-0000-0000-000000000006',
    '11111111-1111-1111-1111-111111111111',
    'Archived Vintage Lace Gown',
    'Intricate French Chantilly lace gown with vintage pearl buttons. Archived for seasonal restoration.',
    'XS', 56.0, 32.0, 24.0, 34.5,
    'Ivory',
    ARRAY['Vintage', 'Lace', 'Archived'],
    ARRAY[
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?auto=format&fit=crop&w=1200&q=80'
    ],
    4000.00, 350.00, 70.00, 250.00, 'archived'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Sample Rentals
INSERT INTO rentals (
  id, dress_id, customer_id, start_date, end_date, amount_due, amount_paid, deposit_paid, amount_retained, snapshot_commission_rate, status
)
VALUES
  (
    'r0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '2026-07-01', '2026-07-05',
    285.00, 285.00, 150.00, 0.00, 0.50, 'returned'
  ),
  (
    'r0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '2026-07-24', '2026-07-28',
    330.00, 330.00, 150.00, 0.00, 0.50, 'booked'
  ),
  (
    'r0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000003',
    '2026-07-15', '2026-07-19',
    170.00, 170.00, 100.00, 25.00, 0.50, 'returned'
  ),
  (
    'r0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    '2026-07-10', '2026-07-16',
    430.00, 430.00, 200.00, 0.00, 0.50, 'late'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Consignor Payouts
INSERT INTO consignor_payouts (
  id, consignor_id, payout_month, total_due, status, paid_at
)
VALUES
  (
    'p0000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    '2026-06-01', 540.00, 'paid', '2026-07-02 10:00:00+00'
  ),
  (
    'p0000000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    '2026-07-01', 370.00, 'unpaid', NULL
  ),
  (
    'p0000000-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    '2026-07-01', 140.00, 'unpaid', NULL
  )
ON CONFLICT (id) DO NOTHING;
