const cfg = window.HINDSIGHT_CONFIG;
const params = new URLSearchParams(location.search);
const $ = s => document.querySelector(s);
const stage = () => $("#stage");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let CARDS = [], TEST = [], store, me, st, day;

// ---------- dates (all in Swedish time) ----------
function stockholmDate(d = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(d); // YYYY-MM-DD
}
function daysBetween(a, b) { return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5); }
function weekStart(dateStr) {
  const d = new Date(dateStr + "T00:00:00Z"), dow = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - dow);
  return d.toISOString().slice(0, 10);
}
function fmtDate(dateStr) {
  return new Intl.DateTimeFormat(lang === "sv" ? "sv-SE" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" })
    .format(new Date(dateStr + "T00:00:00Z"));
}
const num = (x, d = 1) => new Intl.NumberFormat(lang === "sv" ? "sv-SE" : "en-US", { maximumFractionDigits: d }).format(x);
const mult = x => "×" + num(x, 2);

// ---------- boot ----------
async function boot() {
  setLang(lang);
  try {
    [CARDS, TEST] = await Promise.all([fetch("cards.json").then(r => r.json()), fetch("test.json").then(r => r.json())]);
  } catch (e) { return fail("Could not load cards.json / test.json"); }

  const online = cfg.supabaseUrl && cfg.supabaseAnonKey;
  let code = params.get("p");
  try { if (code) localStorage.setItem("hindsight-code", code); else code = localStorage.getItem("hindsight-code"); } catch (e) {}

  if (online) {
    if (!code) return fail(t("noCode"));
    store = makeSupabaseStore(cfg, code);
  } else {
    store = makeLocalStore(CARDS);
  }

  try {
    me = await store.me();
    if (!me) return fail(t("unknownCode"));
    st = await store.state();
  } catch (e) { return fail(t("saveError")); }

  const today = stockholmDate();
  day = daysBetween(cfg.studyStart, today) + 1;
  if (store.demo) day = +params.get("day") || Math.max(1, day); // ?day=N lets you test unlocking in demo mode

  st.tests.pre ? home() : test("pre");
}

function fail(msg) { stage().innerHTML = `<section class="card"><p>${esc(msg)}</p></section>`; }

function topbar() {
  $("#lang").textContent = t("switchLang");
  $("#demo").hidden = !store?.demo;
  $("#demo").textContent = t("demo");
  $("#disclaimer").textContent = t("disclaimer");
}
$("#lang").onclick = () => { setLang(lang === "sv" ? "en" : "sv"); topbar(); current && current(); };
let current = null; // re-render the current screen when the language changes
const show = fn => { current = fn; topbar(); fn(); window.scrollTo(0, 0); };

// ---------- home ----------
function home() { show(renderHome); }
async function renderHome() {
  const n = CARDS.length, todayCard = day >= 1 ? CARDS[day - 1] : null;
  const missed = CARDS.slice(0, Math.max(0, Math.min(day - 1, n))).filter(c => !st.answers[c.id]);
  let main;
  if (day < 1) main = `<p>${t("beforeStart", { date: fmtDate(cfg.studyStart) })}</p>`;
  else if (todayCard && !st.answers[todayCard.id]) main = `<button class="primary" id="today">${t("playToday")}</button>`;
  else if (day > n && !missed.length) main = `<p class="muted">${t("allDone")}</p>`;
  else main = `<p class="muted">${t("doneToday")}</p>`;

  stage().innerHTML = `<section class="card">
    <div class="eyebrow"><span>${esc(t("hello", { name: me.name }))}</span><span>${day >= 1 ? t("dayOf", { d: Math.min(day, n), n }) : ""}</span></div>
    ${main}
    ${missed.length ? `<div class="list"><small class="label">${t("missed")}</small>${missed.map(c =>
      `<div class="row-item"><span>${esc(L(c.title))}</span><button data-card="${c.id}">${t("play")}</button></div>`).join("")}</div>` : ""}
    ${day >= cfg.postTestDay && !st.tests.post ? `<button id="post">${t("postCta")}</button>` : ""}
  </section>
  <section class="card"><div class="eyebrow"><span>${t("league")}</span></div><div id="league" class="muted">${t("loading")}</div></section>`;

  if ($("#today")) $("#today").onclick = () => ask(todayCard);
  stage().querySelectorAll("[data-card]").forEach(b => b.onclick = () => ask(CARDS.find(c => c.id === b.dataset.card)));
  if ($("#post")) $("#post").onclick = () => test("post");

  try {
    const rows = await store.league(weekStart(stockholmDate()));
    $("#league").innerHTML = rows.length ? leagueTable(rows) : t("noLeague");
  } catch (e) { $("#league").textContent = t("saveError"); }
}
function leagueTable(rows) {
  return `<ol class="league">${rows.map(r => `<li class="${r.me ? "me" : ""}"><span>${esc(r.name)}${r.me ? ` (${t("you")})` : ""}</span><b>${r.points} ${t("points")}</b></li>`).join("")}</ol>`;
}

// ---------- the card ----------
function ask(card) { show(() => renderAsk(card)); }
function renderAsk(card) {
  const pos = CARDS.indexOf(card) + 1;
  const shown = ["pe", ...(pos >= 4 ? ["growth"] : []), ...(pos >= 7 ? ["debt"] : [])]; // concepts arrive in stages
  let pick = null, conf = 70; const t0 = Date.now();
  store.log("card_shown", card.id, { pos });

  stage().innerHTML = `<section class="card">
    <div class="eyebrow"><span>${esc(L(card.market))}</span><span>${t("asOf", { when: L(card.when) })}</span></div>
    <h2>${esc(L(card.title))}</h2><p>${esc(L(card.desc))}</p>
    <div class="clues">${shown.map(k => figure(card, k)).join("")}</div>
    <p class="hint" id="explain">${t("tapHint")}</p>
    <p class="q">${t("question", { y: card.years })}</p>
    <div class="choice"><button id="yes">${t("yes")}</button><button id="no">${t("no")}</button></div>
    <div class="conf"><label for="cf">${t("howSure")} <output id="cfo">70 %</output></label>
      <input id="cf" type="range" min="50" max="100" step="10" value="70"></div>
    <div class="err" id="err" hidden></div>
    <button class="primary" id="go" disabled>${t("fastForward", { y: card.years })}</button></section>`;

  stage().querySelectorAll(".clue").forEach(b => b.onclick = () => {
    $("#explain").textContent = t("explain." + b.dataset.k);
    $("#explain").classList.add("open");
    store.log("explain", card.id, { fig: b.dataset.k });
  });
  const sel = v => { pick = v; $("#yes").classList.toggle("sel", v); $("#no").classList.toggle("sel", !v); $("#go").disabled = false; };
  $("#yes").onclick = () => sel(true); $("#no").onclick = () => sel(false);
  $("#cf").oninput = e => { conf = +e.target.value; $("#cfo").textContent = conf + " %"; };
  $("#go").onclick = async () => {
    $("#go").disabled = true;
    const a = { card_id: card.id, day: pos, guess_beat: pick, confidence: conf, points: brierPoints(pick, conf, card),
                played_on: stockholmDate(), ms: Date.now() - t0 };
    try { await store.submitAnswer(a); }
    catch (e) { $("#err").hidden = false; $("#err").textContent = t("saveError"); $("#go").disabled = false; return; }
    st.answers[card.id] = { ...a, recognised: false };
    reveal(card);
  };
}
function figure(card, k) {
  const f = card.figures || {};
  let val, sub = "";
  if (k === "pe" && f.pe != null) { val = num(f.pe, 0); if (f.pe_index != null) sub = t("indexAvg", { v: num(f.pe_index, 0) }); }
  else if (k === "growth" && f.growth != null) { val = (f.growth > 0 ? "+" : "") + num(f.growth, 0) + " %"; if (f.growth_index != null) sub = t("indexAvg", { v: num(f.growth_index, 0) + " %" }); }
  else if (k === "debt" && f.debt != null) { val = num(f.debt, 1); }
  else { val = L(card.clues?.[k]); sub = `<i>${t("preliminary")}</i>`; } // until the real figures are in cards.json
  return `<button class="clue" data-k="${k}"><small>${t("fig." + k)}</small><span>${esc(val)}</span>${sub ? `<em>${sub}</em>` : ""}</button>`;
}

// ---------- reveal ----------
function reveal(card) { show(() => renderReveal(card)); }
function renderReveal(card) {
  const a = st.answers[card.id], beat = card.stock > card.index, ok = a.guess_beat === beat, t0 = Date.now();
  const scale = x => Math.max(4, Math.min(100, Math.log(x * 3) / Math.log(17 * 3) * 100));
  stage().innerHTML = `<section class="card">
    <div class="eyebrow"><span>${esc(L(card.market))}</span><span>${esc(L(card.when))} → ${t("plusYears", { y: card.years })}</span></div>
    <div class="reveal-name">${esc(card.name)}</div>
    <div class="bars">
      <div class="bar"><span>${t("stock")}</span><div class="track"><div class="fill" id="f1" style="background:var(${beat ? "--up" : "--down"})"></div></div><span class="num">${mult(card.stock)}</span></div>
      <div class="bar"><span>${t("indexFund")}</span><div class="track"><div class="fill" id="f2" style="background:var(--idx)"></div></div><span class="num">${mult(card.index)}</span></div>
    </div>
    ${card.approx ? `<small class="muted">${t("approx")}</small>` : ""}
    <div class="verdict ${ok ? "good" : "bad"}">${ok ? t("right") : t("wrong")}, ${a.confidence} % ${t("sure")} · ${a.points > 0 ? "+" : ""}${a.points} ${t("pointsWord")}</div>
    <p>${esc(L(card.story))}</p>
    <div class="lesson"><b>${esc(L(card.lesson.title))}</b>${esc(L(card.lesson.text))}</div>
    <button class="ghost" id="rec" ${a.recognised ? "disabled" : ""}>${a.recognised ? t("recognisedNoted") : t("recognised")}</button>
    <button class="primary" id="next">${t("next")}</button></section>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { $("#f1").style.width = scale(card.stock) + "%"; $("#f2").style.width = scale(card.index) + "%"; }));
  $("#rec").onclick = async () => {
    $("#rec").disabled = true; $("#rec").textContent = t("recognisedNoted");
    a.recognised = true; store.setRecognised(card.id).catch(() => {});
  };
  $("#next").onclick = () => { store.log("reveal_time", card.id, { ms: Date.now() - t0 }); micro(card); };
}

// ---------- micro-question ----------
function micro(card) { if (!card.micro || st.micro[card.id]) return others(card); show(() => renderMicro(card)); }
function renderMicro(card) {
  const m = card.micro;
  stage().innerHTML = `<section class="card">
    <div class="eyebrow"><span>${t("microTitle")}</span></div>
    <p class="q">${esc(L(m.q))}</p>
    <div class="options">${m.options.map((o, i) => `<button data-i="${i}">${esc(L(o))}</button>`).join("")}</div>
    <div id="mres" hidden></div>
    <button class="primary" id="next" hidden>${t("next")}</button></section>`;
  stage().querySelectorAll("[data-i]").forEach(b => b.onclick = () => {
    const choice = +b.dataset.i, correct = choice === m.correct;
    stage().querySelectorAll("[data-i]").forEach(x => { x.disabled = true; if (+x.dataset.i === m.correct) x.classList.add("okay"); });
    if (!correct) b.classList.add("nope");
    $("#mres").hidden = false;
    $("#mres").innerHTML = `<p class="${correct ? "good" : "bad"}"><b>${correct ? t("correct") : t("incorrect")}</b> ${esc(L(m.explain))}</p>`;
    $("#next").hidden = false;
    st.micro[card.id] = { card_id: card.id, choice, correct };
    store.submitMicro(st.micro[card.id]).catch(() => {});
  });
  $("#next").onclick = () => others(card);
}

// ---------- what the others guessed ----------
function others(card) { show(() => renderOthers(card)); }
async function renderOthers(card) {
  stage().innerHTML = `<section class="card"><div class="eyebrow"><span>${t("othersTitle")}</span><span>${esc(card.name)}</span></div>
    <div id="og" class="muted">${t("loading")}</div><button class="primary" id="home">${t("home")}</button></section>`;
  $("#home").onclick = home;
  try {
    const rows = await store.cardGuesses(card.id);
    const others = rows.filter(r => !r.me);
    $("#og").innerHTML = others.length ? `<ol class="league">${rows.sort((a, b) => b.points - a.points).map(r =>
      `<li class="${r.me ? "me" : ""}"><span>${esc(r.name)}${r.me ? ` (${t("you")})` : ""} · ${r.guess_beat ? t("guessYes") : t("guessNo")}, ${r.confidence} %</span><b>${r.points > 0 ? "+" : ""}${r.points}</b></li>`).join("")}</ol>`
      : t("noOthers");
  } catch (e) { $("#og").textContent = t("saveError"); }
}

// ---------- pre/post concept test ----------
function test(kind) { show(() => renderTest(kind)); }
function renderTest(kind) {
  const picked = {};
  stage().innerHTML = `<section class="card">
    <h2>${kind === "pre" ? t("preTitle") : t("postTitle")}</h2><p class="muted">${t("testIntro")}</p>
    ${TEST.map((q, qi) => `<fieldset><legend>${qi + 1}. ${esc(L(q.q))}</legend>${q.options.map((o, i) =>
      `<label class="opt"><input type="radio" name="${q.id}" value="${i}"> ${esc(L(o))}</label>`).join("")}</fieldset>`).join("")}
    <div class="err" id="err" hidden></div>
    <button class="primary" id="send">${t("submit")}</button></section>`;
  stage().querySelectorAll("input[type=radio]").forEach(r => r.onchange = () => { picked[r.name] = +r.value; });
  $("#send").onclick = async () => {
    if (Object.keys(picked).length < TEST.length) { $("#err").hidden = false; $("#err").textContent = t("answerAll"); return; }
    const score = TEST.filter(q => picked[q.id] === q.correct).length;
    $("#send").disabled = true;
    try { await store.submitTest({ kind, answers: picked, score }); }
    catch (e) { $("#err").hidden = false; $("#err").textContent = t("saveError"); $("#send").disabled = false; return; }
    st.tests[kind] = true;
    stage().innerHTML = `<section class="card"><p>${t("thanks")}</p><button class="primary" id="home">${t("next")}</button></section>`;
    $("#home").onclick = home;
  };
}

boot();
