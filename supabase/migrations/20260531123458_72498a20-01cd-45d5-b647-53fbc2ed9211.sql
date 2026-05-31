-- 1. Lock down the SECURITY DEFINER RPC so it is not callable by anonymous/public.
--    It must remain callable by signed-in users (it returns the caller's own profile via auth.uid()).
REVOKE EXECUTE ON FUNCTION public.get_my_profile() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_my_profile() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;

-- 2. Re-affirm column-level SELECT on profiles for signed-in users so that sensitive
--    fields (birthdate, seeking, min_age, max_age, last_seen_at, onboarding_completed)
--    are never readable through the public-facing SELECT policy. Owners read those via
--    the get_my_profile() RPC instead.
REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (id, display_name, bio, gender, city, country, interests, photos, is_active, created_at, updated_at)
  ON public.profiles TO authenticated;

-- 3. Remove anonymous access to profile data entirely (the app requires authentication).
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.profiles FROM anon;