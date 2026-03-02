-- 1. Insert the new Science Ship into the store_items table
INSERT INTO public.store_items (
    name,
    description,
    price,
    category,
    item_type,
    rarity,
    content,
    technical_meta
) VALUES (
    'NAVE DE PESQUISA BIOSSEGURA V-4',
    'Projetada para a coleta, análise e, crucialmente, a contenção segura de amostras biológicas alienígenas. Sua estética pé no chão esconde a alta sofisticação científica interna.',
    125000,
    'ship',
    'ESPECIALIZADA',
    'epic',
    'Equipada com laboratórios de biossegurança de nível 4 e sistemas de descarte de emergência termonuclear. Uma verdadeira fortaleza laboratorial voadora.',
    '{"stats": {"security": 9, "armaments": 2, "system": 12}}'
);
