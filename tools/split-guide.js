#!/usr/bin/env node
/* ============================================================
   split-guide.js — take a guide's full text out of the site page
   and give the book its own copy, so the page can be cut back
   without the book losing anything.

   Run this BEFORE editing a guide down. It snapshots what is on the
   site today into the book-source directory. From then on the book
   builds from that snapshot and the site page is free to be short.

     node tools/split-guide.js migration-uat
     node tools/split-guide.js sql-joins sql-foundations
     node tools/split-guide.js --all-matching sql-
     node tools/split-guide.js sql-joins --force     # re-seed on purpose
     node tools/split-guide.js --status

   Refuses to overwrite an existing snapshot without --force, because
   overwriting after the page is cut is how the long version gets lost.

   Zero npm dependencies — node built-ins only.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const data = require('./guidebook-data');

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const force = has('--force');

function slugsFromArgs() {
  const all = data.listGuides();
  if (has('--all-matching')) {
    const prefix = args[args.indexOf('--all-matching') + 1];
    if (!prefix) die('--all-matching needs a prefix, for example: --all-matching sql-');
    return all.filter((s) => s.startsWith(prefix));
  }
  return args.filter((a) => !a.startsWith('--') && all.includes(a));
}

function die(msg) {
  console.error('\n' + msg + '\n');
  process.exit(1);
}

function status() {
  const rows = data.listGuides().map((slug) => {
    const g = data.loadGuide(slug);
    return { slug, source: g.source, book: g.words, site: g.siteWords };
  });
  const split = rows.filter((r) => r.source === 'book');

  console.log('\nBook source: ' + data.BOOK_SOURCE);
  console.log(split.length + ' of ' + rows.length + ' guides are split.\n');

  if (split.length) {
    console.log('  book   site   guide');
    for (const r of split) {
      const warn = r.book < r.site ? '   !! STALE, re-seed with --force' : '';
      console.log(
        String(r.book).padStart(6) + String(r.site).padStart(7) + '   ' + r.slug + warn
      );
    }
    console.log('');
  }

  const joined = rows.filter((r) => r.source === 'site');
  console.log(joined.length + ' guides still build the book from the live page:');
  console.log('  ' + joined.map((r) => r.slug).join(', ') + '\n');
}

function seed(slug) {
  const dest = data.bookSourceFile(slug);
  const exists = fs.existsSync(dest);

  if (exists && !force) {
    return { slug, action: 'skipped', why: 'already split, pass --force to re-seed' };
  }

  const body = data.siteBody(slug);
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

  // Re-seeding with less than we already stored is the one genuinely
  // destructive case: it means the page was cut first and this would
  // overwrite the long version with the short one.
  if (exists) {
    const current = data.loadGuide(slug).words;
    if (words < current) {
      return {
        slug,
        action: 'REFUSED',
        why: 'the live page (' + words + ' words) is shorter than the stored book '
          + 'chapter (' + current + '). Re-seeding would delete the long version. '
          + 'Edit the book source file by hand instead.',
      };
    }
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(
    dest,
    '<!-- Book chapter source for guides/' + slug + '/.\n'
    + '     Seeded from the live page by tools/split-guide.js.\n'
    + '     The site page may be shorter than this. This file is what the\n'
    + '     PDF is built from, so edit it here when the chapter should change. -->\n'
    + body + '\n'
  );

  return { slug, action: exists ? 're-seeded' : 'split', why: words + ' words' };
}

/* ── run ─────────────────────────────────────────────────────────────── */

if (has('--status') || args.length === 0) {
  status();
  if (args.length === 0) {
    console.log('Nothing to do. Pass one or more guide slugs to split them.\n');
  }
  process.exit(0);
}

const slugs = slugsFromArgs();
if (!slugs.length) die('No known guide slugs in: ' + args.join(' '));

const results = slugs.map(seed);
console.log('');
for (const r of results) {
  console.log(r.action.padEnd(9) + r.slug + '   (' + r.why + ')');
}

const refused = results.filter((r) => r.action === 'REFUSED');
console.log('\n' + results.filter((r) => r.action !== 'skipped' && r.action !== 'REFUSED').length
  + ' seeded into ' + data.BOOK_SOURCE);
if (refused.length) {
  console.log(refused.length + ' refused. Nothing was overwritten.');
  process.exit(1);
}
console.log('The site pages are now safe to cut back.\n');
