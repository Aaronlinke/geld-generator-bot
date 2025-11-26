-- Add function to automatically set user_id on bot_strategies insert
CREATE OR REPLACE FUNCTION set_user_id_on_bot_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS set_user_id_on_bot_insert_trigger ON bot_strategies;

CREATE TRIGGER set_user_id_on_bot_insert_trigger
BEFORE INSERT ON bot_strategies
FOR EACH ROW
EXECUTE FUNCTION set_user_id_on_bot_insert();