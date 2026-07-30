/* ============================================================
   stage-uploads.js — lay the built files out for hand-uploading.

   Gumroad wants three separate files per product (the PDF a buyer
   downloads, a horizontal cover, a square thumbnail) and the uploads
   cannot be automated from here: the browser extension refuses files
   outside a shared session folder, and desktop control is read-only
   for browsers, which is what the Windows file picker counts as.

   So this makes the manual pass mechanical instead of a hunt. One
   numbered folder per product, in the order they appear on the Gumroad
   product list, each holding exactly the three files it needs, named
   for the slot they go in.

     node tools/stage-uploads.js

   Output: dist/UPLOAD/01 SQL for Analysts/1 BOOK.pdf, 2 COVER.png, …
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const { SKUS } = require('./build-guidebook');

const DIST = path.join(path.resolve(__dirname, '..'), 'dist');
const OUT = path.join(DIST, 'UPLOAD');

// Same order as the Gumroad product list (newest first), so the folders
// line up with the screen instead of making him cross-reference.
const ORDER = ['migration', 'forecasting', 'charts', 'thinking', 'stats',
  'tableau', 'powerbi', 'python', 'excel', 'sql',
  'pack-core', 'pack-bi', 'pack-everything'];

function main() {
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const missing = [];
  let n = 0;

  for (const id of ORDER) {
    const sku = SKUS.find((s) => s.id === id);
    if (!sku) { missing.push(id + ' (unknown product)'); continue; }

    const want = [
      [id + '.pdf', '1 BOOK.pdf'],
      ['cover-' + id + '.png', '2 COVER.png'],
      ['thumb-' + id + '.png', '3 THUMBNAIL.png'],
    ];

    const have = want.filter(([src]) => fs.existsSync(path.join(DIST, src)));
    if (have.length < want.length) {
      for (const [src] of want) {
        if (!fs.existsSync(path.join(DIST, src))) missing.push(src);
      }
    }
    if (!have.length) continue;

    n++;
    const dir = path.join(OUT, String(n).padStart(2, '0') + ' ' + sku.title);
    fs.mkdirSync(dir, { recursive: true });
    for (const [src, dest] of have) {
      fs.copyFileSync(path.join(DIST, src), path.join(dir, dest));
    }
    console.log(path.basename(dir).padEnd(34) + have.length + '/3 files');
  }

  if (missing.length) {
    console.log('\nMISSING (build them first):');
    for (const m of missing) console.log('  ' + m);
  } else {
    console.log('\nAll ' + n + ' products staged, 3 files each.');
  }
  console.log('\n' + OUT);
}

if (require.main === module) main();
