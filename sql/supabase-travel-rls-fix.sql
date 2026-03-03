-- FIX: Travel System and Ship Visibility for Non-Admins // Cargo System visibility

-- 1. Drops overly restrictive policies
DROP POLICY IF EXISTS "Qualquer um vê naves" ON public.ships;
DROP POLICY IF EXISTS "Dono ou admin vê viagens" ON public.travel_registrations;
DROP POLICY IF EXISTS "Acesso público viagens" ON public.travel_registrations;

-- 2. Allow all authenticated users to see any ship (needed for local ships / passenger boarding)
CREATE POLICY "Acesso público naves" 
ON public.ships FOR SELECT 
USING (auth.role() = 'authenticated');

-- 3. Allow all authenticated users to read travel registrations (crucial for joining lobbys)
CREATE POLICY "Acesso público viagens" 
ON public.travel_registrations FOR SELECT 
USING (auth.role() = 'authenticated');

-- 4. Allows anyone to register their lobby presence via UPDATE
-- Depending on existing RLS, UPDATE might be protected. The UI no longer sends an UPDATE for waiting passengers, 
-- but just in case, here's a policy allowing passengers to check in OR we just rely on REALTIME channel.
-- Due to UI changes applied to apps.js, passengers no longer try to UPDATE the 'status' to waiting.
