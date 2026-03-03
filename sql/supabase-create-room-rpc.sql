-- ============================================================
--  NEXUS OS — RPC para criação segura de DMs e Grupos
--  Execute no SQL Editor do Supabase
-- ============================================================
--  Usa SECURITY DEFINER para rodar com privilégios de admin,
--  bypassando o RLS. A segurança é feita dentro da função.
-- ============================================================

CREATE OR REPLACE FUNCTION create_chat_room(
  p_name TEXT,
  p_type TEXT  -- 'dm' ou 'group'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER   -- <-- roda como owner (postgres), bypassa RLS
SET search_path = public
AS $$
DECLARE
  v_room_id UUID;
  v_user_id UUID;
BEGIN
  -- Verifica que o chamador está autenticado
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'ACESSO NEGADO: usuário não autenticado';
  END IF;

  -- Valida o tipo
  IF p_type NOT IN ('dm', 'group') THEN
    RAISE EXCEPTION 'Tipo inválido: %', p_type;
  END IF;

  -- Cria o room
  INSERT INTO chat_rooms (name, type, created_by)
  VALUES (p_name, p_type, v_user_id)
  RETURNING id INTO v_room_id;

  RETURN v_room_id;
END;
$$;

-- Permitir que usuários autenticados chamem a função
GRANT EXECUTE ON FUNCTION create_chat_room(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_chat_room(TEXT, TEXT) TO anon;

-- Verificação
SELECT 'Função create_chat_room criada com sucesso!' AS status;
