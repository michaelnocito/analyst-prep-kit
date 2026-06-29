# Excel Kit — Learning-Science Polish: Master Development Plan

_Created June 29, 2026 — 12:48 PM ET. Pilot kit = **Excel**, then port the proven pattern to SQL · Python · Power BI · Tableau · Stats. This plan folds together: yesterday's 7-gap SQL Quest learning-science review (`sql-quest-learning-science-review.md`), the June 29 mobile-playtest feedback, the 10 transcribed voice memos (`Downloads/prepkit_feedback_0629/TRANSCRIPTS.txt`), and four research/audit passes run June 29 (one full code audit of `excel/index.html`, three evidence-based learning-science briefs). The AI Coach is included as the premium layer this redesign is built to receive._

---

## TL;DR — what we're doing and why

The Excel kit teaches well on the things it already does (real-world context 5/5, plain-English "Say It Out Loud" 4/5). The gap, proven by the SQL Quest review and confirmed by research, is that **the lesson is built for _recognition_ (read it, then take a quiz), not _generation_ (try it, get it wrong, compare, build it yourself)** — and generation is where memory and interview-readiness actually come from. We rebuild the lesson flow around that, fold in every June 29 fix, and add an honest motivation layer that never betrays the calm vision (no hearts, no loss, no guilt).

**One sentence:** turn each lesson from _"explain → quiz"_ into _**Orient → Worked Example → Try → Compare → Build → Own → Close**_, with a progressive formula spine, position-based spaced recall, instructive-only visuals, a Focus/Detailed split (built last), and a gentle mentor voice — Excel first, then ported.

---

## Part 1 — Where Excel is today (audit ground truth)

Source: full read of `excel/index.html` (2,497 lines). Key facts the plan builds on:

- **51 lessons across 11 units.** Core Units 0–6 (IDs 101–104, 1–24); interview tracks Units 7–10 (IDs 521–806, premium-gated at `id>=500`).
- **Current lesson order** (`renderLesson`, L1559): story bridge → intro → on-the-job → **RAL "Say It Out Loud"** → "See it on the sheet" grid → Gotcha → Quick Check (quiz) → confidence rater. **Drills are NOT in the lesson** — they're reached via a "Practice this →" button after the quiz, and the guided "Next drill →" advances **unconditionally** (you can click through every drill solving nothing; L1814).
- **Recognition-first today:** the plain-English answer and the worked formula are shown _before_ any attempt. The quiz and 4 of 5 drills are tap-the-choice (recognition). Only generation path is the lone surviving free-text drill.
- **The concrete bugs (June 29 feedback, line-confirmed):**
  - **One free-text drill remains** — "Fill in the Blank" (`#fillInput`, L1922; string-matched at L1943). This is the ungradable-variations risk Mike flagged.
  - **Skill-readiness score is hardcoded** to a 16-point scale over a Unit 1–3 subset (L1462–1473). It ignores Unit 0, Units 4–6, and ALL track lessons → never moves when new lessons are added. (The unit-progress bars below it _are_ dynamic and correct.)
  - **"On the job" blurbs are on core lessons 1–24 only, absent from tracks** (last at L844) — the _inverse_ of Mike's ask.
  - **Charts are never drawn** (kit has no Chart.js). "What's Wrong?" #17/#18 reference a chart with **no visual** (L1111); Lesson 17 / 803 / 804 / 805 describe charts as data tables.
  - **"Continue anyway" (L1680) + unconditional advance** let a learner fail the quiz and skip on.
  - **Mobile overflow:** tap-choice formula buttons (L1981/L2098) and Parsons chips (L181) lack `word-break`/`overflow-wrap`, so long no-space formulas run off the iPhone card edge (matches the screenshot). The single media query (L246) covers none of the drill/lesson body.
  - **Stale copy:** L429 "28 lessons across seven units" and L1493 "All 16 lessons complete!" are both wrong (51 lessons / 11 units).
  - **Dead code:** `S.flagged` (flag feature removed), sprint-bar CSS (L254–286), `.sc-*` classes.
- **Parsons drills already exist** (`renderParsons`, L2026) — tap-to-place (not drag). Good foundation to elevate.
- **State:** `localStorage['epk']`, object `S` — `lessonsDone[]`, per-drill `*Done[]` index arrays, `confidence{id:low|mid|high}`. No two-mode/focus mechanism exists (Bare Basics fully removed; only dead-flag scrubbing remains).

---

## Part 2 — The principles we're building to (research, condensed + cited)

Four pillars, each with the one design rule it yields. Full citations in the Appendix.

**Pillar 1 — Generation beats recognition (retrieval-first).** Producing an answer from memory retains ~61% vs ~40% for re-reading a week later, and re-readers _feel_ more confident — an illusion of mastery (Roediger & Karpicke 2006). Committing a confident wrong answer, then being corrected, sticks _harder_ (hypercorrection; Butterfield & Metcalfe 2001). **Rule: make the learner attempt and commit before revealing the worked answer.** Caveat (expertise reversal; Kalyuga 2007): true novices need a worked example first — so attempts are _scaffolded_, never cold from a blank void.

**Pillar 2 — Worked example → faded practice → independent write.** Novices learn more, faster, from a worked example than from unaided problem-solving (worked-example effect), but the example becomes redundant as skill grows. The proven bridge is _fading_: worked example → completion problem → solve alone, paired with self-explanation ("why this step?") (Renkl & Atkinson 2003). Parsons problems are the ideal middle rung — **same learning gains as writing code, in less time and at lower cognitive load** (Ericson 2017/2020; Haynes-Magyar & Ericson 2021). **Rule: every concept runs a fading ladder; Parsons/completion is the bridge, independent write is the finish.**

**Pillar 3 — Compare your attempt to the correct answer.** Learners who compare their own flawed attempt against an expert solution repair their mental model better than those who only study the expert one (contrasting cases / model repair; Chi self-explanation; Kapur productive failure, g≈0.36). **Rule: after every attempt, show attempt-vs-correct side by side and name the specific gap.** (This is exactly where AI Coach mode 3 plugs in.)

**Pillar 4 — Spacing + interleaving + the progressive spine, without an SRS engine.** Optimal review gap ≈ 10–20% of the target retention interval, and _one_ well-timed review does most of the work (Cepeda 2006/2008). Interleaving related concepts beats blocking for retention and method-selection (Rohrer 2019) — and a formula that grows across lessons (SUM → +IF → nested) operationalizes spacing + retrieval + progressive complexity at once. **Rule: resurface each concept as an active-recall card at ~+1/+3/+7 _lessons_ (position-based, binge-proof); build one artifact across a unit; interleave only at the practice stage, never on first contact.** Honesty rule (Bjork desirable difficulties): interleaved/spaced practice _feels_ harder and lowers confidence even as it works — tell the learner that so they don't read struggle as failure.

**Cognitive-load contract (Sweller / Mayer).** Cut extraneous load, keep germane. The **coherence principle** (less is more — irrelevant words/pictures _hurt_) and **redundancy effect** (don't restate the same thing twice) drive the **Focus/Detailed split**: Focus = concept-in-a-sentence + **the full worked example** (germane — never hide it) + one try + the chart if the lesson is about a chart; "More info" = edge cases, alt syntax, deeper why, extra examples — _adds, never echoes_. **Multimedia principle:** show the actual chart when a chart is discussed; the highest-value Excel/SQL visual is **input table → operation → output table** side by side. Cut decorative imagery (seductive-detail effect).

**Motivation layer — the SDT line (Ryan & Deci).** Every element must read as **informational/competence-affirming, never controlling, scarce, or loss-framed.** That single rule separates motivating from manipulative.
- **Honest unlock:** the reward is _more of the actual knowledge_ (a deeper "why," a real gotcha), permanent and revisitable — not points/gems. Completing each practice mode reveals the next layer of understanding. (Hollow token rewards trigger the overjustification effect; earned _content_ doesn't.)
- **Mini-story = the concept _in situ_** (the real job task it solves), short and decoration-free. Narrative aids memory (g≈.55, larger for recall; Mar 2021) — but irrelevant color _hurts_ in technical content (seductive details), so the story _is_ the example, never flavor around it.
- **Mentor voice:** conversational tone is a free comprehension win (Mayer personalization/voice). Keep it textual and light — one orient line at start, one competence-affirming line at close. No hovering character, no forced cheer, no guilt.
- **Gamification:** favor white-hat **progress/mastery** mechanics (progress only ever accumulates) over black-hat **loss-aversion** (hearts/lives/streak-shame). For a stressed career-switcher audience, loss mechanics manufacture the exact anxiety the product exists to relieve — this is the evidence base behind the "no hearts on content" monetization resolution.

---

## Part 3 — The redesigned lesson model

### 3.1 The new within-lesson flow: **Orient → Example → Try → Compare → Build → Own → Close**

| # | Stage | What the learner sees | Pillar |
|---|---|---|---|
| 0 | **Orient** | One mentor line + the concrete mini-scenario (the job task this solves) + the concept in one sentence. | Mini-story, mentor voice |
| 1 | **Worked Example** | The full worked example (input grid → formula → result) + "Say It Out Loud" chunk breakdown. _Focus default keeps this; trims surrounding prose._ | Worked-example effect, cognitive load |
| 2 | **Try** | A scaffolded **generation** attempt — Parsons (order the pieces) or completion (we give part, you finish). Learner **commits** an answer (+ optional confidence tap). | Retrieval-first, generation, hypercorrection setup |
| 3 | **Compare** | Their attempt shown **next to** the correct answer, with the specific gap named ("You used `SUMIF` — two conditions, so it needs `SUMIFS`"). Free tier = the side-by-side; **AI Coach mode 3 = the named diagnosis**. | Contrasting cases / model repair |
| 4 | **Build** | The fading ladder: completion → **independent write**. Each mode completed **unlocks the next layer of understanding** about the concept (honest reward). | Fading, faded Parsons, honest unlock |
| 5 | **Own** | Quick recognition check (tap-choice) as fluency warm-down; concept is queued to **resurface as a recall card** in a later lesson (+1/+3/+7). Confidence rater stays. | Testing effect, spacing |
| 6 | **Close** | One mentor line, competence-affirming + informational ("You worked this three ways — here's where it shows up on the job"). | Mentor voice, mastery framing |

**Key shift vs today:** the attempt (Stage 2) and the compare (Stage 3) become **load-bearing and come BEFORE/AROUND the answer reveal**, instead of a quiz after the answer. Practice stops being an afterthought button — it's the spine of the lesson (directly answers Mike's voice memo #5).

**First-exposure vs spine-step calibration (expertise reversal):** for a brand-new concept, Stage 1 (example) leads and Stage 2 (try) follows on a _similar_ item. For a spine step that builds on a prior lesson, Stage 2 can lead (the prior part is retrieval) with Stage 1 reinforcing. The template supports both via a per-lesson `firstExposure` flag.

### 3.2 The progressive formula spine (Mike's voice memo #9)

Build **one artifact across a unit**, each lesson reusing the last:
- **Unit 1 (Formulas):** `SUM` → `SUM`+`IF` → nested `IF`/`IFS` → `SUMIF`/`SUMIFS` → `INDEX`/`MATCH`.
- Each lesson opens by retrieving the prior step ("you can total a column; now total it _only when_ a condition holds").
- This is spacing + retrieval + interleaving for free, and it makes the kit feel like it _builds_ instead of resetting every lesson.

### 3.3 Focus vs Detailed (built LAST, per Mike's June 29 sequencing call)

- **Focus (default):** concept-in-a-sentence + full worked example + the try + chart-if-relevant. Austere — no fluff.
- **"More info" (inline expand):** edge cases, alt syntax, deeper "why," extra examples, gotchas. **Adds, never echoes.**
- As we rewrite content (Phase C/D), tag each block **essential** vs **more-info** so the toggle is a thin final wrapper, not a re-write. The restructure produces Focus mode as a by-product — which is exactly why Mike sequenced it last.

### 3.4 The motivation layer (SDT-guarded)

- **Unlock = knowledge, permanent, revisitable.** Each completed practice mode reveals the next concrete beat of the concept's "mini-story." No points/gems/leaderboards.
- **Mentor voice:** light, textual, consistent; orient + close only; praise the _work/growing capability_, never the person, never with pressure. Consider a dismissible/quiet mode for confident users.
- **Progress only accumulates.** No hearts, no destructible streaks, no FOMO. A gentle _return_-streak (celebrates coming back) is the only streak allowed, if any.
- **Honest difficulty line** at review points: "This feels harder because you're mixing topics — that's what makes it stick."

---

## Part 4 — June 29 fixes, and where each lands

| Feedback item | Resolution | Phase |
|---|---|---|
| Mobile submit button hard to reach (portrait + keyboard) | Sticky action bar that rides above the keyboard on drill/try screens | A |
| Text overflow / clipped formulas + cut-off lesson text on iPhone | `overflow-wrap:anywhere`/`word-break` on tap-choice buttons + Parsons chips + code; responsive audit of lesson body | A |
| Jumbled title text on some kits | Title rendering fix; sweep (cross-kit in Phase H) | A |
| Fill-in-the-blank → multiple choice (ungradable variations) | Convert the lone free-text Fill drill to MC/completion; gradable generation only | A |
| Skill-readiness score ignores new lessons | Recompute from live `DATA.LESSONS` (dynamic denominator), all units + tracks | A |
| Stale "28 lessons / 16 complete" copy | Derive counts from data | A |
| Charts need real visuals | Inline-SVG charts where a chart is _discussed_ (no Chart.js dep); input→op→output tables elsewhere; the "what's wrong with this chart" items get an actual chart | A (chart-reference items) + C (sweep) |
| "On the job" only on applicable tracks | Keep the concrete _scenario framing_ on all lessons (it's the mini-story = pedagogically essential), but the role-specific "On the job — in a Finance role you'd…" aside renders **only on track lessons** | C |
| "Check"/"Continue anyway" lets you skip without solving | Completion reflects real solving (feeds the readiness score); keep "free to explore" navigation but stop counting un-solved lessons as done | A/B |
| Practice deserves a bigger role | It becomes the lesson spine (Stages 2–4) | B |
| Attempt-vs-correct comparison | Stage 3 (free side-by-side); AI gap-read = Coach mode 3 | B + G |
| Parsons: research + expand | Confirmed high-value; promoted to the core fading ladder, distractors + faded help added | B |
| Focus/Detailed dual mode | Built last as a wrapper over restructured content | F |
| Reward/unlock + mini-story + mentor voice | The SDT-guarded motivation layer | E |
| Dead code (`S.flagged`, sprint CSS, `.sc-*`) | Removed during the content scrub | D |

---

## Part 5 — AI Coach integration (premium layer this redesign receives)

The redesigned lesson is built **AI-Coach-ready** so the premium layer drops in without re-architecting:
- **Mode 1 (inline "stuck-help")** plugs into **Stage 4 (Build)** — a "stuck?" button on the independent-write step sends the current problem + the learner's attempt for a scaffolded, hints-first nudge.
- **Mode 3 (attempt-vs-correct gap analysis)** plugs into **Stage 3 (Compare)** — free shows the side-by-side; premium names the gaps and _why_, and suggests the fix.
- **Mode 2 (mock interview)** stays attached to the interview-track units.
- Build the **attempt-capture + comparison surface now** (free tier) so the AI call is a later addition, not a rebuild.
- Gating/economics per the recorded monetization resolution: **lessons open-free; meter only AI** (per-user credit cap inside the paid package; server-side Supabase Edge Function proxy holds the key). No hearts on content. See ROADMAP "AI COACH" item + `project_freemium_ecosystem` memory.

---

## Part 6 — Build phases (Excel pilot)

Each phase is independently testable under the strict workflow (one item in flight, 3 concrete test checks, ship + tag). Effort is rough.

- **Phase A — Foundation fixes (ship fast, high-trust, low-risk).** Skill-readiness from live data; stale-count copy; mobile word-break/overflow + sticky submit bar; convert the free-text Fill drill to MC/completion; inline-SVG charts for the chart-reference items; completion reflects real solving. _These stand alone and de-risk the mobile/correctness complaints before the big redesign._ **Effort: Medium.**
- **Phase B — The exemplar (keystone decision gate).** Fully rebuild the **formula spine** lessons (e.g. 1 → 2 → 13/14, SUM→IF→nested) end-to-end in the new Orient→…→Close flow, including the retrieval-first Try, the free attempt-vs-correct Compare, the Parsons/completion→independent-write ladder, mini-story framing, and the two mentor lines. **Mike tests the _feel_ on a finished exemplar and signs off before any rollout.** **Effort: Large.**
- **Phase C — Roll the pattern + content/visual sweep.** Apply the proven flow to all 51 Excel lessons; full wording scrub (tighten redundant intros — e.g. the L677 duplicated metaphor — re-title headings for logical progression); on-the-job gating (scenario everywhere, role aside on tracks only); charts everywhere a chart is discussed. **Effort: Large.**
- **Phase D — Spacing + progressive spine + honesty messaging.** Add `reinforces:[]` recall cards at +1/+3/+7 lessons; wire the progressive-artifact framing across units; add the "this feels harder because it works" line + a visible recall-success counter; remove dead code. **Effort: Medium.**
- **Phase E — Motivation layer.** Honest unlock (each practice mode reveals the next knowledge layer), light mentor voice system, progress-only mastery framing / gentle return-streak. SDT-guarded. **Effort: Medium.**
- **Phase F — Focus/Detailed two-mode (LAST, per Mike).** Wrap the restructured content in a Focus-default / "More info"-expand toggle. **Effort: Medium** (small because the content was tagged essential/more-info during C/D).
- **Phase G — AI Coach (decision-gated, premium).** The Edge-Function proxy + gating/quota, then modes 1 & 3 into the Build/Compare surfaces + mode 2 on tracks. Awaits Mike's go + the 3 open AI decisions (funding/scope/model). **Effort: Large, multi-cycle.**
- **Phase H — Port to other kits.** Reuse the proven Excel pattern on SQL · Python · Power BI · Tableau · Stats, one kit per cycle. ⚠️ Per-kit data shapes differ (SQL/PowerBI `ral.{code,say,lines}` + result tables; Python output blocks; Tableau/Stats Chart.js + sections) — the CLAUDE.md per-kit cheat-sheet is the map. Includes the cross-kit jumbled-title sweep. **Effort: Large (per kit).**

**Suggested order to ship value fast:** A (now) → B (exemplar sign-off) → C → D → E → F → then G and H as their own tracks.

---

## Part 7 — Open decisions for Mike (recommendations included)

1. **Exemplar-first rollout?** Build the full redesigned flow on ~3 formula-spine lessons, you test the feel, _then_ roll to all 51. **Rec: yes** — protects against a 51-lesson redo in the wrong direction.
2. **On-the-job gating.** Keep the concrete _scenario_ on every lesson (it's the worked-example framing — pedagogically essential) but show the role-specific "On the job" aside **only on track lessons**? **Rec: yes** — reconciles your ask with the research (don't strip concreteness from core lessons).
3. **Charts.** Add lightweight **inline SVG** charts for the handful of chart-reference items (keeps the kit zero-dependency / static), rather than pulling in Chart.js? **Rec: inline SVG.**
4. **Attempt input type.** The retrieval-first "Try" uses **Parsons / completion / MC** (gradable taps) rather than free-text typing, except where exact-match is safe — directly implements your fill-in-blank→MC ask. **Rec: yes.**
5. **AI Coach timing.** Build the free attempt-capture + compare surface now (Phases B/C); slot the AI modes in Phase G after your go + the 3 AI decisions. **Rec: yes** (de-risks, keeps free tier strong).

---

## Appendix — research citations (selected)

- Roediger & Karpicke (2006), _Test-Enhanced Learning_ — testing effect. · Butterfield & Metcalfe (2001), hypercorrection. · Kalyuga (2007), expertise-reversal.
- Ericson, Margulieux & Rick (2017); Haynes-Magyar & Ericson (CHI 2021); Ericson (2020 dissertation) — Parsons problems: equal gains, less time/load.
- Renkl & Atkinson (2003), fading worked steps + self-explanation. · Sweller & Cooper / Atkinson et al. (2000), worked-example effect.
- Chi (self-explanation); Gadgil, Nokes-Malach & Chi (2012, model repair); Sinha & Kapur (2021), productive failure meta-analysis (g≈.36).
- Cepeda et al. (2006, 2008) — spacing / 10–20% rule. · Rohrer et al. (2019) — interleaving RCT. · Bjork & Bjork (2011) — desirable difficulties.
- Sweller (cognitive load); Mayer (coherence, redundancy, multimedia, personalization & voice principles); Nielsen (progressive disclosure).
- Ryan & Deci (SDT/CET); Sailer & Homner (2023, gamification meta-analysis); Mar et al. (2021, narrative vs expository meta-analysis); seductive-details (Bender et al. 2021); Chou (white-hat/black-hat); Duolingo loss-aversion critiques.

_Full URLs are in the June 29 research briefs (session transcript)._
