-- ============================================================
--  NEXUS OS — Schema Supabase
--  Cole TODO este arquivo no SQL Editor do Supabase
--  Settings > SQL Editor > New Query > Cole > Run
-- ============================================================

-- Perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('admin','agent','restricted')),
  allowed_modules TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: criar perfil automaticamente ao cadastrar usuário
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

-- Missões
CREATE TABLE IF NOT EXISTS missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa','completa','arquivada')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E-mails de Lore
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  recipient TEXT DEFAULT 'all',
  unread BOOLEAN DEFAULT TRUE,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artes (URLs do Cloudinary)
CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cloudinary_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vídeos das Sessões
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  session_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do Cofre (apenas admin)
CREATE TABLE IF NOT EXISTS vault_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos da Linha do Tempo
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  universe_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails          ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Leitura: usuários autenticados podem ler tudo
CREATE POLICY "autenticados_ler_profiles"        ON profiles        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_ler_missions"        ON missions        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_ler_emails"          ON emails          FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_ler_artworks"        ON artworks        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_ler_videos"          ON videos          FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_ler_vault"           ON vault_items     FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_ler_timeline"        ON timeline_events FOR SELECT USING (auth.role() = 'authenticated');

-- Inserção: usuários autenticados podem inserir
CREATE POLICY "autenticados_inserir_artworks"    ON artworks        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "autenticados_inserir_missions"    ON missions        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "autenticados_inserir_emails"      ON emails          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "autenticados_inserir_videos"      ON videos          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "autenticados_inserir_vault"       ON vault_items     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "autenticados_inserir_timeline"    ON timeline_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Update: usuários autenticados podem atualizar
CREATE POLICY "autenticados_atualizar_missions"  ON missions        FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_atualizar_timeline"  ON timeline_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "autenticados_atualizar_profiles"  ON profiles        FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
--  Fim do schema. Após rodar:
--  1. Vá em Authentication > Users > Add User
--  2. Crie seu usuário admin
--  3. Em Table Editor > profiles, mude o 'role' para 'admin'
-- ============================================================
