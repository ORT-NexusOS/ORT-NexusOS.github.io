-- SHIP PASSENGER SYSTEM — Versão Idempotente (Segura para re-executar)

-- 1. Adicionar capacidade de passageiros à tabela de naves (seguro re-executar)
ALTER TABLE public.ships 
ADD COLUMN IF NOT EXISTS passenger_capacity INTEGER DEFAULT 4;

-- 2. Criar tabela de passageiros (seguro re-executar)
CREATE TABLE IF NOT EXISTS public.ship_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID NOT NULL REFERENCES public.ships(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    npc_name TEXT,
    joined_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_passenger_user UNIQUE(user_id)
);

-- 3. Habilitar RLS (seguro re-executar)
ALTER TABLE public.ship_passengers ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas existentes antes de recriar (evita erro 42710)
DROP POLICY IF EXISTS "Passageiros visíveis para todos" ON public.ship_passengers;
DROP POLICY IF EXISTS "Qualquer agente pode embarcar" ON public.ship_passengers;
DROP POLICY IF EXISTS "Passageiro pode desembarcar" ON public.ship_passengers;
DROP POLICY IF EXISTS "Dono da nave pode desembarcar passageiros" ON public.ship_passengers;

-- 5. Recriar Políticas de Acesso
CREATE POLICY "Passageiros visíveis para todos" 
ON public.ship_passengers FOR SELECT 
USING (true);

CREATE POLICY "Qualquer agente pode embarcar" 
ON public.ship_passengers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Passageiro pode desembarcar" 
ON public.ship_passengers FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Dono da nave pode desembarcar passageiros" 
ON public.ship_passengers FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.ships 
        WHERE id = ship_passengers.ship_id 
        AND owner_id = auth.uid()
    )
);

-- 6. Realtime (ignorar se já existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'ship_passengers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ship_passengers;
  END IF;
END $$;
