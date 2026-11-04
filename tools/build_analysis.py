"""Rewrites the answer keys in supabase/analysis.sql from cards.json and test.json.
Run from the repo root:  python3 tools/build_analysis.py
"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cards = json.load(open(os.path.join(ROOT, "cards.json")))
test = json.load(open(os.path.join(ROOT, "test.json")))
card_rows = ",\n".join(f"  ('{c['id']}', {i}, {'true' if c['stock'] > c['index'] else 'false'}, {c['stock']}, {c['index']})" for i, c in enumerate(cards, 1))
test_rows = ",\n".join(f"  ('{q['id']}', {i}, {q['correct']}, {len(q['options']) - 1})" for i, q in enumerate(test, 1))
keys = ("-- BEGIN KEYS (rewritten by tools/build_analysis.py from cards.json and test.json)\n"
        "truncate card_truth, test_truth;\n"
        f"insert into card_truth (card_id, pos, beat, stock, index_fund) values\n{card_rows};\n"
        f"insert into test_truth (q_id, pos, correct, dont_know) values\n{test_rows};\n"
        "-- END KEYS")
path = os.path.join(ROOT, "supabase/analysis.sql")
sql = open(path).read()
new, n = re.subn(r"-- BEGIN KEYS.*?-- END KEYS", lambda m: keys, sql, flags=re.S)
assert n == 1, "markers not found"
open(path, "w").write(new)
print("keys rewritten:", len(cards), "cards,", len(test), "test questions")
