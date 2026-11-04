import json, sys, datetime as dt
D = sys.argv[1]; OUT = sys.argv[2]
EVO_DIVS = {dt.date(2016,4,29):2.93/5, dt.date(2017,4,24):4.34/5, dt.date(2018,4,23):9.35/5}  # SEK, split-adjusted; replaces Yahoo's wrong 2016-2018 values

def load(t):
    r = json.load(open(f"{D}/{t}.json"))["chart"]["result"][0]
    off = r["meta"]["gmtoffset"]
    rows = [(dt.datetime.utcfromtimestamp(ts + off).date(), c) for ts, c in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]) if c]
    divs = {dt.datetime.utcfromtimestamp(int(k) + off).date(): v["amount"] for k, v in r.get("events", {}).get("dividends", {}).items()}
    return rows, divs

def tr_series(t, start, end, override=None):
    """Total-return multiple on a 7-day calendar grid from start to end, dividends reinvested at the ex-date close."""
    rows, divs = load(t)
    if override: divs = {**{d: v for d, v in divs.items() if d not in override and not (dt.date(2016,1,1) <= d <= dt.date(2018,12,31))}, **override}
    s = next(i for i, r in enumerate(rows) if r[0] >= start)
    shares = 1.0; p0 = rows[s][1]; daily = []
    for d, c in rows[s:]:
        if d > end: break
        if d in divs and d != rows[s][0]: shares += shares * divs[d] / c
        daily.append((d, shares * c / p0))
    grid, i, cur = [], 0, daily[0][1]
    g = rows[s][0]
    while g <= end:
        while i < len(daily) and daily[i][0] <= g: cur = daily[i][1]; i += 1
        grid.append(round(cur, 3)); g += dt.timedelta(days=7)
    return grid, daily[-1]

jobs = {  # id: (stock ticker, index ticker, start, end, stock dividend override)
 "tencent":   ("0700.HK", "2800.HK", dt.date(2016,1,4), dt.date(2021,1,4), None),
 "hsbc":      ("0005.HK", "2800.HK", dt.date(2016,1,4), dt.date(2021,1,4), None),
 "aia":       ("1299.HK", "2800.HK", dt.date(2016,1,4), dt.date(2021,1,4), None),
 "evergrande":("EGRNF",   "2800.HK", dt.date(2017,1,3), dt.date(2022,1,3), None),
 "evolution": ("EVO.ST",  "XACT-OMXS30.ST", dt.date(2016,1,4), dt.date(2021,1,4), EVO_DIVS),
 "hm":        ("HM-B.ST", "XACT-OMXS30.ST", dt.date(2016,1,4), dt.date(2021,1,4), None),
 "swedbank":  ("SWED-A.ST","XACT-OMXS30.ST", dt.date(2016,1,4), dt.date(2021,1,4), None),
 "netflix":   ("NFLX",    "^SP500TR", dt.date(2016,1,4), dt.date(2021,1,4), None),
 "ge":        ("GE",      "^SP500TR", dt.date(2016,1,4), dt.date(2021,1,4), None),
 "boeing":    ("BA",      "^SP500TR", dt.date(2016,1,4), dt.date(2021,1,4), None),
}
cards = {c["id"]: c for c in json.load(open(sys.argv[3]))}
out = {}
for cid, (st, ix, a, b, ov) in jobs.items():
    s, last = tr_series(st, a, b, ov); i, lasti = tr_series(ix, a, b)
    n = min(len(s), len(i)); s, i = s[:n], i[:n]
    c = cards[cid]
    if cid == "evergrande":   # OTC line is illiquid and USD: rescale so the chart ends where the (HKEX-dividend) headline figure does
        k = c["stock"] / s[-1]; s = [round(x * k, 3) for x in s]
    print(f"{cid:11s} pts {n}  stock end {s[-1]:6.2f} (card {c['stock']})  index end {i[-1]:5.2f} (card {c['index']})  min/max stock {min(s):.2f}/{max(s):.2f}")
    out[cid] = {"start": a.isoformat(), "stock": s, "index": i}
json.dump({"_note": "Weekly total-return multiples (dividends reinvested), start = 1.0. Source: Yahoo Finance daily prices; Evolution 2016-2018 dividends from the company's financial calendar; Evergrande approximate (see card-returns.json).", "series": out}, open(OUT, "w"), separators=(",", ":"))
