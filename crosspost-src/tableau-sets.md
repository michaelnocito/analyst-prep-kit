By the end of this page you can look at any set and say exactly which rows are IN, which are OUT, and whether that will change tomorrow. You will know the difference between a fixed set and a dynamic one, why a set is not a filter and not a group, how to combine two sets, and the details that show up on the certification. It is about fifteen minutes.

Here is what to actually do with it. Next time you are about to filter to your top 25 customers, build a set instead and drop it on Columns. You get two bars, your top 25 and everyone else, side by side. That comparison is the thing a filter can never give you, because a filter throws the other half away.

The short version: a set does not remove rows. It labels every row IN or OUT, and keeps both.

One idea decides everything else here, so it gets the picture. It is the difference between removing rows and labelling them.

> _The original carries a diagram here. In words: The picture is in two halves, each starting from the same column of eight rows. In the upper half, labelled filter, three rows pass through and five are crossed out and discarded, leaving a single short result of three rows. In the lower half, labelled set, none of the rows are discarded. Instead all eight rows continue, sorted into two labelled stacks side by side, one marked IN holding three rows and one marked OUT holding five rows. A bracket beneath the two stacks shows that the total is still eight. The contrast shows that filtering reduces the data to one group, while a set keeps all the data and divides it into two comparable groups._

**This is on the certification.** Sets sit in Domain 2, Exploring and Analyzing Data, which is 37% of the exam and the largest domain on it. The [Tableau Desktop Foundations kit](https://michaelnocito.github.io/analyst-prep-kit/tableau-cert/) has practice questions on sets, and the ones people get wrong are almost always about reuse and about fixed against dynamic, both covered below.

## 1. What a set actually is

Before the explanation: you build a set of your top 25 customers. What happens to customer number 26?

Nothing happens to them. They are still in your data, and they are now labelled OUT. That is the whole idea, and it is the part that makes sets click.

A set is a field that asks one yes-or-no question of every row. Tableau's documentation puts the two answers plainly: IN means members belonging to the set, OUT means members that are not part of it. Every row gets one label or the other. Nothing is discarded.

Because a set is a field, you use it the way you use any other field. Drag it to Columns and you get two bars, IN and OUT. Drag it to Color and your marks split into two colors. Drop it on Filters and only then does it remove anything, which is worth noticing: filtering is something you can choose to do _with_ a set, not what a set _is_.

A set also lives in the Sets area of the Data pane, alongside your dimensions and measures. That location is doing real work. It means the set belongs to the data source, not to the sheet you happened to build it on, so you can use the same set on any worksheet in the workbook. Build it once, use it everywhere.

**The sentence to remember.** A set divides your data into IN and OUT, and it is a reusable field, not a one-sheet setting. Those two facts answer most set questions you will meet.

## 2. Fixed against dynamic, and why it matters tomorrow

Before the explanation: you build a top 25 customers set today. Next month, a new customer outsells everyone. Are they in your set?

It depends entirely on which of the two kinds you built, and this is the single most common thing people get wrong.

|                       | Dynamic set                                           | Fixed set                               |
|-----------------------|-------------------------------------------------------|-----------------------------------------|
| Built from            | A condition or a top rule, such as sales above 10,000 | Members you pick by hand from a list    |
| When the data changes | Membership updates itself                             | Membership stays exactly as you left it |
| Dimensions it can use | One only                                              | More than one                           |
| Good for              | A rule that should keep being true                    | A specific list that should not drift   |

Tableau's wording is exact on both. For a dynamic set, "the members of a dynamic set change when the underlying data changes." For a fixed set, "the members of a fixed set do not change, even if the underlying data changes."

So the new top-selling customer joins your set only if you built it dynamically. If you hand-picked 25 names, those 25 names are still your set, and the newcomer is OUT no matter how much they sell.

Neither is the right answer in general. A dynamic set is right when you mean a rule, like "our best customers." A fixed set is right when you mean a list, like "the accounts this team owns." Say out loud which of those two your set is, before you build it. That one sentence decides it.

The dimension limit is a genuine constraint and it catches people. A dynamic set can only be built from a single dimension, so "customers in the West who bought last quarter" is not a dynamic set. A fixed set can combine multiple dimensions, and a calculated field is the other way to express a rule that spans several.

## 3. Why a set is not a filter, and not a group

Before the explanation: sets, filters and groups all seem to gather rows together. If you had to give each one a different verb, what would they be?

Remove, label, and combine. That is the cleanest way to hold the three apart.

| Tool       | What it does to your rows                        | What you end up with                        |
|------------|--------------------------------------------------|---------------------------------------------|
| **Filter** |  Removes the ones you did not want               | One group. The rest are gone from the view. |
| **Set**    |  Labels every row IN or OUT                      | Two groups you can compare                  |
| **Group**  |  Combines several members into one bigger member | Fewer, larger categories                    |

A group is the one that is genuinely a different job. If you have twelve product categories and want four, you group them. Nobody is IN or OUT, and nothing is compared. The categories just get coarser.

Filters and sets are the pair that get confused, because they can produce the same picture. Filter to your top 25 and you see 25 bars. Put a set on Filters and keep only IN, and you see the same 25 bars. The difference only appears when you want the comparison: how much did the top 25 sell _against everyone else_. A filter cannot answer that, because the other half no longer exists. A set answers it by default, because the other half is sitting right there labelled OUT.

Say out loud why that comparison is impossible after a filter but easy with a set, before reading on. This is the hinge of the whole guide, and once it lands, sets stop feeling like a strange kind of filter and start feeling like the obvious tool.

## 4. Combining two sets

Before the explanation: you have a set of high-value customers and a set of customers who complained. What question would the overlap answer?

Your valuable unhappy customers, which is usually the most urgent list in the building. Tableau lets you build that directly by combining two sets, as long as both are built on the same dimension.

| Option                | What you get                                        |
|-----------------------|-----------------------------------------------------|
| All members           | Everyone in either set. The union.                  |
| Shared members        | Only those in both sets. The overlap.               |
| Except shared members | One set with the overlap taken out. The difference. |

The same-dimension requirement is the catch. Two sets of customers combine happily. A set of customers and a set of products do not, because there is no shared thing to compare membership on.

One more capability worth naming, because it is what makes sets feel alive on a dashboard. A **set action** lets the person reading the dashboard change what is IN the set by selecting marks. Tableau describes set actions as letting your audience "interact directly with a viz or dashboard to control aspects of their analysis." They click a region, and the set updates, and every view built on that set follows. That is how one set turns a static comparison into something a reader can steer.

## 5. Edge cases and the details people miss

Before the explanation: someone tells you a set can only be used on the worksheet where you created it. Are they right?

Six things worth knowing.

**A set is reusable across the whole workbook.** This is the answer to the prequestion, and it is the most commonly missed fact about sets. The set lives in the Data pane, so every worksheet on that data source can use it. Build it once.

**A set is always two-valued.** There is no third bucket and no partial membership. If you need three categories, you need a calculated field or a group, not a set.

**Putting a set on Filters is a choice, not the default.** People often build a set and then wonder why nothing was removed. Nothing was supposed to be. Drag it to Filters if removal is what you wanted.

**Dynamic sets recalculate against the current data, which includes your filters.** A top 10 set can therefore show different members depending on what else is filtered, which is usually what you want and occasionally a surprise.

**Fixed sets can quietly go stale.** A hand-picked list of 25 accounts is still 25 names a year later, even if six of them closed. That is not a bug, it is the promise you made. Put a date in the set's name if it represents a moment.

**Sets and groups look similar in the Data pane and behave nothing alike.** If you find yourself unable to get a comparison out of something, check which of the two you actually built.

## Why this works

The reason a set is more useful than it first looks is a point about comparison rather than about Tableau. A single number has no meaning without something to hold it against, and the most informative thing you can put beside a group is the group it was taken from. Filtering destroys exactly that comparison, which is why the same 25 bars can be either a finding or a fragment depending on whether the other half still exists.

The product behaviour on this page comes from Tableau's own documentation, which is the authority on it. Create sets (Tableau Help, current version) is the source for the IN and OUT definitions, for the statements that dynamic set membership changes with the data while fixed set membership does not, for the single-dimension limit on dynamic sets, and for the three combining options. Where a secondary write-up disagrees with that page, the page wins.

There is a second reason this guide keeps asking you to answer before it explains. Being asked a question before you are given the answer improves memory for that specific point, even when your guess is wrong, and the effect holds across a large body of studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Sets reward that, because almost every mistake with them is a wrong expectation rather than a wrong click.

## Using this on your own workbook

Think of a dashboard where you filtered to a top group. Would the person reading it have asked "compared to what?" If so, that filter wanted to be a set.

Rebuilding everything at once is grim work and you will stop halfway. Do this instead, in order.

  1. **Say whether you mean a rule or a list** before you build. A rule is dynamic. A list is fixed. This is the whole decision.
  2. **Build the set, then put it on Columns first** , not on Filters. Look at the two bars. That is what you actually bought.
  3. **Name it so the kind is obvious.** "Top 25 by sales, live" and "Key accounts, picked Jan 2026" tell the next person which one drifts.
  4. **Only move it to Filters** once you have decided you genuinely do not need the other half.
  5. **Check a fixed set every quarter.** It will not tell you it has gone stale, because staying still is what you asked it to do.

If you have paper nearby and five spare minutes, there is one drawing worth doing, and it is optional. Draw eight rows, then draw the filter version and the set version side by side, and write the row count under each. Seeing three against eight in your own handwriting is the fastest way to stop mixing the two up.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept               | What it does                                                                 |
|-----------------------|------------------------------------------------------------------------------|
| Set                   | Divides data into IN and OUT. Keeps both halves.                             |
| IN                    | Members belonging to the set.                                                |
| OUT                   | Members not part of the set. Still present, still usable.                    |
| Where it lives        | The Sets area of the Data pane. Reusable on every worksheet in the workbook. |
| Dynamic set           | Built from a condition. Membership changes as the data changes.              |
| Fixed set             | Members picked by hand. Membership never changes on its own.                 |
| Dimension limit       | Dynamic uses one dimension. Fixed can use more than one.                     |
| Set against filter    | A filter removes rows. A set labels them, so you can compare.                |
| Set against group     | A group combines members into bigger categories. No IN or OUT.               |
| Set on Filters        | Optional. That is when a set finally removes anything.                       |
| All members           | Combining two sets as a union.                                               |
| Shared members        | Combining two sets as an overlap.                                            |
| Except shared         | One set with the overlap removed.                                            |
| Combining requirement | Both sets must be built on the same dimension.                               |
| Set action            | Lets a dashboard reader change set membership by selecting marks.            |

**The one habit to keep.** If you take nothing else from this page, put a new set on Columns before you put it on Filters. Seeing the IN bar next to the OUT bar is the entire reason sets exist, and it takes one drag to check that you built the thing you meant.

One last thought, and I would genuinely like other people's answers. What made sets click for me was realising the OUT half is not leftovers, it is the comparison, and that a filter had been quietly throwing it away for years. What was the moment sets stopped being confusing for you?

## References

  * Tableau. Create sets. _Tableau Desktop and Web Authoring Help_ , current version. help.tableau.com. The authority for the product behaviour described here.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [Tableau Sets: What IN and OUT Actually Mean](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sets/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
