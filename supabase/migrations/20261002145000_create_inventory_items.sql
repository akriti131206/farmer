BEGIN;

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('seeds','fertilizers','machinery','pesticides')),
  stock NUMERIC NOT NULL CHECK (stock >= 0),
  unit TEXT NOT NULL,
  threshold NUMERIC NOT NULL CHECK (threshold > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inventory_items_user_id_idx ON public.inventory_items (user_id);

DROP TRIGGER IF EXISTS inventory_items_set_updated_at ON public.inventory_items;
CREATE TRIGGER inventory_items_set_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inventory_items_select_own ON public.inventory_items;
CREATE POLICY inventory_items_select_own
  ON public.inventory_items FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS inventory_items_insert_own ON public.inventory_items;
CREATE POLICY inventory_items_insert_own
  ON public.inventory_items FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS inventory_items_update_own ON public.inventory_items;
CREATE POLICY inventory_items_update_own
  ON public.inventory_items FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS inventory_items_delete_own ON public.inventory_items;
CREATE POLICY inventory_items_delete_own
  ON public.inventory_items FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inventory_items TO authenticated;

COMMIT;
