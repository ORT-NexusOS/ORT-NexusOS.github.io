-- ============================================================
--  NEXUS OS — Fix RPC Ambiguity
--  Remove a versão antiga da função para evitar conflitos
-- ============================================================

-- Remover a versão de 2 parâmetros que está causando ambiguidade
DROP FUNCTION IF EXISTS public.create_chat_room(TEXT, TEXT);

-- Recriar o GRANT para a versão de 3 parâmetros (garantia)
GRANT EXECUTE ON FUNCTION public.create_chat_room(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_chat_room(TEXT, TEXT, TEXT) TO anon;

SELECT 'Ambiguidade resolvida com sucesso!' as status;
