
-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  bio text,
  birthdate date,
  gender text check (gender in ('male','female','nonbinary','other')),
  seeking text check (seeking in ('male','female','any')),
  min_age int default 18 check (min_age >= 18),
  max_age int default 60 check (max_age <= 120),
  city text,
  country text,
  photos text[] default '{}',
  interests text[] default '{}',
  is_active boolean not null default true,
  last_seen_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Authenticated read active profiles" on public.profiles
  for select to authenticated using (is_active = true);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Swipes
create table public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid not null references auth.users(id) on delete cascade,
  liked boolean not null,
  created_at timestamptz not null default now(),
  unique (swiper_id, target_id),
  check (swiper_id <> target_id)
);

grant select, insert on public.swipes to authenticated;
grant all on public.swipes to service_role;

alter table public.swipes enable row level security;

create policy "Users see own swipes" on public.swipes
  for select to authenticated using (auth.uid() = swiper_id);
create policy "Users create own swipes" on public.swipes
  for insert to authenticated with check (auth.uid() = swiper_id);

create index swipes_target_liked_idx on public.swipes(target_id, liked) where liked = true;
create index swipes_swiper_idx on public.swipes(swiper_id);

-- Matches (user_a always < user_b to ensure unique pair)
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b),
  check (user_a < user_b)
);

grant select on public.matches to authenticated;
grant all on public.matches to service_role;

alter table public.matches enable row level security;

create policy "Users see their matches" on public.matches
  for select to authenticated using (auth.uid() = user_a or auth.uid() = user_b);

-- Trigger: when mutual like, insert match
create or replace function public.handle_swipe_match()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  reciprocal boolean;
  a uuid;
  b uuid;
begin
  if new.liked = true then
    select exists(
      select 1 from public.swipes
      where swiper_id = new.target_id and target_id = new.swiper_id and liked = true
    ) into reciprocal;
    if reciprocal then
      a := least(new.swiper_id, new.target_id);
      b := greatest(new.swiper_id, new.target_id);
      insert into public.matches(user_a, user_b) values (a, b) on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$;

create trigger on_swipe_check_match
  after insert on public.swipes
  for each row execute function public.handle_swipe_match();

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

grant select, insert on public.messages to authenticated;
grant all on public.messages to service_role;

alter table public.messages enable row level security;

create policy "Users read messages in own matches" on public.messages
  for select to authenticated using (
    exists (
      select 1 from public.matches m
      where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );
create policy "Users send messages in own matches" on public.messages
  for insert to authenticated with check (
    auth.uid() = sender_id and exists (
      select 1 from public.matches m
      where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

create index messages_match_created_idx on public.messages(match_id, created_at desc);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- New user trigger -> profile + default role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_roles(user_id, role) values (new.id, 'user')
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;
