This article gives you the import habit that stops Excel from rewriting your data before you have even seen it: bring CSV files in through **Data > From Text/CSV**, and set identifier columns to Text. Ten seconds, and it closes off three separate kinds of silent damage.

The damage is real and specific. 08053 becomes 8053, which is no longer a New Jersey zip code. A sixteen-digit card number becomes 9.78E+15, which is no longer a number at all. And a value like SEPT1 becomes the first of September. None of these shows an error. All of them are data loss.

**The short version.** Excel guesses what your data is during import, and it guesses wrong for anything that looks numeric but is really a label. Import through Data > From Text/CSV and declare identifier columns as Text.

## What Excel does to a CSV behind your back

Predict this before the explanation: a CSV file contains the five characters 08053. You double-click the file and it opens in Excel. What is in the cell?

A CSV is plain text. It contains characters, not types. Something has to decide whether 08053 is a number or a piece of text, and when you open a CSV by double-clicking it, or through File > Open, Excel decides alone, column by column, without asking you.

Its rule is simple: if a value parses as a number, it becomes a number. 08053 parses as 8053, so the zero is gone the moment the file opens. Not hidden. Gone. The cell holds the number 8053, and saving the file writes 8053 back over the original.

That is the trap's real shape: the destructive step is the most natural action in the world, double-clicking the file.

## The three casualties

| What the file said  | What Excel made of it | What was lost                                                                                           |
|---------------------|-----------------------|---------------------------------------------------------------------------------------------------------|
| 08053, 02134, 00501 | 8053, 2134, 501       | Leading zeros. These are no longer valid zip codes, and joins against a proper zip list fail            |
| 9784563217890123    | 9.78456E+15           | Precision. Excel keeps 15 digits, so the last digit becomes 0. The original number is unrecoverable     |
| SEPT1, MARCH1, DEC1 | 1-Sep, 1-Mar, 1-Dec   | The value itself. These were gene names, product codes, or building-room labels, and now they are dates |
| 3-2                 | 2-Mar                 | A size, a score, a version number, read as a date                                                       |

The third row is famous enough to have changed science. A 2016 survey of published genetics papers found roughly a fifth of them carried Excel-converted gene names in their supplementary data, SEPT2 turned into a date, identifiers turned into numbers (Ziemann, Eren & El-Osta, 2016, _Genome Biology_ , 17, 177). The damage was so widespread that the gene naming committee later renamed the genes. SEPT1 is now SEPTIN1 partly because of this dialog.

Say out loud which column in your own data is the vulnerable one. Zip code, account number, employee ID, SKU, phone number. Nearly every real dataset has at least one.

## Why it happens: number-shaped labels

The root of all three casualties is one distinction, and it is the same one that runs through this whole series: some columns are labels wearing a number's clothes.

A zip code is not a quantity. You will never add two zip codes, average them, or ask which is larger. It is a name written in digits. The same is true of account numbers, phone numbers, SKUs and IDs. The test, one line: **would adding two of these together mean anything?** If no, the column is text, whatever it looks like.

Excel cannot run that test, because meaning is not in the file. It sees digits and does the numeric thing. The fix is not to blame the tool. The fix is to be the one who answers the question, at the only moment the question is asked: import.

## The fix at import

  1. **Do not double-click the CSV.** Open a blank workbook instead.
  2. **Ribbon: Data > From Text/CSV.** Pick the file. A preview appears, with Excel's guessed type at the top of each column.
  3. **Click Transform Data.** This opens Power Query, which is just the room where the import decisions get made visibly.
  4. **Right-click the identifier column's header > Change Type > Text.** If a Change Column Type prompt appears, choose Replace current. Do this for every number-shaped label: zip, ID, phone, SKU.
  5. **Close & Load.** The data lands in the sheet as a Table, which is [step 1 of the build order](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-name-your-data/) done for you. Name it and carry on.

While you are in the preview there is one more setting worth glancing at: File Origin. If the file came from another system and names or accents look wrong, set it to 65001: Unicode (UTF-8). That is a different failure with the same shape, and it gets its own article later in this series.

The whole detour costs under a minute, and it is the only moment the choice exists. After import there is no dialog to reopen. There is only cleanup.

## When the damage is already done

You received an xlsx where the zips are already 8053. The zeros are not hiding behind the display. The stored value is the number. Two honest options:

**Re-import from the source CSV if you still have it.** This is the clean fix, and it is why you never overwrite the original file: keep the raw CSV, import into a copy. That habit belongs to the same family as [keeping your checks in the file](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/).

**Rebuild the zeros if the width is known.** US zips are five digits, so `=TEXT([@Zip],"00000")` produces a text value padded back to five characters. This works only because zip codes have a fixed width. A trimmed account number of unknown length cannot be rebuilt, and a card number that went through scientific notation is gone for good. Rebuilding is a patch. The import habit is the fix.

One warning for the other direction: typing an apostrophe before a value, like `'08053`, keeps a single manual entry as text. It does not scale to a column, and it does nothing at import time. Treat it as a spot tool, not a strategy.

## Why this works

The general lesson under the specific trap: silent type conversion is a class of error that survives careful people, because it happens before attention starts. Ziemann and colleagues' finding was not about careless labs. About one in five published, peer-reviewed, checked-by-editors papers carried the damage (Ziemann, Eren & El-Osta, 2016, _Genome Biology_ , 17, 177). The authors of those papers looked at their data plenty. The conversion just happened earlier than looking.

That is why the countermeasure is positional, not attentional. You cannot spot-check your way out, because a converted value looks clean. You put one habit at the single door every file walks through, and the class of error stops existing in your files.

## Run it on your own file

  1. **Find your most recent CSV.** Downloads folder, export from any system.
  2. **Import it twice.** Once by double-click, once through Data > From Text/CSV with identifier columns set to Text.
  3. **Compare the vulnerable column.** If the two disagree, you have been shipping converted data and today is a good day to have found out.
  4. **Keep the raw CSV read-only.** Imports go into copies. The original is evidence.
  5. **Add the check.** One cell: `=MIN(LEN([@Zip]))` on a zip column should say 5. The moment it says 4, a zero has gone missing somewhere upstream. That is [article 2's habit](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/) pointed at this article's trap.

## A cheat sheet

| Situation                                | Do                                                  | Watch for                                            |
|------------------------------------------|-----------------------------------------------------|------------------------------------------------------|
| Opening any CSV                          | Data > From Text/CSV, never double-click            | Double-click converts before you see anything        |
| Zip, ID, phone, SKU columns              | Transform Data, column type Text                    | The test: would adding two together mean anything?   |
| Accents or odd characters in the preview | File Origin: 65001 Unicode (UTF-8)                  | Same trap, different casualty. Covered in article 15 |
| Zeros already stripped, width known      | `=TEXT([@Zip],"00000")`                             | Only fixed-width values can be rebuilt               |
| Long numbers showing as 9.78E+15         | Recover from the source file                        | Excel kept 15 digits. The rest are zeros now         |
| Guarding the column forever              | A check cell: minimum LEN equals the expected width | Predict the value before you look, per article 2     |

**The one habit to keep.** CSVs come in through Data > From Text/CSV, and every number-shaped label is declared Text at the door. The moment of import is the only moment the choice exists.

## References

  * Ziemann, M., Eren, Y., & El-Osta, A. (2016). Gene name errors are widespread in the scientific literature. _Genome Biology_ , 17, 177.

Your prediction from the top: did you say 8053? And which of your own columns are you going to re-import first?

---

*Originally published on Analyst Prep Kit: [The Dialog That Quietly Deletes Your Zip Codes](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
