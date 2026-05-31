-- Add a "highlights" column to store up to 10 highlight photo URLs (Instagram-style)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS highlights text[] NOT NULL DEFAULT '{}'::text[];

-- Cap highlights at 10 entries via a validation trigger (no array CHECK constraints)
CREATE OR REPLACE FUNCTION public.enforce_highlights_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.highlights IS NOT NULL AND array_length(NEW.highlights, 1) > 10 THEN
    RAISE EXCEPTION 'A profile can have at most 10 highlights';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_highlights_limit ON public.profiles;
CREATE TRIGGER trg_enforce_highlights_limit
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_highlights_limit();

-- Expose the new column to authenticated users (read), matching existing public columns
GRANT SELECT (highlights) ON public.profiles TO authenticated;