-- script for commercial flights table

CREATE TABLE IF NOT EXISTS commercial_flights (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_code text UNIQUE NOT NULL,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  origin text,
  destination text,
  total_tickets int DEFAULT 1,
  status text DEFAULT 'scheduled', -- 'scheduled', 'active', 'finished'
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies For commercial_flights
ALTER TABLE commercial_flights ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read commercial flights (for the departures board)
CREATE POLICY "Allow public read of commercial flights"
  ON commercial_flights FOR SELECT
  USING (true);

-- Allow authenticated users to insert commercial flights
CREATE POLICY "Allow authenticated users to insert commercial flights"
  ON commercial_flights FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Allow buyers to update their own scheduled flights
CREATE POLICY "Allow buyers to update their flights"
  ON commercial_flights FOR UPDATE
  USING (auth.uid() = buyer_id OR status = 'active'); 

-- Allow anyone to update to active (when starting voyage)
CREATE POLICY "Allow active voyage trigger"
  ON commercial_flights FOR UPDATE
  USING (true);
