#!/usr/bin/env node
/*
  Plan Builder link integrity check.

  Why this exists: the Outlier role shipped pointing at ../guides/sql-null/, a real
  page that returned HTTP 200 and looked fine — but was the one planner guide that
  never loaded assets/plan-return.js. Clicking it was a teleport: no way back, and a
  box the plan could never check. A 200 is NOT proof a plan link works.

  Two rules, both enforced here:
    1. Every page the plan links to must exist on disk.
    2. Every page reached as a PLAN SITTING (?from=plan) must be able to send the
       learner back with ?ckd=<step> — either by loading assets/plan-return.js, or
       by handling ckd inline (the SQL kit and the drill do their own).

  Run: node tools/check-plan-links.js   (exit 1 on any failure)
*/
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const planFile = path.join(ROOT, 'plan', 'index.html');
const src = fs.readFileSync(planFile, 'utf8');

/* Pages that implement the ?from=plan -> ?ckd= round trip in their own code
   rather than via the shared script. Verified by grep for 'ckd' below. */
const INLINE_HANDLERS = ['sql', 'drill'];

const failures = [];
const checked = [];

function pageFor(rel) {
  // '../guides/sql-null/' -> <root>/guides/sql-null/index.html
  const clean = rel.replace(/^\.\.\//, '').replace(/[?#].*$/, '').replace(/\/$/, '');
  return { slug: clean, file: path.join(ROOT, clean, 'index.html') };
}

function handlesReturn(slug, html) {
  const top = slug.split('/')[0];
  if (INLINE_HANDLERS.includes(top)) return /ckd/.test(html);
  return /assets\/plan-return\.js/.test(html);
}

/* ── collect targets ──────────────────────────────────────────────────────
   sitting = reached with ?from=plan (needs a way back)
   prose   = plain reference (only needs to exist) */
const sittings = new Set();
const prose = new Set();

// inline step links written with ?from=plan, e.g. href="../guides/x/?from=plan"
for (const m of src.matchAll(/href="(\.\.\/[a-z0-9\-/]+\/)\?from=plan/g)) sittings.add(m[1]);
// TWISTS guide entries: href:'../guides/x/'  -> guide() appends ?from=plan
for (const m of src.matchAll(/href:\s*'(\.\.\/guides\/[a-z0-9-]+\/)'/g)) sittings.add(m[1]);
// lesson() and ladder() targets
if (/function lesson\(/.test(src)) sittings.add('../sql/');
if (/function ladder\(/.test(src)) sittings.add('../drill/');
// every other reference in the file, prose included
for (const m of src.matchAll(/href="(\.\.\/[a-z0-9\-/]+\/)"/g)) {
  if (!sittings.has(m[1])) prose.add(m[1]);
}

/* ── rule 1: everything exists ─────────────────────────────────────────── */
for (const rel of [...sittings, ...prose]) {
  const { slug, file } = pageFor(rel);
  if (!fs.existsSync(file)) failures.push(`MISSING PAGE   ${rel}  (expected ${slug}/index.html)`);
}

/* ── rule 2: sittings can get the learner back ─────────────────────────── */
for (const rel of [...sittings].sort()) {
  const { slug, file } = pageFor(rel);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  if (handlesReturn(slug, html)) {
    checked.push(`  ok   ${slug}`);
  } else {
    failures.push(
      `NO WAY BACK    ${slug}  — reached with ?from=plan but never loads ` +
      `assets/plan-return.js, so the learner lands in a dead end and the plan ` +
      `can never check the box. Add: <script src="../../assets/plan-return.js" defer></script>`
    );
  }
}

/* ── report ────────────────────────────────────────────────────────────── */
console.log(`Plan link check — ${sittings.size} plan sittings, ${prose.size} prose links\n`);
console.log(checked.join('\n'));
if (failures.length) {
  console.error('\n' + failures.map(f => '  ✗ ' + f).join('\n'));
  console.error(`\nFAILED: ${failures.length} problem(s).`);
  process.exit(1);
}
console.log('\nPASS: every plan link exists and every sitting can return.');
