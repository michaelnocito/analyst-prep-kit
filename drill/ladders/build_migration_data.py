# Builds the migration-joins drill dataset, verifies every drill query against it,
# and writes drill/ladders/migration-joins-data.js.
# Deterministic: no randomness that is not seeded and baked.

import json, sqlite3, os

OUT = r"C:\Users\Mike\Projects\analyst-prep-kit\drill\ladders\migration-joins-data.js"

SCHEMA = """
CREATE TABLE legacy_customer (legacy_id TEXT, customer_name TEXT, email TEXT, region TEXT, account_status TEXT, signup_date TEXT);
CREATE TABLE new_customer (new_id TEXT, legacy_id TEXT, customer_name TEXT, email TEXT, region TEXT);
CREATE TABLE legacy_order (order_id TEXT, legacy_id TEXT, order_date TEXT, amount REAL);
CREATE TABLE contact_note (note_id TEXT, legacy_id TEXT, note_date TEXT, channel TEXT);
CREATE TABLE migration_wave (wave_no INTEGER, wave_name TEXT, cutover_date TEXT);
"""

FIRST = ["Alice","Bernard","Chidi","Dana","Elena","Farid","Grace","Hugo","Imani","Jonas",
         "Katya","Liam","Mona","Nils","Orla","Priya","Quentin","Rosa","Samir","Tessa",
         "Ulf","Vera","Wes","Xenia","Yusuf","Zara","Anton","Beatriz","Cormac","Delphine",
         "Emeka","Freya","Gustav","Hana","Ivar","Juno","Kiran","Lotte","Mateo","Nadia"]
LAST  = ["Abbott","Byrne","Cortez","Dahl","Eberhardt","Fontaine","Gallo","Hoxha","Ives","Jansen",
         "Kaur","Larsen","Mbeki","Novak","Ortega","Petrov","Quill","Rasmussen","Saito","Toma",
         "Ueda","Vargas","Whitlock","Xu","Yildiz","Zavala","Ansari","Bakker","Chen","Dumont",
         "Egan","Ferrari","Grimm","Haddad","Ibarra","Jokela","Kovac","Lindqvist","Moreau","Nunes"]

REGIONS = ["East","North","South","West"]
STATUS  = ["active","active","active","dormant","closed"]

# ── legacy_customer: 40 rows ────────────────────────────────────────────────
legacy = []
for n in range(40):
    lid = "L%03d" % (n + 1)
    name = FIRST[n] + " " + LAST[n]
    email = (FIRST[n] + "." + LAST[n]).lower() + "@example.com"
    legacy.append([lid, name, email, REGIONS[n % 4], STATUS[n % 5],
                   "20%02d-%02d-%02d" % (18 + n % 6, (n % 12) + 1, (n % 27) + 1)])

# Two duplicate-email pairs, planted for the self-join rung. Same person entered twice
# under two ids, which is exactly what a legacy export hands you.
legacy[30][2] = legacy[6][2]    # L031 duplicates L007
legacy[38][2] = legacy[17][2]   # L039 duplicates L018

# ── new_customer: 34 matched + 3 with no legacy parent = 37 rows ────────────
# Six legacy customers never landed. Spread across regions and picked so several
# of them carry real order value, or "value at risk" would be a column of zeros.
MISSING = {"L004", "L009", "L014", "L022", "L027", "L035"}

new = []
seq = 1001
for row in legacy:
    lid, name, email, region = row[0], row[1], row[2], row[3]
    if lid in MISSING:
        continue
    new.append(["N-%d" % seq, lid, name, email, region]); seq += 1

# Records the new platform created on its own. No legacy id at all.
for name, region in [("Priya Raman", "North"), ("Tobias Klein", "East"), ("Sofia Marin", "West")]:
    email = name.lower().replace(" ", ".") + "@example.com"
    new.append(["N-%d" % seq, None, name, email, region]); seq += 1

# ── contact_note: the fan-out ──────────────────────────────────────────────
# 22 customers carry notes, 60 notes in total. Joined to the 40 legacy customers
# that is 60 matched rows plus 18 customers with none, so 78 rows out of 40 people.
NOTE_PLAN = [
    ("L001", 4), ("L002", 2), ("L003", 5), ("L004", 3), ("L006", 2),
    ("L007", 4), ("L009", 1), ("L011", 3), ("L012", 2), ("L014", 4),
    ("L016", 2), ("L017", 3), ("L019", 1), ("L021", 4), ("L022", 2),
    ("L024", 3), ("L026", 2), ("L027", 5), ("L029", 1), ("L031", 3),
    ("L033", 2), ("L036", 2),
]
assert sum(n for _, n in NOTE_PLAN) == 60
CHANNELS = ["phone", "email", "portal", "email", "phone"]
notes = []
k = 0
for lid, count in NOTE_PLAN:
    for j in range(count):
        k += 1
        notes.append(["NT-%03d" % k, lid, "2025-%02d-%02d" % ((k % 12) + 1, (k % 27) + 1),
                      CHANNELS[k % 5]])

# ── legacy_order: 140 orders across 33 of the 40 customers ─────────────────
# Seeded LCG so the numbers are the same every time this script runs.
seed = 20260803
def rnd(mod):
    global seed
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed % mod

NO_ORDERS = {"L005", "L010", "L020", "L025", "L030", "L038", "L040"}
buyers = [r[0] for r in legacy if r[0] not in NO_ORDERS]
orders = []
for m in range(140):
    lid = buyers[m % len(buyers)]
    amount = round(40 + rnd(96000) / 100.0, 2)
    orders.append(["O-%04d" % (m + 1), lid,
                   "202%d-%02d-%02d" % (4 + m % 2, (m % 12) + 1, (m % 27) + 1), amount])

waves = [[1, "Pilot", "2026-03-14"], [2, "Main", "2026-04-18"], [3, "Tail", "2026-05-16"]]

TABLES = {
    "legacy_customer": (["legacy_id","customer_name","email","region","account_status","signup_date"], legacy),
    "new_customer":    (["new_id","legacy_id","customer_name","email","region"], new),
    "legacy_order":    (["order_id","legacy_id","order_date","amount"], orders),
    "contact_note":    (["note_id","legacy_id","note_date","channel"], notes),
    "migration_wave":  (["wave_no","wave_name","cutover_date"], waves),
}

# ── load and verify ────────────────────────────────────────────────────────
db = sqlite3.connect(":memory:")
db.executescript(SCHEMA)
for t, (cols, rows) in TABLES.items():
    db.executemany("INSERT INTO %s VALUES (%s)" % (t, ",".join("?" * len(cols))), rows)
db.commit()

CHECKS = [
 ("1 legacy export", "SELECT legacy_id, customer_name, region, account_status FROM legacy_customer"),
 ("2 INNER", """SELECT c.legacy_id, c.customer_name, c.region, n.new_id
FROM legacy_customer AS c
JOIN new_customer AS n ON n.legacy_id = c.legacy_id"""),
 ("3 LEFT", """SELECT c.legacy_id, c.customer_name, c.region, n.new_id
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id"""),
 ("4 anti-join", """SELECT c.legacy_id, c.customer_name, c.region, n.new_id
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
WHERE n.new_id IS NULL"""),
 ("5 recon count", """SELECT COUNT(*) AS legacy_rows, COUNT(n.new_id) AS migrated_rows,
COUNT(*) - COUNT(n.new_id) AS missing_rows
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id"""),
 ("6 FAN-OUT (wrong)", """SELECT c.legacy_id, c.customer_name, n.new_id, t.channel
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
LEFT JOIN contact_note AS t ON t.legacy_id = c.legacy_id"""),
 ("7 fan-out fixed", """SELECT c.legacy_id, c.customer_name, n.new_id, COUNT(t.note_id) AS notes
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
LEFT JOIN contact_note AS t ON t.legacy_id = c.legacy_id
GROUP BY c.legacy_id, c.customer_name, n.new_id"""),
 ("8 aggregate first", """WITH order_totals AS (
  SELECT legacy_id, COUNT(*) AS orders, SUM(amount) AS lifetime_value
  FROM legacy_order
  GROUP BY legacy_id
)
SELECT c.legacy_id, c.customer_name, n.new_id,
       COALESCE(o.orders, 0) AS orders,
       ROUND(COALESCE(o.lifetime_value, 0), 2) AS lifetime_value
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
LEFT JOIN order_totals AS o ON o.legacy_id = c.legacy_id"""),
 ("11 CROSS", """SELECT r.region, w.wave_no, w.wave_name, w.cutover_date
FROM (SELECT DISTINCT region FROM legacy_customer) AS r
CROSS JOIN migration_wave AS w
ORDER BY r.region, w.wave_no"""),
 ("12 self join", """SELECT a.legacy_id, b.legacy_id AS duplicate_of, a.email, a.customer_name
FROM legacy_customer AS a
JOIN legacy_customer AS b ON b.email = a.email AND b.legacy_id > a.legacy_id"""),
 ("13 payoff", """WITH order_totals AS (
  SELECT legacy_id, SUM(amount) AS lifetime_value
  FROM legacy_order
  GROUP BY legacy_id
),
recon AS (
  SELECT c.region, c.legacy_id, n.new_id,
         COALESCE(o.lifetime_value, 0) AS lifetime_value
  FROM legacy_customer AS c
  LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
  LEFT JOIN order_totals AS o ON o.legacy_id = c.legacy_id
)
SELECT region,
       COUNT(*) AS legacy_customers,
       COUNT(new_id) AS migrated,
       COUNT(*) - COUNT(new_id) AS missing,
       ROUND(100.0 * COUNT(new_id) / COUNT(*), 1) AS pct_migrated,
       ROUND(SUM(CASE WHEN new_id IS NULL THEN lifetime_value ELSE 0 END), 2) AS value_at_risk
FROM recon
GROUP BY region
ORDER BY value_at_risk DESC"""),
]

print("row counts")
for label, q in CHECKS:
    print("  %-20s %d" % (label, len(db.execute(q).fetchall())))

print("\nvalue at risk by region")
for r in db.execute(CHECKS[-1][1]):
    print("  ", r)

print("\nghost rows (RIGHT/FULL, checked with a NOT IN stand-in, sqlite here is 3.38):",
      len(db.execute("SELECT * FROM new_customer WHERE legacy_id IS NULL").fetchall()))
print("full-outer total should be:",
      34 + len(MISSING) + 3)

# ── write the data file ────────────────────────────────────────────────────
os.makedirs(os.path.dirname(OUT), exist_ok=True)
data = {t: {"cols": cols, "rows": rows} for t, (cols, rows) in TABLES.items()}
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write("// Migration joins ladder: the tables, baked so the page needs no server.\n")
    f.write("// Generated by build_migration_data.py. Do not hand edit; rerun the script.\n")
    f.write("// A deliberately small, deliberately dirty pair of systems: 40 customers in the\n")
    f.write("// old one, 37 in the new one, six that never landed and three the new system\n")
    f.write("// invented on its own.\n")
    f.write("// Only one ladder's files are ever loaded at a time, so the names match the\n")
    f.write("// music ladder's and the page does not have to care which ladder it is running.\n")
    f.write("const SCHEMA = `%s`;\n\n" % SCHEMA)
    f.write("const DATA = %s;\n" % json.dumps(data, indent=0).replace("\n", ""))
print("\nwrote", OUT)
