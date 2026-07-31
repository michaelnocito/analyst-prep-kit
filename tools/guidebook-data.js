/* ============================================================
   guidebook-data.js — content extraction for the PDF guide packs.

   Reads the LIVE kit files, so a book can never drift from the site.
   Nothing here knows about layout; `build-guidebook.js` owns that.
   Split deliberately: an audio-script target plugs in at this seam
   without touching the book layout.

   Two content shapes exist in this repo, so there are two loaders:

   1. TOPIC MODULES (`sql/index.html`, `excel/index.html`, …) keep their
      content in JS object/array literals inside inline <script> tags.
      We do NOT execute those scripts — they touch document/localStorage
      and would need a whole DOM. Instead we slice each top-level literal
      out of the source text and evaluate that literal alone in a bare vm
      context. Pure data in, pure data out, no app code runs.

   2. STANDALONE GUIDES (`guides/<slug>/index.html`) are ordinary rendered
      articles. For those we just take <main> and drop the furniture.

   SPLIT SOURCE (added 2026-07-31). The site guides are being cut back to
   short direct pieces, and the books are built from those same files, so a
   cut to the site was a cut to the book. A guide may now keep its full-length
   text in a book-source file outside this repo. When that file exists the
   book uses it and the site page is free to be shorter; when it does not,
   the site page is the source exactly as before. Nothing splits until
   somebody runs `tools/split-guide.js`, so this change moves no content on
   its own.

   Zero npm dependencies — node built-ins only.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

/**
 * Where full-length book chapters live, for guides whose site page has been
 * cut back. Deliberately outside this repo: this repo is public, so anything
 * committed here is readable by anyone, and the whole point of the split is
 * that the long version ships in the book.
 *
 * Override with GUIDEBOOK_SOURCE to build from somewhere else.
 */
const BOOK_SOURCE = process.env.GUIDEBOOK_SOURCE
  ? path.resolve(process.env.GUIDEBOOK_SOURCE)
  : path.resolve(ROOT, '..', 'packs-internal', 'guidebook-source');

const bookSourceFile = (slug) => path.join(BOOK_SOURCE, slug + '.html');

/* ── source text helpers ─────────────────────────────────────────────── */

function readKit(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

/** Inline <script> bodies (those without a src=), in document order. */
function inlineScripts(html) {
  const out = [];
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

/**
 * Walk forward from `open` (an index pointing at { or [) and return the
 * index just past its matching close. String, template, comment and
 * escape aware — a naive brace count breaks on `"}"` inside lesson prose,
 * and this content is full of it.
 */
function matchBracket(src, open) {
  const pairs = { '{': '}', '[': ']' };
  const close = pairs[src[open]];
  if (!close) throw new Error('matchBracket: not a bracket at ' + open);

  let depth = 0;
  let i = open;
  while (i < src.length) {
    const c = src[i];

    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === quote) break;
        // A template literal can nest a full expression, brackets and all.
        if (quote === '`' && src[i] === '$' && src[i + 1] === '{') {
          i = matchBracket(src, i + 1);
          continue;
        }
        i++;
      }
      i++;
      continue;
    }

    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      i = src.indexOf('*/', i + 2);
      if (i === -1) throw new Error('unterminated block comment');
      i += 2;
      continue;
    }

    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      if (depth === 0) return i + 1;
    }
    i++;
  }
  throw new Error('unbalanced bracket from ' + open);
}

/**
 * Every top-level `const/let/var NAME = {…}` or `= […]` in a script body,
 * evaluated in isolation. Literals that reference anything outside
 * themselves simply fail to evaluate and are skipped — that is the point
 * of the try, not a swallowed bug.
 */
function literalsFrom(scriptSrc) {
  const found = {};
  const re = /(?:^|\n)\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([{[])/g;
  let m;
  while ((m = re.exec(scriptSrc))) {
    const name = m[1];
    const openAt = m.index + m[0].length - 1;
    let end;
    try {
      end = matchBracket(scriptSrc, openAt);
    } catch (e) {
      continue;
    }
    const literal = scriptSrc.slice(openAt, end);
    try {
      found[name] = vm.runInNewContext('(' + literal + ')', Object.create(null), { timeout: 5000 });
    } catch (e) {
      /* not a self-contained literal (calls a helper, references a var) — skip */
    }
    re.lastIndex = end;
  }
  return found;
}

/* ── shape 1: topic modules ──────────────────────────────────────────── */

/** Does this object look like a lesson we can typeset? */
function isLessonish(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
  if (typeof o.title !== 'string' || !o.title.trim()) return false;
  return ['story', 'intro', 'sections', 'parts', 'close', 'ral', 'quiz', 'build']
    .some((k) => k in o);
}

function lessonArrays(bag) {
  const out = [];
  const seen = new Set();

  const visit = (value, trail) => {
    if (Array.isArray(value)) {
      const hits = value.filter(isLessonish);
      // Require most of the array to look like lessons, so a stray array of
      // {title} chart configs doesn't get typeset as a chapter.
      if (hits.length && hits.length >= value.length * 0.6) {
        out.push({ key: trail, lessons: hits });
        return;
      }
      value.forEach((v, i) => visit(v, trail + '[' + i + ']'));
      return;
    }
    if (value && typeof value === 'object') {
      if (seen.has(value)) return;
      seen.add(value);
      for (const k of Object.keys(value)) visit(value[k], trail ? trail + '.' + k : k);
    }
  };

  for (const name of Object.keys(bag)) visit(bag[name], name);
  return out;
}

/**
 * Load one topic module.
 * @returns {{slug, title, lessons: Array, sources: string[]}}
 */
function loadModule(slug) {
  const html = readKit(path.join(slug, 'index.html'));
  const bag = {};
  for (const src of inlineScripts(html)) Object.assign(bag, literalsFrom(src));

  const groups = lessonArrays(bag);
  // Biggest run of lessons wins; the rest are exercise banks and flashcards,
  // which belong in a different target than the reading book.
  groups.sort((a, b) => b.lessons.length - a.lessons.length);

  return {
    slug,
    // Deliberately NOT the page <title>. Those carry SEO wording ("Free
    // Interview Practice in Browser") that has no business in a paid book,
    // so the caller supplies a clean part title instead.
    title: slug,
    lessons: groups.length ? groups[0].lessons : [],
    sources: groups.map((g) => g.key + ' (' + g.lessons.length + ')'),
  };
}

/* ── shape 2: standalone guides ──────────────────────────────────────── */

/**
 * Remove every element carrying `cls`, including its children. Depth-counted
 * rather than regex-matched to the closing tag, so a nested element inside a
 * .cta block cannot end the match early. Class names are compared as whole
 * tokens so "btn" never matches "btn-row".
 */
function dropByClass(html, cls) {
  const openTag = /<([a-z][a-z0-9]*)([^>]*)>/gi;
  for (;;) {
    openTag.lastIndex = 0;
    let hit = null;
    let m;
    while ((m = openTag.exec(html))) {
      const attrs = m[2] || '';
      const cm = attrs.match(/class\s*=\s*"([^"]*)"/i);
      if (!cm) continue;
      if (!cm[1].split(/\s+/).includes(cls)) continue;
      hit = { tag: m[1], at: m.index, len: m[0].length, selfClosing: /\/\s*$/.test(attrs) };
      break;
    }
    if (!hit) return html;

    if (hit.selfClosing) {
      html = html.slice(0, hit.at) + html.slice(hit.at + hit.len);
      continue;
    }

    const scan = new RegExp('<(/?)' + hit.tag + '(?=[\\s>/])[^>]*>', 'gi');
    scan.lastIndex = hit.at;
    let depth = 0;
    let stop = -1;
    let t;
    while ((t = scan.exec(html))) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) { stop = t.index + t[0].length; break; }
    }
    html = stop === -1
      ? html.slice(0, hit.at) + html.slice(hit.at + hit.len)
      : html.slice(0, hit.at) + html.slice(stop);
  }
}

function stripFurniture(main) {
  let out = main
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<button[\s\S]*?<\/button>/gi, '');

  // Web furniture with no meaning on paper, matched by the classes the guides
  // actually use. `crumb` is the "← All Kits · All Guides" bar that opened
  // every chapter; `cta` and `btn` are buy and "open the kit" prompts; `toc`
  // and `seriesnav` are anchor menus whose targets do not exist in print.
  // `book` is the site's pointer at this very PDF, which must never print
  // inside it.
  for (const cls of ['crumb', 'cta', 'btn', 'toc', 'seriesnav', 'book']) {
    out = dropByClass(out, cls);
  }

  // A link cannot be followed from paper. Keep the words, drop the anchor.
  out = out.replace(/<a[^>]*>/gi, '').replace(/<\/a>/gi, '');

  return out.trim();
}

const countWords = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

/** The <main> of a guide's site page, furniture removed. */
function siteBody(slug) {
  const html = readKit(path.join('guides', slug, 'index.html'));
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) throw new Error('guides/' + slug + ': no <main>');
  return stripFurniture(main[1]);
}

/**
 * Load one standalone guide as a book chapter.
 *
 * The title and summary always come from the live page, so the book and the
 * site can never disagree about what a chapter is called. Only the body can
 * differ, and only when a book-source file exists for this slug.
 */
function loadGuide(slug) {
  const html = readKit(path.join('guides', slug, 'index.html'));
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);

  const site = siteBody(slug);
  const longFile = bookSourceFile(slug);
  const split = fs.existsSync(longFile);
  const body = split ? stripFurniture(fs.readFileSync(longFile, 'utf8')) : site;

  return {
    slug,
    title: h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : slug,
    summary: desc ? desc[1] : '',
    html: body,
    words: countWords(body),
    // Where this chapter's text came from, and what the site still shows.
    // A split chapter shorter than its own site page means the book-source
    // file is stale and the book is about to lose material.
    source: split ? 'book' : 'site',
    siteWords: countWords(site),
  };
}

function listGuides() {
  const dir = path.join(ROOT, 'guides');
  return fs.readdirSync(dir)
    .filter((n) => fs.statSync(path.join(dir, n)).isDirectory())
    .filter((n) => fs.existsSync(path.join(dir, n, 'index.html')))
    .sort();
}

function listModules() {
  return fs.readdirSync(ROOT)
    .filter((n) => !n.startsWith('.') && n !== 'guides' && n !== 'assets' && n !== 'tools')
    .filter((n) => {
      const p = path.join(ROOT, n);
      return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'index.html'));
    })
    .sort();
}

module.exports = {
  ROOT,
  BOOK_SOURCE,
  bookSourceFile,
  siteBody,
  loadModule,
  loadGuide,
  listGuides,
  listModules,
  _internals: { inlineScripts, literalsFrom, matchBracket, isLessonish, dropByClass, stripFurniture },
};

/* Run directly for a content census: `node tools/guidebook-data.js` */
if (require.main === module) {
  console.log('MODULES');
  for (const slug of listModules()) {
    let line;
    try {
      const m = loadModule(slug);
      line = String(m.lessons.length).padStart(4) + '  lessons   ' + slug;
      if (!m.lessons.length) line += '   (no lesson array found: ' + (m.sources[0] || 'none') + ')';
    } catch (e) {
      line = '  !!  ' + slug + '  ' + e.message;
    }
    console.log(line);
  }
  console.log('\nGUIDES   (book source: ' + BOOK_SOURCE + ')');
  let total = 0;
  let split = 0;
  const stale = [];
  for (const slug of listGuides()) {
    try {
      const g = loadGuide(slug);
      total += g.words;
      let line = String(g.words).padStart(6) + '  words  ' + slug;
      if (g.source === 'book') {
        split++;
        line += '   [book source, site shows ' + g.siteWords + ']';
        if (g.words < g.siteWords) stale.push(slug);
      }
      console.log(line);
    } catch (e) {
      console.log('    !!  ' + slug + '  ' + e.message);
    }
  }
  console.log(String(total).padStart(6) + '  words  TOTAL');
  console.log('\n' + split + ' of ' + listGuides().length + ' guides use a book source file.');
  if (stale.length) {
    console.log('\n!! STALE BOOK SOURCE: shorter than the live site page, so the');
    console.log('   book would lose material. Re-seed with tools/split-guide.js --force:');
    for (const s of stale) console.log('   - ' + s);
  }
}
