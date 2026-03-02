-- Adicionar coluna de integridade na tabela de naves
ALTER TABLE ships ADD COLUMN IF NOT EXISTS integrity INTEGER DEFAULT 100;

-- Garantir que a integridade não ultrapasse 100 ou caia abaixo de 0
-- (Opcional: CHECK constraint)
-- ALTER TABLE ships ADD CONSTRAINT integrity_range CHECK (integrity >= 0 AND integrity <= 100);

-- Atualizar naves existentes para ter 100 de integridade
UPDATE ships SET integrity = 100 WHERE integrity IS NULL;
