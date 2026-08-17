"""Add a visible byline + trust links to every guide.

AdSense rejected the site for "low value content" on 2026-08-17. A human
reviewer opening a guide saw no author, no date, and no way to reach anyone:
the author/datePublished/dateModified existed ONLY inside JSON-LD, which
readers cannot see.

This adds, per guide:
  1. a visible byline line under the .meta subtitle, using THAT guide's own
     dateModified/datePublished from its JSON-LD (never an invented date)
  2. About / Contact / Privacy / Terms links in the footer

Idempotent: re-running skips guides already carrying the byline.
Preview by default; pass --apply to write. utf-8, no BOM.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDES = ROOT / "guides"
APPLY = "--apply" in sys.argv

BYLINE_MARK = 'class="byline"'
TRUST_MARK = 'class="trust"'

MONTHS = ["January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"]


def pretty(iso):
    try:
        y, m, d = (int(x) for x in iso.split("-")[:3])
        return f"{MONTHS[m - 1]} {d}, {y}"
    except Exception:
        return None


def dates_from_jsonld(html):
    """Pull datePublished / dateModified out of the guide's own JSON-LD."""
    pub = mod = None
    for block in re.findall(
        r'<script type="application/ld\+json">(.*?)</script>', html, re.S
    ):
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            # fall back to a plain scan; some blocks carry trailing commas
            m = re.search(r'"datePublished"\s*:\s*"([\d-]+)"', block)
            if m:
                pub = pub or m.group(1)
            m = re.search(r'"dateModified"\s*:\s*"([\d-]+)"', block)
            if m:
                mod = mod or m.group(1)
            continue
        for node in data if isinstance(data, list) else [data]:
            if not isinstance(node, dict):
                continue
            pub = pub or node.get("datePublished")
            mod = mod or node.get("dateModified")
    return pub, mod


def build_byline(pub, mod, depth):
    """depth = how many ../ to reach the kit root from the guide folder."""
    up = "../" * depth
    when = ""
    if mod and mod != pub:
        p = pretty(mod)
        if p:
            when = f' · Updated <time datetime="{mod}">{p}</time>'
    elif pub:
        p = pretty(pub)
        if p:
            when = f' · Published <time datetime="{pub}">{p}</time>'
    return (
        f'<p class="byline" style="color:#52525B;font-size:14px;margin:-2px 0 18px">'
        f'By <a href="{up}about.html" rel="author" '
        f'style="color:#0E7490">Michael Nocito</a>, data analyst{when}</p>'
    )


def build_trust(depth):
    up = "../" * depth
    return (
        f'\n    <p class="trust" style="margin:14px 0 0;font-size:14px">'
        f'<a href="{up}about.html">About the author</a> · '
        f'<a href="{up}contact.html">Contact</a> · '
        f'<a href="{up}privacy.html">Privacy</a> · '
        f'<a href="{up}terms.html">Terms</a></p>'
    )


def main():
    files = sorted(GUIDES.glob("*/index.html"))
    changed = skipped = nometa = nofooter = 0
    for f in files:
        html = f.read_text(encoding="utf-8")
        if BYLINE_MARK in html and TRUST_MARK in html:
            skipped += 1
            continue

        # guides/<slug>/index.html -> 2 levels up to the kit root
        depth = len(f.relative_to(ROOT).parts) - 1
        pub, mod = dates_from_jsonld(html)
        out = html

        if BYLINE_MARK not in out:
            # insert directly after the visible .meta subtitle under the h1
            m = re.search(r'(<p class="meta">.*?</p>)', out, re.S)
            if m:
                out = out[: m.end()] + "\n  " + build_byline(pub, mod, depth) + out[m.end():]
            else:
                nometa += 1

        if TRUST_MARK not in out:
            # append inside the footer, before its closing tag
            m = re.search(r"(</footer>)", out)
            if m:
                out = out[: m.start()] + build_trust(depth) + "\n  " + out[m.start():]
            else:
                nofooter += 1

        if out != html:
            changed += 1
            if APPLY:
                f.write_text(out, encoding="utf-8", newline="")

    verb = "updated" if APPLY else "would update"
    print(f"{len(files)} guides scanned")
    print(f"  {verb}: {changed}")
    print(f"  already done, skipped: {skipped}")
    if nometa:
        print(f"  WARNING no .meta line, byline not placed: {nometa}")
    if nofooter:
        print(f"  WARNING no <footer>, trust links not placed: {nofooter}")
    if not APPLY:
        print("\npreview only — pass --apply to write")


if __name__ == "__main__":
    main()
