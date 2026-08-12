This article gives you the rule that ends chart-gallery paralysis: the chart type is not a taste decision, because your question already made it. **Comparing groups takes a bar. Change over time takes a line. A relationship between two numbers takes a scatter.** Those three cover nearly everything an analyst ships.

The move is to say the question out loud and listen for its verb. "Which group is bigger?" is compare, bar. "Is it growing?" is trend, line. "Do expensive games get played longer?" is relate, scatter. The gallery has forty entries. Your question points at one.

**The short version.** Compare: bar. Trend: line. Relate: scatter. Everything else in the gallery is a special case or a mistake waiting for a meeting.

The example is from [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/). Its hero chart asks "how do the 175 hidden games compare to the 590 found ones?" Compare is the verb, so the finding lives in a bar chart, two bars per measure, per [article 1's](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/) groups.

## The verb test

Before the sections: write down the question your current chart is supposed to answer, as one sentence. If you cannot write the sentence, the problem is not chart choice, and no gallery will fix it. That sentence is the same one [the pivot was built from](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-table-question/), which is why the chart step comes after the pivot step in the build order.

With the sentence written, underline the verb:

| The verb in your question        | The shape of the answer            | The chart |
|----------------------------------|------------------------------------|-----------|
| Compare, rank, which is bigger   | A few named groups, one value each | Bar       |
| Grow, shrink, change, since      | One measure walking through time   | Line      |
| Relate, drive, depend, correlate | Many rows, two numbers each        | Scatter   |

## Compare: the bar, and its one rule

A bar chart is named groups on one axis, a value on the other. Its power is mechanical: people judge lengths against a common baseline better than they judge anything else on a chart, so differences between bars are read fast and read right.

The one rule: **the bars' baseline is zero.** A bar encodes its value in its length, and a bar cut off at 90 makes a 95 look double a 92. Excel sometimes volunteers a cut axis when values cluster. Decline. If the differences are too small to see from zero, the finding is that the differences are small, and hiding that in an axis trick is how dashboards lie by accident.

Horizontal or vertical is the one genuine taste call, with one exception: long category names read better on horizontal bars, where the labels sit beside the bars instead of rotating under them.

## Trend: the line, and what counts as time

A line chart is one measure sampled along an ordered axis, almost always time. The line exists to show shape: rising, falling, seasonal, flat. The reader's eye rides the slope, and the slope is the finding.

The rule that gets broken: **the horizontal axis must be genuinely ordered and evenly spaced.** Months, years, weeks. A line drawn across categories, four segments joined by a line, invents a slope between things that have no order, and the reader's eye reads a trend that does not exist. If the x axis could be shuffled without losing meaning, it is categories, and the verb was compare, and the chart is a bar.

Unlike bars, a line's vertical axis may start above zero. A line encodes change in its slope, not length, and a 2% seasonal swing genuinely invisible from zero is a real thing to show. Say the axis starts at 90 in the labeling, and the chart stays honest.

## Relate: the scatter, the most underused chart in business

A scatter puts one number on each axis and one dot per row. It answers the question the other two cannot touch: do these two things move together?

From the same dataset as the build: do games with more reviews have more owners? Reviews on x, owners on y, one dot per game. A cloud sloping up says yes. A shapeless cloud says no, and no is a finding too: it kills a story someone was about to tell in a meeting.

Say out loud why a bar chart cannot answer that question. A bar needs the rows squashed into a handful of groups first, and the relationship lives in the un-squashed rows. The scatter is the only one of the three that shows every row as itself, which is why it is the chart of [exploration](https://michaelnocito.github.io/analyst-prep-kit/guides/exploratory-data-analysis/) as much as presentation.

One warning inherited from [article 7](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/): a scatter of three dots is two rows short of an anecdote. Relationships need rows.

## The pie, and its one honest job

The pie is not banned. It has exactly one job it does well: **one whole, split into two or three parts, where the message is roughly how much of the whole one part takes.** "Hidden games are about a quarter of everything loved" survives as a pie, because a quarter of a circle is readable at a glance.

Past three slices it degrades fast, because the reader is now comparing angles, and people compare angles badly. Six genres in a pie is six angles nobody can rank. The same six genres as a bar is a ranking the eye reads in one pass. When the message is a comparison between the parts, the verb was compare, and compare takes a bar.

## Same data, three questions, three charts

The point of the verb test is that chart type belongs to the question, not the dataset. One dataset, the build's 82,956 games, answers all three ways:

| Question                                                    | Verb    | Chart                             |
|-------------------------------------------------------------|---------|-----------------------------------|
| Do hidden games reach a different audience than found ones? | Compare | Bar: two bars, median owners each |
| Are more of these games released each year?                 | Trend   | Line: count per release year      |
| Do games with more reviews have more owners?                | Relate  | Scatter: one dot per game         |

Picture your own main dataset for a second and say one question of each kind against it. If one of the three felt unnatural to phrase, that is real information: your data may simply not have a time axis, or not have two numeric measures, and the missing question was never yours to chart.

## Why this works

The ranking underneath the rule is measured, not aesthetic. Cleveland and McGill tested how accurately people read values off different visual encodings and found a stable ordering: position along a common scale is read most accurately, then length, then angle and slope, with area and color further down (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531-554).

The three-verb rule is that ordering applied: bars put comparisons on a common scale, where reading is most accurate. Lines put change into position and slope. Pies spend the reader's accuracy budget on angles, which is why they hold up only when the answer is coarse, like "about a quarter." You are not choosing what looks nice. You are choosing how much precision the reader keeps.

## Run it on your own numbers

  1. **Write the chart's question as a sentence.** The same sentence as the pivot's, usually.
  2. **Underline the verb, pick from the three.** Compare, trend, relate.
  3. **Check the one rule for that chart.** Bar: zero baseline. Line: ordered, evenly spaced axis. Scatter: enough rows to mean something.
  4. **If you reached for a pie, count the slices.** Two or three and a part-of-whole message, keep it. More, it is a bar.
  5. **Read the chart cold.** Cover the title and ask what a stranger sees first. If it is not the answer to your sentence, the next two articles are the fix: take things away, then point.

## A cheat sheet

| Question verb                    | Chart            | The one rule                                                 |
|----------------------------------|------------------|--------------------------------------------------------------|
| Compare, rank                    | Bar              | Baseline at zero, always                                     |
| Trend, change since              | Line             | Ordered, evenly spaced x axis. Categories are not a trend    |
| Relate, drive                    | Scatter          | One dot per row, and enough rows                             |
| Part of one whole                | Pie, reluctantly | Two or three slices, message no finer than "about a quarter" |
| Long category names              | Horizontal bar   | Labels beside bars beat rotated labels                       |
| Small differences between groups | Bar, from zero   | If nothing shows, small IS the finding                       |

**The one habit to keep.** Say the question, underline the verb, and let the verb pick the chart. If you are browsing the gallery for inspiration, you are missing a sentence, not a chart.

## References

  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531-554.

The sentence you wrote at the top: what was its verb, and is that the chart you had open?

---

*Originally published on Analyst Prep Kit: [Pick the Chart Your Number Already Decided](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pick-the-chart/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
