By the end of this page you can put a dropdown on a column in about a minute, keep its list somewhere that grows when the options grow, make a second dropdown depend on the first, write a rule that blocks a duplicate rather than a value, and find every entry that got past all of it. It is about twenty-five minutes, and the behaviour claims below were checked in Excel rather than repeated.

Here is what to do today. Put the list of allowed values in its own small table on a separate sheet, one value per row. Select the column you want to control, Data, Data Validation, Allow: List, and point Source at that list. Then do the thing most people skip: run Data, Data Validation, Circle Invalid Data on the column afterwards, because rules only govern what happens next, and your existing data was entered before the rule existed.

The short version: validation checks a value at the moment somebody types it into the cell. It is not a property of the data, it is a gate on one entry route, and there is more than one route in.

That gap is the idea the page rests on, so it gets the picture.

> _The original carries a diagram here. In words: A spreadsheet cell with a small dropdown arrow sits at the right of the picture. A tall vertical barrier stands in front of it, running most of the height of the image. Two routes approach the cell from the left. The upper route is labelled typed; its arrow reaches the barrier, meets a solid section of it, and turns back on itself, so nothing gets through. The lower route is labelled pasted; the section of barrier in its path is drawn as a broken dashed outline with a clear gap in it, and the arrow passes straight through the gap and continues into the cell. Beyond the gap, the fragments of the broken barrier are drawn drifting apart, showing that the pasted value did not merely get past the gate, it took the gate with it._

**The behaviour claims here were checked.** Rules were built in Excel and then inspected afterwards, so what is reported about pasting, about table columns as sources, and about which cells still carry a rule comes from reading the workbook rather than from memory.

## 1. Build the dropdown

Four steps, and the first one is the one people get wrong.

  1. **Put the allowed values somewhere real.** A column on a separate sheet, one value per row, with a heading. Not typed into the dialog.
  2. Select the cells that should be controlled. The data cells, not the header.
  3. **Data, Data Validation, Allow: List.**
  4. Click in Source, then select your list of values. Leave _In-cell dropdown_ ticked. OK.

You can type the options straight into the Source box separated by commas, and it works, and it is the version you will regret. A comma-separated list is invisible to anyone reading the sheet, cannot be sorted or counted, cannot be referred to by a formula, and has to be edited inside a dialog on every range that uses it. Thirty seconds spent putting the values in cells buys you all of that back.

## 2. Where the list should live, and the table trap

Before the explanation: your options live in a proper Excel table called `Products`. Say whether you can point Source at `=Products[Product]`.

You cannot. I tried it in Excel and the Source was rejected outright. The same reference wrapped in `INDIRECT` was accepted:
    
    
    Source:  =Products[Product]                    rejected
    Source:  =INDIRECT("Products[Product]")        accepted

That is worth knowing because [a table](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-tables/) is exactly where a list of options should live: it grows when somebody adds an option, and the dropdown grows with it. The `INDIRECT` wrapper is how you get both.

There are two other routes to the same place. You can define a name for the table column, Formulas, Define Name, set to `=Products[Product]`, and then use `=ThatName` as the Source, which some people find easier to read. Or, if you are not using a table, define a name over an ordinary range and remember that a fixed range does not grow, so new options will not appear until somebody edits the name.

Whichever you choose, keep the list on its own sheet rather than off to the right of the data. A list beside the data gets sorted, filtered, cut and pasted along with everything else, and a dropdown whose source has been re-sorted underneath it is a strange thing to debug.

## 3. The three alert styles, and the two that are not rules

The Error Alert tab has a Style dropdown with three options, and the choice matters more than anything else in the dialog.

| Style           | What it does                                                             | Use it when                                                                        |
|-----------------|--------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| **Stop**        |  Refuses the value. The only one that actually enforces anything.        | The value must be from the list. This is the default and usually the right answer. |
| **Warning**     |  Asks whether to continue, and accepts the value if the person says yes. | The list is a strong suggestion and exceptions are legitimate.                     |
| **Information** |  Shows a message and accepts the value either way.                       | You are informing, not restricting. Rarely what people mean.                       |

Warning and Information are worth naming clearly: they are not rules. They are notices. If your column is set to Warning and you are relying on it to keep the data clean, you have a note where you thought you had a gate, and the difference only shows up when you count the distinct values later.

While you are in the dialog, fill in the Input Message tab too. It shows a small tooltip when the cell is selected, before anything has gone wrong, and one sentence there prevents more bad entries than any error message does afterwards.

## 4. What validation does not stop

Before the explanation: a column has a Stop-style dropdown on it. Somebody copies a cell from an email and pastes it in. Say what happens.

The value lands, no message appears, and the validation rule is gone from that cell. Not bypassed for one entry; gone. I set up three validated cells, pasted into two of them different ways, and then asked Excel which cells still carried a rule:
    
    
    before                                all three validated
    after an ordinary paste (Ctrl+V)      that cell no longer has a rule
    after Paste Special, Values only      that cell still has its rule
    cells still carrying a rule           2 of 3

The reason is not a bug. An ordinary paste copies everything about the source cell, formatting, number format and validation included, and the source cell had no validation, so it now has none. Your rule was overwritten by the absence of a rule.

Paste Special with Values only keeps the rule in place, which is better, and it still does not check the pasted value, so an invalid entry can sit in a cell that is correctly configured to forbid it. Validation runs at typing time and only at typing time.

Three practical consequences.

**A rule protects nothing retroactively.** Values entered before the rule existed stay exactly as they are, and adding validation to a column of existing data flags nothing.

**Tell people to paste values.** Ctrl+Alt+V then V. On a shared workbook this is worth writing in the sheet itself, next to the input area, because everyone pastes and nobody reads instructions elsewhere.

**Protect the sheet if it genuinely matters.** Review, Protect Sheet, with the input cells unlocked, stops the paste from replacing formatting and validation. It is heavier than most sheets need, and it is the only version that actually holds.

## 5. Dependent dropdowns

The common request: pick a category in one cell, and the second cell offers only the products in that category.

The mechanism is one function. Make a named range for each group, named exactly like the value that selects it, then point the second dropdown at `INDIRECT` of the first cell.
    
    
    Named range  Furniture   ->  Desk, Chair
    Named range  Lighting    ->  Lamp
    
    A2 validation:  List, Source =Categories
    B2 validation:  List, Source =INDIRECT($A2)

`INDIRECT` turns text into a reference, so when A2 holds "Furniture", the second dropdown's source becomes the range named Furniture. It reads like magic and it is just a name lookup.

Two things to know before you build it. Names cannot contain spaces, so a category called "Office Furniture" needs its name to be `Office_Furniture`, and the formula becomes `=INDIRECT(SUBSTITUTE($A2," ","_"))`. And nothing clears B2 when A2 changes, so a row can end up holding a category and a product from a different category. If that matters, add a conditional format that flags the mismatch, using the same locked-column trick as [whole-row highlighting](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-conditional-formatting/).

## 6. Custom rules: a formula instead of a list

Allow: Custom takes a formula that must return TRUE for the entry to be accepted. It is written for the top-left cell of the selection and copied down, exactly like a conditional formatting rule, so the same locking logic applies.

Four that earn their keep.
    
    
    =COUNTIF($A$2:$A$500, A2)=1        no duplicates in this column
    =AND(A2>=TODAY(), A2<=TODAY()+90)  a date within the next quarter
    =ISNUMBER(A2)                       a number, not text that looks like one
    =LEN(A2)=8                          exactly eight characters, for a code

The no-duplicates rule is the one worth adopting widely, because it converts a problem you would otherwise find later into one that cannot happen. It is the preventive twin of [de-duplicating after the fact](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-remove-duplicates/), and it costs nothing at entry time while the after-the-fact version costs you a decision about which row to delete.

One limitation to plan around: a custom rule is checked when the cell is edited, so a value that becomes invalid later, because another cell changed, is not re-checked and not flagged. Validation is a gate, not a monitor.

## 7. Finding what got in anyway

Given everything above, a validated column will still contain values that break its rule: entries made before the rule existed, pasted values, and anything that arrived from an import.

Excel has a button for exactly this. **Data, Data Validation, Circle Invalid Data** draws a red ring around every cell whose current value breaks its own rule. It is the only feature in the whole area that looks backwards rather than forwards, and almost nobody uses it. Clear Validation Circles removes the rings.

Two caveats worth having. The circles are drawn objects rather than a saved property, so they vanish when the file is saved and reopened. And a cell whose rule was removed by a paste has no rule left to break, so it will not be circled, which is the exact case you most want to find.

That is why the belt-and-braces check is a formula rather than a button. One column, one formula, and the answer is a number you can put on the sheet:
    
    
    =SUMPRODUCT(--(COUNTIF(AllowedList, A2:A500)=0))    entries not in the list
    =COUNTA(UNIQUE(A2:A500))                            distinct values, expected 4

Picture your own most-shared input sheet for a moment. If somebody had pasted a whole column into it last month, is there anything on that sheet that would tell you?

## 8. The two checkboxes that surprise people

**Ignore blank** , which is ticked by default, means an empty cell is always allowed. That is usually right, and it means validation can never make a field mandatory. If a value is required, you need a separate check that counts the blanks, because the dropdown will never ask for one.

There is a second, less obvious effect: with Ignore blank ticked, a rule that points at a cell which happens to be empty is also treated as satisfied. A custom rule referencing a blank helper cell will silently accept everything.

**Apply these changes to all other cells with the same settings** , on the Settings tab, is the one that saves an afternoon. Tick it before pressing OK and your edit propagates to every cell that shared the old rule. Leave it unticked and you have just created a second rule covering one cell, which is the same fragmentation problem that conditional formatting has, with the same symptom: a column where most cells behave one way and a few behave another, for no reason anybody can find.

## The full before and after

Same input sheet, same job: a Region column that only ever contains four values.

### Before
    
    
    Source:  North,South,East,West     typed into the dialog
    Style:   Warning
    Nothing else

The options exist only inside a dialog, so nobody can see them, count them or add to them. Warning style means anyone who says yes gets their value in. Nothing checks what was already in the column. And the first person to paste a block of data removes the rule from every cell they pasted over.

### After
    
    
    # the list lives in a table on a Lists sheet
    Source:  =INDIRECT("RegionList[Region]")
    Style:   Stop
    Input message: "Pick one of the four regions. Paste values only, Ctrl+Alt+V then V."
    
    # the check block, on the sheet, always visible
    distinct values   =COUNTA(UNIQUE(Region))                        4
    off-list entries  =SUMPRODUCT(--(COUNTIF(RegionList[Region], Region)=0))   0
    blanks            =COUNTBLANK(Region)                            0

The list is visible and grows on its own. The gate is a gate. The instruction that actually prevents the failure is written where the failure happens. And three formulas turn "we have validation" into "there are four distinct values, none of them off-list, and no blanks", which is a claim rather than a hope.

The claim underneath, and it is why the check block exists: **one ordinary Ctrl+V leaves the cell holding a forbidden value and holding no rule, and nothing anywhere in the workbook records that the gate is gone.**

## Edge cases that break validation quietly

Six that get past a first build.

**The source list has trailing spaces.** "North " in the list means the dropdown offers a value that will never match anything else in your workbook. Clean the list column before pointing anything at it; [the TRIM and LEN routine](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/) applies to option lists as much as to data.

**Dragging the fill handle.** Filling down from a validated cell carries the validation, which is fine, and filling down from an unvalidated one wipes it, which is the paste problem wearing a different hat.

**A source list on another sheet without a name.** Older Excel refused a direct cross-sheet reference in Source. Current versions accept it, but a named range is still the more portable choice and survives the sheet being renamed.

**Deleting a row of the source list.** Existing cells keep their old value even when it disappears from the list, so a column can contain a region that is no longer offered. Circle Invalid Data is what finds those.

**The dropdown that is too long to use.** Past about twenty options, people stop scrolling and start typing, and typing brings its own errors. If a list is long, split it into a dependent pair rather than making the single list longer.

**Validation on a merged cell.** The rule attaches to the top-left cell of the merge, and behaviour around the rest of the merged area is inconsistent. Merged cells cause enough problems elsewhere that this one is best solved by not merging.

## Why this works

The case for a dropdown is not tidiness, it is that recognising an option from a list is a different and much more reliable task than remembering and typing one. Free text asks every person for exact recall of a spelling and a convention; a list asks them to point at something. That difference is why a validated column has four distinct values and a free-text column has eleven, most of them variants of the same four.

It is also the right level to attack the problem. Work on human error consistently finds that the productive response to a recurring mistake is to change the conditions under which people work rather than to ask them to be more careful, because attention is not a resource that can be scheduled and blaming the individual leaves the situation exactly as error-prone as it was (Reason, 2000, _BMJ_ , 320(7237), 768–770). A dropdown is a small system change of that kind. So is putting the option list where somebody can see it, and so is writing the paste instruction on the sheet rather than in a training email.

The reason to check afterwards as well is that data entry into spreadsheets is not reliably accurate even under good conditions, and audits of operational workbooks find errors to be the normal case rather than the exception (Panko, 1998, _Journal of End User Computing_ , 10(2), 15–21). A gate that covers one entry route is worth having and is not the same as knowing what is in the column, which is what the count formulas are for.

One note on the questions asked before each answer on this page. Committing to a prediction before being shown the outcome measurably improves what you retain of it, which is why the paste result is worth guessing at rather than reading past (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own project

Adding validation to every column of an inherited workbook is miserable and you will stop at the third one. Do this instead, in order.

  1. **Count the distinct values of the column first.** `=COUNTA(UNIQUE(range))`. If it is already the number you expect, the column does not need a gate; something else does.
  2. **Move the option list into a table on its own sheet** and point the rule at `=INDIRECT("Table[Column]")` so it grows.
  3. **Set the style to Stop** unless you have a specific reason for Warning, and know that Warning is a notice rather than a rule.
  4. **Write the paste instruction in the input message** and on the sheet. It is the single failure this feature cannot prevent by itself.
  5. **Run Circle Invalid Data once** on the existing column, because the rule you just added says nothing about the data already there.
  6. **Leave a check block on the sheet** : distinct count, off-list count, blank count. Three formulas, and they keep working after the rule has been pasted away.

If you have paper nearby, one optional sketch is worth five minutes. Draw your input sheet as a box, then draw every arrow that puts data into it: somebody typing, somebody pasting, an import, a formula, a colleague filling down. Then mark which arrows the dropdown sits on. Most sheets have four or five arrows and validation covers one of them, and seeing that on paper is what makes the check block feel necessary rather than fussy.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                   | What it does                                                                 |
|-------------------------|------------------------------------------------------------------------------|
| Where it lives          | Data, Data Validation, Allow: List.                                          |
| Best source             | A column in a table, on its own sheet.                                       |
| Table as a source       | `=Products[Product]` is rejected. Wrap it: `=INDIRECT("Products[Product]")`. |
| Typed comma list        | Works, invisible, uneditable in bulk. Avoid.                                 |
| Stop style              | The only style that refuses a value.                                         |
| Warning and Information | Notices, not rules. The value gets in.                                       |
| Ordinary paste          | Value lands and the rule is removed from the cell.                           |
| Paste Special, Values   | Rule survives. The value is still not checked.                               |
| Existing data           | Never checked. A rule only governs future typing.                            |
| Dependent list          | Name a range per group, then `=INDIRECT($A2)`.                               |
| Names and spaces        | Not allowed. `=INDIRECT(SUBSTITUTE($A2," ","_"))`.                           |
| Custom rule             | A formula returning TRUE. Written for the top-left cell.                     |
| No duplicates           | `=COUNTIF($A$2:$A$500, A2)=1`                                                |
| Ignore blank            | On by default. Validation can never make a field mandatory.                  |
| Apply to all cells      | Tick it when editing, or you create a second rule for one cell.              |
| Circle Invalid Data     | Rings every cell breaking its own rule. Circles are not saved.               |
| The formula check       | `=SUMPRODUCT(--(COUNTIF(list, range)=0))`. Survives everything.              |

**The one habit to keep.** Put a count of off-list values on the sheet, beside the data. The dropdown governs one way in; the count tells you the truth about what is actually in the column, whichever way it arrived. If validation behaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that got me was a shared tracker with a tidy four-option dropdown that had been in place for a year, and eleven distinct statuses in the column, because everybody pastes. What has walked past a dropdown in something you built, and what finally showed it?

## References

  * Reason, J. (2000). Human error: Models and management. _BMJ_ , 320(7237), 768–770.
  * Panko, R. R. (1998). What we know about spreadsheet errors. _Journal of End User Computing_ , 10(2), 15–21.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [Excel Drop Down Lists and Data Validation, and the Paste That Removes Them](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-data-validation/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
