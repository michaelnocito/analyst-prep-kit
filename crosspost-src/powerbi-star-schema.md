By the end of this page you can look at any table and say whether it belongs in the model as a fact or a dimension, build the relationships that make filtering work, and explain why the shape matters even on sixteen rows. The finding it unlocks on our data: lamps are the smallest product line by revenue, 1,600 of 9,890, and the most profitable at 45.0 percent margin against the desk's 36.4. The flat table cannot say that sentence.

Here is what to actually do today. Open your model view and count the arrows. If every table connects directly to one central table, and every arrow points inward toward it, you have a star. If tables chain off other tables, or two tables point at each other, that is where your slicers will misbehave.

The short version: put the things you count in one table, put the things you slice by in their own tables, and join each of those to the counting table. Filters then flow one way, from the describing tables into the counting table.

The shape is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Four rounded boxes arranged around a centre. One larger, solid, dark-filled box sits in the middle of the picture and is labelled Orders. Three smaller, lighter boxes sit around it: one at the upper left labelled Date, one at the upper right labelled Products, and one directly below the centre labelled Reps. A line runs from each of the three outer boxes to the central box. Every one of those three lines carries a single arrowhead, and in all three cases the arrowhead is at the end that touches the central box, so all three arrows point inward toward the centre and none points outward. Beside each line, at the end nearest the outer box, sits a small numeral one, and at the end nearest the central box sits a small asterisk, marking one row on the outer side against many rows on the inner side. The overall arrangement reads as three points radiating from a single hub._

**Every number on this page is real.** Sixteen orders and a three-row product table, the same fixture used across these guides. The modelling rules quoted here come from Microsoft's own star schema guidance rather than from habit, and are quoted directly in the "why this works" section. [CALCULATE and filter context](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/) is the companion page: this one is about the shape, that one is about what runs on top of it.

## 1. Fact or dimension, and how the model decides

Before the definitions: you have an orders table and a products table. Say which one you would count and which one you would slice by, before reading on. You already know the answer; the words are what this section adds.

Microsoft's guidance splits every model table in two, and the split is by job.

**Dimension tables describe things.** Products, people, places, dates. They have a key column that uniquely identifies each row, plus columns you want to filter and group by. They are usually small. Ours has three rows.

**Fact tables record events.** Orders, transactions, readings, page views. They have key columns pointing at the dimensions, plus the numbers you add up. They are usually large and they keep growing. Ours has sixteen rows and would have sixteen thousand in a year.

Two sentences from the guidance are worth keeping, because they turn the distinction from a vibe into a rule: "Dimension tables enable filtering and grouping" and "Fact tables enable summarization."

Here is the part that surprises people. There is no setting anywhere in Power BI that declares a table to be one or the other. The guidance says so directly: "There's no table property that modelers set to set the table type as dimension or fact. It's in fact determined by the model relationships." Specifically the cardinality: "The 'one' side is always a dimension table while the 'many' side is always a fact table."

So the type is not a label you apply. It is a consequence of how you joined things, which means getting the relationships right _is_ getting the model right.

## 2. The flat table, and the question it cannot answer

Before the problem: here is the flat table, one row per order with everything on it. Look for what you would need to compute gross margin by product, and notice what is not there.

| OrderID                                                         | OrderDate  | Rep        | Region | Product | Units | UnitPrice | Revenue |
|-----------------------------------------------------------------|------------|------------|--------|---------|-------|-----------|---------|
| 1001                                                            | 2026-01-05 | Dana Reyes | North  | Desk    | 4     | 220       | 880     |
| 1002                                                            | 2026-01-12 | Owen Park  | South  | Chair   | 10    | 85        | 850     |
| 1003                                                            | 2026-01-19 | Priya Shah | East   | Desk    | 3     | 220       | 660     |
| … thirteen more rows, 9,890 in total revenue across 101 units … |

There is no cost anywhere. Revenue is on every row and cost is on none of them, so a margin measure has nothing to work with. That is not a flaw in this particular export; it is the normal state of a fact table. Costs belong to products, not to orders, and repeating a product's cost on every one of its order rows is exactly the duplication that a separate table exists to avoid.

Here is the answer once a products table is in the model, with a cost column.

| Product   | Units   | Revenue   | Cost of goods | Gross profit | Margin    |
|-----------|---------|-----------|---------------|--------------|-----------|
| Desk      | 23      | 5,060     | 3,220         | 1,840        | 36.4%     |
| Chair     | 38      | 3,230     | 1,976         | 1,254        | 38.8%     |
| Lamp      | 40      | 1,600     | 880           | 720          | 45.0%     |
| **Total** | **101** | **9,890** | **6,076**     | **3,814**    | **38.6%** |

Check a line by hand: 23 desks at a cost of 140 each is 3,220, and 5,060 minus 3,220 is 1,840. And now there is a claim instead of a list. **Lamps are last by revenue and first by margin.** A revenue ranking and a margin ranking put them at opposite ends, and the only thing standing between those two sentences is a second table and a relationship.

Say out loud what a flat table would have to do to answer this. It would have to carry the cost on all sixteen rows, repeated. Then a cost correction becomes sixteen edits instead of one, and a product that sold nothing this month disappears from the model entirely.

## 3. Splitting it: what goes where

Before the split: take the eight columns of the flat table and sort them into "describes something" and "is an event or a number". Do it before reading on.

Here is where they land.

| Table    | Type      | Rows         | Columns                                                     |
|----------|-----------|--------------|-------------------------------------------------------------|
| Orders   | Fact      | 16, growing  | OrderID, OrderDate, Rep, Product, Units, UnitPrice, Revenue |
| Products | Dimension | 3            | Product (key), Category, ListPrice, Cost                    |
| Reps     | Dimension | 4            | Rep (key), Region                                           |
| Date     | Dimension | 365 per year | Date (key), Year, Month, Month Sort, Quarter                |

Two decisions in that table are worth explaining because they are the ones people get wrong.

**Region moved to the Reps table.** In our data each rep works one region, so region describes the rep, not the order. Putting it on the fact table would repeat it sixteen times and make it possible for the same rep to appear in two regions on different rows, which is a data quality problem you have just invented. If reps could move between regions over time, that is a slowly changing dimension and it needs versioning, which is a different and harder problem.

**Revenue stayed on the fact table even though it is Units times UnitPrice.** It is a number you add up, so it is a fact. And it is deliberately stored rather than looked up, because the price on the day of the order is not necessarily today's list price. A fact table records what happened; a dimension records what is currently true.

The date dimension is the one nobody regrets. Even on five months of data it is what makes month-over-month, year-to-date and prior-period measures work at all, for reasons worked through in [DAX time intelligence](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-time-intelligence/).

## 4. Building the relationships, and the direction that matters

Before the settings: you join Products to Orders on the product name. Predict which way filters should travel, before reading on.

From Products into Orders, and only that way. Choosing "Products" in a slicer should cut down the orders. Choosing an order should not cut down the product list. Each relationship gets three settings, and the defaults are usually right.

| Setting                | Value       | Why                                                                                    |
|------------------------|-------------|----------------------------------------------------------------------------------------|
| Cardinality            | One to many | One row per product, many orders per product. This is what makes Products a dimension. |
| Cross-filter direction | Single      | Products filters Orders. Orders does not filter Products.                              |
| Active                 | Yes         | Only one relationship between two tables can be active. See section six.               |

The setting worth resisting is **Both** for the cross-filter direction. It looks harmless and it makes filters travel in both directions, which means a filter can leave a dimension, reach the fact table, and travel back up a different relationship into a second dimension. With three dimensions there are paths the engine has to resolve, and with more than a few there are ambiguous ones it will refuse. Turn it on only for a specific, tested reason.

Then, in the visuals, slice by the dimension's columns rather than the fact table's. Both work in our model because Product is on both tables, and they behave differently the moment a product exists with no orders. Slicing by `Products[Product]` shows it with a blank measure; slicing by `Orders[Product]` never mentions it. One of those is a report that can say "this line sold nothing", and the other is a report that quietly loses it.

My own tidying rule: once the relationships exist, hide the fact table's key columns from report view. Nobody should be choosing between `Orders[Product]` and `Products[Product]` at report-building time, and hiding one removes the choice.

## 5. Snowflake: when a dimension chains off another

Before the shape: our products have categories, Furniture and Lighting. You could store categories in their own table joined to Products. Say what that would buy and what it would cost.

That shape is a **snowflake** : a dimension normalized across several tables so the chain runs Category, Products, Orders instead of Products, Orders. Microsoft's guidance is direct about the trade: "Generally, the benefits of a single model table outweigh the benefits of multiple model tables", and it lists four specific costs.

  * More tables loaded, "which is less efficient from storage and performance perspectives".
  * "Longer relationship filter propagation chains need to be traversed", so filters take an extra hop.
  * More tables in the Data pane, "which can result in a less intuitive experience", especially when the extra table has one or two columns.
  * "It's not possible to create a hierarchy that comprises columns from more than one table", so a Category to Product drill-down cannot exist.

That last one is the practical killer. With Category on the Products table you can build a hierarchy and let users drill from Furniture down to Desk in one visual. With Category in its own table you cannot, at all.

So flatten it: put Category on the Products table as a column, which is exactly how our three-row table is built. The cost is repeating the word "Furniture" twice, which on a three-row table is nothing and on a three-thousand-row product table is still nothing.

The check, on our data: Furniture is 8,290 of revenue and Lighting is 1,600, and they add to 9,890. That grouping works because Category sits on the dimension the fact table is joined to, one hop away.

## 6. Two dates on one table: role-playing dimensions

Before the problem: orders have an order date and a ship date, and you want to analyse by either. Predict what happens if you join the date table to both columns.

Power BI creates both relationships and makes only one active. The guidance states the constraint plainly: "there can only be one active relationship between two Power BI semantic model tables. All remaining relationships must be set to inactive." A dimension used in several roles like this is called a **role-playing dimension**.

Two ways to handle it, and the second is the one Microsoft recommends.

**Activate the inactive relationship inside specific measures.** `USERELATIONSHIP` turns one on for the duration of one CALCULATE.
    
    
    Revenue by Ship Date =
    CALCULATE (
        [Total Revenue],
        USERELATIONSHIP ( 'Date'[Date], Orders[ShipDate] )
    )

It works and it does not scale. You need a duplicate of every measure per date role, the Data pane fills with near-identical names, and, as the guidance notes, you still "can't produce a visual that plots order date sales by shipped sales", because only one path can be active at a time.

**Build a second date table.** A Ship Date table, cloned from the first, each with its own active relationship. One line of DAX creates it: `Ship Date = 'Date'`. Then rename its columns to be self-describing, Ship Year rather than Year, so a chart title reads correctly without editing. The cost is a duplicated dimension table, and since dimension tables are small, that is rarely a concern.

## 7. The exceptions Microsoft actually recommends

Before the exceptions: the rule so far is "never mix facts and dimensions in one table". Guess whether there is a documented exception, before reading on.

There is exactly one common one, and knowing it stops you from over-normalizing.

**Degenerate dimensions.** An order number is an attribute you want to filter by, and building a one-column table just to hold it would add a table and clutter the Data pane for no benefit. The guidance calls this "an exception to the formerly introduced rule that you shouldn't mix table types" and says to leave it on the fact table. Our OrderID is exactly this.

Three more shapes worth recognizing when you meet them, all documented, none needed on our sixteen rows:

**Surrogate keys.** When a dimension has no single unique column, add one. In Power Query that is an index column, merged into the fact query so both sides carry it.

**Junk dimensions.** Several tiny attributes with few values each, like order status and delivery status, consolidated into one dimension table rather than several, to reduce clutter and model size.

**Factless fact tables.** A table of only dimension keys, recording that something happened, or bridging two dimensions in a many-to-many relationship. If a salesperson can belong to several regions, that bridging table is the recommended way to model it.

Now picture your own model's table list. Which tables are there because something genuinely has its own grain, and which are there because a source system happened to export them separately?

## The full before and after

Same requirement both times: revenue and margin by product and by month, with slicers on region and category.

### Before
    
    
    Model:  One table, Orders, 16 rows x 8 columns. Everything imported as exported.
    Slicer: Orders[Region], Orders[Product]
    Margin: not possible, there is no cost column anywhere

It renders, and it is a dead end. Margin cannot be computed at all. Time intelligence fails because there is no date table. A product with no orders this month vanishes from every slicer. And a cost correction, when the cost column eventually gets pasted in, is sixteen edits with sixteen chances to mistype.

### After
    
    
    Tables:  Orders (fact, 16 rows)
             Products (dimension, 3 rows: Product, Category, ListPrice, Cost)
             Reps     (dimension, 4 rows: Rep, Region)
             Date     (dimension, CALENDARAUTO)
    
    Relationships, all one-to-many, single direction, into Orders:
             Products[Product] -> Orders[Product]
             Reps[Rep]         -> Orders[Rep]
             'Date'[Date]      -> Orders[OrderDate]
    
    Total Revenue = SUM ( Orders[Revenue] )
    Cost of Goods = SUMX ( Orders, Orders[Units] * RELATED ( Products[Cost] ) )
    Gross Profit  = [Total Revenue] - [Cost of Goods]
    Margin %      = DIVIDE ( [Gross Profit], [Total Revenue] )

Four tables, three relationships, four measures, and the numbers from section two fall out: 9,890 revenue, 6,076 cost, 3,814 profit, 38.6 percent margin, with lamps at 45.0 percent. `RELATED` is what reaches across a relationship from the many side to the one side, and it works here precisely because the relationship exists and points the right way. Slicers on Category and Region now filter everything, and a cost correction is one cell.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**Duplicate keys on the dimension side.** Power BI refuses to create a one-to-many relationship if the "one" side is not unique, and the error message names the constraint rather than the offending row. Find the duplicate with a quick group-by before assuming the relationship is impossible.

**Blank keys on the fact side.** Orders whose product is missing get lumped into a blank row on the dimension. The total still reconciles, and the blank line in a visual is the model telling you about a data quality problem, not a bug to hide.

**Both-direction filtering everywhere.** It solves one visual and creates ambiguity for the engine. Microsoft's own filter modifier list includes `CROSSFILTER` for changing direction inside a single measure, which is nearly always the better tool than changing it on the relationship.

**Mixed grain in one fact table.** Order lines and order headers in the same table double-count anything summed. The guidance is explicit that "fact tables always load data at a consistent grain". One row means one thing, and the same thing, throughout.

**Slicing by the fact table's copy of a column.** Works until a dimension member has no facts, then silently disappears from the slicer. Hide the fact table's descriptive columns to remove the choice.

**Modelling one flat export because it is one flat export.** The shape of the file you were sent is a fact about the sender's system, not about your model. Power Query exists to reshape it, and [Power Query](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-power-query/) is the same tool doing the same job in Excel.

## Why this works

A star schema is normalization applied with a specific stopping point. Codd's relational model separates entities from the relationships between them so that each fact is recorded once, which is what makes a cost correction one edit instead of sixteen (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Dimensional modelling stops the normalization one step short of fully normal form, keeping each dimension in a single wide table, because query readability and filter propagation matter more in an analytical model than storage does. Kimball's account is the canonical one and the reason the vocabulary on this page is standard across every tool (Kimball & Ross, 2013, _The Data Warehouse Toolkit_ , 3rd edition, Wiley; a monograph rather than a journal article).

Everything specific to Power BI here is documented behaviour rather than preference. The rule that the table type is decided by relationship cardinality, the split of filtering-and-grouping against summarization, the four costs of a snowflake, the single-active-relationship constraint, the degenerate dimension exception and the consistent grain requirement are all quoted above from Microsoft's star schema guidance for Power BI. That page is worth reading in full; it is the shortest route to understanding why models that look fine in a table view behave strangely in a report.

One note on why this page kept asking you to predict before showing the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The lamps result sticks because you were asked to look for the missing column first.

## Using this on your own model

Rebuilding an inherited model from scratch is rarely the right call. Do this instead, in order.

  1. **Open the model view and count the arrows.** Every table should reach the fact table in one hop, and every arrow should point at it.
  2. **Add the date table first** if there is not one. It is the highest-value single change in almost any model.
  3. **Pull descriptive columns out of the fact table** one at a time, starting with the one that appears in the most slicers. This is incremental and each step is testable.
  4. **Set every relationship to single direction** and turn one back to both only when a specific visual demands it and you have tested what else moved.
  5. **Hide the fact table's key and descriptive columns** from report view, so report builders can only pick the dimension's copy.

If you have paper nearby, one optional drawing is worth five minutes. Draw your own model as boxes and arrows from memory, then open the model view and compare. The tables you forgot are usually the ones nothing filters, and the arrows you drew the wrong way are usually the ones causing the bug you have been chasing.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, Power BI and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                          | What it means                                                                                 |
|-------------------------------|-----------------------------------------------------------------------------------------------|
| Dimension table               | Describes things. Enables filtering and grouping. Small, one row per thing.                   |
| Fact table                    | Records events. Enables summarization. Large and growing.                                     |
| Who decides the type          | Nothing you set. The relationship cardinality does. One side is the dimension.                |
| The shape                     | Every dimension one hop from the fact table, every arrow pointing inward.                     |
| Cardinality                   | One to many, from dimension to fact.                                                          |
| Cross-filter direction        | Single, by default. Both creates ambiguity. Use CROSSFILTER in a measure instead.             |
| What the flat table cannot do | Margin. There is no cost column, and there is nowhere for it to live.                         |
| The finding it unlocks        | Lamps: last by revenue at 1,600 of 9,890, first by margin at 45.0%.                           |
| RELATED                       | Reaches from the many side to the one side across a relationship.                             |
| Snowflake                     | A dimension chained across tables. Four documented costs, including no cross-table hierarchy. |
| Role-playing dimension        | Order date and ship date. Only one relationship can be active.                                |
| USERELATIONSHIP               | Activates an inactive one inside a single measure. Does not scale.                            |
| Second date table             | The recommended fix. `Ship Date = 'Date'`, then rename its columns.                           |
| Degenerate dimension          | Order number stays on the fact table. The documented exception.                               |
| Consistent grain              | One row means the same thing throughout. Mixing headers and lines double-counts.              |
| Slice by the dimension        | Not the fact table's copy, or members with no facts vanish.                                   |

**The one habit to keep.** Every column that describes something lives on a dimension, and every number you add up lives on the fact table. When you are unsure which a column is, ask whether you would ever put it on a slicer. If yes, it belongs on a dimension. If a model breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first model I built was one flat export with forty columns, and it worked until somebody asked for margin, at which point there was nowhere to put the cost. What is the question your current model cannot answer, and is it a missing measure or a missing table?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Kimball, R., & Ross, M. (2013). _The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling_ (3rd ed.). Wiley. (The canonical treatment of dimensional modelling. A monograph rather than a journal article.)
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Microsoft. _Understand star schema and the importance for Power BI_ , Power BI guidance. The source of every rule quoted on this page: table types determined by cardinality, the snowflake costs, single active relationship, degenerate dimensions and consistent grain. Product documentation rather than peer-reviewed research, which is the correct authority for how a product behaves.

---

*The full version of this guide lives on my site: [Star Schema in Power BI: Why One Flat Table Cannot Answer the Question](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-star-schema/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
