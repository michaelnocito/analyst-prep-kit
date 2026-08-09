# Insert a Gumroad book block into guide pages.
#
# Used by the batches in GUMROAD_LINK_ROADMAP.md. Each guide page is uniform:
# a `footer{border-top` CSS rule to anchor the .book styles to, and a closing
# `<div class="cta">` to sit the block above, so the kit route still reads first.
#
# Edit BATCH below, then run:  python tools/insert-book-block.py
#
# Reads and writes UTF-8 with no BOM and preserves existing line endings, so it
# does not do to these files what PowerShell's Set-Content does.
import io, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "guides")

# Prices verified against the live Gumroad listings 2026-08-09.
# Page counts are the 2026-08-09 rebuild.
BOOKS = {
    "excel":       ("Excel for Analysts",       "excel-for-analysts",       378, "$19"),
    "sql":         ("SQL for Analysts",         "sql-for-analysts",         458, "$19"),
    "python":      ("Python for Analysts",      "python-for-analysts",      203, "$19"),
    "powerbi":     ("Power BI for Analysts",    "power-bi-for-analysts",    187, "$19"),
    "tableau":     ("Tableau for Analysts",     "tableau-for-analysts",     128, "$19"),
    "stats":       ("Statistics for Analysts",  "statistics-for-analysts",  123, "$19"),
    "charts":      ("Charts and Visualization", "charts-and-visualization",  42, "$12"),
    "forecasting": ("Forecasting for Analysts", "forecasting-for-analysts",  43, "$12"),
    "thinking":    ("Thinking Like an Analyst", "thinking-like-an-analyst",  64, "$19"),
    "migration":   ("The Data Migration Playbook", "data-migration-playbook", 63, "$29"),
}

CSS = (
    "  .book{border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:12px;"
    "padding:16px 20px;margin:26px 0;font-size:15px;line-height:1.6}\n"
    "  .book strong{display:block;margin-bottom:8px}\n"
    "  .book p{margin:0;font-size:14px;color:var(--muted)}\n"
    "  .book a.booklink{display:inline-block;margin-top:12px;font-weight:600;color:var(--accent);text-decoration:none}\n"
    "  .book a.booklink:hover{text-decoration:underline}\n"
)

BLOCK = (
 '  <div class="book">\n'
 '    <strong>{hook}</strong>\n'
 '    <p><em>{title}</em> is {pages} pages, {what}.</p>\n'
 '    <a class="booklink" href="https://michaelnocito.gumroad.com/l/{bslug}" target="_blank" rel="noopener"'
 ' onclick="if(window.gtag)gtag(\'event\',\'guide_book_click\',{{kit:\'guide-{slug}\'}})">{title}, {price} &rarr;</a>\n'
 '  </div>\n\n'
)

# slug -> (book key, hook, what the book is)
BATCH = {
 "sql-month-over-month": ("sql",
   "The month over month number is right and the month it compares to was a fluke.",
   "period comparisons written out, including how to say what a small base month does to a percentage"),
 "sql-null": ("sql",
   "The query nearly works, and the rows that vanished were the ones with nothing in that column.",
   "NULL taken apart case by case, because it is an absence of a value and not a value"),
 "sql-reconciliation": ("sql",
   "Both tables have the same row count and the totals still differ.",
   "the full outer join, the value comparison and the fingerprint that finds where two tables disagree"),
 "sql-running-total": ("sql",
   "The running total resets in the wrong place and the order looks fine.",
   "window frames read one clause at a time, so a running total counts what you meant it to"),
 "sql-segment-with-case": ("sql",
   "The segments are defined in the query and nowhere written down.",
   "CASE read branch by branch, so a segment definition is something you can hand to someone else"),
 "sql-subqueries": ("sql",
   "The subquery works alone and returns something different inside the outer query.",
   "subqueries and CTEs compared, including what each one can and cannot see"),
 "sql-temp-tables-vs-views": ("sql",
   "You need the intermediate result twice and there are three ways to keep it.",
   "temp tables, views and CTEs compared on what they cost and how long they last"),
 "sql-window-functions": ("sql",
   "You need a rank per group and GROUP BY collapses the rows you wanted to keep.",
   "OVER, PARTITION BY and the frame read one clause at a time, with the output printed each step"),
 "practice-sql-online-no-install": ("sql",
   "You can run a query in the browser. The stall is not knowing what to ask next.",
   "every query read line by line in plain words, with practice questions that print the answer and the reason it is right"),
 "set-up-a-sql-database": ("sql",
   "The database is installed and empty, which is its own kind of stuck.",
   "every query read line by line in plain words, so the empty database has somewhere to go"),
 "set-up-duckdb": ("sql",
   "DuckDB reads your file in one line. The next line is the one you cannot write yet.",
   "every query read line by line in plain words, with practice questions that print the answer and the reason it is right"),
 "which-sql-database-to-install": ("sql",
   "The dialects differ in the small ways and the ideas underneath do not.",
   "the SQL that carries across engines, with the places a dialect actually changes the answer"),
 "install-postgresql-for-beginners": ("sql",
   "Postgres is running and the terminal is waiting for a query you have not written yet.",
   "every query read line by line in plain words, with practice questions that print the answer and the reason it is right"),
}

def main():
    fails = []
    for slug, (bkey, hook, what) in BATCH.items():
        title, bslug, pages, price = BOOKS[bkey]
        path = os.path.join(ROOT, slug, "index.html")
        if not os.path.exists(path):
            fails.append((slug, "no such guide")); continue
        with io.open(path, "r", encoding="utf-8", newline="") as f:
            src = f.read()
        if "gumroad" in src:
            fails.append((slug, "already links gumroad")); continue

        nl = "\r\n" if "\r\n" in src else "\n"

        m = re.search(r"^([ \t]*footer\{border-top.*\n)", src, re.M)
        if not m:
            fails.append((slug, "no footer rule to anchor css")); continue
        src = src[:m.end(1)] + CSS.replace("\n", nl) + src[m.end(1):]

        m2 = re.search(r"^[ \t]*<div class=\"cta\">", src, re.M)
        if not m2:
            fails.append((slug, "no cta block")); continue
        block = BLOCK.format(hook=hook, what=what, slug=slug, title=title,
                             bslug=bslug, pages=pages, price=price)
        src = src[:m2.start()] + block.replace("\n", nl) + src[m2.start():]

        with io.open(path, "w", encoding="utf-8", newline="") as f:
            f.write(src)
        print("ok   %s  ->  %s" % (slug, title))

    for slug, why in fails:
        print("FAIL %s: %s" % (slug, why))
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main())
