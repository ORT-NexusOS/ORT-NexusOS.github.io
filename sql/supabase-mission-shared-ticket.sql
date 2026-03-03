-- Add shared_ticket_code to missions to unify travel IDs for multi-agent missions
ALTER TABLE missions ADD COLUMN IF NOT EXISTS shared_ticket_code TEXT;
