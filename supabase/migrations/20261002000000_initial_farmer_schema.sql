BEGIN;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  preferred_language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  farm_name TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  village TEXT NOT NULL,
  land_area NUMERIC NOT NULL CHECK (land_area > 0),
  land_area_unit TEXT NOT NULL CHECK (land_area_unit IN ('acre', 'hectare')),
  soil_type TEXT NOT NULL,
  irrigation_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms (id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  sowing_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crop_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES public.crops (id) ON DELETE CASCADE,
  activity_key TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  activity_category TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  activity_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (crop_id, activity_key)
);

CREATE INDEX IF NOT EXISTS farms_user_id_idx ON public.farms (user_id);
CREATE INDEX IF NOT EXISTS crops_farm_id_idx ON public.crops (farm_id);
CREATE INDEX IF NOT EXISTS crop_calendar_crop_id_idx ON public.crop_calendar (crop_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS farms_set_updated_at ON public.farms;
CREATE TRIGGER farms_set_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS crops_set_updated_at ON public.crops;
CREATE TRIGGER crops_set_updated_at
  BEFORE UPDATE ON public.crops
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS crop_calendar_set_updated_at ON public.crop_calendar;
CREATE TRIGGER crop_calendar_set_updated_at
  BEFORE UPDATE ON public.crop_calendar
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.set_crop_calendar_completed_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.completed THEN
    NEW.completed_at := COALESCE(NEW.completed_at, NOW());
  ELSE
    NEW.completed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crop_calendar_set_completed_at ON public.crop_calendar;
CREATE TRIGGER crop_calendar_set_completed_at
  BEFORE INSERT OR UPDATE ON public.crop_calendar
  FOR EACH ROW EXECUTE FUNCTION public.set_crop_calendar_completed_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
  ON public.profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS farms_select_own ON public.farms;
CREATE POLICY farms_select_own
  ON public.farms FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS farms_insert_own ON public.farms;
CREATE POLICY farms_insert_own
  ON public.farms FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS farms_update_own ON public.farms;
CREATE POLICY farms_update_own
  ON public.farms FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS farms_delete_own ON public.farms;
CREATE POLICY farms_delete_own
  ON public.farms FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS crops_select_own_farms ON public.crops;
CREATE POLICY crops_select_own_farms
  ON public.crops FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.farms AS farm
      WHERE farm.id = crops.farm_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS crops_insert_own_farms ON public.crops;
CREATE POLICY crops_insert_own_farms
  ON public.crops FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.farms AS farm
      WHERE farm.id = crops.farm_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS crops_update_own_farms ON public.crops;
CREATE POLICY crops_update_own_farms
  ON public.crops FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.farms AS farm
      WHERE farm.id = crops.farm_id
        AND farm.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.farms AS farm
      WHERE farm.id = crops.farm_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS crops_delete_own_farms ON public.crops;
CREATE POLICY crops_delete_own_farms
  ON public.crops FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.farms AS farm
      WHERE farm.id = crops.farm_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS crop_calendar_select_own_farms ON public.crop_calendar;
CREATE POLICY crop_calendar_select_own_farms
  ON public.crop_calendar FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.crops AS crop
      JOIN public.farms AS farm ON farm.id = crop.farm_id
      WHERE crop.id = crop_calendar.crop_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS crop_calendar_insert_own_farms ON public.crop_calendar;
CREATE POLICY crop_calendar_insert_own_farms
  ON public.crop_calendar FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.crops AS crop
      JOIN public.farms AS farm ON farm.id = crop.farm_id
      WHERE crop.id = crop_calendar.crop_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS crop_calendar_update_own_farms ON public.crop_calendar;
CREATE POLICY crop_calendar_update_own_farms
  ON public.crop_calendar FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.crops AS crop
      JOIN public.farms AS farm ON farm.id = crop.farm_id
      WHERE crop.id = crop_calendar.crop_id
        AND farm.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.crops AS crop
      JOIN public.farms AS farm ON farm.id = crop.farm_id
      WHERE crop.id = crop_calendar.crop_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS crop_calendar_delete_own_farms ON public.crop_calendar;
CREATE POLICY crop_calendar_delete_own_farms
  ON public.crop_calendar FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.crops AS crop
      JOIN public.farms AS farm ON farm.id = crop.farm_id
      WHERE crop.id = crop_calendar.crop_id
        AND farm.user_id = (SELECT auth.uid())
    )
  );

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crops TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crop_calendar TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;
