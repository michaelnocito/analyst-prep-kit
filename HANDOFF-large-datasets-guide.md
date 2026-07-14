# HANDOFF: "How to Handle Large Datasets" guide + Reference area on home page

**For:** a fresh Claude Code chat.
**Owner:** Michael Nocito. Solo authorship on all commits (`Michael Nocito <hello.michaelnocito@gmail.com>`, no AI / Co-Authored-By trailers). Commit + push when done without asking. No em-dashes in prose.

---

## The goal (in one paragraph)

Create a new standalone how-to page, **"How to Handle Large Datasets,"** built from the exact same template as the existing SQL-database guide. It gets its own URL (so GA4 tracks it as its own page), links two ways with the SQL-database guide, gets linked from the relevant Analyst Prep Kit areas, and gets listed in a new **Reference / How-Tos** area on Mike's home page. While we are there, gather every how-to doc we already have (SQL database, and the git material) into that same Reference area.

---

## 1. The template to clone (study this first)

**File:** `analyst-prep-kit/guides/set-up-a-sql-database/index.html`
**Live URL:** https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-a-sql-database/

Copy its structure exactly so the two guides feel like one series:
- **GA4 tag already in the `<head>`:** `G-6C09BL3WH1`. This is property-wide and auto-tracks by URL path, so the new page shows up as its own row in GA4 "Pages and screens" with no extra work. Just include the same gtag snippet and give the page a clean, unique `<title>`.
- **Palette CSS variables** (warm cream/terracotta): `--bg:#FAF3EC; --ink:#3D1A0F; --muted:#6E4A33; --accent:#C5511F; --line:#E68A66; --card:#FFFFFF`.
- **Reusable classes:** `.crumb` (breadcrumb), `.step` (numbered step card), `.note` (highlighted callout), `.cta` (bottom call-to-action box), `.btn`. `main` is `max-width:760px`.
- **SEO block:** `<title>`, `<meta name="description">`, `<link rel="canonical">`, and `og:` tags. Follow the same pattern.
- **Footer CTA** links back to `../../sql/`, `../../`, `../../projects/`.

**New page location:** `analyst-prep-kit/guides/handle-large-datasets/index.html`
**New canonical URL:** `https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/`

---

## 2. What the page should teach (content spec)

Audience: a beginner analyst (career-switcher) who just hit a file too big to open. Same voice as the SQL guide: plain, calm, WHY before HOW. Ground it in the REAL example we just lived through (the Steam recommendations dataset), because Mike specifically values these real-world "quirks" as everyday-applicable content, not footnotes.

**Lead with: "What counts as large?"** (define it concretely, do not hand-wave)
- Excel / Google Sheets hard row cap: **1,048,576 rows**. Past that the file will not fully open.
- Practical signs you have a "large" dataset: the file is hundreds of MB to multiple GB, it has millions of rows, it freezes or crashes the app, or you see "not enough memory."
- Real example used throughout the page: `recommendations.csv` from the Steam reviews dataset = **~2 GB, ~41 million rows**. Excel cannot open it. A database can.

**Then the strategies (each its own `.step` card):**
1. **Use a database, not a spreadsheet.** SQLite + DB Browser removes the row cap entirely. Link to the SQL-database guide as the prerequisite for anyone who has not done this.
2. **The zip surprise.** Big public datasets (Kaggle etc.) usually download as a `.zip` bundled with extra files you do not need. Extract, then use only the one file you want. (Our download had `games.csv`, `users.csv`, and a metadata JSON alongside the one file we needed.)
3. **Import patience + disk space.** A 2 GB CSV takes several minutes to import, and the `.db` file grows to several GB. That is normal, not a hang. Watch free disk space: big CSV + big DB = several GB combined.
4. **Build an INDEX before you query.** Explain what an index is in plain words (a lookup shortcut on a column). Real number: our index on 41M rows took about 3 minutes to build once, and after that, joins that would have crawled ran instantly. Show the pattern: `CREATE INDEX IF NOT EXISTS idx_name ON table(column);`
5. **Work on a sample first.** Write and test your query against a small slice (`LIMIT`, or a saved sample CSV) so you iterate in seconds, then run the finished query on the full table. (Mike already ships a `steam_sample.csv` for exactly this.)
6. **Aggregate early, avoid `SELECT *` on millions of rows.** Use `GROUP BY` to collapse to one row per thing you care about. Returning 41M raw rows to the screen is what freezes tools.
7. **Check data types before you trust a filter.** Real gotcha: a true/false column stored as the TEXT `'true'`/`'false'`, not the numbers `1`/`0`. Filtering `= 1` silently matches nothing. Always peek at the header and first rows first.
8. **Mind provenance / snapshots.** Big datasets are point-in-time snapshots; two datasets you join may be from different dates. Say so; do not imply they were measured together.

**Optional "next level" note** (one short paragraph, do not overbuild): mention that for even bigger work, tools like DuckDB or pandas `chunksize` exist, but SQLite + DB Browser covers many-GB files fine for now.

---

## 3. Two-way linking with the SQL-database guide (required)

- **On the large-datasets page:** near the top, a `.note` that says roughly "New to databases? Set one up first," linking to `../set-up-a-sql-database/`.
- **On the SQL-database page** (`guides/set-up-a-sql-database/index.html`): add a `.note` or small `.cta` near the CSV-import step that says roughly: **"Working with a large dataset? (hundreds of MB, millions of rows, will not open in Excel) See: How to Handle Large Datasets"**, linking to `../handle-large-datasets/`.

---

## 4. Link from the applicable Analyst Prep Kit areas

- **SQL Kit** (`analyst-prep-kit/sql/`): link both guides where import / JOIN / big-file topics appear.
- **Portfolio Projects** (`analyst-prep-kit/projects/`) and specifically the **Steam Hidden Gems** project: link the large-datasets guide, since that project IS the worked example.
- **Consider a guides index page** (`analyst-prep-kit/guides/index.html`): none exists yet. A small landing page listing all guides would give the home-page Reference area one clean link to point at, instead of linking each guide separately. Recommended but optional.

---

## 5. Reference / How-Tos area on the home page (required)

**File:** `michaelnocito.github.io/index.html`
Current structure: a `.welcome` section, then `#projects` containing three `.section-label` groups with lucide icons: "Real Analysis" (`bar-chart-3`), "Learning Tools & Games" (`graduation-cap`), "Tools I Built" (`wrench`).

Add a new `.section-label` group, e.g. **"Reference & How-Tos"** with a lucide icon like `book-open`, matching the existing markup pattern exactly. List the docs:
- How to Set Up a SQL Database (existing guide)
- How to Handle Large Datasets (new guide)
- Git how-tos (see section 6, once located or created)

Match the card/link style already used in the other section-label groups. Keep it consistent with the site, do not invent a new component.

---

## 6. Git how-tos: gather or create (needs a quick decision with Mike)

Mike said "we created some how tos for git, get them all in there." **A search of every repo found no PUBLISHED git how-to page.** What exists is internal only:
- `keyform-handoff/HANDOFF-claude-code.md` and `keygarden-handoff/HANDOFF-claude-code.md` contain `git init` / `git commit` / `git push` sequences.
- `analyst-prep-kit/ROADMAP.md` references GitHub Pages workflow.
- Various `DEV_NOTES.md` mention git commands in passing.

**Action:** confirm with Mike whether he wants these internal notes turned into a proper public guide (e.g. `guides/git-for-analysts/index.html`, same template). If yes, that becomes the third Reference-area doc. If he points to a specific existing doc, use that instead. Do not skip this; it is an explicit part of the ask.

---

## 7. Analytics note

The `G-6C09BL3WH1` GA4 tag is property-wide across all analyst sites (per Mike's setup). Every new page that includes the standard gtag snippet is automatically tracked by its URL path as its own page in GA4 reports. So "its own dedicated page that is tracked" is satisfied just by (a) giving it its own folder/URL and (b) including the gtag snippet from the template head. No custom events needed unless Mike wants button-click tracking later.

---

## 8. Deliverables checklist

- [ ] `guides/handle-large-datasets/index.html` created from the SQL-guide template, content per section 2.
- [ ] Two-way links added (section 3).
- [ ] Links added from SQL Kit + Portfolio Projects + Steam Hidden Gems (section 4).
- [ ] Optional: `guides/index.html` landing page.
- [ ] Home-page Reference & How-Tos section added and listing the docs (section 5).
- [ ] Git how-tos resolved with Mike and listed / created (section 6).
- [ ] Commit + push BOTH repos: `analyst-prep-kit` (the guides) and `michaelnocito.github.io` (the home page). Verify on the live GitHub Pages URLs, not just locally.

---

## Key file paths (quick reference)

- Template guide: `C:\Users\Mike\Projects\analyst-prep-kit\guides\set-up-a-sql-database\index.html`
- New guide (to create): `C:\Users\Mike\Projects\analyst-prep-kit\guides\handle-large-datasets\index.html`
- Home page: `C:\Users\Mike\Projects\michaelnocito.github.io\index.html`
- SQL Kit: `C:\Users\Mike\Projects\analyst-prep-kit\sql\`
- Portfolio projects: `C:\Users\Mike\Projects\analyst-prep-kit\projects\`
- Steam Hidden Gems (worked example, Part 2 JOINs): `C:\Users\Mike\Projects\apk-portfolio-hidden-gems\queries\hidden_gems_joins.sql`
