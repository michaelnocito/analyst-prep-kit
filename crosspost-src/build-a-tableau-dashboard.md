By the end of this guide you will have a published Tableau dashboard and a three-point story, built on a real dataset. It lives on a public URL you can put in an application.

You build four small sheets. Each one makes exactly one point. You arrange them on a single screen, then walk a reader through them in three steps that end with a recommendation. Every step says what to click and what you should see afterwards.

Four small sheets, rather than a wall of charts, because a dashboard has to argue for something. A screen holding everything you could build leaves the reader to work out what matters. Most readers will not do that work.

**Dashboard vs Story, in one line.** A **dashboard** puts several charts on one screen so someone can explore. A **story** is a sequence of views with captions, clicked through in order, so someone is walked to a conclusion. Build both: the dashboard is what a hiring manager glances at, the story is what proves you can think.

> _The original carries a diagram here. In words: Four separate worksheets stack on the left: a big single number, a set of vertical bars, a set of horizontal bars, and a scatter of circles. An arrow points right to one dashboard panel that holds all four of them arranged on a single screen: the number across the top, the two bar charts side by side in the middle, the scatter along the bottom. A second arrow points right to three story cards numbered one, two and three, each showing one of those views with a caption line above it._

**The worked example.** Every instruction below is written against a real, free dataset: the [Telco Customer Churn](https://www.kaggle.com/datasets/blastchar/telco-customer-churn) file on Kaggle, 7,043 customers, one row each. A finished analysis of it, including the Python script that shapes the data, is public at [telco-churn-analysis](https://github.com/michaelnocito/telco-churn-analysis). Swap in your own dataset and the steps do not change, only the field names do.

## Step 1: Shape the data before you open Tableau

Tableau is a display layer. Deriving something inside it takes longer than deriving it upstream in SQL, Python or Excel, and upstream the work is visible to a reader. So before you connect anything, get the file into this shape:

| Rule                                                                          | Why                                                                                                                                                                                                                                                                                                         |
|-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **One row per thing you are counting** (one customer, one order, one patient) | Everything Tableau does is "group these rows and do math." Duplicated rows quietly double every number.                                                                                                                                                                                                     |
| **A 1/0 column for the yes/no outcome** , not just the word                   | You cannot average the word "Yes." A column that holds 1 for churned and 0 for retained turns every rate into simple arithmetic.                                                                                                                                                                            |
| **Buckets already assigned** , as a text column                               | Grouping customers into tenure bands, price tiers, or age brackets is analysis. Decide it once, upstream, where it can be reviewed. Picking where the bands split is its own job: [how to choose a cutoff you can defend](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/). |
| **A sort-order number for each bucket**                                       |  Tableau sorts text alphabetically, which puts "0-12 months" and "48-72 months" in an order nobody asked for. A 1-2-3-4 column fixes it in one click later.                                                                                                                                                 |
| **Readable column names** ("Monthly Charges", not "mnth_chrg")                | Tableau prints your column names on the chart. Renaming them in the source saves relabelling every axis by hand.                                                                                                                                                                                            |

For the churn example, that produces a file like this, one row per customer:
    
    
    Customer ID, Persona, Persona Order, Tenure Months, Contract,
    Monthly Charges, Add-on Services, Churn, Churned
    
    7590-VHVEG, New & At-Risk, 1, 1, Month-to-month, 29.85, 1, No, 0
    5575-GNVDE, Established,   3, 34, One year,       56.95, 2, No, 0

**Publishing to Tableau Public makes your data public.** Anyone can download the workbook and every row inside it. Only ever publish open datasets or data you have written permission to release. Company data, client data, and anything with names, emails, or account numbers in it does not go on Tableau Public.

## Step 2: Connect, then write one calculation

Open **Tableau Desktop Public Edition**. It is the free app from [public.tableau.com](https://public.tableau.com). Click "Download the App", and pick "Personal User" in the role dropdown if you are building a portfolio piece.

Watch the edition name. There is a similarly named _Tableau Desktop Free Edition_ , and it cannot publish to Tableau Public at all. Its own start page says so.

On the Connect screen, under **To a File** , choose **Text file** and pick your CSV. Tableau shows a preview grid. Click the orange **Sheet 1** tab at the bottom to start building.

Tableau does not know what a rate is until you tell it. Go to **Analysis → Create Calculated Field** , name it `Churn Rate`, and enter:
    
    
    AVG([Churned])

That one function is the whole rate. `Churned` is 1 for a customer who left and 0 for one who stayed. The average of a column of 1s and 0s is exactly the share of 1s. That is leavers divided by everybody, which is the rate. `SUM([Churned]) / COUNT([Customer ID])` gets you the same number the long way round. Before you read on, say out loud why those two give the same answer.

The important part is what Tableau does with the field afterwards. It redoes that math inside whatever group is on the screen. So the same field gives you the rate per segment, per contract, or per month, with no extra work from you.

Then make it read as a percentage instead of `0.265`: right-click the field in the Data pane, **Default Properties → Number Format → Percentage** , zero decimals.

**Why both sides need a function around them.** If you write `[Churned] / [Customer ID]` Tableau throws "cannot mix aggregate and non-aggregate arguments." A calculation either works row by row or works on groups, never half of each. `SUM` and `COUNT` put both sides in the same world.

**Check before moving on:** Churn Rate appears in the Data pane with an = sign on its icon, and nothing is on the sheet yet.

## Step 3: Build four sheets, one point each

Four sheets are coming up. Before you build them, guess which one will do the actual persuading, and keep your answer to check at the end of the step.

The discipline that makes a dashboard readable is simple. Decide the one sentence each sheet is allowed to say, before you build it. Four sheets, four sentences.

### Sheet 1: the headline number

Drag **Churn Rate** onto **Text** on the Marks card. Click **Text → the "..." button** and set the font to about 48pt. Title it with the number's job: "Overall churn, the number that hides everything." One sheet, one figure, no chart.

### Sheet 2: the segment bars

New worksheet. Drag your bucket field (**Persona**) to **Columns** and **Churn Rate** to **Rows**. Four bars appear. To fix the order, right-click the Persona pill, choose **Sort** , then **Sort By: Field** , **Ascending** , **Field Name: Persona Order** , **Aggregation: Minimum**. Drag **Churn Rate** onto **Label** so every bar prints its own number.

Now color it like you mean it. Drag Persona to **Color** , then **Color → Edit Colors**. Give the one segment your story is about a strong accent. Give every other segment the same gray. Four different colors means "look everywhere". One accent and three grays means "look here". Then hide the color legend: right-click it and choose **Hide Card**.

Now picture your own dataset in place of this one. Which single bar would you color, and what claim does that choice make on the reader's behalf?

**Check before moving on:** bars in life-cycle order, stepping down left to right, a percentage on each, one accent color.

### Sheet 3: the driver bars

New worksheet. This one answers "why". Drag the causal field, **Contract** , to **Rows** , and **Churn Rate** to **Columns**. That lays the bars sideways, so long category names stay readable. Sort descending with the sort icon that appears when you hover the axis, add labels, and use the same one-accent-plus-gray rule.

### Sheet 4: the relationship

New worksheet, and the only fiddly one. Drag **Add-on Services** to Columns and **Monthly Charges** to Rows. Both arrive as sums, which is meaningless here, so click each pill and choose **Measure → Average**. Set the Marks type to **Circle**. Drag **Persona** to **Detail** to split it into one dot per segment, and to **Label** so the dots are named. Drag **Customer ID** to **Size** and set it to **Count (Distinct)** , so a bigger dot means more people.

**Titles are sentences, not labels.** "Churn by contract type" tells the reader nothing they could not see from the axis. "Month-to-month contracts are the mechanism" tells them the finding. Write every chart title as the thing you would say out loud if you were pointing at it.

## Step 4: Assemble the dashboard

Click the **New Dashboard** icon at the bottom of the window (the middle of the three small icons). On the left panel set **Size** to **Automatic** so it fits whatever screen it lands on.

If you have paper nearby, this is the moment to use it. Sketch four boxes in the arrangement you want before you drag anything. It is optional, and it saves more dragging than it costs.

Your sheets are listed on the left. Drag them onto the canvas one at a time. Watch for the gray drop zone, which shows where a sheet will land before you release it. One layout works almost every time: headline number across the top, the two bar charts side by side in the middle, the relationship chart along the bottom.

Then two objects that most beginners skip, from the **Objects** section at the bottom left:

  * A **Text** object at the very top holding the dashboard's own title, written as a claim.
  * A **Text** object at the very bottom holding the takeaway, with a number in it. "Cutting first-year churn to the rate of the next cohort retains about 400 customers a year" is a takeaway. "Insights below" is not.

Finally, delete every legend and card that is not carrying information: click it once and use the small x in its corner. Empty space is not wasted space.

**Check before moving on:** nothing overlaps, no chart has its own scrollbar, and someone reading only the title and the bottom line would still get the point.

## Step 5: Sequence it into a three-point story

You have three slides to change somebody's mind. Which of your four sheets gets left out? Decide before you read the table below.

Click the **New Story** icon at the bottom (the right-hand one of the three). Set Size to Automatic and rename the story to the argument you are making.

A story point is a saved view plus a caption. Three points is enough for almost any finding, and the shape is always the same:

| Point             | What goes on it    | What the caption says                                                                                                                                                                                                                                                                                           |
|-------------------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1. The problem   | The segment bars   | The headline average, then the split that breaks it. "26.5% overall. First-year customers leave at 47%, the loyal core at 10%." Splitting an average before you report it is the whole move in [exploratory data analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/exploratory-data-analysis/). |
| 2. The mechanism | The driver bars    | Why it happens, in one sentence with the two numbers that prove it.                                                                                                                                                                                                                                             |
| 3. The action    | The full dashboard | What should change, named as specific plays rather than "further analysis is recommended."                                                                                                                                                                                                                      |

Drag a sheet onto the blank canvas for point 1. Then click **Blank** on the left panel to add the next point, and drag the next view onto it. Type each caption into the gray box above the view.

**Captions state findings, not furniture.** "Chart 2" and "Churn by contract" are furniture. The caption is your narration, and it should make sense even to somebody who never looks up at the chart.

**Check before moving on:** read the three captions aloud in order, ignoring the charts. If that alone is a coherent argument, the story works.

## Step 6: Publish it on Tableau Public

Tableau Public hosts finished work at no cost, which is what gives your project a link you can put on a CV or a portfolio site.

One requirement first. **Tableau Public only accepts extracts.** A workbook reading your CSV live off your hard drive gets rejected with "Workbooks saved to Tableau Public must use extracts", because Tableau's servers cannot see your disk.

The fix is one setting. On the **Data Source** tab, switch **Connection** from Live to **Extract** , then accept the save prompt for the extract file.

  1. Create a free account at [public.tableau.com](https://public.tableau.com).
  2. In Tableau: **File → Save to Tableau Public As** (older versions put it under **Server → Tableau Public**), then sign in.
  3. Name it as the finding, not the file. "Telco Customer Churn: Risk Personas" beats "workbook_final_v3".
  4. When the browser opens your published viz, click **Edit Details** and write a one-line description. Say what the data cannot tell you in that description, the same way you would [document the limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) of any analysis. Then set the story as the default view, so visitors land on the narrative rather than a stray worksheet.
  5. Save the workbook locally as well. **File → Export Packaged Workbook** makes a portable .twbx with the data inside. Keep it in the project folder that holds the rest of the analysis, so the file lives next to the code that made the data.

**Polishing after you publish is normal.** Keep working in the same window, and **Ctrl+S republishes to the same public link**. Nobody nails labels, sorts, and colors on the first upload.

**Check before moving on:** open the public link in a private browser window, signed out, and click through all three story points.

## Why this works

Two of the rules above are not taste. They come out of measured results, and it is worth knowing which parts of a chart are doing the work.

The first is the one-accent rule from Step 3. A single color among otherwise identical shapes is found by the eye in parallel, without searching. It takes about the same time whether there are three other bars or thirty (Treisman & Gelade, 1980, _Cognitive Psychology_ , 12, 97–136). Give four bars four colors and nothing is found early, because there is nothing to find. Give one bar the accent and the reader has arrived at your point before they have read a single label.

The second is why all three of your comparison sheets are bars. When people read a value off a chart, they are most accurate judging position along a common scale, which is what a bar's end against a shared axis is. Accuracy falls off through length, angle and area, in that order (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). That is the same reason Sheet 4 uses dot size only to say "bigger group", never to carry the number that matters.

The story is doing a different job from the dashboard, and the difference has a name. A dashboard is reader-driven: the reader explores, and can leave with any conclusion, including none. A story is author-driven: fixed order, one path, a caption at each stop. Published data stories sit somewhere between the two, and the shape used most often is a set order with commentary and small chances to explore inside each step (Segel & Heer, 2010, _IEEE Transactions on Visualization and Computer Graphics_ , 16(6), 1139–1148). Building both is not doing the work twice. It is the two ends of that range, and a hiring manager will use each one differently.

## The errors everyone hits once

Every one of these has stopped someone for an afternoon. None of them mean you are doing it wrong. If you hit one that is not on this list, [there is a diagnosis loop for that](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

| What you see                                              | What it means                                                                            | Fix                                                                                        |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| "Cannot mix aggregate and non-aggregate arguments"        | Your formula divides a raw column by a raw column                                        | Use `AVG([Churned])`, or wrap both sides: `SUM([Churned]) / COUNT([Customer ID])`          |
| "Workbooks saved to Tableau Public must use extracts"     | The workbook still reads the CSV live from your disk, which Tableau's servers cannot see | Data Source tab, switch Connection from Live to Extract, save, publish again               |
| No publish option anywhere                                | You are in Tableau Desktop Free Edition, which cannot share or publish                   | Install Tableau Desktop Public Edition from public.tableau.com and open the workbook there |
| The rate shows as 0.265                                   | Number format is still a plain decimal                                                   | Right-click the field, Default Properties, Number Format, Percentage                       |
| Every bar is the same height                              | You dragged the raw 1/0 column instead of the calculated rate                            | Drag the wrong pill off the shelf and drop the right one on                                |
| Buckets are in alphabetical order                         | Tableau sorts text alphabetically until told otherwise                                   | Right-click the pill, Sort, by Field, your order column, Minimum                           |
| One giant dot instead of several                          | Nothing is splitting the marks apart                                                     | Drag the segment field onto Detail on the Marks card                                       |
| Numbers look far too large                                | Tableau is summing where you meant to average                                            | Click the pill, Measure, Average                                                           |
| You changed the source file and Tableau shows old numbers | The extract is cached                                                                    | Data menu, Refresh, or press F5                                                            |
| A deleted sheet still appears on the dashboard            | Dashboards keep their own layout objects                                                 | Click the leftover object on the dashboard and press Delete                                |

## Where things go, in everyday words

| Word                          | What it actually means                                                             |
|-------------------------------|------------------------------------------------------------------------------------|
| Data pane                     | The list of your columns down the left side                                        |
| Pill                          | A column after you have dragged it somewhere. It looks like a colored capsule.     |
| Columns and Rows shelves      | What goes here decides the _layout_ of the chart                                   |
| Marks card                    | Color, Size, Label, Detail, Tooltip. What goes here decides how each mark _looks_. |
| Dimension                     | A label you group by, usually text: segment, contract, region                      |
| Measure                       | A number Tableau does math on: charges, counts, your 1/0 column                    |
| Aggregation                   | The math applied inside each group: sum, average, count                            |
| Calculated field              | A column you invent with a formula, like a rate                                    |
| Worksheet / Dashboard / Story | One chart / several charts on a screen / several views in order with captions      |

**The one habit to keep.** If you take nothing else from this page, write the sentence a sheet is meant to say before you build the sheet. A chart you cannot summarise in one sentence is a chart nobody will read, and building it first is how you end up with a screen full of them.

One last thing, and I would genuinely like other people's answers. The hardest part of this for me is not the building, it is cutting the fourth chart I liked but could not justify. What is the chart you keep putting on dashboards that you suspect nobody is reading?

## References

  * Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. _Cognitive Psychology_ , 12(1), 97–136.
  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531–554.
  * Segel, E., & Heer, J. (2010). Narrative visualization: Telling stories with data. _IEEE Transactions on Visualization and Computer Graphics_ , 16(6), 1139–1148.

---

*The full version of this guide lives on my site: [How to Build a Tableau Dashboard and Story](https://michaelnocito.github.io/analyst-prep-kit/guides/build-a-tableau-dashboard/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
