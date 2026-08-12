By the end of this page you can tell the difference between a repeated row and a repeated key, count each of them without deleting anything, choose which of two conflicting rows survives, and know why the same table de-duplicates differently in pandas and in a spreadsheet. It is about twenty-five minutes, and every number below came out of running the code.

Here is what to do today, before any `drop_duplicates`. Run these two lines and compare them:
    
    
    df.duplicated().sum()                       # whole rows repeated
    df.duplicated(subset=["order_id"]).sum()    # keys repeated

If the second is larger than the first, you have rows that share a key and disagree about something, and those rows are the interesting part of your data rather than a nuisance to be removed.

The short version: `keep="first"` keeps whichever row happened to be higher up, so the survivor is chosen by the sort rather than by the data.

That is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Two small stacks stand side by side, and each holds the same pair of rows: both rows carry the order number 1003, one of them with a quantity of 3 and the other with a quantity of 5. In the left stack the row holding 3 is on top and the row holding 5 is underneath. In the right stack the order is reversed, so the row holding 5 is on top. In both stacks the top row is drawn in full strength with a heavy blue outline, and the bottom row is drawn pale grey with a line struck through it. The result is that the left stack keeps the 3 and the right stack keeps the 5, from identical data, because the only thing that differs between the two pictures is which row was placed first._

**Every number on this page is real.** An eight-row table, run in pandas 3.0.2. It is deliberately the same eight rows used in [the spreadsheet version of this problem](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-remove-duplicates/), because the two tools give different answers to the same question and section six is about why.

Here is the table. Eight rows, 56 units, and three of the rows repeat an order number.

| Row | order_id | rep        | region | units | What it is                    |
|-----|----------|------------|--------|-------|-------------------------------|
| 0   | 1001     | Dana Reyes | North  | 4     |                               |
| 1   | 1002     | Owen Park  | South  | 10    |                               |
| 2   | 1002     | Owen Park  | South  | 10    | the same row twice            |
| 3   | 1003     | Priya Shah | East   | 3     |                               |
| 4   | 1003     | Priya Shah | East   | 5     | same key, different units     |
| 5   | 1004     | Dana Reyes | North  | 6     |                               |
| 6   | 1004     | Dana Reyes | north  | 6     | differs by one capital letter |
| 7   | 1005     | Sam Okafor | West   | 12    |                               |

## 1. Two different questions

Before the explanation: eight rows, three repeated order numbers. Say how many of the rows are duplicates.

The question has two answers, and which one you want decides everything else.
    
    
    df.duplicated().sum()                      1     whole rows repeated
    df.duplicated(subset=["order_id"]).sum()   3     keys repeated

One row is an exact copy of another. Three rows share an order number with a row above them. The gap between one and three is the whole subject: two of those rows repeat a key while carrying different information, and they are not copies of anything.

"Duplicate" is not a property of the data, it is a property of the columns you compare. Comparing every column asks "is this row a copy". Comparing the key asks "should this thing appear only once". Those are different questions and they have different right answers, and `drop_duplicates` will answer whichever one your `subset` argument asked for without commenting on the choice.

## 2. duplicated, and the three keeps

`duplicated()` returns a boolean per row, and the `keep` argument decides which member of each group is _not_ flagged.
    
    
    df.duplicated()                 flags 1 row     keep='first', the default
    df.duplicated(keep='last')      flags 1 row
    df.duplicated(keep=False)       flags 2 rows

`keep='first'` flags everything except the first of each group, which is what you want when you are about to drop. `keep=False` flags _every_ member of any group that has more than one, which is what you want when you are about to look, because it gives you all the rows involved rather than only the extras.

That second one is the more useful of the two while investigating:
    
    
    df[df.duplicated(subset=["order_id"], keep=False)]

That is the query to run first, every time. It returns the six rows that share a key with something, side by side, so you can see what they disagree about before deciding anything.

## 3. drop_duplicates, and the rows it returns

Same table, four calls, and four different answers.
    
    
    drop_duplicates()                                rows 7   units 46
    drop_duplicates(subset=["order_id"])             rows 5   units 35
    drop_duplicates(subset=["order_id"], keep="last") rows 5   units 37
    drop_duplicates(subset=["order_id"], keep=False)  rows 2   units 16

From 8 rows and 56 units to anywhere between 7 and 2. The last one is the surprise for most people: `keep=False` here does not mean "keep none of the duplicates", it means **drop every row involved in any group of more than one** , so only the two order numbers that appear exactly once survive.

The middle two differ only in which member of each group lived, and that changed the units total from 35 to 37. Two units, on eight rows, from one keyword. On a real table it is not two units.

Say out loud what a 35 or a 37 would look like in a report. Both are plausible, neither carries any indication that a choice was made, and the person reading it cannot tell which keyword was typed.

## 4. The survivor is chosen by the sort

Since `keep="first"` means "whichever is higher up", the way to choose deliberately is to put the row you want on top before dropping.
    
    
    df.sort_values(["order_id", "units"]).drop_duplicates(subset=["order_id"])
         1003 keeps 3        total units 35
    
    df.sort_values(["order_id", "units"], ascending=[True, False]) \
      .drop_duplicates(subset=["order_id"])
         1003 keeps 5        total units 37

Identical data, identical drop, two different results, decided entirely by the sort in front of it. That is not a flaw; it is the only place where the choice can be expressed, which is why it should be written down rather than left to whatever order the file arrived in.

Three sorts that come up constantly:

| Sort by                          | Keeps                                                                  |
|----------------------------------|------------------------------------------------------------------------|
| A timestamp, descending          | The most recent version of each record.                                |
| An amount, descending            | The largest, which is often the real one and a rerun's is the partial. |
| A completeness score, descending | The row with fewest blanks: `df["filled"] = df.notna().sum(axis=1)`.   |

Write the sort and the drop as one chained expression, so nobody can move one without the other, and put a comment on it saying which rule you chose.

## 5. Mark instead of delete

Two extra columns turn a destructive operation into a reversible one, and they answer both questions from section one at once.
    
    
    df["seen"]     = df.groupby("order_id").cumcount() + 1
    df["row_seen"] = df.groupby(list(df.columns)).cumcount() + 1

`cumcount` numbers the rows within each group, starting at zero, so adding one gives a human-readable "this is the nth time I have seen this". Run on the table:
    
    
    row  order_id  region  units  seen  row_seen
      0      1001   North      4     1         1
      1      1002   South     10     1         1
      2      1002   South     10     2         2
      3      1003   East       3     1         1
      4      1003   East       5     2         1
      5      1004   North      6     1         1
      6      1004   north      6     2         1
      7      1005   West      12     1         1
    
    rows where the key repeats:  3
    rows where the row repeats:  1
    the rows worth looking at:   1003 and 1004

Rows 4 and 6 are the point. Both have `seen = 2` and `row_seen = 1`: the order number has been seen before, and this exact row has not. Those are the two rows where the data disagrees with itself, and a one-column de-duplication destroys both without comment.

Keep the marked frame and filter from it, rather than dropping and hoping. It costs two columns and it means every later question, how many, which ones, what did they disagree about, can be answered without reloading anything.

## 6. pandas is case sensitive, and the spreadsheet is not

Before the explanation: rows 5 and 6 are identical except that one region is `North` and the other is `north`. Say whether `drop_duplicates()` treats them as the same row.
    
    
    "North" == "north"                False
    df["region"].nunique()            5    East, North, South, West, north
    df["region"].str.lower().nunique() 4

It does not. pandas compares strings exactly, so those are two different rows and both survive, which is why `drop_duplicates()` on all columns returned **seven** rows here.

The same eight rows in Excel come back as **six** , because its Remove Duplicates comparison ignores capitals. Same data, same intent, two tools, two answers, and neither of them tells you it made a choice about case.

That is worth knowing beyond the trivia, because analyses migrate between tools and the row counts stop matching for a reason nobody suspects. The defence is to normalise before comparing rather than to rely on either default:
    
    
    key = df["region"].str.strip().str.casefold()

`casefold` rather than `lower`, because it handles more of the world's alphabets, and `strip` first, because whitespace is the other invisible difference. Do the same to any text column you are comparing on, and the two tools agree again.

## 7. The index afterwards

Dropping rows does not renumber the ones that are left.
    
    
    df.drop_duplicates(subset=["order_id"]).index      [0, 1, 3, 5, 7]

The index has gaps where the dropped rows were, which is correct and occasionally awkward. It means `.iloc[2]` and `.loc[2]` now refer to different rows, and anything that assumes a contiguous index, including some plotting and concatenation, will behave oddly.
    
    
    df.drop_duplicates(subset=["order_id"]).reset_index(drop=True).index   [0, 1, 2, 3, 4]

`drop=True` matters: without it the old index is kept as a new column called `index`, which is occasionally useful for tracing a row back to the original file and usually just clutter.

## 8. Counting instead of dropping

Often the honest deliverable is not a de-duplicated table, it is a count.
    
    
    df["order_id"].value_counts().sort_index()
    
    1001  1
    1002  2
    1003  2
    1004  2
    1005  1

Three order numbers appear twice. That is a fact about the data, and if the order number is supposed to be unique then it is a fact about a system somewhere that needs fixing, which is a more useful thing to report than a table you tidied on your own initiative.

Two related counts worth having beside it. `df["order_id"].nunique()` against `len(df)` tells you the size of the problem in one comparison, 5 against 8 here. And `value_counts()[lambda s: s > 1]` filters straight to the offenders.

Picture your own most-used extract. If its identifier column stopped being unique next month, is there anything in your code that would notice, or would the totals simply go up?

## The full before and after

Same eight rows, same job: one row per order.

### Before
    
    
    df = df.drop_duplicates(subset=["order_id"])
    
    rows 8 -> 5, units 56 -> 35

Twenty-one units gone. Five of them belonged to order 1003, which was not a copy of anything, and six to a row that differed only by a capital letter. No record of any of it, and the survivor of each pair was whichever row the file happened to list first.

### After
    
    
    # 1. normalise the text you will compare on
    df["region_key"] = df["region"].str.strip().str.casefold()
    
    # 2. mark rather than delete
    df["seen"]     = df.groupby("order_id").cumcount() + 1
    df["row_seen"] = df.groupby(["order_id","rep","region_key","units"]).cumcount() + 1
    
    # 3. read the two counts and the disagreement
    (df.seen > 1).sum()                       3
    (df.row_seen > 1).sum()                   2
    df[(df.seen > 1) & (df.row_seen == 1)]    order 1003, the real conflict
    
    # 4. choose the survivor on purpose, and say why
    clean = (df.sort_values(["order_id", "units"], ascending=[True, False])
               .drop_duplicates(subset=["order_id"])      # keep the larger quantity
               .reset_index(drop=True))
    
    rows 5, units 37, and the choice is in the code

The claim, and it is why section one comes first: **the same eight rows return 7, 5 or 2 rows depending on two keyword arguments, and the units total moves from 35 to 37 on the choice of`keep` alone, with nothing in the output recording which was used.**

## Edge cases worth knowing

Six that get through.

**Whitespace.** `"North "` and `"North"` are different, so duplicates hide behind a trailing space and `drop_duplicates` reports finding nothing. Strip before comparing.

**Missing values in the key.** pandas treats `NaN` as equal to `NaN` for this purpose, so every row with a missing key is a duplicate of every other one and all but one are dropped. On a partly populated key that can be most of the table.

**Floats.** 10.0 and 10.000000001 are different rows and display identically. Round explicitly before comparing on a numeric column.

**Dates with a time.** Two records on the same day are different values if one carries 09:14. Normalise with `.dt.normalize()` if the day is what you mean.

**Column order in`subset`.** It does not matter for correctness, and it does matter for reading: list the columns in the order somebody would say them, because that list is your definition of identity.

**Duplicates created by a merge.** If the row count went up before you got here, the duplicates are not in the data, they were manufactured by a join to a table whose key was not unique. De-duplicating afterwards hides the cause; [the merge guide](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-merge/) has the check that catches it at the source.

## Why this works

The reason no default is right is that identity is a claim about the world rather than a property of the table. In relational terms, declaring a key is declaring that some set of columns identifies a row uniquely, and everything downstream depends on that declaration being true (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Passing `subset=["order_id"]` is making that declaration in passing, and the two rows with `seen = 2` and `row_seen = 1` are the data telling you the declaration is currently false. Deleting them removes the evidence rather than the problem.

The exact-match case is also only the easy half of the job. Detecting records that refer to the same real thing without being byte-identical is a research area with its own similarity measures, thresholds and evaluation methods, because in general there is no exact rule and the decision involves judgement about how much difference still counts as the same entity (Elmagarmid, Ipeirotis, & Verykios, 2007, _IEEE Transactions on Knowledge and Data Engineering_ , 19(1), 1–16). `North` against `north` is the mildest possible version of that, and the fact that two mainstream tools resolve it differently is a good indication that it is a judgement rather than a fact.

One note on why this page separates the two questions before doing anything. Holding several unfamiliar distinctions at once is what makes a topic feel hard, and instructional research treats the load imposed by how material is presented as something a designer controls independently of the material's own difficulty (Sweller, 1988, _Cognitive Science_ , 12(2), 257–285). Repeated row and repeated key are two ideas; trying to learn `subset`, `keep` and the sort while still conflating them is three ideas resting on a confusion.

## Using this on your own project

De-duplicating a whole pipeline is not a task. Do this instead, in order.

  1. **Compare`nunique()` with `len()`** on every identifier column. One line, and it sizes the problem.
  2. **Run the two`duplicated` counts**, whole row and key, and look at the gap.
  3. **Look at the offenders** with `keep=False` before deciding anything.
  4. **Normalise the text** you compare on: strip, then casefold.
  5. **Sort deliberately** in front of every drop, and comment the rule you chose.
  6. **Report the count** as well as shipping the clean table. A key that is not unique is somebody's bug, not your housekeeping.

If you have paper nearby, one optional sketch is worth five minutes. Write your columns in a row and draw a box around the ones that together identify one real thing. Then write beside the box what you would do if two rows inside it disagreed. That box is your `subset` and that sentence is your sort, and both are decisions you would otherwise make by accident.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). The same job in a database, where nothing is deleted and the duplicates are listed instead, is [finding duplicate rows in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-find-duplicates/).

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                 | What it does                                                        |
|-----------------------|---------------------------------------------------------------------|
| Two questions         | Is this row a copy? Should this key appear once? Different answers. |
| `duplicated()`        | Boolean per row. Flags all but the first of each group.             |
| `keep='last'`         | Flags all but the last.                                             |
| `keep=False`          | Flags every row in any group of more than one. Use it to look.      |
| The look-first query  | `df[df.duplicated(subset=key, keep=False)]`                         |
| `drop_duplicates()`   | All columns. Exact copies only. 8 rows became 7.                    |
| `subset=["order_id"]` | Key only. 8 rows became 5, units 56 became 35.                      |
| `keep='last'` there   | Same 5 rows, different members, units 37.                           |
| `keep=False` there    | Drops every involved row. 2 rows left.                              |
| Which row survives    | Whichever is higher up. Sort first, deliberately.                   |
| Common sorts          | Newest timestamp, largest amount, fewest blanks.                    |
| Mark instead          | `groupby(key).cumcount() + 1`, and again over all columns.          |
| The interesting rows  | Key seen twice, row seen once. Same key, different data.            |
| Case                  | pandas is sensitive, Excel is not. Same table, 7 rows against 6.    |
| Normalising           | `.str.strip().str.casefold()` before comparing.                     |
| Missing keys          | Count as equal to each other, so they collapse into one.            |
| The index             | Keeps gaps. `reset_index(drop=True)` to renumber.                   |
| Counting instead      | `value_counts()`, and `nunique()` against `len()`.                  |

**The one habit to keep.** Compare the whole-row duplicate count with the key duplicate count before you drop anything. When they differ, the gap is made of rows that share an identifier and disagree about the data, and those rows are a finding about a system rather than untidiness in a file. If duplicates behave in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. Mine was a nightly extract that occasionally ran twice, where the second run had partial amounts, and a `drop_duplicates` on the order id kept whichever arrived first, so about one night a month reported a smaller number than the business had actually done. What has a de-duplication quietly chosen for you?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Elmagarmid, A. K., Ipeirotis, P. G., & Verykios, V. S. (2007). Duplicate record detection: A survey. _IEEE Transactions on Knowledge and Data Engineering_ , 19(1), 1–16.
  * Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. _Cognitive Science_ , 12(2), 257–285.

---

*Originally published on Analyst Prep Kit: [pandas drop_duplicates: keep='first', and the Row It Chose For You](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-duplicates/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
