ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_url text;

GRANT SELECT (cover_url) ON public.profiles TO authenticated;
GRANT SELECT (cover_url) ON public.profiles TO anon;