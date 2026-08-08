This article gives you the feature that changes what your file _is_ : a slicer, wired to every pivot on the page. One click on "Adventure" and every chart, every count and every percentage re-answers for adventure games. The reader stops reading your analysis and starts asking it questions.

That is the honest definition of a dashboard, and it is worth stating because the word gets used for any sheet with charts on it: **a dashboard is a page that answers follow-up questions without you present.** Charts alone answer the questions you anticipated. A slicer answers the ones you did not.

**The short version.** Click a pivot, Insert Slicer, pick a field. Then right-click the slicer, Report Connections, and tick every pivot on the page. That second step is the one everyone misses, and it is the whole feature.

## What a slicer is, and what it is not

A slicer is a filter with its state worn on the outside: a panel of buttons, one per value of a field, where the pressed button is visible from across the room. Functionally it filters pivots, the same as the dropdown in the pivot itself. The difference is entirely about the reader.

A pivot's own filter dropdown is invisible when closed. A reader cannot tell whether they are looking at all games or a filtered slice, and per [article 1](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/), an invisible filter under a presented number is how honest pages mislead. A slicer makes the current question unmissable. The page says, in buttons, "you are looking at Adventure."

Say the difference in one line before moving on. One version: a filter changes the numbers; a slicer changes the numbers _and announces it_.

## Insert one: two clicks

  1. **Click any pivot on the dashboard, then PivotTable Analyze > Insert Slicer.**
  2. **Pick the field a reader would ask about.** In the build's data that is PrimaryGenre or PriceBand: the columns someone would say "what about just..." with. Tick, OK.

The slicer appears as a floating panel. Drag it to the top of the page near [the KPI row](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-kpi-row/), because it is now part of the page's controls, and controls the reader cannot find are controls that do not exist.

At this moment the slicer drives exactly one pivot: the one you started from. Click a genre and watch: one chart moves, the others sit still. That half-working state is where most people stop, conclude slicers are flaky, and move on. The fix is the next section.

## Report Connections: the step that makes it a dashboard

  1. **Right-click the slicer > Report Connections.**
  2. **Tick every pivot on the page.** The list shows all pivots built on the same data. OK.

Now click a genre and watch the whole page move together: every chart, every count, every [percentage](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/) re-answering the same question at once. That synchronized move is the dashboard moment, and it costs two clicks per slicer.

One condition makes the list work: the pivots must share a source. If every pivot was built from [the same named Table](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-name-your-data/), they share what Excel calls a cache, and they all appear in Report Connections. Pivots built from different ranges live in different worlds and cannot be driven by one slicer. This is yet another payoff of step 1 of [the build order](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/): one table, one name, and every later pivot lives in the same world by construction.

## The boundary: what a slicer cannot reach

State the limit plainly, because discovering it mid-meeting is the bad version: **slicers drive pivots. They do not drive formulas.** The KPI row from [article 12](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-kpi-row/) is COUNTIFS and AVERAGEIFS reading the table directly, so it ignores the slicer completely. Click Adventure and the charts change while the big numbers do not.

That mismatch is dangerous exactly because everything looks live. Three honest ways to handle it, in order of preference:

**Label the KPI row as all-data.** "All 82,956 games" under the row, so the constant numbers read as constants. Cheapest, and often right: the headline claim of the page usually should not shift with a filter.

**Or build the KPIs as one-cell pivots** , each a tiny pivot showing a single value, connected to the slicer like everything else. More build, fully live.

**Or use GETPIVOTDATA** to point KPI cells at a slicer-driven pivot's cells. Middle ground: formula styling, pivot liveness.

Whichever you pick, pick it on purpose. A page where some numbers respond and others quietly do not, unlabeled, fails the same honesty test as an invisible filter.

## How many slicers, and which fields

One or two. A slicer is a question you are inviting, and a wall of six slicers invites question-combinations you have never once looked at yourself, some of which will land on [bases too small to mean anything](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/): three games in a genre-band intersection, wearing a confident percentage.

Which fields earn a slicer follows from the page's claim, the same load-bearing test as [the KPI row](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-kpi-row/): invite the follow-up questions the claim naturally raises. The build's claim is about hidden games across the whole field, and the natural follow-ups are "is it like this in my genre?" and "does price change it?" Genre and price band earn panels. Release year does not, however easy it would be to add.

## The states a reader must be able to see

Three small settings separate a slicer that helps from one that confuses, and all three are about visible state:

**The cleared state must be reachable.** The small funnel-with-an-x button in the slicer's corner clears the filter. Leave it enabled, and mention it in the page's one line of instructions if the file ships to strangers.

**Values with no data should grey out.** Slicer Settings, tick "Hide items with no data" or leave greyed-but-visible, so a reader clicking into an empty slice sees why the page went blank rather than concluding it broke.

**Multi-select is a decision.** The multi-select toggle lets readers combine genres. If the page's percentages only make sense one group at a time, leave multi-select off and the slicer enforces the page's logic for you.

## Run it on your own page

  1. **Confirm every pivot reads the same named Table.** If not, rebuild the strays first. Nothing else works without this.
  2. **Insert one slicer** on the field readers most often ask "what about just..." with.
  3. **Report Connections, tick everything.** Then click through three or four values and watch for any chart that fails to move.
  4. **Decide the KPI row's relationship to the slicer** and label it.
  5. **Click the strangest slice and read the page as a stranger.** Small bases, empty charts, percentages on nothing: whatever you find, a reader will find faster.
  6. **Clear the filter before saving.** The file opens for the next person the way you left it, and it should open answering the headline question, not last Tuesday's.

## A cheat sheet

| You want                                   | Do                                                    | Watch for                                              |
|--------------------------------------------|-------------------------------------------------------|--------------------------------------------------------|
| A slicer                                   | Click a pivot, PivotTable Analyze, Insert Slicer      | It starts connected to one pivot only                  |
| It to drive the whole page                 | Right-click, Report Connections, tick all             | Pivots must share one source table                     |
| KPI cells to respond                       | One-cell pivots or GETPIVOTDATA, or label as all-data | Formulas ignore slicers silently                       |
| The right fields                           | The claim's natural follow-up questions               | One or two slicers. Six invites nonsense intersections |
| Readers not getting lost                   | Clear-filter button visible, empty values greyed      | Ship the file with filters cleared                     |
| Percentages to stay honest under filtering | Check the smallest base a slice can produce           | Three rows wearing 67% again                           |

**The one habit to keep.** Report Connections, every time, the moment a slicer lands. A half-connected slicer is worse than none, because the page looks live and is lying about half of itself.

Which "what about just..." question do people ask about your current page? That field is your first slicer, and Report Connections is waiting.

---

*The full version of this guide lives on my site: [Make One Control Drive Every Chart on the Page](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-slicers/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
