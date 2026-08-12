By the end of this page you can attach columns from one DataFrame to another on a shared key, choose the right `how` for the question, see at a glance which rows failed to match, and catch the failure that quietly inflates every total in the frame. It is about twenty-five minutes, and every output below was produced by running the code.

Here is what to do today, on every merge you write. Print the row count immediately before and immediately after it. A left merge must not change the row count, and if it did, the right-hand table has the key more than once and your totals have just gone up.

The short version: `merge` pairs rows from two frames wherever their keys match, and the number of rows that come out depends on how many times each key appears on each side.

One key twice on the right is the idea, so it gets the picture.

> _The original carries a diagram here. In words: On the left a single row is drawn as a wide box, holding the key Desk and the value 880. To its right stands a small lookup table with two rows, and both of those rows carry the same key, Desk. Two lines run from the single left-hand row, one to each of the two matching lookup rows, so the one row is paired twice. On the far right the result is drawn as two separate output rows, and both of them contain Desk and 880; the value 880 is ringed in amber in each of them to show that it is the same original figure appearing twice. One row went in and two came out, without anything being added to the left-hand table._

**Every output on this page is real.** Sixteen orders totalling 9,890 and a three-row product table, the same tables used across this whole set of guides, merged in pandas 3.0.2 with the results copied back. If you know [SQL joins](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/), this is the same operation with different words, and the two failure modes are identical.

## 1. merge in one line

Two frames, one shared column, one call.
    
    
    orders.merge(products, on="product", how="left")
    
       order_id product   category  cost
    0      1001    Desk  Furniture   140
    1      1002   Chair  Furniture    52
    2      1003    Desk  Furniture   140
    3      1004    Lamp   Lighting    22
    
    shape (16, 11)   revenue 9890

Sixteen rows in, sixteen rows out, and the revenue is unchanged at 9,890. Two columns arrived, `category` and `cost`, attached to every order by matching the product name.

Read the arguments as a sentence: take the orders, bring in the products, match on `product`, and keep every order whether or not it matches. That last part is `how`, and it is the argument that decides everything.

Those two numbers, the row count and a total, are the whole check. Say them out loud before you run a merge and compare afterwards. Everything on this page is a way for one of them to change when you did not expect it to.

## 2. The four hows, and the rows they give

Before the explanation: the product table is missing Lamp, and four of the sixteen orders are lamps. Predict the row count for each of the four hows.
    
    
    how=left    rows= 16   revenue=9890   missing cost=4
    how=inner   rows= 12   revenue=8290   missing cost=0
    how=right   rows= 12   revenue=8290   missing cost=0
    how=outer   rows= 16   revenue=9890   missing cost=4

Four different answers to the same question, and the difference between the first two is 1,600 of revenue, which is the lamp business.

| how     | Keeps                                       | Use it when                                                              |
|---------|---------------------------------------------|--------------------------------------------------------------------------|
| `left`  | Every row of the left frame, matched or not | Almost always. The left frame is your data and you are decorating it.    |
| `inner` | Only rows that matched on both sides        | You genuinely want the intersection, and you have checked what it drops. |
| `right` | Every row of the right frame                | Rarely. Swap the frames and use left instead; it reads better.           |
| `outer` | Everything from both sides                  | Reconciling two lists and needing to see what is on each side only.      |

`left` is the default choice for a reason: it cannot lose a row of your data. `inner` is the one that catches people, because it is the most natural-sounding thing to want and it deletes silently. Twelve rows came back where sixteen went in, no message appeared, and the four lamp orders are simply not in the result to be missed.

The rule: **if the row count went down, an inner join threw something away, and you have to know what.**

## 3. indicator: which side did this row come from

One argument turns "some rows did not match" into a count you can read.
    
    
    orders.merge(products_missing_lamp, on="product", how="outer", indicator=True)
    
    _merge
    both          12
    left_only      4
    right_only     0

Twelve matched, four orders found no product, and no products went unused. Those three numbers are the shape of the join, and they take one keyword to get.

Use it while developing every merge and then take it out, or keep the column and filter on it, which is how you get the unmatched rows themselves rather than just their count:
    
    
    m = left.merge(right, on=key, how="outer", indicator=True)
    m[m["_merge"] == "left_only"]     # the rows that found no partner

`right_only` being non-zero is worth a look too. It means the lookup table has entries nothing uses, which is usually harmless and occasionally tells you the key is wrong: a lookup where nothing matches at all comes back as every row on one side and every row on the other.

## 4. The multiplication

Before the explanation: the product table gains a second row for Desk, identical to the first. It now has four rows instead of three. Predict what the merge returns.
    
    
    rows    16  ->  23
    revenue 9890 -> 14950
    desk rows  7 ->  14

Seven extra rows and 5,060 of extra revenue, from adding one row to a lookup table. Nothing was added to the orders, and no order was changed.

The mechanism is exactly what the picture at the top shows. Seven orders are desks; each of them now matches two rows in the product table; each therefore comes out twice. Seven orders became fourteen rows, and every desk order's revenue is counted twice, which is 5,060 counted a second time.

What makes this the most dangerous thing on the page is what does not happen. There is no error and no warning. The frame looks entirely normal, every individual value in it is correct, and any total computed afterwards is wrong in a way that is invisible unless you knew the row count before.

It is also completely ordinary in real data. A product table with one row per product and one per price change. A customer table with a row per address. A lookup that was appended to twice. Each of those is a reasonable table that is not one row per key, and merging to it multiplies.

Say out loud what you would see if this happened on a merge inside a pipeline you did not write. A revenue figure a bit too high, no error anywhere, and every row you spot-check correct.

## 5. validate: make the merge refuse

pandas will check the cardinality for you and raise rather than multiply.
    
    
    orders.merge(products, on="product", how="left", validate="m:1")
    # clean table: accepted
    
    orders.merge(products_with_duplicate_desk, on="product", how="left", validate="m:1")
    # MergeError: Merge keys are not unique in right dataset; not a many-to-one merge

That is the single most valuable argument in this whole function and almost nobody uses it. `validate="m:1"` says: many rows on the left may match, but each key must appear at most once on the right. It is the assumption you are already making every time you attach a lookup, written down so the computer can enforce it.

| validate | Means                                                                  |
|----------|------------------------------------------------------------------------|
| `"m:1"`  | Many left rows to one right row. Attaching a lookup. The common case.  |
| `"1:1"`  | Both sides unique. Joining two versions of the same record.            |
| `"1:m"`  | One left row to many right rows. Expanding a parent into its children. |
| `"m:m"`  | No constraint. This is the default behaviour, and it multiplies.       |

Add it to every merge you write. It costs nine characters, it turns an invisible inflation into an exception at the moment it happens, and the exception names the side that is wrong.

## 6. Column names that collide

If both frames have a column with the same name, and it is not the key, pandas keeps both and renames them.
    
    
    ['units_x', 'units_y']

`_x` is the left frame and `_y` is the right. That is a sensible default and a terrible thing to find in a script six months later, because nothing about `units_x` says which table it came from.

Two better options. Set your own suffixes at the merge, which takes two seconds and reads correctly afterwards:
    
    
    orders.merge(products, on="product", suffixes=("_order", "_catalogue"))

Or, better still, drop or rename the columns you do not need before merging, so the collision never happens. A merge that brings in three columns you want is much easier to read than one that brings in fifteen and renames four of them.

## 7. Keys with different names, and different types

When the key column is called something different on each side, name both.
    
    
    orders.merge(catalogue, left_on="product", right_on="item", how="left")
    
    rows 16, and the result keeps both key columns: ['product', 'item']

Note the second half. Both key columns survive into the result, holding identical values, so the frame has a redundant column. Drop it straight away, or the next person will wonder which one is authoritative.

Types are stricter, and pandas is better behaved here than most tools. Merging a text key to an integer key does not silently match nothing; it raises:
    
    
    ValueError: You are trying to merge on string and int64 columns for key 'order_id'.

That is genuinely good news, because the same mistake in a spreadsheet lookup produces `#N/A` on some rows and in SQL produces zero matches, both of which look like a data problem rather than a type problem. Here it stops you. Fix the types, usually by making both sides text if the key is an identifier, which is the argument in [how a CSV gets loaded](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-read-csv/).

What is _not_ caught is a difference in the values themselves: a trailing space, a different case, a code with a leading zero on one side only. Those merge cleanly and match nothing, and the tell is a suspiciously round number of unmatched rows in the `indicator` column.

## 8. merge, join and concat

Three functions people confuse, on different jobs.

**`merge`** matches on columns. This is the one you want almost always, and everything above is about it.

**`join`** is a convenience method that matches on the _index_ by default. It is shorter when your frames are genuinely indexed by the key, and a source of confusion when they are not, because it silently uses the index you forgot you had. If in doubt, use `merge` and name the columns.

**`concat`** does not match anything. It stacks frames, either on top of each other, which is a union of rows, or side by side, which lines them up by index position and is almost never what you want. The check for a vertical `concat` is arithmetic: the result's row count must equal the sum of the inputs'.
    
    
    pd.concat([jan, feb, mar], ignore_index=True)      # rows must add up
    orders.merge(products, on="product", how="left")   # rows must not change

Picture the pipeline you maintain. How many merges are in it, and for how many of them do you know the expected row count?

## The full before and after

Same job: attach product costs to sixteen orders.

### Before
    
    
    df = orders.merge(products, on="product")
    
    # no how, so it defaults to inner
    # no validate, so a duplicate key would multiply
    # no row count check, so neither would be noticed

Three defaults accepted without deciding. If the lookup ever loses a product, rows disappear. If it ever gains a duplicate, rows multiply. Both change the totals and neither says anything.

### After
    
    
    before = len(orders)                       # 16
    
    df = orders.merge(
        products[["product", "category", "cost"]],   # only what is needed
        on="product",
        how="left",                                  # never lose a row of my data
        validate="m:1",                              # and refuse if the lookup repeats
        indicator=True,
    )
    
    assert len(df) == before, f"merge changed the row count: {before} -> {len(df)}"
    print(df["_merge"].value_counts())          # both 16, left_only 0
    print(df["cost"].isna().sum())              # 0 unmatched

Row count asserted, cardinality enforced by pandas rather than by hope, unmatched rows counted rather than assumed, and only the three columns that are wanted brought across.

The claim, and it is why `validate` belongs on every merge: **adding one duplicate row to a three-row lookup table took the result from 16 rows and 9,890 to 23 rows and 14,950, and produced no error, no warning, and no incorrect individual value anywhere in the frame.**

## Edge cases that break a merge

Six worth knowing.

**Nulls in the key.** By default pandas matches null to null, so every row with a missing key on the left pairs with every row with a missing key on the right, which is a multiplication waiting to happen. Drop or fill them before merging.

**Whitespace and case in the key.** Merges cleanly, matches nothing, and shows up only in the `indicator` counts. Clean the key columns first, exactly as for any other join.

**The index after a merge.** `merge` discards the left frame's index and gives you a fresh one, so anything relying on the old index breaks quietly. Reset or reattach on purpose.

**Merging in a loop.** Repeatedly merging one frame into a growing result is slow and multiplies the risk of the multiplication happening once without being noticed. Build a list and merge once, or reduce over the list checking the count each time.

**Memory.** A merge produces a new frame with the columns of both, so joining two wide tables can be several times the size of either. Select the columns you need on the right before merging, not after.

**Many-to-many on purpose.** Sometimes it really is right, for instance expanding an order into its lines. Then say so with `validate="1:m"` and check the row count against the expected expansion, so the intended multiplication is documented and the unintended one still fails.

## Why this works

The multiplication is not a pandas quirk, it is what matching means. A join pairs every row on one side with every row on the other whose key agrees, so the output size is decided by how many times each key occurs on each side rather than by how many rows either table has. In the relational model a key is precisely a column, or set of columns, whose value identifies a row uniquely, and joining on something that is not a key gives up that guarantee (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). "One duplicate in the lookup table" is another way of saying the join column is not a key on that side, and once you say it that way the seven extra rows stop being surprising.

pandas deliberately mirrors that vocabulary rather than inventing its own, which is why `how` takes the same four words a database uses and why the behaviours match: the library was built to bring relational-style operations to in-memory tabular data in Python, so that people could do the joining and reshaping they were already doing in SQL without moving the data (McKinney, 2010, _Proceedings of the 9th Python in Science Conference_ , 51–56). That is the useful part for an analyst: what you learn here transfers directly to [joins in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/), including the two ways they go wrong.

One note on the questions asked before each answer on this page. Prompting yourself to produce a prediction before reading the result is one of a small number of study moves that reliably improves what you take away, and it works even when the prediction is wrong (Fiorella & Mayer, 2016, _Educational Psychology Review_ , 28(4), 717–741). The 23 sticks because you were asked to guess 16.

## Using this on your own project

Auditing every merge in a codebase is a project. Do this instead, in order.

  1. **Find the merges with no`how`**. They are inner joins by default, and their authors usually meant left.
  2. **Add`validate="m:1"` to every lookup merge.** Nine characters, and the multiplication becomes an exception.
  3. **Assert the row count** around any left merge. One line, and it fails loudly at the moment of the mistake.
  4. **Use`indicator=True` while developing** and read the three counts before removing it.
  5. **Select the right-hand columns before merging** , so collisions and memory both stop being issues.
  6. **Clean the key columns first** , for case, whitespace and type, since none of those produce an error.

If you have paper nearby, one optional sketch is worth five minutes. Write your two tables as two boxes, and beside each write how many times a single key value can appear in it: once, or more than once. Those two answers are the `validate` string, and most people find that writing them down surfaces a table they had assumed was one row per key and is not.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). The step after joining is usually summarising, which is [pandas groupby](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-groupby/).

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                        |
|------------------------|---------------------------------------------------------------------|
| `merge(on=, how=)`     | Pairs rows wherever the keys match.                                 |
| The check              | Row count and one total, before and after.                          |
| `how="left"`           | Keeps every left row. The default choice.                           |
| `how="inner"`          | Only matched rows. Deletes silently.                                |
| `how="outer"`          | Everything from both sides. For reconciling.                        |
| Row count went down    | An inner join dropped rows. Find out which.                         |
| Row count went up      | The right-hand key is not unique. Totals are now inflated.          |
| `indicator=True`       | Adds `_merge`: both, left_only, right_only.                         |
| `validate="m:1"`       | Raises if the right-hand key repeats. Use it every time.            |
| Other validate values  | `1:1`, `1:m`, and `m:m` which is the unguarded default.             |
| Colliding column names | Become `_x` and `_y`. Set `suffixes` or drop them first.            |
| Different key names    | `left_on` and `right_on`. Both columns survive; drop one.           |
| Different key types    | Raises a ValueError. Better than matching nothing.                  |
| Different key values   | Case, spaces, leading zeros. No error, no matches.                  |
| Nulls in the key       | Match each other, which multiplies. Remove them first.              |
| `join`                 | Matches on the index by default. Prefer merge and name the columns. |
| `concat`               | Stacks rather than matches. Row counts must add up.                 |

**The one habit to keep.** Put `validate=` on every merge. It is the only thing on this page that turns the silent failure into a loud one at the moment it happens, and writing it forces you to state what you believe about the two tables, which is usually where the mistake actually is. If a merge misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. Mine was a price table that had gained one duplicate row during a data fix, so a monthly revenue figure came out about eight percent high for two months, and every single row anybody checked was correct. What has a join quietly multiplied for you?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * McKinney, W. (2010). Data structures for statistical computing in Python. _Proceedings of the 9th Python in Science Conference_ , 51–56.
  * Fiorella, L., & Mayer, R. E. (2016). Eight ways to promote generative learning. _Educational Psychology Review_ , 28(4), 717–741.

---

*The full version of this guide lives on my site: [pandas merge: Left Join, Inner Join, and the One That Doubled the Revenue](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-merge/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
