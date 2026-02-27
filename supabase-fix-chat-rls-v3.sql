-- ============================================================
--  NEXUS OS — Fix Definitivo RLS Chat v3
--  Cole TUDO isso no SQL Editor do Supabase e clique Run
-- ============================================================

-- Dropar EXPLICITAMENTE cada policy conhecida (por nome)
DROP POLICY IF EXISTS "criar_rooms"            ON chat_rooms;
DROP POLICY IF EXISTS "rooms_insert"           ON chat_rooms;
DROP POLICY IF EXISTS "ver_rooms_do_usuario"   ON chat_rooms;
DROP POLICY IF EXISTS "rooms_select"           ON chat_rooms;

DROP POLICY IF EXISTS "ver_membros"            ON chat_room_members;
DROP POLICY IF EXISTS "members_select"         ON chat_room_members;
DROP POLICY IF EXISTS "entrar_em_rooms"        ON chat_room_members;
DROP POLICY IF EXISTS "members_insert"         ON chat_room_members;
DROP POLICY IF EXISTS "sair_de_rooms"          ON chat_room_members;

DROP POLICY IF EXISTS "autenticados_ler_chat"  ON chat_messages;
DROP POLICY IF EXISTS "messages_select"        ON chat_messages;
DROP POLICY IF EXISTS "autenticados_enviar_chat" ON chat_messages;
DROP POLICY IF EXISTS "messages_insert"        ON chat_messages;
DROP POLICY IF EXISTS "admin_deletar_chat"     ON chat_messages;
DROP POLICY IF EXISTS "messages_delete"        ON chat_messages;

DROP POLICY IF EXISTS "ver_presenca"           ON presence;
DROP POLICY IF EXISTS "presence_select"        ON presence;
DROP POLICY IF EXISTS "atualizar_presenca"     ON presence;
DROP POLICY IF EXISTS "presence_upsert"        ON presence;
DROP POLICY IF EXISTS "upsert_presenca"        ON presence;
DROP POLICY IF EXISTS "presence_update"        ON presence;

-- Garantir RLS habilitado
ALTER TABLE chat_rooms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence            ENABLE ROW LEVEL SECURITY;

-- ── chat_rooms ────────────────────────────────────────────────
CREATE POLICY "rooms_select" ON chat_rooms FOR SELECT
  USING (
    type = 'general'
    OR EXISTS (
      SELECT 1 FROM chat_room_members m
      WHERE m.room_id = chat_rooms.id AND m.user_id = auth.uid()
    )
  );

-- POLÍTICA CRÍTICA: qualquer usuário logado pode criar um room
CREATE POLICY "rooms_insert" ON chat_rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── chat_room_members ─────────────────────────────────────────
CREATE POLICY "members_select" ON chat_room_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "members_insert" ON chat_room_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "members_delete" ON chat_room_members FOR DELETE
  USING (user_id = auth.uid());

-- ── chat_messages ─────────────────────────────────────────────
CREATE POLICY "messages_select" ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms cr
      WHERE cr.id = chat_messages.room_id
        AND (
          cr.type = 'general'
          OR EXISTS (
            SELECT 1 FROM chat_room_members m
            WHERE m.room_id = cr.id AND m.user_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "messages_insert" ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid());

CREATE POLICY "messages_delete" ON chat_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ── presence ──────────────────────────────────────────────────
CREATE POLICY "presence_select" ON presence FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "presence_upsert" ON presence FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "presence_update" ON presence FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Verificação: deve mostrar todas as policies criadas ────────
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('chat_rooms', 'chat_room_members', 'chat_messages', 'presence')
ORDER BY tablename, policyname;
