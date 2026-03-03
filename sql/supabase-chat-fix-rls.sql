-- ============================================================
--  NEXUS OS — Correção de Políticas RLS do Chat Omega
--  Execute este arquivo no SQL Editor do Supabase
--  Settings > SQL Editor > New Query > Cole > Run
-- ============================================================

-- PROBLEMA: auth.role() = 'authenticated' foi depreciado no Supabase.
-- CORREÇÃO: Usar auth.uid() IS NOT NULL para verificar usuário autenticado.

-- ── chat_rooms ───────────────────────────────────────────────
DROP POLICY IF EXISTS "criar_rooms" ON chat_rooms;
CREATE POLICY "criar_rooms" ON chat_rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── chat_room_members ────────────────────────────────────────
DROP POLICY IF EXISTS "ver_membros" ON chat_room_members;
CREATE POLICY "ver_membros" ON chat_room_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "entrar_em_rooms" ON chat_room_members;
CREATE POLICY "entrar_em_rooms" ON chat_room_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── chat_messages ────────────────────────────────────────────
DROP POLICY IF EXISTS "autenticados_enviar_chat" ON chat_messages;
CREATE POLICY "autenticados_enviar_chat" ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── Verificação ──────────────────────────────────────────────
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('chat_rooms', 'chat_room_members', 'chat_messages', 'presence')
ORDER BY tablename, policyname;
