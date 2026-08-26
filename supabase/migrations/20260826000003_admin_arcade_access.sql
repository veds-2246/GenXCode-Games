-- ============================================================
-- GenXCode Games
-- Admin Arcade Access: Allow admins to submit scores without arcade session
-- ============================================================

-- Drop the existing policy that requires arcade session for score submission
drop policy if exists "players can submit own scores" on public.game_scores;

-- Create new policy that allows both players (with session) and admins to submit scores
create policy "players and admins can submit own scores"
on public.game_scores
for insert
to authenticated
with check (
  -- Players: must have active arcade session
  (
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
  )
  or
  -- Admins: can submit scores without arcade session
  public.is_admin()
);

-- Also update the arcade_sessions policy to allow admins to create sessions for themselves
-- (currently only allows creating sessions for other players)
drop policy if exists "admins can create sessions" on public.arcade_sessions;

create policy "admins can create sessions"
on public.arcade_sessions
for insert
to authenticated
with check (
  public.is_admin()
  and granted_by = auth.uid()
  and expires_at = started_at + interval '10 minutes'
);

-- Update has_active_arcade_session function to return true for admins
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
    from public.profiles p
    where p.id = target_player_id
      and p.role = 'admin'
  )
  or exists (
    select 1
    from public.arcade_sessions
    where player_id = target_player_id
      and status = 'active'
      and now() < expires_at
  );
$$;