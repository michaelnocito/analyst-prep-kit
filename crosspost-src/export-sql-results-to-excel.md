By the end of this page you will export a query result and open it with the leading zeros, the accented characters and the dates all still correct. Here is the thing worth knowing before anything else: **your export is almost certainly fine.** The damage happens when you open it, and the difference between a wrecked file and a clean one is which of two ways you opened the same file.

Here is what to actually do today. Stop double-clicking exported CSVs. Open Excel first, then use **Data, Get Data, From Text/CSV** , and open the file from there. That one change prevents most of what follows.

The short version: export as CSV, open it through the import route rather than by double-click, and add a byte order mark if accented characters matter.

The same file having two different fates is the one idea worth the page, so it gets the picture.

> _The original carries a diagram here. In words: A single file icon on the left, with two arrows leaving it and ending in two separate spreadsheet grids on the right. The upper grid's first cell is drawn with a crossed-out block and its second cell contains a jumbled cluster of marks, showing values that arrived damaged. The lower grid's matching cells are drawn cleanly and intact. The file icon itself is identical for both paths and is drawn with a tick beside it, marking the file as correct in both cases._

**Every byte on this page is real.** The exports were run on 8 August 2026 with SQLite 3.51.1 and the files inspected byte by byte, rather than described from memory. The same behaviour applies to exports from other database tools, because the cause is the file format rather than the tool.

## 1. Export the result

Before the explanation: a CSV is plain text with commas in it. What can such a file say about whether `01234` is a number or a code?

In a graphical tool like DB Browser for SQLite, run your query and use the export button above the results, or File then Export, then Table(s) as CSV. In pgAdmin or SQL Server Management Studio the equivalent is a Save Results As or Export option on the results grid.

From the command line, three lines do it:
    
    
    sqlite3 mydata.db
    .mode csv
    .headers on
    .once results.csv
    SELECT * FROM invoices;

`.mode csv` sets the output format, `.headers on` keeps the column names, and `.once` sends only the next command's output to that file. There are other modes worth knowing about: `markdown` for pasting into documentation, `json` for feeding another program, and `insert` for generating SQL statements that rebuild the rows elsewhere.

As for the opening question, the answer is nothing. A CSV carries no type information at all, which is the root of everything below.

## 2. Proof that the file is fine

I exported a row containing the four things that usually break: a code with leading zeros, an accented word, a decimal, and a date. Then I looked at the actual bytes on disk.
    
    
    postcode,name,amount,d
    01234,"Café",5.1,2026-03-04

The zeros are there. `01234`, all five characters. The accent is there too, stored as the two bytes UTF-8 uses for `é`. The date is there in an unambiguous year-month-day form. Nothing has been lost by the export.

One thing did change, and it is worth naming because it is the export's doing rather than Excel's: I asked for `5.10` and the file says `5.1`. Trailing zeros are display formatting, not part of a number's value, so they do not survive being written out. If two decimal places matter in the output, format the column to text in the query rather than expecting the file to remember.

## 3. The two ways of opening it

Double-click that file and Excel opens it immediately, with no questions. That convenience is the problem, because opening it silently requires Excel to decide what every column means, and it decides badly in two specific ways.

`01234` looks numeric, so it becomes the number 1234 and the zeros are gone for good. The accented word arrives as `CafÃ©`, because Excel assumed a different character set than the one the file used.

Now open the same file the other way. In Excel, go to **Data** , then **Get Data** , then **From Text/CSV** , and choose the file. A preview appears with dropdowns, exactly the ones described in [importing a CSV into Power BI](https://michaelnocito.github.io/analyst-prep-kit/guides/import-a-csv-into-power-bi/), because it is the same underlying tool. Set File Origin to a UTF-8 option, choose **Transform Data** , set the postcode column's type to Text, and load.

Same file, both times. The second route asks you the questions the first route answers on your behalf, and that is the entire difference. [The leading zeros fix](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) covers this in more detail, and [character encoding](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-character-encoding/) explains the `Ã©`.

## 4. The one-flag fix for accents

If people will keep double-clicking your file, and they will, you can make the encoding problem go away at the export end.

A **byte order mark** is three invisible bytes at the very start of a file that announce "this is UTF-8". Excel reads them and gets the character set right without asking. Most database exports do not include one, which is why the accents break.

In sqlite3, adding it is one flag:
    
    
    .once --bom results.csv
    SELECT * FROM invoices;

Say what that does and does not fix, before reading on. It fixes the accents, because the file now states its own encoding. It does not fix the leading zeros, because no byte order mark can tell Excel that a column of digits is really a code. The zeros need either the import route or a change in the query.

There is a related trick in the same tool: `.excel` sends the next result straight into your spreadsheet application, and it takes `--bom` too. Handy for a quick look, less good as a repeatable step.

## 5. When you actually need a real .xlsx

Renaming a CSV to `.xlsx` does not make it a workbook, and Excel will complain when it opens. If you genuinely need a real workbook, with types preserved and no import dance, generate one.
    
    
    import sqlite3
    import pandas as pd
    
    con = sqlite3.connect('mydata.db')
    df = pd.read_sql("SELECT * FROM invoices", con)
    df.to_excel('results.xlsx', index=False)

That needs `openpyxl` installed alongside pandas. The advantage is real: an xlsx stores each cell's type, so a text column stays text, the zeros survive, and the accents are never in question. The recipient double-clicks it and everything is correct.

`index=False` matters more than it looks. Without it you get an extra unnamed first column containing row numbers, which then confuses whoever receives the file into thinking it is an identifier.

Choose CSV when the file feeds another program, and xlsx when a person is going to open it. That is the whole rule, and it usually decides itself once you ask who is on the other end.

## 6. The checks to run every time

Four checks, under a minute, and they catch nearly everything.

  1. **Row count.** Compare the rows in the file against the rows the query returned. A silent truncation looks exactly like a successful export.
  2. **Both ends of every code column.** Sort by it and look at the first and last values. Missing leading zeros show up immediately.
  3. **One accented or non-English value.** If your data has any, find one and look at it. That single cell tells you the encoding survived.
  4. **One date.** Check it against a date you know. Day and month swapping is the single most common silent corruption in a shared file.

Now picture the last export you sent somebody. Which of those four did you check before pressing send? For most of us the honest answer is none, which is fine right up until the file goes to a client.

## The full before and after

Same query, same recipient.

### Before
    
    
    Run query → Export CSV → double-click to check → looks fine → email it
    Recipient: "the postcodes are wrong and the names have symbols in them"

The trap is that checking by double-click uses the same broken route as the recipient, so the file looks fine to you in exactly the way it will look broken to them. Worse, if you now save from that window, the damage is written into the file for real.

### After
    
    
    Run query → Export CSV with --bom
    Open via Data → Get Data → From Text/CSV, set the code column to Text
    Check: row count, both ends of the code column, one accent, one date
    Person on the other end? Send .xlsx instead. Program? Send the CSV.

The byte order mark protects the recipient who double-clicks, the import route protects you while checking, and the four checks catch the rest. Choosing xlsx for a human removes the question entirely.

## What goes wrong, and the fix

Six worth knowing.

**Leading zeros gone.** Excel read a code as a number. Import route with the column set to Text, or send xlsx.

**`Ã©` where `é` should be.** Encoding. Export with `--bom`, or set File Origin to UTF-8 on import.

**A long number became`1.23457E+14`.** Scientific notation. Anything over 15 digits also loses its last digits permanently, which matters for card numbers and long identifiers. Set the column to Text on import, and never let the file be saved from that state.

**Dates out by a month.** Day and month swapped by locale. Export dates as `YYYY-MM-DD`, which cannot be misread, and set the type explicitly on import.

**Rows split across lines.** A text field contains a line break. Proper quoting handles it, but check that whatever reads the file honours quoted line breaks.

**Too many rows for Excel.** A worksheet stops at 1,048,576 rows. If you are near that, the answer is to summarise in the query rather than to export more, and [handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/) covers the rest.

## Why a CSV cannot protect itself

Every problem on this page comes from one fact: a CSV stores values, not types. The characters `01234` sit in the file exactly as written, and nothing anywhere in the format says whether they are a number that happens to start with a zero or a code where the zero is meaningful. So the program opening it has to guess, and any guess will be wrong for somebody.

Encoding has the same shape. A file is a sequence of bytes, and which letters those bytes represent depends on a character set that the file usually does not name. The byte order mark exists precisely to let a file name its own encoding, which is why adding it fixes the accents and cannot possibly fix the zeros. One is a fact the file can state about itself; the other is a fact nobody recorded.

Seen that way, the import route is not a workaround. It is the format working as designed, with the person who knows the answer supplying it, instead of a program guessing on their behalf.

One note on the way this page is written. It kept asking you to commit to an answer, what a CSV can say about a code, what a byte order mark does not fix, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own exports

Five habits, in order.

  1. **Never double-click an exported CSV.** Not even to check it. Checking through the broken route is worse than not checking.
  2. **Export with a byte order mark** when anyone else will open the file.
  3. **Send xlsx to people and CSV to programs.** The question answers itself once you ask who opens it.
  4. **Format dates as`YYYY-MM-DD` in the query.** It is the one form no locale can misread.
  5. **Run the four checks before sending.** Row count, both ends of a code column, one accent, one date.

If you have paper nearby, one optional drawing is worth two minutes. List your export's columns and mark each one as a number, a date, or a code that merely looks like a number. Every column in that third group is a column that will break, and knowing which they are before you send the file is the whole job.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                       | What it is, or what it does                                             |
|-----------------------------|-------------------------------------------------------------------------|
| The core fact               | A CSV stores values, not types. Everything else follows.                |
| Where damage happens        | On opening, not on exporting. The file is usually correct.              |
| Double-click                | Excel guesses silently. Zeros stripped, accents mangled.                |
| The import route            | Data → Get Data → From Text/CSV. It asks instead of guessing.           |
| `.mode csv` / `.headers on` | sqlite3: set the format, keep the column names.                         |
| `.once file.csv`            | Send only the next result to that file.                                 |
| Other modes                 | markdown, json, insert, box, html, line.                                |
| Byte order mark             | Three bytes saying "this is UTF-8". `.once --bom`.                      |
| What the BOM fixes          | Accents. Not leading zeros: no format can say a digit string is a code. |
| Trailing zeros              | 5.10 exports as 5.1. Formatting is not part of a number's value.        |
| Real xlsx                   | `df.to_excel('f.xlsx', index=False)`, needs openpyxl. Types preserved.  |
| `index=False`               | Stops an unnamed row-number column appearing.                           |
| CSV or xlsx                 | Program gets CSV. Person gets xlsx.                                     |
| 15 digits                   | Excel loses digits past that permanently. Set the column to Text.       |
| Date format                 | `YYYY-MM-DD`. No locale can misread it.                                 |
| Excel row ceiling           | 1,048,576. Summarise in the query instead.                              |
| The four checks             | Row count, both ends of a code column, one accent, one date.            |

**The one habit to keep.** Never open an exported CSV by double-clicking it, including when you are only checking. That single rule removes the two most common silent corruptions and stops you from confirming a file is fine using the exact route that breaks it. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The version of this that stings is opening a file to check it, seeing the damage, and realising you have just saved over the good copy. What has an export quietly changed on you, and who found it first?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [How to Export SQL Results to CSV and Excel (Without Wrecking the Data)](https://michaelnocito.github.io/analyst-prep-kit/guides/export-sql-results-to-excel/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
