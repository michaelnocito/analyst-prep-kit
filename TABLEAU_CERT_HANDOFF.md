# Handoff to Architect — Beef Up the Tableau Kit for Certification

**Date:** June 3, 2026
**From:** build session (grouping work, v1.23.0–v1.23.2)
**Goal:** Expand the Tableau kit from a solid intro (13 lessons) into a kit that
covers the **Tableau Desktop Specialist** exam blueprint end-to-end — so it
doubles as Mike's cert-prep *and* the strongest job-skill kit in the suite.

---

## 1. Why this matters (the case for the investment)

- **Tableau is a top-3/4 hard skill in entry-level data-analyst postings**
  (alongside SQL and Excel). Visualization/BI shows up in the majority of
  junior-analyst job descriptions.
- The **Tableau Desktop Specialist** cert is entry-level, ~$100, **no
  prerequisites, and the credential does not expire** (confirmed in the official
  exam guide). It's a high-ROI, attainable signal for a career-switcher.
- Exam is **45 questions (40 scored), 60 min, passing scaled score 750**,
  multiple-choice / multiple-response, **recall + understand/apply** level. No
  product access during the exam — so it rewards *conceptual clarity*, which is
  exactly what this kit's "Say It Out Loud" pedagogy is built for.

---

## 2. Findings from this session (grouping work)

We added a **Grouping** lesson (new Lesson 9) and learned things the architect
should carry forward:

1. **Content gaps are real and exam-relevant.** Grouping was completely missing,
   yet it's an explicit exam objective (2.2.1). Mike's class was actively stuck
   on it. Expect more gaps like this (see §4).
2. **The "method decision" confusion is the real teaching need.** Learners don't
   struggle to *click* — they struggle to choose *which tool* (group vs set vs
   hierarchy) and *which method* (view vs data pane). Every new topic should
   include a **"when to use which" decision aid**, not just steps.
3. **A verified misconception became the best teaching moment.** Learners think
   groups made by selecting in the view "disappear." Truth (verified vs Tableau
   docs **and** the exam's own practice Q2): they *are* saved as a reusable
   `[Field] (group)` paperclip field — they just land at the **bottom of the
   Dimensions list**, and the view swaps the shelf pill. → **Pattern: hunt for
   the common misconception on each topic and address it head-on.**
4. **Always verify against primary sources before writing.** Community blogs
   contradicted each other on the group-visibility point; Tableau's official docs
   + the exam guide settled it. Bake this into the workflow for cert content.

---

## 3. The target — official exam blueprint (what "done" means)

Source: Tableau Desktop Specialist Exam Guide (official PDF).

| Domain | Weight | Objectives (abbreviated) |
|---|---|---|
| **1. Connecting to & Preparing Data** | **25%** | Live vs extract connections; create extract; `.tds`; multi-connection sources · **relationships, joins, unions, join-vs-relationship** · rename field, alias, geographic role, change data type, change default field properties |
| **2. Exploring & Analyzing Data** | **35%** | Charts: bar, line, scatterplot, **map**, **combined axis**, **dual axis**, **stacked bar**, **density map**, crosstab/highlight table · **groups, sets, hierarchies**, filters, date filters · sort, reference line, **quick table calc**, **bins & histograms**, calculated field, **parameters (when to use)**, **totals** |
| **3. Sharing Insights** | **25%** | Format: color from marks card, **fonts, shapes, viz animations**, mark size, **show/hide legends** · dashboards: add sheets, interactive elements, **dashboard actions** (filter/highlight/URL/parameter), **device-specific layouts**, story + story point · **share/export** (twbx, PDF, image, publish; export underlying data; **export to PowerPoint**) |
| **4. Understanding Tableau Concepts** | **15%** | Dimensions vs measures · discrete vs continuous (incl. **date parts vs date values**) · aggregations (default agg; how agg changes as dimensions are added) |

---

## 4. Gap analysis — current 13 lessons vs blueprint

**Current lessons:** 1 Interface · 2 Dimensions vs Measures · 3 Bar Chart ·
4 Line Charts & Time · 5 Filters & Sorting · 6 Color/Size/Labels ·
7 Calculated Fields · 8 Aggregation · 9 Grouping (new) · 10 Dashboards ·
11 Tooltips & Annotations · 12 Chart Choice · 13 Telling a Story.

### Well covered already
- **Domain 4 (15%)** — strong: dims/measures (L2), aggregation (L8); discrete/
  continuous is partial (touched in L2/L4, no dedicated treatment).
- **Domain 2 basics** — bar (L3), line (L4), filters/sort (L5), calc fields (L7),
  groups (L9). Scatter exists only inside "Chart Choice" (L12).
- **Domain 3 partial** — marks/color (L6), dashboards (L10), tooltips + reference
  line (L11), story (L13).

### Biggest gaps (priority = exam weight × current absence)

**🔴 Domain 1 (25% of the exam) is almost entirely missing.** This is the single
highest-ROI area for cert readiness.
- Live connections vs **Extracts** (1.1) — flashcard only, no lesson.
- **Data model: relationships, joins, unions, join-vs-relationship** (1.2) — absent.
- **Data properties:** rename, alias, **geographic role**, data type, default
  properties (1.3) — absent.

**🟠 Domain 2 missing objectives (35% weight):**
- **Sets** (2.2.2) — flashcard only; needs a lesson (and the group-vs-set
  decision aid already drafted in L9 can seed it).
- **Hierarchies** (2.2.3) — only mentioned in L9; needs its own lesson.
- **Maps / density maps** (2.1.4 / 2.1.8) — absent (dataset has no geo fields; see §5).
- **Dual-axis & combined-axis** (2.1.5/2.1.6) — flashcard only.
- **Stacked bar**, **crosstab/highlight table** (2.1.7/2.1.9) — absent.
- **Quick table calculations** (2.3.3) — absent.
- **Bins & histograms** (2.3.4) — absent.
- **Parameters** (2.3.6) — flashcard only.
- **Date filters** (2.2.5) and **totals** (2.3.7) — absent.

**🟡 Domain 3 missing objectives (25% weight):**
- Formatting detail: **fonts, shapes, viz animations, show/hide legends** (3.1).
- **Dashboard actions** (filter/highlight/URL/parameter) (3.2.3) — partial.
- **Device-specific dashboards** (3.2.4) — absent.
- **Sharing/exporting**: twbx/PDF/image/publish, export underlying data,
  **export to PowerPoint** (3.3) — absent.

**🟢 Domain 4 polish (15% weight):**
- Dedicated **discrete vs continuous** lesson incl. **date parts vs date values**
  (4.2) — currently only implied.

---

## 5. Architecture constraints the plan MUST respect

(See `CLAUDE.md` → "Per-kit architecture cheat-sheet" for full detail. Key points
for Tableau specifically:)

- **Lesson ids must stay sequential 1..N.** Next/prev nav uses `id+1` and
  `id>=DATA.LESSONS.length`. Inserting a lesson mid-unit means renumbering every
  later lesson AND remapping `LESSON_DRILLS` (lessonId-keyed). Plan insert points
  to minimize ripple — appending within a unit's array position keeps it in that
  unit visually while ids renumber forward.
- **Drills are 5 arrays** (FILLS, BUGS, WRONG, PARSONS, ESQL), each index-mapped
  once in `LESSON_DRILLS`. New lessons should add matching drill items and wire
  them. **Tap-the-choice only — NO free-text inputs.** `choices[0]` = correct,
  shuffled on render.
- **Lesson visuals:** Tableau uses Chart.js via `lessonVizHTML`/`drawLessonChart`
  (bar/line/scatter, `refline`, plus raw `html` and `table` viz). For concepts
  Chart.js can't draw (data model, joins, extracts, dashboards, maps), use the
  `html`/`table` viz path — **this is how the Grouping lesson's two-bar visual was
  done** (no Chart.js).
- **Dataset limitation (`CONTOSO`).** It's a small coffee-sales table:
  `rep, region, product, category(Hot/Cold), month, units, revenue`. It has **no
  lat/long, no postal/state geographic field, no second table, no
  Category▸Sub-Category hierarchy.** Therefore:
  - **Maps/density** (2.1.4/2.1.8): need either a tiny geo dataset (e.g., add
    state/city rows) or a mock `html` map image/visual.
  - **Joins/unions/relationships** (1.2): need a *second* mock table to join, or
    teach with static `table` "before/after" visuals.
  - **Hierarchy** (2.2.3): `region` is flat; consider adding a
    `Category ▸ Product` framing or a mock hierarchy visual.
  - **Decision for Mike:** enrich `CONTOSO` (more fields/tables) vs. teach the
    data-prep domain with mock visuals only. (Recommend: mock visuals for the
    conceptual Domain-1 items; small geo helper only if we want a real map.)
- **Headless verify** every change: extract inline `<script>`, `new Function(src)`
  syntax check (catches brace slips); structural checks (sequential ids, drill
  lengths, LESSON_DRILLS keys). Mike playtests on the live URL.
- **Scope/pace:** one lesson (or one tight group) per cycle, 3 test checks each,
  semver + CHANGELOG/ROADMAP every cycle. **Don't dump all of §4 at once.**

---

## 6. Suggested build sequence (for the architect to refine)

Ordered by exam-weight ROI and dependency:

1. **Domain 1 mini-unit (new "Unit 0/4: Connecting & Preparing Data")** — the
   biggest gap and 25% of the exam:
   a. Connecting + Live vs Extract
   b. Joins, Unions & Relationships (needs mock second table)
   c. Managing Data Properties (rename/alias/data type/geographic role/defaults)
2. **Sets** (pairs naturally with the existing Grouping lesson — reuse the
   group-vs-set decision aid).
3. **Hierarchies** (drill-down; pairs with Sets/Grouping as the "organize" trio).
4. **Chart-type expansion**: Maps, Dual/Combined axis, Stacked bar,
   Crosstab/Highlight table (some need dataset/mocks).
5. **Analytics**: Quick Table Calculations, Bins & Histograms, Parameters,
   Totals, Date filters.
6. **Domain 3 polish**: Formatting (fonts/shapes/animations/legends), Dashboard
   Actions, Device layouts, Sharing/Export (incl. PowerPoint).
7. **Domain 4 polish**: dedicated Discrete vs Continuous (date parts vs values).
8. **(Optional capstone)** a Tableau cert practice exam mode, mirroring the
   Final Exam Kit's structure but mapped to the 4 domains/weights.

---

## 7. Open decisions for Mike

1. **Dataset:** enrich `CONTOSO` (add geo + a second table + a hierarchy) once,
   up front — vs. teach Domain 1 / maps with mock visuals only? (Architect rec:
   mocks for concepts; a tiny geo helper only if a real map is wanted.)
2. **Scope of the cert push:** full blueprint coverage (everything in §4) vs. a
   leaner "cert-critical" subset first (Domain 1 + Sets + Hierarchies +
   Parameters + Dual axis)?
3. **Cert practice-exam mode** (item 8) — in scope now or later?

---

## 8. Sources

- Tableau Desktop Specialist Exam Guide (official PDF) — domains, weights,
  objectives, practice questions.
- Tableau Help: *Group Your Data*; *Organize Fields in the Data Pane* — verified
  the group/data-pane behavior used in Lesson 9.
