-- Create guestbook_addresses table for postcard requests
CREATE TABLE IF NOT EXISTS guestbook_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guestbook_entry_id uuid REFERENCES guestbook(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE guestbook_addresses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Addresses are viewable by admin" ON guestbook_addresses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert address" ON guestbook_addresses FOR INSERT TO public WITH CHECK (true);
