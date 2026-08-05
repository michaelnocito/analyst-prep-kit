# Builds the data-migration guide cluster under guides/.
# One dict entry per article. Run: python build_migration_guides.py
import io, os, re

BASE = "https://michaelnocito.github.io/analyst-prep-kit"
HERE = os.path.dirname(os.path.abspath(__file__))

SERIES = [
    ("what-is-data-migration",   "What Data Migration Actually Is"),
    ("data-migration-stages",    "The Eight Stages of a Data Migration"),
    ("migration-kickoff-scope",  "Stage 1: Kickoff and Scope"),
    ("migration-profiling",      "Stage 2: Profile the Source"),
    ("migration-field-mapping",  "Stage 3: Map the Fields"),
    ("migration-cleaning",       "Stage 4: Clean and De-dupe"),
    ("migration-dry-run",        "Stage 5: The Dry Run"),
    ("migration-uat",            "Stage 6: User Acceptance Testing"),
    ("migration-cutover",        "Stage 7: Freeze, Cutover, Bridge"),
    ("migration-hypercare",      "Stage 8: Hypercare and Close"),
    ("migration-questions",      "Ask the Right Questions First"),
    ("migration-pitfalls",       "What Goes Wrong, and What It Costs"),
    ("migration-quiet-client",   "When the Client Goes Quiet"),
    ("migration-scope-creep",    "Scope Creep and the Project Plan"),
    ("migration-emails",         "The Emails That Keep a Migration Moving"),
    ("migration-file-hygiene",   "Keeping Your Own Files Straight"),
]
TITLES = dict(SERIES)

STYLE = """  :root{--bg:#F5F7F8;--ink:#09090B;--muted:#52525B;--accent:#0E7490;--line:#E4E7EA;--card:#FFFFFF}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.7 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
  main{max-width:760px;margin:0 auto;padding:40px 22px 80px}
  a{color:var(--accent)}
  h1{font-size:32px;line-height:1.25;margin:10px 0 6px}
  h2{font-size:21px;margin:40px 0 10px}
  h3{font-size:17px;margin:26px 0 6px}
  .meta{color:var(--muted);font-size:14px;margin-bottom:20px}
  .crumb{font-size:14px}
  .note{background:#E0F2F7;border:1px solid var(--line);border-radius:12px;padding:14px 18px;font-size:15px;margin:18px 0}
  .step{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin:16px 0}
  .step h2{margin:0 0 8px;font-size:19px}
  code{background:#F1F3F5;border-radius:5px;padding:1px 6px;font-size:14.5px}
  pre{background:#18181B;color:#F5F7F8;border-radius:12px;padding:16px 18px;overflow-x:auto;font-size:14.5px;line-height:1.6}
  pre code{background:none;color:inherit;padding:0}
  table{border-collapse:collapse;width:100%;font-size:14.5px;margin:12px 0}
  th,td{border:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}
  th{background:#E0F2F7}
  .cta{background:var(--card);border:2px solid var(--accent);border-radius:14px;padding:18px 20px;margin:34px 0}
  .cta a.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;border-radius:10px;padding:10px 18px;font-weight:600;margin-top:8px}
  footer{border-top:1px solid var(--line);margin-top:48px;padding-top:18px;font-size:14px;color:var(--muted)}
  .toc{font-size:15px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 20px}
  .toc ol{margin:6px 0 4px;padding-left:22px}
  .refs{font-size:14px;color:var(--muted)}
  .refs li{margin-bottom:8px}
  .seriesnav{font-size:14px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 18px;margin:26px 0}"""

OTHER_GUIDES = ('<a href="../entity-resolution/">Entity Resolution</a> · '
    '<a href="../documenting-data-limitations/">Documenting Limitations</a> · '
    '<a href="../exploratory-data-analysis/">Exploratory Data Analysis</a> · '
    '<a href="../handle-large-datasets/">Handle Large Datasets</a> · '
    '<a href="../sql-count-function/">COUNT in SQL</a> · '
    '<a href="../sql-joins/">SQL JOINs</a> · '
    '<a href="../sql-group-by-having/">GROUP BY and HAVING</a> · '
    '<a href="../defining-metrics/">Defining Metrics</a> · '
    '<a href="../technical-tenacity/">Technical Tenacity</a> · '
    '<a href="../../sql/">SQL Kit</a> · '
    '<a href="../../projects/">Portfolio Projects</a>')

CTA = """  <div class="cta">
    <strong>The checking work is SQL, and it is not advanced SQL.</strong>
    <p style="margin:6px 0 0">Counting rows, grouping to find duplicates, and joining to find orphans covers most of what a migration asks of you. The <a href="../../sql/">SQL Kit</a> teaches those moves in order, with the data in front of you.</p>
    <a class="btn" href="../../sql/">Open the SQL Kit &rarr;</a>
    <p style="margin:10px 0 0;font-size:15px">Or start typing straight away: <a href="../../drill/">open SQL Drill</a>, thirteen queries that each add one thing to the last.</p>
  </div>"""


def series_nav(slug):
    idx = [s for s, _ in SERIES].index(slug)
    bits = []
    if idx > 0:
        p = SERIES[idx - 1][0]
        bits.append('Previous: <a href="../%s/">%s</a>' % (p, TITLES[p]))
    if idx < len(SERIES) - 1:
        n = SERIES[idx + 1][0]
        bits.append('Next: <a href="../%s/">%s</a>' % (n, TITLES[n]))
    if slug != "data-migration-stages":
        bits.append('All eight stages: <a href="../data-migration-stages/">the series hub</a>')
    return '<p class="seriesnav">' + ' &nbsp;·&nbsp; '.join(bits) + '</p>'


def page(slug, h1, seo_title, desc, meta_line, body, refs):
    ref_html = ""
    if refs:
        ref_html = '<h2>References</h2>\n  <ol class="refs">\n' + \
            "".join("    <li>%s</li>\n" % r for r in refs) + "  </ol>\n"
    return """<!doctype html>
<html lang="en">
<head>
<!-- GA owner opt-out: load any page with ?ga=off to stop being counted, ?ga=on to undo. -->
<script>
  (function () {
    var localHost = location.protocol === 'file:' ||
      /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname) ||
      /^(192\.168\.|10\.)/.test(location.hostname);
    var optedOut = false;
    try {
      var p = new URLSearchParams(location.search).get('ga');
      if (p === 'off') localStorage.setItem('gaOptOut', '1');
      else if (p === 'on') localStorage.removeItem('gaOptOut');
      optedOut = localStorage.getItem('gaOptOut') === '1';
    } catch (e) {}
    if (localHost || optedOut) window['ga-disable-G-6C09BL3WH1'] = true;
  })();
</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6C09BL3WH1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-6C09BL3WH1');
</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(seo)s &mdash; Analyst Prep Kit</title>
<meta name="description" content="%(desc)s">
<link rel="canonical" href="%(base)s/guides/%(slug)s/">
<meta property="og:title" content="%(h1)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:type" content="article">
<meta property="og:url" content="%(base)s/guides/%(slug)s/">
<meta name="twitter:card" content="summary_large_image">
<style>
%(style)s
</style>
</head>
<body>
<main>
  <p class="crumb"><a href="../../">&larr; All Kits</a> &middot; <a href="../">All Guides</a> &middot; <a href="../data-migration-stages/">Data Migration Series</a></p>
  <h1>%(h1)s</h1>
  <p class="meta">%(meta)s &middot; Part of the <a href="../../">Analyst Prep Kit</a></p>

%(body)s

%(nav)s

%(cta)s

  %(refs)s
  <footer>
    <a href="../../">&larr; Analyst Prep Kit</a> &middot; %(others)s
    <p style="margin-top:10px"><a href="https://buymeacoffee.com/michaelnocito" target="_blank" rel="noopener">Buy Me a Coffee &#9749;</a></p>
  </footer>
</main>
</body>
</html>
""" % dict(seo=seo_title, desc=desc, base=BASE, slug=slug, h1=h1, meta=meta_line,
           style=STYLE, body=body, nav=series_nav(slug), cta=CTA, refs=ref_html,
           others=OTHER_GUIDES)


ARTICLES = {}


def add(slug, seo_title, desc, meta_line, body, refs=()):
    ARTICLES[slug] = (TITLES[slug], seo_title, desc, meta_line, body, refs)


def build():
    missing = [s for s, _ in SERIES if s not in ARTICLES]
    if missing:
        raise SystemExit("missing article content: %s" % ", ".join(missing))
    for slug, _ in SERIES:
        h1, seo, desc, meta_line, body, refs = ARTICLES[slug]
        d = os.path.join(HERE, "guides", slug)
        if not os.path.isdir(d):
            os.makedirs(d)
        html = page(slug, h1, seo, desc, meta_line, body, refs)
        if "—" in html.replace("&mdash;", ""):
            raise SystemExit("em-dash found in %s" % slug)
        io.open(os.path.join(d, "index.html"), "w", encoding="utf8").write(html)
        print("wrote guides/%s/index.html  (%d chars)" % (slug, len(html)))


from migration_content import load  # noqa: E402
load(add)

if __name__ == "__main__":
    build()
