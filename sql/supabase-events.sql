-- Adds pause state and event tracking to deep space travels
ALTER TABLE travel_registrations ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT FALSE;
ALTER TABLE travel_registrations ADD COLUMN IF NOT EXISTS current_event TEXT;
