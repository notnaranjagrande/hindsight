// Two stores with the same async interface: Supabase (the study) and localStorage (demo).
// The Supabase store only calls RPC functions from supabase/schema.sql; anon has no direct table access.

function makeSupabaseStore(cfg, code) {
  const db = supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const rpc = async (fn, args) => {
    const { data, error } = await db.rpc(fn, { p_code: code, ...args });
    if (error) throw error;
    return data;
  };
  return {
    demo: false,
    me: () => rpc("hs_me", {}),
    state: () => rpc("hs_state", {}),
    submitAnswer: a => rpc("hs_submit_answer", {
      p_card: a.card_id, p_day: a.day, p_beat: a.guess_beat, p_conf: a.confidence,
      p_points: a.points, p_played_on: a.played_on, p_ms: a.ms
    }),
    setRecognised: card => rpc("hs_set_recognised", { p_card: card }),
    submitMicro: m => rpc("hs_submit_micro", { p_card: m.card_id, p_choice: m.choice, p_correct: m.correct }),
    submitTest: x => rpc("hs_submit_test", { p_kind: x.kind, p_answers: x.answers, p_score: x.score }),
    log: (type, card, data = {}) => rpc("hs_log", { p_type: type, p_card: card, p_data: data }).catch(() => {}),
    cardGuesses: card => rpc("hs_card_guesses", { p_card: card }),
    league: from => rpc("hs_league", { p_from: from })
  };
}

function makeLocalStore(cards) {
  const KEY = "hindsight-local";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  let s = load() || { answers: {}, micro: {}, tests: {}, events: [] };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  // Example players so the social screens have something to show in demo mode
  const FAKE = ["Alex (demo)", "Sam (demo)", "Kim (demo)"];
  const fakeGuess = (name, card) => {
    let h = 0; for (const ch of name + card.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const beat = h % 3 !== 0, conf = 50 + (h % 6) * 10;
    return { name, guess_beat: beat, confidence: conf, points: brierPoints(beat, conf, card), me: false };
  };
  return {
    demo: true,
    me: async () => ({ name: "Demo" }),
    state: async () => ({
      answers: s.answers, micro: s.micro,
      tests: { pre: !!s.tests.pre, post: !!s.tests.post }
    }),
    submitAnswer: async a => { if (!s.answers[a.card_id]) { s.answers[a.card_id] = { ...a, recognised: false }; save(); } },
    setRecognised: async card => { if (s.answers[card]) { s.answers[card].recognised = true; save(); } },
    submitMicro: async m => { if (!s.micro[m.card_id]) { s.micro[m.card_id] = m; save(); } },
    submitTest: async x => { s.tests[x.kind] = x; save(); },
    log: async (type, card, data = {}) => { s.events.push({ type, card, data, at: new Date().toISOString() }); s.events = s.events.slice(-500); save(); },
    cardGuesses: async cardId => {
      const card = cards.find(c => c.id === cardId), mine = s.answers[cardId];
      if (!mine) return [];
      return [{ name: "Demo", guess_beat: mine.guess_beat, confidence: mine.confidence, points: mine.points, me: true },
              ...FAKE.map(n => fakeGuess(n, card))];
    },
    league: async from => {
      const mine = Object.values(s.answers).filter(a => a.played_on >= from);
      const rows = [{ name: "Demo", points: mine.reduce((x, a) => x + a.points, 0), cards: mine.length, me: true }];
      const played = cards.filter(c => mine.some(a => a.card_id === c.id));
      for (const n of FAKE) {
        const g = played.map(c => fakeGuess(n, c));
        rows.push({ name: n, points: g.reduce((x, a) => x + a.points, 0), cards: g.length, me: false });
      }
      return rows.filter(r => r.cards > 0).sort((a, b) => b.points - a.points);
    }
  };
}

// Brier-based score: p = probability given to what actually happened. 50 % → 0, right at 100 % → 100, wrong at 100 % → −300
function brierPoints(guessBeat, confidence, card) {
  const beat = card.stock > card.index;
  const p = (guessBeat === beat ? confidence : 100 - confidence) / 100;
  return Math.round(100 - 400 * Math.pow(1 - p, 2));
}
