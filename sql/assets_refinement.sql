-- Refinement: Fuel Multi-use & New Assets ⛽🚀

-- 1. Schema Updates
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS remaining_uses INTEGER;
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS is_for_sale BOOLEAN DEFAULT TRUE;
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS item_type TEXT;
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common';

-- 2. Insert New Ship Variants
INSERT INTO store_items (name, description, price, category, item_type, rarity, icon, technical_meta, is_for_sale)
VALUES 
('Cargueiro Classe C - "Besta de Carga"', 'Focada em transporte massivo. Baixa agilidade, mas blindagem pesada.', 5500, 'ship', 'Cargueiro', 'rare', '🚛', '{"stats": {"security": 3, "armaments": 1, "system": 2}}', true),
('Interceptor Classe A - "Vulto"', 'Nave rápida de reconhecimento. Sistemas eletrônicos de ponta.', 8200, 'ship', 'Interceptor', 'epic', '⚡', '{"stats": {"security": 1, "armaments": 2, "system": 4}}', true),
('Fragata Classe B - "Baluarte"', 'Equilíbrio perfeito entre fogo e defesa.', 12000, 'ship', 'Fragata', 'legendary', '⚔️', '{"stats": {"security": 4, "armaments": 4, "system": 3}}', true);

-- 3. Insert Fuel Items with Multi-use
INSERT INTO store_items (name, description, price, category, item_type, rarity, icon, technical_meta, is_for_sale)
VALUES 
('Célula de Hidrogênio (4 Cargas)', 'Combustível padrão O.R.T. Suficiente para 4 saltos.', 200, 'fuel', 'Combustível', 'common', '🧪', '{"initial_uses": 4, "recovery_amount": 25}', true),
('Núcleo de Isótopo Estável (8 Cargas)', 'Combustível filtrado de alta densidade.', 450, 'fuel', 'Combustível', 'uncommon', '💎', '{"initial_uses": 8, "recovery_amount": 25}', true);
