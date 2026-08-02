"""
build_migration_ebook.py — the data migration series as one EPUB.

    python build_migration_ebook.py

Reads the seventeen live guides, strips the web furniture (nav, CTAs, the book
promo, the subscribe block, the footer), and writes a single EPUB 3 in reading
order. Kindle takes EPUB directly through Send to Kindle, so no MOBI step.

The reading order is the "Up next" chain on the site, walked from the first
guide, so the book and the site can never disagree about what comes next.
"""

import os
import re
import shutil
import zipfile
from datetime import date

from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont

GUIDES = 'guides'
OUT = os.path.join('dist', 'ebook')

TITLE = 'Running a Data Migration'
SUBTITLE = 'The eight stages, end to end'
AUTHOR = 'Michael Nocito'
UID = 'urn:uuid:migration-series-nocito-2026-08'
SITE = 'https://michaelnocito.github.io/analyst-prep-kit/guides/'

# Blocks that exist for the web and have no job in a book.
DROP_SELECTORS = ['.crumb', '.cta', '.book', '.seriesnav', 'footer',
                  '[data-apk-subscribe]', 'script', 'style', '.copy']

FONTS = 'C:/Windows/Fonts/'

CSS = """\
body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; margin: 0 6%; }
h1 { font-size: 1.6em; line-height: 1.25; margin: 1.2em 0 .2em; }
h2 { font-size: 1.2em; margin: 1.6em 0 .4em; }
h3 { font-size: 1.05em; margin: 1.2em 0 .3em; }
p { margin: .6em 0; }
.meta { font-style: italic; color: #555; font-size: .9em; }
.note, .gate, .toc { border: 1px solid #bbb; border-radius: 6px;
    padding: .6em .9em; margin: 1em 0; font-size: .95em; background: #f4f4f4; }
.gate .g { text-transform: uppercase; letter-spacing: .08em;
    font-size: .8em; font-weight: bold; margin: 0 0 .2em; }
.email { border: 1px solid #bbb; border-radius: 6px; margin: 1em 0; font-size: .95em; }
.email .hdr { background: #eee; border-bottom: 1px solid #bbb; padding: .5em .8em;
    font-size: .9em; }
.email .body { padding: .6em .8em; }
.stamp { font-size: .85em; color: #555; font-style: italic; }
.v { background: #fdf0c8; }
table { border-collapse: collapse; width: 100%; font-size: .85em; margin: .8em 0; }
th, td { border: 1px solid #bbb; padding: .35em .5em; text-align: left;
    vertical-align: top; }
th { background: #eee; }
code { font-family: 'Courier New', monospace; font-size: .9em; }
ul, ol { margin: .6em 0; padding-left: 1.4em; }
li { margin: .3em 0; }
.refs { font-size: .85em; color: #444; }
hr { border: 0; border-top: 1px solid #ccc; margin: 2em 0; }
.chapno { font-size: .8em; letter-spacing: .12em; text-transform: uppercase;
    color: #666; margin: 1.5em 0 0; }
"""


def chain():
    """Walk the site's own Up next links, so the book order matches the site."""
    order, cur, seen = [], 'what-is-data-migration', set()
    while cur and cur not in seen:
        seen.add(cur)
        order.append(cur)
        path = os.path.join(GUIDES, cur, 'index.html')
        m = re.search(r'<a class="next" href="\.\./([^/]+)/">', open(path, encoding='utf-8').read())
        cur = m.group(1) if m else None
    return order


def esc(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
             .replace('"', '&quot;'))


def chapter(slug, n, slug_to_file):
    soup = BeautifulSoup(open(os.path.join(GUIDES, slug, 'index.html'), encoding='utf-8'), 'html.parser')
    title = soup.title.get_text().split('&mdash;')[0].split('—')[0].strip()
    main = soup.find('main')
    for sel in DROP_SELECTORS:
        for el in main.select(sel):
            el.decompose()

    # Internal links point at chapters; everything else goes to the live site.
    for a in main.find_all('a', href=True):
        href = a['href']
        m = re.match(r'\.\./([a-z0-9-]+)/?$', href)
        if m and m.group(1) in slug_to_file:
            a['href'] = slug_to_file[m.group(1)]
        elif href.startswith('../../') or href.startswith('../'):
            a['href'] = SITE if href.startswith('../../') else SITE + href[3:]
        elif href.startswith('#'):
            pass
        elif href.endswith('.xlsx') or href.endswith('.pdf'):
            a['href'] = SITE + 'data-migration-stages/toolkit/' + os.path.basename(href)

    for tag in main.find_all(True):
        tag.attrs.pop('onclick', None)
        tag.attrs.pop('target', None)
        tag.attrs.pop('rel', None)
        if tag.name == 'button':
            tag.decompose()

    body = main.decode_contents()
    # XHTML wants every tag closed.
    body = re.sub(r'<(br|hr|img)([^>]*?)(?<!/)>', r'<\1\2/>', body)
    body = body.replace('&nbsp;', '&#160;').replace('&middot;', '&#183;')
    body = body.replace('&mdash;', '&#8212;').replace('&ndash;', '&#8211;')
    body = body.replace('&larr;', '&#8592;').replace('&rarr;', '&#8594;')
    body = body.replace('&rsquo;', '&#8217;').replace('&amp;', '&#38;')

    return title, (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<!DOCTYPE html>\n'
        '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n'
        '<head><meta charset="utf-8"/><title>%s</title>'
        '<link rel="stylesheet" type="text/css" href="style.css"/></head>\n'
        '<body>\n<p class="chapno">Chapter %d</p>\n%s\n</body>\n</html>\n'
        % (esc(title), n, body))


def cover_png(path):
    """A plain cover. The title has to be legible as a thumbnail."""
    W, H = 1200, 1800
    img = Image.new('RGB', (W, H), '#F7F8F9')
    d = ImageDraw.Draw(img)
    d.rectangle([0, H - 90, W, H], fill='#0E7490')
    d.rectangle([100, 470, 340, 486], fill='#0E7490')

    def font(name, size):
        return ImageFont.truetype(FONTS + name, size)

    d.text((100, 300), 'THE ANALYST PREP KIT', font=font('segoeuib.ttf', 40), fill='#0E7490')
    y = 560
    for line in ['Running a', 'Data', 'Migration']:
        d.text((100, y), line, font=font('segoeuib.ttf', 130), fill='#111111')
        y += 155
    d.text((100, y + 60), SUBTITLE, font=font('segoeui.ttf', 52), fill='#444444')
    d.text((100, H - 260), AUTHOR, font=font('segoeui.ttf', 46), fill='#666666')
    img.save(path, 'PNG')


def build():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    oebps = os.path.join(OUT, 'OEBPS')
    os.makedirs(os.path.join(OUT, 'META-INF'))
    os.makedirs(oebps)

    order = chain()
    slug_to_file = {s: 'ch%02d.xhtml' % (i + 1) for i, s in enumerate(order)}

    titles = []
    for i, slug in enumerate(order):
        title, xhtml = chapter(slug, i + 1, slug_to_file)
        titles.append(title)
        open(os.path.join(oebps, slug_to_file[slug]), 'w', encoding='utf-8').write(xhtml)

    open(os.path.join(oebps, 'style.css'), 'w', encoding='utf-8').write(CSS)
    cover_png(os.path.join(oebps, 'cover.png'))

    open(os.path.join(OUT, 'mimetype'), 'w', encoding='utf-8').write('application/epub+zip')
    open(os.path.join(OUT, 'META-INF', 'container.xml'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n'
        '<rootfiles><rootfile full-path="OEBPS/content.opf" '
        'media-type="application/oebps-package+xml"/></rootfiles></container>\n')

    open(os.path.join(oebps, 'cover.xhtml'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
        '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"/>'
        '<title>Cover</title></head><body style="margin:0;text-align:center">'
        '<img src="cover.png" alt="Cover" style="max-width:100%;height:auto"/>'
        '</body></html>\n')

    nav_items = '\n'.join(
        '      <li><a href="%s">%s</a></li>' % (slug_to_file[s], esc(t))
        for s, t in zip(order, titles))
    open(os.path.join(oebps, 'nav.xhtml'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">\n'
        '<head><meta charset="utf-8"/><title>Contents</title>'
        '<link rel="stylesheet" type="text/css" href="style.css"/></head>\n'
        '<body><nav epub:type="toc" id="toc"><h1>Contents</h1>\n    <ol>\n%s\n    </ol>\n'
        '</nav></body></html>\n' % nav_items)

    points = '\n'.join(
        '  <navPoint id="n%d" playOrder="%d"><navLabel><text>%s</text></navLabel>'
        '<content src="%s"/></navPoint>' % (i + 1, i + 1, esc(t), slug_to_file[s])
        for i, (s, t) in enumerate(zip(order, titles)))
    open(os.path.join(oebps, 'toc.ncx'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">\n'
        '<head><meta name="dtb:uid" content="%s"/></head>\n'
        '<docTitle><text>%s</text></docTitle>\n<navMap>\n%s\n</navMap></ncx>\n'
        % (UID, esc(TITLE), points))

    manifest = '\n'.join(
        '    <item id="ch%02d" href="%s" media-type="application/xhtml+xml"/>'
        % (i + 1, slug_to_file[s]) for i, s in enumerate(order))
    spine = '\n'.join('    <itemref idref="ch%02d"/>' % (i + 1) for i in range(len(order)))
    open(os.path.join(oebps, 'content.opf'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bid">\n'
        '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
        '    <dc:identifier id="bid">%s</dc:identifier>\n'
        '    <dc:title>%s</dc:title>\n    <dc:creator>%s</dc:creator>\n'
        '    <dc:language>en</dc:language>\n    <dc:description>%s</dc:description>\n'
        '    <meta property="dcterms:modified">%sT00:00:00Z</meta>\n'
        '    <meta name="cover" content="cover-img"/>\n  </metadata>\n'
        '  <manifest>\n'
        '    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n'
        '    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n'
        '    <item id="css" href="style.css" media-type="text/css"/>\n'
        '    <item id="cover-img" href="cover.png" media-type="image/png" properties="cover-image"/>\n'
        '    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>\n'
        '%s\n  </manifest>\n'
        '  <spine toc="ncx">\n    <itemref idref="cover"/>\n    <itemref idref="nav"/>\n%s\n  </spine>\n'
        '</package>\n'
        % (UID, esc(TITLE), esc(AUTHOR), esc(SUBTITLE), date.today().isoformat(),
           manifest, spine))

    # mimetype must be first and stored, or readers reject the file.
    epub = os.path.join('dist', 'Running-a-Data-Migration.epub')
    with zipfile.ZipFile(epub, 'w') as z:
        z.write(os.path.join(OUT, 'mimetype'), 'mimetype', zipfile.ZIP_STORED)
        for root, _, files in os.walk(OUT):
            for f in sorted(files):
                if f == 'mimetype':
                    continue
                full = os.path.join(root, f)
                z.write(full, os.path.relpath(full, OUT).replace('\\', '/'),
                        zipfile.ZIP_DEFLATED)
    return epub, order, titles


if __name__ == '__main__':
    p, order, titles = build()
    print('%d chapters -> %s' % (len(order), os.path.abspath(p)))
    for i, t in enumerate(titles, 1):
        print('  %2d. %s' % (i, t))
