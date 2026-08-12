By the end of this page you can look at a balance sheet and answer two questions a lender asks first: can this company pay the bills that are about to come due, and how much of it was bought with borrowed money. You will know the three ratios, the SQL for all of them, and the four places where the definition, not the arithmetic, decides the answer.

One thing to do today, and it takes five minutes. Find any balance sheet, yours or a public company's. Add up cash and receivables, then compare that to the bills due within the year. If the first number is smaller, the company is relying on selling inventory to make its payments, and that is a different business than the totals suggest.

Both questions in one line: liquidity ratios compare what you can turn into cash soon against what you owe soon. Leverage ratios compare what is borrowed against what is owned.

The gap between two companies that look equally healthy is the thing worth seeing first.

> _The original carries a diagram here. In words: Two panels side by side, each showing a single tall stacked column that represents one company's current assets, measured against a dashed horizontal line that marks the bills coming due within the year. In the left panel, labeled Northlight, the column is built from a solid accent-colored lower block labeled cash and receivables, with a hatched grey block labeled inventory stacked on top of it. The solid block on its own already rises above the dashed line, so this company could pay its bills without selling any inventory, and the panel carries a check mark. In the right panel, labeled Ridgeway, the whole column is taller than Northlight's, which would make its current ratio look better. But the split is different: the solid cash-and-receivables block is short and stops well below the dashed line, and the hatched inventory block above it makes up three quarters of the height. A small bracket marks the gap between the top of the solid block and the dashed line, and this panel carries a cross. The two dashed lines sit at different heights because the two companies owe different amounts. The picture shows that total height, which is what the current ratio measures, says nothing about whether the part you can actually spend reaches the line._

**Every number on this page is verified, and you can check them.** Two balance sheets are shown in full below, line by line. Every ratio, gap and quarterly figure was computed in SQLite and cross-checked in pandas before it went on the page, so you can add up any column by hand and it will agree.

## 1. Two questions a balance sheet answers

A company made $560,000 of profit last year. Name something that could still put it out of business in March.

Running out of cash. Profit and cash are not the same thing, and a company can be profitable on paper while having nothing in the bank on the day a supplier wants paying. The income statement tells you whether the business earns; the balance sheet tells you whether it can pay.

A balance sheet is a snapshot on one specific date. It lists what the company owns, called assets, what it owes, called liabilities, and the difference between them, called equity. Two questions are asked of it more often than all the others put together.

**Liquidity: can we cover what is due soon with what we can turn into cash soon?** That is a question about the near term, usually the next twelve months, and it is answered by the current ratio and the quick ratio.

**Leverage: how much of this company was paid for with borrowed money?** That is a question about risk over the long term, and it is answered by debt to equity. Borrowed money has to be repaid on a schedule whether or not the business has a good year, which is what makes leverage the thing that turns a bad quarter into a crisis.

Both questions use the same trick: divide one part of the balance sheet by another so the answer does not depend on how big the company is.

## 2. The current ratio, and what "current" means

What do you think makes an asset "current"?

Time. "Current" means within one year, and it is the only thing the word means here. A current asset is cash, or something expected to become cash within a year: money customers owe you, inventory you expect to sell, expenses you have prepaid. A current liability is a bill due within a year: money you owe suppliers, wages accrued but not yet paid, the slice of a loan repayable this year.

The current ratio is current assets divided by current liabilities. Above 1.0 means there is more coming in soon than going out soon. Below 1.0 means the company needs to raise money from somewhere else to get through the year.

Here is the first of our two balance sheets, at 31 December 2024.

| Northlight              | Amount        |
|-------------------------|---------------|
| Cash                    | 260,000       |
| Receivables             | 470,000       |
| Inventory               | 490,000       |
| Prepaid expenses        | 40,000        |
| **Current assets**      | **1,260,000** |
| Accounts payable        | 430,000       |
| Accrued expenses        | 145,000       |
| Short-term debt         | 125,000       |
| **Current liabilities** | **700,000**   |
| Long-term debt          | 1,065,000     |
| Equity                  | 1,700,000     |

Current ratio: 1,260,000 divided by 700,000 is 1.80. For every dollar due within the year, there is a dollar eighty of assets expected to arrive within the year. That reads as comfortable, and for this company it is.

## 3. The quick ratio, and why it drops inventory

Of cash, receivables and inventory, which one might take six months to turn into money, and might never turn into all of it?

Inventory. It is a current asset because you expect to sell it inside a year, and "expect" is doing a lot of work in that sentence. Stock can sit. It can go out of fashion, expire, or need discounting to move. Receivables can be chased and cash is already cash, but inventory is a plan, not a payment.

So the quick ratio runs the same test with inventory taken out. It asks whether the company could meet its near-term bills if nothing on the shelf sold at all. Above 1.0 means yes.

Northlight's quick ratio: 1,260,000 minus 490,000 of inventory is 770,000, divided by 700,000, which is 1.10. It clears the bar without selling a thing.

Now the second company, and this is where the two ratios come apart.

| Ridgeway                | Amount        |
|-------------------------|---------------|
| Cash                    | 90,000        |
| Receivables             | 190,000       |
| Inventory               | 900,000       |
| Prepaid expenses        | 20,000        |
| **Current assets**      | **1,200,000** |
| Accounts payable        | 310,000       |
| Accrued expenses        | 105,000       |
| Short-term debt         | 85,000        |
| **Current liabilities** | **500,000**   |
| Long-term debt          | 520,000       |
| Equity                  | 1,250,000     |

Ridgeway's current ratio is 1,200,000 divided by 500,000, which is 2.40. That is a third better than Northlight's 1.80, and on a page that only carried the current ratio, Ridgeway is the healthier company.

Its quick ratio is 1,200,000 minus 900,000, which is 300,000, divided by 500,000, which is 0.60. Against $500,000 of bills due inside the year, Ridgeway has $300,000 it can actually spend. It is $200,000 short, and the only way to close that gap is to sell inventory faster than it has been selling it.

The two companies side by side.

| Ratio                                  | Northlight | Ridgeway | What it says                              |
|----------------------------------------|------------|----------|-------------------------------------------|
| Current ratio                          | 1.80       | 2.40     | Ridgeway looks stronger                   |
| Quick ratio                            | 1.10       | 0.60     | Ridgeway cannot pay without selling stock |
| Inventory as a share of current assets | 39%        | 75%      | The whole reason for the reversal         |

The claim this page earns, in one sentence: **Ridgeway's current ratio is 33% better than Northlight's and it is $200,000 short of paying next year's bills.** That is why the quick ratio exists, and why nobody who lends money reads the current ratio on its own.

Say why a bigger pile of current assets can be the weaker position, in your own words, before reading on.

One more thing about the quick ratio, because it is the first place a definition changes the answer. Some texts define it as current assets minus inventory. Others define it as cash plus marketable securities plus receivables, added up from the top instead of subtracted from the total. Those are not the same. On Northlight's balance sheet the first gives 770,000 and a quick ratio of 1.10; the second gives 730,000 and a quick ratio of 1.04, because prepaid expenses are in current assets and are not something you can pay a supplier with. Same company, same day, two defensible answers 0.06 apart. Write down which one you used.

## 4. Debt to equity, and the word that has two meanings

A company owes $1,765,000 in total, of which $575,000 is unpaid supplier invoices. Is that $575,000 "debt"?

It depends who is asking, and this is the single most common reason two people compute different debt-to-equity ratios from the same balance sheet.

Debt to equity divides what the company borrowed by what the owners put in and left in. Equity is total assets minus total liabilities: the slice of the company nobody else has a claim on. A ratio of 0.50 means fifty cents borrowed for every dollar owned. A ratio of 2.00 means two dollars borrowed for every dollar owned, and a bad year now threatens the lenders' money as well as the owners'.

The disagreement is over the numerator. **Interest-bearing debt** counts only money that was borrowed and carries interest: loans, bonds, the short-term borrowings line. **Total liabilities** counts everything the company owes anyone, including supplier invoices and accrued wages, which carry no interest and no repayment schedule.

On Northlight, run both.

| Definition            | Numerator                       | Debt to equity |
|-----------------------|---------------------------------|----------------|
| Interest-bearing debt | 125,000 + 1,065,000 = 1,190,000 | 0.70           |
| Total liabilities     | 700,000 + 1,065,000 = 1,765,000 | 1.04           |

Both divide by the same $1,700,000 of equity. One says the company is modestly borrowed. The other says it owes slightly more than it owns. The gap is the $575,000 of payables and accruals that carry no interest, and the wider definition is 48% higher on this company.

Neither is wrong. A credit analyst usually wants interest-bearing debt, because that is what has to be serviced on a schedule. An accounting textbook usually means total liabilities. Pick one, name it in the column header, and never compare a ratio built one way against a ratio built the other. Ridgeway, for the record, is 0.48 on the narrow definition and 0.82 on the wide one.

## 5. The query, and the division that returns 1

In SQL, current assets of 1,260,000 divided by current liabilities of 700,000, both stored as whole numbers. What comes back?

1. Not 1.80. Whole number divided by whole number gives a whole number in most databases, so the 0.80 is discarded. This is nastier here than in a percentage, because 1 is a perfectly plausible current ratio. It sits exactly on the line between covered and not covered, so a reader has no reason to doubt it.

Watch what it does to all three ratios on Northlight.

| What you write                                       | Returns | The truth |
|------------------------------------------------------|---------|-----------|
| `current_assets / current_liabilities`               | 1       | 1.80      |
| `(current_assets - inventory) / current_liabilities` | 1       | 1.10      |
| `total_debt / equity`                                | 0       | 0.70      |
| `ROUND(current_assets / current_liabilities, 2)`     | 1.0     | 1.80      |

The last row is the dangerous one. `ROUND` makes the output look like a decimal calculation, so the column reads 1.0 and 1.0 and 0.0 down the page and nothing suggests the arithmetic never happened. On Ridgeway the same bug returns a current ratio of 2 and a quick ratio of 0, which turns "0.60, and it is short" into "0, and it has nothing", a different and equally wrong story.

The fix is one character in three places. Multiply by `1.0` before dividing, and the whole expression goes decimal.
    
    
    SELECT company,
           ROUND(1.0 * current_assets / current_liabilities, 2)               AS current_ratio,
           ROUND(1.0 * (current_assets - inventory) / current_liabilities, 2) AS quick_ratio,
           ROUND(1.0 * total_debt / equity, 2)                                AS debt_to_equity
    FROM balance_sheet
    WHERE as_of = '2024-12-31'
    ORDER BY company;

That returns 1.80 / 1.10 / 0.70 for Northlight and 2.40 / 0.60 / 0.48 for Ridgeway. The same rule catches every ratio you will ever write in SQL, and it is worked from the other direction in [gross vs operating vs net margin](https://michaelnocito.github.io/analyst-prep-kit/guides/gross-vs-operating-vs-net-margin/), where the same division returns 0 instead of 1.

Now the `WHERE as_of` line, which matters more than it looks. A balance sheet table usually holds several snapshots, one per quarter or per month. Leave the filter off and `SUM` quietly adds four dates together. Northlight's four 2024 snapshots summed give a current ratio of 1.92; the year-end figure is 1.80. Both are plausible, only one is the company's current ratio, and nothing in the output tells you which you got.

Picture your own company's balance-sheet table. How many dates are in it, and does the query you inherited filter to one of them? That check takes ten seconds and it is worth doing before you trust any ratio you did not write yourself.

## 6. Benchmarks, and why a high ratio can be bad news

A company's current ratio is 6.0. Name a reason that might not be good.

Idle money. Assets sitting in cash or unsold stock are assets not being used to grow anything. A current ratio far above what the business needs usually means cash the company has not found a use for, or inventory it cannot shift. Neither is a crisis, and neither is a strength.

The usual comfortable band is roughly 1.5 to 3.0 for the current ratio and at or above 1.0 for the quick ratio, but treat those as starting points rather than rules. A supermarket collects cash at the till and pays its suppliers weeks later, so it runs happily below 1.0 and always has. A shipbuilder holds enormous inventory for years and runs far higher. The band belongs to the industry, not to accounting.

The same goes for leverage. Debt to equity above about 2.0 is a flag for most companies, and utilities, airlines and property firms run above it as a matter of course, because they own predictable assets that lenders are happy to lend against. Comparing an airline's leverage to a software company's tells you what industry they are in, not which is better run.

Three comparisons are worth more than any published band.

  1. **The same company over time.** This is the one that always works, because everything else is held constant.
  2. **A named competitor of similar size,** in the same industry, on the same date.
  3. **The covenant.** If the company has a loan, the agreement almost certainly names a minimum current ratio or a maximum debt-to-equity ratio in writing. That number beats every benchmark on the internet, because breaching it has consequences on a specific date.

Time is where the story usually is. Here are Northlight's four 2024 snapshots, with the three inputs each ratio comes from, so the trend can be checked the same way the year-end figures were.

| As of      | Current assets | Inventory | Receivables | Current liabilities | Current ratio | Quick ratio |
|------------|----------------|-----------|-------------|---------------------|---------------|-------------|
| 2024-03-31 | 1,130,000      | 300,000   | 380,000     | 545,000             | 2.07          | 1.52        |
| 2024-06-30 | 1,170,000      | 360,000   | 420,000     | 595,000             | 1.97          | 1.36        |
| 2024-09-30 | 1,220,000      | 430,000   | 450,000     | 653,000             | 1.87          | 1.21        |
| 2024-12-31 | 1,260,000      | 490,000   | 470,000     | 700,000             | 1.80          | 1.10        |

Check the March row against the December one you already worked. 1,130,000 minus 300,000 of inventory is 830,000, over 545,000 of bills, which is 1.52. The quick ratio here is the current-assets-minus-inventory version from section three, the same one used throughout this page.

Read as one date, 1.80 and 1.10 are fine. Read as four, the quick ratio has fallen every quarter, from 1.52 to 1.10, and it is heading for the 1.0 line. Inventory grew from $300,000 to $490,000 across the year, up 63%, while receivables grew from $380,000 to $470,000, up 24%. Northlight is quietly turning into Ridgeway, and no single snapshot could have told you that.

This is also where the missing filter from section five shows its teeth. Summed across all four dates, current assets are $4,780,000 against $2,493,000 of current liabilities, which is the 1.92 a query with no `WHERE as_of` returns. It is not any quarter's ratio, it is not the average of the four, and it is the one number in this table that describes nothing that ever happened.

## 7. The full before and after

Same two balance sheets, two ways of reporting them.

### Before

"Ridgeway current ratio 2.40, Northlight 1.80. Both above the 1.5 threshold. No liquidity concerns." Every number is right, the threshold is a real one, and the conclusion is backwards. A reader has no way to see that one of these companies has $300,000 of spendable assets against $500,000 of bills, because the report never separated the spendable part from the rest.

### After

| Measure                            | Northlight | Ridgeway | Read                             |
|------------------------------------|------------|----------|----------------------------------|
| Current ratio                      | 1.80       | 2.40     | Both above 1.5                   |
| Quick ratio                        | 1.10       | 0.60     | Only one clears 1.0              |
| Quick assets                       | 770,000    | 300,000  | The dollars behind the ratio     |
| Current liabilities                | 700,000    | 500,000  | What is due within the year      |
| Gap                                | +70,000    | -200,000 | Ridgeway must sell stock to pay  |
| Debt to equity (interest-bearing)  | 0.70       | 0.48     | Ridgeway borrowed less           |
| Debt to equity (total liabilities) | 1.04       | 0.82     | Same companies, wider definition |

Two additions do all the work. The quick ratio splits the pile, and the gap row converts the ratio back into dollars so a reader does not have to. The definition of debt is named in the row label rather than assumed. And the finding is now visible without any expertise at all: the company that borrowed less is the one that might not make its payments.

## 8. Edge cases: a snapshot is easy to move

It is 30 December. Name one thing a company could do that day to improve its current ratio without changing anything about the business.

**Pay a bill.** Take $200,000 of cash and settle $200,000 of accounts payable on the last working day of the year. Current assets fall to $1,060,000, current liabilities fall to $500,000, and the current ratio goes from 1.80 to 2.12. The company is no healthier. It has less cash than it did that morning. Because both sides of the fraction shrink by the same amount, and the top was already bigger, the ratio improves. This has a name in the trade, window dressing, and it is why a lender looks at several dates rather than one. Northlight's cash after that payment would be $60,000 of the $260,000 it started with, which is the part a ratio never shows you.

**A ratio is a snapshot and an income statement is a film.** Mixing them needs care. Ratios that put a balance-sheet number over an income-statement number, like inventory turnover, conventionally use the average of the opening and closing balance rather than the closing one, precisely because one date does not represent a year. If you build one of those, say which convention you used.

**Equity can be negative, and then the ratio is meaningless.** A company that has lost more over its life than owners put in has negative equity, and debt to equity comes out negative. A negative leverage ratio is not low leverage, it is a company whose liabilities exceed its assets. Guard it in the query and report the words instead of the number.

**Not every current liability is equally urgent.** A payable due in eleven months and one due next Tuesday both sit in the same total. The ratio treats them identically, and the company's bank account does not. When liquidity is genuinely tight, the ratio stops being the right tool and a week-by-week cash forecast starts being one.

**Receivables are only as good as the customers.** The quick ratio trusts every dollar of receivables at face value. If a third of them are ninety days overdue, the real quick ratio is lower than the computed one. An ageing report sits next to this analysis, not after it.

## Why this works

The reason a single ratio is not enough is a measurement problem, not an accounting one. Any single indicator used to judge performance tends to be managed toward rather than improved on, an effect Campbell set out from social program evaluation (Campbell, 1979, _Evaluation and Program Planning_ , 2(1), 67–90) and Goodhart put in one line about monetary targets (Goodhart, 1975, reprinted in _Monetary Theory and Practice_ , Macmillan, 1984, 91–121). The 30 December payment in section eight is that effect on a balance sheet: the number moved, the thing it measures did not. Two ratios that can disagree, read across four dates, is the cheapest defence available.

Ratio analysis of this kind is also older and better tested than it looks. Beaver's study of 79 failed companies against 79 matched survivors found that balance-sheet ratios separated the two groups up to five years before failure, with cash-flow and debt ratios among the strongest single predictors (Beaver, 1966, _Journal of Accounting Research_ , 4, 71–111). Altman's multi-ratio model, built on 66 manufacturers, classified 95% of them correctly one year out (Altman, 1968, _The Journal of Finance_ , 23(4), 589–609). Neither found any one ratio sufficient on its own, which is the finding this page is built on.

The question at the top of each section is deliberate. Attempting an answer before receiving one improves learning of that specific material across sixty-four studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing which asset is slowest to become cash, before section three said inventory, is why you will still know it in an interview.

## Using this on your own numbers

Rebuilding every ratio report in the company is a slog and nobody thanks you for it. Do this instead, in order.

  1. **Add the quick ratio wherever a current ratio already appears.** One column, one subtraction, and it is the column that would have caught Ridgeway.
  2. **Check the division is decimal.** If any ratio in your report is a whole number like 1, 2 or 0, you have integer division. Section five has the fix.
  3. **Confirm the query filters to one`as_of` date.** Then put four dates side by side, because the trend is where the story was on this page.
  4. **Name the debt definition in the column header.** "D/E (interest-bearing)" costs three words and removes an argument you would otherwise have every quarter.
  5. **Add a dollar column next to every ratio.** Quick assets and current liabilities in dollars, and the gap between them. A ratio persuades nobody; $200,000 short does.
  6. **Find the loan covenant and write its number at the top of the report.** If there is a minimum current ratio in a credit agreement, that is the only threshold on the page that has consequences.

One optional drawing, if there is paper within reach. Draw the two columns from the top of this page from memory: a stack of current assets for each company, a dashed line for the bills due, and the split between the part you can spend and the inventory above it. Mark which solid block reaches its line. If both of yours clear it, you have drawn the current ratio rather than the quick ratio, and the page is still open.

**This page is one of five.** The Financial analysis set on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/) is this page plus [Gross vs Operating vs Net Margin](https://michaelnocito.github.io/analyst-prep-kit/guides/gross-vs-operating-vs-net-margin/), [Contribution Margin and Break-Even](https://michaelnocito.github.io/analyst-prep-kit/guides/contribution-margin-break-even/), [Net Present Value (NPV)](https://michaelnocito.github.io/analyst-prep-kit/guides/net-present-value-npv/) and [Budget vs Actual Variance](https://michaelnocito.github.io/analyst-prep-kit/guides/budget-vs-actual-variance/). They share a worked company, so the numbers carry across. The index also holds every other how-to: SQL, Excel, Tableau, and the working habits around them.

## The whole thing on one screen

Cover the right column. Work down the left and say each answer before you look.

| Concept                  | What it is                                                                   |
|--------------------------|------------------------------------------------------------------------------|
| Liquidity                | Can we pay what is due soon with what becomes cash soon.                     |
| Leverage                 | How much of the company was paid for with borrowed money.                    |
| Current                  | Within one year. That is the whole meaning of the word.                      |
| Current ratio            | Current assets ÷ current liabilities. Northlight 1.80.                       |
| Quick ratio              | The same test with inventory taken out. Northlight 1.10.                     |
| Why drop inventory       | It is the slowest current asset to become cash, and it might not.            |
| The reversal             | Ridgeway: current 2.40, quick 0.60, and $200,000 short of its bills.         |
| Two quick-ratio formulas | Current assets minus inventory gives 1.10. Cash plus receivables gives 1.04. |
| Debt to equity           | Borrowed ÷ owned. 0.70 on interest-bearing debt for Northlight.              |
| The debt argument        | Total liabilities instead gives 1.04 on the same balance sheet.              |
| The integer trap         | 1260000 / 700000 returns 1. Write `1.0 *` before the division.               |
| The missing filter       | No `WHERE as_of` summed four snapshots and gave 1.92 instead of 1.80.        |
| Comfortable bands        | Current 1.5 to 3.0, quick at or above 1.0, D/E under 2.0. Industry decides.  |
| Too high                 | Idle cash or unsold stock. Not a strength.                                   |
| Window dressing          | Paying $200,000 on 30 December moved 1.80 to 2.12 and changed nothing.       |
| Negative equity          | D/E goes negative. That is not low leverage, it is insolvency.               |
| The deliverable          | The ratio, the dollars behind it, and the trend across four dates.           |

**The one habit to keep.** Keep this one and you can let the rest go. Never report a liquidity ratio without the dollar gap beside it. "Quick ratio 0.60" is a number people nod at. "$300,000 of spendable assets against $500,000 of bills" is a number people act on, and it is the same fact. If the numbers fight back in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

A question back to you, and I do want the answers. The first ratio table I built had a column header that just said "D/E", and two people in the room were reading it as two different numbers for ten minutes before anyone noticed. What is the shortest column header you have seen cause the longest argument?

## References

  * Beaver, W. H. (1966). Financial ratios as predictors of failure. _Journal of Accounting Research_ , 4, 71–111.
  * Altman, E. I. (1968). Financial ratios, discriminant analysis and the prediction of corporate bankruptcy. _The Journal of Finance_ , 23(4), 589–609.
  * Campbell, D. T. (1979). Assessing the impact of planned social change. _Evaluation and Program Planning_ , 2(1), 67–90.
  * Goodhart, C. A. E. (1975). Problems of monetary management: The U.K. experience. Reprinted in _Monetary Theory and Practice: The U.K. Experience_ (pp. 91–121). Macmillan, 1984.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [Current Ratio vs Quick Ratio, and Debt to Equity](https://michaelnocito.github.io/analyst-prep-kit/guides/liquidity-and-leverage-ratios/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
