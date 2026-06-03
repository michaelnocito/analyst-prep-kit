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

## Excel (`lessonGridHTML` — cell grid)
- [ ] L1 Your First Formula — SUM / AVERAGE / COUNT (shows SUM only)
- [ ] L10 Text Functions — TRIM / PROPER / LEFT / LEN (shows PROPER only)
- [ ] L5 Count & Sum with Conditions — COUNTIF / SUMIF (shows SUMIF only)
- [ ] L11 Dates and Numbers — YEAR / MONTH / TEXT (shows MONTH only)
- [ ] L8 Slicers, Sorting & Grouping — three tools (shows filtered slicer only)

## SQL (`lessonResultHTML` — result table)
- [ ] L5 COUNT, SUM & GROUP BY — COUNT / SUM / AVG / MAX / MIN (shows COUNT only)
- [ ] L7 HAVING & Duplicates — HAVING / DISTINCT (shows HAVING only)
- [ ] L8 CASE & COALESCE — CASE / COALESCE (shows CASE only)
- [ ] L12 Reconciliation Queries — gaps / dupes / mismatches (shows gaps only)
- [ ] (L10 Window Functions — borderline; defer)

## Python (`lessonOutputHTML` — output block)
- [ ] L1 Variables & Data Types — int / float / str / bool (shows float+str)
- [ ] L11 String Cleaning — strip / lower / replace / contains (shows lower only)
- [ ] L10 Finding & Fixing Nulls — isnull / fillna / dropna (shows isnull only)
- [ ] L5 Exploring Data — describe / col-select / value_counts (shows value_counts only)
- [ ] L6 Filtering Rows — == / & AND / isin (shows == only)
- [ ] L7 Sorting & Selecting — sort_values / nlargest / value_counts (shows nlargest only)
- [ ] L3 Functions & Loops — function / loop (shows function only)

## Power BI (`lessonPbiHTML` / `lessonResultHTML` — table)
- [ ] L5 Calculated Columns vs Measures (shows measure only)
- [ ] L8 Time Intelligence — TOTALYTD / SAMEPERIODLASTYEAR / DIVIDE (shows YTD only)
- [ ] L9 Slicers & Filters — slicer / filter pane / 3 levels (shows slicer result only)
- [ ] L10 Drill-Through & Cross-Filtering (shows drill-through only)
- [ ] (L6 Basic DAX Aggregations — borderline; caption asserts coverage)

## Stats (`lessonStatHTML` / `drawStatChart` — Chart.js)
- [ ] L1 Mean, Median & Mode — show all 3 measures of center (shows one series)
- [ ] L4 Shape of Data — symmetric / right-skew / left-skew (shows right-skew only)
- [ ] (L9 Hypothesis Testing — borderline H₀/H₁; defer)

**Total strong gaps: ~26.** Order of fixing: Tableau → Excel → SQL → Python →
Power BI → Stats (Stats last; Chart.js multi-series is the most involved).
