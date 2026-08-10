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
 "powerbi-time-intelligence": ("powerbi",
   "The year-to-date measure is right for eleven months and wrong for the twelfth.",
   "the date table and the time intelligence functions that depend on it, built in the order they break without"),
 "import-a-csv-into-power-bi": ("powerbi",
   "The file loaded and a column came in as text, which every measure downstream now inherits.",
   "the import and modelling steps that decide what a column is before a visual ever reads it"),
 "install-power-bi-desktop": ("powerbi",
   "Power BI is installed and the blank canvas is its own kind of stuck.",
   "DAX, the star schema and filter context explained in the order the questions actually arrive"),
 "connect-tableau-to-your-data": ("tableau",
   "The data is connected and the first sheet is the one nobody tells you how to start.",
   "relationships, level of detail and table calculations worked through one decision at a time"),
 "install-tableau-public": ("tableau",
   "Tableau Public is installed and the empty canvas is its own kind of stuck.",
   "relationships, level of detail and table calculations worked through one decision at a time"),
 "ab-testing-for-analysts": ("stats",
   "Variant B won by four percent and nobody can say whether that was the change or the week.",
   "p-values, confidence intervals and A/B tests written for people who have to present the answer"),
 "confidence-intervals": ("stats",
   "You have a single number and somebody is about to treat it as exact.",
   "intervals written out so you can say how much of the number is signal and how much is sample"),
 "correlation-vs-causation": ("stats",
   "The two lines move together and somebody in the room has already decided why.",
   "the checks that stand between a relationship in the data and a claim about cause"),
 "mean-vs-median": ("stats",
   "The average went up and most people got less. Both statements are true.",
   "center and spread taken apart, so you pick the summary that matches the shape you have"),
 "p-values": ("stats",
   "The result is significant and nobody in the meeting can say significant of what.",
   "p-values written out in plain words, including the four things they are routinely taken to mean and do not"),
 "percentiles-iqr-outliers": ("stats",
   "One row is enormous and the decision to drop it is being made by whoever is holding the mouse.",
   "percentiles and the IQR rule, so removing a row is a documented choice and not a reflex"),
 "standard-deviation": ("stats",
   "You have the average. Nobody has asked yet how spread out the thing actually is.",
   "spread explained from the shape of the data, so the number carries how typical the average is"),
 "forecast-accuracy": ("forecasting",
   "The forecast was close last month, and nobody has defined close.",
   "moving averages, seasonality and forecast accuracy, including how to state what the number cannot tell you"),
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
