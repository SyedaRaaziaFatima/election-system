-- Atomic cast_vote function
create or replace function public.cast_vote(
  p_election_id uuid,
  p_candidate_id uuid,
  p_secret_id uuid
)
returns table(id uuid, election_id uuid, candidate_id uuid, voter_id uuid, created_at timestamptz) as $$
declare
  s secret_ids%rowtype;
  e elections%rowtype;
  v votes%rowtype;
begin
  -- Lock the secret row to prevent race conditions
  select * into s from secret_ids where id = p_secret_id for update;
  if not found then
    raise exception 'Invalid secret id';
  end if;

  if s.has_voted then
    raise exception 'Secret already used';
  end if;

  select * into e from elections where id = p_election_id;
  if not found then
    raise exception 'Election not found';
  end if;

  if e.status <> 'active' then
    raise exception 'Election not active';
  end if;

  if e.end_time < now() then
    raise exception 'Election ended';
  end if;

  insert into votes(election_id, candidate_id, voter_id)
  values (p_election_id, p_candidate_id, s.voter_id)
  returning id, election_id, candidate_id, voter_id, created_at into v;

  update secret_ids set has_voted = true where id = p_secret_id;

  return query select v.id, v.election_id, v.candidate_id, v.voter_id, v.created_at;
end;
$$ language plpgsql security definer;

-- Note: Run this file in Supabase SQL editor. Ensure policies allow authenticated users to call this RPC and update their secret_ids.
