-- Hindsight schema. Paste into Supabase → SQL Editor → Run.
-- Tables have RLS on and no policies, so the public (anon) key cannot read or write them directly.
-- The app only calls the hs_* functions below, which check the player's personal code first.

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,          -- secret part of the player's personal link (?p=CODE)
  name text not null,                 -- first name shown to friends
  grp text,                           -- friend group, for analysis
  created_at timestamptz default now()
);
create table if not exists answers (
  player_id uuid references players on delete cascade,
  card_id text not null,
  day int,                            -- position of the card in the study (1 = first card)
  guess_beat boolean not null,
  confidence int not null check (confidence between 50 and 100),
  points int not null,
  recognised boolean not null default false,
  ms int,                             -- time from card shown to answer
  played_on date not null,            -- Swedish date the answer was given
  answered_at timestamptz default now(),
  primary key (player_id, card_id)
);
create table if not exists micro_answers (
  player_id uuid references players on delete cascade,
  card_id text not null,
  choice int not null,
  correct boolean not null,
  answered_at timestamptz default now(),
  primary key (player_id, card_id)
);
create table if not exists tests (
  player_id uuid references players on delete cascade,
  kind text not null check (kind in ('pre', 'post')),
  answers jsonb not null,
  score int not null,
  taken_at timestamptz default now(),
  primary key (player_id, kind)
);
create table if not exists events (
  id bigserial primary key,
  player_id uuid references players on delete cascade,
  type text not null,
  card_id text,
  data jsonb,
  at timestamptz default now()
);

alter table players enable row level security;
alter table answers enable row level security;
alter table micro_answers enable row level security;
alter table tests enable row level security;
alter table events enable row level security;

create or replace function hs_pid(p_code text) returns uuid
language sql stable security definer set search_path = public as $$
  select id from players where code = p_code
$$;

create or replace function hs_me(p_code text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object('name', name) from players where code = p_code
$$;

create or replace function hs_state(p_code text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'answers', coalesce((select json_object_agg(card_id, json_build_object(
        'card_id', card_id, 'guess_beat', guess_beat, 'confidence', confidence,
        'points', points, 'recognised', recognised, 'played_on', played_on))
      from answers where player_id = hs_pid(p_code)), '{}'::json),
    'micro', coalesce((select json_object_agg(card_id, json_build_object('card_id', card_id, 'choice', choice, 'correct', correct))
      from micro_answers where player_id = hs_pid(p_code)), '{}'::json),
    'tests', json_build_object(
      'pre',  exists(select 1 from tests where player_id = hs_pid(p_code) and kind = 'pre'),
      'post', exists(select 1 from tests where player_id = hs_pid(p_code) and kind = 'post'))
  )
$$;

create or replace function hs_submit_answer(p_code text, p_card text, p_day int, p_beat boolean, p_conf int,
                                            p_points int, p_played_on date, p_ms int) returns void
language plpgsql security definer set search_path = public as $$
declare pid uuid := hs_pid(p_code);
begin
  if pid is null then raise exception 'unknown player'; end if;
  insert into answers (player_id, card_id, day, guess_beat, confidence, points, played_on, ms)
  values (pid, p_card, p_day, p_beat, p_conf, p_points, p_played_on, p_ms)
  on conflict do nothing;             -- first answer counts; no changing your guess after the reveal
end $$;

create or replace function hs_set_recognised(p_code text, p_card text) returns void
language sql security definer set search_path = public as $$
  update answers set recognised = true where player_id = hs_pid(p_code) and card_id = p_card
$$;

create or replace function hs_submit_micro(p_code text, p_card text, p_choice int, p_correct boolean) returns void
language plpgsql security definer set search_path = public as $$
declare pid uuid := hs_pid(p_code);
begin
  if pid is null then raise exception 'unknown player'; end if;
  insert into micro_answers (player_id, card_id, choice, correct) values (pid, p_card, p_choice, p_correct)
  on conflict do nothing;
end $$;

create or replace function hs_submit_test(p_code text, p_kind text, p_answers jsonb, p_score int) returns void
language plpgsql security definer set search_path = public as $$
declare pid uuid := hs_pid(p_code);
begin
  if pid is null then raise exception 'unknown player'; end if;
  insert into tests (player_id, kind, answers, score) values (pid, p_kind, p_answers, p_score)
  on conflict do nothing;
end $$;

create or replace function hs_log(p_code text, p_type text, p_card text, p_data jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare pid uuid := hs_pid(p_code);
begin
  if pid is null then return; end if;
  insert into events (player_id, type, card_id, data) values (pid, p_type, p_card, p_data);
end $$;

-- Friends' guesses on a card, only once the caller has answered it themselves
create or replace function hs_card_guesses(p_code text, p_card text)
returns table (name text, guess_beat boolean, confidence int, points int, me boolean)
language sql stable security definer set search_path = public as $$
  select p.name, a.guess_beat, a.confidence, a.points, p.id = hs_pid(p_code)
  from answers a join players p on p.id = a.player_id
  where a.card_id = p_card
    and exists (select 1 from answers x where x.player_id = hs_pid(p_code) and x.card_id = p_card)
$$;

-- Points per player for answers given on or after p_from (Monday of the current week)
create or replace function hs_league(p_code text, p_from date)
returns table (name text, points int, cards int, me boolean)
language sql stable security definer set search_path = public as $$
  select p.name, sum(a.points)::int, count(*)::int, p.id = hs_pid(p_code)
  from answers a join players p on p.id = a.player_id
  where a.played_on >= p_from and hs_pid(p_code) is not null
  group by p.id, p.name
  order by 2 desc
$$;

grant execute on function hs_me, hs_state, hs_submit_answer, hs_set_recognised, hs_submit_micro,
  hs_submit_test, hs_log, hs_card_guesses, hs_league to anon;
revoke execute on function hs_pid from anon, public;
