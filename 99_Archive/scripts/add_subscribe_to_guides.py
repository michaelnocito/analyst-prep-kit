"""Put the shared subscribe block on every guide that lacks it.

The block sits after the content, before the nav footer
(HANDOFF-email-capture.md section 8). The old donate line it once
replaced was removed sitewide on 2026-11-20.

Safe to run twice: it skips any page already carrying the block.

    python add_subscribe_to_guides.py          # do it
    python add_subscribe_to_guides.py --check   # report only, change nothing
"""

import glob
import os
import sys

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
    if "<footer>" not in html or "</body>" not in html:
        problems.append(f"{name}: no <footer> or </body> to anchor to")
        continue

    out = html
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
