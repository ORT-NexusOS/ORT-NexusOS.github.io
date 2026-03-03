-- ============================================================
--  NEXUS OS — Expansão Chat Omega v2: Ícones e Exclusão
-- ============================================================

-- 1. Adicionar coluna de ícone na tabela chat_rooms
ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS icon TEXT;

-- 2. Atualizar a RPC para aceitar ícone
CREATE OR REPLACE FUNCTION create_chat_room(
  p_name TEXT,
  p_type TEXT,
  p_icon TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'ACESSO NEGADO: usuário não autenticado';
  END IF;

  IF p_type NOT IN ('dm', 'group') THEN
    RAISE EXCEPTION 'Tipo inválido: %', p_type;
  END IF;

  INSERT INTO chat_rooms (name, type, icon, created_by)
  VALUES (p_name, p_type, p_icon, v_user_id)
  RETURNING id INTO v_room_id;

  RETURN v_room_id;
END;
$$;

-- 3. Políticas de Exclusão (Delete)
-- Proprietário e Admin podem deletar rooms
DROP POLICY IF EXISTS "rooms_delete" ON chat_rooms;
CREATE POLICY "rooms_delete" ON chat_rooms FOR DELETE
  USING (
    auth.uid() = created_by 
    OR EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Garantir que mensagens possam ser deletadas pelo dono da sala (Clear Chat)
DROP POLICY IF EXISTS "messages_delete_owner" ON chat_messages;
CREATE POLICY "messages_delete_owner" ON chat_messages FOR DELETE
  USING (
    sender_id = auth.uid() -- Suas próprias mensagens
    OR auth.uid() IN (     -- Se for admin ou o criador da sala
      SELECT p.id FROM profiles p WHERE p.role = 'admin'
      UNION
      SELECT cr.created_by FROM chat_rooms cr WHERE cr.id = chat_messages.room_id
    )
  );

-- Garantir GRANT na função atualizada
GRANT EXECUTE ON FUNCTION create_chat_room(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_chat_room(TEXT, TEXT, TEXT) TO anon;

SELECT 'Schema expandido com sucesso!' as status;
