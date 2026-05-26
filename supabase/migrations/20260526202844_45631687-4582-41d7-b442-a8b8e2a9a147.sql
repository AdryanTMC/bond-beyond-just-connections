ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_gender_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_seeking_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_gender_check CHECK (gender IS NULL OR gender = ANY (ARRAY['woman','man','nonbinary','other']));
ALTER TABLE public.profiles ADD CONSTRAINT profiles_seeking_check CHECK (seeking IS NULL OR seeking = ANY (ARRAY['women','men','everyone']));