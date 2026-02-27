-- ============================================================
--  NEXUS OS — Fix Definitivo de RLS para Chat Omega v2
--  Execute no SQL Editor do Supabase (Settings > SQL Editor)
-- ============================================================

-- ── 1. Remover TODAS as políticas existentes das tabelas de chat ──
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE tablename IN ('chat_rooms', 'chat_room_members', 'chat_messages', 'presence')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ── 2. Garantir que RLS está habilitado ──────────────────────────
ALTER TABLE chat_rooms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence            ENABLE ROW LEVEL SECURITY;

-- ── 3. chat_rooms ────────────────────────────────────────────────

-- Todos os usuários autenticados podem VER rooms (general + seus próprios)
CREATE POLICY "rooms_select" ON chat_rooms FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      type = 'general'
      OR EXISTS (
        SELECT 1 FROM chat_room_members m
        WHERE m.room_id = chat_rooms.id
          AND m.user_id = auth.uid()
      )
    )
  );

-- Todos os usuários autenticados podem CRIAR rooms (DM ou grupo)
CREATE POLICY "rooms_insert" ON chat_rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── 4. chat_room_members ─────────────────────────────────────────

-- Todos os autenticados podem ver membros
CREATE POLICY "members_select" ON chat_room_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Todos os autenticados podem adicionar membros (ao criar DM/grupo)
CREATE POLICY "members_insert" ON chat_room_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── 5. chat_messages ─────────────────────────────────────────────

-- Ver mensagens dos próprios rooms do usuário
CREATE POLICY "messages_select" ON chat_messages FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM chat_rooms cr
        WHERE cr.id = chat_messages.room_id AND cr.type = 'general'
      )
      OR EXISTS (
        SELECT 1 FROM chat_room_members m
        WHERE m.room_id = chat_messages.room_id
          AND m.user_id = auth.uid()
      )
    )
  );

-- Enviar mensagem apenas nos rooms de que é membro
CREATE POLICY "messages_insert" ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND sender_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM chat_rooms cr
        WHERE cr.id = room_id AND cr.type = 'general'
      )
      OR EXISTS (
        SELECT 1 FROM chat_room_members m
        WHERE m.room_id = room_id
          AND m.user_id = auth.uid()
      )
    )
  );

-- Admin pode deletar mensagens
CREATE POLICY "messages_delete" ON chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ── 6. presence ──────────────────────────────────────────────────
CREATE POLICY "presence_select" ON presence FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "presence_upsert" ON presence FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "presence_update" ON presence FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── 7. Verificação final ──────────────────────────────────────────
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('chat_rooms', 'chat_room_members', 'chat_messages', 'presence')
ORDER BY tablename, policyname;
