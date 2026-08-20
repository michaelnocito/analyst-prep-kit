# One-time backfill: tag every existing Gumroad cross-link with UTM params so
# Gumroad's Analytics > Links dashboard can tell "traffic from the kit" apart
# from "Direct, email, IM" (which is where 100% of clicks were bucketing).
#
# Medium is derived from the GA4 event already sitting on each link, so the
# mapping stays in sync with how the link is actually used:
#   hub_book_click     -> kit-hub    (book card on a kit hub / homepage)
#   guide_book_click    -> guide      (.book block inside a guide)
#   comment_system_click -> cross-sell (SQL Comment System upsell)
#   prompt_pack_click    -> cross-sell (SQL prompt pack upsell)
# Campaign is the product slug already in the URL, so no separate mapping
# is needed there.
#
# Idempotent: skips any href that already carries utm_source. Reads/writes
# UTF-8 with no BOM and preserves each file's existing line endings.
import io, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MEDIUM_BY_EVENT = {
    "hub_book_click": "kit-hub",
    "guide_book_click": "guide",
    "comment_system_click": "cross-sell",
    "prompt_pack_click": "cross-sell",
}

TAG_RE = re.compile(
    r'<a\b[^>]*?href="https://michaelnocito\.gumroad\.com/l/([a-z0-9-]+)"[^>]*>',
    re.IGNORECASE,
)
EVENT_RE = re.compile(r"gtag\('event',\s*'(\w+)'")


def tag_one(match):
    tag = match.group(0)
    slug = match.group(1)
    if "utm_source=" in tag:
        return tag
    ev = EVENT_RE.search(tag)
    medium = MEDIUM_BY_EVENT.get(ev.group(1)) if ev else None
    if not medium:
        return tag
    old_href = 'href="https://michaelnocito.gumroad.com/l/%s"' % slug
    new_href = (
        'href="https://michaelnocito.gumroad.com/l/%s'
        '?utm_source=analyst-prep-kit&utm_medium=%s&utm_campaign=%s"'
        % (slug, medium, slug)
    )
    return tag.replace(old_href, new_href, 1)


def main():
    changed, skipped = [], []
    for dirpath, _, filenames in os.walk(ROOT):
        if os.sep + ".git" in dirpath + os.sep:
            continue
        for name in filenames:
            if not name.endswith(".html"):
                continue
            path = os.path.join(dirpath, name)
            with io.open(path, "r", encoding="utf-8", newline="") as f:
                src = f.read()
            if "gumroad.com/l/" not in src:
                continue
            new_src, n = TAG_RE.subn(tag_one, src)
            if new_src != src:
                with io.open(path, "w", encoding="utf-8", newline="") as f:
                    f.write(new_src)
                changed.append((os.path.relpath(path, ROOT), n))
            else:
                skipped.append(os.path.relpath(path, ROOT))

    print("Tagged %d files:" % len(changed))
    for p, n in changed:
        print("  %s (%d link%s)" % (p, n, "" if n == 1 else "s"))
    print("No gumroad links changed in %d other files with a gumroad.com/l/ hit" % len(skipped))
    return 0


if __name__ == "__main__":
    sys.exit(main())
