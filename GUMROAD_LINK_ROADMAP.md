# Gumroad linking roadmap

**Opened 2026-08-09.** Batches of 13. After each batch: build, verify, commit, push, tick the box here.

## The audit that started it

| Property | Pages | Pages linking Gumroad | Gap |
|---|---|---|---|
| analyst-prep-kit guides | 131 | 36 | 95 |
| analyst-prep-kit kit hubs | 16 | 0 | 16 |
| analyst-prep-kit root index | 1 | 1 | 0 |
| michaelnocito.github.io | 10 | 0 | 10 |
| play-area | 1 | 0 | excluded, see below |
| migration-toolkit | — | 0 | excluded, static repo |

The 36 linked guides are the original migration/tableau/foundations set from
2026-07-31. Every guide written since then shipped with the `.cta` kit block and
no `.book` block. The kit hubs, which are the highest-traffic destination on the
site, have never had one.

**Excluded on purpose:** `play-area` (CrazyGames build, external commercial links
are a policy risk), and the app-shell hubs `drill`, `final`, `simulator`, `stats`,
`proto` (no reading surface to put a block on).

## The pattern being added

Existing block, from `guides/sql-foundations/index.html`:

```html
<div class="book">
  <strong>One-line statement of the moment the reader is stuck.</strong>
  <p><em>Book Title</em> is N pages, ...</p>
  <a class="booklink" href="https://michaelnocito.gumroad.com/l/<slug>" target="_blank" rel="noopener"
     onclick="if(window.gtag)gtag('event','guide_book_click',{kit:'guide-<slug>'})">Book Title, $19 &rarr;</a>
</div>
```

CSS `.book` / `.booklink` must be copied into pages that lack it. Page counts come
from the 2026-08-09 rebuild (Excel 378, SQL 458, stats 123, Power BI 187, python
203, charts 42, forecasting 43, tableau 128, migration 63, thinking 64).

Hub pages get `hub_book_click` instead of `guide_book_click`.

## Book mapping

| Guide topic | Book | Slug |
|---|---|---|
| Excel | Excel for Analysts | excel-for-analysts |
| SQL | SQL for Analysts | sql-for-analysts |
| pandas / Python | Python for Analysts | python-for-analysts |
| Power BI | Power BI for Analysts | power-bi-for-analysts |
| Tableau | Tableau for Analysts | tableau-for-analysts |
| Stats / testing | Statistics for Analysts | statistics-for-analysts |
| Charts / viz | Charts and Visualization | charts-and-visualization |
| Forecasting | Forecasting for Analysts | forecasting-for-analysts |
| Migration | The Data Migration Playbook | data-migration-playbook |
| Career / method | Thinking Like an Analyst | thinking-like-an-analyst |

Prices, confirmed on the live listings 2026-08-09: $19 for Excel, SQL, Tableau,
Python, Power BI, Statistics and Thinking Like an Analyst. $12 for Forecasting
and Charts and Visualization. $29 for the Data Migration Playbook.

Open question, verify before Batch 9: whether pack-core, pack-bi and
pack-everything are live listings with slugs. Memory has them built and staged
but the 07-31 handoff had them unlisted.

## Batches

- [x] **B1 — Kit hubs (13). DONE 2026-08-09, verified live.** excel, sql, tableau, python, powerbi, stats, forecasting, viz, chart-literacy, interview, path, projects, guides index

  Ten came from one edit to `assets/apk-footer.js`, which now carries a
  `BOOKS` map keyed by path segment and injects a card above the shared
  footer. Opt-in, so drill, final, simulator and the cert pages stay clean
  (checked live, no card on any of them). `viz` and the guides index got a
  static `.book` block instead, because both already have their own footer
  and the shared script would have added a second one. `path` was missing
  the shared script entirely and now includes it.

  **Corrections found while building:**
  - `statistics/` is a meta-refresh redirect to `stats/`. The real hub is
    `stats/`, which is where the card went. It was on the excluded list by
    mistake.
  - Prices are all confirmed off the live listings: $19 for Excel, SQL,
    Tableau, Python, Power BI, Statistics and Thinking; $12 for Forecasting
    and Charts; $29 for the Playbook. No more guessing needed in later batches.
  - **The include had no version query**, so the CDN and every returning
    visitor kept the pre-batch file. The card was live in the repo and
    invisible on the site. Now `apk-footer.js?v=2` on all 18 pages.
    **Bump that number on any future edit to a shared asset.**
- [x] **B2 — Excel guides 1-13. DONE 2026-08-09, verified live.** character-encoding, chart-design-basics, check-your-work, circular-findings, clean-messy-data, conditional-formatting, csv-import-leading-zeros, custom-number-formats, dashboard-build-order, dashboard-claim, data-validation, dates, dynamic-arrays

  The guide pages turned out to be uniform: a `footer{border-top` CSS rule to
  anchor the `.book` styles to, and a closing `<div class="cta">` to sit the
  block above, so the kit route still reads first. That makes batches 3 to 9
  scriptable. The insert script is kept at `tools/insert-book-block.py`.
  Hooks are still written by hand, one per guide, naming the stall that page's
  reader is in. Read/write is UTF-8 with no BOM and existing line endings are
  preserved, per the PowerShell encoding rule.
- [x] **B3 — Excel guides 14-26. DONE 2026-08-09, verified live.** if-family, iferror, ifs-vs-nested-if, index-match, kpi-row, label-rows-before-charting, month-over-month, name-your-data, pick-the-chart, pivot-percentages, pivot-table-question, pivot-tables, power-query

  `excel-pick-the-chart` points at Charts and Visualization, not the Excel
  book. A reader on that page is choosing a mark, not fighting Excel. The
  prefix of a guide is not automatically the right book, so check the reader's
  actual problem in later batches too.
- [ ] **B4 — Excel guides 27-33 + adjacent (13).** remove-duplicates, slicers, sort-your-bars, sum-of-id-trap, sumifs, sumproduct, tables, vlookup-vs-xlookup, budget-vs-actual-variance, export-sql-results-to-excel, connect-excel-to-a-database, free-datasets-to-practice-with, sample-database-for-sql-practice
- [ ] **B5 — SQL guides 1-13.** aliasing, and-python, case-expression, cohort-retention, comments, count-function, ctes, dates, find-duplicates, funnel-analysis, group-by-having, indexing-for-analysts, joins
- [ ] **B6 — SQL guides 14-21 + setup (13).** month-over-month, null, reconciliation, running-total, segment-with-case, subqueries, temp-tables-vs-views, window-functions, practice-sql-online-no-install, set-up-a-sql-database, set-up-duckdb, which-sql-database-to-install, install-postgresql-for-beginners
- [ ] **B7 — Python + Power BI (13).** pandas-duplicates, pandas-fillna-dropna, pandas-groupby, pandas-merge, pandas-pct-change-cumsum, pandas-read-csv, connect-python-to-a-sql-database, install-python-for-data-analysis, install-jupyter-notebook, powerbi-calculate, powerbi-measures-vs-columns, powerbi-star-schema, powerbi-switch-true
- [ ] **B8 — Power BI, Tableau, Stats (13).** powerbi-time-intelligence, import-a-csv-into-power-bi, install-power-bi-desktop, connect-tableau-to-your-data, install-tableau-public, ab-testing-for-analysts, confidence-intervals, correlation-vs-causation, mean-vs-median, p-values, percentiles-iqr-outliers, standard-deviation, forecast-accuracy
- [ ] **B9 — Last guides + personal site (13).** moving-averages, choose-the-right-chart, how-charts-mislead, choose-your-analyst-role, then michaelnocito.github.io: index, portfolio/index, portfolio/analyst-prep-kit, portfolio/data-migration-toolkit, portfolio/telco-churn, portfolio/steam-hidden-gems, portfolio/music-hidden-gems, portfolio/hidden-gem-movies, migration-toolkit/index
- [ ] **B10 — Close-out (13 checks).** art/index, GA4 label audit across all new links, dead-slug sweep, hub vs guide event split verified in GA4, pack slugs confirmed, Gumroad-side cross-sell between the 12 products (the biggest structural gap: 12 listings with no connections between them)
