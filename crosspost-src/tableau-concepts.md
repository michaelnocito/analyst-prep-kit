By the end of this page you can say, out loud and in your own words, what every core Tableau idea does. Dimensions and measures. Blue fields and green fields. Aggregation. Joins, unions, relationships and blends. The order Tableau does things in. Calculated fields, table calculations and LOD expressions. Sets, groups, bins and parameters. Dashboards, actions and stories. That list is the whole concept surface of the entry-level Tableau certification, and it is about an hour of listening.

Here is what to actually do with it. Go through once end to end without stopping, just for the shape. Then come back to the cheat sheet near the bottom and try to say each answer before you read it. The saying-it-first part is not a flourish. It is the single thing that moves this from "I recognise that word" to "I can answer a question about it", and there is measured evidence for it further down.

The short version: Tableau has about eight ideas in it, and every screen in the product is those eight ideas rearranged. Learn what each one _does_ and the menus stop mattering.

One idea decides more of your Tableau experience than any other, so it gets the picture. Every field you drag is either blue or green. Blue cuts the view into separate buckets. Green draws a continuous axis. Same data, same shelf, two completely different charts.

> _The original carries a diagram here. In words: Two charts sit side by side, both built from the same single field of order dates. On the left, the field is shown as a blue capsule, and the chart underneath it is four separate bars standing apart from one another, each sitting under its own header label along the bottom: Q1, Q2, Q3, Q4. Gaps separate the bars, showing that a blue field cuts the view into discrete buckets. On the right, the same field is shown as a green capsule, and the chart underneath it is a single unbroken line rising and falling across a continuous axis marked with tick marks rather than headers. No gaps appear anywhere in the right-hand chart, showing that a green field produces one continuous axis instead of separate buckets._

**What this page is, and what it is not.** This is the concept layer: what each thing is and what it does. It is not a click-by-click build. If you want the hands-on version, the companion guide walks you through [building a Tableau dashboard and story on a real dataset](https://michaelnocito.github.io/analyst-prep-kit/guides/build-a-tableau-dashboard/), step by step, and publishing it. Working through that once alongside this once is the fastest route through both.

## 1. The four ideas everything else sits on

Before the explanation: Tableau splits your columns into two groups the moment you connect. What do you think it splits them by, and why would a tool bother?

There are four ideas here. They are small, they are related, and almost every confusing thing in Tableau is one of them being misunderstood.

### Data type

Every column has a type, and the type decides what Tableau will let you do with it. There are seven: number (whole), number (decimal), date, date and time, string, boolean, and geographic. Type is not cosmetic. A date column gets date behaviour, like automatic year and quarter levels. The same dates loaded as text get none of that, and you cannot sort them properly either. When a chart refuses to do something obvious, the type is the first thing to check.

### Dimension and measure

A **dimension** is a label you group by. Region, product, customer name, order date. A **measure** is a number Tableau does math on. Sales, profit, quantity.

The plain way to hold it: dimensions decide how many marks are on the screen, measures decide how big each one is. Drag Region to the view and you get one bar per region. Drag Sales and each bar gets a height. That is the entire division of labour.

Tableau guesses the split when it connects, using the type. Text becomes a dimension, numbers become measures. It guesses wrong constantly. A postcode is a number, and averaging postcodes is nonsense, so you convert it to a dimension by dragging it up into the dimensions area of the data pane. A field can also be used both ways in different places.

### Discrete and continuous

This is the one the exam leans on, and the one people conflate with dimension and measure. They are separate.

**Discrete** means separate values with nothing in between. Tableau colors discrete fields blue, and a blue field on a shelf produces _headers_ : distinct labelled buckets, sitting apart.

**Continuous** means an unbroken range. Tableau colors continuous fields green, and a green field on a shelf produces an _axis_ : a scale with everything in between included.

Most dimensions are discrete and most measures are continuous, which is why the two pairs get muddled. But you can have every combination. A date is the clearest case. Discrete year gives you a separate bucket per year, so 2023 and 2024 sit side by side even if you filtered out everything between. Continuous date gives you one running timeline, and a gap in the data shows up as a gap in the line. Neither is right. They answer different questions.

Say this one out loud before you read on: why can a bar chart of discrete months hide something that a line chart of continuous dates would show?

### Aggregation, and the level of detail of a view

Tableau almost never shows you a raw row. It groups rows and does math on each group. That math is the **aggregation** : sum, average, count, count distinct, minimum, maximum, median.

Which rows land in which group is set by the dimensions on the screen. That is the **level of detail** of the view, and it is the concept the harder questions are really testing. Put Region on the screen and the level of detail is region, so every number you see is per region. Add Category next to it and the level of detail becomes region and category together, and every number recalculates without you touching the measure. Same field, different answer, because the grouping changed underneath it.

**The one sentence version.** Dimensions set the groups, aggregation sets the math, and the number on the screen is the math done inside the groups. Nearly every "why is this number wrong" moment in Tableau is a group you did not realise was there.

## 2. Getting data in: extracts, joins, unions, relationships, blends

Before the explanation: if you need customer details and order details together, there are four different ways Tableau will combine them. Why would a tool need four?

### Live connection or extract

A **live** connection queries the source every time the view changes. The numbers are as fresh as the database. Speed is whatever the database gives you.

An **extract** is a compressed local copy, a `.hyper` file, built by Tableau's own engine. It is usually much faster, it works with the source disconnected, and it can hold a filtered or sampled subset. The cost is that it is a snapshot, so it is only as current as the last refresh. Extracts can refresh fully or incrementally, which means adding only rows newer than a chosen column.

Pick live for data that changes minute to minute and matters that way. Pick an extract for slow sources, for working on a plane, and for anything published to Tableau Public, which accepts extracts only. There is more on the performance side in the guide to [handling datasets too big to open](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/).

### Joins

A join matches rows from two tables on a shared key and returns one wider row. Inner keeps only matches. Left keeps everything from the left table. Right keeps everything from the right. Full outer keeps everything from both. This is ordinary SQL joining, and if the shapes are not solid yet, the [SQL JOINs guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) covers them with diagrams.

The Tableau-specific thing worth knowing: joining tables at different grain duplicates rows. Join one customer to their five orders and that customer's details now appear five times. Sum anything from the customer table and it is five times too big. This is the classic inflated-numbers bug.

### Unions

A union stacks tables on top of each other instead of side by side. Same columns, more rows. Twelve monthly files with identical headers become one table of a year. Joins add columns, unions add rows.

### Relationships

Relationships are the default since 2020 and the newest idea on this list. You tell Tableau how two tables relate, then you do not join them. Tableau writes the right query for whatever you drag out, at the right grain, and only brings in tables the view actually needs. In practice it avoids the duplication problem above, because the customer table is not physically flattened onto the order table. If someone says a data model is "noodled" together, they mean relationships.

### Blending

Blending combines data from two _separate_ sources that cannot be joined, for example a SQL table and a spreadsheet. Tableau queries each source separately, aggregates each one, then matches the results on a shared field called the linking field. A primary source drives the view and the secondary contributes.

The order matters and it is a favourite exam point. A blend aggregates first and combines second. A join combines first and aggregates second. That is why blends and joins can give different numbers from the same two tables.

Now picture your own work. If you had a sales table in a database and a target spreadsheet somebody emails you monthly, which of these four would you reach for, and what would go wrong with each of the other three?

## 3. The order Tableau does things in

Before the explanation: you filter a view down to the top ten products, then apply a second filter for one region. Do you get the top ten products in that region?

You do not, and the reason is the order of operations. Tableau applies filters in a fixed sequence, and each one only sees what survived the ones above it. Knowing the sequence is what turns "the filter did something weird" into "of course it did".

> _The original carries a diagram here. In words: Six stacked bands run down the page, each one narrower than the one above it, forming a funnel. From top to bottom the bands are labelled: extract, data source, context, dimension, measure, table calculation. A downward arrow runs along the left side of the stack. The narrowing shows that each filter only sees the rows left over by every filter above it, and the table calculation filter at the bottom sees the smallest set of all._

Reading the picture from the top down: an **extract filter** decides which rows even make it into your local copy. A **data source filter** trims what the workbook can see at all. A **context filter** is a normal filter you promote, and promoting it makes everything below it run on the reduced set. **Dimension filters** are your ordinary "Region equals West" filters. **Measure filters** run after aggregation, because a filter on "sum of sales above ten thousand" cannot run until the sum exists. **Table calculation filters** run last, on the already-built table.

So back to the question. A top-ten filter is a dimension filter and it runs at the same stage as the region filter, over the whole dataset, not inside the region. Promote the region filter to context and it now runs first, so the top ten is computed within the West. That is what context filters are for, and it is almost the only reason to use one.

The same ordering explains the other classic surprise. A table calculation filter hides rows from the display without removing them from the calculation, which is exactly what you want when you need a running total to still count the rows you are not showing.

## 4. Making new fields: calculations, table calcs, LODs

Before the explanation: you want each region's sales as a share of total sales. Tableau has three ways to build that. What is different about the number they each need?

Three tools, and the difference between them is _when_ they run and _what_ they can see.

### Calculated fields

A calculated field is a new column you write with a formula. It runs either row by row or on aggregates, and it cannot do both in one expression. This is the source of the error message everyone meets once: "cannot mix aggregate and non-aggregate arguments."
    
    
    // row level: runs once per row, before any grouping
    [Sales] - [Cost]
    
    // aggregate level: runs on the group in the view
    SUM([Sales]) - SUM([Cost])
    
    // this one fails: one side is a row, the other is a group
    SUM([Sales]) - [Cost]

The function families worth knowing by name are string functions such as `LEFT`, `TRIM` and `CONTAINS`, date functions such as `DATEPART`, `DATEDIFF` and `DATETRUNC`, the logical family `IF`, `CASE` and `IIF`, and the aggregations you already met. `IF` handles conditions with comparisons and ranges. `CASE` handles a single field matched against a list of values, and it reads better when that is what you have.

### Table calculations

A table calculation runs _last_ , on the table Tableau has already drawn. Running total, percent of total, difference, rank, moving average, percentile. It cannot see a row that is not in the view, because at that point the rows are gone.

Its whole behaviour comes down to one setting: **compute using** , which tells it which direction to move through the table. Across, down, across then down, or along a specific field you pick. The identical calculation gives a per-row running total or a per-column one depending only on that setting. When a table calculation gives a number nobody can explain, this is the setting to look at first.

### Level of detail expressions

An LOD expression computes at a grain you name, ignoring what happens to be on the screen. There are three keywords.

| Keyword   | What it does                                                                     | Plain example                                                                                          |
|-----------|----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `FIXED`   | Computes at exactly the dimensions you list, ignoring the view entirely          | `{FIXED [Region] : SUM([Sales])}` gives every row its region's total, no matter what else is on screen |
| `INCLUDE` | Uses the view's dimensions plus the ones you list, then rolls the result back up | Average order size per customer, shown at region level                                                 |
| `EXCLUDE` | Uses the view's dimensions minus the ones you list                               | A month's bar next to its year total, on the same chart                                                |

The reason LODs exist: an ordinary aggregation is trapped at the level of detail of the view, and a table calculation is trapped in the drawn table. An LOD is the only one of the three that can compute at a grain that is not on the screen at all. That is why "sales as a share of the region total, shown per product" needs one.

`FIXED` has one more property worth remembering, because it is a common question. It runs before dimension filters, so a normal filter does not shrink it. Promote that filter to context and it does. That is the order of operations from the last section, showing up somewhere new.

Now imagine you built all three for the share-of-total question. Which of the three would change its answer when a user clicks a region on the dashboard, and which would sit still?

## 5. Grouping things: groups, sets, bins, hierarchies, parameters

Before the explanation: four of the five things in this heading combine values into fewer buckets. One of them is not like the others. Which, and why?

These five get confused with each other constantly, and each one is genuinely simple on its own.

A **group** combines several values of a dimension into one named bucket. Ten small product lines become "Other". It is a hand-made rollup, and it is static.

A **set** is a custom subset of a dimension's members, and it is always in or out, two states. A fixed set is a list you tick by hand. A dynamic set is a condition, such as "customers with sales over 5,000", and its membership changes as the data changes. Sets can be combined with each other: union, intersection, and difference. That is what makes them the tool for questions like "which customers bought in both years".

A **bin** chops a continuous measure into equal-width buckets. Ages into ten-year bands, prices into fifty-dollar bands. You give it a bin size and it does the rest. Choosing where the edges go is a real decision, not a default, and there is a whole method for it in the guide on [picking a cutoff you can defend](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/).

A **hierarchy** nests dimensions so a view can be drilled: country, then state, then city. A plus sign appears on the pill and clicking it goes a level deeper. Tableau builds date hierarchies for you automatically, which is where year, quarter, month and day come from.

A **parameter** is the one that is not like the others. It is not part of your data at all. It is a single value a user picks, from a slider, a list or a text box, and on its own it does nothing. It only does something when a calculated field, a filter or a reference line reads it. That two-step nature is exactly what gets tested: a parameter needs something listening to it. It is how you build a chart where the viewer chooses the measure, or the threshold, or the top-N cutoff.

## 6. Charts, dashboards, actions, stories

Before the explanation: a dashboard and a story both show several charts. What is the difference in who is in control?

A **worksheet** is one chart. The **shelves** across the top, Columns and Rows, decide the layout of that chart. The **Marks card** decides how each mark looks: color, size, label, detail, tooltip, shape. Dropping a field on Detail splits the marks apart without changing anything visible, which is the trick behind most scatter plots.

**Show Me** is the panel that offers chart types and greys out the ones your current fields cannot make. It is a useful teacher: hover a greyed-out option and it tells you what it needs, for example one date and one measure.

The chart types the exam expects you to recognise are bar, line, area, pie, scatter, histogram, box plot, heat map, highlight table, treemap, bullet, Gantt, dual axis and combined axis, plus the map types, symbol and filled. Two distinctions inside that list get asked about directly. A **dual axis** puts two measures on their own separate scales in one chart, and you can synchronise them so the two scales match. A **combined axis** puts two measures on one shared scale. Separately, a **histogram** shows the distribution of one measure using bins, while a **bar chart** compares a measure across a dimension. They look alike and answer different questions.

Tableau also ships analytics you drag on rather than build: reference lines and bands, trend lines, forecasting, and clustering. Knowing they live on the Analytics pane, next to the Data pane, is most of what is asked.

A **dashboard** puts several worksheets on one screen. The reader is in control, and they can leave with any conclusion, including none. A **story** is a fixed sequence of views with captions, clicked through in order. The author is in control, and it ends where the author says. Both have their place, and the hands-on companion guide walks through making each one.

**Dashboard actions** are what make a dashboard interactive, and there are five. A filter action uses a selection in one sheet to filter another. A highlight action dims everything not selected. A URL action opens a link built from the selected data. A go-to-sheet action jumps somewhere. A parameter or set action writes the user's selection back into a parameter or a set, which is how the more advanced dashboards react to clicks. Each one fires on hover, select, or menu.

The layout parts worth naming: dashboards are either tiled, where objects snap into a grid, or floating, where you place them freely. Sizing is fixed, ranged or automatic. Containers, horizontal and vertical, hold objects in a row or a column and are what make a layout survive being resized. A device layout is a separate arrangement for phone or tablet.

## 7. The product family, and where work gets published

Before the explanation: which of the Tableau products can a person use to open and read a workbook, but not build one?

The names get tested directly, and there are only a handful.

| Product                  | What it is for                                                                                                  |
|--------------------------|-----------------------------------------------------------------------------------------------------------------|
| **Tableau Desktop**      |  The authoring application. Where you build workbooks.                                                          |
| **Tableau Prep Builder** |  Cleaning and reshaping data before it reaches a workbook, as a visible flow of steps.                          |
| **Tableau Server**       |  Publishing and sharing inside an organisation, hosted on that organisation's own machines.                     |
| **Tableau Cloud**        |  The same sharing, hosted by Tableau instead. Formerly called Tableau Online.                                   |
| **Tableau Public**       |  Free hosting for work you are happy to make visible to anyone. Everything published is downloadable by anyone. |
| **Tableau Reader**       |  Opens and reads packaged workbooks. Cannot author.                                                             |
| **Tableau Mobile**       |  Viewing published content on a phone or tablet.                                                                |

Then the file types, which are also asked about plainly. A `.twb` is a workbook holding your charts and a pointer to the data, but not the data itself. A `.twbx` is a packaged workbook with the data bundled inside, which is the one to send someone. A `.hyper` is an extract. A `.tds` is a saved data source connection, and a `.tdsx` is that plus the data.

Sharing options beyond publishing: export an image, export as PDF, export the underlying data to Access or CSV, or copy a crosstab to Excel. Published views can also be subscribed to, which mails someone a snapshot on a schedule, or given a data-driven alert, which mails them when a number crosses a threshold.

**The privacy point, because it is not just an exam answer.** Anything you publish to Tableau Public can be downloaded by anyone, including every row of data behind it. Company data, client data, and anything with names, emails or account numbers in it does not go there.

## How to study this so it sticks

Reading this page again will feel like learning and mostly will not be. Three findings from the memory literature change what an hour of study is worth, and all three are cheap to act on.

The first is that retrieving something from memory is a better way to store it than reviewing it. Students who read a passage once and then took recall tests remembered far more a week later than students who read the same passage four times, even though the re-readers felt more confident (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). Applied here: cover the right-hand column of the cheat sheet below and say each answer before you look. The struggle is the mechanism, not a sign you are doing it badly.

The second is spacing. The same total study time, spread across days rather than packed into one sitting, produces substantially better retention, and the effect holds across more than a century of studies and hundreds of experiments (Cepeda, Pashler, Vul, Wixted, & Rohrer, 2006, _Psychological Bulletin_ , 132(3), 354–380). Three twenty-minute passes on three days beats one hour tonight. If your exam is two weeks out, that is the single highest-value scheduling decision available to you.

The third is interleaving, and it matters specifically for a list like this one. When learners practised different problem types mixed together rather than in blocks, they did worse during practice and much better on a later test (Rohrer & Taylor, 2007, _Applied Cognitive Psychology_ , 21(9), 1209–1224). The failure mode this fixes is real on this exam: study joins for twenty minutes and you will get joins right, because you know a join question is coming. Mixing joins, LODs and file types together is what trains you to tell them apart, which is the actual test.

If you have paper nearby and a spare five minutes, there is one drawing worth doing, and it is optional. Draw the filter funnel from section three from memory, six bands, top to bottom. It is the concept with the most downstream consequences, and drawing a diagram from memory is both a retrieval attempt and a check on whether you actually have it.

## The exam itself, in numbers

Some plain logistics, since they change what you prioritise. The entry-level credential was renamed in July 2025. It used to be Tableau Desktop Specialist and is now Salesforce Certified Tableau Desktop Foundations, delivered through Trailhead Academy. Both names refer to the same exam, and older study material uses the old one.

| Item                           | Detail                                                              |
|--------------------------------|---------------------------------------------------------------------|
| Questions                      | 45, multiple choice and multiple response. No hands-on tasks.       |
| Time                           | 60 minutes                                                          |
| Passing score                  | 750 on a 100 to 1000 scale                                          |
| Fee                            | 75 USD, with one retake included                                    |
| Prerequisites                  | None                                                                |
| Connecting and preparing data  | 25% of the exam. Section 2 above.                                   |
| Exploring and analysing data   | 35%, the largest section. Sections 4 and 5 above, plus chart types. |
| Sharing insights               | 25%. Section 6 and the publishing part of 7.                        |
| Understanding Tableau concepts | 15%. Section 1 and the product family.                              |

Two things follow from that table. The exploring section is the biggest single block, so calculations, LODs, table calculations and chart types deserve the most of your time. And the concepts section, at 15%, is the smallest by weight while being the thing every other section is built out of. Do not study it last.

**Check the numbers before you book.** Salesforce updates exam guides, and this page was written in July 2026. Take the official exam guide on Trailhead Academy as the authority on fees, weightings and objectives, and treat the table above as orientation.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                   | What it does                                                                           |
|---------------------------|----------------------------------------------------------------------------------------|
| Dimension                 | A label you group by. Decides how many marks are on screen.                            |
| Measure                   | A number Tableau does math on. Decides how big each mark is.                           |
| Discrete (blue)           | Separate values. Produces headers, distinct buckets sitting apart.                     |
| Continuous (green)        | An unbroken range. Produces an axis.                                                   |
| Aggregation               | The math done inside each group: sum, average, count, count distinct.                  |
| Level of detail of a view | The dimensions on screen. They set the groups every number is computed inside.         |
| Live connection           | Queries the source each time. Always current, speed depends on the source.             |
| Extract                   | A local .hyper snapshot. Fast, works offline, only as fresh as its last refresh.       |
| Join                      | Matches rows on a key into one wider row. Adds columns. Duplicates rows across grains. |
| Union                     | Stacks tables with the same columns. Adds rows.                                        |
| Relationship              | Tells Tableau how tables relate without flattening them. Query built per view.         |
| Blend                     | Combines two separate sources. Aggregates each first, then matches on a linking field. |
| Order of operations       | Extract, data source, context, dimension, measure, table calculation.                  |
| Context filter            | A promoted filter that runs before dimension filters. Fixes top-N inside a category.   |
| Calculated field          | A new column from a formula. Row level or aggregate, never both in one expression.     |
| Table calculation         | Runs last, on the drawn table. Controlled by its compute-using direction.              |
| FIXED                     | Computes at the dimensions you name, ignoring the view. Runs before dimension filters. |
| INCLUDE                   | View's dimensions plus yours, then rolled back up.                                     |
| EXCLUDE                   | View's dimensions minus yours.                                                         |
| Group                     | Combines dimension members into one named bucket. Static.                              |
| Set                       | In or out membership. Fixed by hand or dynamic by condition. Can be combined.          |
| Bin                       | Chops a continuous measure into equal-width buckets.                                   |
| Hierarchy                 | Nested dimensions you can drill through.                                               |
| Parameter                 | A single user-chosen value. Does nothing until a calculation, filter or line reads it. |
| Marks card                | Color, size, label, detail, tooltip, shape. How each mark looks.                       |
| Dual axis                 | Two measures, two separate scales, one chart. Can be synchronised.                     |
| Combined axis             | Two measures sharing one scale.                                                        |
| Dashboard                 | Several sheets on one screen. The reader is in control.                                |
| Story                     | A fixed sequence of views with captions. The author is in control.                     |
| Dashboard actions         | Filter, highlight, URL, go-to-sheet, parameter or set. Fire on hover, select or menu.  |
| .twb / .twbx              | Workbook pointing at data / workbook with the data packaged inside.                    |
| .hyper / .tds             | An extract / a saved data source connection.                                           |
| Tableau Reader            | Opens packaged workbooks. Cannot author.                                               |
| Tableau Prep Builder      | Cleans and reshapes data before the workbook.                                          |

**The one habit to keep.** When a Tableau number looks wrong, ask what the level of detail of the view is before you touch the calculation. Which dimensions are on the screen, and therefore what groups is this number being computed inside? That question resolves more problems than every other piece of troubleshooting combined, and it is the same question the hardest exam items are asking in disguise. If it does not resolve yours, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One genuine question, and I would like other people's answers. The concept that took me longest was discrete versus continuous, because I kept mapping it onto dimension versus measure and it kept nearly working. Which Tableau idea did you understand wrongly for the longest, and what finally fixed it?

## References

  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.
  * Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. _Psychological Bulletin_ , 132(3), 354–380.
  * Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. _Applied Cognitive Psychology_ , 21(9), 1209–1224.

---

*The full version of this guide lives on my site: [Tableau Concepts, Start to Finish](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-concepts/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
