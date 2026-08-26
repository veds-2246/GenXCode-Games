-- ============================================================
-- GenXCode Games
-- Set Admin Role for Existing User
-- ============================================================

-- This migration sets the role to 'admin' for a specific user.
-- Replace 'admin@example.com' with the actual admin email address.
-- Run this migration after the admin user has registered normally.

-- Option 1: Set admin by email (recommended - run after user registers)
-- update public.profiles
-- set role = 'admin'
-- where id = (
--   select id from auth.users where email = 'admin@example.com'
-- );

-- Option 2: Set admin by user ID (if you know the UUID)
-- update public.profiles
-- set role = 'admin'
-- where id = '00000000-0000-0000-0000-000000000000'::uuid;

-- Option 3: Set the first registered user as admin (use with caution)
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from public.profiles order by created_at asc limit 1);

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================

-- Verify the admin role was set correctly:
-- select id, name, email, role from public.profiles p
-- join auth.users u on u.id = p.id
-- where p.role = 'admin';