BEGIN;

CREATE TABLE IF NOT EXISTS public.farm_diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  title TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  expense NUMERIC NOT NULL DEFAULT 0 CHECK (expense >= 0),
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS farm_diary_entries_user_id_idx
  ON public.farm_diary_entries (user_id);

DROP TRIGGER IF EXISTS farm_diary_entries_set_updated_at ON public.farm_diary_entries;
CREATE TRIGGER farm_diary_entries_set_updated_at
  BEFORE UPDATE ON public.farm_diary_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.farm_diary_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS farm_diary_entries_select_own ON public.farm_diary_entries;
CREATE POLICY farm_diary_entries_select_own
  ON public.farm_diary_entries FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS farm_diary_entries_insert_own ON public.farm_diary_entries;
CREATE POLICY farm_diary_entries_insert_own
  ON public.farm_diary_entries FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS farm_diary_entries_update_own ON public.farm_diary_entries;
CREATE POLICY farm_diary_entries_update_own
  ON public.farm_diary_entries FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS farm_diary_entries_delete_own ON public.farm_diary_entries;
CREATE POLICY farm_diary_entries_delete_own
  ON public.farm_diary_entries FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.farm_diary_entries TO authenticated;

COMMIT;
