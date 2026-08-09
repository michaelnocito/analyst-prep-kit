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
 "sql-aliasing": ("sql",
   "The query runs and the result set has three columns nobody can name.",
   "aliases and readability, so a query you wrote in March still explains itself in June"),
 "sql-and-python": ("python",
   "The query is done. Now the next step needs a loop, and SQL has run out of room.",
   "pandas read line by line in plain words, picking up exactly where a result set leaves off"),
 "sql-case-expression": ("sql",
   "The buckets look right until a row lands in two of them and only the first one counts.",
   "CASE read branch by branch, including what happens to the rows no branch catches"),
 "sql-cohort-retention": ("sql",
   "The retention chart is drawn and you cannot say which month each cohort started.",
   "cohort queries built one join at a time, so every percentage has a denominator you can name"),
 "sql-comments": ("sql",
   "The query works and the next person, including you in June, cannot tell why it is written that way.",
   "queries read line by line in plain words, which is the same habit written into the comments"),
 "sql-count-function": ("sql",
   "COUNT(*) and COUNT(column) came back different and nothing said which one you wanted.",
   "counting taken apart case by case, including what every version does with a NULL"),
 "sql-ctes": ("sql",
   "The query is four subqueries deep and you have lost track of what each one returns.",
   "CTEs built step by step, so a long query reads top to bottom instead of inside out"),
 "sql-dates": ("sql",
   "The date filter drops the last day of the month and the total quietly shrinks.",
   "date handling written out, including the boundary that costs you a day without an error"),
 "sql-find-duplicates": ("sql",
   "The row count is too high and every row looks unique on screen.",
   "GROUP BY and HAVING used to find what is duplicated before it reaches a total"),
 "sql-funnel-analysis": ("sql",
   "The funnel has five steps and step three has more people than step two.",
   "funnel queries built so each step counts the same population in the same order"),
 "sql-group-by-having": ("sql",
   "The filter belongs somewhere and WHERE and HAVING both look plausible.",
   "GROUP BY and HAVING read line by line, including the order the database does things in"),
 "sql-indexing-for-analysts": ("sql",
   "The query took four minutes and nobody can tell you what it spent them on.",
   "indexes explained from the analyst's side, so you can ask for the right one and know why"),
 "sql-joins": ("sql",
   "The join ran clean and the row count went up, which means something matched twice.",
   "every join read line by line, with the row counts printed before and after"),
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
