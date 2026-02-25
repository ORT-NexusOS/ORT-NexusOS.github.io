-- ============================================================
--  NEXUS OS — UPGRADE DE INVENTÁRIO (SISTEMA DE SLOTS & USO)
--  Rode este script no SQL Editor do Supabase se você já tinha
--  uma versão anterior do banco de dados instalada.
-- ============================================================

-- 1. GARANTIR COLUNAS DE RPG NA TABELA PROFILES E INVENTÁRIO
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rd INTEGER DEFAULT 0;

ALTER TABLE public.inventory
ADD COLUMN IF NOT EXISTS is_equipped BOOLEAN DEFAULT FALSE;

-- 1.1 EXPANDIR MISSÕES PARA SUPORTAR LOOT & RECOMPENSAS
ALTER TABLE public.missions
ADD COLUMN IF NOT EXISTS briefing TEXT,
ADD COLUMN IF NOT EXISTS reward INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS loot_item_id UUID REFERENCES public.store_items(id);

-- 2. EXPANDIR TABELA DE ITENS (STORE_ITEMS)
ALTER TABLE public.store_items
ADD COLUMN IF NOT EXISTS item_type TEXT,
ADD COLUMN IF NOT EXISTS damage_dice TEXT,
ADD COLUMN IF NOT EXISTS technical_meta JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_for_sale BOOLEAN DEFAULT TRUE;

-- 3. GARANTIR QUE POLÍTICAS DE INVENTÁRIO PERMITAM GESTÃO PELO USUÁRIO
-- Ativar RLS se não estiver
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Política para Equipar (Update)
DROP POLICY IF EXISTS "Usuários atualizam próprio inventário" ON public.inventory;
CREATE POLICY "Usuários atualizam próprio inventário" 
ON public.inventory FOR UPDATE 
USING (auth.uid() = user_id);

-- Política para Descartar/Usar (Delete)
DROP POLICY IF EXISTS "Usuários deletam do próprio inventário" ON public.inventory;
CREATE POLICY "Usuários deletam do próprio inventário" 
ON public.inventory FOR DELETE 
USING (auth.uid() = user_id);

-- 4. ITENS DE EXEMPLO (OPCIONAL - PARA TESTAR O NOVO SISTEMA)T
-- Nota: O campo category define onde o item aparece no inventário.
-- O campo content ou description deve conter "RD X" para armaduras.

INSERT INTO public.store_items (name, description, category, rarity, price, item_type, damage_dice, technical_meta)
VALUES 
('Medkit O.R.T.', 'Kit de reparo biológico imediato.', 'consumable', 'common', 50, 'Kit Médico', '1d10+5', '{"recovery_type": "hp"}'::jsonb),
('Injeção de Adrenalina', 'Melhora o foco e recupera o espírito.', 'consumable', 'uncommon', 120, 'Estimulante', '2d6+2', '{"recovery_type": "sp"}'::jsonb),
('Colete de Kevlar', 'Proteção padrão contra impactos. Oferece RD 2.', 'armor', 'common', 500, 'Colete Balístico', NULL, '{"rd": 2}'::jsonb),
('Pistola Parabellum', 'Arma de pequeno porte, confiável e rápida.', 'weapon', 'common', 300, 'Arma de Pequeno Porte', '1d8', '{}'::jsonb),
('Rifle de Assalto HK', 'Armamento de médio porte para combate urbano.', 'weapon', 'uncommon', 850, 'Arma de Médio Porte', '2d8', '{}'::jsonb),
('Canhão de Plasma', 'Armamento pesado de grande porte.', 'weapon', 'rare', 2000, 'Arma de Grande Porte', '3d10', '{}'::jsonb),
('Faca de Combate', 'Lâmina de monocarbono para combates próximos.', 'weapon', 'common', 100, 'Arma Branca', '1d6', '{}'::jsonb)
ON CONFLICT DO NOTHING;

-- Atualizar descrições para garantir que o regex de RD funcione no código legado
UPDATE public.store_items SET description = 'Proteção padrão. Oferece RD 2.' WHERE name = 'Colete de Kevlar';
