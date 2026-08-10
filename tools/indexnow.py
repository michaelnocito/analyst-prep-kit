"""Push every sitemap URL to IndexNow.

IndexNow is the ping protocol Bing, Yandex, Seznam and Naver share. One POST
tells all of them a set of URLs exists or changed, instead of waiting for a
crawler to wander in. Google does not take part, so this is a second channel,
not a replacement for Search Console.

The key lives at the root of the host as a plain text file whose contents are
the key itself. That file is how the API proves the caller owns the site, so
it has to be live before the first submission or every call comes back 403.

Usage:
    python tools/indexnow.py            # submit everything in both sitemaps
    python tools/indexnow.py --dry-run  # print what would be sent
    python tools/indexnow.py <url> ...  # submit only the URLs given
"""

import json
import sys
import urllib.request
import xml.etree.ElementTree as ET

HOST = "michaelnocito.github.io"
KEY = "b223a683d4dcab1b439d53ab20c6ebb6"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"

SITEMAPS = [
    f"https://{HOST}/sitemap-sites.xml",
    f"https://{HOST}/analyst-prep-kit/sitemap.xml",
]

NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "indexnow-submit/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def urls_from_sitemap(url):
    """Return every <loc> in a sitemap, following one level of index if needed."""
    root = ET.fromstring(fetch(url))
    if root.tag.endswith("sitemapindex"):
        out = []
        for child in root.findall("sm:sitemap/sm:loc", NS):
            out.extend(urls_from_sitemap(child.text.strip()))
        return out
    return [loc.text.strip() for loc in root.findall("sm:url/sm:loc", NS)]


def submit(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.status, resp.read().decode("utf-8", "replace")


def main():
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry_run = "--dry-run" in sys.argv

    if args:
        urls = args
    else:
        urls = []
        for sm in SITEMAPS:
            found = urls_from_sitemap(sm)
            print(f"{len(found):>4} URLs from {sm}")
            urls.extend(found)

    # A URL listed in two sitemaps should still only be sent once.
    urls = list(dict.fromkeys(urls))

    off_host = [u for u in urls if f"//{HOST}/" not in u]
    if off_host:
        print(f"skipping {len(off_host)} URLs not on {HOST}")
        urls = [u for u in urls if u not in off_host]

    print(f"\n{len(urls)} URLs ready")
    if dry_run:
        for u in urls:
            print("  " + u)
        return 0

    # The key file has to be readable or every submission is rejected.
    try:
        live_key = fetch(KEY_LOCATION).decode().strip()
    except Exception as exc:
        print(f"key file not reachable at {KEY_LOCATION}: {exc}")
        return 1
    if live_key != KEY:
        print(f"key file says {live_key!r}, expected {KEY!r}")
        return 1
    print(f"key file verified at {KEY_LOCATION}")

    # 10,000 per request is the documented ceiling; batch well under it.
    sent = 0
    for i in range(0, len(urls), 500):
        batch = urls[i : i + 500]
        try:
            status, body = submit(batch)
        except urllib.error.HTTPError as exc:
            print(f"batch {i // 500 + 1}: HTTP {exc.code} {exc.read().decode('utf-8', 'replace')[:300]}")
            return 1
        sent += len(batch)
        print(f"batch {i // 500 + 1}: HTTP {status} ({len(batch)} URLs) {body[:120]}")

    print(f"\nsubmitted {sent} URLs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
