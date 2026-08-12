By the end of this page you can find the invisible characters that are quietly breaking your totals, name exactly which character each one is, remove it with the function that actually removes it, and prove afterwards that the column is clean. It is about twenty-five minutes, and every result below came out of Excel on a deliberately dirty copy of a real sixteen-row table.

Here is what to do right now, on the text column your formulas depend on. Put `=LEN(A2)` beside it and fill it down. Then look for values whose length is one more than the characters you can count. That single column finds trailing spaces, leading spaces, non-breaking spaces and embedded line breaks in about ten seconds, before you have decided to fix anything.

The short version: a cell that looks right can still be the wrong string, and every text function you are about to use targets a different kind of wrongness. Measure first, then choose the function.

Two cells reading the same word and not being equal is the idea everything else rests on, so it gets the picture.

> _The original carries a diagram here. In words: Two spreadsheet cells sit side by side near the top of the picture. Both display the word North in identical type, and nothing distinguishes them. Below each cell the same value is shown again, magnified and broken into one small square box per character, the way a character viewer would show it. Under the left cell there are five boxes, holding N, o, r, t and h, and the label LEN 5 sits beneath them. Under the right cell there are six boxes: the same five letters, and then a sixth box which is empty and outlined in amber with a small centred dot to mark that something is there. The label LEN 6 sits beneath those. Between the two magnified strips is a large equals sign with a diagonal stroke through it, meaning the two values are not equal. The picture makes the point without words: the difference between the two cells exists only in the sixth box, and the sixth box is invisible at normal size._

**Every result on this page is real.** The sixteen-row orders table used across this set of guides, copied and then damaged on purpose in six specific ways, with every formula run in Excel and its output copied back.

## 1. What it costs: 865 missing from a regional total

Five of the sixteen orders belong to the North region and they add to 2,495. Two of those five rows arrived with a problem you cannot see: one has a trailing space after "North", and one ends in a non-breaking space, the character a web page or a Word document leaves behind when text is pasted through it.

Nothing on screen is different. Here is what the workbook says.
    
    
    North revenue, clean data                       2495
    North revenue, same data with two bad cells     1630
    Rows that are exactly "North" out of five          3
    Distinct regions, clean                            4
    Distinct regions, messy                            6

865 has left the total, which is 425 plus 440, the two affected orders. And the region count went from four to six, because "North " and "North" plus a non-breaking space are each their own region as far as Excel is concerned.

Say out loud which of those two symptoms you would notice first in a real workbook. The missing 865 is invisible; nothing says a total should have been bigger. The region count is the tell, and it is the reason the first thing to do with any new text column is count its distinct values and ask whether that number is the number you expected.

## 2. Find it before you fix it: LEN and CODE

Two formulas do the whole diagnosis, and neither of them changes anything.

`LEN` counts characters, so it turns an invisible problem into a number.
    
    
    =LEN(D8)      6      you can see five letters
    =LEN(D12)     6      you can see five letters

Both are one too long. That is enough to know something is wrong, and not enough to know what to do, because the two cells have different problems and need different fixes. `CODE` gives the identity of a character as a number, so pointing it at the last character names the culprit.
    
    
    =CODE(RIGHT(D8,1))      32     an ordinary space
    =CODE(RIGHT(D12,1))    160     a non-breaking space

32 is the space bar. 160 is the character produced by `&nbsp;` on a web page, and by Word when it is keeping two words on the same line. They look identical in every font. Only one of them is removed by the function everybody reaches for first.

Keep those two formulas as a habit rather than a rescue. `=LEN(A2)` filled down a column, and `=CODE(RIGHT(A2,1))` on the one row that is too long, is a thirty-second diagnosis that turns "the lookup is not working" into "there is a character 160 on row 12".

## 3. TRIM: what it removes, and what it squashes

Before the explanation: `TRIM` is described everywhere as removing spaces. Say what you think it does to `"Dana Reyes"`, with three spaces in the middle.
    
    
    =TRIM("Dana   Reyes")       Dana Reyes
    =LEN(TRIM("Dana   Reyes"))          10

It does two jobs, not one. It removes spaces from the start and end completely, and it squashes any run of spaces _inside_ the text down to a single space. Ten characters: nine letters and one space. That second behaviour is usually what you want and is occasionally not, so it is worth knowing rather than discovering.

On the trailing-space cell it works exactly as advertised.
    
    
    =LEN(D8)            6
    =LEN(TRIM(D8))      5

One character gone, and the value now matches every other "North" in the column. If your problem is ordinary spaces, this is the whole fix, and it is why `TRIM` around a lookup key is the standard first thing to try when [a lookup returns `#N/A` for a value you can see](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-index-match/).

## 4. The space TRIM will not remove

Before the explanation: the other bad cell ends in character 160. Predict what `TRIM` does to it.
    
    
    =LEN(D12)              6
    =LEN(TRIM(D12))        6
    =LEN(CLEAN(D12))       6

Nothing. Neither function touches it. `TRIM` removes character 32 and only character 32, and `CLEAN` removes the control characters numbered 0 to 31, which does not include 160 either. This is the single most common reason somebody says "I already trimmed it and it still does not match".

The fix is to convert the character into an ordinary space first, and then trim.
    
    
    =TRIM(SUBSTITUTE(D12, CHAR(160), " "))
    
    =LEN(  that  )                          5
    =  that  = "North"                   TRUE

`SUBSTITUTE` takes the text, the thing to find and the thing to put in its place, and replaces every occurrence. Nesting it inside `TRIM` gives one formula that handles both kinds of space at once, which is the version worth keeping.

Make that your default cleaning formula for any text column arriving from outside your workbook:
    
    
    =TRIM(SUBSTITUTE(A2, CHAR(160), " "))

It costs nothing on data that was already clean and saves the afternoon on data that was not.

## 5. CLEAN, and the two words it welds together

`CLEAN` removes non-printing control characters, the commonest of which by far is the line break somebody pressed Alt+Enter to make, or that arrived inside a field exported from another system.

One of the rep names in the dirty copy has a line break inside it, so the cell shows the name across two lines. Here is what happens.
    
    
    =LEN(C10)                    9
    =LEN(CLEAN(C10))             8
    =CLEAN(C10) = "OwenPark"  TRUE

Read that last line twice. `CLEAN` deleted the line break rather than replacing it, so "Owen" and "Park" are now welded into one word with no space. The cell no longer looks broken, which is worse than looking broken, because the name is now wrong in a way that survives every subsequent check.

A line break is a separator, so it should become a space, not nothing.
    
    
    =TRIM(SUBSTITUTE(C10, CHAR(10), " "))       Owen Park

Character 10 is the line feed, and character 13 is the carriage return; text from older systems can carry either or both. If you are cleaning a column that might hold multi-line notes, substitute both, and only reach for `CLEAN` when you genuinely want the character gone rather than replaced.

## 6. PROPER, UPPER and LOWER, and the names PROPER gets wrong

Case is the other way two identical values become two different ones. `UPPER` and `LOWER` are exactly what they sound like and have no surprises in them. `PROPER` capitalises the first letter of every word, and it has several.
    
    
    =PROPER("owen park")      Owen Park       right
    =PROPER("o'brien")        O'Brien         right
    =PROPER("mcdonald")       Mcdonald        wrong
    =PROPER("IBM")            Ibm             wrong

It gets the apostrophe case right, which is genuinely useful. It cannot know that McDonald has a capital in the middle, and it will happily destroy an acronym that was already correct, because it applies one rule to every word it meets.

So the rule for names and codes: never run `PROPER` over a column of real names and consider it cleaned. Use it on data you know is all one case and all ordinary words, check the output by eye, and keep the original column so the damage is reversible. For matching purposes you rarely need pretty capitals anyway; comparisons in Excel ignore case already, so `UPPER` on both sides is a safer way to force agreement than trying to make each value look nice.

Picture your own worst column for a second: customer names, supplier names, product codes typed by four different people. How many of those entries would `PROPER` quietly damage, and would anybody notice before the mailing went out?

## 7. Numbers stored as text

The same problem in the numeric columns, with a different symptom. One of the sixteen orders has its Units value entered as text rather than as a number. Nothing shows except a small green triangle in the corner, which most people have learned to ignore.
    
    
    =SUM(clean Units)      101
    =SUM(messy Units)       95
    =COUNT(messy Units)     15
    =ISTEXT(that cell)    TRUE

`SUM` skips text, so the total is short by exactly the value it skipped, and `COUNT` says 15 where there are 16 rows. That COUNT is the cheapest detector there is: put `=COUNT(range)` next to any numeric column and compare it with the row count. A mismatch is text pretending to be a number.

Three ways to fix it, in order of how much you should like them. Best, fix the import so it never arrives as text, which for a CSV means declaring the column types in the import dialog rather than double-clicking the file; [the import dialog that deletes your zip codes](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) covers the same dialog from the opposite direction. Next best, convert in a new column with `=VALUE(A2)`, which returns a real number, or multiply by 1, which also works. Last resort, select the column, click the warning triangle and choose Convert to Number, which edits the data in place and leaves no record that it happened.

One warning about `VALUE`: it fails with `#VALUE!` on anything that is not a clean number, including a value with a stray space or a currency symbol. That failure is useful, because it points at the rows that need a human. Wrapping it to hide the failure would put you back where [hiding an error](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-iferror/) always puts you.

## 8. Clean in a new column, then prove it worked

Two working rules matter more than any of the functions.

**Never clean in place.** Put the cleaning formula in a new column beside the original, called `Region_clean` or similar, and point your analysis at that. Overwriting the raw column destroys the only evidence of what arrived, so when the numbers disagree with the source system next month there is nothing to compare against. It also makes the cleaning repeatable: next month's file drops in and the column recalculates.

**Prove it, do not assume it.** Cleaning is the one activity where the work and the check look identical, so people skip the check. Three formulas, run after every pass:
    
    
    =COUNTA(UNIQUE(Region_clean))     distinct values, is it the number you expect?
    =SUMPRODUCT(--(LEN(A2:A17)<>LEN(TRIM(A2:A17))))    rows still carrying stray spaces
    =COUNT(Units)  against  =COUNTA(Units)             numbers against everything

On the dirty copy, the distinct-region count went from 6 to 4 after cleaning, and the North total came back to 2,495. Those two numbers are the proof. Without them you have a column that looks cleaner, which is not the same claim.

When the values differ in ways no function can reconcile, "Acme Ltd" against "ACME Limited" against "Acme Co", you have crossed out of cleaning and into [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/), which is a different job with a different method.

## The full before and after

Same sixteen orders, same question: what did North sell?

### Before
    
    
    =SUMIFS(H2:H17, D2:D17, "North")        1630
    distinct regions                            6
    Units total                                95

Three numbers, all wrong, none of them flagged. The regional report is 865 short, there are two regions on the pivot that do not exist, and six units of stock have vanished from a total that still looks entirely reasonable.

### After
    
    
    # one new column per dirty column, originals untouched
    Region_clean  =TRIM(SUBSTITUTE(D2, CHAR(160), " "))
    Rep_clean     =TRIM(SUBSTITUTE(C2, CHAR(10),  " "))
    Units_num     =VALUE(F2)
    
    # the three checks, on the sheet, not in your head
    distinct regions   =COUNTA(UNIQUE(Region_clean))       4
    North revenue      =SUMIFS(H2:H17, Region_clean, "North")   2495
    Units              =COUNT(Units_num) equals row count      16

The claim, and it is the reason to do the LEN column before anything else: **two characters nobody could see moved a regional total by 865 and invented two regions, and one text-formatted cell removed six units from stock, on a sheet where every visible value was correct.**

## Edge cases that survive a cleaning pass

Six that get through the obvious fixes.

**A different invisible character.** 160 is the common one, but zero-width spaces and directional marks also travel through copy and paste. If `LEN` is still too long after substituting 160, use `=CODE(MID(A2,n,1))` to walk along and name whatever is actually sitting there.

**Apostrophes and quotes that are not the ones you typed.** A curly apostrophe and a straight one are different characters, so "O'Brien" from Word never matches "O'Brien" from your keyboard. Substitute one for the other before comparing.

**A leading apostrophe you cannot see.** Typing `'1001` makes Excel store text and hide the apostrophe. `LEN` does not count it and `ISTEXT` does report it, which is why the numeric check in section seven exists.

**Cleaning that changed the meaning.** `TRIM` collapsing internal runs is right for names and wrong for anything where the spacing carried information, like fixed-width codes. Check a sample against the source before applying it to a whole column.

**The formulas that are now pointing at the raw column.** Adding a clean column does nothing until everything downstream reads it. Search the workbook for the old column reference; a half-repointed workbook is worse than an unrepointed one, because the two halves disagree.

**Text that looks numeric in one place and not another.** A column can be half numbers and half text after a bad import, and the halves behave differently in every formula. Compare `COUNT` with `COUNTA` rather than reading the column, and never trust right-alignment as evidence, because a format can override it.

## Why this works

None of this is Excel being badly behaved. A cell holds a string of characters, and two strings are equal only if every character matches, which is the only definition a computer can use. The mismatch is between that definition and the human one, where "North" and "North " are obviously the same word. Every technique on this page is a way of forcing the two definitions to agree, and the reason the diagnosis comes first is that you cannot pick the right function until you know which character is present.

It also is not a small side task. Studies of how analysts actually spend their time have repeatedly found that discovering and repairing data problems takes a large share of the total effort, and that the hardest part is not applying a transformation but working out which transformation is needed; the Wrangler work built an interactive tool specifically around that gap between spotting a problem and specifying its fix (Kandel, Paepcke, Hellerstein, & Heer, 2011, _Proceedings of the SIGCHI Conference on Human Factors in Computing Systems_ , 3363–3372). The LEN column in section two is the low-tech version of the same idea: make the invisible problem visible before deciding anything.

The wider warning is that spreadsheets alter data without being asked, and the alterations persist. Ziemann and colleagues found that a substantial share of published genomics supplementary files contained gene names that Excel had silently converted into dates or numbers, in papers that had been peer reviewed, because nothing about the converted value announces itself as converted (Ziemann, Eren, & El-Osta, 2016, _Genome Biology_ , 17, 177). A number stored as text and a name stored as a date are the same class of problem as a trailing space: the display is fine and the value is not.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because attempting to retrieve something produces markedly better retention than studying it again, even when the second option feels more productive while you are doing it (Karpicke & Blunt, 2011, _Science_ , 331(6018), 772–775).

## Using this on your own project

Cleaning an entire inherited workbook is miserable and you will stop at the second column. Do this instead, in order.

  1. **Count the distinct values in every text column you group or filter by.** `=COUNTA(UNIQUE(range))`. Any count higher than you expected is where the work is.
  2. **Add a LEN column beside the worst one** and sort by it. The problems rise to the top in one click.
  3. **Name the character with CODE** before choosing a function. Thirty-two and one hundred and sixty need different fixes.
  4. **Clean into a new column** , always, with `=TRIM(SUBSTITUTE(A2,CHAR(160)," "))` as the default and additions only where you have evidence.
  5. **Compare COUNT with the row count** on every numeric column, to catch numbers stored as text.
  6. **Re-run the distinct count and the affected total** , and write both numbers down. That is the proof the pass worked, and it takes ten seconds.

If you have paper nearby, one optional sketch is worth five minutes. Draw one of your problem values as a row of boxes, one box per character, and put a dot in every box that holds a space. Most people discover while drawing that they do not know how many boxes there should be, and that uncertainty is exactly the thing the LEN column removes.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                 | What it does                                                            |
|-----------------------|-------------------------------------------------------------------------|
| `LEN(A2)`             | Counts characters. Turns an invisible problem into a number.            |
| `CODE(RIGHT(A2,1))`   | Names the last character. 32 is a space, 160 is a non-breaking space.   |
| `TRIM`                | Removes leading and trailing spaces, and squashes internal runs to one. |
| What TRIM misses      | Character 160. Length does not change.                                  |
| `CLEAN`               | Removes control characters 0 to 31. Also misses 160.                    |
| CLEAN on a line break | Deletes it rather than replacing it. Owen Park becomes OwenPark.        |
| The default fix       | `=TRIM(SUBSTITUTE(A2,CHAR(160)," "))`                                   |
| Line breaks           | `SUBSTITUTE(A2,CHAR(10)," ")`, and CHAR(13) if the file is older.       |
| `PROPER`              | Capitalises every word. Handles O'Brien, ruins McDonald and IBM.        |
| `UPPER` / `LOWER`     | Safe. Use for forcing two columns to agree.                             |
| Numbers as text       | `SUM` skips them silently. `COUNT` comes up short.                      |
| Fixing them           | `=VALUE(A2)` in a new column, or fix the import.                        |
| Distinct check        | `=COUNTA(UNIQUE(range))`. More than expected means near-duplicates.     |
| Stray-space check     | `=SUMPRODUCT(--(LEN(r)<>LEN(TRIM(r))))`                                 |
| Where to clean        | A new column. Never over the raw data.                                  |
| Beyond cleaning       | Values that need judgement to reconcile are entity resolution.          |

**The one habit to keep.** Count the distinct values of a text column before you use it, and compare that count with the number you expected. Four regions that come back as six is the cheapest, earliest signal you will ever get, and it costs one formula. If a column misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that cost me most was a supplier column where a single value had been pasted out of an email, so one supplier appeared twice in every report for a quarter and both entries looked identical on screen. What was hiding in your data, and what finally made you count the characters?

## References

  * Kandel, S., Paepcke, A., Hellerstein, J., & Heer, J. (2011). Wrangler: Interactive visual specification of data transformation scripts. _Proceedings of the SIGCHI Conference on Human Factors in Computing Systems_ , 3363–3372.
  * Ziemann, M., Eren, Y., & El-Osta, A. (2016). Gene name errors are widespread in the scientific literature. _Genome Biology_ , 17, 177.
  * Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. _Science_ , 331(6018), 772–775.

---

*Originally published on Analyst Prep Kit: [How to Clean Messy Data in Excel: TRIM, CLEAN and the Space You Cannot See](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
