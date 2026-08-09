/* Adds the guides to the site-wide search index that powers the Ctrl+K palette
   on the kit home page.
 *
 * The palette reads assets/search-index.json, which held only kit lessons and
 * glossary terms, so none of the guides could be found from the front door even
 * though it says "Search any topic". This reads guides/index.html, which stays
 * the single source of truth, and rewrites the "guides" key in place.
 *
 * Run it after adding a guide to guides/index.html:
 *     node tools/build-search-index-guides.js
 *
 * Titles and keywords are indexed; the 30-word card descriptions are not,
 * because they would roughly triple the file the palette downloads and the
 * keywords already carry the literal terms people type. The section name goes
 * in as the result's subtitle.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'guides', 'index.html');
const OUT = path.join(ROOT, 'assets', 'search-index.json');

const html = fs.readFileSync(SRC, 'utf8');

const clean = s => s.replace(/<[^>]*>/g, '')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ').trim();

/* Walk in document order so each card inherits the <h2> above it. */
const guides = [];
let section = '';
/* Attributes are read out of the captured tag one at a time rather than pinned
   to an order. An earlier version required data-kw to sit immediately after
   data-tool, and adding data-min between them silently matched nothing. */
const re = /<h2>([\s\S]*?)<\/h2>|<a class="gcard"([^>]*)>\s*<p class="t">([\s\S]*?)<\/p>/g;
const attr = (tag, name) => {
  const m = tag.match(new RegExp(name + '="([^"]*)"'));
  return m ? m[1] : '';
};
let m;
while ((m = re.exec(html)) !== null) {
  // Drop the count span before cleaning; it holds "17 · 4-7 min read" now, so a
  // trailing-digits strip no longer removes it.
  if (m[1] !== undefined) { section = clean(m[1].replace(/<span class="seccount"[\s\S]*?<\/span>/g, '')).trim(); continue; }
  const tag = m[2], title = m[3];
  const href = attr(tag, 'href');
  if (!href) throw new Error('a .gcard has no href: ' + tag.slice(0, 80));
  // ../drill/ and ../viz/ are apps, already reachable from the palette
  if (/data-kind="app"/.test(tag) || href.startsWith('..')) continue;
  guides.push({
    t: clean(title),
    h: href.replace(/\/$/, ''),
    u: section,
    k: [attr(tag, 'data-kw'), attr(tag, 'data-tool'), href.replace(/[/-]/g, ' ')].join(' ').replace(/\s+/g, ' ').trim(),
  });
}

if (guides.length < 100) throw new Error('only found ' + guides.length + ' guides, refusing to write a truncated index');

const ix = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const before = (ix.guides || []).length;
ix.guides = guides;

/* Matches the existing file's shape: one line per top-level key. */
const body = Object.keys(ix).map(k => JSON.stringify(k) + ':' + JSON.stringify(ix[k])).join(',\n');
fs.writeFileSync(OUT, '{\n' + body + '\n}\n');

console.log('guides indexed: ' + before + ' -> ' + guides.length);
console.log('sections: ' + [...new Set(guides.map(g => g.u))].join(', '));
console.log('index size: ' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB');
