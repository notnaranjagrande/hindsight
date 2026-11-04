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
    basicsLink: "Ny på det här? Vad är en aktie och ett index?",
    infoThis: "Det här bolaget",
    infoClose: "Stäng",
    infoPrelim: "Det här är en grov bedömning, inte en exakt siffra.",
    info: {
      "pe": {
        "title": "P/E",
        "tag": "Hur dyr är aktien jämfört med vad bolaget tjänar?",
        "sections": [
          [
            "Kort sagt",
            "P/E visar hur många år av bolagets nuvarande vinst du betalar när du köper det. Vinst är pengarna som blir över när alla kostnader är betalda."
          ],
          [
            "Exempel",
            "Du köper ett kafé som tjänar 100 000 kr om året. Kostar kaféet 1 miljon kr är P/E 10, du betalar tio års vinst. Kostar det 4 miljoner är P/E 40."
          ],
          [
            "Varför spelar det roll?",
            "Du betalar bara mer för något om du tror att det blir mer värt. Högt P/E betyder därför att många tror att bolaget kommer att tjäna mycket mer i framtiden. Lågt P/E betyder att man väntar sig lite tillväxt, eller är orolig för något."
          ],
          [
            "Tänk på",
            "Högt är inte dåligt och lågt är inte bra. Ett dyrt bolag kan vara värt sitt pris, och ett billigt kan vara billigt av en anledning."
          ]
        ]
      },
      "growth": {
        "title": "Omsättningstillväxt",
        "tag": "Hur snabbt växer bolaget?",
        "sections": [
          [
            "Kort sagt",
            "Visar hur mycket mer bolaget sålde det senaste året jämfört med året före. Omsättning är allt kunderna betalar bolaget, innan kostnaderna dras av."
          ],
          [
            "Exempel",
            "Ett bageri sålde bröd för 1 miljon kr förra året och 1,3 miljoner i år. Då har försäljningen vuxit med 30 %. Sålde det för 1,02 miljoner är tillväxten bara 2 %."
          ],
          [
            "Varför spelar det roll?",
            "Ett bolag som säljer mer och mer får oftast större vinster med tiden, och då blir aktien mer värd. Därför tittar många på tillväxt."
          ],
          [
            "Tänk på",
            "Snabb tillväxt är ingen garanti. Om priset redan räknar med mycket snabb tillväxt (högt P/E) kan aktien falla även om bolaget växer, bara tillväxten blir lite lägre än man hoppats."
          ]
        ]
      },
      "debt": {
        "title": "Nettoskuld/EBITDA",
        "tag": "Hur mycket har bolaget lånat?",
        "sections": [
          [
            "Kort sagt",
            "Visar hur många års vinst bolaget skulle behöva för att betala tillbaka alla sina lån. Netto betyder att man först drar bort pengarna bolaget redan har på kontot. EBITDA är ungefär vad själva verksamheten tjänar på ett år."
          ],
          [
            "Exempel",
            "Ett bolag tjänar 100 000 kr om året men har lånat 600 000 kr. Det skulle ta sex års hela vinst att betala tillbaka, så talet blir 6."
          ],
          [
            "Varför spelar det roll?",
            "Lån kan hjälpa ett bolag att växa snabbare. Men lånen måste betalas, även när det går dåligt. Ju högre tal, desto mindre marginal om något går fel."
          ],
          [
            "Tänk på",
            "Under 2 är lågt, 3–4 är högt och över 5 är riskabelt. Banker har alltid höga tal eftersom att låna pengar är deras affär, så jämför dem inte med andra bolag."
          ]
        ]
      },
      "basics": {
        "title": "Så funkar spelet",
        "tag": "Fyra ord som är bra att kunna",
        "sections": [
          [
            "Aktie",
            "En aktie är en liten bit av ett företag. Äger du en aktie äger du en liten del av bolaget, och priset går upp och ner efter vad folk tror att bolaget är värt."
          ],
          [
            "Index och indexfond",
            "Ett index är en korg med många bolag, till exempel de 500 största i USA. En indexfond följer korgen, så du äger lite av alla bolag på en gång. Det är det enklaste alternativet till att välja ut enskilda aktier."
          ],
          [
            "Att slå index",
            "Att slå index betyder att den här aktien gav mer pengar än om du hade köpt indexfonden i stället. Det är jämförelsen som räknas, inte om aktien gick upp."
          ],
          [
            "Hur säker är du?",
            "50 % betyder att du gissar. 100 % betyder att du är helt säker. Säkra rätta svar ger mest poäng, men säkra fel kostar mest. Det här handlar om att lära sig hur säker man egentligen borde vara."
          ]
        ]
      }
    },
    means: {
      "pe": {
        "Dyr": "Dyr: du betalar mycket för varje krona bolaget tjänar. Marknaden väntar sig stark tillväxt.",
        "Extremt dyr": "Extremt dyr: du betalar väldigt mycket för bolagets vinst, eller så går bolaget knappt med vinst alls. Priset bygger på att det växer enormt.",
        "Medel": "Medel: ett vanligt pris för vinsten. Marknaden väntar sig varken en rusning eller ett ras.",
        "Billig": "Billig: du betalar lite för varje krona bolaget tjänar. Marknaden väntar sig lite tillväxt, eller oroar sig för något."
      },
      "growth": {
        "Mycket snabb": "Mycket snabb: försäljningen ökar mycket fortare än hos de flesta bolag.",
        "Stabil": "Stabil: försäljningen ökar jämnt och lugnt, utan stora hopp.",
        "Låg": "Låg: försäljningen ökar knappt.",
        "Avtagande": "Avtagande: bolaget växer fortfarande, men långsammare än förut."
      },
      "debt": {
        "Ingen": "Ingen: bolaget har inga lån att oroa sig för.",
        "Låg": "Låg: lånen är små jämfört med vad bolaget tjänar.",
        "Måttlig": "Måttlig: bolaget har lån men kan betala dem i lugn och ro.",
        "Hög": "Hög: lånen är stora jämfört med vad bolaget tjänar. Går det dåligt blir det svårt.",
        "Extremt hög": "Extremt hög: lånen är enorma jämfört med vad bolaget tjänar. Ett litet bakslag kan bli farligt.",
        "Stigande": "Stigande: bolaget lånar mer och mer för att växa.",
        "Bank (hög per definition)": "Bank: banker lånar pengar för att kunna låna ut dem, så talet är alltid högt. Det säger lite om risken."
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
    basicsLink: "New to this? What is a stock and an index?",
    infoThis: "This company",
    infoClose: "Close",
    infoPrelim: "This is a rough rating, not an exact figure.",
    info: {
      "pe": {
        "title": "P/E",
        "tag": "How expensive is the stock compared with what the company earns?",
        "sections": [
          [
            "In short",
            "P/E shows how many years of the company's current profit you pay when you buy it. Profit is the money left over after all costs are paid."
          ],
          [
            "Example",
            "You buy a café that earns 100,000 a year. If the café costs 1 million, the P/E is 10: you pay ten years of profit. If it costs 4 million, the P/E is 40."
          ],
          [
            "Why does it matter?",
            "You only pay more for something if you think it will be worth more. So a high P/E means many people believe the company will earn much more in the future. A low P/E means people expect little growth, or are worried about something."
          ],
          [
            "Keep in mind",
            "High is not bad and low is not good. An expensive company can be worth its price, and a cheap one can be cheap for a reason."
          ]
        ]
      },
      "growth": {
        "title": "Revenue growth",
        "tag": "How fast is the company growing?",
        "sections": [
          [
            "In short",
            "Shows how much more the company sold over the last year compared with the year before. Revenue is everything customers pay the company, before costs are taken off."
          ],
          [
            "Example",
            "A bakery sold bread for 1 million last year and 1.3 million this year. Its sales have grown by 30 %. If it sold 1.02 million, growth is only 2 %."
          ],
          [
            "Why does it matter?",
            "A company that sells more and more usually earns bigger profits over time, which makes the stock worth more. That is why many people look at growth."
          ],
          [
            "Keep in mind",
            "Fast growth is no guarantee. If the price already counts on very fast growth (a high P/E), the stock can fall even while the company grows, as long as growth is a bit lower than hoped."
          ]
        ]
      },
      "debt": {
        "title": "Net debt/EBITDA",
        "tag": "How much has the company borrowed?",
        "sections": [
          [
            "In short",
            "Shows how many years of profit the company would need to pay back all its loans. Net means the money the company already has in the bank is subtracted first. EBITDA is roughly what the business itself earns in a year."
          ],
          [
            "Example",
            "A company earns 100,000 a year but has borrowed 600,000. It would take six years of all its profit to pay back, so the number is 6."
          ],
          [
            "Why does it matter?",
            "Loans can help a company grow faster. But loans must be paid back even when things go badly. The higher the number, the less room there is if something goes wrong."
          ],
          [
            "Keep in mind",
            "Under 2 is low, 3–4 is high and above 5 is risky. Banks always have high numbers because borrowing money is their business, so don't compare them with other companies."
          ]
        ]
      },
      "basics": {
        "title": "How the game works",
        "tag": "Four words worth knowing",
        "sections": [
          [
            "Stock",
            "A stock is a small piece of a company. If you own one, you own a tiny part of the company, and the price moves up and down with what people think the company is worth."
          ],
          [
            "Index and index fund",
            "An index is a basket of many companies, for example the 500 biggest in the US. An index fund follows the basket, so you own a little of every company at once. It is the simplest alternative to picking single stocks."
          ],
          [
            "Beating the index",
            "Beating the index means this stock made more money than if you had bought the index fund instead. The comparison is what counts, not whether the stock went up."
          ],
          [
            "How sure are you?",
            "50 % means you are guessing. 100 % means you are completely sure. Confident right answers score the most, but confident wrong ones cost the most. The point is to learn how sure you should really be."
          ]
        ]
      }
    },
    means: {
      "pe": {
        "Dyr": "Expensive: you pay a lot for each bit of profit the company makes. The market expects strong growth.",
        "Extremt dyr": "Extremely expensive: you pay a huge amount for the company's profit, or it barely makes a profit at all. The price depends on it growing enormously.",
        "Medel": "Medium: an ordinary price for the profit. The market expects neither a surge nor a crash.",
        "Billig": "Cheap: you pay little for each bit of profit. The market expects little growth, or is worried about something."
      },
      "growth": {
        "Mycket snabb": "Very fast: sales are growing much faster than at most companies.",
        "Stabil": "Steady: sales grow evenly and calmly, without big jumps.",
        "Låg": "Low: sales are barely growing.",
        "Avtagande": "Slowing: the company is still growing, but more slowly than before."
      },
      "debt": {
        "Ingen": "None: the company has no loans to worry about.",
        "Låg": "Low: the loans are small compared with what the company earns.",
        "Måttlig": "Moderate: the company has loans but can pay them comfortably.",
        "Hög": "High: the loans are large compared with what the company earns. If things go badly it gets hard.",
        "Extremt hög": "Extremely high: the loans are enormous compared with what the company earns. A small setback can become dangerous.",
        "Stigande": "Rising: the company borrows more and more to grow.",
        "Bank (hög per definition)": "Bank: banks borrow money in order to lend it out, so the number is always high. It says little about risk."
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
