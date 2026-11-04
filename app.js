const cfg = window.HINDSIGHT_CONFIG;
const params = new URLSearchParams(location.search);
const $ = s => document.querySelector(s);
const stage = () => $("#stage");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let CARDS = [], TEST = [], SERIES = {}, store, me, st, day;

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
    const v = encodeURIComponent(cfg.contentVersion || "1"); // bump in config.js when cards.json / test.json / series.json change, so browsers fetch the new files
    [CARDS, TEST] = await Promise.all([fetch("cards.json?v=" + v).then(r => r.json()), fetch("test.json?v=" + v).then(r => r.json())]);
  } catch (e) { return fail("Could not load cards.json / test.json"); }
  try { SERIES = (await fetch("series.json?v=" + encodeURIComponent(cfg.contentVersion || "1")).then(r => r.json())).series || {}; } catch (e) {}

  const online = cfg.supabaseUrl && cfg.supabaseAnonKey && !params.get("demo"); // ?demo=1 forces local demo mode for testing
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

  st.tests.pre ? home() : intro(0);
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

// ---------- introduction (shown before the first test; reachable again from the start page) ----------
function intro(i = 0, then = () => test("pre")) { show(() => renderIntro(i, then)); }
function renderIntro(i, then) {
  const slides = STRINGS[lang].intro, sl = slides[i], last = i === slides.length - 1;
  stage().innerHTML = `<section class="card intro">
    <div class="dots" aria-hidden="true">${slides.map((_, j) => `<i class="${j === i ? "on" : ""}"></i>`).join("")}</div>
    <h2>${esc(sl.title)}</h2>${sl.body.map(p => `<p>${esc(p)}</p>`).join("")}
    <div class="btn-row">${i ? `<button id="back">${t("introBack")}</button>` : ""}<button class="primary" id="fwd">${last ? t("introStart") : t("introNext")}</button></div></section>`;
  $("#fwd").onclick = () => last ? then() : intro(i + 1, then);
  if (i) $("#back").onclick = () => intro(i - 1, then);
}

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
  <section class="card"><div class="eyebrow"><span>${t("league")}</span></div><div id="league" class="muted">${t("loading")}</div></section>
  <button class="link" id="again-intro">${t("showIntro")}</button>`;

  $("#again-intro").onclick = () => intro(0, home);
  if ($("#today")) $("#today").onclick = () => ask(todayCard);
  stage().querySelectorAll("[data-card]").forEach(b => b.onclick = () => ask(CARDS.find(c => c.id === b.dataset.card)));
  if ($("#post")) $("#post").onclick = () => test("post");

  try {
    const rows = await store.league(cfg.studyStart); // total over the whole study
    $("#league").innerHTML = rows.length ? leagueTable(rows) : t("noLeague");
  } catch (e) { $("#league").textContent = t("saveError"); }
}
function leagueTable(rows) {
  return `<ol class="league">${rows.map((r, i) => `<li class="${r.me ? "me" : ""}"><span><span class="rank">${i + 1}</span>${esc(r.name)}${r.me ? ` (${t("you")})` : ""}<small class="muted"> · ${t("cardsPlayed", { n: r.cards })}</small></span><b>${r.points} ${t("points")}</b></li>`).join("")}</ol>`;
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
    <div id="hint-row"><p class="hint" id="hint">${t("tapHint")}</p><button class="link" id="basics">${t("basicsLink")}</button></div>
    <div class="info" id="info" role="region" aria-live="polite" hidden></div>
    <p class="q">${t("question", { y: card.years })}</p>
    <div class="choice"><button id="yes">${t("yes")}</button><button id="no">${t("no")}</button></div>
    <div class="conf"><label for="cf">${t("howSure")} <output id="cfo">70 %</output></label>
      <input id="cf" type="range" min="50" max="100" step="10" value="70"></div>
    <div class="err" id="err" hidden></div>
    <button class="primary" id="go" disabled>${t("fastForward", { y: card.years })}</button></section>`;

  const closeInfo = () => {
    $("#info").hidden = true; $("#hint-row").hidden = false;
    stage().querySelectorAll(".clue").forEach(x => x.setAttribute("aria-expanded", "false"));
  };
  const openInfo = (k, chip) => {
    stage().querySelectorAll(".clue").forEach(x => x.setAttribute("aria-expanded", "false"));
    if (chip) chip.setAttribute("aria-expanded", "true");
    $("#info").innerHTML = infoBox(card, k);
    $("#info").hidden = false; $("#hint-row").hidden = true;
    $("#info-close").onclick = () => { closeInfo(); (chip || $("#basics")).focus(); };
    store.log("explain", card.id, { fig: k });
  };
  stage().querySelectorAll(".clue").forEach(b => b.onclick = () =>
    b.getAttribute("aria-expanded") === "true" ? closeInfo() : openInfo(b.dataset.k, b));
  $("#basics").onclick = () => openInfo("basics", null);
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
function bucket(k, v) {
  if (k === "pe") return v < 12 ? "low" : v < 25 ? "mid" : v < 50 ? "high" : "vhigh";
  if (k === "growth") return v < 0 ? "neg" : v < 5 ? "low" : v < 12 ? "mid" : v < 25 ? "fast" : "vfast";
  return v === 0 ? "none" : v < 1 ? "low" : v < 3 ? "mid" : v < 5 ? "high" : "vhigh";
}
function figureValue(card, k) {
  const f = card.figures || {}, v = f[k], approx = (f.approx || []).includes(k);
  if (v != null) {
    const val = k === "pe" ? (approx ? "≈" : "") + num(v, 0)
      : k === "growth" ? (v > 0 ? "+" : v < 0 ? "−" : "") + num(Math.abs(v), 0) + " %"
      : v === 0 ? t("noDebt") : num(v, 1) + " " + t("unit.years");
    const shown = k === "growth" ? num(Math.abs(v), 0) : num(v, k === "pe" ? 0 : 1);
    return { val, sub: v === 0 && k === "debt" ? "" : t("unit." + k), meaning: t("meaning." + k + "." + bucket(k, v), { v: shown }),
             remark: L(f[k + "_remark"]), approx };
  }
  // no meaningful number (a bank's debt, a loss-making year): show a plain word and explain why
  return { val: L(card.clues?.[k]) || "–", sub: "", meaning: L(f[k + "_note"]), remark: "", approx: false };
}
function figure(card, k) {
  const { val, sub } = figureValue(card, k);
  return `<button class="clue" data-k="${k}" aria-expanded="false"><small>${t("fig." + k)}<span class="i" aria-hidden="true">i</span></small><span>${esc(val)}</span>${sub ? `<em>${esc(sub)}</em>` : ""}</button>`;
}
function infoBox(card, k) {
  const inf = STRINGS[lang].info[k];
  let mine = "";
  if (k !== "basics") {
    const { val, sub, meaning, remark, approx } = figureValue(card, k);
    mine = `<div class="info-this"><small>${t("infoThis")}</small><b>${esc(val)}</b>${sub ? ` <span class="muted">${esc(sub)}</span>` : ""}
      ${meaning ? `<p>${esc(meaning)}</p>` : ""}${remark ? `<p class="muted">${esc(remark)}</p>` : ""}${approx ? `<p class="muted">${t("approx")}</p>` : ""}
      <p class="muted">${t("figsFrom", { fy: card.figures?.fy })}</p></div>`;
  }
  return `<div class="info-head"><div><b>${esc(inf.title)}</b><div class="muted">${esc(inf.tag)}</div></div><button class="link" id="info-close">${t("infoClose")} ✕</button></div>
    ${mine}${inf.sections.map(([h, p]) => `<h4>${esc(h)}</h4><p>${esc(p)}</p>`).join("")}`;
}

// ---------- reveal ----------
function reveal(card) { show(() => renderReveal(card)); }
function renderReveal(card) {
  const a = st.answers[card.id], beat = card.stock > card.index, ok = a.guess_beat === beat, t0 = Date.now();
  stage().innerHTML = `<section class="card">
    <div class="eyebrow"><span>${esc(L(card.market))}</span><span>${esc(L(card.when))} → ${t("plusYears", { y: card.years })}</span></div>
    <div class="reveal-name">${esc(card.name)}</div>
    ${chartHtml(card, beat) || barsHtml(card, beat)}
    ${card.approx ? `<small class="muted">${t("approx")}</small>` : ""}
    <div class="verdict ${ok ? "good" : "bad"}">${ok ? t("right") : t("wrong")}, ${a.confidence} % ${t("sure")} · ${a.points > 0 ? "+" : ""}${a.points} ${t("pointsWord")}</div>
    <p class="muted small">${t("scoreHint")}</p>
    <p>${esc(L(card.story))}</p>
    <div class="lesson"><b>${esc(L(card.lesson.title))}</b>${esc(L(card.lesson.text))}</div>
    ${sourcesHtml(card)}
    <button class="ghost" id="rec" ${a.recognised ? "disabled" : ""}>${a.recognised ? t("recognisedNoted") : t("recognised")}</button>
    <button class="primary" id="next">${t("next")}</button></section>`;
  animateReveal();
  $("#rec").onclick = async () => {
    $("#rec").disabled = true; $("#rec").textContent = t("recognisedNoted");
    a.recognised = true; store.setRecognised(card.id).catch(() => {});
  };
  $("#next").onclick = () => { store.log("reveal_time", card.id, { ms: Date.now() - t0 }); micro(card); };
}

// Sources are shown only after the reveal, since the links would give the company away
function sourcesHtml(card) {
  const src = card.figures?.src || []; if (!src.length) return "";
  return `<details class="sources"><summary>${t("sourcesTitle")}</summary><ul>${src.map(u => `<li><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(new URL(u).hostname)}</a></li>`).join("")}</ul><p class="muted">${t("sourcesNote")}</p></details>`;
}
function barsHtml(card, beat) {
  return `<div class="bars">
      <div class="bar"><span>${t("stock")}</span><div class="track"><div class="fill" data-w="${barW(card.stock)}" style="background:var(${beat ? "--up" : "--down"})"></div></div><span class="num">${mult(card.stock)}</span></div>
      <div class="bar"><span>${t("indexFund")}</span><div class="track"><div class="fill" data-w="${barW(card.index)}" style="background:var(--idx)"></div></div><span class="num">${mult(card.index)}</span></div>
    </div>`;
}
const barW = x => Math.max(4, Math.min(100, Math.log(x * 3) / Math.log(17 * 3) * 100)).toFixed(1);

// Stock vs index fund over the five years, both as total-return multiples starting at ×1, on a log axis
// so a ×14 winner and a ×1.5 index fund can share one chart (equal distances mean equal percentage changes).
function chartHtml(card, beat) {
  const sr = SERIES[card.id]; if (!sr) return "";
  const W = 480, H = 230, m = { l: 44, r: 58, t: 14, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
  const all = [...sr.stock, ...sr.index];
  const lo = Math.min(...all, 1) / 1.12, hi = Math.max(...all, 1) * 1.12;
  const y = v => m.t + ih * (1 - (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)));
  const n = sr.stock.length, x = i => m.l + iw * i / (n - 1);
  const path = a => a.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join("");
  const ticks = [0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10, 20].filter(v => v >= lo && v <= hi);
  const keep = ticks.length > 6 ? ticks.filter((v, i) => v === 1 || i % 2 === 0) : ticks;
  const y0 = +sr.start.slice(0, 4), years = Array.from({ length: card.years + 1 }, (_, k) => k);
  const endS = card.stock, endI = card.index;
  let ly = [y(endS), y(endI)];                       // keep the two end labels from overlapping
  if (Math.abs(ly[0] - ly[1]) < 15) { const mid = (ly[0] + ly[1]) / 2, up = ly[0] < ly[1]; ly = up ? [mid - 8, mid + 8] : [mid + 8, mid - 8]; }
  const colS = beat ? "var(--up)" : "var(--down)";
  return `<figure class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("chartAria", { s: mult(endS), i: mult(endI) }))}">
      ${keep.map(v => `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="${v === 1 ? "g1" : "g"}"/>
        <text x="${m.l - 6}" y="${(y(v) + 4).toFixed(1)}" class="ax" text-anchor="end">×${num(v, 2)}</text>`).join("")}
      ${years.map(k => `<text x="${(m.l + iw * k / card.years).toFixed(1)}" y="${H - 6}" class="ax" text-anchor="${k === 0 ? "start" : k === card.years ? "end" : "middle"}">${y0 + k}</text>`).join("")}
      <path d="${path(sr.index)}" class="ln" stroke="var(--idx)" data-draw/>
      <path d="${path(sr.stock)}" class="ln" stroke="${colS}" data-draw/>
      <circle cx="${x(n - 1)}" cy="${y(endI).toFixed(1)}" r="3.5" fill="var(--idx)" class="dot"/>
      <circle cx="${x(n - 1)}" cy="${y(endS).toFixed(1)}" r="3.5" fill="${colS}" class="dot"/>
      <text x="${W - m.r + 8}" y="${(ly[1] + 4).toFixed(1)}" class="end" fill="var(--idx)">${mult(endI)}</text>
      <text x="${W - m.r + 8}" y="${(ly[0] + 4).toFixed(1)}" class="end" fill="${colS}">${mult(endS)}</text>
    </svg>
    <figcaption><span><i class="sw" style="background:${colS}"></i>${t("stock")} ${mult(endS)}</span><span><i class="sw" style="background:var(--idx)"></i>${t("indexFund")} ${mult(endI)}</span></figcaption></figure>`;
}
// Draws the lines left to right (the "fast-forward"); also fills the fallback bars
function animateReveal() {
  const paths = [...stage().querySelectorAll("[data-draw]")], bars = [...stage().querySelectorAll(".fill")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  paths.forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = reduce ? 0 : len; p.getBoundingClientRect(); });
  stage().querySelectorAll(".dot, .end").forEach(e => { e.style.opacity = reduce ? 1 : 0; });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    paths.forEach(p => { p.style.transition = reduce ? "none" : "stroke-dashoffset 2.4s cubic-bezier(.3,.6,.2,1)"; p.style.strokeDashoffset = 0; });
    stage().querySelectorAll(".dot, .end").forEach(e => { e.style.transition = reduce ? "none" : "opacity .4s 2.2s"; e.style.opacity = 1; });
    bars.forEach(b => { b.style.width = b.dataset.w + "%"; });
  }));
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
    ${TEST.map((q, qi) => `<div class="qbox" role="radiogroup" aria-label="${qi + 1}"><p class="q">${qi + 1}. ${esc(L(q.q))}</p>${q.options.map((o, i) =>
      `<label class="opt"><input type="radio" name="${q.id}" value="${i}"> ${esc(L(o))}</label>`).join("")}</div>`).join("")}
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
