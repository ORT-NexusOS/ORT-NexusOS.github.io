-- SHIP HANGAR SYSTEM

-- 1. Add active_ship_id and unlocked_hangar_slots to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS active_ship_id UUID REFERENCES public.ships(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS unlocked_hangar_slots INTEGER DEFAULT 1;

-- 2. Ensure existing ships have an owner and link the first ship to active_ship_id
-- We do this through an anonymous code block to set active_ship_id for users who already have a ship
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT DISTINCT ON (owner_id) owner_id, id as first_ship_id 
        FROM public.ships 
        WHERE owner_id IS NOT NULL 
        ORDER BY owner_id, created_at ASC 
    LOOP
        UPDATE public.profiles 
        SET active_ship_id = rec.first_ship_id 
        WHERE id = rec.owner_id AND active_ship_id IS NULL;
    END LOOP;
END $$;
