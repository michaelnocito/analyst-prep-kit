# Guides backlog — 50 guides cross-referenced from the kits, 2026-08-07

Built by reviewing every kit's lesson list against the 49 guides already live.
Each line: slug idea, the search phrase it targets, and the kit content it
draws from. Ranked inside each cluster by expected search traffic times
winnability (tail terms we can own beat head terms we cannot).

**Status key:** ✅ = built in the 2026-08-07 batch. Everything else is open.

## Excel (STALE LIST, kept as a record. Every slug below now exists as of 2026-08-23:
## pivot-tables, index-match, iferror, tables, clean-messy-data, dates,
## remove-duplicates, conditional-formatting, data-validation, power-query,
## dynamic-arrays, ifs-vs-nested-if, sumproduct, month-over-month. Check
## `ls guides/` before treating any line here as open work.)
1. ✅ vlookup-vs-xlookup — "vlookup vs xlookup" — Excel Unit 1
2. ✅ excel-sumifs — "sumifs multiple criteria" — Excel Unit 1
3. excel-pivot-tables — "how to make a pivot table" — Excel Unit 2
4. excel-index-match — "index match vs vlookup" — Excel Unit 4
5. excel-iferror — "iferror excel how to use" — Excel Unit 3 defensive formulas
6. excel-tables — "excel tables vs ranges (Ctrl+T)" — Excel Unit 4
7. excel-clean-messy-data — "clean data in excel TRIM text functions" — Unit 3
8. excel-dates — "excel dates stored as text / serial numbers" — Unit 3
9. excel-remove-duplicates — "remove duplicates excel without losing data" — Unit 7
10. excel-conditional-formatting — "conditional formatting based on another cell" — Unit 5
11. excel-data-validation — "excel drop down list data validation" — Unit 5
12. excel-power-query — "power query for beginners" — Unit 6
13. excel-dynamic-arrays — "FILTER UNIQUE SORT excel dynamic arrays" — Unit 6
14. excel-ifs-vs-nested-if — "nested if vs ifs excel" — Unit 4
15. excel-sumproduct — "sumproduct explained" — Unit 4 (risk-index guide links in)
16. excel-month-over-month — "month over month growth excel" — Unit 8

## SQL (deepest cluster authority already; fill the remaining searches)
17. ✅ sql-find-duplicates — "find duplicate rows in sql" — Units 2/5
18. ✅ sql-null — "sql is null vs = null, coalesce" — Units 1/2
19. ✅ sql-month-over-month — "month over month growth sql lag" — Unit 6
20. sql-dates — "sql date functions, group by month" — Unit 4
21. sql-subqueries — "subquery vs cte" — Unit 4
22. sql-running-total — "running total sql window frame" — Unit 6
23. sql-cohort-retention — "cohort retention analysis sql" — Unit 6
24. sql-funnel-analysis — "funnel conversion sql" — Unit 6
25. sql-indexing-for-analysts — "when to index a table" — Unit 4
26. sql-temp-tables-vs-views — "temp table vs view" — Unit 4
27. sql-reconciliation — "reconcile two tables sql row counts" — Units 4/5 + migration cluster hub
28. sql-segment-with-case — "customer segmentation sql case when" — Unit 6

## Python / pandas (zero guides live today beyond sql-and-python)
29. ✅ pandas-groupby — "pandas groupby agg" — Python Unit 2
30. pandas-read-csv — "pandas read csv first dataframe" — Unit 2
31. pandas-merge — "pandas merge vs join, left join pandas" — Unit 2
32. pandas-fillna-dropna — "pandas handle missing values" — Unit 3
33. pandas-duplicates — "pandas drop_duplicates keep first" — Unit 3
34. pandas-pct-change-cumsum — "pandas percent change running total" — Unit 5

## Power BI (zero guides live; every one opens a new search door)
35. ✅ powerbi-measures-vs-columns — "calculated column vs measure" — PBI Unit 2
36. powerbi-calculate — "calculate dax filter context explained" — Unit 2
37. powerbi-time-intelligence — "dax time intelligence dateadd totalytd" — Units 2/5
38. powerbi-star-schema — "power bi data model relationships star schema" — Unit 1
39. powerbi-switch-true — "switch true dax segmentation" — Unit 5

## Statistics (zero guides live; evergreen searches)
40. ✅ correlation-vs-causation — "correlation vs causation examples" — Stats Unit 2
41. mean-vs-median — "mean vs median when to use" — Unit 1
42. standard-deviation — "standard deviation in everyday words" — Unit 1
43. percentiles-iqr-outliers — "iqr outlier rule percentiles" — Unit 1
44. p-values — "what is a p value" — Unit 3
45. confidence-intervals — "confidence interval margin of error" — Unit 3
46. ab-testing-for-analysts — "a/b test sample size basics" — Unit 3

## Charts and forecasting
47. ✅ choose-the-right-chart — "how to choose the right chart" — Chart Literacy Unit 3
48. how-charts-mislead — "misleading graphs axis tricks" — Chart Literacy Unit 2
49. moving-averages — "moving average excel forecast" — Forecasting Unit 1
50. forecast-accuracy — "mape forecast accuracy" — Forecasting Unit 3

## Finance (shared Financial Analysis unit in 4 kits; business searchers)
- ✅ budget-vs-actual-variance — "budget vs actual variance analysis" (counts in the 50 above as the 10th build; slots beside 16/28 in cluster logic)
- ✅ gross-vs-operating-vs-net-margin — "gross vs operating vs net margin" — SQL Unit 7 lesson 702
- ✅ liquidity-and-leverage-ratios — "current ratio vs quick ratio" — SQL Unit 7 lesson 703
- ✅ net-present-value-npv — "how to calculate npv" — SQL Unit 7 lesson 704
- ✅ contribution-margin-break-even — "contribution margin break even" — SQL Unit 7 lesson 706
- Bonus bench if any slot frees up: build-a-pnl-from-a-ledger ("p&l from transactions"),
  data-grain ("what is the grain of a table" — the concept every kit teaches),
  pareto-abc-analysis ("abc analysis inventory pareto").

### The 2026-08-11 finance batch, and what it changed structurally

The four above were built together, because they were the last unmapped lessons
in the SQL kit's `LESSON_GUIDE` map. All 48 SQL lessons now point at a guide.

Two things worth not re-deriving:

1. **Finance got its own section on `guides/index.html`.** Filing them under
   "SQL concepts" would have repeated the exact mis-filing the 2026-08-09 real
   test caught, where a search returned Tableau guides under a SQL heading. The
   new section uses a balance-scale icon (`i-scale`), and
   `budget-vs-actual-variance` moved into it out of the Excel section. Section
   counts and reading times are recomputed at runtime, but the jump-link counts
   in the on-ramp are static and have to be edited by hand.
2. **The tool chip comes from the slug, not the section.** The four new guides
   are worked in SQL and carry the `sql` chip; the variance guide sits beside
   them and is worked in Excel, so it keeps `excel`. That is why the section is
   deliberately absent from `TOOL_BY_SECTION` in `tools/build-guide-index.js`.

Every figure on all four pages came out of a `sqlite3` run cross-checked in
pandas. The scripts are not in the repo; regenerate rather than trusting a
remembered number.

## Gaps found by the guide-popup rollout, 2026-08-09/10

A different source from the 50 above. Those came from kit LESSON lists; these
came from wiring the "Read more" popup into four kits and finding questions with
nowhere to send a learner. Each line names the kit questions that proved it, so
none of these is a guess about what people search for — it is a hole a studying
user actually falls into.

Ranked by how many kits the hole appears in.

1. ✅ **Absolute vs relative references** — BUILT 2026-08-10 as
   `excel-absolute-vs-relative-references`, and wired straight into the two
   questions that proved it, `excel-cert` q25 and `final` e1. It was the only
   item on this list that bit two kits. The page is built on one fact, that a
   reference stores a distance rather than an address, and one worked failure:
   a commission column that should total 1,326.40 totals 1,840.00 because the
   fill walks onto the next two assumptions and then into empty cells, with row
   2 correct in both versions. F4 order and the Mac shortcut come from
   Microsoft's own reference page; the 63%/83% inspection numbers are Panko 1999.
2. **Power BI domains 3 and 4** — `powerbi-cert` q29-q50, originally **22 of 50
   questions with one guide between them**. Being split by exam domain, one
   guide per batch. Remaining sub-items in the order I would take them:
   - 🟨 **Domain 3, visuals and interactions** — q31-q41. TWO BUILT 2026-08-23:
     `powerbi-slicers-filters-and-interactions` (q31, q32, q39) and
     `powerbi-drillthrough-and-bookmarks` (q33, q34). STILL OPEN: q35-q38, q40,
     q41, which are the no-DAX analysis panes — Analyze/explain the increase,
     the AI visuals (key influencers, decomposition tree, Q&A), conditional
     formatting, the Analytics pane forecast, groups and bins, mobile layout.
     That is one more guide and it needs its own doc-verification pass.
   - ✅ **Domain 4, the Service and sharing** — BUILT 2026-08-23 as
     `powerbi-publish-workspace-to-app`, wired into q42, q43, q44, q49, q50.
     The claim is the two-step release: the workspace is a staging area, the app
     is a snapshot, and "changes aren't live in the app until you publish again"
     is Microsoft's own wording. Carries the four-role capability table, the
     Admin-delegated "Allow contributors to update the app" setting, the fact
     that Members cannot change an existing user's role, and endorsement as a
     signal that grants no permissions.
   - ✅ **Domain 4, refresh and gateways** — BUILT 2026-08-23 as
     `powerbi-refresh-gateways-and-alerts`, wired into q45 and q48. Eight
     scheduled refreshes a day on shared capacity against 48 on Premium/PPU/
     Fabric, only Import mode needs refresh at all, the gateway rule is
     reachability not technology, one gateway connection per semantic model, and
     the merge that drags a cloud source through the gateway. Alerts: dashboard
     tiles only, card/KPI/gauge only, visible only to the person who set them,
     250 cap, and they can never beat the refresh schedule.
   - ✅ **Row-level security** — BUILT 2026-08-10 as
     `powerbi-row-level-security`, wired into `powerbi-cert` q46 and q47. One
     fact: RLS binds Viewers and app consumers only, never workspace Admin,
     Member or Contributor. One worked failure: an East manager correctly
     assigned to a correct role reads 9,890 where 3,040 was intended, and
     View As and Test as role both pass. Plus the additive-roles union, 4,040
     where 600 was expected, and the dynamic-RLS fall-through of TRUE that
     hands the table to a typo. Everything quoted from Microsoft's RLS
     reference and RLS guidance pages; Saltzer and Schroeder 1975 for least
     privilege and fail-safe defaults.
3. ✅ **DAX iterators, SUM vs SUMX** — BUILT 2026-08-10 as
   `powerbi-sum-vs-sumx`, wired into both questions that proved it,
   `powerbi-cert` q22 and `final` b3. The second and last item on this list to
   bite two kits. Built on one fact, that SUM takes a column while SUMX takes a
   table and an expression, and two worked failures: 9,890 that reports 214,625
   because multiplying two totals adds all 256 quantity-and-price pairings, and
   an AVERAGEX margin of 39.29% where the truth is 38.56%. Every single-row
   check passes on both measures, which is why neither gets caught. Signatures,
   the iterator and row-context definitions and the "if you do not need to
   filter the column, use the SUM function" line all come from Microsoft's own
   reference pages; the aggregate-then-relate finding is Robinson 1950.
   Context transition is linked to `powerbi-calculate` rather than repeated.
4. **Interview skills** — `final` i1-i4, **the entire Interview section with
   zero guides**: STAR, leading with the answer, handling a vague stakeholder
   ask, when to discuss salary. Closest live pages (`report-vs-analysis`,
   `technical-tenacity`) do not cover any of the four.
5. **Pandas selection** — `final` p2, p3. Boolean indexing and `.loc` vs
   `.iloc`. The pandas cluster jumps from `read_csv` straight to `groupby`.
6. ✅ **The COUNT family** — BUILT 2026-08-23 as `excel-count-counta-countblank`,
   wired into `excel-cert` q26. One fact: the three read different properties of a
   cell. One worked failure: a column cleaned with `=IF(A2="","",A2)` where COUNTA
   returns 20 and COUNTBLANK returns 5 over the same 20 cells. Also the SUM that
   reads 48,867.50 because one date is in the column. Original note:
   `excel-cert` q26. COUNT vs COUNTA vs COUNTBLANK.
   `excel-if-family` is IF/COUNTIF/SUMIF and does not cover the split.
7. ✅ **Paste Special** — BUILT 2026-08-23 as `excel-paste-special`, wired into
   `excel-cert` q11 and q20. Values, transpose, formats, column widths, the
   multiply-by-1 fix that takes a column from SUM 0 to SUM 1,480, and the plain
   paste that wiped a validation rule off F2 while F3 kept its own. Original note:
   `excel-cert` q11, q20. Formulas to values, transpose,
   formats. Only mention in the library is `excel-data-validation`, where a
   paste WIPES validation rules — the opposite topic.
8. ✅ **Excel text functions** — BUILT 2026-08-23 as `excel-text-functions`,
   wired into `excel-cert` q29 and q30. LEFT/RIGHT/MID/LEN/TEXTJOIN with results,
   the fixed `MID(A2,4,3)` that returns `-WE` on a longer code, the FIND version
   and the 365 `TEXTBEFORE(TEXTAFTER(...))` version, and `LEN`-minus-`LEN(TRIM())`
   as the first check on a failing lookup. Original note: `excel-cert` q29, q30. MID/LEFT/RIGHT/LEN and
   TEXTJOIN. Nothing exists.
9. **Power Query profiling and query management** — `powerbi-cert` q3, q9, q13.
   Column quality/distribution defaults, reference vs duplicate, Replace/Remove
   Errors. `excel-power-query` covers none of the three.
10. **Semi-additive measures** — `powerbi-cert` q24. Smallest of the set;
    may belong inside a time-intelligence follow-up rather than its own guide.

Deliberately NOT proposed as guides: the MO-210 ribbon mechanics (freeze panes,
print area, Page Layout view, Inspect Document, Show Formulas, Format Painter,
Auto Fill, Ctrl+1, sparklines, Move Chart, Switch Row/Column, chart alt text).
They are exam-specific button locations, not concepts, and the kit's own
explanations already do that job.

## Rules that govern the builds
- Every guide follows `marketing/ARTICLE_STANDARD.md` and clones the current
  guide template (sql-group-by-having is the reference page).
- AdSense Auto ads snippet (ca-pub-7244244607936879) on every guide, same as
  the 49 live ones. Overlay formats stay off in the dashboard.
- New guides go in `sitemap.xml` + `guides/index.html` cards; concept guides
  do NOT get home-page Reference cards (standing pattern).
- Tail terms over head terms (HANDOFF-seo-42-guides.md §1 is the reasoning).


## 2026-08-23 run

Three SQL guides (`sql-rank-vs-dense-rank-vs-row-number`,
`sql-case-overlapping-conditions`, `sql-anti-join`) and the three Excel cert
holes above. Figures from real `sqlite3` runs and, for the Excel three, from
driving Excel over COM (`New-Object -ComObject Excel.Application`). No
LibreOffice on this machine, so COM is the only route; headless Chrome needs a
FULL Windows path for `--screenshot` or it fails with access denied.

**After adding any guide, also add an ALIASES rule in
`tools/build-guide-index.js`.** The generated `data-kw` strips every word already
visible on the card, so a well-written card leaves the keyword layer almost
empty and the search box cannot find the page by its real terms.

Search-index cache version is now `?v=12` in `index.html`.


## 2026-08-23, Power BI batch

Four guides, no Power BI Desktop on this machine, so **every fact was verified
against Microsoft Learn before drafting** rather than from memory. Source URLs
are printed in a Sources note at the bottom of each page, which is the pattern
to keep for any guide about a product we cannot run locally.

Two corrections went back into `powerbi-cert/index.html` because the docs
disagreed with the kit's own explain text:
- **q32** said the default interaction is cross-highlighting. The docs say
  visuals cross-filter AND cross-highlight by default, and line charts, scatter
  charts and maps can only be cross-filtered.
- **q43** implied only Member and above can touch the app. An Admin can delegate
  app UPDATES to Contributors; publishing still cannot be delegated.

Search-index cache version is now `?v=13`. Guide count 159.
