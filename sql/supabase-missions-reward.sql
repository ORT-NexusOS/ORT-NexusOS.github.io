-- Add classification column to missions table
ALTER TABLE missions ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'E';
