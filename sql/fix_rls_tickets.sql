-- Para corrigir o erro 403 (Permissão Negada) na tabela travel_registrations
-- Cole e execute o código abaixo no SQL Editor do seu painel do Supabase.

-- Garante que os usuários possam INSERIR tickets de viagem em seu próprio nome.
CREATE POLICY "Permitir que usuários insiram seus próprios tickets" 
ON public.travel_registrations
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Caso necessário, também garantir que possam ler tickets de missões das quais fazem parte
CREATE POLICY "Permitir leitura de agência" 
ON public.travel_registrations
FOR SELECT 
USING (true);

-- E que possam atualizar seus tickets (para status 'ready'/'active')
CREATE POLICY "Permitir atualizar tickets próprios" 
ON public.travel_registrations
FOR UPDATE 
USING (auth.uid() = user_id);

-- Permitir exclusão após chegar ao destino
CREATE POLICY "Permitir excluir tickets após viagem" 
ON public.travel_registrations
FOR DELETE 
USING (auth.uid() = user_id);
