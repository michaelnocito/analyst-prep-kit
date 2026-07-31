"""Put the shared subscribe block on every guide, in place of the
Buy Me a Coffee line.

One ask per page is the rule. The guides already carry a book pointer, so
the subscribe block takes the donate link's slot rather than becoming a
third ask (HANDOFF-email-capture.md section 8).

Safe to run twice: it skips any page already carrying the block.

    python add_subscribe_to_guides.py          # do it
    python add_subscribe_to_guides.py --check   # report only, change nothing
"""

import glob
import os
import sys

BMC = ('<p style="margin-top:10px"><a href="https://buymeacoffee.com/michaelnocito" '
       'target="_blank" rel="noopener">Buy Me a Coffee &#9749;</a></p>')
SLOT = '<div data-apk-subscribe></div>'
TAG = '<script src="../../assets/apk-subscribe.js" defer></script>'

check = "--check" in sys.argv
changed, skipped, problems = [], [], []

for path in sorted(glob.glob(os.path.join("guides", "*", "index.html"))):
    name = os.path.basename(os.path.dirname(path))
    with open(path, encoding="utf-8") as f:
        html = f.read()

    if SLOT in html:
        skipped.append(f"{name}: already has the block")
        continue
    if BMC not in html:
        problems.append(f"{name}: no Buy Me a Coffee line to replace")
        continue
    if "<footer>" not in html or "</body>" not in html:
        problems.append(f"{name}: no <footer> or </body> to anchor to")
        continue

    out = html.replace(BMC, "")
    # The block sits after the content, before the nav footer.
    out = out.replace("<footer>", SLOT + "\n  <footer>", 1)
    out = out.replace("</body>", "  " + TAG + "\n</body>", 1)

    if not check:
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(out)
    changed.append(name)

print(f"{'would change' if check else 'changed'}: {len(changed)}")
print(f"skipped: {len(skipped)}")
for s in skipped:
    print("  " + s)
if problems:
    print(f"PROBLEMS: {len(problems)}")
    for p in problems:
        print("  " + p)
    sys.exit(1)
