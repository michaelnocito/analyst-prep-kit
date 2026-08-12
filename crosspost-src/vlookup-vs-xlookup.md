By the end of this page you can write both lookup formulas, read either one in someone else's workbook, and pick between them on purpose. You will know the three specific ways VLOOKUP returns a wrong value without showing an error, and which XLOOKUP argument removes each one. It is about twenty minutes.

Here is what to actually do with it. Open a workbook you use, find one VLOOKUP, and check its last argument. If the last argument is missing, that formula can return the wrong row's value today, silently, and section 3 shows you exactly how.

The short version: write XLOOKUP for anything new. Learn to read VLOOKUP anyway, because older workbooks, older Excel versions, and interviewers all still speak it.

The core difference is one picture. VLOOKUP counts its way to a column position. XLOOKUP points at two columns directly.

> _The original carries a diagram here. In words: Two versions of the same four-column table, side by side. On the left, labelled VLOOKUP, an arrow starts at the first column and hops across the column headers counting 1, 2, 3, landing on the third column. Below it, a new column has been inserted into the middle of the table, drawn in a warning colour. The same 1, 2, 3 count now lands on that new inserted column instead, marked with a cross, because the count is blind to what the columns contain. On the right, labelled XLOOKUP, two arrows point directly at named columns: one at the ID column being searched, one at the answer column being returned. The same inserted column appears below, but both arrows still point at the same two columns, marked with a check, because a pointed-at column keeps its identity when the table changes shape. The picture shows that a counted position breaks when the table changes and a direct reference does not._

**The worked example is small on purpose.** Ten employees, four columns, every result on this page computed and checked against this exact table. Here it is, sitting in cells A1 to D11, with EmpID in column A, Name in B, Department in C, and Salary in D.

| EmpID | Name        | Department | Salary |
|-------|-------------|------------|--------|
| 1001  | Aiden Cross | Finance    | 54,200 |
| 1002  | Bea Ortiz   | Marketing  | 58,900 |
| 1003  | Chen Wu     | Finance    | 61,500 |
| 1004  | Dana Reyes  | Operations | 49,800 |
| 1006  | Elif Kaya   | Marketing  | 63,100 |
| 1007  | Frank Osei  | Operations | 52,400 |
| 1008  | Gia Tran    | Finance    | 67,250 |
| 1009  | Hugo Lind   | IT         | 71,000 |
| 1010  | Ivy Nash    | IT         | 59,600 |
| 1012  | Jon Park    | Marketing  | 55,300 |

Notice two things about the ID column before we start. There is no 1005 and no 1011. Those gaps are not a typo. They are the trap in section 3.

## 1. What a lookup actually does

Before the explanation: you have an order sheet with employee IDs on it, and the table above on another sheet. What are the two separate things a formula has to do to put each employee's department next to their orders?

It has to find the row, then bring a value back. That is the whole job. A lookup takes a value you have, an ID like 1008, finds the row in another table where that value lives, and returns something else from that same row, like the department. Find the row, bring a value back. Every lookup formula ever written is those two moves.

This matters because the two moves fail differently. Finding the wrong row gives you a real-looking value from the wrong person. Bringing back the wrong column gives you a real-looking value of the wrong kind. Both look fine on the screen, which is why lookups are where quiet spreadsheet errors live.

If you know SQL, a lookup is a join with one hand. The Excel Kit's [lookup lessons](https://michaelnocito.github.io/analyst-prep-kit/excel/) and the [SQL joins guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) are the same idea in two dialects.

## 2. VLOOKUP, argument by argument

Before the explanation: VLOOKUP takes four arguments, and only one of them is a number you have to count by hand. Which argument would you guess causes the most breakage?

Here is the formula that fetches Gia Tran's department from the table above.
    
    
    =VLOOKUP(1008, A2:D11, 3, FALSE)

Read it left to right. **1008** is the value to find. **A2:D11** is the whole table to search, and VLOOKUP will only look for 1008 in the first column of that range. **3** means bring back the third column of the range, counting from the left, so column C, Department. **FALSE** means the match must be exact.

Run it and you get `Finance`. Change the 3 to a 4 and you get 67,250, the salary. Both of those are correct, and I checked them against the table by hand and by computer.

The counted argument, the 3, is the one that causes the most breakage, and the fourth argument is a close second because people leave it out. The next section shows both failures happening.

## 3. The three ways VLOOKUP goes silently wrong

Before the explanation: the word to hold onto is _silently_. An error message is annoying but honest. What would a lookup failure look like if it produced no error at all?

It would look like a normal answer. Here are the three ways VLOOKUP produces one.

### Failure 1: it counts columns, so inserting a column breaks it

The 3 in `=VLOOKUP(1008, A2:D11, 3, FALSE)` is not attached to the Department column. It is attached to the position three. Now a colleague inserts an Email column between Name and Department, which is a completely normal thing to do. Position three is now Email. The formula returns `gia@co.com` where a department used to be, with no error, and every formula pointing at that table shifts at once.

That one is at least visible, because an email address in a department column looks wrong. If the inserted column had held another department-shaped text, nothing would look wrong at all.

### Failure 2: the default is approximate match, so a missing ID returns the wrong row's value

This is the one that costs people real money. If you leave off the fourth argument, VLOOKUP defaults to approximate match. Approximate match means: if the exact value is not there, take the largest value that is still below it. Our table has no employee 1005. Watch what each version does.
    
    
    =VLOOKUP(1005, A2:D11, 3, FALSE)   → #N/A
    =VLOOKUP(1005, A2:D11, 3)          → Operations

The first one tells the truth: 1005 does not exist. The second one slides down to 1004, Dana Reyes, and hands you her department, `Operations`, as if it were the answer. Ask for column 4 instead and you get her salary, 49,800, attached to an employee who does not exist. No error, no warning, a clean confident wrong number. Ask for missing ID 1011 the same way and you get `IT`, from Ivy Nash's row.

Say in your own words why the approximate version returned Operations before reading on. If you can explain the slide down to 1004, you understand the failure well enough to spot it in a workbook.

Approximate match has a real job: banded lookups, like finding which tax bracket or commission tier a number falls into. For finding IDs, it is a wrong answer generator.

### Failure 3: it can only look right

VLOOKUP searches the first column of the range you give it, and returns columns to the right of it. If you have a name and want the ID, and the ID column sits to the left of the name column, VLOOKUP cannot do it. People work around this by rearranging their source data or by writing fragile helper columns, which means the tool's limitation is now reshaping the workbook.

## 4. XLOOKUP, and which failure each argument removes

Before the explanation: knowing the three failures, what would you change about VLOOKUP's arguments if you were allowed to redesign them?

Microsoft's redesign was XLOOKUP, and it reads like a list of fixes. Here is the same lookup.
    
    
    =XLOOKUP(1008, A2:A11, C2:C11)

Four arguments matter, and each one closes a hole.

**lookup_value** is the value to find, same as before: 1008.

**lookup_array** is the column to search in, named directly: A2:A11. Because you name the search column yourself, it can sit anywhere in the sheet, including to the right of the answer. `=XLOOKUP("Gia Tran", B2:B11, A2:A11)` looks left and returns 1008. That removes failure 3.

**return_array** is the column to bring back, also named directly: C2:C11. There is no counted position anywhere in the formula. Insert as many columns as you like and C2:C11 follows the Department column wherever Excel shifts it, because Excel updates references and never updates a typed number 3. That removes failure 1.

**if_not_found** is the fourth argument, and it is optional in the safe direction. First, XLOOKUP's default is exact match, so `=XLOOKUP(1005, A2:A11, C2:C11)` returns `#N/A` instead of sliding to Dana Reyes. The dangerous default is gone, which removes failure 2. Second, if you want something friendlier than #N/A, you say so in the formula itself:
    
    
    =XLOOKUP(1005, A2:A11, C2:C11, "Not found")   → Not found

With VLOOKUP you got that behaviour by wrapping the whole thing in another function, `=IFERROR(VLOOKUP(...), "Not found")`, which also swallows every other error the formula might raise, including the ones you needed to see. `if_not_found` catches exactly one condition, the missing value, and lets real errors through.

Picture running that on a lookup table you actually use: the ID column named, the answer column named, and the missing-value message written where the next reader can see it. That mental run is worth more than rereading this section.

## 5. The full before and after

Same table, same task: put each employee's department next to their ID, and say something sensible when the ID is not on file.

### Before
    
    
    =IFERROR(VLOOKUP(E2, A2:D11, 3, FALSE), "Not found")

This works today. It also carries three maintenance debts. The 3 breaks the day someone inserts a column. The FALSE has to be remembered every single time, because forgetting it does not error. And the IFERROR wrapper will happily hide a genuinely broken reference behind the words Not found.

### After
    
    
    =XLOOKUP(E2, A2:A11, C2:C11, "Not found")

Shorter, and every debt is gone. The search column and the return column are both named, the match is exact by default, and only a genuinely missing ID produces Not found. For E2 = 1008 both formulas return Finance. For E2 = 1005 both return Not found. The difference is what happens to each formula over the next year of edits.

## 6. Edge cases that break lookups in real workbooks

Before the explanation: a lookup returns #N/A for an ID you can see, right there, in the table. What is the first thing you would check?

Four cases that each cost someone an afternoon.

**The number is stored as text.** This is the answer to the prequestion, and it is the most common one. A cell showing 1008 might hold the text "1008", often flagged by a small green corner mark. The number 1008 and the text "1008" do not match each other, in either function. Fix the column once, with Data, Text to Columns, or multiply the IDs by 1, rather than patching every formula.

**Duplicate IDs return the first match only.** Both functions stop at the first hit, top down. If 1008 appears twice, you get the upper row's value and no warning that a second row exists. When duplicates are even possible, count them first. The [COUNTIFS guide](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sumifs/) shows the one-line check, and [finding duplicates in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-find-duplicates/) is the same audit in a database.

**Invisible spaces break the match.** "Gia Tran " with a trailing space is a different value from "Gia Tran". Data pasted from other systems carries these constantly. `TRIM` on the way in beats a mystery #N/A later.

**Old Excel does not have XLOOKUP.** XLOOKUP exists in Excel 2021, Excel 365, and current Excel on the web. A workbook opened in Excel 2019 or earlier shows `#NAME?` where every XLOOKUP was. If your file must travel to unknown versions, that is a real reason to write VLOOKUP, and it belongs in the fork below.

## 7. Which one to use: the fork, named

The question: for the lookup you are about to write, do you use XLOOKUP or VLOOKUP?

The possible answers, and what each would mean. **XLOOKUP** means the formula names both columns, matches exactly by default, handles missing values in its own fourth argument, and can look in any direction. **VLOOKUP** means the formula runs anywhere, including Excel 2019 and earlier, and is instantly readable to twenty-five years of spreadsheet users, at the price of the counted column, the risky default, and the rightward-only search.

What decides: where the workbook will live. If everyone opening it has Excel 2021, 365, or the web version, write XLOOKUP, every time, and this is my honest default. If the file must open in older Excel, or your team's standard is VLOOKUP and the workbook is full of it already, write VLOOKUP with FALSE typed in, always, and treat the FALSE as non-negotiable.

Why it matters: the cost of choosing wrong is not style points. Choosing XLOOKUP for an old-Excel audience means your sheet arrives broken with #NAME? in every cell. Choosing VLOOKUP without FALSE means the sheet arrives working and lies later. Between those two, the visible breakage is the cheaper mistake, but you do not have to make either one.

And regardless of what you write, you read both. Older workbooks are VLOOKUP all the way down, and interviewers still ask for it by name, partly to see whether you know why the FALSE is there. Being the person who can explain the missing fourth argument is worth more in that room than preferring the newer function.

## Why this works

The deep difference is reference by position against reference by name. A typed column number is a fact about the table's current shape, and the table's shape is the thing spreadsheets change most. A range reference like C2:C11 is a fact about identity, and Excel's own machinery keeps identity up to date when columns move. XLOOKUP is safer not because it is newer, but because every fragile positional fact in VLOOKUP became a named reference or an explicit choice. The same principle is why SQL analysts avoid `SELECT *` and why [defined metrics](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/) beat remembered ones: things named explicitly survive change, things counted implicitly do not.

This page also kept asking you questions before giving answers, and that is deliberate. Prompting a learner to explain a thing to themselves, before or while the explanation arrives, reliably improves understanding compared to just reading, across more than sixty studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). And practising retrieval, closing the page and producing the syntax yourself, builds retention that rereading does not (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). The cheat sheet at the bottom is built for exactly that use.

## Using this on your own workbook

Converting every VLOOKUP in a big workbook in one sitting is miserable, and halfway through you will stop trusting your own edits. Do this instead, in order.

  1. **Find the VLOOKUPs with no fourth argument first.** Ctrl+F for `VLOOKUP(` and read each one's ending. The ones missing FALSE are live approximate-match risks, and they are the only urgent ones.
  2. **Fix those by adding FALSE, not by rewriting.** Smallest possible change, easiest to verify, done in minutes.
  3. **Write XLOOKUP for everything new** from today, if your Excel has it. A brand-new formula costs nothing extra to get right.
  4. **Convert old formulas only when you touch them anyway.** A working VLOOKUP with FALSE in a stable table is not hurting anyone.
  5. **After any conversion, check one known row.** Pick an ID whose answer you know, like your own, and confirm the new formula returns it before moving on.

If you have paper and five minutes, one optional drawing locks the idea in. Draw a four-column table twice. On the first, draw VLOOKUP's counting hops, one, two, three, then insert a column and watch where the count lands. On the second, draw XLOOKUP's two arrows to named columns, insert the same column, and see that the arrows still hold. If your drawing shows why one breaks and one does not, you own this.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Tableau, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                      | The answer                                                                                                      |
|------------------------------|-----------------------------------------------------------------------------------------------------------------|
| What a lookup does           | Finds a row in another table by a value, brings one value back from that row.                                   |
| VLOOKUP syntax               | `=VLOOKUP(value, table, column_number, FALSE)`                                                                  |
| Failure 1                    | The column number is a counted position. Inserting a column silently shifts it.                                 |
| Failure 2                    | Omitting the fourth argument means approximate match. A missing ID returns the wrong row's value with no error. |
| Failure 3                    | VLOOKUP searches only the first column and returns only columns to its right.                                   |
| XLOOKUP syntax               | `=XLOOKUP(value, lookup_array, return_array, if_not_found)`                                                     |
| What removes failure 1       | `return_array`: a named range that Excel keeps pointed at the right column.                                     |
| What removes failure 2       | Exact match is XLOOKUP's default. No argument to forget.                                                        |
| What removes failure 3       | `lookup_array` is any column, so the answer can sit on either side.                                             |
| `if_not_found`               | Replaces the IFERROR wrapper, and catches only the missing value, not every error.                              |
| Approximate match's real job | Banded lookups: tax brackets, commission tiers. Never ID lookups.                                               |
| Duplicates                   | Both functions return the first match, top down, silently. Count first.                                         |
| #N/A on a visible value      | Check number-stored-as-text first, then trailing spaces.                                                        |
| #NAME? everywhere            | The file was opened in Excel 2019 or earlier, which has no XLOOKUP.                                             |
| The fork                     | Modern Excel audience: XLOOKUP. Unknown or old versions: VLOOKUP with FALSE, always typed.                      |

**The one habit to keep.** If you take nothing else from this page, never leave a lookup's match mode to chance. XLOOKUP by default, or VLOOKUP with FALSE typed in, and check one known row after every edit. The wrong lookup answer never looks wrong. It looks like a department name.

One last thought, and I would genuinely like other people's answers. My worst lookup bug was an approximate match that spent weeks assigning a departed employee's numbers to whoever sat above the gap. What is the longest a silent lookup error has lived in one of your workbooks before someone caught it, and what finally gave it away?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*Originally published on Analyst Prep Kit: [VLOOKUP vs XLOOKUP: Which One to Use, and How to Switch](https://michaelnocito.github.io/analyst-prep-kit/guides/vlookup-vs-xlookup/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
