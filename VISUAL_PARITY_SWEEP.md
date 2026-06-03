# Visual-Parity Sweep — work-list

**Principle:** if a lesson's text names ≥2 co-equal parallel concepts, the "See it
on screen" visual must show ALL of them, not just one. (Started from Mike's L15
feedback, v1.32.0.) Audit across all 6 lesson kits, June 3, 2026.

Fix kit-by-kit; check off as shipped. Each kit's viz helper differs.

## Tableau (`lessonVizHTML` / `drawLessonChart` — Chart.js + html/table)
- [x] L15 Joins/Unions/Relationships — show JOIN + UNION + RELATIONSHIP *(v1.32.0)*
- [x] L20 Dual-Axis & Combined-Axis — show both axis types *(v1.32.0)*
- [x] L8 Aggregation — SUM / AVG / COUNT / COUNTD table *(v1.33.0)*
- [x] L5 Filters & Sorting — dimension / measure / Top N filter chips + sort *(v1.33.0)*
- [x] L12 Chart Choice — bar / line / scatter / pie / map grid *(v1.33.0)*
- [x] L6 Color, Size & Labels — Color + Size + Label encodings on one mark *(v1.33.0)*
**Tableau DONE.**

## Excel (`lessonGridHTML` — cell grid)  — DONE (v1.34.0)
- [x] L1 Your First Formula — SUM / AVERAGE / COUNT result rows
- [x] L10 Text Functions — TRIM / PROPER / LEFT / LEN table
- [x] L5 Count & Sum with Conditions — COUNTIF + SUMIF results
- [x] L11 Dates and Numbers — YEAR / MONTH / TEXT rows
- [x] L8 Slicers, Sorting & Grouping — slicer chip + sorted + grouped grid

## SQL (`lessonResultHTML` — result table)  — DONE (v1.35.0)
- [x] L5 COUNT, SUM & GROUP BY — COUNT/SUM/AVG/MAX/MIN columns
- [x] L7 HAVING & Duplicates — HAVING + DISTINCT comparison table
- [x] L8 CASE & COALESCE — CASE + COALESCE columns
- [x] L12 Reconciliation Queries — gaps + dupes + mismatches table
- (L10 Window Functions — borderline, left as-is)

## Python (`lessonOutputHTML` — output block)  — DONE (v1.35.0)
- [x] L1 Variables & Data Types — int/float/str/bool
- [x] L11 String Cleaning — strip/lower/replace/contains
- [x] L10 Finding & Fixing Nulls — isnull/fillna/dropna
- [x] L5 Exploring Data — describe/col-select/value_counts
- [x] L6 Filtering Rows — == / & / isin
- [x] L7 Sorting & Selecting — sort_values/nlargest/value_counts
- [x] L3 Functions & Loops — function + loop

## Power BI (`lessonPbiHTML` — html/measure/bars)  — DONE (v1.35.0)
- [x] L5 Calculated Columns vs Measures — column table + measure card
- [x] L8 Time Intelligence — TOTALYTD/SAMEPERIODLASTYEAR/DIVIDE table
- [x] L9 Slicers & Filters — slicer + filter-pane (3 levels)
- [x] L10 Drill-Through & Cross-Filtering — both panels
- (L6 Basic DAX Aggregations — borderline, left as-is)

## Stats (`lessonStatHTML` / `drawStatChart` — Chart.js)  — DONE (v1.35.0)
- [x] L1 Mean, Median & Mode — 3-bar chart (all three values)
- [x] L4 Shape of Data — symmetric/right/left skew sparklines (added `html` support to the helper)
- (L9 Hypothesis Testing — borderline, left as-is)

**SWEEP COMPLETE — all 6 kits.** Tableau → Excel → SQL → Python → Power BI → Stats.
Borderline/menu cases noted above were intentionally left as single worked examples.
