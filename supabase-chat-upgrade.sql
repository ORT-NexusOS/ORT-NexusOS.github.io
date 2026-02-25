-- ============================================================
--  NEXUS OS — Chat Omega Upgrade
--  Execute ESTE arquivo no SQL Editor do Supabase
--  Settings > SQL Editor > New Query > Cole > Run
-- ============================================================

-- 1. Tabela de salas de chat (geral, DM, grupo)
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'dm', 'group')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Membros de cada sala
CREATE TABLE IF NOT EXISTS chat_room_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (room_id, user_id)
);

-- 3. Adicionar room_id na tabela de mensagens existente
ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE;

-- 4. Tabela de presença (quem está online)
CREATE TABLE IF NOT EXISTS presence (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Criar o canal geral com ID fixo (seed)
INSERT INTO chat_rooms (id, name, type)
VALUES ('00000000-0000-0000-0000-000000000001', 'CANAL OMEGA', 'general')
ON CONFLICT (id) DO NOTHING;

-- 6. Associar mensagens antigas ao canal geral
UPDATE chat_messages
SET room_id = '00000000-0000-0000-0000-000000000001'
WHERE room_id IS NULL;

-- ============================================================
--  RLS (Row Level Security)
-- ============================================================

ALTER TABLE chat_rooms         ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence           ENABLE ROW LEVEL SECURITY;

-- chat_rooms: ver apenas rooms dos quais o usuário é membro (ou general)
DROP POLICY IF EXISTS "ver_rooms_do_usuario" ON chat_rooms;
CREATE POLICY "ver_rooms_do_usuario" ON chat_rooms FOR SELECT
  USING (
    type = 'general'
    OR EXISTS (
      SELECT 1 FROM chat_room_members
      WHERE chat_room_members.room_id = chat_rooms.id
        AND chat_room_members.user_id = auth.uid()
    )
  );

-- chat_rooms: usuários autenticados podem criar rooms
DROP POLICY IF EXISTS "criar_rooms" ON chat_rooms;
CREATE POLICY "criar_rooms" ON chat_rooms FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- chat_room_members: ver membros dos rooms dos quais faz parte
DROP POLICY IF EXISTS "ver_membros" ON chat_room_members;
CREATE POLICY "ver_membros" ON chat_room_members FOR SELECT
  USING (auth.role() = 'authenticated');

-- chat_room_members: pode entrar em rooms
DROP POLICY IF EXISTS "entrar_em_rooms" ON chat_room_members;
CREATE POLICY "entrar_em_rooms" ON chat_room_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- chat_room_members: pode sair de rooms
DROP POLICY IF EXISTS "sair_de_rooms" ON chat_room_members;
CREATE POLICY "sair_de_rooms" ON chat_room_members FOR DELETE
  USING (user_id = auth.uid());

-- chat_messages: ver mensagens apenas dos rooms que participa
DROP POLICY IF EXISTS "autenticados_ler_chat" ON chat_messages;
CREATE POLICY "autenticados_ler_chat" ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms cr
      WHERE cr.id = chat_messages.room_id
        AND (
          cr.type = 'general'
          OR EXISTS (
            SELECT 1 FROM chat_room_members
            WHERE chat_room_members.room_id = cr.id
              AND chat_room_members.user_id = auth.uid()
          )
        )
    )
  );

-- chat_messages: INSERT em rooms que o usuário participa
DROP POLICY IF EXISTS "autenticados_enviar_chat" ON chat_messages;
CREATE POLICY "autenticados_enviar_chat" ON chat_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- chat_messages: admin pode deletar (para limpar canal geral)
DROP POLICY IF EXISTS "admin_deletar_chat" ON chat_messages;
CREATE POLICY "admin_deletar_chat" ON chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- presence: todos autenticados podem ver quem está online
DROP POLICY IF EXISTS "ver_presenca" ON presence;
CREATE POLICY "ver_presenca" ON presence FOR SELECT
  USING (auth.role() = 'authenticated');

-- presence: usuário atualiza apenas sua própria presença
DROP POLICY IF EXISTS "atualizar_presenca" ON presence;
CREATE POLICY "atualizar_presenca" ON presence FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "upsert_presenca" ON presence;
CREATE POLICY "upsert_presenca" ON presence FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================================
--  Realtime
-- ============================================================

-- Adicionar novas tabelas ao realtime (ignorar erro se já existir)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_room_members;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE presence;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
--  Verificação
-- ============================================================
SELECT 'Canal geral criado:' AS info, id, name, type FROM chat_rooms WHERE type = 'general';
SELECT 'Mensagens migradas:' AS info, COUNT(*) FROM chat_messages WHERE room_id IS NOT NULL;
