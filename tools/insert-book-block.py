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
 "excel-remove-duplicates": ("excel",
   "Remove Duplicates deleted rows and told you a count, and there is no undo two saves later.",
   "the checks that go before a destructive step, so you find out what you are about to lose first"),
 "excel-slicers": ("excel",
   "The slicer filters one pivot and leaves the other three showing last week.",
   "slicers, connections and the reporting layout that keeps every tile answering the same question"),
 "excel-sort-your-bars": ("charts",
   "The ranking chart came out in alphabetical order, which is a ranking of nothing.",
   "ordering, marks and the axis, with the misleading version shown next to the fixed one"),
 "excel-sum-of-id-trap": ("excel",
   "Excel summed your ID numbers and reported the total without a word.",
   "the one-line test that catches a field being aggregated in a way that means nothing"),
 "excel-sumifs": ("excel",
   "SUMIFS returns zero and every argument looks correct.",
   "SUMIFS and COUNTIFS read argument by argument, including the criteria that silently match nothing"),
 "excel-sumproduct": ("excel",
   "You need a weighted number and the formula is one long line nobody can check.",
   "SUMPRODUCT taken apart piece by piece, so a weighted total can be read out loud"),
 "excel-tables": ("excel",
   "You added rows and the pivot, the chart and the formula all kept the old range.",
   "tables and structured references, so the things built on your data grow with it"),
 "vlookup-vs-xlookup": ("excel",
   "The lookup works on your machine and breaks on the one that has an older Excel.",
   "VLOOKUP, XLOOKUP and INDEX MATCH compared argument by argument, including where each one fails"),
 "budget-vs-actual-variance": ("excel",
   "The variance column is correct and nobody can tell which rows matter.",
   "variance built so the sign, the size and the share all say the same thing"),
 "export-sql-results-to-excel": ("sql",
   "The query is right and the export arrives with dates as text and IDs missing zeros.",
   "queries read line by line, including how to shape a result set before it leaves the database"),
 "connect-excel-to-a-database": ("excel",
   "The copy and paste worked once. Now it is a monthly chore and the numbers drift.",
   "connections and refreshes, so the sheet pulls its own data instead of being fed by hand"),
 "free-datasets-to-practice-with": ("thinking",
   "You have the data. The harder part is knowing which question is worth asking of it.",
   "how an analyst frames a question, checks their own work and writes up what the numbers do not settle"),
 "sample-database-for-sql-practice": ("sql",
   "You have a database to practise on and no idea what to ask it first.",
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
