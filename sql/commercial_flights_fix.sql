-- 1. ADICIONAR POLÍTICA DE DELETE
CREATE POLICY "Allow buyers to delete their flights"
  ON commercial_flights FOR DELETE
  USING (auth.uid() = buyer_id);
