"""Rewrite every michaelnocito.github.io reference to a new custom domain.

Run this on migration day, after DNS is live and the certificate has issued.
GitHub Pages 301-redirects the old host to the custom domain and preserves the
full path, so nothing breaks if a reference is missed. The one exception is
rel="canonical": a canonical still naming the old host tells Google the old URL
is the real one, which would undo the whole move. So canonicals are counted
separately and reported on their own.

    python tools/retarget-domain.py michaelnocito.com            # preview
    python tools/retarget-domain.py michaelnocito.com --apply    # write

crosspost-src is skipped on purpose. Those files mirror articles already
published on dev.to and Medium; their canonicals point at the old URLs, which
now 301, and that is the correct behaviour.
"""

import argparse
import re
import sys
from pathlib import Path

OLD_HOST = "michaelnocito.github.io"

PROJECTS = Path(r"C:\Users\Mike\Projects")

# Every repo published under the Pages account. The user-site repo carries the
# CNAME file, so all of these move together.
REPOS = [
    "michaelnocito.github.io",
    "analyst-prep-kit",
    "play-area",
    "prep-companion-apps",
    "steam-hidden-gems-list",
    "music-hidden-gems-list",
    "keygarden",
    "sql-quest",
    "nexus-sql-mystery",
    "spreadsheet-archaeology",
    "recordforge",
    "spreadsheet-cleaner",
    "sql-dry-run",
    "sql-trail",
    "draw-lab",
    "migration-toolkit",
    "prep-loop",
    "excel-interview",
    "playtest-tracker",
]

SUFFIXES = {".html", ".htm", ".xml", ".js", ".json", ".txt", ".md", ".py", ".css"}

SKIP_DIRS = {".git", "node_modules", "dist", "__pycache__", "crosspost-src", ".venv"}

CANONICAL = re.compile(r'rel=["\']canonical["\'][^>]*' + re.escape(OLD_HOST))


def walk(repo_root):
    for path in repo_root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in SUFFIXES:
            continue
        if SKIP_DIRS & set(path.relative_to(repo_root).parts):
            continue
        yield path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("new_host", help="the bare custom domain, e.g. michaelnocito.com")
    ap.add_argument("--apply", action="store_true", help="write changes (default is preview)")
    args = ap.parse_args()

    new_host = args.new_host.strip().lower()
    for bad in ("http://", "https://", "/"):
        if bad in new_host:
            print(f"give the bare host, not a URL: got {args.new_host!r}")
            return 2
    if new_host == OLD_HOST:
        print("new host is the old host")
        return 2

    grand_files = grand_hits = grand_canon = 0
    missing = []

    for name in REPOS:
        root = PROJECTS / name
        if not root.is_dir():
            missing.append(name)
            continue

        files = hits = canon = 0
        for path in walk(root):
            try:
                text = path.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            if OLD_HOST not in text:
                continue

            n = text.count(OLD_HOST)
            c = len(CANONICAL.findall(text))
            files += 1
            hits += n
            canon += c

            if args.apply:
                # newline="" keeps existing line endings; utf-8 with no BOM,
                # because a BOM breaks XML parsers on the sitemaps.
                path.write_text(
                    text.replace(OLD_HOST, new_host), encoding="utf-8", newline=""
                )

        if files:
            print(f"{name:<28} {hits:>5} refs in {files:>4} files  ({canon} canonical)")
        grand_files += files
        grand_hits += hits
        grand_canon += canon

    if missing:
        print("\nrepos not found locally, skipped: " + ", ".join(missing))

    print(f"\n{grand_hits} refs in {grand_files} files, {grand_canon} of them canonical tags")
    print("WRITTEN" if args.apply else "preview only, re-run with --apply to write")

    if args.apply:
        print("\nnext, in order:")
        print("  1. rebuild the guide index and search index in analyst-prep-kit")
        print("  2. update HOST and KEY_LOCATION in tools/indexnow.py, move the key file")
        print("  3. add the new domain to Supabase Auth URLs and the Google OAuth client")
        print("     BEFORE anyone tries to sign in")
        print("  4. commit and push every repo listed above")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
