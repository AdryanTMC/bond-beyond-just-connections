-- Source of truth for premium entitlement (server-controlled).
CREATE TABLE public.subscriptions (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Validate tier/status values with a trigger (no time-based logic, but keeps values sane).
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_tier_chk CHECK (tier IN ('free','plus','gold','infinity')),
  ADD CONSTRAINT subscriptions_status_chk CHECK (status IN ('active','canceled','past_due','trialing'));

-- Grants: signed-in users may only read; only the backend may write.
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read ONLY their own subscription. No INSERT/UPDATE/DELETE policies =>
-- authenticated users cannot grant or change their own premium status.
CREATE POLICY "Users read own subscription"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Keep updated_at fresh on writes (writes only happen via service_role).
CREATE TRIGGER subscriptions_touch_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- Give every existing user a default free subscription row.
INSERT INTO public.subscriptions (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Ensure new signups get a default free subscription too.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_roles(user_id, role) values (new.id, 'user')
  on conflict do nothing;
  insert into public.subscriptions(user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$function$;