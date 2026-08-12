By the end of this page you can load a CSV into pandas, find out in twenty seconds what type every column became, stop the identifier columns losing their leading zeros, get dates read the way they were written, and turn a money column that arrived as text into numbers. It is about twenty-five minutes, and every output below was produced by running the code.

Here is what to do today, the moment after you first load a file. Run `df.dtypes`. Not `df.head()`, which shows you what the values look like, but `dtypes`, which shows you what they are. A column of identifiers that says `int64` has already lost its leading zeros, and a money column that says `object` or `str` is text that will refuse to add up.

The short version: `read_csv` reads characters and guesses a type per column. The guess is usually right, it is silent when it is wrong, and four arguments replace guessing with instruction.

The same characters becoming two different values is the idea, so it gets the picture.

> _The original carries a diagram here. In words: On the left, a strip of five small square boxes holds one character each, reading zero, eight, zero, five, three, as the characters appear in the file. Two arrows branch out from that strip. The upper arrow leads to a strip of five boxes in which the first box is empty, crossed through and outlined in amber, while the remaining four hold eight, zero, five and three; the leading character has been discarded. The lower arrow leads to a strip of five boxes holding zero, eight, zero, five and three, identical to the original, outlined in blue. Both destinations came from the same source strip, and only one of them still contains everything the file did._

**Every output on this page is real.** Run on pandas 3.0.2 against a small CSV built to contain the four problems every real export has: an identifier with leading zeros, ambiguous dates, a text marker for missing values, and money with a thousands separator. If your pandas is older, the arguments are the same and one or two of the default behaviours differ, which is noted where it matters.

Here is the file, as characters. Four rows, and everything on this page comes out of it.
    
    
    order_id,order_date,zip,rep,region,units,amount
    1001,05/01/2026,08053,Dana Reyes,North,4,"1,234.50"
    1002,12/01/2026,02134,Owen Park,South,10,"850.00"
    1003,19/01/2026,00501,Priya Shah,East,N/A,"660.00"
    1004,26/01/2026,90210,Dana Reyes,North,6,"240.00"

## 1. Load it, then look at it

One line loads it. Four more tell you what you got, and skipping them is the mistake this whole page is about.
    
    
    import pandas as pd
    df = pd.read_csv("orders.csv")
    
    df.shape          # (4, 7)  rows and columns
    df.dtypes         # what each column became
    df.head()         # what the values look like
    df.isna().sum()   # how many are missing, per column

Run in that order. `shape` against the row count you expected catches a truncated file or a delimiter problem immediately. `dtypes` is the one people skip and the one that matters. `head` is for the eye. And `isna().sum()` is the number you will be asked about later.

Add `df.describe()` when the file is numeric. It gives count, mean, min, max and the quartiles per numeric column, and the useful part for a first look is the **count** row, because a column whose count is lower than your row count has missing values in it.

## 2. What it guessed, and what that cost

Before the explanation: the file above is loaded with no arguments at all. Say which of the seven columns you expect to be wrong.
    
    
    df = pd.read_csv("orders.csv")
    
       order_id  order_date    zip         rep region  units    amount
    0      1001  05/01/2026   8053  Dana Reyes  North    4.0  1,234.50
    1      1002  12/01/2026   2134   Owen Park  South   10.0    850.00
    2      1003  19/01/2026    501  Priya Shah   East    NaN    660.00
    3      1004  26/01/2026  90210  Dana Reyes  North    6.0    240.00

Three problems, none of which raised anything.

**The zip column lost its leading zeros.** 08053 became 8053 and 00501 became 501, because the characters looked like a number and were read as one. The information is gone from the frame; no amount of reformatting will bring back a digit that was never stored.

**The amount column is still text** , because of the comma in 1,234.50. And text that looks numeric does something worse than erroring when you total it:
    
    
    df["amount"].sum()
    
    '1,234.50850.00660.00240.00'

That is not a number. `sum` on text concatenates, so the "total" is every value glued together, and if it lands in a report as a string nobody will read it as an arithmetic failure.

**The units column became a float.** Whole numbers with one `N/A` among them cannot all be integers, because the missing one has to be represented, so pandas widened the column to `float64` and the values are now 4.0, 10.0, NaN, 6.0. That one is not damage, it is a signal: **an integer column that arrives as a float almost always means something in it was missing.**

Say out loud which of those three would be visible in `head()` alone. The zeros, if you happened to know they should be there. The other two look completely normal.

## 3. Declare the types

`dtype` takes a dictionary of column names and types, and it applies before any conversion, which is what saves the zeros.
    
    
    df = pd.read_csv("orders.csv", dtype={"zip": "string", "order_id": "string"})
    
    zip   ->  ['08053', '02134', '00501', '90210']

All five characters, every time. The rule worth adopting: **anything that identifies something rather than measures something is text.** Zip codes, account numbers, order references, product codes, phone numbers, employee IDs. The test is the one from the spreadsheet world: would adding two of these together mean anything? If not, it is not a number, whatever it looks like. The Excel version of exactly this failure is in [the dialog that quietly deletes your zip codes](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/), and it is the same characters being lost in a different tool.

Two notes on the type names. `"string"` is the modern pandas string type and is what to use; older code says `str` and gets a generic object column, which works and is less clear about its intent. And declaring a type for one column does not stop pandas guessing the rest, so `dtype` is a list of exceptions rather than a full schema unless you write one.

## 4. Dates: say the format

Before the explanation: the dates read `05/01/2026`. Say which day that is.

You cannot know, and neither can pandas. Asking it to parse them without saying which order the pieces are in:
    
    
    pd.read_csv("orders.csv", parse_dates=["order_date"])
    
    dtype: str
    first value: '05/01/2026'

Nothing happened. The column is still text, no exception was raised, and if you had not checked `dtypes` you would have carried on assuming it was a date. Current pandas declines to guess an ambiguous format rather than picking one, which is much better behaviour than guessing and much easier to miss than an error.

Say the format and it works:
    
    
    pd.read_csv("orders.csv", parse_dates=["order_date"], date_format="%d/%m/%Y")
    
    ['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26']

And here is the part worth knowing, because it is the safety net. Declaring the _wrong_ format also leaves the column as text rather than producing wrong dates: asking for `%m/%d/%Y` on this file gives back `str`, because 19/01 and 26/01 are not valid month-first dates. So a mistake in the format shows up in `dtypes` rather than in the numbers, as long as at least one row in the file is unambiguous.

Which is also the warning. A file where every date happens to have a day of twelve or less is entirely ambiguous, both formats parse cleanly, and the wrong one gives you a working column full of wrong dates. That is not a pandas problem, it is a property of the file, and the fix is to ask the source for `yyyy-mm-dd`. The wider version of this is in [how dates are stored](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dates/).

## 5. Missing values are only missing if you say so

pandas recognises a list of markers as missing out of the box, including empty fields, `NA`, `NaN`, `NULL` and `N/A`. That last one is why `units` already came back with a `NaN` above.

What it does not recognise is whatever your source system invented. Real files use `-`, `none`, `Unknown`, `#N/A`, `999`, `-1`, and a single space. Those arrive as ordinary values, which means a text marker makes the whole column text, and a numeric marker like `-1` or `999` is far worse: it is a real number, it will be averaged, and nothing will ever look wrong.
    
    
    pd.read_csv("orders.csv", na_values=["N/A", "-", "Unknown", "none"])

Then check what that produced, because the count is the finding:
    
    
    df.isna().sum()
    
    order_id      0
    order_date    0
    zip           0
    units         1
    amount        0
    
    units: sum 20.0, count 3, rows 4

One missing unit value. Note the last line: the column sums to 20 over a count of 3, in a frame of 4 rows. **A count lower than the row count is the definition of a column with missing values** , and comparing those two numbers is the cheapest check in pandas. What to do about them, fill or drop or leave, is a separate decision with its own page.

## 6. Numbers wearing punctuation

The amount column stayed text because of one comma. One argument fixes it at read time.
    
    
    pd.read_csv("orders.csv", thousands=",")
    
    df["amount"].sum()    2984.5

A number, and one that adds up: 1,234.50 plus 850 plus 660 plus 240 is 2,984.50.

Three relatives, for files from elsewhere. `decimal=","` for European files where the comma is the decimal point and the dot groups thousands. `encoding="utf-8"`, or `"latin-1"`, or `"cp1252"`, when accented characters arrive as gibberish. And `sep=";"` or `sep="\t"` when the file is not actually comma separated, which announces itself as a frame with one very wide column.

A currency symbol is not covered by `thousands`. `£1,234.50` stays text, and it has to be cleaned after loading:
    
    
    df["amount"] = (df["amount"].str.replace(r"[£$,]", "", regex=True).astype(float))

## 7. usecols, nrows and the index trap

Three arguments that change how much you load rather than how it is interpreted.

**`usecols`** reads only the columns you name. On a file with ninety columns and four you need, this is the difference between a frame you can look at and a frame you scroll sideways through, and it saves the memory too.
    
    
    pd.read_csv("orders.csv", usecols=["order_id", "amount"])

**`nrows`** reads only the first few. Point it at a very large file first, work out the arguments you need on two hundred rows, then load the whole thing once with the right settings. That is the habit that turns a slow first hour into a fast one, and the rest of the too-big-to-open problem is in [handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/).

**`index_col`** makes a column the index rather than a column, and it catches beginners out because the column then disappears from `df.columns` and from anything that iterates over columns.
    
    
    df = pd.read_csv("orders.csv", index_col="order_id")
    list(df.columns)    # order_id is not in here any more

Use it deliberately when the identifier is genuinely the row label and you will be looking rows up by it. Leave it alone otherwise; a default numeric index is fine and keeps the id where you can see it.

## 8. The check block for any new file

Six lines, run every single time, before any analysis. They take twenty seconds and they cover everything on this page.
    
    
    df.shape                      # does the row count match what you expected?
    df.dtypes                     # is every column the type it should be?
    df.head()                     # do the values look right?
    df.isna().sum()               # how many missing, per column?
    df.describe()                 # count row lower than shape? min or max absurd?
    df.nunique()                  # distinct values: is it the number you expected?

That last one earns its place more than it looks. A region column with six distinct values when you know there are four is a spelling problem, found before it becomes a report with two extra regions in it.

Picture the last file somebody sent you. Which of those six would have told you something you did not already know, and did you run it?

## The full before and after

Same file, same four rows.

### Before
    
    
    df = pd.read_csv("orders.csv")
    
    zip            8053, 2134, 501, 90210        leading zeros gone
    order_date     '05/01/2026'                  text, not a date
    amount         '1,234.50'                    text
    amount.sum()   '1,234.50850.00660.00240.00'  concatenated

One line, four columns wrong, no errors, no warnings. Three of the four are invisible unless you look at `dtypes`.

### After
    
    
    df = pd.read_csv(
        "orders.csv",
        dtype={"zip": "string", "order_id": "string"},
        parse_dates=["order_date"], date_format="%d/%m/%Y",
        na_values=["N/A", "-", "Unknown"],
        thousands=",",
    )
    
    order_id              string
    order_date    datetime64[us]
    zip                   string
    units                float64
    amount               float64
    
    zip            '08053', '02134', '00501', '90210'
    amount.sum()   2984.5
    units          sum 20.0, count 3, rows 4      one value missing

The claim, and it is why `dtypes` is the first command rather than the fourth: **the same file loaded two ways gives 2,984.50 or every amount glued into one string, and the only difference visible on screen is the word`str` in a line most people never print.**

## Edge cases that break a load

Six worth knowing.

**Mixed types in one column.** If a column is numeric for a hundred thousand rows and then holds `"pending"`, pandas reads the file in chunks and can produce a column of mixed types. Declaring the dtype removes the possibility.

**Very large integers.** An account number with nineteen digits exceeds what an integer column can hold exactly, and the last digits change. Another reason identifiers are text.

**A header that is not on row one.** Two title rows above the data make the first title into the column names and everything else into strings. Use `skiprows=2`, or `header=2`.

**Extra commas inside quoted fields.** Handled correctly by default, and broken by files that quote inconsistently. A frame with more columns than the header is the symptom.

**Trailing blank lines and footers.** A total row at the bottom becomes a data row containing text in your numeric columns, which is often what turned the column to text in the first place. `skipfooter` exists; deleting the row at source is better.

**Whitespace around values.** `" North"` and `"North"` are different values and will show up in `nunique`. `skipinitialspace=True` handles the common case, and the rest is the ordinary cleaning routine.

## Why this works

A CSV file contains no types. It is characters and separators, and nothing in it says whether 08053 is a number or a label, so a reader has to decide, and pandas decides by inspecting the values. That inference is a deliberate design choice rather than an oversight: the library was built around the idea that loading real, messy, tabular data should take one line and produce something usable immediately, with the tuning available for the cases where the guess is wrong (McKinney, 2010, _Proceedings of the 9th Python in Science Conference_ , 51–56). The convenience is real. The cost is that the moment of the guess is invisible, which is why the discipline is not to avoid the inference but to inspect it, once, on every file.

The reason to care disproportionately about identifier columns is that the loss is not recoverable and not visible. This is the same failure that produced a well-documented problem in published science, where spreadsheet software silently converted gene names into dates and numbers, and the converted values survived peer review because a converted cell looks exactly like an ordinary one (Ziemann, Eren, & El-Osta, 2016, _Genome Biology_ , 17, 177). A zip code that became 8053 has the same property: it is a perfectly plausible number, it will join to nothing, and the failure will surface as missing matches rather than as an error.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because the advantage of self-testing over restudying holds for complex, realistic material and not only for word lists (Karpicke & Aue, 2015, _Educational Psychology Review_ , 27(2), 317–326).

## Using this on your own project

Rewriting every load in an old notebook is miserable. Do this instead, in order.

  1. **Print`dtypes` immediately after every read.** One line, and it is the whole diagnosis.
  2. **Declare every identifier column as`"string"`**, before anything else. That is the irreversible loss.
  3. **Give every date a`date_format`**, and check the dtype afterwards to confirm it took.
  4. **List your source's missing markers in`na_values`**, and then look at `isna().sum()` rather than assuming it is zero.
  5. **Use`nrows` to work out the arguments** on a big file, then load it once properly.
  6. **Keep the six-line check block** at the top of every notebook and run it on every new file.

If you have paper nearby, one optional sketch is worth five minutes. Write out your file's column names and, beside each, the type it should be and why: measure or label, date or text, allowed to be missing or not. That list is your `dtype` dictionary and your `na_values` list, and writing it takes less time than finding out later which one pandas got wrong.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Python, SQL, Excel, and the working habits around them. The next step after loading is usually summarising, which is [pandas groupby](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-groupby/).

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                            | What it does                                                          |
|----------------------------------|-----------------------------------------------------------------------|
| First command after loading      | `df.dtypes`. Not head.                                                |
| A CSV has no types               | pandas infers one per column, silently.                               |
| Identifier read as a number      | Leading zeros gone, unrecoverably.                                    |
| The test                         | Would adding two of these mean anything? If not, it is text.          |
| `dtype={"zip": "string"}`        | Applies before conversion, so the characters survive.                 |
| Text that looks numeric          | `sum()` concatenates instead of adding.                               |
| Integer column arriving as float | Something in it was missing.                                          |
| `parse_dates` alone              | Declines an ambiguous format and leaves it as text.                   |
| `date_format="%d/%m/%Y"`         | Says which order the pieces are in.                                   |
| A wrong format                   | Also leaves it as text, if any row is unambiguous.                    |
| Recognised missing markers       | Empty, NA, NaN, NULL, N/A. Not yours.                                 |
| `na_values=[...]`                | Your source's markers. A numeric marker like -1 is the dangerous one. |
| `thousands=","`                  | Turns "1,234.50" into a number at read time.                          |
| Currency symbols                 | Not covered. Strip them after loading.                                |
| `usecols`, `nrows`               | Fewer columns, fewer rows. Tune on a sample, load once.               |
| `index_col`                      | The column leaves `df.columns`. Use deliberately.                     |
| The check block                  | shape, dtypes, head, isna().sum(), describe, nunique.                 |

**The one habit to keep.** Print `df.dtypes` before you do anything else with a new frame, every time. Every failure on this page is visible in that one output and invisible in all the others, and it costs one line at the top of a cell you are writing anyway. If a load misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. Mine was a customer file where the account numbers loaded as integers, so every account beginning with a zero failed to join to the billing extract, and the missing customers looked like churn for most of a quarter. What has a type guess quietly cost you?

## References

  * McKinney, W. (2010). Data structures for statistical computing in Python. _Proceedings of the 9th Python in Science Conference_ , 51–56.
  * Ziemann, M., Eren, Y., & El-Osta, A. (2016). Gene name errors are widespread in the scientific literature. _Genome Biology_ , 17, 177.
  * Karpicke, J. D., & Aue, W. R. (2015). The testing effect is alive and well with complex materials. _Educational Psychology Review_ , 27(2), 317–326.

---

*Originally published on Analyst Prep Kit: [pandas read_csv: Your First DataFrame, and What It Guessed](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-read-csv/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
