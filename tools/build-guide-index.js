/* Stamps the searchable metadata onto every card in guides/index.html.
 *
 * Run this after adding a guide, then run build-search-index-guides.js:
 *     node tools/build-guide-index.js
 *     node tools/build-search-index-guides.js
 *
 * Without it a new card still shows and still links, but the filter can only
 * match the words visible on the card, and the tool chips will not include it.
 *
 * Idempotent: existing data-tool and data-kw values are recomputed from source
 * every run, so editing a rule below and re-running cannot leave stale words
 * behind.
 *
 * WHY THIS EXISTS. The card titles are deliberately evocative ("The Dialog That
 * Quietly Deletes Your Zip Codes"), which is good writing and bad search: nobody
 * types that. Two layers fix it without rewriting 131 titles.
 *   1. data-kw harvested from each guide's OWN <title> and meta description,
 *      which are literal and keyword-bearing, minus any word already visible on
 *      the card so the attribute stays small.
 *   2. The ALIASES rules below, for words that appear nowhere in the prose:
 *      error strings, menu labels, shorthand, and symptom phrases. Verified
 *      zero-result queries that these fix: utf-8, #n/a, dedupe, remove dupes,
 *      circular reference, why is my total wrong, my numbers are doubled.
 *
 * Write UTF-8 without a BOM. Do not edit these files with PowerShell Set-Content.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'guides');
const FILE = path.join(ROOT, 'index.html');

/* Tools cut across the author-chosen sections: Tableau lives in three of them
   and pandas hides under a heading that starts with "Power BI", so the chips are
   a more truthful navigation model than the headings are. */
const TOOLS = {
  excel: /^excel-|^vlookup-|^budget-vs-actual|^build-a-risk-index|connect-excel/,
  sql: /^sql-|^which-sql|^set-up-a-sql|^sample-database|^practice-sql|^export-sql|^install-postgres|^set-up-duckdb|^entity-resolution|connect-python-to-a-sql|connect-excel-to-a-database|^handle-large/,
  powerbi: /^powerbi-|power-bi/,
  python: /^pandas-|^install-python|^install-jupyter|^sql-and-python|connect-python/,
  tableau: /^tableau-|tableau/,
  stats: /^mean-vs-median|^standard-deviation|^percentiles|^p-values|^confidence|^ab-testing|^how-charts|^moving-averages|^forecast-accuracy|^correlation|^choose-the-right-chart/,
  migration: /^migration-|^what-is-data-migration|^data-migration/,
};
const TOOL_BY_SECTION = {
  'Excel for business analysts': ['excel'],
  'SQL concepts': ['sql'],
  'Data migration': ['migration'],
  'Statistics and charts': ['stats'],
};

const ALIASES = [
  // Error strings and menu labels the prose never prints
  { test: /character-encoding/,                       add: 'utf-8 utf8 unicode ansi mojibake garbled corrupted question marks file origin 65001' },
  { test: /csv-import-leading-zeros/,                 add: 'text to columns import wizard postcode postal code dropped zero product code' },
  { test: /iferror|index-match|vlookup-vs-xlookup/,   add: '#n/a #ref #value na error not found no match' },
  { test: /excel-circular-findings/,                  add: 'circular reasoning tautology begging the question not circular reference' },
  { test: /excel-clean-messy-data/,                   add: 'nbsp non-breaking whitespace invisible character' },
  { test: /excel-power-query/,                        add: 'get and transform m query editor unpivot refresh' },
  { test: /excel-dynamic-arrays/,                     add: '#spill #calc' },
  { test: /excel-dates/,                              add: 'datevalue dd mm yyyy date format wrong' },
  { test: /excel-tables/,                             add: 'ctrl t structured reference' },
  { test: /powerbi-measures-vs-columns/,              add: 'measure calculated column dax which one' },
  { test: /powerbi-calculate|powerbi-switch-true/,    add: 'dax formula' },
  { test: /excel-conditional-formatting/,             add: 'highlight cells colour color rules' },

  // Shorthand and synonyms people type instead of the real word
  { test: /find-duplicates|remove-duplicates|pandas-duplicates/, add: 'dupes dedupe deduplicate distinct unique repeated' },
  { test: /sql-null|pandas-fillna-dropna/,            add: 'blank empty missing nothing' },
  { test: /month-over-month|pct-change|time-intelligence/, add: 'mom period over period previous month' },
  { test: /moving-averages/,                          add: 'rolling average smoothing trailing' },
  { test: /p-values/,                                 add: 'pvalue significance significant' },
  { test: /percentiles-iqr-outliers/,                 add: 'quartile outlier median split' },
  { test: /sql-group-by-having/,                      add: 'summarize aggregate totals per category' },
  { test: /sql-window-functions/,                     add: 'over partition rank row number top per group' },

  /* Symptom phrases: what people type when they do not know the cause. Query
     stopwords are stripped in the page script, so "why is my total wrong"
     arrives here as "total wrong". */
  { test: /sql-joins|pandas-merge/,                   add: 'total wrong doubled double counting numbers too high fan out' },
  { test: /sql-reconciliation/,                       add: 'totals do not match numbers different mismatch' },
  { test: /excel-sum-of-id-trap|excel-check-your-work/, add: 'wrong number confident wrong sanity check' },
];

const STOP = new Set(('a an the and or but of in on at to for from with without by as is are was were be been it its ' +
  'that this these those what why how when which who you your yours we our they their them not no nor so than then ' +
  'there here all any both each few more most other some such only own same too very can will just do does did doing ' +
  'done have has had having if into out up down over under again further once about against between through during ' +
  'before after above below off one two three four five six seven eight nine ten every real plus').split(' '));

const toks = s => (s || '').toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').split(' ')
  .filter(w => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));

/* Some guide <title> tags write the dash as &mdash;. Decode it, or the suffix
   strip below misses and every keyword list picks up "mdash analyst prep kit". */
const clean = s => s.replace(/<[^>]*>/g, '')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&mdash;|&#8212;/g, '—').replace(/&ndash;|&#8211;/g, '–')
  .replace(/\s+/g, ' ').trim();

// The file is CRLF throughout. Work in LF, restore on write.
let html = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

/* Pass 1: collect each card with the <h2> section above it. */
const cards = [];
let section = '';
const scan = /<h2>([\s\S]*?)<\/h2>|<a class="gcard"[^>]*href="([^"]+)"[^>]*>\s*<p class="t">([\s\S]*?)<\/p>\s*<p class="d">([\s\S]*?)<\/p>/g;
let m;
while ((m = scan.exec(html)) !== null) {
  if (m[1] !== undefined) { section = clean(m[1]).replace(/\d+$/, '').trim(); continue; }
  cards.push({ href: m[2], title: clean(m[3]), desc: clean(m[4]), section });
}
if (!cards.length) throw new Error('no cards found; has the markup changed?');

/* Pass 2: work out the attributes for each card. */
const meta = new Map();
for (const c of cards) {
  const slug = c.href.replace(/^\.\.\//, '').replace(/\/$/, '');
  /* ../drill/ and ../viz/ are apps, not guides: flagged so the count excludes
     them, but their own pages are still read so the filter can find them. */
  const external = c.href.startsWith('..');
  const guideFile = path.join(ROOT, c.href, 'index.html');

  let pageTitle = '', metaDesc = '';
  if (fs.existsSync(guideFile)) {
    const g = fs.readFileSync(guideFile, 'utf8');
    const t = g.match(/<title>([\s\S]*?)<\/title>/i);
    const d = g.match(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i);
    pageTitle = t ? clean(t[1]).replace(/ — Analyst Prep Kit$/, '') : '';
    metaDesc = d ? clean(d[1]) : '';
    if (!metaDesc) console.warn('  no meta description, weaker search: ' + slug);
  }

  const visible = new Set(toks(c.title + ' ' + c.desc + ' ' + c.section));
  const kw = [...new Set(toks(pageTitle + ' ' + metaDesc + ' ' + slug.replace(/-/g, ' ')))].filter(w => !visible.has(w));
  const have = new Set(kw);
  for (const r of ALIASES) {
    if (!r.test.test(slug)) continue;
    for (const w of r.add.split(' ')) if (!have.has(w)) { have.add(w); kw.push(w); }
  }

  const tools = new Set(TOOL_BY_SECTION[c.section] || []);
  for (const [t, re] of Object.entries(TOOLS)) if (re.test(slug)) tools.add(t);
  // Two Tableau guides are filed under "SQL concepts". The chip gathers them
  // without moving the cards and breaking anybody's bookmark.
  if (/^tableau-/.test(slug)) tools.delete('sql');

  meta.set(c.href, { kw: kw.join(' ').replace(/"/g, ''), tools: [...tools].sort(), external });
}

/* Pass 3: rewrite the opening tags, dropping any attributes from a prior run. */
let n = 0;
html = html.replace(/<a class="gcard"[^>]*href="([^"]+)"[^>]*>/g, (full, href) => {
  const d = meta.get(href);
  if (!d) throw new Error('no metadata computed for ' + href);
  n++;
  return '<a class="gcard"' + (d.external ? ' data-kind="app"' : '') +
    ' href="' + href + '" data-tool="' + d.tools.join(' ') + '" data-kw="' + d.kw + '">';
});

fs.writeFileSync(FILE, html.replace(/\n/g, '\r\n'));

const counts = {};
for (const d of meta.values()) for (const t of d.tools) counts[t] = (counts[t] || 0) + 1;
const guides = cards.length - [...meta.values()].filter(d => d.external).length;
console.log('cards stamped: ' + n + ' (' + guides + ' guides, ' + (n - guides) + ' app links)');
console.log('tool counts:  ' + Object.entries(counts).sort((a, b) => b[1] - a[1]).map(x => x[0] + ' ' + x[1]).join(', '));
console.log('\nThe page computes its own counts at runtime, so nothing else needs updating here.');
console.log('Next: node tools/build-search-index-guides.js');
