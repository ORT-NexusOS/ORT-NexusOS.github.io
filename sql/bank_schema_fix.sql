-- Correção de RLS para a Tabela de Transações Bancárias (NEXUS BANK)

-- Remove a política anterior que limitava a inserção
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.bank_transactions;

-- Permite que usuários autenticados insiram transações livremente. 
-- Obs: Como as chamadas vêm do client logado do Agente que faz a transferência,
-- ele precisa ter permissão para criar o extrato do destinatário.
CREATE POLICY "Users can insert any transaction" 
ON public.bank_transactions 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
