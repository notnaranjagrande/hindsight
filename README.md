# Hindsight

En daglig aktie-gissning för nybörjare (CS398, CUHK). Spelaren ser ett riktigt men anonymt bolag som det såg ut för fem år sedan, gissar om aktien slår index och anger hur säker hen är. Sedan spolas fem år fram.

Statisk webbapp (HTML/JS, inget byggsteg) på GitHub Pages med Supabase som databas. Utan Supabase-nycklar körs appen i demoläge, där svaren bara sparas i webbläsaren.

## Filer

| Fil | Vad |
|---|---|
| `cards.json` | De 21 korten i spelordning (dag 1 = första kortet), på svenska och engelska. Genereras av `tools/build_cards.py`, redigera inte för hand |
| `test.json` | De 10 begreppsfrågorna i för- och eftertestet |
| `config.js` | Supabase-nycklar, startdatum och vilken dag eftertestet öppnar |
| `app.js` | Skärmarna: start, kort, reveal, mikrofråga, de andras gissningar, test |
| `store.js` | Spara/läsa: Supabase eller lokalt (demo) |
| `i18n.js` | All UI-text på svenska och engelska |
| `supabase/schema.sql` | Tabeller och funktioner. Klistras in i Supabase en gång |
| `supabase/update_2.sql` | Lägger till "vilka har spelat idag" och testpoäng i spelarens tillstånd. Körs en gång efter `schema.sql`. Appen fungerar utan den, men döljer de två funktionerna |
| `supabase/analysis.sql` | Facit per kort och testfråga samt analysvyer (retention, begreppstest före/efter, kalibrering). Klistras in i Supabase en gång, se nedan |
| `tools/build_analysis.py` | Skriver om facitet i `analysis.sql` från `cards.json` och `test.json` |
| `series.json` | Veckovisa totalavkastningskurvor (aktie och indexfond) för grafen i revealen |
| `tools/build_cards.py` | Bygger `cards.json` (texter + siffror). Körs med `python3 tools/build_cards.py` |
| `tools/figures_us.json` | Nyckeltal för de amerikanska bolagen, uträknade ur SEC:s bokslutsdata |
| `tools/make_series.py` | Skapar `series.json` från Yahoo Finance-kurser. Se skriptet för hur den körs |

## Köra lokalt

```bash
python3 -m http.server 8123
```

Öppna http://localhost:8123/?demo=1&day=8. `?demo=1` kör lokalt läge utan att spara något i Supabase, och `?day=N` testar vilken dag som helst.

Ändrar du `cards.json`, `test.json` eller `series.json`: byt `contentVersion` i `config.js`, annars kan webbläsare visa gamla filer i upp till tio minuter.

## Sätta upp (en gång)

1. **Supabase:** skapa ett gratis projekt på supabase.com (region: Stockholm). Öppna **SQL Editor**, klistra in hela `supabase/schema.sql` och kör.
2. **Lägg till spelare** i SQL Editor. Varje spelare får en slumpad kod, som blir deras personliga länk:
   ```sql
   insert into players (code, name, grp) values
     (substr(md5(random()::text), 1, 10), 'Olle', 'olle'),
     (substr(md5(random()::text), 1, 10), 'Joachim', 'ivar'),
     (substr(md5(random()::text), 1, 10), 'Moa', 'ivar'),
     (substr(md5(random()::text), 1, 10), 'Max', 'ivar')
   returning name, code;
   ```
3. **Nycklar:** kopiera Project URL och anon/publishable key från **Project Settings → API** till `config.js`. Anon-nyckeln får ligga publikt: tabellerna är låsta, och appen kommer bara åt dem via funktioner som kräver en giltig spelarkod.
4. **GitHub Pages:** skapa ett repo (t.ex. `hindsight`), pusha den här mappen, och välj sedan **Settings → Pages → Deploy from branch → main / root**.
5. **Länkar:** varje spelare får `https://<ditt-användarnamn>.github.io/hindsight/?p=<kod>`. Koden sparas på telefonen efter första besöket.

## Före start (4 nov)

- Sätt `studyStart` i `config.js` till `2026-11-05`.
- Rensa testdata i SQL Editor:
  ```sql
  truncate answers, micro_answers, tests, events;
  ```
- Testa med 2 personer.

## Kvar att göra

- **Riktiga nyckeltal i `cards.json`:** fälten `pe`, `pe_index`, `growth`, `growth_index` och `debt` är `null`. Tills de är ifyllda visar appen de gamla etiketterna ("Dyr") markerade som preliminära.
- **21 kort:** i dag finns 10.

## Data

Exportera som CSV från Supabase **Table Editor**. Inga namn eller koder ligger i det här repot. Radera datan efter kursen.

## Analys

Kör hela `supabase/analysis.sql` en gång i Supabase SQL Editor. Sedan läser du resultaten med `select * from <vy>;` (eller **Export CSV** i resultatpanelen):

| Vy | Svarar på |
|---|---|
| `v_retention` | Hur många svarade varje dag, och på dag 21? |
| `v_player_activity` | Kort spelade per person, första och sista dag |
| `v_test_by_player` | Begreppstest före och efter, per person |
| `v_test_by_question` | Per fråga: andel rätt och andel "Don't know", före och efter |
| `v_calibration_all` / `v_calibration_by_player` | Kalibrering tidigt (kort 1–7) mot sent (kort 15–21): träffsäkerhet, genomsnittlig säkerhet, **överdriven säkerhet** (säkerhet minus andel rätt), säkerhet på fel svar, Brier, andel Nej-svar |
| `v_calibration_curve` | När folk sa X % säkra, hur ofta hade de rätt? |
| `v_engagement` | Tid per kort, tryck på förklaringar, begreppsfrågor rätt |
| `v_micro_by_period` | Begreppsfrågor rätt tidigt mot sent |

Vyerna är låsta för den publika nyckeln. Bara du kan läsa dem i SQL Editor. Ändrar du korten: kör `python3 tools/build_analysis.py` och kör sedan filen igen. Tänk på att korten tidigt och sent har olika facit (4 av 7 slår index tidigt, 2 av 7 sent), så läs "Andel Nej-svar" bredvid kalibreringen.

## Retention-funktioner (på startsidan)

- Framstegsrad ("7 of 21 cards played") och antal dagar i rad.
- "Moa and Max have played today" (kräver `supabase/update_2.sql`).
- Personlig rapport efter 7 spelade kort: träffsäkerhet mot säkerhet, överdriven säkerhet, utveckling mellan första och senaste 7 korten, och begreppstestets resultat (kräver `update_2.sql`).
- Daglig påminnelse: en kalenderfil (`.ics`, 20–21 dagliga händelser) eller Google Kalender, med spelarens egen länk. Skapas i webbläsaren, ingen server. Tipset om hemskärmen finns i samma ruta.
- `daily-messages.md` (i projektmappen, inte i repot) har 21 neutrala gruppmeddelanden.
