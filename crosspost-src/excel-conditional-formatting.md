By the end of this page you can highlight an entire row based on a value in one of its columns, drive the cut-off from a cell somebody can type into rather than from a number buried in a dialog, control which rule wins when two apply, and know exactly what conditional formatting does and does not change about your data. It is about twenty-five minutes, and every result below was produced by building the rule in Excel and reading back what got coloured.

Here is what to do today. Select your data starting at the first data cell, not the headings. Home, Conditional Formatting, New Rule, **Use a formula to determine which cells to format**. Type the formula as though you were writing it for the top-left cell you selected, and put a dollar sign in front of the column letter you are testing: `=$H2>800`. That one dollar sign is the difference between highlighting four cells and highlighting four rows.

The short version: a formula rule is written once, for the top-left cell of the selection, and then copied across the whole range the same way a formula fills. Whatever you lock with a dollar sign stays put; whatever you leave alone moves.

That is the idea the rest of the page rests on, so it gets the picture.

> _The original carries a diagram here. In words: Two small grids sit side by side, each five rows deep and four columns wide, and each with a formula printed above it as its only label. Above the left grid the formula reads equals H2 greater than 800, with no dollar sign. In that grid only the leftmost column is shaded, and only on the second and fourth rows; the rest of those rows stays white, so the highlight is a short stub at the edge. Above the right grid the same formula appears with a dollar sign in front of the H, reading equals dollar H2 greater than 800. In that grid the second and fourth rows are shaded all the way across, every column, so each highlight reads as a complete band. The rows picked out are the same rows in both grids. The only difference between the two pictures is one character in the formula above them._

**Every result on this page is real.** Rules built in Excel on the sixteen-row orders table used across this set of guides, with the resulting colours read back cell by cell rather than eyeballed.

## 1. The two kinds of rule, and which one you need

Conditional Formatting's menu offers a pile of ready-made rules: Greater Than, Top 10 Items, Duplicate Values, colour scales, data bars, icon sets. All of them share one limitation, and it is the reason most people end up here. A built-in rule can only test **the cell it is colouring**.

So "colour the revenue red when it is under 500" is a built-in rule, and "colour the whole order row when its revenue is under 500" is not, because the cells being coloured are the order number, the date, the rep and the rest, none of which know anything about revenue.

The one entry that removes the limit is **Use a formula to determine which cells to format**. It lets the test and the target be different cells, which is the entire subject of this page. Everything else in the menu is a shortcut for a formula you could have written.

## 2. Where the formula is written from

Before the explanation: you select A2:H17 and type a rule. Say which single cell you think that formula is being written about.

The top-left one, A2. Excel evaluates your formula as if it lived in A2, then copies it to every other cell in the range exactly the way dragging a formula copies it: references shift by however far the cell is from the top-left corner.

That single sentence explains every strange result people get. The formula in the rule is not a description of the range; it is one formula, written once, filled across everything.

Which gives a reliable way to write these without guessing. Write the test in a spare cell on the same row as your first data row, get it returning TRUE and FALSE correctly, then copy the text of that formula into the rule dialog. If it works in the cell, it works in the rule, because it is the same mechanism.

One practical trap while typing in the dialog: the arrow keys insert cell references instead of moving the cursor. Press F2 to switch to editing mode, or click where you want to be.

## 3. The dollar sign that turns a cell into a row

Here is the same rule twice, applied to the same range A2:H17, both run in Excel with the coloured cells read back afterwards.

Without the dollar sign:
    
    
    =H2>800
    
    cells coloured:  A2, A3, A11, A16

Four single cells, all in column A. The rule shifted sideways with the range, so the copy sitting in column B tests I2, the copy in column C tests J2, and so on into empty space. Only the copy in column A ever looks at column H.

With the dollar sign:
    
    
    =$H2>800
    
    rows coloured:  1001, 1002, 1010, 1015     (four whole rows)

The `$` in front of the H freezes the column, so every copy of the rule, in every column, still tests column H. The row number has no dollar sign, so it moves down as the rule fills down, which is exactly what you want: row 3 tests H3, row 4 tests H4.

That is the whole rule for whole-row highlighting, and it is worth saying as a sentence you can repeat: **lock the column, leave the row free**. `$H2`. The four orders it found, 1001, 1002, 1010 and 1015, are the four with revenue over 800, which you can check against the data: 880, 850, 1100 and 880.

## 4. Put the threshold in a cell, not in the dialog

Typing `800` into the rule buries the most important number in the whole exercise inside a dialog nobody will open. Put it in a cell instead, lock it completely, and point the rule at it.
    
    
    J1:  800                      a labelled cell somebody can type into
    
    rule:  =$H2 > $J$1

Both dollar signs this time, because that cell must not move for anybody. Now the cut-off is visible, it is documented by whatever label you put beside it, and it is adjustable without touching the rule at all. Changing the cell from 800 to 500 was run, and the highlight went from four rows to ten, with nothing edited.
    
    
    J1 = 800     4 rows highlighted
    J1 = 500    10 rows highlighted

This also turns a static sheet into something a reader can interrogate. Somebody who wants to know what "large order" means can look at the cell, and somebody who disagrees can change it and watch the page respond, which is a far better conversation than one about your formatting.

It is worth saying that choosing the number is the hard part, not wiring it up. A threshold picked because it is round is a decision dressed as an observation, and [picking a cut-off from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) is a page of its own.

## 5. Applies To, and why it is the setting that goes wrong

Every rule owns a range, shown as **Applies to** in Manage Rules. It is set from whatever you had selected when you created the rule, and it is the most common reason a correct-looking rule colours the wrong things.

Three habits that prevent nearly all of it.

**Select the data before you open the dialog** , starting at the first data cell. If your selection includes the header row, the rule is written for the header and everything is off by one row.

**Check Applies to afterwards.** Home, Conditional Formatting, Manage Rules. The box is editable, so a wrong range is a fifteen-second fix rather than a rebuild.

**Use a table.** A rule applied to a range stops at the last row it knew about, so rows added later are unformatted. A rule applied inside [a real Excel table](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-tables/) extends itself as the table grows, which is the same argument as for every other formula in the workbook.

## 6. Rule order and Stop If True

Before the explanation: a cell qualifies for two rules, one that makes it red and one that makes it bold. Say what happens.

Both apply, unless they conflict. Excel walks the rule list from the top and applies each rule that matches, so red and bold combine happily. Where two rules set the _same_ property, the one higher in the list wins, and that ordering is something you control with the arrows in Manage Rules rather than something Excel decides.

That gives the standard pattern for banding. Write the rules in the order most extreme first:
    
    
    1.  =$H2>=1000     dark
    2.  =$H2>=800      medium
    3.  =$H2>=500      light

An order worth 1,100 matches all three, and because the dark rule is first, dark wins the fill. If you had written them the other way round, everything above 500 would be light and the other two rules would never show.

**Stop If True** is the checkbox beside each rule that says "if this rule matches, do not consider any rule below it". You need it when a lower rule would add something you do not want combined, and the classic use is an exclusion: put a rule at the top that matches the rows you want left alone, give it no formatting at all, and tick Stop If True. Everything it catches is now immune to every rule underneath.

## 7. What conditional formatting does not do

Before the explanation: a rule has coloured four rows. Say whether the cells in those rows are now coloured.

They are not. Conditional formatting paints the display and leaves the cell alone. Checked in Excel on a highlighted cell that had no fill of its own:
    
    
    the cell's own fill        none
    what is on the screen      the rule's colour

Two consequences follow, and they are the two most common frustrations with the feature.

**You cannot count the colour.** There is no COUNTCOLOUR, and the workarounds that read a cell's fill see the cell's own fill, which is empty. Count the condition instead, with the same test the rule uses:
    
    
    =COUNTIF(H2:H17, ">800")      4

That 4 matches the four rows the rule coloured, because it is the same question asked of the data rather than of the paint. Anything you want to count, total or filter needs to exist as a formula somewhere. The colour is for the eye only.

**It does not change any number.** The revenue column still totals 9,890 whatever the rule does, which is a relief rather than a limitation: formatting cannot corrupt data. It is also the reason a highlight is not a finding. Colouring the four big orders red does not put "four orders above 800" anywhere a reader can quote, and a dashboard needs the sentence as well as the paint.

Picture your own most-used sheet for a moment. If somebody printed it in black and white, how much of what it currently communicates would survive? Everything that would not is something you should also be writing down as a number.

## 8. Rules that breed

This is the failure that turns a tidy workbook into a slow one, and it happens without anybody doing anything unusual.

A sheet was set up with exactly one rule, applied to A1:A10. Two ordinary copy-and-pastes of single cells to new locations were performed. Afterwards, Excel reported:
    
    
    rules before   1
    rules after    3
    
    rule 1  applies to $E$6         =E6>0
    rule 2  applies to $C$3         =C3>0
    rule 3  applies to $A$1:$A$10   =A1>0

Copying a cell copies its conditional formatting, and the copy cannot join the original rule, so it becomes a new one with its own range. Do that on a real sheet a few hundred times over a year, which is what normal editing looks like, and Manage Rules fills with near-identical entries covering fragments of ranges. The symptoms are a file that opens slowly, scrolls badly, and formats inconsistently in places nobody can explain.

Two fixes. To prevent it, paste values only, Ctrl+Alt+V then V, when moving data around inside a formatted sheet. To repair it, open Manage Rules, set the scope dropdown to This Worksheet so you can see all of them, delete the fragments, and rebuild one rule over the correct range. It is a five-minute job that people put off for years.

## The full before and after

Same table, same goal: make the large orders findable at a glance.

### Before
    
    
    Rule:        Greater Than, 800, red fill
    Applies to:  $H$2:$H$17

Only the revenue cell turns red, so the eye has to travel back along the row to find out whose order it was. The number 800 exists nowhere except inside a dialog. Rows added next month are not covered. And there is no number anywhere on the sheet saying how many orders qualify.

### After
    
    
    J1:          800            labelled "Large order threshold"
    Rule:        =$H2 > $J$1
    Applies to:  the whole table, so it grows with the data
    Beside it:   =COUNTIF(Orders[Revenue], ">"&J1)      4
                 =SUMIF(Orders[Revenue], ">"&J1)     3710

Whole rows light up, so the order and the rep come with the number. The threshold is visible and adjustable, and changing it from 800 to 500 takes the highlight from four rows to ten without editing the rule. And the two formulas beside it turn the colour into something quotable: four orders above the threshold, worth 3,710 between them.

The claim, and it is why the dollar sign gets its own section: **one character in the rule is the difference between four coloured cells and four coloured rows, and neither version looks wrong until you compare them.**

## Edge cases that break a rule quietly

Six that get past a first build.

**The header row was in the selection.** The rule is then written for the header, so every test is one row out and the highlighting looks almost right. Select from the first data row.

**Blank cells count as zero.** A rule like `=$H2<500` lights up every empty row below your data, because blank is treated as 0. Guard it: `=AND($H2<>"", $H2<500)`.

**Text compared with a number.** If the tested column contains numbers stored as text, the comparison quietly returns FALSE for those rows, and they never highlight. This is the same class of problem as a total coming up short, and it is worth checking the column type before blaming the rule.

**Inserting a row splits the range.** Inserting inside a formatted range usually extends it, but inserting at the edges often does not, and the new row is simply outside. Manage Rules shows the truth in the Applies to box.

**Colour that is the only carrier of the message.** Roughly one man in twelve of northern European descent has a red-green colour vision deficiency, so a red-against-green rule communicates nothing to a real fraction of any audience. Use a fill difference plus something non-colour, bold or an added symbol, and it costs nothing.

**Volatile formulas inside rules.** Rules containing functions that recalculate constantly, or rules applied to whole columns, make every scroll and edit slow. Apply rules to the used range, not to `A:A`.

## Why this works

The reason a highlight is worth building at all is that colour is found without being searched for. A cell whose fill differs from its neighbours is located in roughly the same time whether there are ten rows on screen or two hundred, because a small set of visual properties, colour and size and orientation among them, are processed in parallel across the whole visual field rather than item by item (Healey & Enns, 2012, _IEEE Transactions on Visualization and Computer Graphics_ , 18(7), 1170–1188). That is the specific job conditional formatting does well, and it explains the failure mode too: the effect depends on the highlighted cells being rare. A rule that colours half the sheet has nothing to stand out against, and it has cost you the technique.

It also tells you what not to ask colour to do. When people rank how accurately readers extract quantities from different visual encodings, position along a common scale comes out well ahead, and colour comes out near the bottom, which is why a colour scale across a table is a rough impression rather than a reading (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). Use colour to say _this one, look here_ , which it does better than anything else on the page, and use a number or a chart when the reader has to know how much.

One note on the cheat sheet below. It is built to be covered and recalled rather than read, because testing yourself on material transfers to new situations better than restudying it, which matters here since you will be applying these rules to sheets that look nothing like this one (Butler, 2010, _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133).

## Using this on your own project

Rebuilding every rule in an inherited workbook is miserable and you will stop at the second sheet. Do this instead, in order.

  1. **Open Manage Rules and set the scope to This Worksheet.** Count what is there. If it is more than a handful, you have fragmentation, and deleting is the work rather than adding.
  2. **Write the test in a spare cell first** and get it returning TRUE and FALSE correctly before you open the dialog.
  3. **Lock the column, leave the row free** , `=$H2>...`, whenever you want the whole row to react.
  4. **Move every threshold into a labelled cell** and reference it with both dollar signs. It is documentation and a control at the same time.
  5. **Apply rules inside a table** so they cover next month's rows without anybody remembering to extend them.
  6. **Put a count beside the colour.** One `COUNTIF` using the same condition, so the sheet says how many, not just which.

If you have paper nearby, one optional sketch is worth five minutes. Draw your table as a grid, put a dot in the one cell whose value decides everything, and draw a horizontal line from that dot across its whole row. Then write the reference you would need for the dot to stay in its column while the line moves down. You will write a dollar sign in front of the letter, and you will not need to look it up again.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                    | What it does                                                           |
|--------------------------|------------------------------------------------------------------------|
| Built-in rules           | Can only test the cell they colour.                                    |
| Formula rule             | Home, Conditional Formatting, New Rule, Use a formula.                 |
| Where it is written from | The top-left cell of the selection, then filled like a formula.        |
| Whole-row highlight      | `=$H2>800`. Lock the column, leave the row free.                       |
| No dollar sign           | The test slides sideways. Only the first column looks at column H.     |
| Threshold in a cell      | `=$H2>$J$1`, both signs, so the cell cannot move.                      |
| Applies to               | The rule's range. Check it in Manage Rules; it is editable.            |
| Header in the selection  | Everything is off by one row.                                          |
| Rule order               | Top down. For bands, write the most extreme rule first.                |
| Stop If True             | Matching rows skip every rule below. Use it for exclusions.            |
| What CF changes          | The display only. The cell has no fill of its own.                     |
| Counting the colour      | Not possible. Count the condition with COUNTIF instead.                |
| Blank cells              | Treated as 0. Guard with `AND($H2<>"", ...)`.                          |
| Rules multiplying        | Copy and paste breeds them. Paste values, or clean up in Manage Rules. |
| Rules in a table         | Extend to new rows on their own.                                       |
| Colour alone             | Not enough. Pair it with bold or a symbol.                             |

**The one habit to keep.** Every highlight gets a number beside it, produced by the same condition. The colour finds the rows; the count is the thing a reader can quote, argue with, or paste into an email. If a rule misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/), and [checking your work](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/) covers where the check formulas should live.

One last thought, and I would genuinely like other people's answers. The worst rule set I inherited had over two hundred entries in Manage Rules, all fragments of the same three rules, and the file took forty seconds to open. What is the strangest thing you have found in somebody's Manage Rules list?

## References

  * Healey, C. G., & Enns, J. T. (2012). Attention and visual memory in visualization and computer graphics. _IEEE Transactions on Visualization and Computer Graphics_ , 18(7), 1170–1188.
  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531–554.
  * Butler, A. C. (2010). Repeated testing produces superior transfer of learning relative to repeated studying. _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133.

---

*Originally published on Analyst Prep Kit: [Conditional Formatting Based on Another Cell](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-conditional-formatting/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
