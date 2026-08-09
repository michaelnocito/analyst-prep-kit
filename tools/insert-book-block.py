# Batch 2 — insert the Excel for Analysts book block into 13 Excel guides.
# Reads/writes UTF-8 with no BOM and preserves existing line endings.
import io, os, re, sys

ROOT = r"C:\Users\Mike\Projects\analyst-prep-kit\guides"

CSS = (
    "  .book{border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:12px;"
    "padding:16px 20px;margin:26px 0;font-size:15px;line-height:1.6}\n"
    "  .book strong{display:block;margin-bottom:8px}\n"
    "  .book p{margin:0;font-size:14px;color:var(--muted)}\n"
    "  .book a.booklink{display:inline-block;margin-top:12px;font-weight:600;color:var(--accent);text-decoration:none}\n"
    "  .book a.booklink:hover{text-decoration:underline}\n"
)

GUIDES = {
 "excel-character-encoding": (
   "The file opened. Every accented name came back as garbage, and nothing warned you it had happened.",
   "encoding, imports and the other places Excel changes your data on the way in"),
 "excel-chart-design-basics": (
   "The chart has everything on it, which is exactly why nobody can see the point.",
   "chart choices made one decision at a time, with the before and after shown side by side"),
 "excel-check-your-work": (
   "The number is probably right. The stall comes when somebody asks how you know.",
   "the checks that catch your own mistakes, and how to say what a number does not cover"),
 "excel-circular-findings": (
   "The finding was real. It was also just your own filter, handed back to you.",
   "how an analyst frames a question so the answer is not built into it"),
 "excel-clean-messy-data": (
   "The lookup fails on a name that looks identical on screen.",
   "TRIM, CLEAN and the cleanup order that stops a match failing for reasons you cannot see"),
 "excel-conditional-formatting": (
   "The rule works on one cell and falls apart the moment you copy it down.",
   "absolute and relative references read symbol by symbol, so a copied rule lands where you meant"),
 "excel-csv-import-leading-zeros": (
   "The zip codes lost their leading zeros somewhere between the file and the sheet.",
   "text, numbers and the import settings that decide which one your ID column becomes"),
 "excel-custom-number-formats": (
   "The column is correct and still reads wrong, because nothing on it says what the unit is.",
   "number formats written out code by code, so the sheet says what it means without a legend"),
 "excel-dashboard-build-order": (
   "Every tile is built. The stall comes when two of them disagree about the same total.",
   "the build order that makes a dashboard correct first, then clear, then good looking"),
 "excel-dashboard-claim": (
   "The dashboard is finished and nobody in the room can say what it is claiming.",
   "how to write the one sentence a dashboard exists to prove, and cut everything that does not"),
 "excel-data-validation": (
   "The drop down works until somebody pastes straight over it.",
   "validation, protection and the gaps between them, with what each one actually stops"),
 "excel-dates": (
   "The dates sort in the wrong order and the filter offers you text instead of years.",
   "serial numbers, text that looks like a date, and the functions that tell the two apart"),
 "excel-dynamic-arrays": (
   "The formula spills, then breaks with #SPILL!, and the cause is somewhere off screen.",
   "FILTER, UNIQUE and SORT read argument by argument, including what blocks a spill range"),
}

BLOCK = (
 '  <div class="book">\n'
 '    <strong>{hook}</strong>\n'
 '    <p><em>Excel for Analysts</em> is 378 pages, {what}, with practice questions that print the answer and the reason it is right.</p>\n'
 '    <a class="booklink" href="https://michaelnocito.gumroad.com/l/excel-for-analysts" target="_blank" rel="noopener"'
 ' onclick="if(window.gtag)gtag(\'event\',\'guide_book_click\',{{kit:\'guide-{slug}\'}})">Excel for Analysts, $19 &rarr;</a>\n'
 '  </div>\n\n'
)

fails = []
for slug, (hook, what) in GUIDES.items():
    path = os.path.join(ROOT, slug, "index.html")
    with io.open(path, "r", encoding="utf-8", newline="") as f:
        src = f.read()

    if "gumroad" in src:
        fails.append((slug, "already links gumroad")); continue

    # 1. CSS, straight after the footer rule.
    m = re.search(r"^([ \t]*footer\{border-top.*\n)", src, re.M)
    if not m:
        fails.append((slug, "no footer rule")); continue
    nl = "\r\n" if "\r\n" in src else "\n"
    css = CSS.replace("\n", nl)
    src = src[:m.end(1)] + css + src[m.end(1):]

    # 2. Block, straight before the closing CTA.
    m2 = re.search(r"^[ \t]*<div class=\"cta\">", src, re.M)
    if not m2:
        fails.append((slug, "no cta block")); continue
    block = BLOCK.format(hook=hook, what=what, slug=slug).replace("\n", nl)
    src = src[:m2.start()] + block + src[m2.start():]

    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(src)
    print("ok  " + slug)

for slug, why in fails:
    print("FAIL " + slug + ": " + why)
sys.exit(1 if fails else 0)
