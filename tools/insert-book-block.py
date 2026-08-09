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
 "excel-if-family": ("excel",
   "The IF works. Then it works on the wrong rows and still returns something.",
   "the IF family read argument by argument in plain words, including what each one does with a blank"),
 "excel-iferror": ("excel",
   "You wrapped it in IFERROR and the error went quiet, which is not the same as gone.",
   "error handling written out so you hide the errors you understand and keep the ones you do not"),
 "excel-ifs-vs-nested-if": ("excel",
   "Five nested IFs, one wrong bracket, and no way to see which branch fired.",
   "IFS, nested IF and the order of conditions, with the branch table that shows what each row hits"),
 "excel-index-match": ("excel",
   "VLOOKUP returned the wrong name because somebody inserted a column.",
   "INDEX MATCH read argument by argument, and why it survives a column that moves"),
 "excel-kpi-row": ("excel",
   "Four big numbers at the top, and nobody can tell which one they are supposed to act on.",
   "the KPI row built so each number carries its comparison, not just its size"),
 "excel-label-rows-before-charting": ("excel",
   "The chart came out labelled 1, 2, 3, and the fix is in the data, not the chart.",
   "how a sheet has to be laid out before a chart can read it correctly"),
 "excel-month-over-month": ("excel",
   "The percentage change is right and still misleading, because the base month was unusual.",
   "period comparisons, and the sentence you have to say when a base month is small"),
 "excel-name-your-data": ("excel",
   "The formula range never grew with the data, and no cell said so.",
   "tables, named ranges and the references that keep working when rows arrive"),
 "excel-pick-the-chart": ("charts",
   "The data is ready and the chart menu offers forty options, most of them wrong.",
   "picking the mark from the question you are answering, with the wrong choices shown next to the right one"),
 "excel-pivot-percentages": ("excel",
   "The percentages add to 100 and answer a question nobody asked.",
   "Show Values As, and the denominator decision that changes the whole sentence"),
 "excel-pivot-table-question": ("excel",
   "Four empty boxes, and no idea which field goes where.",
   "pivots built from the sentence you are trying to say, so the fields place themselves"),
 "excel-pivot-tables": ("excel",
   "The pivot built fine. The stall comes when the Grand Total does not match the source column.",
   "every pivot setting read one at a time, with the check that catches a stale cache or a cut range"),
 "excel-power-query": ("excel",
   "The cleanup worked once, and next month you have to do all of it again by hand.",
   "Power Query steps written out one at a time, so a refresh replaces the whole manual pass"),
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
