-- ============================================================
--  NEXUS OS — Correção do Cofre O.R.T. (vault_items)
--  Cole ESTE ARQUIVO no SQL Editor do Supabase:
--  Settings > SQL Editor > New Query > Cole > Run
-- ============================================================

-- 1. Adicionar colunas que faltam na tabela vault_items
ALTER TABLE vault_items
  ADD COLUMN IF NOT EXISTS pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS is_unlocked BOOLEAN DEFAULT FALSE;

-- 2. Adicionar policy de UPDATE para vault_items
--    (permite qualquer usuário autenticado atualizar — necessário para desbloquear)
DROP POLICY IF EXISTS "autenticados_atualizar_vault" ON vault_items;
CREATE POLICY "autenticados_atualizar_vault"
  ON vault_items FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 3. Adicionar policy de DELETE (apenas admin pode apagar)
DROP POLICY IF EXISTS "admin_deletar_vault" ON vault_items;
CREATE POLICY "admin_deletar_vault"
  ON vault_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- 4. (vault_items já está na publicação supabase_realtime — nada a fazer)

-- Verificação: mostrar políticas ativas
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'vault_items'
ORDER BY cmd;
