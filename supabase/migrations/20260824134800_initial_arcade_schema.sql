-- ============================================================
-- GenXCode Games
-- Initial Arcade Database Schema
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type public.user_role as enum (
  'player',
  'admin'
);

create type public.access_request_status as enum (
  'pending',
  'approved',
  'rejected',
  'expired'
);

create type public.session_status as enum (
  'active',
  'expired',
  'ended'
);

-- ============================================================
-- DEPARTMENTS
-- ============================================================

create table public.departments (
  id uuid primary key default gen_random_uuid(),

  name text not null unique,

  slug text not null unique,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),

  constraint departments_name_not_empty
    check (length(trim(name)) > 0),

  constraint departments_slug_not_empty
    check (length(trim(slug)) > 0)
);

create index departments_active_idx
  on public.departments (is_active);


-- ============================================================
-- PROFILES
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  name text not null,

  department_id uuid not null
    references public.departments(id),

  whatsapp_number text not null,

  role public.user_role not null default 'player',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint profiles_name_not_empty
    check (length(trim(name)) > 0),

  constraint profiles_whatsapp_not_empty
    check (length(trim(whatsapp_number)) > 0)
);

create index profiles_department_idx
  on public.profiles (department_id);

create index profiles_role_idx
  on public.profiles (role);


-- ============================================================
-- GAMES
-- ============================================================

create table public.games (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  slug text not null unique,

  description text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),

  constraint games_name_not_empty
    check (length(trim(name)) > 0),

  constraint games_slug_not_empty
    check (length(trim(slug)) > 0)
);

create index games_active_idx
  on public.games (is_active);


-- ============================================================
-- ACCESS REQUESTS
-- ============================================================

create table public.access_requests (
  id uuid primary key default gen_random_uuid(),

  player_id uuid not null
    references public.profiles(id) on delete cascade,

  status public.access_request_status not null default 'pending',

  requested_at timestamptz not null default now(),

  approved_at timestamptz,

  approved_by uuid
    references public.profiles(id),

  constraint access_requests_approval_consistency
    check (
      (status = 'approved' and approved_at is not null and approved_by is not null)
      or
      (status <> 'approved')
    ),

  constraint access_requests_approval_fields_consistency
    check (
      (approved_at is null and approved_by is null)
      or
      (approved_at is not null and approved_by is not null)
    )
);

create index access_requests_player_idx
  on public.access_requests (player_id);

create index access_requests_status_idx
  on public.access_requests (status);

create index access_requests_pending_idx
  on public.access_requests (requested_at)
  where status = 'pending';


-- ============================================================
-- ARCADE SESSIONS
-- ============================================================

create table public.arcade_sessions (
  id uuid primary key default gen_random_uuid(),

  player_id uuid not null
    references public.profiles(id) on delete cascade,

  started_at timestamptz not null,

  expires_at timestamptz not null,

  ended_at timestamptz,

  status public.session_status not null default 'active',

  granted_by uuid not null
    references public.profiles(id),

  constraint arcade_sessions_time_order
    check (expires_at > started_at),

  constraint arcade_sessions_exact_duration
    check (expires_at = started_at + interval '10 minutes'),

  constraint arcade_sessions_ended_consistency
    check (
      (status = 'ended' and ended_at is not null)
      or
      (status <> 'ended')
    )
);

create index arcade_sessions_player_idx
  on public.arcade_sessions (player_id);

create index arcade_sessions_status_idx
  on public.arcade_sessions (status);

create index arcade_sessions_expiry_idx
  on public.arcade_sessions (expires_at);

create index arcade_sessions_active_player_idx
  on public.arcade_sessions (player_id, expires_at)
  where status = 'active';


-- ============================================================
-- GAME SCORES
-- ============================================================

create table public.game_scores (
  id uuid primary key default gen_random_uuid(),

  session_id uuid not null
    references public.arcade_sessions(id) on delete cascade,

  player_id uuid not null
    references public.profiles(id) on delete cascade,

  game_id uuid not null
    references public.games(id),

  score integer not null,

  duration_ms integer,

  played_at timestamptz not null default now(),

  constraint game_scores_score_non_negative
    check (score >= 0),

  constraint game_scores_duration_non_negative
    check (
      duration_ms is null
      or duration_ms >= 0
    )
);

create index game_scores_session_idx
  on public.game_scores (session_id);

create index game_scores_player_idx
  on public.game_scores (player_id);

create index game_scores_game_idx
  on public.game_scores (game_id);

create index game_scores_leaderboard_idx
  on public.game_scores (player_id, score desc);

create index game_scores_played_at_idx
  on public.game_scores (played_at);


-- ============================================================
-- PROFILE UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();


-- ============================================================
-- ADMIN HELPER
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;


-- ============================================================
-- SESSION VALIDATION HELPER
-- ============================================================

create or replace function public.has_active_arcade_session(
  target_player_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.arcade_sessions
    where player_id = target_player_id
      and status = 'active'
      and now() < expires_at
  );
$$;


-- ============================================================
-- RLS
-- ============================================================

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.access_requests enable row level security;
alter table public.arcade_sessions enable row level security;
alter table public.game_scores enable row level security;


-- ============================================================
-- DEPARTMENTS POLICIES
-- ============================================================

create policy "players can view active departments"
on public.departments
for select
to authenticated
using (
  is_active = true
  or public.is_admin()
);


-- ============================================================
-- PROFILES POLICIES
-- ============================================================

create policy "players can view own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
);

create policy "players can create own profile"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and role = 'player'
);

create policy "players can update own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
  and role = 'player'
);

create policy "admins can manage profiles"
on public.profiles
for all
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


-- ============================================================
-- GAMES POLICIES
-- ============================================================

create policy "players can view active games"
on public.games
for select
to authenticated
using (
  is_active = true
  or public.is_admin()
);

create policy "admins can manage games"
on public.games
for all
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


-- ============================================================
-- ACCESS REQUEST POLICIES
-- ============================================================

create policy "players can create own access request"
on public.access_requests
for insert
to authenticated
with check (
  player_id = auth.uid()
  and status = 'pending'
  and approved_at is null
  and approved_by is null
);

create policy "players can view own access requests"
on public.access_requests
for select
to authenticated
using (
  player_id = auth.uid()
  or public.is_admin()
);

create policy "admins can manage access requests"
on public.access_requests
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


-- ============================================================
-- ARCADE SESSION POLICIES
-- ============================================================

create policy "players can view own sessions"
on public.arcade_sessions
for select
to authenticated
using (
  player_id = auth.uid()
  or public.is_admin()
);

create policy "admins can create sessions"
on public.arcade_sessions
for insert
to authenticated
with check (
  public.is_admin()
  and granted_by = auth.uid()
  and expires_at = started_at + interval '10 minutes'
);

create policy "admins can update sessions"
on public.arcade_sessions
for update
to authenticated
using (
  public.is_admin()
)
with check (
  public.is_admin()
);


-- ============================================================
-- GAME SCORE POLICIES
-- ============================================================

create policy "players can submit own scores"
on public.game_scores
for insert
to authenticated
with check (
  player_id = auth.uid()
  and exists (
    select 1
    from public.arcade_sessions s
    join public.games g
      on g.id = game_scores.game_id
    where s.id = game_scores.session_id
      and s.player_id = auth.uid()
      and s.status = 'active'
      and now() < s.expires_at
      and g.is_active = true
  )
);

create policy "players can view own scores"
on public.game_scores
for select
to authenticated
using (
  player_id = auth.uid()
  or public.is_admin()
);

create policy "admins can view all scores"
on public.game_scores
for select
to authenticated
using (
  public.is_admin()
);


-- ============================================================
-- SEED DEPARTMENTS
-- ============================================================

insert into public.departments (name, slug)
values
  ('Computer Science and Engineering', 'computer-science-and-engineering'),
  ('Information Technology', 'information-technology'),
  ('Electronics and Telecommunication', 'electronics-and-telecommunication'),
  ('Mechanical Engineering', 'mechanical-engineering'),
  ('Civil Engineering', 'civil-engineering'),
  ('Artificial Intelligence and Data Science', 'artificial-intelligence-and-data-science')
on conflict (slug) do nothing;


-- ============================================================
-- SEED GAMES
-- ============================================================

insert into public.games (name, slug, description)
values
  (
    'Reaction Rush',
    'reaction-rush',
    'Test your reaction speed.'
  ),
  (
    'Color Clash',
    'color-clash',
    'Test your color recognition and reaction.'
  ),
  (
    'Memory Flip',
    'memory-flip',
    'Match the cards using your memory.'
  ),
  (
    'Target Tap',
    'target-tap',
    'Tap targets as quickly and accurately as possible.'
  ),
  (
    'Odd One Out',
    'odd-one-out',
    'Find the different item before time runs out.'
  ),
  (
    'Number Ninja',
    'number-ninja',
    'Solve number challenges quickly.'
  )
on conflict (slug) do nothing;