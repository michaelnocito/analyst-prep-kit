# Audit every published guide against the five writing rules.
# Mechanical signals only; the judgement calls get made from this output.
import io, os, re, json

ROOT = r'C:\Users\Mike\Projects\analyst-prep-kit\guides'

TEARDOWN = re.compile(
    r"\b(unlike|most tutorials|most guides|most people|most courses|most analysts|"
    r"nobody tells you|no one tells you|the problem with|instead of what|"
    r"other tools|other guides|typical advice|conventional wisdom|"
    r"cannot|can't tell you|won't tell you|never teaches?|fails to)\b", re.I)

HOOKY = re.compile(r"\b(here'?s the thing|but first|keep reading|read on|"
                   r"the secret|what nobody|you'?ll never guess|stay with me)\b", re.I)

def strip_html(h):
    # Code is not prose. Counting <pre>/<code>/<svg> as sentences made short guides
    # look unreadable and mis-ranked the whole list on the first run (2026-07-26).
    h = re.sub(r'<script.*?</script>|<style.*?</style>|<head.*?</head>|<!--.*?-->', ' ', h, flags=re.S)
    h = re.sub(r'<pre.*?</pre>|<code.*?</code>|<svg.*?</svg>', ' ', h, flags=re.S)
    # Nav bars, tables of contents and footers are lists of links, not prose. Left in,
    # they merge into single 50-word "sentences" and inflate the average (2026-07-26).
    h = re.sub(r'<nav.*?</nav>|<footer.*?</footer>|<header.*?</header>', ' ', h, flags=re.S)
    h = re.sub(r'<div class="toc">.*?</div>', ' ', h, flags=re.S)
    return h

def text_of(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h)).strip()

rows = []
for d in sorted(os.listdir(ROOT)):
    f = os.path.join(ROOT, d, 'index.html')
    if not os.path.isfile(f):
        continue
    raw = io.open(f, encoding='utf-8', errors='ignore').read()
    body = strip_html(raw)

    title = (re.search(r'<title>(.*?)</title>', raw, re.S) or [None, ''])[1]
    title = re.sub(r'\s+', ' ', title).split('|')[0].strip()

    # subtitle: the first tagline-ish element after h1
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)
    sub = ''
    if h1:
        after = body[h1.end():h1.end() + 1500]
        m = re.search(r'<p[^>]*>(.*?)</p>', after, re.S)
        if m:
            sub = text_of(m.group(1))[:200]

    # first two real paragraphs of prose
    paras = [text_of(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', body, re.S)]
    paras = [p for p in paras if len(p) > 80]
    opening = ' '.join(paras[:2])[:420]

    heads = [text_of(h) for h in re.findall(r'<h2[^>]*>(.*?)</h2>', body, re.S)]
    heads = [h for h in heads if h and len(h) < 90]

    full = text_of(body)
    words = re.findall(r"[A-Za-z0-9']+", full)
    sents = [x for x in re.split(r'(?<=[.!?])\s+', full) if len(x) > 20]
    avg = round(sum(len(re.findall(r"[A-Za-z0-9']+", x)) for x in sents) / max(1, len(sents)), 1)
    longs = sum(1 for x in sents if len(re.findall(r"[A-Za-z0-9']+", x)) > 30)

    imgs = re.findall(r'<img[^>]*>', raw)
    svgs = raw.count('<svg')

    rows.append(dict(
        slug=d, words=len(words), title=title, sub=sub, opening=opening,
        heads=heads, avg=avg, longs=longs, imgs=len(imgs), svgs=svgs,
        teardown=sorted(set(m.group(0).lower() for m in TEARDOWN.finditer(full)))[:6],
        hooky=sorted(set(m.group(0).lower() for m in HOOKY.finditer(full)))[:4],
    ))

rows.sort(key=lambda r: -r['words'])
for r in rows:
    print('=' * 100)
    print('%-30s %5d words   avg sentence %.1f   long(>30w) %d   img %d  svg %d'
          % (r['slug'], r['words'], r['avg'], r['longs'], r['imgs'], r['svgs']))
    print('  SUB : ' + (r['sub'][:170] if r['sub'] else '(none found)'))
    print('  OPEN: ' + r['opening'][:300])
    print('  H2  : ' + ' | '.join(r['heads'][:8]))
    if r['teardown']:
        print('  TEAR: ' + ', '.join(r['teardown']))
    if r['hooky']:
        print('  HOOK: ' + ', '.join(r['hooky']))
