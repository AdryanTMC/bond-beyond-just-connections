
-- 1) Drop sensitive phone column (was readable to all authenticated users)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- 2) Column-level restriction: revoke broad SELECT, regrant only safe columns
REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (
  id, display_name, bio, photos, interests, gender, city, country,
  is_active, created_at, updated_at
) ON public.profiles TO authenticated;

-- INSERT/UPDATE remain (already granted), DELETE not granted to authenticated
-- Owner can still INSERT/UPDATE all columns via existing policies.

-- 3) Security-definer accessor so the owner can read their own full profile
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;
