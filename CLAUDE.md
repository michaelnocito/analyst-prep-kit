# Session Handoff — Analyst Prep Kit

**Last session ended:** May 28, 2026
**Current version:** `v1.4.1` (4 versions awaiting test — see end of file)
**You are continuing an established collaboration with Mike Nocito.**

Read this entire file before doing anything. It is the source of truth
for HOW we work; `ROADMAP.md` and `CHANGELOG.md` are the source of
truth for WHAT is in flight.

---

## What this project is

A free browser-based prep suite at
**https://michaelnocito.github.io/analyst-prep-kit/** that teaches
people how to break into entry-level data analytics. Nine
self-contained kits, no install, no login, no telemetry. Source on
GitHub at `github.com/michaelnocito/analyst-prep-kit`.

Local repo: `C:\Users\Mike\Projects\analyst-prep-kit`

The kits, in learning order:
1. Excel · 2. SQL · 3. Python · 4. Tableau · 5. Stats ·
6. Power BI (optional) · 7. Interview · 8. Associate Data Analyst
Simulator (week-1 sim with live Claude API manager review) ·
9. Final Exam Kit (28-Q cross-subject test + bare-basics study guide)

Each kit is a single self-contained `index.html`. No build step. CSS,
JS, content all inline. Theme: dark teal default (`--accent:#58aaa2`),
light toggle persisted via `localStorage['apk-theme']`.

The signature pedagogy is **"Say It Out Loud"** — every formula/query
gets a plain-English leading sentence + a chunk-by-chunk breakdown +
a quick check.

---

## Who Mike is

Career switcher actively job-hunting for an entry-level data analyst
role. He's the target audience — building the on-ramp he wished
existed. Personal site: `michaelnocito.github.io` (separate repo at
`C:\Users\Mike\Projects\michaelnocito.github.io`).

**How Mike communicates:**
- Voice-to-text often. Expect garbled punctuation. Read for intent.
- Direct. He'll say "wtf are you talking about" or "you didn't put it
  in" — that's not personal, that's signal. He's correcting you
  because he wants the project to ship right.
- He pushes back when you're wrong. You should push back when HE's
  wrong (with reasoning). He'll respect it.
- He's smart but not a developer by training. Use plain-English
  analogies (per his own GR-D rule below). Don't lecture.

---

## The workflow — STRICT, follow it exactly

This is the loop we hammered out. Honor it.

1. **Mike says "ready" or "what's next"** → you pick the single
   highest-priority unshipped item OR the next untested-shipped item
   from `ROADMAP.md` (priority: Blocker > High > Medium > Low).
2. **Give exactly 3 testing checks for that one item** in this format:

   ```
   | # | Do this                              | Expect to see                          |
   |---|--------------------------------------|----------------------------------------|
   | 1 | Open Excel Lesson 10 — "Text Cleaning" | Reads TRIM on top, then A2 underneath  |
   ```

   **Rules for "Do this" cells:** name the kit, lesson NUMBER, lesson
   TITLE, and the section to scroll to. Lead with a verb. NOT
   "the text-cleaning lesson" — *"Excel Lesson 10 — 'Text Cleaning'"*.

   **Rules for "Expect to see" cells:** literal expected text in the
   order it should appear, with **bold** on the strings Mike is
   verifying. NEVER "no regression" or "looks right" — those put the
   work on Mike. Spell out what "right" means.

3. **Mike tests, reports back:** pass / partial / fail.
4. **If pass:** mark in CHANGELOG, move to next item.
   **If partial / fail:** the issue becomes its own roadmap item,
   triaged, worked next.
5. **One item in flight at a time.** Bundle only when items share a
   data layer or file AND you've asked permission first. Last time
   bundling without permission caused a miss.
6. **Tag every cycle:** `v1.x.y` (semver). PATCH (`x.y.z+1`) for
   bug-only or content-only. MINOR (`x.y+1.0`) for visible UX
   changes. MAJOR (`2.0.0`) only for restructure / breaking changes.
7. **Eastern timestamp on EVERY new feedback entry.** Format:
   `Month D, YYYY — H:MM AM/PM ET`. Get it with:
   ```bash
   TZ='America/New_York' date '+%B %-d, %Y — %-I:%M %p ET'
   ```

### The "GR" tag
When Mike spots something during testing that isn't about the active
target, he tags it `GR:` (General Remarks). GR items get triaged into
their own roadmap entries — they don't fold into the active test
result. They wait their turn.

### When in doubt — ASK
If Mike sends an ambiguous "ready" or you're not sure if his feedback
is a current-cycle blocker or a future item, ask with
`AskUserQuestion` (max 3 options, recommend one). Better to spend 30
seconds confirming than ship the wrong thing.

---

## Vision Principles — the prioritization lens

Every roadmap item is scored against these. They're written at the
top of `ROADMAP.md` and they decide bucket priority.

1. **See your progress at a glance.** No clicking required.
2. **Always know what to do next.** No "where was I?" moments.
3. **Free to explore.** Nothing locked. Wandering off-path is fine.
4. **Sub-rule: simplicity beats completeness.** Don't ship features
   that bloat the UI just to feel complete.

---

## Parking Lot criteria

An item parks if it matches AT LEAST one of:
- **Low impact** — improves something real but few users will notice.
- **Big overhaul** — needs its own planning cycle, not one bucket.
- **Speculative** — interesting idea, no confirmed ROI yet. Promote
  on second mention.
- **Breaking change** — would invalidate saved progress or URLs.

When Mike suggests "you can parking lot this" — you can override with
reasoning if the item has direct ROI on a shipped feature. Mike
respects that move; he gave you the discretion explicitly.

---

## Versioning shorthand
- `v1.0.x` (1.0.1, 1.0.2…) → bug-fix patches.
- `v1.x.0` (1.1.0, 1.2.0…) → new features or visible UX waves.
- `v2.0.0` → re-architect, URL changes, or breaking saved progress.

---

## Where things live

| Thing | Location |
|---|---|
| Live site | https://michaelnocito.github.io/analyst-prep-kit/ |
| GitHub | github.com/michaelnocito/analyst-prep-kit |
| Local repo | `C:\Users\Mike\Projects\analyst-prep-kit` |
| Roadmap (active items) | `ROADMAP.md` at repo root |
| Changelog (shipped items) | `CHANGELOG.md` at repo root |
| Vision principles | top of `ROADMAP.md` |
| Workflow rules | also in `ROADMAP.md` |
| This handoff | `CLAUDE.md` (you're reading it) |
| Mike's personal site repo | `C:\Users\Mike\Projects\michaelnocito.github.io` |
| Marketing brief (for the other Claude project) | _generated in chat, not saved as file_ |
| Dev-walkthrough audio script | `C:\Users\Mike\Projects\dev-walkthrough-script.md` |

---

## Things to NEVER do

These are things we got wrong in the last session and corrected:

- **Never bundle items into one cycle without explicit permission.**
  Last time it caused testing-direction problems.
- **Never write vague test directions** ("open the text-cleaning
  lesson"). Always specific lesson NUMBER + TITLE + section.
- **Never use "no regression" or "looks right"** as an expected
  outcome. Spell it out.
- **Never defer feedback to a future item without asking.** When a
  partial-test result references something on the roadmap, ask Mike
  whether that item is the current-cycle blocker before deferring.
- **Never commit without a timestamp on the commit message** when it's
  triaging GR feedback.
- **Never assume the SAME render fix works in every kit.** Per-kit
  data shapes vary. The RAL reading-order cycle aborted because of
  this — we now know SQL, Python, Power BI data is already in
  reading order while Excel was mixed.
- **Never invent a feature past what was asked.** When Mike says
  "fix X" he means X — not X + Y.

---

## Things to ALWAYS do

- **Run `git pull --rebase` before every push** (we hit fast-forward
  conflicts a few times when Mike was editing things locally).
- **Acknowledge the miss when you missed something** before
  explaining. Don't make excuses. Mike values the directness.
- **Suggest a default but let Mike override.** AskUserQuestion with
  one option labeled "(Recommended)" is the pattern.
- **Update ROADMAP.md and CHANGELOG.md every cycle** — they're how
  future-you (and future-future-you) stay coherent.
- **Use real-world non-tech analogies in any explanation** — Mike's
  own GR-D rule. "Triage is like an emergency room." "Versioning is
  like dating Word doc saves." Apply to your own writing too.

---

## Current state at handoff (May 28, 2026)

### Tests awaiting Mike

These versions shipped but Mike hasn't fully tested all of them yet.
He may pick any of these to test when you return:

- **v1.2.3** — Final Exam Kit cold entry always lands on Home (GR-1).
  Single-file fix in `final/index.html`. Untested.
- **v1.3.0** — "Say It Out Loud" plain-English leading sentence rolled
  out to SQL (12 lessons), Python (30+ formulas), Power BI (12
  lessons), hub demo. Untested.
- **v1.4.0** — Bare Basics highlight changed from teal to amber
  (`#e0b84a`) across all 7 kits + hub. Pill restyled as sticker. The
  active-banner color, exit button, and card-glow ring all flipped to
  amber. Untested.
- **v1.4.1** — Pedagogy fixes: SQL HAVING leak removed from L5
  context, Power BI prerequisite banner added on home, Python L1
  intro now names types in full + L4 explains `import`. Untested.

### Roadmap state (as of this handoff)

Open `ROADMAP.md` for the live version. Summary:

- 🔴 Blocker: empty
- 🟠 High: 2 items (Bare Basics cross-kit handoff was tagged GR-A
  Medium — confirm priority; GR-C Final Exam per-section submit;
  GR-E Bug Hunt input)
- 🟡 Medium: 3-4 items (GR-A, per-kit mini exams, GR-D real-world
  analogies across all help text)
- 🟢 Low: empty
- 🅿️ Parking Lot: 5 items (Tableau/Stats SIOL deferral, CSS var
  unification, orphaned sprint CSS cleanup, within-lesson basics
  highlighting, GR-B "living a workday" mindset expansion)

### What Mike will likely say first

One of:
- "Ready" → he wants the next item per priority. Pick the highest
  unshipped item OR the oldest untested-shipped version, give 3
  checks.
- "Test results: ..." → he's reporting on one of v1.2.3 / v1.3.0 /
  v1.4.0 / v1.4.1. Acknowledge, update CHANGELOG with verification
  timestamp, ask what's next.
- New feedback → triage with timestamp, propose bucket, ask before
  working.

---

## Stack details for quick reference

| Detail | Value |
|---|---|
| Live runtime | GitHub Pages (static site) |
| Each kit | Single self-contained `index.html`, inline CSS/JS |
| Theme variable | `--accent:#58aaa2` (teal) default; light mode toggles via `data-theme="light"` |
| Theme storage | `localStorage['apk-theme']` |
| Bare Basics flag | `localStorage['apk-basics'] === '1'` |
| Bare Basics highlight color | `#e0b84a` (amber, set in v1.4.0) |
| Per-kit lesson state keys | epk, sqlkit-v1, ppk, tpk, spk, pbikt-v1, ipk, sim2, apk-final |
| Most recent kit visited | `localStorage['apk-last-kit']` (drives Continue card) |
| Simulator API key (user-supplied) | `localStorage['sim2-apikey']` |
| Simulator API call | Direct browser → api.anthropic.com using `anthropic-dangerous-direct-browser-access: true` header. Uses `claude-sonnet-4-5`. |

---

## First thing to do when you start

1. Read this entire file (you just did).
2. Read `ROADMAP.md` — confirm "Currently working" line + bucket
   contents.
3. Read the latest entry in `CHANGELOG.md` — confirm what shipped
   most recently.
4. `git log --oneline -10` to see recent commits.
5. Wait for Mike's first message and respond per workflow.

Good luck. He's a great collaborator. Push back when you need to,
ship small, test on the live URL, and keep the cycle tight.
