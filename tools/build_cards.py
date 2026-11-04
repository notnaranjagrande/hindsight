"""Builds cards.json (21 cards, Swedish + English) from the text below, tools/figures_us.json (SEC filings)
and returns.json (total returns from Yahoo Finance prices, see make_series.py).

Run from the repo root:  python3 tools/build_cards.py
Writing rule for every text: it must make sense to someone who knows nothing about stocks.
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
US = json.load(open(os.path.join(ROOT, "tools/figures_us.json")))
RET = json.load(open(os.path.join(ROOT, "returns.json")))

def bi(sv, en): return {"sv": sv, "en": en}

# ---- figures that do not come from SEC filings (Hong Kong / Sweden): fiscal 2015 results, price on 4 Jan 2016 ----
FX = "USD/HKD 7.75, USD/CNY 6.50, EUR/SEK 9.15 på startdatumet / on the start date"
NONUS = {
 "tencent":   dict(pe=37.7, growth=30.0, approx=["pe"],
                   src=["https://prnewswire.com/news-releases/tencent-announces-2015-fourth-quarter-and-annual-results-300237636.html"],
                   debt_note=bi("Tencent hade mer pengar på kontot än lån (nettokassa på 19 miljarder yuan).", "Tencent had more cash in the bank than debt (net cash of 19 billion yuan)."),
                   label_debt=bi("Mer pengar än lån", "More cash than debt")),
 "hsbc":      dict(pe=12.2, growth=-4.7, approx=["pe"],
                   src=["https://hsbc.com/-/files/hsbc/investors/results-and-announcements/stock-exchange-announcements/2016/february/hsbc-holdings-plc-annual-results-2015-media-release.pdf"],
                   debt_note=bi("Banker lånar pengar för att kunna låna ut dem, så ett skuldtal säger lite om risken.", "Banks borrow money in order to lend it out, so a debt figure says little about risk."),
                   label_debt=bi("Bank", "Bank")),
 "aia":       dict(pe=21.9, growth=3.5, approx=["pe"],
                   pe_remark=bi("Räknat på vinsten från den vanliga verksamheten, som bolaget själv redovisar.", "Based on the profit from the everyday business, as the company reports it."),
                   src=["https://aia.com.hk/en/about-aia/about-us/media-centre/press-releases/2016/aia-delivers-strong-growth-in-2015"],
                   debt_note=bi("Försäkringsbolag fungerar annorlunda än vanliga bolag, så ett skuldtal säger lite om risken.", "Insurers work differently from ordinary companies, so a debt figure says little about risk."),
                   label_debt=bi("Försäkringsbolag", "Insurer")),
 "evolution": dict(pe=58.5, growth=57.0, approx=["pe"],
                   src=["https://www.globenewswire.com/news-release/2016/02/16/810753/0/en/Evolution-Gaming-Year-end-Report-2015.html"],
                   debt_note=bi("Bolaget hade i princip inga lån.", "The company had practically no loans."),
                   label_debt=bi("Inga lån", "No debt")),
 "hm":        dict(pe=22.7, growth=19.4,
                   src=["https://hmgroup.com/wp-content/uploads/2021/01/1642932.pdf"],
                   debt_note=bi("Bolaget hade mycket små lån jämfört med vad det tjänar.", "The company had very small loans compared with what it earns."),
                   label_debt=bi("Mycket små lån", "Very small loans")),
 "evergrande":dict(pe=13.8, growth=58.8, approx=["pe"],
                   src=["https://doc.irasia.com/listco/hk/evergrande/annual/2016/res.pdf"],
                   debt_note=bi("Bolaget hade enorma lån. Vi har ingen säker siffra, men det var ett av världens mest skuldsatta företag.", "The company had enormous loans. We have no reliable figure, but it was one of the most indebted companies in the world."),
                   label_debt=bi("Enorma lån", "Enormous loans")),
 "swedbank":  dict(pe=12.9, growth=-4.3,
                   src=["https://financialreports.eu/filings/2743240/content"],
                   debt_note=bi("Banker lånar pengar för att kunna låna ut dem, så ett skuldtal säger lite om risken.", "Banks borrow money in order to lend it out, so a debt figure says little about risk."),
                   label_debt=bi("Bank", "Bank")),
}
# US names: ticker -> card id. GE and Ford have a finance arm, so debt is not meaningful; GE made a loss in 2015.
US_IDS = {"netflix": "NFLX", "ge": "GE", "boeing": "BA", "micron": "MU", "exxon": "XOM", "visa": "V", "att": "T",
          "horton": "DHI", "underarmour": "UAA", "amat": "AMAT", "cocacola": "KO", "intel": "INTC", "ford": "F", "disney": "DIS"}
US_NOTES = {
 "ge":    dict(pe_note=bi("Bolaget gick med förlust 2015, så P/E går inte att räkna ut.", "The company made a loss in 2015, so a P/E can't be worked out."),
              debt_note=bi("GE hade en egen bank-del, så ett vanligt skuldtal säger lite om risken.", "GE had a banking arm of its own, so an ordinary debt figure says little about risk."),
              label_pe=bi("Förlust", "Loss"), label_debt=bi("Bank-del", "Banking arm")),
 "ford":  dict(debt_note=bi("Ford har ett eget bolag som lånar ut pengar till bilköpare, så ett vanligt skuldtal säger lite om risken.", "Ford has its own company lending money to car buyers, so an ordinary debt figure says little about risk."),
               label_debt=bi("Eget låne-bolag", "Own lending arm")),
 "horton":dict(approx=["debt"], debt_remark=bi("Husbyggares lån räknas lite annorlunda, så siffran är ungefärlig.", "Home builders' loans are counted a little differently, so the figure is approximate.")),
}

# ---- the cards ----
# fields: id, name, when (sv,en), market (sv,en), title, desc, story, lesson (title,text), micro (q, options, correct, explain)
def M(q, opts, correct, explain): return {"q": q, "options": [bi(*o) for o in opts], "correct": correct, "explain": explain}
JAN16, JAN17 = bi("jan 2016", "Jan 2016"), bi("jan 2017", "Jan 2017")
HK, SE, US_M = bi("Hongkong", "Hong Kong"), bi("Stockholm", "Stockholm"), bi("USA", "USA")

CARDS = [
 dict(id="tencent", name="Tencent", when=JAN16, market=HK,
  title=bi("Ett kinesiskt chatt- och spelbolag", "A Chinese chat and gaming company"),
  desc=bi("Driver Kinas största chattapp med över 600 miljoner användare. Tjänar pengar på mobilspel och har just börjat låta folk betala direkt i appen.",
          "Runs China's biggest chat app, with over 600 million users. Makes money from mobile games and has just started letting people pay inside the app."),
  story=bi("Betalningarna i appen och spelen fortsatte växa. Aktien nästan fyrdubblades, medan indexfonden steg ungefär hälften.",
           "Payments in the app and the games kept growing. The stock almost quadrupled, while the index fund rose about half."),
  lesson=(bi("Dyrt kan vara rätt pris", "Expensive can be the right price"),
          bi("Ett högt P/E betyder att du betalar mycket för dagens vinst, eftersom marknaden väntar sig att vinsten växer snabbt. Det lönar sig bara om vinsten verkligen växer, och här gjorde den det.",
             "A high P/E means you pay a lot for today's profit, because the market expects the profit to grow fast. It only pays off if the profit really does grow, and here it did.")),
  micro=M(bi("Bolag A har P/E 10 och bolag B har P/E 40. Av vilket väntar sig marknaden mest tillväxt?", "Company A has a P/E of 10 and company B a P/E of 40. Which does the market expect to grow faster?"),
          [("A", "A"), ("B", "B"), ("Lika mycket", "The same")], 1,
          bi("P/E 40 betyder att du betalar 40 års vinst. Det gör man bara om man tror att vinsten växer mycket snabbt.", "A P/E of 40 means you pay 40 years of profit. You only do that if you believe the profit will grow very fast."))),
 dict(id="hsbc", name="HSBC", when=JAN16, market=HK,
  title=bi("En av världens största banker, som delar ut mycket pengar", "One of the world's biggest banks, which pays out a lot of money"),
  desc=bi("Stor bank med fokus på Asien. Stabil och välkänd. Varje år delar den ut över 6 % av aktiens pris till ägarna (det kallas utdelning). Många pensionärer i Hongkong äger aktien.",
          "A huge bank focused on Asia. Stable and well known. Each year it pays out over 6 % of the share price to its owners (this is called a dividend). Many retirees in Hong Kong own the stock."),
  story=bi("Låga räntor gav banken mindre vinst, och 2020 bad den brittiska centralbanken HSBC att stoppa utdelningen. Aktien föll, och även med utdelningar förlorade ägarna ungefär 14 %.",
           "Low interest rates gave the bank less profit, and in 2020 the Bank of England asked HSBC to stop the dividend. The stock fell, and even with dividends the owners lost about 14 %."),
  lesson=(bi("Billigt kan vara billigt av en anledning", "Cheap can be cheap for a reason"),
          bi("En låg prislapp och hög utdelning ser tryggt ut, men kan betyda att marknaden väntar sig svag utveckling. Utdelningar är inga garantier.",
             "A low price tag and a high dividend look safe, but can mean the market expects weak results. Dividends are not guaranteed.")),
  micro=M(bi("Ett P/E på 20 betyder att …", "A P/E of 20 means that …"),
          [("aktien kostar 20 gånger bolagets årsvinst per aktie", "the share costs 20 times the company's yearly profit per share"), ("aktien har stigit 20 % i år", "the share has risen 20 % this year"), ("bolaget växer 20 % per år", "the company grows 20 % a year")], 0,
          bi("P/E är priset delat med vinsten per aktie. Med P/E 20 skulle det ta 20 år av dagens vinst att tjäna ihop priset.", "P/E is the price divided by the profit per share. At a P/E of 20 it would take 20 years of today's profit to earn the price back."))),
 dict(id="netflix", name="Netflix", when=JAN16, market=US_M,
  title=bi("En dvd-uthyrare som blivit tv-tjänst på nätet", "A DVD rental company turned online TV service"),
  desc=bi("Har precis börjat sända i 130 nya länder. Lägger miljarder på egna serier och tjänar nästan ingenting. Många experter tycker att aktien är löjligt dyr.",
          "Has just started streaming in 130 new countries. Spends billions on its own shows and earns almost nothing. Many experts think the stock is absurdly expensive."),
  story=bi("Antalet kunder mer än tredubblades, och pandemin gav ett extra lyft. Aktien steg nästan fem gånger.", "The number of customers more than tripled, and the pandemic gave an extra boost. The stock rose almost five times."),
  lesson=(bi("Experterna kan ha fel åt båda hållen", "The experts can be wrong both ways"),
          bi("När alla tycker att en aktie är för dyr kan de ha rätt, eller så missar de hur stor marknaden kan bli.", "When everyone thinks a stock is too expensive they may be right, or they may miss how big the market can become.")),
  micro=M(bi("En aktie har P/E 80 och stiger kraftigt de följande åren. Vad krävdes troligen?", "A stock has a P/E of 80 and rises sharply over the following years. What was most likely needed?"),
          [("Att vinsten växte snabbt, som marknaden hoppades", "That profits grew fast, as the market hoped"), ("Att P/E sjönk till 10", "That the P/E fell to 10"), ("Ingenting, högt P/E betyder alltid att aktien stiger", "Nothing, a high P/E always means the stock rises")], 0,
          bi("Ett högt P/E är ett vad på att vinsten växer. Kommer tillväxten kan aktien stiga. Uteblir den faller den ofta hårt.", "A high P/E is a bet that profits will grow. If the growth comes the stock can rise. If it doesn't, it often falls hard."))),
 dict(id="aia", name="AIA", when=JAN16, market=HK,
  title=bi("Ett försäkringsbolag i hela Asien", "An insurance company across Asia"),
  desc=bi("Säljer livförsäkringar via egna säljare i 18 länder och områden i Asien. Växer när fler får det bättre ställt. Tråkigt men lönsamt.",
          "Sells life insurance through its own salespeople in 18 countries and territories in Asia. Grows as more people become better off. Boring but profitable."),
  story=bi("Bolaget fortsatte växa i jämn takt när fler människor i Asien tecknade försäkringar. Aktien mer än fördubblades.", "The company kept growing at an even pace as more people in Asia bought insurance. The stock more than doubled."),
  lesson=(bi("Tråkigt kan slå spännande", "Boring can beat exciting"),
          bi("Jämn tillväxt år efter år, utan drama. Tillväxten bygger på tidigare tillväxt, och det gör jobbet.", "Steady growth year after year, with no drama. Growth builds on earlier growth, and that does the work.")),
  micro=M(bi("Försäljningen växer 10 % per år i fem år. Ungefär hur mycket större är bolaget efter fem år?", "Sales grow 10 % a year for five years. Roughly how much bigger is the company after five years?"),
          [("50 % större", "50 % bigger"), ("61 % större", "61 % bigger"), ("100 % större", "100 % bigger")], 1,
          bi("Tillväxten bygger på sig själv: 1,1 × 1,1 × 1,1 × 1,1 × 1,1 ≈ 1,61.", "Growth builds on itself: 1.1 × 1.1 × 1.1 × 1.1 × 1.1 ≈ 1.61."))),
 dict(id="evolution", name="Evolution", when=JAN16, market=SE,
  title=bi("Ett litet bolag som filmar kortspel live", "A small company that films card games live"),
  desc=bi("Sänder blackjack och roulette med riktiga croupierer till nätcasinon. En liten aktie som få experter följer. Växer snabbt och tjänar bra.",
          "Streams blackjack and roulette with real dealers to online casinos. A small stock that few experts follow. Grows fast and earns well."),
  story=bi("Bolaget blev störst i världen på sitt område, och vinsten exploderade. Aktien steg ungefär 14 gånger på fem år.", "The company became the biggest in the world in its field, and profits exploded. The stock rose about 14 times in five years."),
  lesson=(bi("Vinnare är sällsynta men enorma", "Winners are rare but huge"),
          bi("Några få aktier står för det mesta av vad en stor korg med bolag har tjänat. De är svåra att hitta i förväg, men en indexfond äger dem alltid.", "A handful of stocks account for most of what a big basket of companies has earned. They are hard to find in advance, but an index fund always owns them.")),
  micro=M(bi("Två bolag har samma P/E. A växer 30 % per år, B växer 2 % per år. Vilket är billigast i förhållande till hur snabbt det växer?", "Two companies have the same P/E. A grows 30 % a year, B grows 2 % a year. Which is cheaper compared with how fast it grows?"),
          [("A", "A"), ("B", "B"), ("Lika billiga", "Equally cheap")], 0,
          bi("Samma pris för vinsten, men A:s vinst växer mycket snabbare. P/E säger mest när man läser det tillsammans med tillväxten.", "Same price for the profit, but A's profit grows much faster. P/E says most when you read it together with growth."))),
 dict(id="hm", name="H&M", when=JAN16, market=SE,
  title=bi("Sveriges mest kända klädkedja", "Sweden's best-known clothing chain"),
  desc=bi("Tusentals butiker i över 60 länder. Har varit en stor vinnare på börsen i många år. Näthandeln växer, men långsammare än hos konkurrenterna.",
          "Thousands of stores in more than 60 countries. A big winner on the stock market for many years. Online sales are growing, but more slowly than at rivals."),
  story=bi("Konkurrens från nätbutiker och stora lager av osålda kläder drog ner vinsten. Även med utdelningar tappade aktien ungefär en fjärdedel, medan indexfonden steg 60 %.",
           "Competition from online shops and large stocks of unsold clothes pushed profits down. Even with dividends the stock lost about a quarter, while the index fund rose 60 %."),
  lesson=(bi("Gårdagens vinnare är inte morgondagens", "Yesterday's winner is not tomorrow's"),
          bi("Ett känt varumärke säger lite om framtiden. Det som alla redan vet finns redan i priset.", "A famous brand says little about the future. What everyone already knows is already in the price.")),
  micro=M(bi("Ett välkänt bolag har vuxit i många år, men tillväxten börjar sakta ner. Vad händer ofta med aktien?", "A famous company has grown for many years, but growth is starting to slow. What often happens to the stock?"),
          [("Den faller om marknaden räknat med fortsatt snabb tillväxt", "It falls if the market had counted on continued fast growth"), ("Den stiger eftersom varumärket är känt", "It rises because the brand is famous"), ("Ingenting, tillväxten påverkar inte aktiepriset", "Nothing, growth does not affect the share price")], 0,
          bi("Priset speglar vad folk förväntar sig. När tillväxten blir lägre än väntat faller aktien, hur känt bolaget än är.", "The price reflects what people expect. When growth comes in below expectations the stock falls, however famous the company is."))),
 dict(id="evergrande", name="Evergrande", when=JAN17, market=HK,
  title=bi("Kinas snabbast växande husbyggare", "China's fastest-growing home builder"),
  desc=bi("Bygger lägenheter i hundratals kinesiska städer. Försäljningen har ökat kraftigt varje år. Bolaget betalar för tillväxten med lånade pengar och med förskott från köpare.",
          "Builds apartments in hundreds of Chinese cities. Sales have grown sharply every year. The company pays for its growth with borrowed money and advance payments from buyers."),
  story=bi("Aktien rusade först, men skulderna blev för stora. 2021 kunde bolaget inte betala sina lån, och aktien förlorade större delen av sitt värde.",
           "The stock soared at first, but the debts grew too large. In 2021 the company could not pay its loans, and the stock lost most of its value."),
  lesson=(bi("Lån förstärker åt båda hållen", "Loans amplify in both directions"),
          bi("Lånade pengar gör att ett bolag kan växa snabbare när det går bra, men kan knäcka det när det vänder. Titta alltid på lånen.", "Borrowed money lets a company grow faster when things go well, but can break it when they turn. Always look at the loans.")),
  micro=M(bi("Bolag A har lån som motsvarar 6 års vinst. Bolag B har lån som motsvarar ett halvt års vinst. Vilket klarar ett dåligt år sämst?", "Company A has loans equal to 6 years of profit. Company B has loans equal to half a year of profit. Which handles a bad year worse?"),
          [("A", "A"), ("B", "B"), ("Lika dåligt", "Equally badly")], 0,
          bi("A har mycket mer att betala tillbaka i förhållande till vad bolaget tjänar. Faller vinsten kan det bli omöjligt att klara lånen.", "A has much more to pay back compared with what it earns. If profit falls, the loans can become impossible to manage."))),
 dict(id="ge", name="General Electric", when=JAN16, market=US_M,
  title=bi("En över 120 år gammal jättekoncern", "A giant company over 120 years old"),
  desc=bi("Tillverkar jetmotorer, kraftverk och sjukvårdsutrustning. En av USA:s mest ägda aktier. Delar ut pengar regelbundet till ägarna.",
          "Makes jet engines, power plants and medical equipment. One of the most widely owned stocks in the US. Pays out money regularly to its owners."),
  story=bi("Affären med kraftverk gick dåligt, bokföringen granskades och utdelningen sänktes kraftigt. Även med utdelningar förlorade ägarna ungefär 60 %.",
           "The power plant business went badly, the accounts were investigated and the dividend was slashed. Even with dividends the owners lost about 60 %."),
  lesson=(bi("Storlek är ingen trygghet", "Size is no safety"),
          bi("Även jättar som \"alla äger\" kan förlora mycket. Stora, krångliga bolag med mycket lån är svåra att se in i.", "Even giants that \"everyone owns\" can lose a lot. Large, complicated companies with a lot of loans are hard to see into.")),
  micro=M(bi("Ett bolags lån är tre gånger så stora som årsvinsten. Vad betyder det?", "A company's loans are three times its yearly profit. What does that mean?"),
          [("Det skulle ta ungefär 3 års vinst att betala tillbaka lånen", "It would take about 3 years of profit to pay back the loans"), ("Bolaget har tre gånger så mycket pengar som lån", "The company has three times as much cash as debt"), ("Lånen har tredubblats", "The loans have tripled")], 0,
          bi("Måttet visar hur många års vinst lånen motsvarar. Ju fler år, desto mer har bolaget lånat.", "The figure shows how many years of profit the loans equal. The more years, the more the company has borrowed."))),
 dict(id="swedbank", name="Swedbank", when=JAN16, market=SE,
  title=bi("En stor svensk bank", "A large Swedish bank"),
  desc=bi("Bolån och sparande åt miljontals svenskar och balter. Mycket lönsam, delar ut mycket pengar och uppfattas som trygg.", "Home loans and savings for millions of Swedes and Balts. Very profitable, pays out a lot of money and is seen as safe."),
  story=bi("2019 visade det sig att banken misstänktes ha hjälpt till att flytta olagliga pengar i Baltikum. Det gav stora böter, chefen fick lämna och utdelningen pausades. Med utdelningar tjänade ägarna bara 6 %.",
           "In 2019 it emerged that the bank was suspected of helping to move illegal money in the Baltics. It led to big fines, the CEO had to leave and the dividend was paused. With dividends the owners gained only 6 %."),
  lesson=(bi("Risken i ett enda bolag går att sprida ut", "The risk in a single company can be spread out"),
          bi("En skandal i ett bolag kan radera flera års avkastning. Äger du många bolag spelar en enskild skandal mindre roll.", "One scandal in one company can wipe out years of returns. If you own many companies, a single scandal matters less.")),
  micro=M(bi("Du äger aktier i en enda bank och en skandal slår till. Vad hade minskat skadan mest?", "You own shares in a single bank and a scandal hits. What would have limited the damage most?"),
          [("Att äga många bolag, till exempel via en indexfond", "Owning many companies, for example through an index fund"), ("Att äga två banker i stället för en", "Owning two banks instead of one"), ("Att köpa och sälja oftare", "Buying and selling more often")], 0,
          bi("När du äger många bolag blir ett enskilt bolags problem bara en liten del av det du äger.", "When you own many companies, one company's problem is only a small part of what you own."))),
 dict(id="boeing", name="Boeing", when=JAN16, market=US_M,
  title=bi("En av bara två tillverkare av stora passagerarplan", "One of only two makers of large passenger planes"),
  desc=bi("Bara två företag i världen tillverkar stora passagerarplan: Boeing och Airbus. Flygbolagen har redan beställt plan för många år framåt.", "Only two companies in the world make large passenger planes: Boeing and Airbus. The airlines have already ordered planes for many years ahead."),
  story=bi("Aktien steg kraftigt fram till 2019. Sedan kom två flygolyckor med planet 737 MAX, flygförbud och pandemin. Aktien slutade ändå högre, men efter indexfonden.",
           "The stock rose strongly until 2019. Then came two crashes of the 737 MAX plane, a flying ban and the pandemic. The stock still ended higher, but behind the index fund."),
  lesson=(bi("Att stiga är inte samma sak som att slå index", "Going up is not the same as beating the index"),
          bi("Med utdelningar steg aktien 61 %, men en indexfond fördubblades. Rätt jämförelse är alltid alternativet: indexfonden.", "With dividends the stock rose 61 %, but an index fund doubled. The right comparison is always the alternative: the index fund.")),
  micro=M(bi("En aktie steg 61 % på fem år. Indexfonden steg 103 %. Slog aktien index?", "A stock rose 61 % in five years. The index fund rose 103 %. Did the stock beat the index?"),
          [("Ja, den steg ju", "Yes, it went up"), ("Nej", "No"), ("Går inte att säga", "Can't tell")], 1,
          bi("Att slå index betyder att gå bättre än alternativet. Den som köpt indexfonden hade fått mer.", "Beating the index means doing better than the alternative. Someone who bought the index fund would have had more."))),
 # ---- 11-21 ----
 dict(id="micron", name="Micron", when=JAN16, market=US_M,
  title=bi("Ett bolag som gör minnet i telefoner och datorer", "A company that makes the memory in phones and computers"),
  desc=bi("Tillverkar minneschips som finns i nästan alla telefoner, datorer och servrar. Priset på chipsen svänger mycket. Just nu är priserna låga, och aktien är mycket billig.",
          "Makes memory chips found in almost every phone, computer and server. The price of the chips swings a lot. Right now prices are low, and the stock is very cheap."),
  story=bi("Efterfrågan på minne exploderade när datacenter och mobiler behövde allt mer av det. Priserna steg och vinsten flerdubblades. Aktien steg drygt fem gånger.",
           "Demand for memory exploded as data centres and phones needed more and more of it. Prices rose and profits multiplied. The stock rose more than five times."),
  lesson=(bi("Ett lågt pris kan vara en möjlighet, eller en varning", "A low price can be an opportunity, or a warning"),
          bi("Ett mycket lågt P/E betyder att marknaden är pessimistisk. Ofta har den rätt, men ibland har den fel, och då kan aktien stiga rejält.", "A very low P/E means the market is pessimistic. Often it's right, but sometimes it is wrong, and then the stock can rise a lot.")),
  micro=M(bi("Ett bolag har P/E 6. Vad säger det om vad marknaden väntar sig?", "A company has a P/E of 6. What does that say about what the market expects?"),
          [("Att vinsten inte kommer att växa, eller att något oroar", "That profit won't grow, or that something is worrying"), ("Att vinsten kommer att växa väldigt mycket", "That profit will grow a great deal"), ("Ingenting alls", "Nothing at all")], 0,
          bi("Man betalar lite för varje krona vinst när man tror att vinsten är på väg ner eller är osäker.", "People pay little for each krona of profit when they believe profit is heading down or is uncertain."))),
 dict(id="exxon", name="ExxonMobil", when=JAN16, market=US_M,
  title=bi("Ett av världens största oljebolag", "One of the world's biggest oil companies"),
  desc=bi("Pumpar upp och säljer olja och gas över hela världen. Stort, välkänt och delar ut pengar till ägarna varje kvartal. Just nu har oljepriset rasat.",
          "Pumps up and sells oil and gas all over the world. Big, well known and pays out money to its owners every quarter. Right now the oil price has collapsed."),
  story=bi("Oljepriset föll ännu mer när pandemin 2020 stoppade resandet. Aktien föll nästan hälften. Även med utdelningar förlorade ägarna ungefär en tredjedel, medan indexfonden mer än fördubblades.",
           "The oil price fell even further when the pandemic stopped travel in 2020. The stock fell almost by half. Even with dividends the owners lost about a third, while the index fund more than doubled."),
  lesson=(bi("Stort och stabilt är inte samma sak som tryggt", "Big and steady is not the same as safe"),
          bi("Bolag som säljer något vars pris svänger, som olja, följer priset upp och ner. Utdelningen kan inte skydda dig om priset faller.", "Companies that sell something whose price swings, like oil, follow the price up and down. The dividend can't protect you if the price falls.")),
  micro=M(bi("Ett oljebolags försäljning föll 34 % på ett år. Vad är den troligaste orsaken?", "An oil company's sales fell 34 % in a year. What is the most likely reason?"),
          [("Oljepriset föll", "The oil price fell"), ("Bolaget fick fler kunder", "The company got more customers"), ("Bolaget lånade mindre pengar", "The company borrowed less money")], 0,
          bi("Bolag som säljer råvaror tjänar mer när priset är högt och mindre när det är lågt.", "Companies that sell raw materials earn more when the price is high and less when it is low."))),
 dict(id="visa", name="Visa", when=JAN16, market=US_M,
  title=bi("Bolaget bakom kortbetalningarna", "The company behind card payments"),
  desc=bi("Tar en liten avgift varje gång någon i världen betalar med kort. Har inga lån och tjänar stora pengar på varje betalning. Aktien kostar rätt mycket.",
          "Takes a small fee every time someone in the world pays by card. Has no loans and earns a lot on each payment. The stock costs quite a lot."),
  story=bi("Allt fler betalade med kort och mobil, och bolaget växte stadigt år efter år. Aktien nästan tredubblades och slog indexfonden.", "More and more people paid by card and phone, and the company grew steadily year after year. The stock almost tripled and beat the index fund."),
  lesson=(bi("Dyrt kan vara värt det för ett bra bolag", "Expensive can be worth it for a great company"),
          bi("Ett bolag som växer stadigt, tjänar mycket och inte behöver låna kan förtjäna ett högt pris. Men det är bara i efterhand man vet.", "A company that grows steadily, earns a lot and doesn't need to borrow can deserve a high price. But you only know that afterwards.")),
  micro=M(bi("Ett bolag tjänar 10 kr per aktie, och aktien kostar 300 kr. Hur många års vinst betalar du?", "A company earns 10 kr per share, and the share costs 300 kr. How many years of profit do you pay?"),
          [("3 år", "3 years"), ("30 år", "30 years"), ("300 år", "300 years")], 1,
          bi("300 delat med 10 är 30. Det är bolagets P/E.", "300 divided by 10 is 30. That is the company's P/E."))),
 dict(id="att", name="AT&T", when=JAN16, market=US_M,
  title=bi("Ett amerikanskt telekombolag med stora lån", "An American telecom company with big loans"),
  desc=bi("Säljer telefon, internet och tv till tiotals miljoner kunder. Har precis köpt ett tv-bolag och lånat mycket för det. Delar ut över 5 % av aktiens pris varje år.",
          "Sells phone, internet and TV to tens of millions of customers. Has just bought a TV company and borrowed a lot to do it. Pays out over 5 % of the share price every year."),
  story=bi("Lånen tyngde, tillväxten uteblev och bolaget sålde av stora delar och sänkte utdelningen. Aktien föll, och även med utdelningar steg ägarnas pengar bara 25 % på fem år.",
           "The loans weighed on it, growth didn't come and the company sold off large parts and cut its dividend. The stock fell, and even with dividends the owners' money rose only 25 % in five years."),
  lesson=(bi("Hög utdelning ersätter inte tillväxt", "A high dividend does not replace growth"),
          bi("Pengar som delas ut finns inte kvar i bolaget. Utan tillväxt och med stora lån kan utdelningen bli en börda.", "Money that is paid out is no longer in the company. Without growth and with big loans the dividend can become a burden.")),
  micro=M(bi("Ett bolag tjänar 100 miljoner kr per år och har lån på 600 miljoner kr. Hur många års vinst skulle det ta att betala tillbaka lånen?", "A company earns 100 million kr a year and has loans of 600 million kr. How many years of profit would it take to pay the loans back?"),
          [("6 år", "6 years"), ("60 år", "60 years"), ("1 år", "1 year")], 0,
          bi("600 delat med 100 är 6. Det är hur många år bolaget skulle behöva för att betala allt.", "600 divided by 100 is 6. That is how many years the company would need to pay it all back."))),
 dict(id="horton", name="D.R. Horton", when=JAN16, market=US_M,
  title=bi("Ett bolag som bygger villor åt amerikanska familjer", "A company that builds houses for American families"),
  desc=bi("Bygger och säljer småhus över hela USA. Försäljningen ökar kraftigt just nu. Går bra när räntorna är låga och folk vågar köpa hem.",
          "Builds and sells houses all over the US. Sales are rising sharply right now. Does well when interest rates are low and people dare to buy homes."),
  story=bi("Räntorna förblev låga, och när pandemin kom ville många ha större bostäder. Husen blev dyrare och efterfrågan stor. Aktien mer än fördubblades och slog indexfonden.",
           "Interest rates stayed low, and when the pandemic came many wanted bigger homes. Houses got more expensive and demand was high. The stock more than doubled and beat the index fund."),
  lesson=(bi("Bolag följer ofta konjunkturen", "Companies often follow the economy"),
          bi("Husbyggare, bilmakare och liknande går bra när det går bra för ekonomin och sämre när det går dåligt. Svårt att veta i förväg när det vänder.", "Home builders, carmakers and similar companies do well when the economy does well and worse when it does badly. Hard to know in advance when it turns.")),
  micro=M(bi("Ett bolags försäljning växte 35 % på ett år. Vad betyder det?", "A company's sales grew 35 % in a year. What does that mean?"),
          [("Bolaget sålde 35 % mer än året före", "The company sold 35 % more than the year before"), ("Aktien steg 35 %", "The stock rose 35 %"), ("Vinsten ökade 35 %", "Profit rose 35 %")], 0,
          bi("Tillväxt i försäljning handlar bara om hur mycket mer som såldes. Vinst och aktiepris kan röra sig helt annorlunda.", "Sales growth is only about how much more was sold. Profit and share price can move quite differently."))),
 dict(id="underarmour", name="Under Armour", when=JAN16, market=US_M,
  title=bi("Ett sportklädesmärke som växer snabbt", "A sportswear brand that is growing fast"),
  desc=bi("Säljer träningskläder och skor och utmanar de största märkena. Populärt bland unga idrottare. Försäljningen ökar snabbt, och aktien är mycket dyr.",
          "Sells workout clothes and shoes and challenges the biggest brands. Popular among young athletes. Sales are growing fast, and the stock is very expensive."),
  story=bi("Tillväxten avtog, konkurrensen från de stora märkena hårdnade och bolaget gick med förlust. Aktien föll till mindre än hälften av vad den kostade.", "Growth slowed, competition from the big brands got tougher and the company made a loss. The stock fell to less than half of what it cost."),
  lesson=(bi("Ett högt pris kräver att allt går rätt", "A high price requires everything to go right"),
          bi("När du betalar för snabb tillväxt i många år i förväg finns ingen marginal för misstag. Då räcker det att tillväxten blir lite lägre än väntat.", "When you pay in advance for fast growth over many years there is no room for mistakes. It is enough for growth to be a bit lower than expected.")),
  micro=M(bi("En aktie kostar 76 gånger årsvinsten. Vad måste hända för att priset ska bli rimligt?", "A stock costs 76 times the yearly profit. What has to happen for the price to become reasonable?"),
          [("Vinsten måste växa mycket i många år", "Profit must grow a great deal for many years"), ("Ingenting, priset är redan rimligt", "Nothing, the price is already reasonable"), ("Bolaget måste sluta tjäna pengar", "The company must stop earning money")], 0,
          bi("Med P/E 76 betalar du 76 års vinst. Det går bara ihop om vinsten blir mångdubbelt större.", "At a P/E of 76 you pay 76 years of profit. That only adds up if profit becomes many times bigger."))),
 dict(id="amat", name="Applied Materials", when=JAN16, market=US_M,
  title=bi("Bolaget som bygger maskinerna som tillverkar datachips", "The company that builds the machines that make computer chips"),
  desc=bi("Säljer maskiner till fabriker som gör chips till telefoner, datorer och bilar. När chiptillverkarna bygger mer fabriker säljer bolaget mer. Aktien är inte särskilt dyr.",
          "Sells machines to factories that make chips for phones, computers and cars. When chip makers build more factories, the company sells more. The stock is not particularly expensive."),
  story=bi("Behovet av chips ökade kraftigt, och fabrikerna köpte fler maskiner. Aktien steg drygt fem gånger och slog indexfonden med råge.", "The need for chips rose sharply, and the factories bought more machines. The stock rose more than five times and beat the index fund by a wide margin."),
  lesson=(bi("Ibland tjänar de som säljer spadarna mest", "Sometimes those who sell the shovels earn the most"),
          bi("Under en guldrush tjänar ofta de som säljer verktygen mest. Men det är svårt att veta i förväg vilken bransch som blir nästa guldrush.", "In a gold rush the ones selling the tools often earn the most. But it is hard to know in advance which industry will be the next gold rush.")),
  micro=M(bi("En aktie steg 400 % på fem år. Indexfonden steg 100 %. Slog aktien index?", "A stock rose 400 % in five years. The index fund rose 100 %. Did the stock beat the index?"),
          [("Ja", "Yes"), ("Nej", "No"), ("Går inte att säga", "Can't tell")], 0,
          bi("Aktien gav mycket mer än indexfonden, alltså slog den index.", "The stock gave much more than the index fund, so it beat the index."))),
 dict(id="cocacola", name="Coca-Cola", when=JAN16, market=US_M,
  title=bi("Världens mest kända läskedrycksmärke", "The world's best-known soft drink brand"),
  desc=bi("Säljer läsk och andra drycker i över 200 länder. Älskat, stabilt och ger ägarna pengar varje år. Försäljningen minskar något just nu, och aktien är ganska dyr.",
          "Sells soft drinks and other drinks in over 200 countries. Loved, steady and gives its owners money every year. Sales are shrinking slightly right now, and the stock is fairly expensive."),
  story=bi("Bolaget förblev stabilt men växte långsamt. Med utdelningar steg ägarnas pengar 47 %, medan indexfonden steg 103 %.", "The company stayed steady but grew slowly. With dividends the owners' money rose 47 %, while the index fund rose 103 %."),
  lesson=(bi("Tryggt är inte samma sak som bäst", "Safe is not the same as best"),
          bi("Ett stabilt bolag med känt varumärke kan vara en trygg ägo, men det ger inte automatiskt mer än indexfonden.", "A steady company with a famous brand can be a safe thing to own, but it doesn't automatically give more than the index fund.")),
  micro=M(bi("En aktie är dyr, och försäljningen minskar. Vad är den största risken?", "A stock is expensive, and sales are shrinking. What is the biggest risk?"),
          [("Att förväntningarna på tillväxt inte infrias och aktien faller", "That the expectations of growth don't come true and the stock falls"), ("Att bolaget blir för billigt", "That the company becomes too cheap"), ("Ingen risk alls", "No risk at all")], 0,
          bi("När priset räknar med bra tider men försäljningen går åt fel håll finns det mycket att tappa.", "When the price counts on good times but sales are going the wrong way there is a lot to lose."))),
 dict(id="intel", name="Intel", when=JAN16, market=US_M,
  title=bi("Bolaget som gör hjärnan i de flesta datorer", "The company that makes the brain of most computers"),
  desc=bi("Tillverkar processorerna som styr de flesta datorer och servrar. Världens ledande, med mycket pengar på kontot. Försäljningen står still, och aktien är inte dyr.",
          "Makes the processors that run most computers and servers. The world leader, with a lot of money in the bank. Sales are flat, and the stock is not expensive."),
  story=bi("Konkurrenterna blev bättre på att tillverka de modernaste chipsen och tog över ledningen. Med utdelningar steg ägarnas pengar 67 % på fem år, medan indexfonden steg 103 %.",
           "Competitors got better at making the most modern chips and took the lead. With dividends the owners' money rose 67 % in five years, while the index fund rose 103 %."),
  lesson=(bi("Marknadsledare kan tappa greppet", "Market leaders can lose their grip"),
          bi("Att vara störst idag är ingen garanti för att vara störst om fem år. Teknik byter ledare snabbare än man tror.", "Being the biggest today is no guarantee of being the biggest in five years. Technology changes leaders faster than you think.")),
  micro=M(bi("Bolag A har P/E 14 och bolag B har P/E 76. Vilket har marknaden högst förväntningar på?", "Company A has a P/E of 14 and company B a P/E of 76. Which does the market have the highest expectations of?"),
          [("A", "A"), ("B", "B"), ("Båda lika", "Both the same")], 1,
          bi("Ju mer du betalar per krona vinst, desto mer måste bolaget växa för att priset ska löna sig.", "The more you pay per krona of profit, the more the company has to grow for the price to pay off."))),
 dict(id="ford", name="Ford", when=JAN16, market=US_M,
  title=bi("Ett av USA:s största biltillverkare", "One of America's biggest carmakers"),
  desc=bi("Bygger bilar och lastbilar som många amerikaner kör. Aktien är mycket billig, och bolaget delar ut en bra del av vinsten. Försäljningen växer långsamt.",
          "Builds the cars and trucks many Americans drive. The stock is very cheap, and the company pays out a good part of its profit. Sales are growing slowly."),
  story=bi("Omställningen till elbilar kostade miljarder, och pandemin stoppade fabrikerna. Med utdelningar förlorade ägarna ungefär en femtedel, medan indexfonden mer än fördubblades.",
           "The switch to electric cars cost billions, and the pandemic stopped the factories. With dividends the owners lost about a fifth, while the index fund more than doubled."),
  lesson=(bi("En billig aktie är inte alltid ett fynd", "A cheap stock is not always a bargain"),
          bi("Lågt P/E och bra utdelning kan dölja att branschen står inför stora förändringar som kostar mycket.", "A low P/E and a good dividend can hide that the industry faces big changes that cost a lot.")),
  micro=M(bi("En aktie har P/E 7,6. Vad betyder det?", "A stock has a P/E of 7.6. What does that mean?"),
          [("Du betalar ungefär 7,6 års vinst för aktien", "You pay about 7.6 years of profit for the stock"), ("Aktien har stigit 7,6 %", "The stock has risen 7.6 %"), ("Bolaget växer 7,6 % per år", "The company grows 7.6 % a year")], 0,
          bi("P/E är priset delat med vinsten per aktie, alltså hur många års vinst du betalar.", "P/E is the price divided by profit per share, so how many years of profit you pay."))),
 dict(id="disney", name="Walt Disney", when=JAN16, market=US_M,
  title=bi("Bolaget bakom filmer, tecknade figurer och nöjesparker", "The company behind films, cartoon characters and theme parks"),
  desc=bi("Gör filmer, äger nöjesparker och tv-kanaler och har rättigheterna till kända figurer. Älskat av barn och vuxna världen över, och vinsten är stabil.",
          "Makes films, owns theme parks and TV channels and holds the rights to famous characters. Loved by children and adults all over the world, and profit is steady."),
  story=bi("Bolaget lanserade en egen strömningstjänst som växte snabbt, men pandemin stängde nöjesparkerna. Med utdelningar steg ägarnas pengar 83 % på fem år, medan indexfonden steg 103 %.",
           "The company launched its own streaming service that grew fast, but the pandemic closed the theme parks. With dividends the owners' money rose 83 % in five years, while the index fund rose 103 %."),
  lesson=(bi("Ett bra bolag är inte samma sak som en bra affär", "A great company is not the same as a great deal"),
          bi("Priset räknar redan med att bolaget är bra. Vad som avgör din avkastning är om det går bättre eller sämre än vad alla redan förväntade sig.", "The price already counts on the company being great. What decides your return is whether it goes better or worse than everyone already expected.")),
  micro=M(bi("Ett bolag är älskat av alla och har säkra vinster, men aktien kostar mycket. Varför kan den ändå gå sämre än indexfonden?", "A company is loved by everyone and has safe profits, but the stock costs a lot. Why might it still do worse than the index fund?"),
          [("För att priset redan räknar med att allt går bra", "Because the price already counts on everything going well"), ("För att älskade bolag aldrig tjänar pengar", "Because loved companies never earn money"), ("Det kan det inte", "It can't")], 0,
          bi("Du betalar för förväntningarna. Går det bara som väntat får du ingen extra avkastning.", "You pay for the expectations. If things only go as expected you get no extra return."))),
]

# Short plain-language labels shown when a figure cannot be a number, and a vague pe label for GE
def build():
    out = []
    for c in CARDS:
        cid = c["id"]
        f = {"fy": "2016" if cid == "evergrande" else "2015"}
        clues = {}
        if cid in NONUS:
            n = NONUS[cid]
            f.update(pe=n["pe"], growth=n["growth"], debt=None, debt_note=n["debt_note"], src=n["src"])
            if n.get("approx"): f["approx"] = n["approx"]
            if n.get("pe_remark"): f["pe_remark"] = n["pe_remark"]
            clues["debt"] = n["label_debt"]
        else:
            u = US[US_IDS[cid]]
            f.update(pe=u["pe"], growth=u["growth"], debt=u.get("debt_ebitda"), src=[u["source"]], fy=u["fy_end"][:4])
            x = US_NOTES.get(cid, {})
            if cid in ("ge", "ford"): f["debt"] = None
            if x.get("approx"): f["approx"] = x["approx"]
            for k in ("pe_note", "debt_note", "debt_remark"):
                if x.get(k): f[k] = x[k]
            if x.get("label_pe"): clues["pe"] = x["label_pe"]
            if x.get("label_debt"): clues["debt"] = x["label_debt"]
        r = RET.get(cid)
        card = dict(id=cid, name=c["name"], when=c["when"], years=5, market=c["market"], title=c["title"], desc=c["desc"], figures=f, clues=clues)
        card["stock"], card["index"] = (r["stock"], r["index"]) if r else (None, None)
        card["story"] = c["story"]; card["lesson"] = {"title": c["lesson"][0], "text": c["lesson"][1]}; card["micro"] = c["micro"]
        if cid == "evergrande": card["approx"] = True
        out.append(card)
    return out

if __name__ == "__main__":
    # the first ten cards' returns come from the earlier verified table (card-returns.json); the rest from returns.json
    old = {c["id"]: c for c in json.load(open(os.path.join(ROOT, "cards.json")))}
    for cid, c in old.items():
        RET.setdefault(cid, {"stock": c["stock"], "index": c["index"]})
    cards = build()
    missing = [c["id"] for c in cards if c["stock"] is None]
    assert not missing, missing
    # Evolution: keep the headline the same as the chart end value (14.4)
    json.dump(cards, open(os.path.join(ROOT, "cards.json"), "w"), ensure_ascii=False, indent=1)
    print(len(cards), "cards written;", sum(1 for c in cards if c["stock"] > c["index"]), "beat their index")
