-- Hindsight analysis. Run in the Supabase SQL Editor (it runs as the project owner, so row security does not get in the way).
-- Step 1: run this whole file once. It creates the answer keys and the views below.
-- Step 2: look at any view with:  select * from v_retention;   (or click "Export CSV" in the result panel)
-- The answer keys (between BEGIN KEYS and END KEYS) are rewritten by tools/build_analysis.py. If you change cards.json or test.json, run it again.

-- ---------- answer keys ----------
create table if not exists card_truth (
  card_id text primary key,
  pos int not null,                 -- position in the study (1 = first card)
  beat boolean not null,            -- true = the stock beat its index fund over the five years
  stock numeric, index_fund numeric -- total-return multiples
);
create table if not exists test_truth (
  q_id text primary key,
  pos int not null,
  correct int not null,             -- index of the correct option
  dont_know int not null            -- index of the "Don't know" option (always the last one)
);
alter table card_truth enable row level security;
alter table test_truth enable row level security;
-- BEGIN KEYS (rewritten by tools/build_analysis.py from cards.json and test.json)
truncate card_truth, test_truth;
insert into card_truth (card_id, pos, beat, stock, index_fund) values
  ('tencent', 1, true, 3.89, 1.52),
  ('hsbc', 2, false, 0.86, 1.52),
  ('netflix', 3, true, 4.75, 2.03),
  ('aia', 4, true, 2.35, 1.52),
  ('evolution', 5, true, 14.44, 1.6),
  ('hm', 6, false, 0.73, 1.6),
  ('evergrande', 7, false, 0.33, 1.23),
  ('ge', 8, false, 0.39, 2.03),
  ('swedbank', 9, false, 1.06, 1.6),
  ('boeing', 10, false, 1.61, 2.03),
  ('micron', 11, true, 5.17, 2.03),
  ('exxon', 12, false, 0.68, 2.03),
  ('visa', 13, true, 2.98, 2.03),
  ('att', 14, false, 1.25, 2.03),
  ('horton', 15, true, 2.36, 2.03),
  ('underarmour', 16, false, 0.44, 2.03),
  ('amat', 17, true, 5.06, 2.03),
  ('cocacola', 18, false, 1.47, 2.03),
  ('intel', 19, false, 1.67, 2.03),
  ('ford', 20, false, 0.8, 2.03),
  ('disney', 21, false, 1.83, 2.03);
insert into test_truth (q_id, pos, correct, dont_know) values
  ('pe_growth', 1, 1, 3),
  ('pe_def', 2, 0, 3),
  ('base_rate', 3, 0, 3),
  ('dividend', 4, 1, 3),
  ('debt', 5, 0, 3),
  ('expectations', 6, 0, 3),
  ('calibration', 7, 0, 3),
  ('brand', 8, 1, 3),
  ('beat_index', 9, 1, 3),
  ('diversify', 10, 0, 3);
-- END KEYS

-- ---------- 1. Retention: how many players answered on each study day ----------
-- Study day 1 = 2026-11-04. A player counts for a day if they answered at least one card that calendar day (Swedish time).
create or replace view v_retention as
with s as (select date '2026-11-04' as start_date),
     n as (select count(*) as players from players)
select d.day,
       s.start_date + d.day - 1 as date,
       count(distinct a.player_id) as players_answering,
       n.players as players_total,
       round(100.0 * count(distinct a.player_id) / nullif(n.players, 0), 0) as pct
from s cross join n cross join generate_series(1, 21) as d(day)
left join answers a on a.played_on = s.start_date + d.day - 1
group by d.day, s.start_date, n.players
order by d.day;

-- Per player: cards played, first and last day played, and the longest gap
create or replace view v_player_activity as
select p.name,
       count(a.card_id) as cards_played,
       min(a.played_on) as first_played,
       max(a.played_on) as last_played,
       count(distinct a.played_on) as days_with_play
from players p left join answers a on a.player_id = p.id
group by p.id, p.name
order by p.name;

-- ---------- 2. Concept test: before vs after ----------
create or replace view v_test_by_player as
select p.name,
       pre.score as pre_score,
       post.score as post_score,
       post.score - pre.score as change
from players p
left join tests pre on pre.player_id = p.id and pre.kind = 'pre'
left join tests post on post.player_id = p.id and post.kind = 'post'
order by p.name;

-- Per question: share who got it right, and share who answered "Don't know", before and after
create or replace view v_test_by_question as
with x as (
  select t.kind, e.key as q_id, e.value::int as choice
  from tests t, jsonb_each_text(t.answers) e
)
select q.pos, q.q_id,
       count(*) filter (where x.kind = 'pre') as n_pre,
       round(100.0 * count(*) filter (where x.kind = 'pre' and x.choice = q.correct) / nullif(count(*) filter (where x.kind = 'pre'), 0), 0) as pre_right_pct,
       round(100.0 * count(*) filter (where x.kind = 'pre' and x.choice = q.dont_know) / nullif(count(*) filter (where x.kind = 'pre'), 0), 0) as pre_dont_know_pct,
       count(*) filter (where x.kind = 'post') as n_post,
       round(100.0 * count(*) filter (where x.kind = 'post' and x.choice = q.correct) / nullif(count(*) filter (where x.kind = 'post'), 0), 0) as post_right_pct,
       round(100.0 * count(*) filter (where x.kind = 'post' and x.choice = q.dont_know) / nullif(count(*) filter (where x.kind = 'post'), 0), 0) as post_dont_know_pct
from test_truth q left join x on x.q_id = q.q_id
group by q.pos, q.q_id, q.correct, q.dont_know
order by q.pos;

-- ---------- 3. Calibration: how well does confidence match reality? ----------
-- One row per answer, with the answer key joined in. Answers where the player said they recognised the company are left out.
create or replace view v_graded as
select p.name, p.grp, a.card_id, t.pos, a.guess_beat, a.confidence, a.points, a.ms, a.played_on,
       (a.guess_beat = t.beat) as correct,
       case when t.pos <= 7 then 'early' when t.pos >= 15 then 'late' else 'middle' end as period,
       power(a.confidence / 100.0 - (case when a.guess_beat = t.beat then 1 else 0 end), 2) as brier   -- 0 = perfect, 0.25 = always saying 50 %
from answers a
join players p on p.id = a.player_id
join card_truth t on t.card_id = a.card_id
where not a.recognised;

-- Per player and period (early = cards 1-7, late = cards 15-21).
-- overconfidence = average confidence minus share of correct answers, in percentage points. Zero means well calibrated.
create or replace view v_calibration_by_player as
select name, period,
       count(*) as answers,
       round(100.0 * avg(correct::int), 0) as hit_rate_pct,
       round(avg(confidence), 0) as avg_confidence_pct,
       round(avg(confidence) - 100.0 * avg(correct::int), 0) as overconfidence_pp,
       round(avg(confidence) filter (where not correct), 0) as confidence_when_wrong_pct,
       round(avg(brier)::numeric, 3) as brier,
       round(100.0 * avg((not guess_beat)::int), 0) as said_no_pct
from v_graded
where period in ('early', 'late')
group by name, period
order by name, period desc;

-- All players together
create or replace view v_calibration_all as
select period,
       count(*) as answers,
       count(distinct name) as players,
       round(100.0 * avg(correct::int), 0) as hit_rate_pct,
       round(avg(confidence), 0) as avg_confidence_pct,
       round(avg(confidence) - 100.0 * avg(correct::int), 0) as overconfidence_pp,
       round(avg(confidence) filter (where not correct), 0) as confidence_when_wrong_pct,
       round(avg(brier)::numeric, 3) as brier,
       round(100.0 * avg((not guess_beat)::int), 0) as said_no_pct
from v_graded
where period in ('early', 'late')
group by period
order by period desc;

-- Calibration curve: when people said X % sure, how often were they right? (all periods)
create or replace view v_calibration_curve as
select confidence as said_pct,
       count(*) as answers,
       round(100.0 * avg(correct::int), 0) as right_pct
from v_graded
group by confidence
order by confidence;

-- ---------- 4. Engagement and learning signals ----------
create or replace view v_engagement as
select p.name,
       count(distinct a.card_id) as cards_played,
       round(avg(a.ms) / 1000.0, 0) as avg_seconds_per_card,
       count(distinct a.card_id) filter (where a.recognised) as recognised_cards,
       (select count(*) from events e where e.player_id = p.id and e.type = 'explain') as explanation_taps,
       (select count(*) from micro_answers m where m.player_id = p.id) as micro_answered,
       (select count(*) from micro_answers m where m.player_id = p.id and m.correct) as micro_correct
from players p left join answers a on a.player_id = p.id
group by p.id, p.name
order by p.name;

-- Concept question accuracy over the study (early cards vs late cards)
create or replace view v_micro_by_period as
select case when t.pos <= 7 then 'early' when t.pos >= 15 then 'late' else 'middle' end as period,
       count(*) as answers,
       round(100.0 * avg(m.correct::int), 0) as right_pct
from micro_answers m join card_truth t on t.card_id = m.card_id
group by 1
order by 1 desc;

-- ---------- lock everything: the public (anon) key must never be able to read any of this ----------
-- Views run with the owner's rights by default and would bypass row security, so make them run with the caller's rights
-- and remove all access for the public roles. Only you, in the SQL Editor, can read the results.
alter view v_retention set (security_invoker = on);
alter view v_player_activity set (security_invoker = on);
alter view v_test_by_player set (security_invoker = on);
alter view v_test_by_question set (security_invoker = on);
alter view v_graded set (security_invoker = on);
alter view v_calibration_by_player set (security_invoker = on);
alter view v_calibration_all set (security_invoker = on);
alter view v_calibration_curve set (security_invoker = on);
alter view v_engagement set (security_invoker = on);
alter view v_micro_by_period set (security_invoker = on);
revoke all on v_retention, v_player_activity, v_test_by_player, v_test_by_question, v_graded,
              v_calibration_by_player, v_calibration_all, v_calibration_curve, v_engagement, v_micro_by_period,
              card_truth, test_truth from anon, authenticated;
