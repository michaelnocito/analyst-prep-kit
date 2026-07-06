# Project Studio — Dev Notes

Portfolio-project builder inside the Analyst Prep Kit. Scope → Plan → Build → Present, teaching the industry-standard analysis workflow (Ask → Prepare → Process → Analyze → Share → Act) with job-first tool guidance (Excel/SQL/Tableau core, Power BI/Python optional).

- Live: https://michaelnocito.github.io/analyst-prep-kit/projects/
- Source: `projects/index.html` (single-file, vanilla JS, GRAIN design system)
- State: `localStorage['apk-projects-v1']`
- Current version: v1.103.1

## ROADMAP

### Shipped
- v1.103.0 — Initial ship: Scope wizard (7 steps), Plan (template/paste-your-own/Claude BYOK draft), Build (accordion checklist over the 6 analysis stages), Present (deliverable checklist + .md export).
- v1.103.1 — Fix: Next button on the Scope wizard stayed disabled while typing in the question/criteria fields (validity wasn't rechecked on keystroke, only on full re-render).

### In progress / next
- Mike dogfooding with the Steam Hidden Gems project (dataset: `apk-portfolio-hidden-gems/handoff_bundle/games.csv`, 126k rows) — feedback drives the next iteration.

### Backlog (unscoped, pull forward as needed)
- Scope → auto-generate a starter SQL/Excel file from the saved case.
- SQLite load pipeline + cleaning pass for the Hidden Gems dataset (owners range strings → numeric midpoints).
- Hidden Gem scoring view/CTE with thresholds set from real percentile distributions.
- Tableau dashboard + Excel pivot leg for the Hidden Gems project specifically.
- docx template for the final written scope/methodology deliverable.
