-- Secure Online Election Management System schema
-- Creates required tables and RLS policies

-- Enable pgcrypto extension for gen_random_uuid
create extension if not exists pgcrypto;

-- 1. profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  name text,
  email text unique not null,
  role text default 'voter' check (role in ('voter','creator','admin')),
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy profiles_select_self on profiles for select using (auth.uid() = id);
create policy profiles_insert_self on profiles for insert with check (auth.uid() = id);
create policy profiles_update_self on profiles for update using (auth.uid() = id);

-- 2. election_requests
create table if not exists election_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references profiles(id) on delete cascade,
  purpose text not null,
  organization text not null,
  phone text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table election_requests enable row level security;
create policy election_requests_select on election_requests for select using (
  auth.uid() = creator_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy election_requests_insert on election_requests for insert with check (auth.uid() = creator_id);
create policy election_requests_update on election_requests for update using (
  auth.uid() = creator_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- 3. elections
create table if not exists elections (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  registration_deadline timestamptz,
  max_voters integer default 1000,
  status text default 'draft' check (status in ('draft','scheduled','active','paused','completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table elections enable row level security;
-- public can view active/completed; creator and admin can view/manage
create policy elections_select_public on elections for select using (
  status = 'active' or status = 'completed' or auth.uid() = creator_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy elections_insert_creator on elections for insert with check (
  (auth.uid() = creator_id) or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy elections_update_manage on elections for update using (
  auth.uid() = creator_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy elections_delete_manage on elections for delete using (
  auth.uid() = creator_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- 4. candidates
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  name text not null,
  designation text,
  manifesto text,
  photo_url text,
  created_at timestamptz default now()
);

alter table candidates enable row level security;
create policy candidates_select_public on candidates for select using (true);
create policy candidates_manage_creator on candidates for all using (
  auth.uid() = (select creator_id from elections where id = candidates.election_id) or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- 5. voter_registrations
create table if not exists voter_registrations (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  voter_id uuid not null references profiles(id) on delete cascade,
  status text default 'registered' check (status in ('registered','waitlisted')),
  created_at timestamptz default now(),
  unique (election_id, voter_id)
);

alter table voter_registrations enable row level security;
create policy voter_registrations_select on voter_registrations for select using (
  auth.uid() = voter_id or auth.uid() = (select creator_id from elections where id = voter_registrations.election_id) or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy voter_registrations_insert on voter_registrations for insert with check (auth.uid() = voter_id);

-- 6. secret_ids (used for anonymous voting)
create table if not exists secret_ids (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  voter_id uuid not null references profiles(id) on delete cascade,
  secret_code text unique not null,
  has_voted boolean default false,
  created_at timestamptz default now(),
  unique (election_id, voter_id)
);

alter table secret_ids enable row level security;
create policy secret_ids_select on secret_ids for select using (auth.uid() = voter_id);
create policy secret_ids_insert on secret_ids for insert with check (auth.uid() = voter_id);
create policy secret_ids_update on secret_ids for update using (auth.uid() = voter_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- 7. votes
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  voter_id uuid null references profiles(id), -- optional to allow anonymous votes
  created_at timestamptz default now()
);

alter table votes enable row level security;
create policy votes_select on votes for select using (
  auth.uid() = (select creator_id from elections where id = votes.election_id) or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy votes_insert on votes for insert with check (
  -- insertion allowed by backend logic via authenticated helpers (we rely on PostgREST supabase JWT context)
  true
);

-- 8. audit_logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

alter table audit_logs enable row level security;
create policy audit_logs_select_admin on audit_logs for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy audit_logs_insert on audit_logs for insert with check (true);

-- Storage bucket for candidate photos
insert into storage.buckets (id, name, public) values ('candidates', 'candidates', true) on conflict (id) do nothing;

-- Indexes
create index if not exists idx_elections_creator_id on elections(creator_id);
create index if not exists idx_elections_status on elections(status);
create index if not exists idx_candidates_election_id on candidates(election_id);
create index if not exists idx_voter_registrations_election_id on voter_registrations(election_id);
create index if not exists idx_secret_ids_election_id on secret_ids(election_id);
create index if not exists idx_votes_election_id on votes(election_id);

-- Trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_update_profiles_updated_at before update on profiles for each row execute function update_updated_at_column();
create trigger trg_update_elections_updated_at before update on elections for each row execute function update_updated_at_column();
