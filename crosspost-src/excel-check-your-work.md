This article gives you the checking habit: when to check, where the check lives, and the one rule that makes a check worth anything. It costs two cells per question and it catches the mistakes that nothing on the screen will ever flag.

The reason it matters is blunt. Wrong Excel does not crash. It returns a confident number, formatted like every right number around it. The only thing standing between that number and your name on it in a meeting is a check you wrote twenty minutes earlier.

**The short version.** After any step that changes what the numbers mean, work out what one number should be, write it down, then look. Predict, then check. Never the other way around.

Everything here comes from the same build as the rest of this series: an Excel dashboard over 82,956 Steam games, walked in [the eight-step build order](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/). Checking is step 4 of those eight, and this article is that step grown into a habit. The counts quoted were re-run against the real file before publishing.

## Why wrong spreadsheets look right

Before anything else, answer this from your own experience: when a formula of yours was wrong, how did you find out? Hold the answer. Most people's honest answer is "someone else noticed," and this article exists to change that.

A program with a bug usually fails loudly. A spreadsheet with a bug usually succeeds quietly. Type a wrong range into SUM and you get a number. Point COUNTIF at the wrong column and you get a number. Let a pivot decide to sum your ID codes, which is [what happened in this build](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/), and you get a number. Every one of those numbers is formatted, plausible, and wrong.

In the build, the wrong figure was 0.45% and the right figure was 0.71%. Put those side by side. Neither is round enough to look fake. Neither is big enough to feel absurd. No amount of staring tells them apart. The only thing that told them apart was a second number, computed a different way.

## When to check: after meaning changes, not at the end

The instinct is to build everything and check at the end. The instinct is wrong for one mechanical reason: at the end, a failed check tells you something broke, but not which of nine steps broke it. You get to re-audit the whole file.

Check after any step that changes what the numbers mean:

| Step                    | What can silently go wrong                                                |
|-------------------------|---------------------------------------------------------------------------|
| A new calculated column | The condition catches the wrong rows, and every row still gets a value    |
| A new filter            | Rows you meant to keep are gone, and the sheet looks tidier for it        |
| A join or lookup        | Unmatched rows drop or duplicate, and totals move without a message       |
| A new pivot             | Excel picks the summary function, and Sum of an ID column reads like data |
| A paste over old values | One misaligned row shifts every value after it by one                     |

What these five share: each one silently returns numbers instead of an error. That is the trigger. A step that would fail loudly does not need its own check. A step that would fail politely does.

Say out loud which of the five you did most recently. That step is where your next check goes.

## Where the check lives

Outside the data, in a cell of its own, visible without scrolling. Not in your head, and not in a scratch file you will delete.

The shape is always the same: a label, the expected value typed as text, and the computed value beside it.
    
    
    CHECK: loved games      765      =COUNTIFS(Games[PctPositive],">=95",Games[TotalReviews],">=2000")
    CHECK: stayed hidden    175      =COUNTIFS(Games[PctPositive],">=95",Games[TotalReviews],">=2000",Games[IsHiddenGem],1)

The typed number is the prediction. The formula is the measurement. When they agree, the row reads as one glance of reassurance. When they disagree, you have found a bug while it is still cheap.

A check in your head does not survive the afternoon. A check off-screen does not get read. Two labelled cells beside the data get read every time you look at the sheet, which is the entire point.

## How to check: predict, then look

This is the rule that separates a real check from a comforting one, and it is the one habit this article asks you to keep.

**Work out what the number should be before you look at what Excel says.** Use a different route than the formula took: filter and read the status bar count, take a ten-row sample and count by hand, or derive it from a number you already trust.

The reason is not politeness to your future self. It is how judgment works. Once a number is on screen, you reason from it. The question quietly changes from "what should this be?" to "could this be right?", and almost anything could be right. A check you read after the fact confirms whatever is already showing.

Two routes to the same number is the whole trick. A number is not made correct by having been produced carefully. It is made correct by having been produced twice.

Picture the last number you sent to somebody. Name the second route you could have computed it by. If no second route exists, that number was never checked, only produced.

## The two-cell check from the real build

Here is the habit doing its work on real data, at the moment it mattered.

Step 2 of the build added a label column sorting 82,956 games into four groups, built in [article 1](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/). The source analysis said there should be 765 loved games: 175 still hidden, 590 found. Those three numbers were written into check cells before the pivot was built.

Then the pivot said the loved-and-found group was 0.45% of all games. The check cell said 590, and 590 of 82,956 is 0.71%. Disagreement. The hunt was short because the check was fresh: the fault had to be in the pivot, not the label column, because the label column's own checks still passed. The pivot's corner read _Sum of AppID_. Ten seconds in Value Field Settings fixed it, and the same fault turned up in three more fields, each caught by the same comparison.

One more check closed the loop, and it is the cheapest one on the page. The four group counts have to add up to the row count of the file: 78,064 plus 4,127 plus 175 plus 590 is 82,956. One cell of addition catches missing rows, double-counted rows and misspelled labels all at once.

## Ship the checks with the file

The habit people get wrong at the last step: they delete the checks before sending, because checks look like scaffolding. Leave them in.

Two labelled CHECK cells in a shipped file do two jobs. They tell the next person that somebody verified this, which is rarer than it should be and gets noticed. And they keep working after you are gone: when someone adds rows next quarter and a check goes red, the file catches its own regression.

This is the same move as [writing down what your data can't tell you](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/). Both put your verification where the reader can see it, instead of asking to be trusted.

## Why this works

Two findings, from two different fields, both pointing at the same practice.

Spreadsheet errors are the norm, not the exception. Panko's review of spreadsheet audits found errors in a few percent of cells, across nearly every spreadsheet examined, built by professionals doing careful work (Panko, 1998, _Journal of Organizational and End User Computing_ , 10(2), 15-21). A decade later a broader review reached the same conclusion from more studies (Powell, Baker & Lawson, 2008, _Decision Support Systems_ , 46(1), 128-138). At those rates, a file of any size contains an error. The question a check answers is not "is there a mistake?" but "is there a mistake in the number I am about to present?"

And looking harder does not work, because of anchoring. Tversky and Kahneman showed that people judging a quantity start from whatever number they were shown and adjust too little, even knowing the starting number is arbitrary (Tversky & Kahneman, 1974, _Science_ , 185(4157), 1124-1131). That is why the prediction is written down first. It is the one moment your judgment is uncontaminated by the answer.

## Run it on your own file

  1. **Open the file you most recently sent to somebody.** Not a practice file. The real one.
  2. **Pick its headline number.** The one somebody might repeat in a meeting.
  3. **Compute it a second way.** Filter and read the status bar, count a sample by hand, or derive it from a total you trust. Write your expected value in a cell before you compare.
  4. **Compare.** If they agree, label the pair CHECK and leave them in the file. If they disagree, you just learned this habit pays for itself on the first afternoon.
  5. **Add the addition check.** If the file has groups, their counts must sum to the row count. One cell.
  6. **From now on, check when meaning changes.** New column, new filter, new join, new pivot. Two cells each time, at the moment the step finishes.

Retrofitting checks onto every old workbook is misery, and you will not do it. Check the one number you are about to present, and build the habit forward from there.

## A cheat sheet

| Question                        | Answer                                                                                |
|---------------------------------|---------------------------------------------------------------------------------------|
| When do I check?                | After any step that changes what the numbers mean. Column, filter, join, pivot, paste |
| Where does the check go?        | A labelled cell beside the data, visible without scrolling                            |
| What does a check contain?      | The expected value, typed, and the measured value, computed a different way           |
| Which comes first?              | The prediction. A check read after the fact confirms whatever is on screen            |
| What is the cheapest check?     | Group counts must sum to the row count. One cell of addition                          |
| Do checks ship with the file?   | Yes. They prove verification happened and they catch future regressions               |
| What if I have no second route? | Then the number is unchecked. Find a sample, a filter count, or a trusted total       |

**The one habit to keep.** Write the number you expect before you look at the number Excel gives you. Everything else on this page is scaffolding around that one move.

## References

  * Panko, R. R. (1998). What we know about spreadsheet errors. _Journal of Organizational and End User Computing_ , 10(2), 15-21.
  * Powell, S. G., Baker, K. R., & Lawson, B. (2008). A critical review of the literature on spreadsheet errors. _Decision Support Systems_ , 46(1), 128-138.
  * Tversky, A., & Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. _Science_ , 185(4157), 1124-1131.

Back to your answer from the top: who found your last wrong formula, you or someone else? What would the two-cell version of that check have looked like?

---

*Originally published on Analyst Prep Kit: [Check Your Work Before Anyone Else Does](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
