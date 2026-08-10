# Guides backlog — 50 guides cross-referenced from the kits, 2026-08-07

Built by reviewing every kit's lesson list against the 49 guides already live.
Each line: slug idea, the search phrase it targets, and the kit content it
draws from. Ranked inside each cluster by expected search traffic times
winnability (tail terms we can own beat head terms we cannot).

**Status key:** ✅ = built in the 2026-08-07 batch. Everything else is open.

## Excel (biggest gap: 3 guides live, 11 kit units of material)
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
- Bonus bench if any slot frees up: build-a-pnl-from-a-ledger ("p&l from transactions"),
  contribution-margin-break-even, gross-vs-operating-vs-net-margin,
  data-grain ("what is the grain of a table" — the concept every kit teaches),
  pareto-abc-analysis ("abc analysis inventory pareto").

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
2. **Power BI domains 3 and 4** — `powerbi-cert` q29-q50, **22 of 50 questions
   with one guide between them**. Visuals, drillthrough, bookmarks, AI visuals,
   the Service, workspaces and roles, apps, gateways, RLS, data alerts.
   Probably three or four guides, not one.
3. **DAX iterators, SUM vs SUMX** — `powerbi-cert` q22, `final` b3. TWO kits.
   `powerbi-calculate` mentions SUMX only as context transition, never the
   "SUM takes one column" failure both questions test.
4. **Interview skills** — `final` i1-i4, **the entire Interview section with
   zero guides**: STAR, leading with the answer, handling a vague stakeholder
   ask, when to discuss salary. Closest live pages (`report-vs-analysis`,
   `technical-tenacity`) do not cover any of the four.
5. **Pandas selection** — `final` p2, p3. Boolean indexing and `.loc` vs
   `.iloc`. The pandas cluster jumps from `read_csv` straight to `groupby`.
6. **The COUNT family** — `excel-cert` q26. COUNT vs COUNTA vs COUNTBLANK.
   `excel-if-family` is IF/COUNTIF/SUMIF and does not cover the split.
7. **Paste Special** — `excel-cert` q11, q20. Formulas to values, transpose,
   formats. Only mention in the library is `excel-data-validation`, where a
   paste WIPES validation rules — the opposite topic.
8. **Excel text functions** — `excel-cert` q29, q30. MID/LEFT/RIGHT/LEN and
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
