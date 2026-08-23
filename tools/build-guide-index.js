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
  /* The four Financial analysis guides added 2026-08-11 are worked in SQL, so
     they earn the sql chip on their slug even though their section heading is
     not about SQL. They ALSO carry the finance chip, which they get from
     TOOL_BY_SECTION below. A card can hold several tools: data-tool is space
     separated and the page pads it before matching. That double tagging is the
     point. A first-run user test on 2026-08-11 pressed all seven chips and found
     the section vanished under five of them, because nobody hunting for margins
     presses SQL, and finance is the one dimension the row had no word for. */
  sql: /^sql-|^which-sql|^set-up-a-sql|^sample-database|^practice-sql|^export-sql|^install-postgres|^set-up-duckdb|^entity-resolution|connect-python-to-a-sql|connect-excel-to-a-database|^handle-large|^gross-vs-operating|^liquidity-and-leverage|^net-present-value|^contribution-margin/,
  powerbi: /^powerbi-|power-bi/,
  python: /^pandas-|^install-python|^install-jupyter|^sql-and-python|connect-python/,
  tableau: /^tableau-|tableau/,
  stats: /^mean-vs-median|^standard-deviation|^percentiles|^p-values|^confidence|^ab-testing|^how-charts|^moving-averages|^forecast-accuracy|^correlation|^choose-the-right-chart/,
  migration: /^migration-|^what-is-data-migration|^data-migration/,
};
/* Finance is the one chip that is not a tool, and that is deliberate. The row
   was tools-only until 2026-08-11, which meant a subject nobody thinks of as a
   tool had no way into it. The section is the source here rather than a slug
   regex, so a finance guide worked in Excel and one worked in SQL both get it
   while keeping their own tool. */
const TOOL_BY_SECTION = {
  'Excel for business analysts': ['excel'],
  'SQL concepts': ['sql'],
  'Data migration': ['migration'],
  'Statistics and charts': ['stats'],
  'Financial analysis': ['finance'],
};

const ALIASES = [
  // Error strings and menu labels the prose never prints
  { test: /character-encoding/,                       add: 'utf-8 utf8 unicode ansi mojibake garbled corrupted question marks file origin 65001' },
  { test: /csv-import-leading-zeros/,                 add: 'text to columns import wizard postcode postal code dropped zero product code' },
  { test: /iferror|index-match|vlookup-vs-xlookup/,   add: '#n/a #ref #value na error not found no match' },
  { test: /excel-circular-findings/,                  add: 'circular reasoning tautology begging the question not circular reference' },
  { test: /powerbi-slicers-filters-and-interactions/,   add: 'edit interactions cross filter cross highlight visual interactions sync slicers filters pane report level page level drill down filters other visuals apply all clear all' },
  { test: /powerbi-drillthrough-and-bookmarks/,        add: 'drill through right click detail page back button selection pane buttons navigator personal bookmarks spotlight hide show visuals cross report' },
  { test: /powerbi-publish-workspace-to-app/,          add: 'update app old version stale workspace roles admin member contributor viewer dashboard vs report pin tiles endorsement promoted certified audiences publish service' },
  { test: /powerbi-refresh-gateways-and-alerts/,       add: 'scheduled refresh eight 8 48 times per day on premises data gateway personal mode import directquery direct lake data alerts subscriptions kpi card gauge tile refresh history' },
  { test: /excel-count-counta-countblank/,             add: 'count counta countblank counting cells non blank empty how many rows filled responses subtotal countif numbers stored as text' },
  { test: /excel-paste-special/,                       add: 'ctrl alt v paste values only formulas to values transpose flip rows columns column widths multiply by 1 skip blanks paste link validation wiped' },
  { test: /excel-text-functions/,                      add: 'left right mid len textjoin concat find search split a code extract between dashes trailing spaces trim textbefore textafter' },
  { test: /sql-anti-join/,                             add: 'not in not exists left join is null missing rows never ordered no match unmatched except minus empty result orphan records anti join' },
  { test: /sql-case-overlapping-conditions/,           add: 'when then else order of conditions first match wins segment segmentation buckets bands priority flags mutually exclusive unreachable branch' },
  { test: /sql-rank-vs-dense-rank/,                     add: 'tie ties tied leaderboard standings top n per group dedupe deduplicate keep latest row partition over window ntile percent_rank skipped numbers 1 1 3' },
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

  /* Her words, not ours. A real tester on 2026-08-09 typed all of these and got
     nothing back, while our own vocabulary worked fine. "combine" was the worst:
     it returned two Tableau guides filed under a heading reading SQL concepts. */
  { test: /sql-joins|pandas-merge|excel-index-match|vlookup-vs-xlookup|sql-reconciliation/,
    add: 'combine combining two spreadsheets two tables two files two lists side by side match up bring together' },
  { test: /sql-joins|pandas-merge|excel-power-query/,  add: 'different column names columns do not match stack append' },
  { test: /entity-resolution|sql-reconciliation/,      add: 'same thing spelled differently names do not match' },
  { test: /sql-reconciliation/,                       add: 'totals do not match numbers different mismatch' },
  { test: /excel-sum-of-id-trap|excel-check-your-work/, add: 'wrong number confident wrong sanity check' },

  /* Finance vocabulary, added 2026-08-11 with the four Financial analysis
     guides. Every term here is genuinely answered by the page it points at and
     appears nowhere in that page's title or meta description, which is all the
     harvester reads. Deliberately NOT aliased: ebitda, working capital ratio,
     dupont, and altman z-score, because no page actually teaches them and a
     filler match teaches a reader that this search does not pay off. */
  { test: /gross-vs-operating-vs-net-margin/,
    add: 'cogs profit margin formula profitability bottom line income statement margins ebit' },
  { test: /liquidity-and-leverage-ratios/,
    add: 'acid test gearing solvency working capital balance sheet ratio formula liabilities creditworthiness covenant' },
  { test: /net-present-value-npv/,
    add: 'dcf discounted cash flow discount rate hurdle rate irr internal rate return time value money payback period capital budgeting present value factor' },
  { test: /contribution-margin-break-even/,
    add: 'cvp cost volume profit breakeven break even point unit economics margin safety operating leverage variable fixed costs special order pricing floor' },
  { test: /budget-vs-actual-variance/,
    add: 'fpa variance report favorable unfavorable plan versus actual materiality' },

  /* The 50-guide batch of 2026-08-23, written from the Search Console export.
     Each line is the phrase people actually typed, taken from the query report,
     that the card wording does not contain. */
  { test: /variance-analysis-explained|excel-variance-percent-traps/,
    add: 'variance percentage formula actual vs budget div0 divide by zero negative budget favourable unfavourable percentage points fpa month end' },
  { test: /excel-actual-vs-last-year/,
    add: 'yoy year on year prior year ly ytd phasing straight line same period last year vs budget' },
  { test: /jira-estimate-vs-actual/,
    add: 'jira variance vs actual original estimate remaining timespent sprint hours story points overrun burn' },
  { test: /variance-bridge-chart/,
    add: 'waterfall chart bridge walk plan to actual explain the movement floating bars' },
  { test: /up-and-to-the-right-chart/,
    add: 'up and to the right cumulative running total growth chart hockey stick trend line' },
  { test: /chart-axis-start-at-zero/,
    add: 'truncated axis y axis zero baseline broken axis misleading bar chart scale' },
  { test: /dual-axis-charts/,
    add: 'two y axes secondary axis combo chart twin axis spurious correlation index to 100' },
  { test: /stacked-vs-grouped-bars/,
    add: 'clustered column 100 percent stacked segments composition side by side bars' },
  { test: /pie-chart-alternatives/,
    add: 'pie chart donut slices this or that chart replace pie sorted bar treemap' },
  { test: /chart-titles-that-say-the-finding/,
    add: 'chart title subtitle headline takeaway so what label the insight' },
  { test: /excel-row-limit/,
    add: 'this data set is too large for the grid 1048576 rows maximum truncated file too big million rows' },
  { test: /open-a-large-csv/,
    add: 'huge csv wont open big file viewer head first rows line count sample gigabyte' },
  { test: /excel-power-query-vs-power-pivot/,
    add: 'get and transform data model dax m language which one difference' },
  { test: /excel-file-too-slow/,
    add: 'slow workbook lagging freezing volatile offset indirect calculation manual recalculate used range' },
  { test: /xlookup-not-available/,
    add: 'xlfn name error function not recognised excel 2019 2016 version compatibility did xlookup replace vlookup' },
  { test: /lookup-returns-na/,
    add: 'na error value not found trailing space nonbreaking space numbers stored as text exact match false' },
  { test: /excel-two-way-lookup/,
    add: 'row and column lookup index match match grid intersection matrix lookup' },
  { test: /excel-approximate-match-lookup/,
    add: 'grade boundaries tax bands tiers brackets banding lookup true sorted ascending nested if replacement' },
  { test: /verify-ai-chart|verify-ai-excel-formula|review-ai-data-cleaning|when-not-to-use-ai-for-analysis/,
    add: 'verify agent output ai generated check chatgpt copilot trust review hallucination' },
  { test: /analyst-request-intake/,
    add: 'requirements gathering stakeholder request scoping brief clarifying questions rework' },
  { test: /fuzzy-matching-names/,
    add: 'fuzzy match levenshtein similarity soundex trigram company names spelled differently blocking threshold' },
  { test: /deduplicate-a-customer-list/,
    add: 'dedupe merge records golden record survivorship master data crm duplicates customers' },
  { test: /data-quality-checks/,
    add: 'sanity checks profiling nulls orphans referential integrity before reporting validation' },
  { test: /powerbi-refresh-errors/,
    add: 'refresh failed gateway credentials key did not match column not found privacy level query folding' },
  { test: /powerbi-many-to-many/,
    add: 'bridge table cardinality relationship blank row totals do not add bidirectional crossfilter' },
  { test: /powerbi-filter-vs-slicer/,
    add: 'filters pane visual level page level report level edit interactions filter context removefilters' },
  { test: /powerbi-choose-a-visual/,
    add: 'which visual gauge kpi card matrix small multiples decomposition tree custom visuals appsource' },
  { test: /powerbi-vs-tableau-vs-excel/,
    add: 'which tool should i learn comparison licence cost tableau power bi excel job adverts' },
  { test: /connect-power-bi-to-a-database/,
    add: 'import directquery storage mode sql server connection gateway composite model' },
  { test: /tableau-filter-order-of-operations/,
    add: 'context filter top n fewer rows fixed lod ignores filter order of operations' },
  { test: /tableau-calculated-fields/,
    add: 'cannot mix aggregate and non-aggregate attr lod fixed include exclude row level' },
  { test: /tableau-table-calculations/,
    add: 'compute using running total percent of total rank lookup pane down table across partition' },
  { test: /tableau-dashboard-sizing/,
    add: 'fixed size automatic range device layout phone tablet looks different published' },
  { test: /tableau-tooltips/,
    add: 'tooltip hover viz in tooltip insert sheet maxwidth formatting' },
  { test: /tableau-blank-view/,
    add: 'blank view no data nulls view data reveal hidden data empty sheet join returns nothing' },
  { test: /sql-self-join/,
    add: 'join same table twice double join manager hierarchy alias pairs recursive' },
  { test: /sql-join-duplicate-rows/,
    add: 'join duplicate rows fan out total too high doubled numbers distinct grain join 2 tables' },
  { test: /sql-count-case-when/,
    add: 'count case when conditional count sum case else 0 filter clause pivot in sql' },
  { test: /sql-group-by-case/,
    add: 'group by case when banding buckets group by 1 alias empty band' },
  { test: /sql-comment-multiple-lines/,
    add: 'comment out multiple lines uncomment block comment nested slash star dash dash shortcut ctrl slash' },
  { test: /python-practice-drills/,
    add: 'python drills practice exercises daily reps typing pandas beginner routine' },
  { test: /pandas-pivot-table/,
    add: 'pivot table pandas aggfunc margins melt wide long crosstab' },
  { test: /pandas-datetime/,
    add: 'to_datetime dayfirst format parsing dates group by month resample period nat' },
  { test: /matplotlib-basics-for-analysts/,
    add: 'matplotlib subplots savefig axes labels chart in python plot dpi' },
  { test: /database-setup-for-analysts|csv-to-database-first-load/,
    add: 'database setup install database how to set up sql setup database first load staging table which database' },
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
  // Drop the count span before cleaning. It used to hold only digits and a
  // trailing \d+ strip was enough; it now holds "17 · 4-7 min read".
  if (m[1] !== undefined) { section = clean(m[1].replace(/<span class="seccount"[\s\S]*?<\/span>/g, '')).trim(); continue; }
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

  let pageTitle = '', metaDesc = '', mins = 0;
  if (fs.existsSync(guideFile)) {
    const g = fs.readFileSync(guideFile, 'utf8');
    const t = g.match(/<title>([\s\S]*?)<\/title>/i);
    const d = g.match(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i);
    pageTitle = t ? clean(t[1]).replace(/ — Analyst Prep Kit$/, '') : '';
    metaDesc = d ? clean(d[1]) : '';
    if (!metaDesc) console.warn('  no meta description, weaker search: ' + slug);

    /* Reading time, counted inside <main> so the nav and footer do not inflate
       it. 220 wpm is the middle of the range for adults reading prose on screen;
       these guides carry code and tables, which people read slower, so this
       reads as a floor rather than a promise. Rounded to 5-minute steps past 10
       so it never implies more precision than a word count can support. */
    const body = g.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const text = (body ? body[1] : g)
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
      .replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
    const n = (text.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) || []).length;
    const raw = n / 220;
    // Not on the two app cards: you do a drill, you do not read it.
    if (!external) mins = raw <= 10 ? Math.max(1, Math.round(raw)) : Math.round(raw / 5) * 5;
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
  /* Tableau got its own section on 2026-08-09, when the count reached ten and a
     real tester's search for "combine" returned Tableau guides sitting under a
     heading that read SQL concepts. The eight that were mis-filed moved. This
     line stays as the guard: TOOL_BY_SECTION hands every card in a section the
     section's tool, so a Tableau guide filed anywhere near SQL must never
     inherit the sql chip. */
  if (/^tableau-/.test(slug)) tools.delete('sql');

  meta.set(c.href, { kw: kw.join(' ').replace(/"/g, ''), tools: [...tools].sort(), external, mins });
}

/* Pass 3: rewrite the opening tags, dropping any attributes from a prior run. */
let n = 0;
html = html.replace(/<a class="gcard"[^>]*href="([^"]+)"[^>]*>/g, (full, href) => {
  const d = meta.get(href);
  if (!d) throw new Error('no metadata computed for ' + href);
  n++;
  return '<a class="gcard"' + (d.external ? ' data-kind="app"' : '') +
    ' href="' + href + '" data-tool="' + d.tools.join(' ') + '"' +
    (d.mins ? ' data-min="' + d.mins + '"' : '') + ' data-kw="' + d.kw + '">';
});

fs.writeFileSync(FILE, html.replace(/\n/g, '\r\n'));

const counts = {};
for (const d of meta.values()) for (const t of d.tools) counts[t] = (counts[t] || 0) + 1;
const guides = cards.length - [...meta.values()].filter(d => d.external).length;
console.log('cards stamped: ' + n + ' (' + guides + ' guides, ' + (n - guides) + ' app links)');
console.log('tool counts:  ' + Object.entries(counts).sort((a, b) => b[1] - a[1]).map(x => x[0] + ' ' + x[1]).join(', '));
console.log('\nThe page computes its own counts at runtime, so nothing else needs updating here.');
console.log('Next: node tools/build-search-index-guides.js');
