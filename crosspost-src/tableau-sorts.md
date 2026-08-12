By the end of this page you can sort any Tableau view four different ways, and say for each one whether it will still be correct after the data refreshes. That second part is the one that catches people, because a sort that's gone stale looks exactly like a sort that's working. It's about twelve minutes.

Here's the move to make today. Open a bar chart you've built and ask which of these you did: told Tableau a rule, or dragged the bars where you wanted them. If you dragged, that order is frozen, and a new top performer next quarter will appear wherever you left a gap rather than at the top.

The short version: three of Tableau's four sort options are rules that re-evaluate as data changes. One is an arrangement you fixed by hand.

What that difference does when new data arrives is the whole point, so it gets the picture.

> _The original carries a diagram here. In words: Two small bar charts side by side, each showing the same four existing bars plus one new longer bar arriving. On the left, headed rule, the bars are ordered longest to shortest and the new long bar has slotted into first position at the top, keeping the descending order intact. On the right, headed frozen, the four original bars remain in the exact positions they were dragged to, and the new long bar has been appended at the bottom, below three bars that are shorter than it. The right-hand chart is therefore no longer in size order, even though nothing about it was changed. The contrast shows that a computed sort absorbs new data correctly while a manual sort keeps the arrangement it was given._

**This is on the certification.** Sorting is objective 2.3.1 on the Tableau Desktop Foundations exam, inside Section 2, which is 37% of the paper and the largest section on it. The distinction the objective is testing is the computed against manual one in section 2 below.

## 1. The four ways to sort, and where each one lives

Before the list: you want your bars biggest to smallest. How many different ways could Tableau give you that?

Several, and they're not equivalent, which is the reason to read a list of them at all. Open the sort dialog on a field and you get four options.

| Option                | What it does                                                               | Is it a rule?                           |
|-----------------------|----------------------------------------------------------------------------|-----------------------------------------|
| **Data source order** |  Sorts based on how the data is sorted in the data source                  | Yes, and the rule lives outside Tableau |
| **Alphabetic**        |  Sorts the data alphabetically                                             | Yes                                     |
| **Field**             |  Sorts by the values of a field you choose, with an aggregation you choose | Yes. This is the one you usually want.  |
| **Manual**            |  Lets you select a value and move it to the position you want              | No. It's an arrangement.                |

Two things about the Field option are worth pulling out, because they're what make it powerful and almost nobody uses them.

**The sorting field doesn't have to be in the view.** You can sort products by profit while showing sales. Nothing on screen says profit, and the order carries it.

**You choose the aggregation.** Sum, average, minimum, maximum and so on. Sorting regions by average order value gives a different order from sorting by total, and both are one dropdown away.

There's also a faster route for the common case. The toolbar has ascending and descending sort buttons, and you can sort straight from an axis, a header or a legend. Tableau's note about those quick sorts is the important part: "The sort updates if the underlying data changes."

To sort manually without the dialog, select a header in the view or on a legend and drag it. A heavy black line shows where it will land.

## 2. Computed against manual, and what happens next month

Before the answer: you drag your five regions into the order you want. Next quarter a sixth region is added to the data. Where does it appear?

Wherever Tableau puts it, which is not a position you chose, because you never gave a rule that covers it. That's the difference between the two kinds of sort, and it's what the exam objective is really about.

A **computed sort** is a rule. You've told Tableau how to decide the order, so it can decide again whenever the data changes. Data source order, alphabetic and field are all rules.

A **manual sort** is an arrangement. You've told Tableau the answer rather than the method, so there's nothing to re-run. New members have no place in it, and existing members keep their places even after the numbers behind them change.

Say out loud which of those two you'd want for a chart of your top ten customers, before reading on. This is the hinge of the guide.

The answer is a rule, almost always, because "top ten" is a rule and next month's top ten is a different ten people. The place a manual sort genuinely wins is when the order carries meaning that isn't in the data. Small, Medium and Large is the standard example: alphabetically that's Large, Medium, Small, which is wrong in a way no rule in your dataset can fix.

|                    | Computed sort               | Manual sort                       |
|--------------------|-----------------------------|-----------------------------------|
| You give Tableau   | A method                    | An answer                         |
| New data arrives   | Re-evaluates                | Keeps the arrangement             |
| New member appears | Placed by the rule          | Placed by nothing you chose       |
| Right for          | Anything ranked by a number | An order the data doesn't contain |
| Goes stale         | No                          | Yes, quietly                      |

If that shape feels familiar, it's the same one as dynamic and fixed [sets](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sets/). Tableau keeps offering you the choice between a rule and a list, in several different places, and the right question is always the same: did I mean a rule or did I mean these specific ones?

## 3. The alphabetic sort that puts Item 10 before Item 2

Before the explanation: you sort a list alphabetically and it reads Item 1, Item 10, Item 11, Item 2. Is that broken?

No, and Tableau documents exactly why. Its alphabetic sort "is case sensitive, sorts [A-Z] before [a-z], and treats digits individually."

Take that last clause literally. Treating digits individually means the sort compares character by character rather than reading "10" as ten. Comparing "Item 10" with "Item 2", it reaches the digit 1 against the digit 2, finds 1 is smaller, and stops. Item 10 wins, and it will keep winning however many rows you add.

The case rule bites the same way. Uppercase letters sort before lowercase ones, so a list holding "Zebra" and "apple" puts Zebra first. That looks like a bug in a list of product names entered by different people at different times, and it isn't. It's telling you the field has inconsistent capitalisation.

| Values                  | Alphabetic gives        | What it's telling you                       |
|-------------------------|-------------------------|---------------------------------------------|
| Item 1, Item 2, Item 10 | Item 1, Item 10, Item 2 | The number is stored inside text            |
| Zebra, apple            | Zebra, apple            | Capitalisation is inconsistent in the field |
| Q1, Q2, Q3, Q4          | Q1, Q2, Q3, Q4          | Nothing. Single digits sort correctly.      |

That last row is the trap inside the trap. Single-digit labels sort correctly, so this problem hides until your tenth item arrives, and by then the chart has been trusted for months.

Two fixes, depending on which problem you have. If the number should be a number, separate it into its own field and sort on that with the Field option. If the order genuinely isn't alphabetical, use a manual sort and accept that you'll maintain it.

## 4. Nested sorts, and what drilling does to them

Before the explanation: your view shows sub-categories inside categories. You sort by sales. Should the sub-categories be ranked within their own category, or across the whole view?

Both are legitimate, and Tableau treats them as two different sorts. The distinction is called nesting, and it matters as soon as you have a [hierarchy](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-hierarchies/) on the shelf.

A **nested sort** considers values independently per pane rather than in aggregate across panes. So each category ranks its own sub-categories, and the ranking restarts in the next category. A non-nested sort applies one consistent order across every pane, based on the aggregated values.

Which one you want depends on the question. "Which sub-category leads in each category" is nested. "Which sub-categories are the biggest overall" is not.

One behavior worth knowing before you build a drill-down: when you create a nested sort, the sort is inherited as you drill down through the dimensions. That's usually what you want, and it means a drill-down you set up once keeps ranking sensibly at every level rather than reverting to alphabetical.

Picture a category with three sub-categories and another with nine. Under a nested sort, both panes start their ranking at one. Under a non-nested sort, the nine-item category may take every top position and the three-item one may appear nowhere near the top. Same data, same chart type, two very different readings.

## 5. Details people miss

Before the list: you've sorted three fields in one view and want to start over. Do you have to undo them one at a time?

No. Tableau has both. To remove the sort on a specific field, right-click to open the menu and select Clear Sort. To remove every sort in the view, open the menu next to the clear sheet icon in the toolbar and select Clear Sorts.

Five more.

**The documentation and the exam use different words.** The Tableau help page presents Manual as one of four options in the Sort dialog, and does not set "computed sort" against "manual sort" as two named categories. The certification does use that pairing. Both describe the same behavior, so learn the behavior and the words in either vocabulary will make sense.

**An[alias](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-aliases/) does not change the sort.** Renaming the member E to East leaves the sort working on whatever it was working on before. If the order suddenly looks arbitrary after an aliasing pass, that's why.

**Sorting is not filtering.** A sort changes the order of everything. It never removes a row. If your chart is showing fewer bars than you expected, look at the filters, not the sort.

**Legends can be sorted too.** The order of items in a color legend is a sort like any other, and dragging a legend entry is a manual sort with all the same consequences.

**Sorting by a field not in the view is invisible to the reader.** That's a feature when the order is obvious and a problem when it isn't. If products are ordered by profit on a chart of sales, say so in the title or the caption, or the reader will assume the order matches the bars they can see.

## Why sorting is analysis, not decoration

An unsorted bar chart makes the reader do a search. To find the biggest bar in a list of twenty, they have to look at each one and hold a running maximum, which is a serial process that takes longer as the chart grows. Treisman and Gelade's work on visual attention established that finding a target defined by comparing across items requires this kind of item-by-item search, in contrast to features that are picked up immediately and in parallel across the whole display (Treisman & Gelade, 1980, _Cognitive Psychology_ , 12(1), 97–136). Sorting removes the search entirely, because the answer is now at a known end of the chart.

That's why sorting counts as analysis rather than polish. Ordering the bars is you doing the comparison once, on behalf of everyone who reads it, instead of every reader doing it separately and some of them getting it wrong. The same argument applies to [choosing a chart type](https://michaelnocito.github.io/analyst-prep-kit/guides/choose-the-right-chart/): both decisions move work off the reader and onto the person who had the data in front of them.

The second reason to care is the one this whole page is built around. A sort is a claim about order that keeps being made after you stop looking at it. A rule keeps making the claim correctly. An arrangement keeps making the claim you made in March, in November, without telling anyone it has stopped being true. Nothing on screen distinguishes the two, which is why the only reliable moment to decide is when you build it.

The product behavior on this page comes from Tableau's own documentation, which is the authority on it. Sort data in a visualization (Tableau Help, current version) is the source for the four sort options, the note that a quick sort updates if the underlying data changes, the alphabetic sort being case sensitive and treating digits individually, the manual drag behavior, the description of nested sorting and its inheritance when drilling, and both Clear Sort commands. Where a secondary write-up disagrees with that page, the page wins.

## Using this on your own workbook

Open the chart you refresh most often. Do you know, without checking, whether its order is a rule or an arrangement?

Auditing a whole workbook at once is dull and you'll stop. Take the charts that refresh, in this order.

  1. **Ask the one question first: rule or arrangement?** Everything else on this page follows from the answer, and it takes five seconds per chart.
  2. **Convert any ranking to a Field sort.** If the order is meant to reflect a number, it should be computed from that number, not dragged.
  3. **Keep manual sorts only for orders the data doesn't contain.** Small, Medium, Large. Stages of a process. Anything where the sequence is meaning rather than size.
  4. **Name the manual ones.** Put the order in the chart title or a caption, so the next person knows it was chosen rather than computed.
  5. **Check any alphabetic sort for double-digit values.** If the field will ever hold Item 10, the alphabetic sort is already wrong and nobody has noticed.
  6. **Say whether a hidden sort field is in play.** Sorting by profit on a chart of sales is fine, and silent about it is not.

If you have paper nearby and five spare minutes, there's one sketch worth doing and it's optional. Draw your chart's bars as they are today, then add one new bar longer than all of them and put it where your current sort would actually place it. If your pen went to the bottom of the page, you have a manual sort.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                   | What it does                                                       |
|---------------------------|--------------------------------------------------------------------|
| Computed sort             | A rule. Re-evaluates when the data changes.                        |
| Manual sort               | An arrangement you set by hand. Does not re-evaluate.              |
| Data source order         | Sorts by how the data is ordered in the source                     |
| Alphabetic                | Case sensitive, A-Z before a-z, digits treated individually        |
| Field                     | Sorts by a field's values, with an aggregation you pick            |
| Field sort, hidden field  | The sorting field does not have to be in the view                  |
| Manual, in the view       | Drag a header. A heavy black line shows where it lands.            |
| Quick sort                | Toolbar buttons, axes, headers and legends. Updates with the data. |
| Item 1, Item 10, Item 2   | Correct alphabetic behavior. The number is inside text.            |
| Zebra before apple        | Correct. Uppercase sorts before lowercase.                         |
| Nested sort               | Ranks values independently per pane, not across panes              |
| Nested sort and drilling  | The sort is inherited as you drill down through the dimensions     |
| Clear one sort            | Right-click the field, Clear Sort                                  |
| Clear every sort          | Menu beside the clear sheet icon in the toolbar, Clear Sorts       |
| Sorting against filtering | A sort reorders everything. It never removes a row.                |
| Aliases and sorting       | Renaming a member does not change the sort                         |

**The one habit to keep.** Every time you sort something, say which of the two you just did: gave a rule, or gave an answer. It takes a second, it's the whole content of exam objective 2.3.1, and it's the only thing standing between you and a chart that quietly stops being in order.

One last thought, and I'd like other people's answers. The one that got me was Item 10 before Item 2, because single digits sort correctly and the chart looks fine right up until the tenth row exists. What's the sort you trusted for months before finding out what it was actually ordering by?

## References

  * Tableau. Sort data in a visualization. _Tableau Desktop and Web Authoring Help_ , current version. help.tableau.com. The authority for the product behavior described here.
  * Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. _Cognitive Psychology_ , 12(1), 97–136.

---

*Originally published on Analyst Prep Kit: [Tableau Sorting: A Rule That Re-Runs, or an Order You Froze](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sorts/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
