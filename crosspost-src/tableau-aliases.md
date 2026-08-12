By the end of this page you can turn a chart that says E, W, N and S into one that says East, West, North and South, in about thirty seconds, without editing the data or writing a calculation. You'll also know exactly why the Aliases option is missing on some fields, which is the part that sends people looking for a workaround they don't need. It's about ten minutes.

Here's the move. Right-click a dimension in the Data pane, choose Aliases, and type the name you want beside each value. The chart updates, the stored data doesn't change, and every view built on that field picks up the new labels.

The short version: an alias renames the members of a discrete dimension. Only discrete dimensions have members, which is why measures, dates and continuous dimensions can't have one.

An alias sits in a specific place, between what's stored and what's shown, and that placement explains everything else here. So it gets the picture.

> _The original carries a diagram here. In words: Three stacked panels connected left to right. The left panel is labeled stored and holds four small cells reading E, W, N and S. The middle panel is a narrow vertical band labeled alias, holding four arrows. The right panel is labeled shown and holds four cells reading East, West, North and South. A solid arrow runs from the stored panel through the alias band to the shown panel, indicating the direction labels travel. A second arrow attempting to run backwards from the shown panel to the stored panel is crossed through with a heavy X, showing that renaming the label never changes the stored value. The stored cells still read E, W, N and S after the change._

**This is on the certification.** Aliases sit in Section 2, Exploring and Analyzing Data, which is 37% of the Tableau Desktop Foundations exam and the largest section on it. The questions people get wrong are almost always about which field types accept an alias, which is section 2 below.

## 1. What an alias actually is

Before the explanation: you alias the value "E" to "East". What does a filter on that field now show, and what does the underlying data hold?

The filter shows East. The data still holds E. Both are true at the same time, and that's the whole idea.

Tableau's own description is that aliases are "alternate names for members in a dimension so that their labels appear differently in the view." Two words in that sentence are doing the work.

**Members.** A member is one of the distinct values a dimension takes. Region has the members E, W, N and S. Aliases rename members, one at a time.

**Appear.** The change is to how the value appears. Nothing is written back to the data source, no calculated field is created, and no row is modified.

Where the alias shows up is broader than most people expect. Axis and row headers, the legend, filter cards, tooltips and labels all use it, because they're all displaying the member. So one edit fixes the codes everywhere in the workbook at once rather than in one chart.

**The sentence to remember.** An alias renames a member, and only discrete dimensions have members. That one line answers nearly every question people have about aliases, including the ones in the next section.

## 2. Why measures can't have one

Before the answer: you right-click Sales, a measure, looking for Aliases. It isn't there. Is that a bug, a permissions problem, or intended?

Intended, and the reason is worth understanding because it stops you hunting for a workaround. Tableau's documentation is exact: "Aliases can be created for the members of discrete dimensions only. They can't be created for continuous dimensions, dates, or measures."

Say out loud why a measure couldn't sensibly have an alias, before reading on. This is the hinge of the guide.

Here's the reason. A measure doesn't have members, it has values, and its values are unbounded. Sales might hold 4,182 distinct numbers today and 4,200 tomorrow. There's no fixed list to attach names to. More importantly, renaming the number 4,182 to something else would be changing what the number is, not what it's called. Tableau's own wording says it does not permit re-aliasing measures "because it involves modifying data values themselves."

The same logic covers the other two exclusions. A date and a continuous dimension both hold values on a scale rather than a fixed list of members, so there's nothing to name.

| Field type           | Alias? | Because                                                       |
|----------------------|--------|---------------------------------------------------------------|
| Discrete dimension   | Yes    | It has a fixed list of members, and a name can attach to each |
| Continuous dimension | No     | Values on a scale, not members                                |
| Date                 | No     | Same reason. Use date formatting instead.                     |
| Measure              | No     | Renaming a value would change the data, not the label         |

So what do you do when you genuinely need a measure to read differently? Two answers, depending on what you meant. If you want the number displayed differently, that's number formatting, which changes appearance and leaves the value alone. If you want the numbers sorted into named ranges, such as Low, Medium and High, that's a bin or a calculated field, because you're creating members that didn't exist.

## 3. An alias against renaming the field

Before the distinction: your chart shows a column headed "cust_seg" containing "A", "B" and "C". Which of those four things does an alias fix?

The A, B and C. Not the heading. Both operations get called renaming in conversation, and they're different edits on different objects.

|                  | Rename the field                              | Alias                                                |
|------------------|-----------------------------------------------|------------------------------------------------------|
| Changes          | The field's name, which is the column heading | The names of the values inside the field             |
| How many things  | One                                           | One per member                                       |
| Where you do it  | Right-click the field, Rename                 | Right-click the field, Aliases                       |
| Fixes            | cust_seg becoming Customer Segment            | A, B and C becoming Enterprise, Mid-Market and Small |
| Touches the data | No                                            | No                                                   |

Most exported or system-generated data needs both. The field is named for a database column and the values are stored as short codes, so you rename the field once and alias its members once, and the chart stops needing a translator.

Picture the last chart you built from an export. How many codes on it would a reader outside your team have had to ask about? Each one is an alias you haven't set yet.

## 4. Setting them, and putting them back

Before the steps: you alias four members and then decide the original codes were better. How much work is undoing it?

One click. Tableau keeps the originals, so nothing you do here is one-way.

To set them:

  1. In the Data pane, right-click a dimension and select Aliases.
  2. In the Edit Aliases dialog, under Value (Alias), select a member and type the new name.
  3. In Tableau Desktop, click OK. On Tableau Server or Tableau Cloud, click the X in the top-right corner of the dialog.

To undo them, open the same dialog and click Clear Aliases. Tableau's description of what that does: "To reset the member names back to their original names, click Clear Aliases." All of them, at once, back to the stored values.

There's a second route worth knowing for one-off edits. Double-click a header in the view itself and type. That edits a single member's alias without opening the dialog, which is faster when you're fixing one label and slower when you're fixing eight.

## 5. Details people miss

Before the list: the Aliases option is greyed out on a discrete dimension, which section 2 says should work. What's going on?

You're almost certainly on a published data source. Tableau states the limit plainly: "When using a published data source, you can't create or edit aliases. You can only change aliases on fields that you create in your workbook." So the fix is to create a field in your own workbook, or ask whoever owns the published source to set the alias there, where it will benefit everyone using it.

Five more.

**An alias is not a filter and not a group.** Aliasing two members to the same name makes them look identical on screen while remaining two separate members underneath. They will not add together. If you want them combined, that's a group.

**Aliases live with the data source, so they travel.** Every worksheet in the workbook using that field gets them. This is the same arrangement as [sets](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sets/) and [hierarchies](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-hierarchies/), and it's the reason all three are edited from the Data pane rather than from a sheet.

**Sorting still uses the underlying value in some places.** Renaming E to East does not by itself reorder anything, and an alphabetic sort may not land where the new names suggest. Set the order you want explicitly with a [manual or computed sort](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sorts/) rather than assuming the labels drive it.

**A calculation still refers to the original value.** If you write a calculated field testing `[Region] = "East"` and the stored value is "E", it returns false. The alias never reached the calculation, because the alias is a display layer.

**Aliases do not fix bad data.** If a field holds "E", "East" and "east" as three separate members, aliasing all three to East makes them look like one thing while remaining three. That's an [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/) problem, and it needs cleaning rather than labeling.

## Why this works

The gain from an alias is not tidiness, it's that the reader stops doing translation work while reading. A chart labeled E, W, N and S with a key elsewhere forces a reader to hold the key in memory, look at a bar, recall which letter it maps to, and only then read the value. That splitting of attention between two places has a measurable cost. Chandler and Sweller showed that instructional material requiring learners to integrate two separate sources of information produced worse understanding than the same content presented as one integrated source (Chandler & Sweller, 1992, _British Journal of Educational Psychology_ , 62(2), 233–246). An alias removes the second source entirely by putting the meaning on the mark.

The design principle underneath is one you'll meet in every tool, not just this one: display and storage are separate layers, and the one you should change is the display. Excel has the same rule with [custom number formats](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-custom-number-formats/), where typing "21.2x" into a cell destroys a number while formatting it as `0.0"x"` leaves the number intact. Tableau's aliases are that idea applied to labels rather than to numbers, and the failure mode is identical: anything you fix by editing the source data is a fix you have to make again on the next refresh.

The product behavior on this page comes from Tableau's own documentation, which is the authority on it. Create aliases to rename members in the view (Tableau Help, current version) is the source for the definition of an alias, the statement that they can be created for the members of discrete dimensions only and not for continuous dimensions, dates or measures, the reason measures are excluded, the Edit Aliases steps, the Clear Aliases behavior, and the published data source limit. Where a secondary write-up disagrees with that page, the page wins.

## Using this on your own workbook

Open your most-shared dashboard and read only the labels. How many of them would a new starter have to ask about?

Aliasing an entire workbook in one sitting is dull work and you'll stop partway. Do it by chart instead, in this order.

  1. **Read your dashboard as a stranger.** Any label that's a code, an abbreviation or a system value is a candidate. If you had to learn what it meant, so will they.
  2. **Check the field is a discrete dimension first.** If Aliases is missing, that tells you the field type before you go looking for a bug.
  3. **Rename the field and alias the members in the same visit.** They're two different edits and they fix two halves of the same confusion.
  4. **Write the names your audience uses, not the ones your database uses.** The whole value is in the reader's vocabulary, not in a tidier version of yours.
  5. **Search your calculated fields for the old codes.** Calculations still refer to the stored value, so aliasing does not break them, but writing new ones against the alias will.
  6. **Check the sort afterwards.** New labels can make an existing sort look arbitrary even though nothing about it changed.

If you have paper nearby and five spare minutes, there's one sketch worth doing and it's optional. Draw two columns, stored on the left and shown on the right, and fill in every code on your current dashboard. The rows where the left and right sides are identical are the ones your reader is decoding for you.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                 | What it does                                                                       |
|-------------------------|------------------------------------------------------------------------------------|
| Alias                   | An alternate name for a member of a dimension, so its label appears differently    |
| Member                  | One of the distinct values a dimension takes. E, W, N and S are members of Region. |
| Discrete dimension      | Can have aliases                                                                   |
| Continuous dimension    | Cannot                                                                             |
| Date                    | Cannot. Use date formatting.                                                       |
| Measure                 | Cannot. Renaming a value would change the data.                                    |
| Where to set one        | Right-click the dimension in the Data pane, Aliases                                |
| Quick single edit       | Double-click the header in the view and type                                       |
| Undo them all           | Clear Aliases, in the same dialog                                                  |
| Does it change the data | No. Display only, one direction.                                                   |
| Alias against rename    | Rename changes the field's name. An alias changes the names of its members.        |
| Published data source   | You cannot create or edit aliases. Only on fields you create in your workbook.     |
| Two members, same alias | They look identical and stay separate. They will not add together.                 |
| Calculated fields       | Still refer to the stored value, not the alias                                     |
| Scope                   | The data source, so every worksheet in the workbook gets them                      |

**The one habit to keep.** When a menu option you expected is missing in Tableau, read it as a statement about the field type before you read it as a fault. Aliases missing means the field isn't a discrete dimension, and that one reflex saves more time than any keyboard shortcut on this page.

One last thought, and I'd like other people's answers. What made aliases click for me was the members line: measures don't have members, so there's nothing there to name, and the greyed-out menu suddenly stopped looking like a bug. What's the Tableau menu item you assumed was broken before you found out it was telling you something?

## References

  * Tableau. Create aliases to rename members in the view. _Tableau Desktop and Web Authoring Help_ , current version. help.tableau.com. The authority for the product behavior described here.
  * Chandler, P., & Sweller, J. (1992). The split-attention effect as a factor in the design of instruction. _British Journal of Educational Psychology_ , 62(2), 233–246.

---

*The full version of this guide lives on my site: [Tableau Aliases: Rename What Readers See Without Touching the Data](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-aliases/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
