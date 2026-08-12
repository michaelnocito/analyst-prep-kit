By the end of this page your CSV will be in Power BI with the right column types, the right characters, and no silent surprises waiting for the first refresh. Importing is four clicks. The reason this page exists is that the dialog in the middle has three dropdowns that decide how every number, date and accented character in your file is read, and the default answers are guesses.

Here is what to actually do today. On the import dialog, set **Data Type Detection** to _Based on entire dataset_ before you click anything else, and choose **Transform Data** rather than Load. Those two choices prevent most of what goes wrong below.

The short version: Home, Get data, Text/CSV, pick the file, read the three dropdowns, Transform Data, fix types, Close and Apply.

Why the type dropdown matters is the one idea worth the page, so it gets the picture.

> _The original carries a diagram here. In words: A very tall narrow column of stacked rows representing a long file. A small bracket encloses only the few rows at the very top of the stack. An arrow leads from that bracket to a short row of type labels drawn as small symbol tiles. From those tiles, a wide arrow sweeps back across the entire remaining height of the stack, showing the labels being applied to every row below. Near the bottom of the stack one row is drawn in a contrasting outline with a cross beside it, showing a single row further down that does not fit the label chosen from the top._

**Every dialog option and limit here comes from Microsoft's own Text/CSV connector documentation** , checked on 8 August 2026. The same connector and the same dropdowns appear in Excel's Power Query, so most of this page transfers straight across. If Power BI is not installed yet, [how to install Power BI Desktop](https://michaelnocito.github.io/analyst-prep-kit/guides/install-power-bi-desktop/) is the step before this one.

## 1. Import it

Before the explanation: a CSV is a plain text file with no type information in it at all. So where do you think Power BI gets the idea that one column is a date and another is a number?

On the Home ribbon, choose **Get data** , then **Text/CSV**. Pick your file and press Open. A preview window appears showing the first rows and three dropdowns along the top.

That preview window is the answer to the question. Nothing in the file says "this column holds dates". Power BI reads a sample of the rows and guesses, then writes the guess down as a permanent step. The dropdowns are how you influence the guess, and they are much easier to set now than to unpick later.

## 2. The three dropdowns, one at a time

**File Origin** is the character set. This one has a specific trap: the character set is not inferred, and UTF-8 is only detected automatically if the file starts with a special marker called a byte order mark. Plenty of files do not carry that marker. If your preview shows `Ã©` where an `é` should be, this dropdown is the fix, and setting it to a UTF-8 option will usually correct the whole file at once. [Character encoding for people who never heard the phrase](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-character-encoding/) is the fuller explanation.

**Delimiter** is what separates the values. Power BI offers colon, comma, equals sign, semicolon, space, tab, a custom delimiter of any text you like, and fixed width for files that use a set number of characters per field. It guesses, and it guesses well, but check the preview: if you see one column containing everything, the delimiter is wrong.

**Data Type Detection** is the important one. Three choices: based on the first 200 rows, based on the entire dataset, or off, which loads every column as text. The default samples the top of the file, which is fast and is exactly the behaviour in the picture above.

Choose _Based on entire dataset_ whenever you can. Microsoft's own warning is that this makes the initial load slower, which is true and is a fair trade: a slower import once beats a column typed wrongly forever. Their documentation says it plainly, that inference can be incorrect and you should double check before loading.

Choose _Do not detect data types_ when the file is genuinely messy and you would rather set every type yourself than untangle a wrong guess. Everything arrives as text, and you convert deliberately.

## 3. Transform Data, not Load

The preview window offers **Load** and **Transform Data**. Load drops the table straight into your model. Transform Data opens the Power Query editor first.

Choose Transform Data every time, even when the file looks perfect. The editor is where every action you take is recorded as a step in the Applied Steps list on the right, and that list replays on every future refresh. Work done there is permanent; work done later in the report is not.

Say what that means for a column you fix by hand after loading, before reading on. It means you will fix it by hand again after the next refresh, and so will whoever inherits the file. The editor is not an advanced option, it is where the durable version of the work lives.

## 4. Fix the types once, properly

In the editor, each column header carries a small symbol saying what Power BI thinks it holds: `ABC` for text, `123` for whole numbers, `1.2` for decimals, a calendar for dates. Read that row of symbols before anything else. It is a two-second check that prevents most downstream confusion.

Three fixes worth making immediately when they apply.

**A number that arrived as text.** Usually a thousands separator, a currency symbol, or a stray "N/A" in one row. Click the symbol and set the correct type, and if it errors, the offending value is now easy to find by filtering.

**A date that arrived as text, or is wrong by a month.** Day and month have been swapped. Use Change Type, then **Using Locale** , and pick the locale the file was written in. That is the difference between telling Power BI what the column is and telling it what language the column was written in, and for dates you need the second one.

**A code that has lost its leading zeros.** Postcodes, account numbers and product codes typed as numbers lose the zeros at the front. Set the type to Text, and if the zeros are already gone, they must be recovered in the source file rather than in Power BI. The [leading zeros fix](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) covers the source-side version.

Then press **Close & Apply**. The steps are saved, and every refresh from now on replays them in order.

## 5. The columns=x trap

This one is documented, quiet, and expensive, and almost nobody knows about it until it bites.

When you import a CSV, Power BI writes a step recording the number of columns the file had at that moment, as `columns=x`. If somebody later adds a column to the source file and you refresh, **the new column does not appear.** The refresh succeeds, the numbers all update, and the extra field is silently ignored because the step says the file has x columns.

There is no error and no warning. A monthly report can run for a year without the field somebody added in March, and the person who eventually notices is usually the one asking why two systems disagree.

The fix is simple once you know: open the Applied Steps, edit the Source step, and let it pick up the new column count. The habit is better than the fix. Whenever the source file changes shape, check the import step rather than trusting a successful refresh, because success here means the steps ran, not that the data is complete.

Now picture a report you refresh regularly. If a column were added to its source tomorrow, how would you find out? For most reports the honest answer is that you would not, which is exactly why this trap is worth remembering.

## 6. When the file is not really a CSV

Power BI treats a `.csv` as structured with a comma delimiter, and for a plain text file it tries to work out whether there is a delimiter at all. Usually it is right. Two cases where it is not, both documented.

**Structured text that is not a CSV.** A tab-separated file saved as `.txt` works fine, because Power BI detects the tab and treats it as a delimited file. The extension does not decide this; the content does.

**Unstructured text read as a table.** Occasionally a document with similar numbers of commas across its paragraphs gets interpreted as a CSV. The fix is in the editor: edit the Source step and change **Open File As** from CSV to Text.

There is also a **Line breaks** setting on that same edited Source dialog, deciding whether line breaks inside quoted values are honoured or ignored. If a single record has split itself across two rows, or two records have merged into one, that setting is why.

## The full before and after

Same file, same report.

### Before
    
    
    Get data → Text/CSV → Open → Load
    Chart looks wrong: revenue will not sum
    Fix the column in the report view
    Next month: refresh → same problem again
    Six months later: a column added in March is still missing

Every step succeeded. The revenue column was typed as text because one row near the top had "N/A" in it, and the fix was applied in the report rather than in the query, so it does not survive a refresh. The missing column is the `columns=x` step doing exactly what it was told.

### After
    
    
    Get data → Text/CSV → Open
    File Origin: UTF-8   Delimiter: comma   Type detection: entire dataset
    Transform Data
    Read the type symbols; set revenue to Decimal, order_date via Using Locale, postcode to Text
    Close & Apply
    Whenever the source changes shape: check the Source step

The same fixes, made in the place that replays them. Setting detection to the whole dataset means the "N/A" row is seen during import rather than discovered by a broken chart, and the locale step means dates are read in the language they were written in rather than the one your machine happens to use.

## What goes wrong, and the fix

Six that account for most of it.

**Accented characters look like`Ã©`.** File Origin. The character set is not inferred unless the file carries a byte order mark. Set it to UTF-8.

**Everything landed in one column.** Wrong delimiter. Change it in the dropdown and watch the preview split.

**A number column will not sum.** It is typed as text, usually because of a separator, a symbol, or one non-numeric value. Set the type in the editor, then filter to find the offending row.

**Dates are out by a month.** Day and month swapped. Change Type, Using Locale, and choose the locale the file was written in.

**A new source column never appears.** The `columns=x` step. Edit the Source step.

**Refresh breaks on a row that was always fine.** The type was inferred from the first 200 rows and a later row does not fit. Re-import with detection based on the entire dataset.

## Why it is built this way

A CSV carries no type information whatsoever. It is text, commas and line breaks, so every idea about what a column contains has to be invented by the program reading it. Sampling the first rows is a reasonable compromise between speed and accuracy on a large file, and the reason it fails is structural rather than careless: the row that breaks your assumption is usually rare, and rare rows are exactly the ones a sample misses.

That also explains why the fix is a setting rather than a smarter guess. Scanning the whole file gives a correct answer at the cost of time, and Microsoft's documentation is direct about that trade. Once you see the dropdown as a speed-against-certainty dial rather than an obscure option, choosing it becomes easy: certainty when the file matters, speed while you are exploring.

The `columns=x` step follows the same logic. Power Query records what it found so the steps can replay identically, and identical replay is the entire value of the tool. The cost of that guarantee is that a change in the source's shape is not automatically welcomed in, which is a reasonable default and a genuine hazard when nobody has been told.

One note on the way this page is written. It kept asking you to commit to an answer, where the types come from, what a hand fix costs you later, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own reports

Five habits, in order.

  1. **Read all three dropdowns before clicking anything.** Ten seconds, and they decide the rest.
  2. **Set detection to the entire dataset** for anything you will refresh. Speed matters less than a type that is right.
  3. **Always Transform Data, never Load.** Fixes made in the editor replay; fixes made afterwards do not.
  4. **Use Change Type, Using Locale for dates** , always, rather than plain Change Type.
  5. **Check the Source step whenever the file's shape changes.** A successful refresh is not evidence that a new column arrived.

If you have paper nearby, one optional drawing is worth two minutes. Write your file's column names down the page and put the type symbol you expect beside each one, before you import. Any column where the editor disagrees with your list is a column worth looking at properly, and that comparison takes less time than discovering it through a broken chart.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                    | What it is, or what it does                                                  |
|--------------------------|------------------------------------------------------------------------------|
| The path                 | Home → Get data → Text/CSV → pick the file.                                  |
| Why types are guessed    | A CSV holds no type information. Everything is inferred.                     |
| File Origin              | The character set. Not inferred unless the file has a byte order mark.       |
| `Ã©` instead of `é`      | Wrong File Origin. Set UTF-8.                                                |
| Delimiter options        | Colon, comma, equals, semicolon, space, tab, custom text, fixed width.       |
| Everything in one column | Wrong delimiter.                                                             |
| Type detection choices   | First 200 rows, entire dataset, or off (all text).                           |
| Entire dataset           | Slower first load, correct types. Prefer it for anything you refresh.        |
| Transform Data           | Opens the editor. Steps recorded there replay on every refresh.              |
| Load                     | Straight into the model, no recorded cleaning. Rarely the right choice.      |
| Type symbols             | `ABC` text, `123` whole number, `1.2` decimal, calendar date.                |
| Using Locale             | For dates. Tells Power BI which language the column was written in.          |
| `columns=x`              | Records the column count at import. New source columns are silently ignored. |
| Open File As             | CSV or Text. Fixes unstructured text misread as a table.                     |
| Line breaks              | Apply all, or ignore quoted ones. Fixes split or merged records.             |
| Close & Apply            | Saves the steps and loads the data into the model.                           |

**The one habit to keep.** Read the type symbols across the top of the editor before you build anything, every single time. Every silent CSV problem shows up in that one row of symbols, and looking at it costs two seconds against an afternoon of a chart that will not add up. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The import problem I find most unsettling is the one with no error at all, where a column was added to a file months ago and every refresh since has quietly left it out. What has a successful-looking refresh hidden from you?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Microsoft. Power Query Text/CSV connector. Retrieved 8 August 2026 from learn.microsoft.com/power-query/connectors/text-csv. Cited for dialog options, type-detection behaviour and the columns=x refresh limitation, which are product details rather than research findings.

---

*The full version of this guide lives on my site: [How to Import a CSV into Power BI (And the Three Dropdowns Nobody Reads)](https://michaelnocito.github.io/analyst-prep-kit/guides/import-a-csv-into-power-bi/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
