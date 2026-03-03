-- ============================================================
--  NEXUS OS — SCHEMA COMPLETO (FINAL & EXPANDIDO)
--  Cole TODO este arquivo no SQL Editor do Supabase e rode (Run)
-- ============================================================

-- 1. EXTENSÕES (Se necessário)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA DE PERFIS (PROFILES)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('admin','agent','restricted')),
  allowed_modules TEXT[],
  
  -- Atributos de RPG
  hp_current INTEGER DEFAULT 20,
  hp_max INTEGER DEFAULT 20,
  sp_current INTEGER DEFAULT 10,
  sp_max INTEGER DEFAULT 10,
  sanity_current INTEGER DEFAULT 5,
  sanity_max INTEGER DEFAULT 5,
  mental_exposure INTEGER DEFAULT 0,
  
  str INTEGER DEFAULT 10,
  dex INTEGER DEFAULT 10,
  con INTEGER DEFAULT 10,
  int INTEGER DEFAULT 10,
  wis INTEGER DEFAULT 10,
  spi INTEGER DEFAULT 10,
  rd INTEGER DEFAULT 0, -- Redução de Dano
  
  level INTEGER DEFAULT 1,
  race TEXT DEFAULT 'Humano',
  function_class TEXT DEFAULT 'Recruta',
  
  credits INTEGER DEFAULT 0,
  avatar_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MISSÕES
CREATE TABLE IF NOT EXISTS missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa','completa','arquivada')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. E-MAILS / COMUNICAÇÕES
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id),
  subject TEXT NOT NULL,
  body TEXT,
  recipient TEXT DEFAULT 'all',
  recipient_id TEXT, -- Pode ser UUID ou 'all'
  unread BOOLEAN DEFAULT TRUE,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ARTES (GALERIA)
CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cloudinary_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LOJA (STORE ITEMS)
CREATE TABLE IF NOT EXISTS store_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'weapon', 'armor', 'consumable', 'document', etc.
  rarity TEXT DEFAULT 'common',
  price INTEGER DEFAULT 0,
  is_loot BOOLEAN DEFAULT FALSE,
  content TEXT, -- Para documentos/lore
  
  -- Novos campos de detalhamento técnico
  item_type TEXT,   -- Ex: 'Espada de Energia', 'Kit Médico'
  damage_dice TEXT, -- Ex: '1d8 + 2'
  technical_meta JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INVENTÁRIO
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES store_items(id) ON DELETE CASCADE,
  is_equipped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CANAIS DE CHAT
CREATE TABLE IF NOT EXISTS chat_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'public' CHECK (type IN ('public','private','group')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MENSAGENS DE CHAT
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar canal padrão Omega se não existir
INSERT INTO chat_channels (name, type) 
SELECT 'Canal Omega', 'public'
WHERE NOT EXISTS (SELECT 1 FROM chat_channels WHERE name = 'Canal Omega');

-- 10. VÍDEOS, COFRE E LINHA DO TEMPO
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  session_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vault_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  universe_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTAS (NEW)
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails          ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory       ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channels   ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes           ENABLE ROW LEVEL SECURITY;

-- 11. POLÍTICAS DE SELECT (LEITURA)
CREATE POLICY "Leitura pública para autenticados" ON profiles        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON missions        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON emails          FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON artworks        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON store_items     FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON inventory       FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON chat_channels   FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON chat_messages   FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON videos          FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON vault_items     FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura pública para autenticados" ON timeline_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Donos veem próprias notas"        ON notes          FOR SELECT USING (auth.uid() = user_id);

-- 12. POLÍTICAS DE INSERT
CREATE POLICY "Usuários podem inserir" ON artworks    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários podem inserir" ON chat_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários podem inserir" ON emails      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Admin e específicos... (simplificado para o plano)
CREATE POLICY "Qualquer autenticado insere" ON inventory FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários inserem próprias notas" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 13. POLÍTICAS DE UPDATE/DELETE (CONTROLE DE DONO)
CREATE POLICY "Donos podem atualizar suas artes" ON artworks FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Donos podem deletar suas artes"    ON artworks FOR DELETE USING (auth.uid() = uploaded_by);

CREATE POLICY "Usuários atualizam próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Donos atualizam próprias notas" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Donos deletam próprias notas"    ON notes FOR DELETE USING (auth.uid() = user_id);

-- 14. HABILITAR REALTIME (CRÍTICO PARA CHAT E EMAILS)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table emails;
alter publication supabase_realtime add table store_items;
alter publication supabase_realtime add table vault_items;

-- 15. TRIGGER DE NOVOS USUÁRIOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Agente'),
    'agent'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
