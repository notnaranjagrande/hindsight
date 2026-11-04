const STRINGS = {
  "sv": {
    "switchLang": "English",
    "loading": "Laddar …",
    "noCode": "Länken saknar spelarkod. Använd den personliga länken du fick av Ivar.",
    "unknownCode": "Hittar ingen spelare med den här koden. Kolla att du använder hela länken.",
    "demo": "Demoläge: svaren sparas bara i den här webbläsaren.",
    "hello": "Hej {name}",
    "dayOf": "Dag {d} av {n}",
    "beforeStart": "Studien startar {date}. Då låses första kortet upp.",
    "playToday": "Spela dagens kort",
    "doneToday": "Klart för idag. Nytt kort i morgon.",
    "allDone": "Alla kort är spelade. Tack!",
    "missed": "Missade kort",
    "play": "Spela",
    "league": "Totalställning",
    "points": "p",
    "cardsPlayed": "{n} kort",
    "you": "du",
    "noLeague": "Ingen har spelat än.",
    "asOf": "Läge: {when}",
    "plusYears": "+{y} år",
    "question": "Slår aktien index de kommande {y} åren?",
    "yes": "Ja, slår index",
    "no": "Nej",
    "howSure": "Hur säker är du?",
    "fastForward": "Spola fram {y} år",
    "tapHint": "Tryck på en ruta ovan för att få den förklarad.",
    "indexAvg": "index {v}",
    "stock": "Aktien",
    "indexFund": "Indexfonden",
    "right": "Rätt",
    "wrong": "Fel",
    "sure": "säker",
    "pointsWord": "poäng",
    "recognised": "Jag visste vilket bolag det var innan avslöjandet",
    "recognisedNoted": "Noterat. Det här svaret räknas inte i din kalibrering.",
    "next": "Fortsätt",
    "microTitle": "Dagens begreppsfråga",
    "correct": "Rätt!",
    "incorrect": "Inte riktigt.",
    "othersTitle": "Så gissade de andra",
    "noOthers": "Ingen annan har spelat det här kortet än.",
    "guessYes": "Ja",
    "guessNo": "Nej",
    "home": "Till start",
    "preTitle": "Innan du börjar: 10 korta frågor",
    "postTitle": "Eftertest: samma 10 frågor",
    "testIntro": "Det här är inget prov, och du förväntas inte kunna svaren. Välj \"Vet inte\" hellre än att gissa. De flesta gör det i början, och det är hela poängen: vi frågar samma frågor när du spelat klart för att se vad du har lärt dig.",
    "submit": "Skicka",
    "answerAll": "Svara på alla frågor först.",
    "postCta": "Gör eftertestet",
    "thanks": "Tack! Dina svar är sparade.",
    "disclaimer": "Inget här är investeringsråd. Jämför alltid med en indexfond.",
    "saveError": "Kunde inte spara. Kolla nätet och försök igen.",
    "fig": {
      "pe": "Pris per vinst (P/E)",
      "growth": "Ökad försäljning",
      "debt": "Lån jämfört med vinst"
    },
    "basicsLink": "Ny på det här? Vad är en aktie och ett index?",
    "infoThis": "Det här bolaget",
    "infoClose": "Stäng",
    "info": {
      "pe": {
        "title": "Pris per vinst (P/E)",
        "tag": "Hur dyr är aktien jämfört med vad bolaget tjänar?",
        "sections": [
          [
            "Kort sagt",
            "Visar hur många år av bolagets nuvarande vinst du betalar när du köper det. Vinst är pengarna som blir över när alla kostnader är betalda."
          ],
          [
            "Exempel",
            "Du köper ett kafé som tjänar 100 000 kr om året. Kostar kaféet 1 miljon kr är talet 10: du betalar tio års vinst. Kostar det 4 miljoner är talet 40."
          ],
          [
            "Varför spelar det roll?",
            "Du betalar bara mer för något om du tror att det blir mer värt. Ett högt tal betyder därför att många tror att bolaget kommer att tjäna mycket mer i framtiden. Ett lågt tal betyder att man väntar sig lite tillväxt, eller är orolig för något."
          ],
          [
            "Tänk på",
            "Högt är inte dåligt och lågt är inte bra. Ett dyrt bolag kan vara värt sitt pris, och ett billigt kan vara billigt av en anledning."
          ],
          [
            "Vad det heter",
            "P/E står för \"price/earnings\", alltså pris delat med vinst. Det är den vanligaste siffran när man jämför aktier."
          ]
        ]
      },
      "growth": {
        "title": "Ökad försäljning",
        "tag": "Hur snabbt växer bolaget?",
        "sections": [
          [
            "Kort sagt",
            "Visar hur mycket mer bolaget sålde det senaste året jämfört med året före, i procent."
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
            "Snabb tillväxt är ingen garanti. Om priset redan räknar med mycket snabb tillväxt kan aktien falla även om bolaget växer, bara tillväxten blir lite lägre än man hoppats."
          ],
          [
            "Vad det heter",
            "I rapporter kallas det omsättningstillväxt. Omsättning är allt kunderna betalar bolaget, innan kostnaderna dras av."
          ]
        ]
      },
      "debt": {
        "title": "Lån jämfört med vinst",
        "tag": "Hur mycket har bolaget lånat?",
        "sections": [
          [
            "Kort sagt",
            "Visar hur många års vinst bolaget skulle behöva för att betala tillbaka alla sina lån. Ju fler år, desto mer har bolaget lånat."
          ],
          [
            "Exempel",
            "Ett bolag tjänar 100 000 kr om året men har lånat 600 000 kr. Det skulle ta sex års hela vinst att betala tillbaka, så talet är 6."
          ],
          [
            "Varför spelar det roll?",
            "Lån kan hjälpa ett bolag att växa snabbare. Men lånen måste betalas, även när det går dåligt. Ju högre tal, desto mindre marginal om något går fel."
          ],
          [
            "Tänk på",
            "Under 2 år är lite, 3 till 4 år är mycket och över 5 år är riskabelt. Banker lånar alltid mycket, eftersom det är deras affär, så jämför dem inte med andra bolag."
          ],
          [
            "Vad det heter",
            "I rapporter kallas det skuld/EBITDA. EBITDA är ungefär vad själva verksamheten tjänar på ett år."
          ]
        ]
      },
      "basics": {
        "title": "Så funkar spelet",
        "tag": "Fem ord som är bra att kunna",
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
            "Utdelning",
            "Pengar som ett bolag ibland delar ut till sina ägare, ofta några gånger om året. Vi räknar alltid med dem när vi jämför."
          ],
          [
            "Hur säker är du?",
            "50 % betyder att du gissar. 100 % betyder att du är helt säker. Säkra rätta svar ger mest poäng, men säkra fel kostar mest. Det handlar om att lära sig hur säker man egentligen borde vara."
          ]
        ]
      }
    },
    "noDebt": "Inga lån",
    "unit": {
      "pe": "× årsvinsten",
      "growth": "på ett år",
      "debt": "av vinst",
      "years": "år"
    },
    "figsFrom": "Siffrorna gäller räkenskapsåret {fy}.",
    "approxWord": "ungefärlig",
    "sourcesTitle": "Källor till siffrorna",
    "sourcesNote": "Kursen kommer från Yahoo Finance. Nyckeltalen kommer från bolagens bokslut.",
    "scoreHint": "Ju säkrare du var, desto mer vinner eller förlorar du. 50 % säker ger alltid 0 poäng.",
    "introNext": "Nästa",
    "introStart": "Börja",
    "introBack": "Tillbaka",
    "showIntro": "Visa introduktionen igen",
    "meaning": {
      "pe": {
        "low": "Du betalar bara {v} gånger årsvinsten. Det är lite jämfört med de flesta bolag: marknaden väntar sig inte mycket tillväxt, eller är orolig för något.",
        "mid": "Du betalar {v} gånger årsvinsten. Det är ungefär vanligt.",
        "high": "Du betalar {v} gånger årsvinsten. Det är mycket: marknaden väntar sig att vinsten växer snabbt.",
        "vhigh": "Du betalar hela {v} gånger årsvinsten. Det är extremt mycket: priset bygger på att bolaget växer enormt."
      },
      "growth": {
        "neg": "Försäljningen minskade med {v} %.",
        "low": "Försäljningen ökade med {v} %. Det är ganska långsamt.",
        "mid": "Försäljningen ökade med {v} %. Det är en ganska normal takt.",
        "fast": "Försäljningen ökade med {v} %. Det är snabbt.",
        "vfast": "Försäljningen ökade med {v} %. Det är mycket snabbt."
      },
      "debt": {
        "none": "Bolaget hade inga lån.",
        "low": "Lånen motsvarar {v} års vinst. Det är små lån.",
        "mid": "Lånen motsvarar {v} års vinst. Det är måttliga lån.",
        "high": "Lånen motsvarar {v} års vinst. Det är stora lån.",
        "vhigh": "Lånen motsvarar {v} års vinst. Det är mycket stora lån."
      }
    },
    "intro": [
      {
        "title": "Välkommen!",
        "body": [
          "Du behöver inte kunna något om aktier. Det här är en lek där du lär dig på vägen.",
          "Varje dag får du ett riktigt bolag, som det såg ut för fem år sedan. Du gissar hur det gick. Sedan spolar vi fram fem år och visar facit. Det tar ungefär två minuter."
        ]
      },
      {
        "title": "Vad är en aktie?",
        "body": [
          "En aktie är en liten bit av ett företag. Äger du en aktie äger du en liten del av bolaget.",
          "Priset på aktien går upp och ner efter vad folk tror att bolaget är värt. Går det bra för bolaget stiger aktien ofta. Går det dåligt faller den."
        ]
      },
      {
        "title": "Vad är en indexfond?",
        "body": [
          "Ett index är som en korg med många bolag, till exempel de 500 största i USA. En indexfond följer korgen, så att du äger lite av alla bolag på en gång.",
          "Det är det enkla alternativet till att välja ut enskilda aktier. Därför jämför vi alltid med en indexfond."
        ]
      },
      {
        "title": "Vad gissar du?",
        "body": [
          "Varje dag frågar vi: kommer den här aktien att ge mer pengar än indexfonden de kommande fem åren? Ja eller nej.",
          "Det är en gissning, och det är okej att gissa fel. Även experter gissar ofta fel."
        ]
      },
      {
        "title": "Hur säker är du?",
        "body": [
          "Du anger också hur säker du är, från 50 % (jag gissar bara) till 100 % (helt säker).",
          "Säkra svar som blir rätt ger mest poäng. Säkra svar som blir fel kostar mest. Poängen visar hur väl din säkerhet stämmer med verkligheten.",
          "Inga pengar är inblandade, och inget här är investeringsråd."
        ]
      },
      {
        "title": "Innan du börjar",
        "body": [
          "Först kommer 10 korta frågor om ord du kommer att möta. Det är helt okej att svara \"Vet inte\". De flesta gör det, och det är poängen: vi frågar igen när du är klar, för att se vad du har lärt dig."
        ]
      }
    ],
    "approx": "Ungefärlig siffra."
  },
  "en": {
    "switchLang": "Svenska",
    "loading": "Loading …",
    "noCode": "This link has no player code. Use the personal link Ivar sent you.",
    "unknownCode": "No player found with this code. Check that you used the whole link.",
    "demo": "Demo mode: answers are saved only in this browser.",
    "hello": "Hi {name}",
    "dayOf": "Day {d} of {n}",
    "beforeStart": "The study starts on {date}. The first card unlocks then.",
    "playToday": "Play today's card",
    "doneToday": "Done for today. New card tomorrow.",
    "allDone": "All cards played. Thank you!",
    "missed": "Missed cards",
    "play": "Play",
    "league": "Total score",
    "points": "pts",
    "cardsPlayed": "{n} cards",
    "you": "you",
    "noLeague": "Nobody has played yet.",
    "asOf": "As of {when}",
    "plusYears": "+{y} years",
    "question": "Will this stock beat the index over the next {y} years?",
    "yes": "Yes, beats the index",
    "no": "No",
    "howSure": "How sure are you?",
    "fastForward": "Fast-forward {y} years",
    "tapHint": "Tap a box above to have it explained.",
    "indexAvg": "index {v}",
    "stock": "Stock",
    "indexFund": "Index fund",
    "right": "Right",
    "wrong": "Wrong",
    "sure": "sure",
    "pointsWord": "points",
    "recognised": "I knew which company it was before the reveal",
    "recognisedNoted": "Noted. This answer won't count towards your calibration.",
    "next": "Continue",
    "microTitle": "Today's concept question",
    "correct": "Correct!",
    "incorrect": "Not quite.",
    "othersTitle": "How the others guessed",
    "noOthers": "Nobody else has played this card yet.",
    "guessYes": "Yes",
    "guessNo": "No",
    "home": "Back to start",
    "preTitle": "Before you start: 10 quick questions",
    "postTitle": "After-test: the same 10 questions",
    "testIntro": "This is not an exam, and you are not expected to know the answers. Pick \"Don't know\" rather than guessing. Most people do at first, and that is the point: we ask the same questions when you've finished playing to see what you have learned.",
    "submit": "Submit",
    "answerAll": "Answer every question first.",
    "postCta": "Take the after-test",
    "thanks": "Thanks! Your answers are saved.",
    "disclaimer": "Nothing here is investment advice. Always compare with an index fund.",
    "saveError": "Couldn't save. Check your connection and try again.",
    "fig": {
      "pe": "Price per profit (P/E)",
      "growth": "Sales growth",
      "debt": "Debt vs profit"
    },
    "basicsLink": "New to this? What is a stock and an index?",
    "infoThis": "This company",
    "infoClose": "Close",
    "info": {
      "pe": {
        "title": "Price per profit (P/E)",
        "tag": "How expensive is the stock compared with what the company earns?",
        "sections": [
          [
            "In short",
            "Shows how many years of the company's current profit you pay when you buy it. Profit is the money left over after all costs are paid."
          ],
          [
            "Example",
            "You buy a café that earns 100,000 a year. If the café costs 1 million, the number is 10: you pay ten years of profit. If it costs 4 million, the number is 40."
          ],
          [
            "Why does it matter?",
            "You only pay more for something if you think it will be worth more. So a high number means many people believe the company will earn much more in the future. A low number means people expect little growth, or are worried about something."
          ],
          [
            "Keep in mind",
            "High is not bad and low is not good. An expensive company can be worth its price, and a cheap one can be cheap for a reason."
          ],
          [
            "What it's called",
            "P/E stands for \"price/earnings\", the price divided by the profit. It is the most common number for comparing stocks."
          ]
        ]
      },
      "growth": {
        "title": "Sales growth",
        "tag": "How fast is the company growing?",
        "sections": [
          [
            "In short",
            "Shows how much more the company sold over the last year compared with the year before, in percent."
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
            "Fast growth is no guarantee. If the price already counts on very fast growth, the stock can fall even while the company grows, as long as growth is a bit lower than hoped."
          ],
          [
            "What it's called",
            "In reports it is called revenue growth. Revenue is everything customers pay the company, before costs are taken off."
          ]
        ]
      },
      "debt": {
        "title": "Debt vs profit",
        "tag": "How much has the company borrowed?",
        "sections": [
          [
            "In short",
            "Shows how many years of profit the company would need to pay back all its loans. The more years, the more the company has borrowed."
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
            "Under 2 years is little, 3 to 4 years is a lot and above 5 years is risky. Banks always borrow a lot, because that is their business, so don't compare them with other companies."
          ],
          [
            "What it's called",
            "In reports it is called debt/EBITDA. EBITDA is roughly what the business itself earns in a year."
          ]
        ]
      },
      "basics": {
        "title": "How the game works",
        "tag": "Five words worth knowing",
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
            "Dividend",
            "Money a company sometimes pays out to its owners, often a few times a year. We always count it when we compare."
          ],
          [
            "How sure are you?",
            "50 % means you are guessing. 100 % means you are completely sure. Confident right answers score the most, but confident wrong ones cost the most. The point is to learn how sure you should really be."
          ]
        ]
      }
    },
    "noDebt": "No debt",
    "unit": {
      "pe": "× yearly profit",
      "growth": "in a year",
      "debt": "of profit",
      "years": "yrs"
    },
    "figsFrom": "The figures are for fiscal year {fy}.",
    "approxWord": "approximate",
    "sourcesTitle": "Sources for the figures",
    "sourcesNote": "Share prices come from Yahoo Finance. The key figures come from the companies' financial reports.",
    "scoreHint": "The more sure you were, the more you win or lose. Being 50 % sure always gives 0 points.",
    "introNext": "Next",
    "introStart": "Start",
    "introBack": "Back",
    "showIntro": "Show the introduction again",
    "meaning": {
      "pe": {
        "low": "You pay only {v} times the yearly profit. That is low compared with most companies: the market doesn't expect much growth, or is worried about something.",
        "mid": "You pay {v} times the yearly profit. That is about normal.",
        "high": "You pay {v} times the yearly profit. That is a lot: the market expects profit to grow fast.",
        "vhigh": "You pay as much as {v} times the yearly profit. That is extremely high: the price depends on the company growing enormously."
      },
      "growth": {
        "neg": "Sales fell by {v} %.",
        "low": "Sales grew by {v} %. That is fairly slow.",
        "mid": "Sales grew by {v} %. That is a fairly normal pace.",
        "fast": "Sales grew by {v} %. That is fast.",
        "vfast": "Sales grew by {v} %. That is very fast."
      },
      "debt": {
        "none": "The company had no loans.",
        "low": "The loans equal {v} years of profit. That is a small amount of debt.",
        "mid": "The loans equal {v} years of profit. That is a moderate amount of debt.",
        "high": "The loans equal {v} years of profit. That is a large amount of debt.",
        "vhigh": "The loans equal {v} years of profit. That is a very large amount of debt."
      }
    },
    "intro": [
      {
        "title": "Welcome!",
        "body": [
          "You don't need to know anything about stocks. This is a game where you learn as you go.",
          "Every day you get a real company, as it looked five years ago. You guess how it went. Then we fast-forward five years and show the answer. It takes about two minutes."
        ]
      },
      {
        "title": "What is a stock?",
        "body": [
          "A stock is a small piece of a company. If you own a stock, you own a tiny part of the company.",
          "The price of the stock moves up and down with what people think the company is worth. When the company does well the stock often rises. When it does badly it falls."
        ]
      },
      {
        "title": "What is an index fund?",
        "body": [
          "An index is like a basket of many companies, for example the 500 biggest in the US. An index fund follows the basket, so you own a little of every company at once.",
          "It is the simple alternative to picking single stocks. That is why we always compare with an index fund."
        ]
      },
      {
        "title": "What do you guess?",
        "body": [
          "Every day we ask: will this stock give more money than the index fund over the next five years? Yes or no.",
          "It is a guess, and it's fine to guess wrong. Even experts often guess wrong."
        ]
      },
      {
        "title": "How sure are you?",
        "body": [
          "You also say how sure you are, from 50 % (just guessing) to 100 % (completely sure).",
          "Sure answers that turn out right give the most points. Sure answers that turn out wrong cost the most. The score shows how well your confidence matches reality.",
          "No money is involved, and nothing here is investment advice."
        ]
      },
      {
        "title": "Before you start",
        "body": [
          "First come 10 short questions about words you will meet. It is completely fine to answer \"Don't know\". Most people do, and that is the point: we ask again when you're done, to see what you've learned."
        ]
      }
    ],
    "approx": "Approximate figure."
  }
};


let lang = (() => { try { return localStorage.getItem("hindsight-lang") || "en"; } catch (e) { return "en"; } })();

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
