-- Update 2 (run once in the Supabase SQL Editor, after schema.sql).
-- 1. hs_state also returns the player's own concept-test scores, for the personal progress report.
-- 2. hs_today lists the other players' names who have answered on a given day ("Moa and Max have played today").
-- The app keeps working if this has not been run yet; it just hides those two features.

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
      'post', exists(select 1 from tests where player_id = hs_pid(p_code) and kind = 'post'),
      'pre_score',  (select score from tests where player_id = hs_pid(p_code) and kind = 'pre'),
      'post_score', (select score from tests where player_id = hs_pid(p_code) and kind = 'post'))
  )
$$;

create or replace function hs_today(p_code text, p_date date)
returns table (name text)
language sql stable security definer set search_path = public as $$
  select distinct p.name
  from answers a join players p on p.id = a.player_id
  where a.played_on = p_date
    and hs_pid(p_code) is not null      -- only players with a valid code can ask
    and p.id <> hs_pid(p_code)          -- not yourself
  order by 1
$$;

grant execute on function hs_state, hs_today to anon;
