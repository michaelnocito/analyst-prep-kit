# Project Studio — Dev Notes

Portfolio-project builder inside the Analyst Prep Kit. Scope → Plan → Build → Present, teaching the industry-standard analysis workflow (Ask → Prepare → Process → Analyze → Share → Act) with job-first tool guidance (Excel/SQL/Tableau core, Power BI/Python optional).

- Live: https://michaelnocito.github.io/analyst-prep-kit/projects/
- Source: `projects/index.html` (single-file, vanilla JS, GRAIN design system)
- State: `localStorage['apk-projects-v1']`
- Current version: v1.121.0

## ROADMAP

### Shipped
- v1.121.0 — Per-stage "How Steam Hidden Gems handled this" callouts in the Build phase: `ex` field on 4 STAGES (prepare/process/analyze/share), rendered under `.bp` when the stage is open. Just-in-time exemplars vs. the home-screen summary card.
- v1.120.0 — Worked-example card expanded into a per-stage guided tour: actual scope question + how the real project handled Prepare (broken header), Analyze (threshold tuning), Share/validate (Portal 2 / Batman catches).
- v1.119.0 — "Worked example" card on the Studio home: Steam Hidden Gems (finished project built with this workflow), linking to github.com/michaelnocito/steam-hidden-gems.
- v1.112.0 — "📚 New to this?" links on Build-phase plan steps: every tool-tagged step links to that tool's kit; SQL load/import steps deep-link to the SQL kit's new Unit 0 lesson "Set Up a SQL Database" (`../sql/#lesson-105`). Render-time, so saved plans get the links retroactively. (From Mike's playtest feedback: the steam_games_raw import step assumed prereq knowledge.)
- v1.103.0 — Initial ship: Scope wizard (7 steps), Plan (template/paste-your-own/Claude BYOK draft), Build (accordion checklist over the 6 analysis stages), Present (deliverable checklist + .md export).
- v1.103.1 — Fix: Next button on the Scope wizard stayed disabled while typing in the question/criteria fields (validity wasn't rechecked on keystroke, only on full re-render).

### In progress / next
- Mike dogfooding with the Steam Hidden Gems project (dataset: `apk-portfolio-hidden-gems/handoff_bundle/games.csv`, 126k rows) — feedback drives the next iteration.

### Backlog (unscoped, pull forward as needed)
- **Scope → auto-generate a starter SQL/Excel file from the saved case ("level 3", scoped 2026-07-08).** Closes the loop between scoping in Studio and doing the work in an empty editor (the "blank page" stall). By end of Scope the app holds the question, the success criteria, and each criterion's direct/proxy/cut column mapping — enough to emit a real, commented scaffold pre-filled with the user's own project.
  - **Output:** a downloadable `.sql` file: header with the project question; a Step 1 load/verify block linking the "Set Up a SQL Database" lesson (`../sql/#lesson-105`); then one commented `SELECT` stub per scoped criterion, tagged with its column mapping (`-- Criterion: "affordable" [direct → Price]`) and a WHERE skeleton. Same generator branches to an Excel/Power Query skeleton + pivot outline when the scope's tool is Excel.
  - **Why higher effort than levels 1–2:** it's a code generator, not a copy edit — new function walking the scope object, branching on tool and on each criterion's direct/proxy/cut tag, emitting valid syntax + wiring a download. Edge cases: missing/empty criteria, "cut" items (comment-only, no stub), multi-tool projects.
  - **Correctness risk = its own commit:** a subtly-wrong generated file teaches the wrong thing under Mike's name inside a learning product. Needs testing across several scope shapes before ship; do NOT tack onto an unrelated pass.
  - **Priority:** deferred. Levels 1–2 already deliver most of the ROI. Pull forward only if Studio usage shows people scoping but not finishing (the exact stall this fixes). Related backlog rows below (SQLite load pipeline, scoring CTE) can share its generator work.
- SQLite load pipeline + cleaning pass for the Hidden Gems dataset (owners range strings → numeric midpoints).
- Hidden Gem scoring view/CTE with thresholds set from real percentile distributions.
- Tableau dashboard + Excel pivot leg for the Hidden Gems project specifically.
- docx template for the final written scope/methodology deliverable.

### Playtest feedback triage (2026-07-06, from Supabase `Project Studio` inbox — 6 items, all still `new`)
- **Cross-device save** — currently `localStorage` only, no sync across browsers/machines. Real gap once Mike dogfoods on more than one device. Backlog — needs an account/sync layer (likely piggybacks on the Supabase project already used by [[project_playtest_tracker]]/freemium), not a quick add.
- **Large-dataset handling guidance** (3 overlapping items: "how to profile a 400MB/125k-row CSV without choking Excel", "confirm data source has the 6 criteria fields", "add general large-file-load tips") — Mike drafted the actual content himself (Power Query preview-without-load approach, Load To → Only Create Connection, don't just double-click a huge CSV). This is real, already-written copy for the Build stage's **Prepare** step note field. Backlog: fold into the Prepare stage's help text, sourced verbatim from his Supabase inbox note (see `Project Studio` game row) so we don't re-derive it.
- **Speech-to-text mic button** for the feedback/idea/bug capture fields — nice-to-have accessibility/speed feature, not blocking. Backlog.
- **Spellcheck in feedback fields** — likely just missing `spellcheck="true"` on the relevant `<input>`/`<textarea>` in `projects/index.html`; small enough to grab in the next Project Studio pass. Backlog, low effort.
