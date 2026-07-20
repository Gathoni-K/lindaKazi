-- =============================================================================
-- SUPABASE POSTGRES TRIGGER: Atomically sync auth.users -> public.users
-- =============================================================================
-- PURPOSE:
--   This trigger fires automatically every time Supabase creates a new row in
--   auth.users (i.e., every time a user signs up). It copies the relevant
--   metadata into your public.users table in the SAME database transaction,
--   guaranteeing that the two writes either both succeed or both fail (atomic).
--
-- WHY THIS MATTERS:
--   Without this trigger, your backend performs two separate writes:
--     1. supabase.auth.signUp()         -> writes to auth.users
--     2. db.insert(users).values(...)   -> writes to public.users
--   If step 2 fails (network blip, constraint error, crash), the user exists
--   in Supabase but NOT in your public DB, permanently breaking their account.
--
-- HOW TO RUN:
--   1. Go to your Supabase project dashboard.
--   2. Navigate to the "SQL Editor" tab in the left sidebar.
--   3. Paste this entire file into the editor and click "Run".
--
-- =============================================================================


-- Step 1: Create the trigger function
-- "security definer" means it runs with the privileges of its creator (postgres),
-- so it has permission to insert into public.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, phone_number)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',   -- passed via signUp options.data.name
    new.email,
    new.raw_user_meta_data ->> 'phone'   -- passed via signUp options.data.phone
  );
  return new;
end;
$$;


-- Step 2: Attach the trigger to auth.users
-- "after insert" means the trigger runs AFTER the Supabase row is committed.
-- "for each row" means it fires once per inserted user (not once per statement).
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =============================================================================
-- VERIFICATION
-- After running, sign up a new test user via your API. Then run:
--
--   select * from public.users order by created_at desc limit 5;
--
-- You should see the new user's row appear automatically, with no backend insert.
-- =============================================================================
