const STRINGS = {
  sv: {
    switchLang: "English",
    loading: "Laddar …",
    noCode: "Länken saknar spelarkod. Använd den personliga länken du fick av Ivar.",
    unknownCode: "Hittar ingen spelare med den här koden. Kolla att du använder hela länken.",
    demo: "Demoläge: svaren sparas bara i den här webbläsaren.",
    hello: "Hej {name}",
    dayOf: "Dag {d} av {n}",
    beforeStart: "Studien startar {date}. Då låses första kortet upp.",
    playToday: "Spela dagens kort",
    doneToday: "Klart för idag. Nytt kort i morgon.",
    allDone: "Alla kort är spelade. Tack!",
    missed: "Missade kort",
    play: "Spela",
    league: "Veckans liga",
    points: "p",
    you: "du",
    noLeague: "Ingen har spelat den här veckan än.",
    asOf: "Läge: {when}",
    plusYears: "+{y} år",
    question: "Slår aktien index de kommande {y} åren?",
    yes: "Ja, slår index",
    no: "Nej",
    howSure: "Hur säker är du?",
    fastForward: "Spola fram {y} år",
    tapHint: "Tryck på ett nyckeltal för att få det förklarat.",
    indexAvg: "index {v}",
    preliminary: "prel.",
    stock: "Aktien",
    indexFund: "Indexfonden",
    approx: "Ungefärlig siffra.",
    right: "Rätt",
    wrong: "Fel",
    sure: "säker",
    pointsWord: "poäng",
    recognised: "Jag visste vilket bolag det var innan avslöjandet",
    recognisedNoted: "Noterat. Det här svaret räknas inte i din kalibrering.",
    next: "Fortsätt",
    microTitle: "Dagens begreppsfråga",
    correct: "Rätt!",
    incorrect: "Inte riktigt.",
    othersTitle: "Så gissade de andra",
    noOthers: "Ingen annan har spelat det här kortet än.",
    guessYes: "Ja",
    guessNo: "Nej",
    home: "Till start",
    preTitle: "Innan du börjar: 10 snabba frågor",
    postTitle: "Eftertest: samma 10 frågor",
    testIntro: "Det här är inget prov. Det visar bara vad spelet lär ut. Välj \"Vet inte\" hellre än att gissa.",
    submit: "Skicka",
    answerAll: "Svara på alla frågor först.",
    postCta: "Gör eftertestet",
    thanks: "Tack! Dina svar är sparade.",
    disclaimer: "Inget här är investeringsråd. Jämför alltid med en indexfond.",
    saveError: "Kunde inte spara. Kolla nätet och försök igen.",
    fig: { pe: "P/E", growth: "Omsättningstillväxt", debt: "Nettoskuld/EBITDA" },
    infoWhat: "Vad det är",
    infoRead: "Så läser du det",
    infoExample: "Exempel",
    infoThis: "Det här bolaget",
    infoPrelim: "Förhandsbetyg, exakt siffra kommer.",
    infoClose: "Stäng",
    chartAria: "Graf över aktien och indexfonden. Aktien slutade på {s}, indexfonden på {i}, där 1 är startvärdet.",
    breakEven: "Börjar på ×1",
    info: {
      pe: {
        what: "P/E visar hur många gånger årsvinsten du betalar för en aktie. P/E 20 betyder att aktien kostar 20 gånger vinsten per aktie.",
        read: "Högt P/E: marknaden väntar sig att vinsten ska växa snabbt. Lågt P/E: den väntar sig lite tillväxt, eller oroar sig för något. Varken högt eller lågt är rätt eller fel i sig. Frågan är om förväntningarna håller.",
        example: "Bolag A tjänar 10 kr per aktie och kostar 100 kr (P/E 10). Bolag B tjänar också 10 kr men kostar 400 kr (P/E 40). Ingen betalar fyra gånger mer utan att tro att B växer mycket snabbare."
      },
      growth: {
        what: "Hur mycket bolagets försäljning ökade det senaste året, i procent.",
        read: "Jämför med indexsnittet. Över snittet: bolaget växer snabbare än ett typiskt bolag. Men snabb tillväxt kan redan vara inräknad i priset (se P/E), och om tillväxten avtar kan aktien falla även när bolaget fortfarande växer.",
        example: "Försäljningen går från 100 till 130 miljoner. Det är +30 %."
      },
      debt: {
        what: "Nettoskuld/EBITDA är lån minus kassa, delat med rörelseresultatet före avskrivningar. Svaret är hur många års resultat det skulle ta att betala skulden.",
        read: "Under 2 är låg. 3–4 är hög. Över 5 är farligt om resultatet faller. Banker har alltid hög skuld, det är deras affär, så jämför dem inte med andra bolag.",
        example: "Skulden är 600 miljoner och resultatet 100 miljoner per år. Då är kvoten 6, alltså sex års resultat."
      }
    }
  },
  en: {
    switchLang: "Svenska",
    loading: "Loading …",
    noCode: "This link has no player code. Use the personal link Ivar sent you.",
    unknownCode: "No player found with this code. Check that you used the whole link.",
    demo: "Demo mode: answers are saved only in this browser.",
    hello: "Hi {name}",
    dayOf: "Day {d} of {n}",
    beforeStart: "The study starts on {date}. The first card unlocks then.",
    playToday: "Play today's card",
    doneToday: "Done for today. New card tomorrow.",
    allDone: "All cards played. Thank you!",
    missed: "Missed cards",
    play: "Play",
    league: "This week's league",
    points: "pts",
    you: "you",
    noLeague: "Nobody has played this week yet.",
    asOf: "As of {when}",
    plusYears: "+{y} years",
    question: "Will this stock beat the index over the next {y} years?",
    yes: "Yes, beats the index",
    no: "No",
    howSure: "How sure are you?",
    fastForward: "Fast-forward {y} years",
    tapHint: "Tap a figure to have it explained.",
    indexAvg: "index {v}",
    preliminary: "prelim.",
    stock: "Stock",
    indexFund: "Index fund",
    approx: "Approximate figure.",
    right: "Right",
    wrong: "Wrong",
    sure: "sure",
    pointsWord: "points",
    recognised: "I knew which company it was before the reveal",
    recognisedNoted: "Noted. This answer won't count towards your calibration.",
    next: "Continue",
    microTitle: "Today's concept question",
    correct: "Correct!",
    incorrect: "Not quite.",
    othersTitle: "How the others guessed",
    noOthers: "Nobody else has played this card yet.",
    guessYes: "Yes",
    guessNo: "No",
    home: "Back to start",
    preTitle: "Before you start: 10 quick questions",
    postTitle: "After-test: the same 10 questions",
    testIntro: "This is not an exam. It only shows what the game teaches. Pick \"Don't know\" rather than guessing.",
    submit: "Submit",
    answerAll: "Answer every question first.",
    postCta: "Take the after-test",
    thanks: "Thanks! Your answers are saved.",
    disclaimer: "Nothing here is investment advice. Always compare with an index fund.",
    saveError: "Couldn't save. Check your connection and try again.",
    fig: { pe: "P/E", growth: "Revenue growth", debt: "Net debt/EBITDA" },
    infoWhat: "What it is",
    infoRead: "How to read it",
    infoExample: "Example",
    infoThis: "This company",
    infoPrelim: "Rough rating, exact figure coming.",
    infoClose: "Close",
    chartAria: "Chart of the stock and the index fund. The stock ended at {s}, the index fund at {i}, where 1 is the starting value.",
    breakEven: "Starts at ×1",
    info: {
      pe: {
        what: "P/E shows how many times the yearly profit you pay for a share. A P/E of 20 means the share costs 20 times the profit per share.",
        read: "High P/E: the market expects profits to grow fast. Low P/E: it expects little growth, or is worried about something. Neither is right or wrong by itself. The question is whether the expectations hold.",
        example: "Company A earns 10 kr per share and costs 100 kr (P/E 10). Company B also earns 10 kr but costs 400 kr (P/E 40). Nobody pays four times as much unless they believe B will grow much faster."
      },
      growth: {
        what: "How much the company's sales grew over the last year, in percent.",
        read: "Compare with the index average. Above it: the company grows faster than a typical company. But fast growth may already be built into the price (see P/E), and if growth slows the stock can fall even while the company is still growing.",
        example: "Sales go from 100 to 130 million. That is +30 %."
      },
      debt: {
        what: "Net debt/EBITDA is loans minus cash, divided by operating profit before depreciation. The answer is how many years of profit it would take to pay off the debt.",
        read: "Under 2 is low. 3–4 is high. Above 5 is dangerous if profits fall. Banks always have high debt, that is their business, so don't compare them with other companies.",
        example: "Debt is 600 million and profit is 100 million a year. The ratio is 6, six years of profit."
      }
    }
  }
};

let lang = (() => { try { return localStorage.getItem("hindsight-lang") || "sv"; } catch (e) { return "sv"; } })();

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  try { localStorage.setItem("hindsight-lang", l); } catch (e) {}
}

// t("hello", {name}) for UI strings; L(obj) for bilingual content from cards.json / test.json
function t(key, vars = {}) {
  const s = key.split(".").reduce((o, k) => o && o[k], STRINGS[lang]) ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
function L(obj) { return obj ? (obj[lang] ?? obj.sv) : ""; }
