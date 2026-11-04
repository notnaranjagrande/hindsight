# Hindsight

En daglig aktie-gissning för nybörjare (CS398, CUHK). Spelaren ser ett riktigt men anonymt bolag som det såg ut för fem år sedan, gissar om aktien slår index och anger hur säker hen är. Sedan spolas fem år fram.

Statisk webbapp (HTML/JS, inget byggsteg) på GitHub Pages med Supabase som databas. Utan Supabase-nycklar körs appen i demoläge, där svaren bara sparas i webbläsaren.

## Filer

| Fil | Vad |
|---|---|
| `cards.json` | Korten i spelordning (dag 1 = första kortet), på svenska och engelska |
| `test.json` | De 10 begreppsfrågorna i för- och eftertestet |
| `config.js` | Supabase-nycklar, startdatum och vilken dag eftertestet öppnar |
| `app.js` | Skärmarna: start, kort, reveal, mikrofråga, de andras gissningar, test |
| `store.js` | Spara/läsa: Supabase eller lokalt (demo) |
| `i18n.js` | All UI-text på svenska och engelska |
| `supabase/schema.sql` | Tabeller och funktioner. Klistras in i Supabase en gång |

## Köra lokalt

```bash
python3 -m http.server 8123
```

Öppna http://localhost:8123. I demoläge kan du testa vilken dag som helst med `?day=8`.

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
