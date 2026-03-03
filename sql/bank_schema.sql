-- Módulo Base do NEXUS BANK
-- Tabelas para registros de Transações, Cofres e Empréstimos.

-- 1. Tabela de Transações (Extrato)
CREATE TABLE IF NOT EXISTS public.bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR NOT NULL, -- transfer_out, transfer_in, vault_deposit, vault_withdraw, loan_received, loan_payment, mission_discount
    amount INT NOT NULL,
    description TEXT,
    related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Recebedor/Remetente em transferências
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;

-- O usuário pode R/W suas próprias transações.
CREATE POLICY "Users can read own transactions" ON public.bank_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.bank_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

----------------------------------------------------------

-- 2. Tabela de Cofres (Vaults / Poupança)
CREATE TABLE IF NOT EXISTS public.bank_vaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR NOT NULL,               -- Ex: "Comprar Nave Nova"
    balance INT DEFAULT 0,               -- Dinheiro atualmente guardado
    goal_amount INT DEFAULT 0,           -- Meta estabelecida (0 se não tiver meta)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bank_vaults ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access own vaults" ON public.bank_vaults FOR ALL USING (auth.uid() = user_id);

----------------------------------------------------------

-- 3. Tabela de Empréstimos (Loans)
CREATE TABLE IF NOT EXISTS public.bank_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    borrowed_amount INT NOT NULL,        -- O valor em dinheiro que o agente colocou no bolso
    total_debt INT NOT NULL,             -- borrowed + juros fixos (ex: borrowed * 1.3)
    remaining_amount INT NOT NULL,       -- Quanto ainda falta pagar
    status VARCHAR DEFAULT 'active',     -- 'active' ou 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bank_loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access own loans" ON public.bank_loans FOR ALL USING (auth.uid() = user_id);

-- Para permitir que os scripts do admin atualizem dívidas
CREATE POLICY "Admins can update loans" ON public.bank_loans FOR UPDATE USING (true);
CREATE POLICY "Admins can read all loans" ON public.bank_loans FOR SELECT USING (true);
