This article gives you the reframe that makes pivot tables stop feeling like a machine with too many slots: a pivot is one question, asked of every row at once. **Rows is what you group by. Values is what you count or measure.** Write the question as a sentence and the two halves tell you where they go.

"How many games are in each segment?" Group by segment, count games. Drag Segment to Rows, drag any always-filled column to Values as a count. The pivot is the sentence, answered.

**The short version.** Every pivot question has the shape "for each X, how many, or how much, of Y?" X goes to Rows. Y goes to Values. If you cannot say the sentence, you are not ready to drag anything.

The example running through this article is the real one from [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/): 82,956 Steam games, labelled into four groups in [article 1](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/), and counted by a pivot in step 3 of the build.

## Why pivots feel confusing, and what they actually are

Before the explanation, answer honestly: when you open the PivotTable field list, what do you feel? For most beginners the answer is a small dread, four empty boxes and no idea which field belongs where.

The dread comes from approaching it as a layout tool: "what do I want the report to look like?" That question has no handle. There are thousands of possible layouts, and the boxes give no hint which one is yours.

Approach it as a question tool and the handles appear. A pivot does exactly one thing: it takes a question of the shape "for each X, how much Y?", asks it of every row, and prints the answers as a small table. The layout is not something you design. It is what the answer to your question happens to look like.

## The sentence, and where its halves go

Say your question out loud before touching the field list. It must fit this shape:
    
    
    For each  [group]  , how many / how much  [thing]  ?

| The half                             | The drop zone | From the build                          |
|--------------------------------------|---------------|-----------------------------------------|
| The group, the "for each X"          | Rows          | Segment: the four labels from article 1 |
| The thing measured, the "how much Y" | Values        | A count of games                        |

Two rules keep the halves honest.

**The Rows field must be a label.** A column with a small number of repeating values: segment, genre, region, month. Grouping by a column where every value is different, like a game's name, produces 82,956 groups of one, which answers nothing. This is why [labelling came four articles before pivoting](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/). The label column is what makes the question askable.

**The Values field must survive the arithmetic you are asking for.** Counting works on anything filled in. Summing and averaging only mean something on true quantities: price, hours, revenue. Sum a label-wearing-numbers column like an ID and you get confident nonsense, which is exactly what happened in this build, and it is the whole of the next article.

## Build the real one: four groups, one count

The question from the build: how many games are in each segment?

  1. **Click inside the Games table, then Insert > PivotTable.** Because the data is [a named Table](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-name-your-data/), the range is right by construction, and new rows will be included on refresh.
  2. **Drag Segment to Rows.** Four rows appear, one per label. Nothing is counted yet. You have only declared the "for each".
  3. **Drag AppID to Values, and make sure it says Count.** Any column that is filled on every row works as a count. If the box says Sum of AppID, click it, Value Field Settings, Count. Why it defaults to Sum is the next article.

The answer comes back:
    
    
    Unproven             78,064
    Proven, not loved     4,127
    Loved, found            590
    Loved, hidden           175
    Grand Total          82,956

Say out loud what the Grand Total row is doing for you. It is [article 2's addition check](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/), delivered without being asked: the groups sum to the row count of the file, so no game was dropped and none was counted twice.

## The other two zones, briefly

The field list has four boxes, and beginners feel obliged to fill all four. You are not.

**Columns** is a second "for each", crossed with the first. "For each segment, for each price band, how many games?" makes a grid. Add it only when the question genuinely has two group-bys. A question with one group-by makes a taller, clearer table.

**Filters** restricts which rows are allowed to answer. "Only games released after 2015." It is the one zone that removes rows, so everything [article 1 said about filters](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/) applies: fine for looking, dangerous for comparisons you are about to present.

Most working pivots are Rows plus Values and nothing else. An empty box is not an unfinished pivot. It is a question with the right number of parts.

## Reports come out of it, questions go into it

The reframe earns its keep when the pivot is built and someone asks the next question, because there is always a next question. "Fine, but is it different for expensive games?" With the report mindset, that is a new report to design from scratch. With the question mindset, it is one drag: add PriceBand to Columns, read the new sentence back, done.

This is also the boundary between a report and an analysis, which [has its own guide](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/): a report states numbers, an analysis answers a question someone will act on. A pivot built from a sentence is already halfway to the second.

Picture the last pivot someone sent you. Try to say its sentence. If you cannot, that pivot was a layout, and every reader of it had to invent their own question.

## Check it before you chart it

A pivot is a computed result, and computed results get checked, per [article 2](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/). The build's checks, both cheap:

**The corner.** Read what the Values box calls itself before reading any figure. Count of AppID is the question you asked. Sum of AppID is a different, meaningless question, answered confidently.

**One group, one COUNTIF.** `=COUNTIF(Games[Segment],"Loved, hidden")` in a spare cell should say 175, matching the pivot's row. One agreeing group plus an agreeing Grand Total is strong evidence the whole table is honest.

## Run it on your own file

  1. **Write the sentence first.** "For each ___, how many ___?" on paper or in a cell. If the first blank has no label column yet, build it, article 1's way.
  2. **Place the two halves.** Group to Rows, measure to Values. Touch nothing else.
  3. **Read the corner.** Count of, or Sum of? Make it say what your sentence says.
  4. **Check one row and the total.** A COUNTIF for one group, and the Grand Total against the row count.
  5. **Only then consider Columns or Filters** , and only if the question genuinely grew a second part.

## A cheat sheet

| You want                       | Do                                         | Watch for                                            |
|--------------------------------|--------------------------------------------|------------------------------------------------------|
| To start any pivot             | Say the sentence: for each X, how much Y?  | No sentence, no dragging                             |
| The group half                 | X goes to Rows                             | Must be a label column with repeating values         |
| The measure half               | Y goes to Values                           | Read the corner: Count of vs Sum of                  |
| A count of rows                | Any always-filled column, set to Count     | Sum of an ID column is nonsense with confidence      |
| A second group-by              | Columns zone                               | Only if the sentence really has two "for each" parts |
| To restrict the rows answering | Filters zone                               | It removes rows. Comparisons need every row present  |
| To trust the result            | One COUNTIF, plus Grand Total vs row count | Predict the values before you look                   |
| New data arrived               | Right-click the pivot, Refresh             | Works because the source is a named Table            |

**The one habit to keep.** Say the question as a sentence before you open the field list. Rows is the "for each". Values is the "how much". Everything else is optional.

Back to the feeling from the top, the four empty boxes. Say your next pivot's sentence now, while it is fresh: for each what, how much of what?

---

*Originally published on Analyst Prep Kit: [A Pivot Table Is a Question, Not a Report](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-table-question/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
