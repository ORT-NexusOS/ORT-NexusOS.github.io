-- Add ticket_price to commercial flights
ALTER TABLE commercial_flights 
ADD COLUMN IF NOT EXISTS ticket_price int DEFAULT 200;
