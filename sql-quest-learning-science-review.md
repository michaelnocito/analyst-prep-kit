# SQL Quest Learning-Science Review → Analyst Prep Kit Gap Analysis

_Session June 28, 2026. Reconstructed from the gap-analysis chat and saved here because ROADMAP.md references this file. This is the authoritative full analysis behind the Phase-1 Excel restructure item in ROADMAP.md._

**Method:** Reviewed the learning-science findings researched for SQL Quest, then scored how the Analyst Prep Kit lines up against those principles on a 1–5 scale. Identified what we do well and the gaps, and roadmapped the gaps.

---

## What's working (the foundation is solid)

1. **Real-world context (5/5)** — Each lesson opens with a grounded story bridge (e.g., "You're handed a legacy customers table to migrate…") that frames *why* the concept matters. Signal-over-noise advantage vs. abstract tutorials.
2. **Pedagogical guidance (4/5)** — "Say It Out Loud" walks the chunk-by-chunk breakdown after the formula, grounding syntax in plain English. The confidence rater (Not Yet / Almost / Have It) is persisted and drives the "Your review list" home card.
3. **Feedback tiers (4/5)** — Quiz questions show correct (green) / wrong (red) clearly. Drills are tap-the-choice, no free-text guessing.
4. **Action visibility (4/5)** — Lessons are front-and-center; nav is clean; the learner always knows what to do next.

---

## The gaps (where SQL Quest's research reveals the miss)

Seven learning-science principles from SQL Quest are absent or underdeveloped:

### 1. Spaced retrieval — **1/5 (biggest gap)**
- **SQL Quest:** Waves reuse earlier verbs; a `reinforces:[]` field explicitly tracks which earlier concepts resurface. ~1/3/7 wave spacing.
- **Prep Kit:** Confidence rater flags low/mid lessons into "Your review list," but there's no active schedule — the learner must remember to revisit, which doesn't happen.
- **Why it matters:** Voluntary review is weak; scheduled reactivation drives retention. (Mike: "Spacing is very clear in learning science.")

### 2. Interleaving — **1/5**
- **SQL Quest:** Concepts mixed *within* a game (WHERE + AND; OR vs AND discrimination). Learner must discriminate.
- **Prep Kit:** Lessons are sequential (1→46); kits run Excel → SQL → Python with zero mixing. Each lesson stands alone.
- **Why it matters:** Without interleaving, learners "pass" by memorizing the immediate example and never learn to discriminate (GROUP BY vs HAVING).

### 3. Retrieval practice — **2/5**
- **SQL Quest:** Hints are thinking-nudges, never syntax; the player still fires the correct query themselves.
- **Prep Kit:** Read-Aloud tells the learner the plain-English answer *before* they see the code — encoding, not retrieval.
- **Why it matters:** Retrieval = *generating* the answer, not recognizing it.

### 4. Player orientation — **2/5**
- **SQL Quest:** Intel briefing + Oracle mentor voice on win + on-the-job example. Player knows what they just did and why.
- **Prep Kit:** Lessons end with a quiz; no recap, no closure. Lesson 12 blurs into 13.

### 5. Difficulty scaling — **2/5**
- **SQL Quest:** One new idea per wave; micro-steps.
- **Prep Kit:** Some SQL lessons pack 3–5 concepts (e.g., Lesson 12 "Reconciliation" = LEFT JOIN + IS NULL + GROUP BY HAVING at once). Cognitive overload.

### 6. Mentoring voice — **0/5**
- **SQL Quest:** Oracle greets you, gives brief thematic lines on win, never prescriptive.
- **Prep Kit:** No character. A voice creates belonging and retention.

### 7. Help escalation — **1/5**
- **SQL Quest:** 3-miss autopilot — hints get progressively less subtle (nudge → partial → full), then auto-fire but learner still executes.
- **Prep Kit:** Tap-the-choice with instant correct/wrong; no escalation ladder. Job-hunting learners freeze under instant fail.

---

## Roadmap (prioritized gaps)

**Phase 1 — High ROI, foundational (Q3 2026; Excel pilot first, then roll to other kits)**
- **1a. Spaced-retrieval prompts** — inject recall cards reusing a `reinforces:[]` field per lesson; ~1/3/7 lesson spacing.
- **3. Flip Read-Aloud from recognition to retrieval** — show story + plain-English goal, hide the code, learner attempts, *then* reveal the "Say It Out Loud" breakdown as post-attempt explanation.
- **7. Progressive hint system** — Miss 1 nudge → Miss 2 partial syntax → Miss 3 full solution + "I give up" (learner still executes). Port SQL Quest's `revealFrac` logic.

**Phase 2 — Learner experience (Q3–Q4 2026)**
- **2. Cross-kit interleaving track** — Analyst-Sprint-style track that mixes Excel/SQL/Python in one sitting (interleaved ordering, not just new lessons).
- **4. Closing voice + progress recap** — 1–2 sentence thematic recap at lesson end (no character yet).
- **5. Lesson granularity audit** — split overstuffed SQL lessons 10–18; one new idea per unit.

**Phase 3 — Delight layer (Q4 2026–2027)**
- **6. Mentor character** — analyst mentor (SVG + simple logic), greets on kit start, thematic one-liner on completion. Reuses SQL Quest's Oracle pattern.

| Phase | Work | Effort | Target |
|---|---|---|---|
| 1 | Spaced retrieval + hint escalation | 40–60h | July 2026 |
| 1 | Flip Read-Aloud (recognition → retrieval) | 20–30h | July 2026 |
| 2 | Cross-kit interleaving track design | 20h | Aug 2026 |
| 2 | Lesson granularity audit + splits | 15–20h | Aug 2026 |
| 2 | Closing voice + recap cards | 10–15h | Aug 2026 |
| 3 | Mentor character (SVG + logic) | 40–80h | Sep–Oct 2026 |

**Phase 1 is blocking:** spaced retrieval + hints + flipped Read-Aloud are the three moves Mike's learning-science lens demands. They convert "learn it" into "retain it."

## Pilot decision
Excel kit chosen as the pilot (mid-size, tactile, existing RAL/confidence/drill structure). Mike tests the three gates (Read-Aloud reorder, spaced-retrieval card, 3-tier hint escalation) before rolling to SQL, Python, Tableau, Stats, Power BI. See ROADMAP.md "LEARNING SCIENCE: Restructure Excel kit…" for the locked scope + Definition of Done.
