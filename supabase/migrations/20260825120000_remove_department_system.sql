-- ============================================================
-- GenXCode Games
-- Remove Department System
-- ============================================================

-- Drop RLS policy on departments
drop policy if exists "players can view active departments" on public.departments;

-- Drop RLS on departments (not strictly necessary since we're dropping the table, but good practice)
alter table if exists public.departments disable row level security;

-- Drop index on profiles.department_id
drop index if exists public.profiles_department_idx;

-- Remove foreign key constraint and column from profiles
alter table if exists public.profiles
  drop constraint if exists profiles_department_id_fkey,
  drop column if exists department_id;

-- Drop departments table and its index
drop index if exists public.departments_active_idx;
drop table if exists public.departments;