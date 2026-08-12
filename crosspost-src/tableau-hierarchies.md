By the end of this page you can build a hierarchy in one drag, put it in the right order first time, and say exactly how it differs from a group, a set and a bin. Those four get confused constantly, and one sentence tells them apart for good. It's about twelve minutes.

Here's the thing to do today. In the Data pane, drag Sub-Category and drop it directly on top of Category. Tableau asks for a name, and from that moment every view built on Category carries a small plus icon. Click it and the chart expands into sub-categories, in place, without you building a second sheet.

The short version: a hierarchy organizes fields into levels. A group, a set and a bin organize the values inside one field. That's the whole distinction.

What a level actually costs you is the part people are surprised by, so it gets the picture.

> _The original carries a diagram here. In words: Three tiers stacked vertically and widening as they descend. The top tier shows three wide boxes labeled Category. The middle tier shows nine narrower boxes labeled Sub-Category, with lines fanning out from each box above to three below it. The bottom tier shows a long row of many very thin boxes labeled Product, again fanning out from each box above. A plus symbol sits at the left of the top tier and a minus symbol at the left of the bottom tier, marking the drill controls that move between them. The widening shape shows that every step down the hierarchy multiplies the number of marks in the view, so the bottom level holds far more rows than the top._

**This is on the certification.** Hierarchies sit in Section 2, Exploring and Analyzing Data, which is 37% of the Tableau Desktop Foundations exam and the largest section on it. The [certification kit](https://michaelnocito.github.io/analyst-prep-kit/tableau-cert/) drills them alongside groups, sets and bins, which is where the wrong answers usually come from.

## 1. What a hierarchy actually is

Before the explanation: you build a hierarchy from Category and Sub-Category. What happens to the two original fields?

Nothing. They're both still there, still usable on their own, now sitting inside a named hierarchy in the Data pane. A hierarchy doesn't consume the fields it's made of.

That's the first thing to hold onto. A hierarchy is an arrangement of existing fields into levels, ordered from broad at the top to specific at the bottom. It creates no new field and changes no data. It records a relationship you already knew about: every sub-category belongs to exactly one category.

What you get in exchange is a control. Once a hierarchy field is in a view, Tableau puts a small plus or minus icon on the pill, and clicking it adds or removes a level of detail in place. The chart you already built becomes a chart the reader can open up.

That is a bigger deal than it sounds, because the alternative is building a second sheet. Without a hierarchy, "sales by category" and "sales by sub-category" are two views someone has to navigate between. With one, they're the same view at two depths.

**The sentence to remember.** A hierarchy organizes fields into levels and hands the reader a drill control. It does not change the fields, and it does not change the data.

## 2. Building one, and getting the order right

Before the steps: you drop Category onto Product instead of the other way round. What does the reader get?

A drill that starts specific and gets vaguer, which reads as broken even though nothing errored. Order is the only decision in building a hierarchy, and it's the one people get wrong.

Building it, per Tableau's documentation:

  1. In the Data pane, drag a field and drop it directly on top of another field.
  2. Tableau asks you to name the hierarchy. Give it a name a reader would recognize.
  3. Drag additional fields into the hierarchy as needed, to add more levels.
  4. Re-order fields in the hierarchy by dragging them to a new position.

If the field you want lives inside a folder, the drag is awkward, so use the other route: right-click the field and select Create Hierarchy.

Now the order rule, and it's one line. **Coarse at the top, fine at the bottom.** Each level down must be contained by the level above it.

Say out loud why containment is the test, before reading on. It's because drilling means "show me what this is made of". Category contains sub-categories, so opening a category to reveal its sub-categories makes sense. Product does not contain categories, so the reverse drill has nothing sensible to reveal, and Tableau will still let you build it.

| Hierarchy | Order                                  | Works because                                      |
|-----------|----------------------------------------|----------------------------------------------------|
| Product   | Category → Sub-Category → Product Name | Each level is contained by the one above           |
| Location  | Country → State → City → Postcode      | Same containment, and the one everyone recognizes  |
| Date      | Year → Quarter → Month → Day           | Tableau builds this one for you on any date field  |
| Org       | Region → Manager → Rep                 | Contained, as long as a rep reports to one manager |

That last row carries the caveat worth knowing. Containment has to be true in your data, not just in the org chart. If a rep is shared across two managers, drilling will show their sales under both, and the levels will not add up to the total. Check before you build.

## 3. Hierarchy against group, set and bin

Before the table: hierarchies, groups, sets and bins all sound like ways of organizing data. What single question separates them?

Whether they work on fields or on the values inside one field. A hierarchy is the only one of the four that arranges several fields. The other three reshape the values inside a single field, and they do it in three different ways.

| Tool          | Works on              | What it does                                     | What you get                                           |
|---------------|-----------------------|--------------------------------------------------|--------------------------------------------------------|
| **Hierarchy** |  Several fields       | Orders them into levels                          | A drill control. Nothing changes until someone clicks. |
| **Group**     |  One field's members  | Combines several members into one bigger member  | Fewer, coarser categories                              |
| **Set**       |  One field's members  | Labels every member IN or OUT                    | Two groups you can compare                             |
| **Bin**       |  One measure's values | Cuts a continuous range into equal-width buckets | A dimension you can count, like a histogram            |

Two of those pairs get confused more than the others, so here are both in a sentence.

**Hierarchy against group.** They feel similar because both make things coarser. A group makes Sub-Category coarser by merging its members. A hierarchy leaves Sub-Category alone and lets a reader step up to Category, which was already a separate field. If the coarser level already exists as a field, you want a hierarchy. If it doesn't exist and you have to invent it, you want a group.

**Set against group.** A group combines members into bigger members and everything stays in the view. A [set](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sets/) splits members into IN and OUT so you can compare the two halves. Different jobs entirely, which the sets guide goes through properly.

Picture your own data pane for a moment. How many of your dimensions are really levels of one thing that nobody has connected yet? Region and Country. Manager and Rep. Those pairs are hierarchies waiting to be dragged together.

## 4. What the plus and minus controls do

Before the explanation: you click the plus icon on a hierarchy pill. Does the view replace the current level or add to it?

It adds. Tableau's wording is that you can "drill up or down in the hierarchy to add or subtract more levels of detail", and the key word is add. Category stays on the shelf and Sub-Category joins it, so you get sub-categories nested inside their categories rather than a flat list of sub-categories.

That distinction is worth a moment. Drilling down gives you both levels, with the parent still grouping the children. If you wanted only sub-categories, you don't drill, you swap the field.

Two practical consequences follow from the picture at the top of this page.

**Marks multiply, they don't shift.** Three categories drilling into nine sub-categories is three times the marks. Drilling again into thirty-nine products is thirteen times the original. That's fine on a bar chart and painful on a map or a scatter plot, so check what the chart does at the bottom level before you ship the drill.

**Build the view at the level you want people to land on.** The default state is whatever you saved, and most readers never click anything. So save it at the top level, and let the drill be for the people who want more.

## 5. Details people miss

Before the list: someone says removing a hierarchy will delete the fields inside it. Are they right?

No, and this is the fact that stops people experimenting. Right-click the hierarchy and select Remove Hierarchy. Tableau's own description: "The fields in the hierarchy are removed from the hierarchy and the hierarchy disappears from the Data pane." The fields go back to being ordinary fields. Nothing is lost, so a hierarchy is safe to try.

Five more worth knowing.

**Date fields get a hierarchy automatically.** Year, quarter, month, day. You don't build it, and the plus and minus on a date pill are doing exactly what they do on one you made yourself.

**A hierarchy belongs to the data source, not the sheet.** Build it once and every worksheet on that data source can use it. This is the same arrangement as sets, and it's the reason both live in the Data pane.

**You can drill into one member instead of all of them.** Clicking the plus on the pill opens every category. Clicking the plus on a single header opens just that one, which is usually what a reader actually wanted.

**Levels can be reordered after the fact.** Drag a field to a new position inside the hierarchy. You do not have to remove it and start again, which is what most people do the first time.

**A hierarchy does not enforce anything.** It records a containment you believe is true. If your data has a sub-category appearing under two categories, Tableau will show it under both without complaint, and your levels will not sum to the total. That's a data problem the hierarchy will faithfully display rather than catch.

## Why this works

Drilling isn't a Tableau invention, it's a general answer to a problem every large dataset has: the view that shows everything shows nothing. Shneiderman set out the pattern that most interactive tools still follow, summarized as overview first, zoom and filter, then details on demand (Shneiderman, 1996, _Proceedings of the 1996 IEEE Symposium on Visual Languages_ , 336–343). A hierarchy is that pattern made into one control. The overview is the top level, and the detail arrives only when someone asks for it.

The reason this beats building two sheets is about where the effort sits. Two sheets ask the reader to notice that a second view exists, find it, and hold the first one in memory while looking at it. One view with a drill asks them to click a plus. The information is the same and the work of connecting the two levels has moved from the reader to the tool.

The product behavior on this page comes from Tableau's own documentation, which is the authority on it. Create hierarchies (Tableau Help, current version) is the source for the drag-and-drop creation step, the ability to add and re-order fields, the plus and minus drill controls, the Create Hierarchy route for fields inside folders, and the statement about what Remove Hierarchy does to the fields. Where a secondary write-up disagrees with that page, the page wins.

## Using this on your own workbook

Open your Data pane and read the dimension list. How many pairs are levels of the same thing, sitting next to each other unconnected?

Doing this to a whole workbook at once is dull and you'll stop. Take one, in this order.

  1. **Find a pair where one contains the other.** Region and country. Category and sub-category. Manager and rep. If neither contains the other, it isn't a hierarchy.
  2. **Check the containment in the data, not the org chart.** Count the distinct parents per child. More than one means drilling will double-count, and you have a data question before you have a hierarchy.
  3. **Drag the finer field onto the coarser one.** Fine onto coarse. Getting this backwards is the whole failure mode.
  4. **Name it for a reader, not for you.** "Product hierarchy" is fine. The name shows up in the Data pane and other people will read it.
  5. **Save the view at the top level.** Most readers never drill, so the state you save is the state almost everyone sees.
  6. **Click down to the bottom level once, and look.** If the chart is unreadable at full depth, either the chart type is wrong or that level does not belong in the hierarchy.

If you have paper nearby and five spare minutes, there's one drawing worth doing and it's optional. Write your three levels as three rows, then write the number of distinct values in each row next to it. Seeing 3, 9 and 39 in your own handwriting is what makes the bottom-level chart problem obvious before you build it.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                 | What it does                                                                  |
|-------------------------|-------------------------------------------------------------------------------|
| Hierarchy               | Orders several fields into levels and hands the reader a drill control        |
| How to build one        | Drag a field and drop it directly on top of another field in the Data pane    |
| Field inside a folder   | Right-click the field and select Create Hierarchy                             |
| Adding levels           | Drag more fields into the hierarchy                                           |
| Reordering levels       | Drag a field to a new position inside the hierarchy                           |
| Order rule              | Coarse at the top, fine at the bottom. Each level contained by the one above. |
| Plus and minus icons    | Drill up or down, adding or subtracting a level of detail                     |
| Drilling adds           | The parent level stays on the shelf. You get both, nested.                    |
| Removing a hierarchy    | Right-click, Remove Hierarchy. The fields survive as ordinary fields.         |
| Where it lives          | The Data pane, so it belongs to the data source and works on every sheet      |
| Date fields             | Get year, quarter, month and day automatically. No build needed.              |
| Hierarchy against group | Hierarchy arranges fields. A group merges members inside one field.           |
| Hierarchy against set   | A set labels members IN or OUT of one field. No levels involved.              |
| Hierarchy against bin   | A bin cuts a continuous measure into equal-width buckets                      |
| What it does not do     | Enforce containment. Bad data drills into double counting silently.           |

**The one habit to keep.** Before you build a hierarchy, count the distinct parents for each child. One parent means it's a hierarchy. More than one means drilling will double-count, and you've found a data problem worth more than the drill control was.

One last thought, and I'd like other people's answers. What made these click for me was the fields-against-values line: a hierarchy is the only one of the four that touches more than one field, and once that landed I stopped mixing it up with groups. What's the pair of Tableau features you had to keep looking up before something finally separated them?

## References

  * Tableau. Create hierarchies. _Tableau Desktop and Web Authoring Help_ , current version. help.tableau.com. The authority for the product behavior described here.
  * Shneiderman, B. (1996). The eyes have it: A task by data type taxonomy for information visualizations. _Proceedings of the 1996 IEEE Symposium on Visual Languages_ , 336–343.

---

*Originally published on Analyst Prep Kit: [Tableau Hierarchies: One Drag Puts a Drill-Down on Every Chart](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-hierarchies/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
