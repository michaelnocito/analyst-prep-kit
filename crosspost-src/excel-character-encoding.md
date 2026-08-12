This article gives you the fix for a specific ugly sight: names importing as `Ã©`, `Ã¼` and rows of symbols where letters should be. The fix at import is one dropdown: **Data > From Text/CSV, set File Origin to 65001: Unicode (UTF-8)**. The rest of the page is what happened, how to spot it, and why it is worse than it looks.

It is worse than it looks because it is not a font problem. Those names are now wrong _in the data_. Search for the real title and you will not find it. Join on the name and the join fails. It is data loss that dresses up as a display glitch, which is why it ships.

**The short version.** A text file has to say which alphabet it is written in. The file was written in the modern universal one, UTF-8. Excel opened it assuming the old Western European one. Every character outside plain English got read as the wrong symbols.

This is the third door of the family from [article 4](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) and [article 6](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sum-of-id-trap/): Excel deciding what your data is and never mentioning it. In [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/) it was found late, in a finished dashboard: two of the top fifteen games displayed as garbage, and a count against the file put the damage at 4,685 of 82,956 names. Nothing had errored at any point.

## What happened, in plain terms

A text file on disk is just numbered codes, one per character. An alphabet, an encoding in the trade's word, is the codebook that says which number means which letter. The file does not carry its codebook visibly. The program opening the file has to know, or guess.

The build's CSV was written in UTF-8, today's standard, which covers every language by spending two or more codes on any letter beyond plain English. Excel's legacy open path guessed the old Western European codebook instead, which reads one code per character, always. So every two-code letter was read as two separate wrong characters. An é, stored as two codes, came out as `Ã©`.

Predict what that does to a Romanian game title with four accented letters. Four two-code letters, eight wrong characters, and the title reads as gibberish. That is exactly the "Aventura Copilului Albastru" row that flagged the problem in the build's top fifteen.

## How to spot it: the three-character signature

The corruption has a fingerprint, because the wrong codebook maps UTF-8's lead codes to a small set of characters. Three sequences do most of the appearing:

| You see                                          | It was probably                                 |
|--------------------------------------------------|-------------------------------------------------|
| `Ã` followed by a symbol: `Ã©`, `Ã¼`, `Ã±`, `Ã€` | An accented Latin letter: é, ü, ñ, À            |
| `Â` before punctuation or spaces                 | A non-breaking space or symbol                  |
| `â€` plus one more: `â€™`, `â€œ`, `â€"`          | Curly quotes and dashes from any word processor |
| Strings of `È`, `Ä`, `Å` pairs                   | Eastern European, Turkish, Nordic letters       |

Every mapping in that table was re-run through the actual conversion before publishing: é read under the wrong codebook really does come out `Ã©`. Say the search you would run to sweep a file for this. Ctrl+F for `Ã` is the whole audit, and it takes ten seconds.

## Why it is data loss, not a display glitch

A font problem would mean the stored value is right and the pixels are wrong. This is the reverse: the pixels faithfully show a stored value that is now wrong. Consequences, in the order they usually bite:

**Search fails.** The user searches the real title. The cell holds the mangled one. No match, and no hint why.

**Joins fail.** A lookup against a clean source list matches on the name. 4,685 rows no longer match anything, and per [article 2's](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/) theme, a failed match does not error. The rows just drop or blank.

**Grouping splits.** The same publisher spelled cleanly in one file and mangled in another becomes two publishers, which is [the entity-resolution problem](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/) manufactured out of nothing.

The one mercy: the corruption is mechanical, so it is reversible if you still have the original file, and often even from the mangled text, because the wrong reading was consistent. Which leads to the two fixes.

## The fix at import

  1. **Data > From Text/CSV**, the same door as [article 4](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/), and never a double-click.
  2. **In the preview, top-left: File Origin.** Set it to **65001: Unicode (UTF-8)**.
  3. **Look at a row you know has accents** before loading. The preview is the test: names read as names, done.

One import, two dropdowns, both traps from this family closed: File Origin for the alphabet, column type Text for the identifiers. That pairing is the whole defensive import, and it costs under a minute.

## The fix after the fact

The build's dashboard was already assembled when the damage surfaced, so re-importing everything was the expensive path. What it did instead, and what works in general:

  1. **Go back to the raw CSV** , which existed because raw files never get overwritten. Re-read just the damaged column under the right encoding.
  2. **Export that clean column with a byte order mark** , a short invisible marker at the front of a file that tells Excel which alphabet follows, so the paste-source opens correctly on any machine.
  3. **Paste it over the mangled column, refresh the pivots.** Names heal, joins come back, and the checks confirm the row count never moved.

If the raw file is gone, recovery is still often possible by reversing the wrong reading, but that is a rescue job, not a workflow. The workflow is the dropdown at import.

## Why it hits names hardest

Notice which columns this family of failure lands on. Numbers survive encoding trouble, because digits sit in the plain-English range every codebook agrees on. The damage concentrates in **names** : people, places, products, titles. The columns you join on, search by, and put in front of readers.

6% of a column sounds survivable until it is 6% of your customer names in a join key. And the affected rows are not random: they are systematically the non-English ones, so any analysis touching international data quietly loses exactly that slice. A dashboard built on it would undercount a specific population and look completely fine, which by now you will recognize as this series' recurring villain: the error that returns confident numbers.

## Run it on your own file

  1. **Ctrl+F for`Ã`** in any imported dataset with names in it. Ten seconds.
  2. **Hits: find the raw file and re-import it properly.** File Origin 65001, column types set, per this page and article 4.
  3. **No raw file: assess before rescuing.** How many rows, which analyses touch the column, whether the join keys are affected.
  4. **Add the canary check.** Keep one known-accented value in a check cell: `=COUNTIF(Games[Name],"*é*")` or simply eyeball a pinned row you know has accents. If the canary reads clean, the column probably does.
  5. **Fix the pipeline, not just the file.** If an export lands on your desk weekly, the File Origin setting is part of the import routine now, or this article reruns weekly too.

## A cheat sheet

| Situation                        | Do                                                  | Watch for                                                |
|----------------------------------|-----------------------------------------------------|----------------------------------------------------------|
| Any CSV with names in it         | Data > From Text/CSV, File Origin 65001             | Check an accented row in the preview before loading      |
| Sweeping a file for damage       | Ctrl+F for `Ã`, then `â€`                           | Hits mean the stored values are wrong, not the font      |
| Damage found, raw file exists    | Re-import the column correctly, paste over, refresh | Export the clean column with a byte order mark           |
| Damage found, no raw file        | Reverse the misreading, as a rescue                 | Verify against any external source you can find          |
| Joins mysteriously dropping rows | Check the join key for the signature                | The dropped rows are systematically the non-English ones |
| Recurring exports                | Put File Origin in the routine                      | A fixed file with a broken pipeline is a one-week fix    |

**The one habit to keep.** Every import of text data gets two settings at the door: File Origin 65001 for the alphabet, Text type for the identifiers. The family of silent converters has three doors, and this closes the last one.

Run the ten-second audit right now on the biggest imported file you have open this week. What did Ctrl+F `Ã` come back with?

---

*Originally published on Analyst Prep Kit: [The Names Came In as Gibberish and Excel Said Nothing](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-character-encoding/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
