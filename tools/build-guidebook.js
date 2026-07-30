/* ============================================================
   build-guidebook.js — turn extracted kit content into print PDFs.

   Usage:
     node tools/build-guidebook.js              # build every SKU
     node tools/build-guidebook.js sql excel    # build named SKUs
     node tools/build-guidebook.js --list       # show the SKU ladder
     node tools/build-guidebook.js --html sql   # stop at HTML (fast, no Chrome)

   Output lands in `dist/` (gitignored). PDFs are printed by the headless
   Chromium already on the machine; set CHROME_PATH to override the search.

   Content decision worth preserving: the site asks you to CLICK the answer.
   Paper can't. So every practice step prints task → hint → answer → why.
   It reads as a reference, not as a game with the buttons removed.

   Zero npm dependencies — node built-ins plus Chrome.
   ============================================================ */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const data = require('./guidebook-data');

const ROOT = data.ROOT;
const DIST = path.join(ROOT, 'dist');

/* ── the SKU ladder ──────────────────────────────────────────────────────
   Each SKU is one sellable file. `modules` pull in whole topic kits;
   `guides` pull in standalone articles by slug prefix or exact name.
   Prices are placeholders until Mike sets them — they print nowhere. */

const GUIDE_SETS = {
  sql: (s) => s.startsWith('sql-') || s === 'set-up-a-sql-database',
  migration: (s) => s.startsWith('migration-') || s.includes('data-migration'),
  tableau: (s) => s.startsWith('tableau-') || s === 'build-a-tableau-dashboard',
  thinking: (s) => ['defining-metrics', 'report-vs-analysis', 'exploratory-data-analysis',
    'data-driven-thresholds', 'documenting-data-limitations', 'entity-resolution',
    'handle-large-datasets', 'technical-tenacity', 'git-for-analysts',
    'what-is-data-analysis', 'verify-ai-agent-work'].includes(s),
};

const SKUS = [
  // singles
  { id: 'sql', title: 'SQL for Analysts', modules: ['sql'], guides: GUIDE_SETS.sql },
  { id: 'excel', title: 'Excel for Analysts', modules: ['excel'] },
  { id: 'python', title: 'Python for Analysts', modules: ['python'] },
  { id: 'powerbi', title: 'Power BI for Analysts', modules: ['powerbi'] },
  { id: 'tableau', title: 'Tableau for Analysts', modules: ['tableau'], guides: GUIDE_SETS.tableau },
  { id: 'stats', title: 'Statistics for Analysts', modules: ['stats'] },
  { id: 'charts', title: 'Charts & Visualization', modules: ['chart-literacy'] },
  { id: 'forecasting', title: 'Forecasting for Analysts', modules: ['forecasting'] },
  { id: 'migration', title: 'The Data Migration Playbook', guides: GUIDE_SETS.migration },
  { id: 'thinking', title: 'Thinking Like an Analyst', guides: GUIDE_SETS.thinking },

  // themed packs
  { id: 'pack-core', title: 'Core Analyst Pack', modules: ['sql', 'excel', 'stats'], guides: GUIDE_SETS.thinking },
  { id: 'pack-bi', title: 'BI Tools Pack', modules: ['tableau', 'powerbi', 'chart-literacy'], guides: GUIDE_SETS.tableau },

  // everything
  {
    id: 'pack-everything',
    title: 'The Complete Analyst Library',
    modules: ['sql', 'excel', 'python', 'powerbi', 'tableau', 'stats', 'chart-literacy', 'forecasting'],
    guides: () => true,
  },
];

/* ── html helpers ────────────────────────────────────────────────────── */

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Lesson prose already contains sanctioned inline markup; keep it, drop the rest. */
const KEEP = /<\/?(?:code|em|strong|b|i|sub|sup|br|ul|ol|li|p|kbd|small)\b[^>]*>/gi;
function prose(s) {
  if (s == null) return '';
  const held = [];
  let out = String(s).replace(KEEP, (m) => '\u0000' + (held.push(m) - 1) + '\u0000');
  out = esc(out);
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => held[+i]);
}

function table(viz) {
  if (!viz || !Array.isArray(viz.columns) || !Array.isArray(viz.rows)) return '';
  return '<table class="grid"><thead><tr>' +
    viz.columns.map((c) => '<th>' + prose(c) + '</th>').join('') +
    '</tr></thead><tbody>' +
    viz.rows.map((r) => '<tr>' + (Array.isArray(r) ? r : [r]).map((c) => '<td>' + prose(c) + '</td>').join('') + '</tr>').join('') +
    '</tbody></table>' +
    (viz.caption ? '<p class="caption">' + prose(viz.caption) + '</p>' : '');
}

/** A multiple-choice step, printed with its answer marked and explained. */
function choice(q, label) {
  if (!q || !q.q || !Array.isArray(q.opts)) return '';
  const ans = typeof q.ans === 'number' ? q.ans : -1;
  return '<div class="step"><p class="steplabel">' + label + '</p>' +
    '<p class="q">' + prose(q.q) + '</p><ol class="opts">' +
    q.opts.map((o, i) => '<li' + (i === ans ? ' class="right"' : '') + '>' + prose(o) +
      (i === ans ? ' <span class="tick">correct</span>' : '') + '</li>').join('') +
    '</ol>' + (q.exp ? '<p class="why"><strong>Why.</strong> ' + prose(q.exp) + '</p>' : '') + '</div>';
}

/** Parsons problem: the site shuffles tiles; paper shows the assembled answer. */
function parsons(p) {
  if (!p || !Array.isArray(p.lines)) return '';
  const order = Array.isArray(p.answer) ? p.answer : p.lines.map((_, i) => i);
  return '<div class="step"><p class="steplabel">Assemble it</p>' +
    (p.prompt ? '<p class="q">' + prose(p.prompt) + '</p>' : '') +
    '<pre class="code">' + order.map((i) => esc(p.lines[i])).join('\n') + '</pre></div>';
}

/** The "read a line" walkthrough: the query, the plain reading, then line by line. */
function readAloud(r) {
  if (!r) return '';
  let out = '<div class="ral">';
  if (r.sql) out += '<pre class="code">' + esc(r.sql) + '</pre>';
  if (r.say) out += '<p class="say"><strong>In plain words.</strong> ' + prose(r.say) + '</p>';
  if (Array.isArray(r.lines)) {
    out += '<dl class="lines">' + r.lines.map((l) => {
      const [k, v] = Array.isArray(l) ? l : [l, ''];
      return '<dt><code>' + esc(k) + '</code></dt><dd>' + prose(v) + '</dd>';
    }).join('') + '</dl>';
  }
  return out + '</div>';
}

function section(label, body) {
  return body ? '<h4>' + label + '</h4>' + body : '';
}

function lessonHTML(l, n) {
  let out = '<article class="lesson"><header>' +
    '<p class="eyebrow">' + prose(l.unit || '') + '</p>' +
    '<h3><span class="num">' + n + '.</span> ' + prose(l.title) + '</h3>' +
    (l.sub ? '<p class="sub">' + prose(l.sub) + '</p>' : '') +
    '</header>';

  out += section('Why this comes up', l.story ? '<p>' + prose(l.story) + '</p>' : '');
  out += section('The idea', l.intro ? '<p>' + prose(l.intro) + '</p>' : '');
  out += readAloud(l.ral);

  // stats-style modules carry `sections`, tool kits carry `parts`
  for (const key of ['sections', 'parts']) {
    if (!Array.isArray(l[key])) continue;
    for (const s of l[key]) {
      if (typeof s === 'string') { out += '<p>' + prose(s) + '</p>'; continue; }
      if (s && s.title) out += '<h4>' + prose(s.title) + '</h4>';
      if (s && (s.body || s.text)) out += '<p>' + prose(s.body || s.text) + '</p>';
      if (s && s.code) out += '<pre class="code">' + esc(s.code) + '</pre>';
      if (s && s.viz) out += table(s.viz);
    }
  }

  if (l.viz) out += table(l.viz);
  if (l.notes) out += section('Worth knowing', '<p>' + prose(l.notes) + '</p>');
  out += choice(l.quiz, 'Quick check');
  out += parsons(l.parsons);
  if (l.compare) out += section('Easy to get backwards', '<p>' + prose(l.compare) + '</p>');
  out += choice(l.build, 'Build it');
  if (l.close) out += section('Where that leaves you', '<p>' + prose(l.close) + '</p>');
  if (l.unlock) out += '<aside class="unlock"><p><strong>Going further.</strong> ' + prose(l.unlock) + '</p></aside>';

  return out + '</article>';
}

/* ── document assembly ───────────────────────────────────────────────── */

const CSS = `
@page { size: Letter; margin: 20mm 18mm 22mm; }
* { box-sizing: border-box; }
body { font: 10.5pt/1.6 Georgia, "Times New Roman", serif; color: #1c1c1e; margin: 0; }
h1,h2,h3,h4,.eyebrow,.steplabel,.tick,.caption { font-family: "Segoe UI", Helvetica, Arial, sans-serif; }
h1 { font-size: 30pt; line-height: 1.15; margin: 0 0 8pt; }
h2 { font-size: 19pt; margin: 0 0 4pt; }
h3 { font-size: 13.5pt; margin: 0 0 2pt; }
h4 { font-size: 8.5pt; letter-spacing: .09em; text-transform: uppercase; color: #6b6b70;
     margin: 14pt 0 4pt; }
p { margin: 0 0 8pt; }
code, pre, .lines dt code { font-family: Consolas, "SF Mono", Menlo, monospace; }
code { font-size: .9em; background: #f2f2f4; padding: .1em .32em; border-radius: 3px; }
pre.code { font-size: 9pt; line-height: 1.5; background: #f7f7f9; border-left: 2.5pt solid #3b6ef0;
           padding: 9pt 11pt; margin: 0 0 9pt; white-space: pre-wrap; border-radius: 0 4px 4px 0; }
pre.code code { background: none; padding: 0; }

.cover { height: 232mm; display: flex; flex-direction: column; justify-content: center;
         page-break-after: always; }
.cover .kicker { font-family: "Segoe UI", Helvetica, sans-serif; font-size: 9pt; letter-spacing: .18em;
                 text-transform: uppercase; color: #3b6ef0; margin-bottom: 14pt; }
.cover .rule { width: 54pt; height: 3pt; background: #3b6ef0; margin: 16pt 0; }
.cover .blurb { font-size: 12pt; color: #45454a; max-width: 118mm; }
.cover .foot { margin-top: auto; font-family: "Segoe UI", Helvetica, sans-serif; font-size: 9pt; color: #85858c; }

.toc { page-break-after: always; }
.toc h2 { margin-bottom: 12pt; }
.toc ol { padding-left: 16pt; margin: 0; }
.toc > ol > li { margin-bottom: 9pt; font-weight: 600; }
.toc ol ol { padding-left: 14pt; margin-top: 3pt; font-weight: 400; font-size: 9.5pt; color: #45454a; }
.toc ol ol li { margin-bottom: 1.5pt; }

.part { page-break-before: always; padding-top: 26mm; }
.part .kicker { font-family: "Segoe UI", Helvetica, sans-serif; font-size: 8.5pt; letter-spacing: .16em;
                text-transform: uppercase; color: #3b6ef0; }
.part h2 { font-size: 24pt; margin-top: 6pt; }

.lesson { page-break-before: always; }
.lesson header { border-bottom: 1pt solid #e3e3e7; padding-bottom: 7pt; margin-bottom: 11pt; }
.eyebrow { font-size: 8pt; letter-spacing: .1em; text-transform: uppercase; color: #85858c; margin: 0 0 3pt; }
.num { color: #3b6ef0; }
.sub { color: #55555c; font-style: italic; margin: 3pt 0 0; }

.ral { margin: 0 0 4pt; }
.say { background: #f4f7ff; padding: 7pt 10pt; border-radius: 4px; }
.lines { margin: 0 0 9pt; }
.lines dt { float: left; clear: left; width: 34%; font-size: 9pt; padding: 2.5pt 0; }
.lines dd { margin-left: 36%; font-size: 9.5pt; padding: 2.5pt 0; color: #3f3f46; }
.lines::after { content: ""; display: block; clear: both; }

table.grid { border-collapse: collapse; width: 100%; font-size: 9pt; margin: 0 0 5pt; }
table.grid th, table.grid td { border: .5pt solid #d8d8de; padding: 4pt 7pt; text-align: left; }
table.grid th { background: #f2f2f4; font-family: "Segoe UI", Helvetica, sans-serif;
                font-size: 8pt; letter-spacing: .05em; text-transform: uppercase; color: #55555c; }
.caption { font-size: 8.5pt; color: #75757c; margin: 0 0 10pt; }

.step { border: .5pt solid #e0e0e6; border-radius: 5px; padding: 9pt 11pt; margin: 0 0 9pt;
        page-break-inside: avoid; }
.steplabel { font-size: 8pt; letter-spacing: .09em; text-transform: uppercase; color: #3b6ef0; margin: 0 0 4pt; }
.q { font-weight: 600; margin-bottom: 5pt; }
.opts { margin: 0 0 6pt; padding-left: 18pt; }
.opts li { margin-bottom: 2pt; }
.opts li.right { font-weight: 600; }
.tick { font-size: 7.5pt; letter-spacing: .07em; text-transform: uppercase; color: #157347;
        border: .5pt solid #157347; border-radius: 3px; padding: .5pt 3.5pt; margin-left: 4pt; }
.why { font-size: 9.5pt; color: #3f3f46; margin: 0; }
.unlock { border-left: 2.5pt solid #d9a441; background: #fdf8ee; padding: 8pt 11pt; margin: 10pt 0 0;
          font-size: 9.5pt; page-break-inside: avoid; }
.unlock p { margin: 0; }

.guide { page-break-before: always; }
.guide h1 { font-size: 17pt; margin-bottom: 10pt; }
.guide h2 { font-size: 12.5pt; margin: 15pt 0 5pt; }
.guide h3 { font-size: 11pt; margin: 12pt 0 4pt; }
.guide table { border-collapse: collapse; width: 100%; font-size: 9pt; }
.guide th, .guide td { border: .5pt solid #d8d8de; padding: 4pt 7pt; text-align: left; }
.guide pre { font-size: 9pt; background: #f7f7f9; border-left: 2.5pt solid #3b6ef0; padding: 9pt 11pt;
             white-space: pre-wrap; border-radius: 0 4px 4px 0; }
.guide img, .guide svg, .guide figure { max-width: 100%; }
`;

function coverHTML(sku, stats) {
  return '<section class="cover">' +
    '<p class="kicker">The Analyst Prep Kit</p>' +
    '<h1>' + esc(sku.title) + '</h1>' +
    '<div class="rule"></div>' +
    '<p class="blurb">' + esc(sku.blurb || 'A printable reference built from the Analyst Prep Kit: worked examples, the reasoning behind each one, and practice with the answers shown.') + '</p>' +
    '<p class="foot">' + stats.lessons + ' lessons · ' + stats.guides + ' guides<br>Michael Nocito</p>' +
    '</section>';
}

function tocHTML(parts) {
  return '<section class="toc"><h2>Contents</h2><ol>' +
    parts.map((p) => '<li>' + esc(p.title) +
      '<ol>' + p.entries.map((e) => '<li>' + esc(e) + '</li>').join('') + '</ol></li>').join('') +
    '</ol></section>';
}

function buildHTML(sku) {
  const parts = [];
  const body = [];
  let lessonCount = 0;
  let guideCount = 0;

  for (const slug of sku.modules || []) {
    const mod = data.loadModule(slug);
    if (!mod.lessons.length) {
      console.warn('  ! ' + slug + ' has no extractable lessons — skipped');
      continue;
    }
    parts.push({ title: mod.title, entries: mod.lessons.map((l) => l.title) });
    body.push('<section class="part"><p class="kicker">Part ' + parts.length + '</p><h2>' + esc(mod.title) + '</h2></section>');
    mod.lessons.forEach((l, i) => body.push(lessonHTML(l, i + 1)));
    lessonCount += mod.lessons.length;
  }

  if (sku.guides) {
    const slugs = data.listGuides().filter(sku.guides);
    if (slugs.length) {
      const loaded = slugs.map(data.loadGuide);
      parts.push({ title: 'Guides', entries: loaded.map((g) => g.title) });
      body.push('<section class="part"><p class="kicker">Part ' + parts.length + '</p><h2>Guides</h2></section>');
      loaded.forEach((g) => body.push('<section class="guide">' + g.html + '</section>'));
      guideCount += loaded.length;
    }
  }

  const stats = { lessons: lessonCount, guides: guideCount };
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<title>' + esc(sku.title) + '</title><style>' + CSS + '</style></head><body>' +
    coverHTML(sku, stats) + tocHTML(parts) + body.join('\n') +
    '</body></html>';

  return { html, stats };
}

/* ── printing ────────────────────────────────────────────────────────── */

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  throw new Error('No Chromium found. Set CHROME_PATH to a Chrome or Edge binary.');
}

function toPDF(htmlPath, pdfPath) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'guidebook-'));
  try {
    execFileSync(findChrome(), [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      '--user-data-dir=' + profile,
      '--print-to-pdf=' + pdfPath,
      'file:///' + htmlPath.replace(/\\/g, '/'),
    ], { stdio: 'pipe', timeout: 180000 });
  } finally {
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

/* ── cli ─────────────────────────────────────────────────────────────── */

function main() {
  const argv = process.argv.slice(2);
  const htmlOnly = argv.includes('--html');
  const names = argv.filter((a) => !a.startsWith('--'));

  if (argv.includes('--list')) {
    for (const s of SKUS) console.log(s.id.padEnd(18) + s.title);
    return;
  }

  const targets = names.length ? SKUS.filter((s) => names.includes(s.id)) : SKUS;
  if (!targets.length) {
    console.error('No SKU matched. Try --list.');
    process.exit(1);
  }

  fs.mkdirSync(DIST, { recursive: true });

  for (const sku of targets) {
    process.stdout.write(sku.id + ' … ');
    const { html, stats } = buildHTML(sku);
    const htmlPath = path.join(DIST, sku.id + '.html');
    fs.writeFileSync(htmlPath, html, 'utf8');

    if (htmlOnly) {
      console.log(stats.lessons + ' lessons, ' + stats.guides + ' guides → dist/' + sku.id + '.html');
      continue;
    }

    const pdfPath = path.join(DIST, sku.id + '.pdf');
    toPDF(htmlPath, pdfPath);
    const kb = Math.round(fs.statSync(pdfPath).size / 1024);
    console.log(stats.lessons + ' lessons, ' + stats.guides + ' guides → dist/' + sku.id + '.pdf (' + kb + ' KB)');
  }
}

if (require.main === module) main();

module.exports = { SKUS, buildHTML, toPDF };
