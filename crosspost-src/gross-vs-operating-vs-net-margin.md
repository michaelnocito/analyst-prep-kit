By the end of this page you can look at an income statement and say, in one sentence, which layer of the business is losing the money. You will know what each of the three margins measures, why they always step down in order, the SQL that computes all three in one pass, and the two ways that SQL quietly returns the wrong number.

Try this before you read another word. Take any two periods of your company's numbers. Work out what percent revenue grew, then what percent profit grew. If profit grew slower, the business got bigger and kept less of each dollar, and the three margins tell you which layer ate the difference.

In one line: a margin is a profit line divided by revenue. Each one subtracts one more layer of cost, so gross is always at least operating, and operating is always at least net.

The stepping-down is the whole shape of it, so it gets the picture.

> _The original carries a diagram here. In words: A single horizontal bar representing one dollar of revenue, drawn four times, one row under the next, each row shorter than the one above it. The top row is the full bar, labeled revenue, running the whole width. The second row is 60 percent as long and labeled gross; the piece missing from its right-hand end is drawn as a hatched block labeled cost of goods. The third row is 22 percent as long and labeled operating; the piece missing from the second row is a hatched block labeled operating expense. The fourth row is 14 percent as long and labeled net; the piece missing from the third row is a hatched block labeled interest and tax. Each hatched block sits directly to the right of the bar it was taken from, so the four rows form a descending staircase with the removed costs stacking to the right. A dashed vertical line marks the left edge shared by every bar, showing that all four are measured from the same starting point, which is revenue. The picture is the reason the three margins can never cross: each one starts from the row above it and can only get shorter._

**Every number on this page is verified, and you can check them.** The worked example is one small company's two most recent years, shown in full below. Every margin, growth rate, subtotal and monthly figure was computed in SQLite and cross-checked in pandas before it went on the page, so you can check any cell by hand and it will agree.

## 1. What a margin is, and why divide by revenue at all

Two years of profit, $538,000 then $560,000. Say whether that company had a good year, and say what you would need to know to be sure.

A margin is a profit line divided by revenue, written as a percent. That is the entire definition. If revenue is $4,000,000 and net income is $560,000, the net margin is 560,000 divided by 4,000,000, which is 0.14, which is 14%.

The reason to divide is that raw profit dollars cannot be compared to anything. A bigger year makes more profit almost automatically, so "profit went up" tells you the company got bigger, not that it got better. Dividing by revenue converts the number into cents kept per sales dollar, and cents kept per dollar can be compared to last year, to the plan, and to a competitor ten times the size.

One warning about the word "kept," because it is doing less work than it sounds like. A margin of 14% does not mean 14 cents of every dollar is in the bank. It means 14 cents survived on paper, and paper and cash part company constantly. A customer who has not paid yet still counts as revenue and still counts as profit. A company can post its best margin ever and miss payroll in the same month. What a business can actually pay is a different question with different arithmetic, and it lives on the balance sheet rather than here: [the current ratio and the quick ratio](https://michaelnocito.github.io/analyst-prep-kit/guides/liquidity-and-leverage-ratios/) are the two numbers that answer it.

Here is the same idea in one line you can hold on to. Profit answers "how much did we make." A margin answers "how much of what came in did we keep, on paper." Those are different questions, and only the second one survives a change in size.

## 2. The three margins, and the layer each one accuses

If a company's product sells profitably but the company loses money overall, which of the three margins would still look healthy?

An income statement is a cascade. Revenue at the top, then costs subtract in layers, and each subtotal along the way is a profit line worth dividing by revenue. Three of those subtotals matter most.

**Gross margin** is gross profit divided by revenue, where gross profit is revenue minus cost of goods sold. Cost of goods sold is what it costs to make or deliver the thing you sold: materials, the people who build it, shipping. Gross margin is the product's own economics. It moves when you change your price or when your suppliers change theirs, and almost nothing else touches it.

**Operating margin** is operating income divided by revenue, where operating income is gross profit minus operating expense. Operating expense is the cost of running the company rather than making the product: sales salaries, rent, software, marketing, the finance team. Operating margin is the core business. It moves when overhead grows faster than sales.

**Net margin** is net income divided by revenue, and net income is what is left after everything, including interest on borrowed money and tax. Net margin moves on how much debt the company carries and what it pays the government, neither of which has much to do with how well the product sells.

So each margin removes one more layer, and that is why they always fall in the same order: gross is at least operating, and operating is at least net. When a company's product is profitable but the company is not, gross margin stays healthy and the collapse shows up below it. The margin that stops looking good is the layer that owes you an explanation.

## 3. The worked income statement, two years side by side

Revenue is about to grow by a third. Guess whether net margin goes up or down, and write your guess down.

Here is the company. It sells coffee equipment, it books everything in whole dollars, and these are its last two fiscal years.

| Line                 | 2023          | 2024          |
|----------------------|---------------|---------------|
| Revenue              | 3,000,000     | 4,000,000     |
| Cost of goods sold   | 1,110,000     | 1,600,000     |
| **Gross profit**     | **1,890,000** | **2,400,000** |
| Operating expense    | 1,116,000     | 1,520,000     |
| **Operating income** | **774,000**   | **880,000**   |
| Interest             | 60,000        | 120,000       |
| Tax                  | 176,000       | 200,000       |
| **Net income**       | **538,000**   | **560,000**   |

Check one column by hand to trust the rest. 2024: 4,000,000 minus 1,600,000 is 2,400,000 gross profit. Minus 1,520,000 of operating expense is 880,000. Minus 120,000 of interest and 200,000 of tax is 560,000.

Now the same two years as margins.

| Margin    | 2023  | 2024  | Change      |
|-----------|-------|-------|-------------|
| Gross     | 63.0% | 60.0% | -3.0 points |
| Operating | 25.8% | 22.0% | -3.8 points |
| Net       | 17.9% | 14.0% | -3.9 points |

Both tables describe the same two years. The first one says the company had its best year. The second one says the company had its worst year in a while. Revenue grew 33.3%, gross profit grew 27.0%, operating income grew 13.7%, and net income grew 4.1%. Every line went up, and every line went up slower than the one above it.

The one sentence this table earns: **the company grew a third bigger and now keeps 14.0 cents of every dollar instead of 17.9.** Put the shortfall in dollars and it stops being abstract. At last year's net margin, $4,000,000 of revenue would have produced $717,333 of net income. It produced $560,000. The difference is $157,333, which is more than a quarter of the profit the company actually made.

Say why net margin can fall while net income rises, in your own words, before reading on. If you can say it, the rest of this page is arithmetic.

## 4. The query, and the division that returns 0

In SQL, `2400000 / 4000000` where both columns are whole numbers. What comes back?

Zero. Not 0.6. Most databases follow the rule that a whole number divided by a whole number is a whole number, so the 0.6 is thrown away and you get 0. Multiply that 0 by 100 afterwards and you get 0. The query runs, the column fills with zeros, and nothing anywhere says an error happened.

The fix is to make one side of the division a decimal, and to do it _before_ the division rather than after. Writing `100.0 *` at the front of the expression turns the whole calculation decimal from that point on.
    
    
    SELECT fiscal_year,
           ROUND(100.0 * (revenue - cogs) / revenue, 1)
             AS gross_margin_pct,
           ROUND(100.0 * (revenue - cogs - operating_expense) / revenue, 1)
             AS operating_margin_pct,
           ROUND(100.0 * (revenue - cogs - operating_expense - interest - tax) / revenue, 1)
             AS net_margin_pct
    FROM income_statement
    ORDER BY fiscal_year;

Run against the two years above, that returns 63.0 / 25.8 / 17.9 and 60.0 / 22.0 / 14.0. Here is the same expression written four ways, all on the 2024 row, so you can see exactly where the decimal has to sit.

| What you write                             | What comes back | Right?                                                                           |
|--------------------------------------------|-----------------|----------------------------------------------------------------------------------|
| `gross_profit / revenue * 100`             | 0               | No. The division happens first and rounds to 0.                                  |
| `100 * gross_profit / revenue`             | 60              | Right this time, wrong in general. It rounds the answer down to a whole percent. |
| `100.0 * gross_profit / revenue`           | 60.0            | Yes.                                                                             |
| `ROUND(100.0 * gross_profit / revenue, 1)` | 60.0            | Yes, and it stops the display carrying twelve decimal places.                    |

Row two is the one that catches people, because on this data it returns 60 and 60 is correct. It is correct by luck. Multiply first and the result is a whole number of percent, so 63.0% would come back as 63 and a genuine 22.4% would come back as 22. You would never see the missing four tenths. The wider version of this rule shows up in every growth calculation, and [month-over-month growth in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-month-over-month/) works the same trap on a different formula.

One more note on `ROUND`. It does not protect you from integer division, because by the time `ROUND` sees the value the 0 has already happened. `ROUND(0, 1)` is `0.0`, which looks like a decimal calculation and is not one.

## 5. Averaging monthly margins loses 3.1 points

You have twelve monthly operating margins. Somebody asks for the year's operating margin. Is averaging the twelve the right move?

No, and here is the size of the mistake. This is the same 2024 as above, split into the twelve months it was made of. Cost of goods runs at 40% of each month's revenue, and operating expense is a fixed $110,000 base plus 5% of revenue, which is what a real cost structure looks like: some of it scales with sales and some of it arrives whether you sell anything or not.

| Month   | Revenue | Cost of goods | Operating expense | Operating income | Operating margin |
|---------|---------|---------------|-------------------|------------------|------------------|
| 2024-01 | 180,000 | 72,000        | 119,000           | -11,000          | -6.1%            |
| 2024-02 | 195,000 | 78,000        | 119,750           | -2,750           | -1.4%            |
| 2024-03 | 250,000 | 100,000       | 122,500           | 27,500           | 11.0%            |
| 2024-04 | 300,000 | 120,000       | 125,000           | 55,000           | 18.3%            |
| 2024-05 | 330,000 | 132,000       | 126,500           | 71,500           | 21.7%            |
| 2024-06 | 360,000 | 144,000       | 128,000           | 88,000           | 24.4%            |
| 2024-07 | 340,000 | 136,000       | 127,000           | 77,000           | 22.6%            |
| 2024-08 | 315,000 | 126,000       | 125,750           | 63,250           | 20.1%            |
| 2024-09 | 350,000 | 140,000       | 127,500           | 82,500           | 23.6%            |
| 2024-10 | 400,000 | 160,000       | 130,000           | 110,000          | 27.5%            |
| 2024-11 | 480,000 | 192,000       | 134,000           | 154,000          | 32.1%            |
| 2024-12 | 500,000 | 200,000       | 135,000           | 165,000          | 33.0%            |

Those twelve rows add to exactly the annual numbers: $4,000,000 of revenue, $1,600,000 of cost of goods, $1,520,000 of operating expense. Now the two ways to answer "what was our operating margin this year."
    
    
    -- Wrong. Averages twelve percentages as if each month were the same size.
    SELECT ROUND(AVG(100.0 * (revenue - cogs - operating_expense) / revenue), 1)
    FROM monthly_pl;                                     -- 18.9
    
    -- Right. Adds the money first, divides once.
    SELECT ROUND(100.0 * SUM(revenue - cogs - operating_expense) / SUM(revenue), 1)
    FROM monthly_pl;                                     -- 22.0

Three point one percentage points apart, from the same twelve rows. On $4,000,000 of revenue that gap is $124,000 of profit that the first query cannot see.

The reason is that January's revenue of $180,000 and December's $500,000 count equally in an average of percentages, and they are not equal amounts of business. January lost money, at an operating margin of -6.1%, on less than half the revenue of a good month. Averaging lets that small bad month push the answer down as hard as a large good month pushes it up.

The rule that fixes it: **add the money, then divide once.** A margin is a ratio, and ratios are not averaged, they are recomputed on the totals. This is the same reasoning that makes a class's overall pass rate different from the average of each teacher's pass rate, and it is worth recognising by name, because it shows up whenever a rate is rolled up from parts of different sizes.

Picture running that `AVG` query on your own company's monthly figures. Do you have a January, a quiet month with the same fixed costs as a busy one? If you do, your averaged margin is already wrong, and it is wrong in the optimistic direction whenever the quiet months are the profitable ones.

## 6. Reading a margin: the four benchmarks

A company reports a 2% net margin. Good or bad?

Unanswerable, and that is the point. Two percent is healthy for a grocery chain and alarming for a software company. A margin on its own is a number with no verdict attached, and it becomes an analysis only when you put it next to something. There are four somethings, and they answer different questions.

**Against its own past.** Same company, earlier period. This is the one that always works, because the company is its own control: same products, same customers, same accounting. Our example gives 17.9% falling to 14.0%, and that comparison needs no outside information at all.

**Against the plan.** The margin the budget assumed. A miss against plan is a different conversation from a fall against last year, because someone chose the plan number and can be asked why. [Budget vs actual variance](https://michaelnocito.github.io/analyst-prep-kit/guides/budget-vs-actual-variance/) is the full method for that comparison.

**Against the industry.** Grocery retail runs on net margins of a few percent because it turns over enormous volume at tiny per-item profit. Packaged software can run above 20% because the cost of the next copy is close to nothing. A margin outside its industry's usual band is either a real advantage or an accounting difference, and it is worth finding out which before you present it.

**Against a specific peer.** The most useful comparison, and the one that points at a cause. Take two companies with the same gross margin.

| Company | Revenue   | Gross margin | Operating margin | Net margin |
|---------|-----------|--------------|------------------|------------|
| Ours    | 4,000,000 | 60.0%        | 22.0%            | 14.0%      |
| Peer    | 4,000,000 | 60.0%        | 29.0%            | 23.5%      |

Identical products, as far as gross margin can tell. Nine and a half points apart at the bottom. The cascade says exactly where to look: the two companies spend $1,520,000 and $1,240,000 on operating expense, a $280,000 gap, and below that our interest and tax take $320,000 against their $220,000. Same product economics, more overhead, more debt. That is a finding, and it took no information beyond two income statements.

## 7. The full before and after

Same company, same two years, two ways of reporting it.

### Before

"Revenue up $1,000,000 to $4,000,000. Gross profit up $510,000. Net income up $22,000 to $560,000. A record year on every line." Every sentence is true. A reader gets no way to tell that the company is keeping less of what it earns, because nothing on the page is measured against anything. The $22,000 improvement even reads as good news, which is the part that costs you credibility three months later.

### After

| Measure          | 2023      | 2024      | Read                                         |
|------------------|-----------|-----------|----------------------------------------------|
| Revenue          | 3,000,000 | 4,000,000 | +33.3%                                       |
| Gross margin     | 63.0%     | 60.0%     | -3.0 pts, pricing or input costs             |
| Operating margin | 25.8%     | 22.0%     | -3.8 pts, overhead grew faster than sales    |
| Net margin       | 17.9%     | 14.0%     | -3.9 pts, interest doubled to 120,000        |
| Net income       | 538,000   | 560,000   | +4.1%, and $157,333 below last year's margin |

Same numbers, plus one division per row. The report now names three separate causes and sizes each one, and the last row converts the whole thing into the only unit a manager acts on, which is dollars. The claim on the top of the email writes itself: **we grew 33.3% and net margin fell 3.9 points, which cost $157,333 against holding last year's rate.**

## 8. Edge cases that break the cascade

Net margin comes out higher than operating margin. Name something that could do that.

**A one-off gain below the line.** Sell a building for $400,000 and net income becomes $960,000 on the same $4,000,000 of revenue. Net margin is 24.0% and operating margin is 22.0%, so the cascade is upside down. Nothing is broken. Money arrived from somewhere that is not the business, and next year it will not. Whenever net sits above operating, look for a sale, a legal settlement, or a tax credit, and say so in the same sentence as the number.

**Cost of goods and operating expense are not defined the same way everywhere.** Whether shipping, customer support, or the cloud bill sits above or below the gross-profit line is a choice each company makes. Two companies can have genuinely identical economics and gross margins eight points apart. That does not make either wrong, and it does make a gross-margin comparison between two companies weaker than it looks. The comparison inside one company across time is always the safer one.

**A negative revenue or a zero revenue makes the percent meaningless.** A month with no sales divides by zero, and depending on the database that is an error or a null. Guard it: `CASE WHEN revenue > 0 THEN 100.0 * profit / revenue END`. A blank is honest. A zero is a lie, because 0% margin means you broke even, not that you had no revenue.

**Points are not percents, and mixing them up is common in writing.** Net margin fell from 17.9% to 14.0%. That is a fall of 3.9 _percentage points_. It is also a fall of about 22% _of the margin_ , because 3.9 is close to a fifth of 17.9. Both are true, they are wildly different numbers, and only one of them belongs in a sentence at a time. Say "points" when you mean the subtraction.

**Margins hide mix.** A company selling two products at 80% and 40% gross margin has an overall gross margin somewhere in between, and that overall number moves whenever the sales mix moves, even if neither product changed at all. If your gross margin dropped and no price changed, check whether you simply sold more of the cheaper thing.

## Why this works

The rule in section five, add the money then divide once, is not a style preference. Combining groups of different sizes can reverse the direction of a rate, an effect first set out formally by Simpson (Simpson, 1951, _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241) and traced to Yule half a century earlier. Blyth's later treatment gives the plainest statement of the danger: an association that holds in every subgroup can vanish or flip when the subgroups are pooled (Blyth, 1972, _Journal of the American Statistical Association_ , 67(338), 364–366). Averaging twelve monthly margins pools twelve groups of very different sizes while pretending they are equal, which is exactly the condition those papers warn about, and the 3.1-point gap on this page is the mild version of it.

The question at the top of each section is not decoration. Attempting an answer before you are given one improves learning of that specific material, an effect measured across sixty-four studies of self-explanation prompts (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing what `2400000 / 4000000` returns before section four told you is why you will still remember it next month. The same evidence says the cheat sheet below works best covered up and recalled rather than reread (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255).

## Using this on your own numbers

Retrofitting margins onto every report you have inherited is a slog, and the old ones have owners who like them. Do this instead, in order.

  1. **Add three columns to the report you already own.** Gross, operating and net margin next to the dollars. Three divisions, and the dollars stay exactly where they are so nobody has to relearn the page.
  2. **Check the division is decimal.** Run one row by hand. If a margin comes back as 0, 60 or 1, you have integer division, and section four has the fix.
  3. **Put last year's margin in the next column.** This is the comparison that always works and it needs no outside data.
  4. **Search your codebase for`AVG(` next to a division.** Every one of those is a rate being averaged, and each one needs checking against the sum-then-divide version. Fix the ones that disagree by more than a rounding step.
  5. **Convert one margin change into dollars every cycle.** Last year's rate times this year's revenue, minus this year's actual. That single number is what makes a manager act.
  6. **Write the industry band down once, somewhere permanent.** Your own sector's usual range, in a comment at the top of the query. Six months from now nobody will remember whether 14% was good.

If you have paper nearby, one optional drawing locks the core idea in. Draw the staircase from the top of this page from memory: four bars measured from the same left edge, each shorter than the one above, with the removed cost hatched beside it. Label the three layers you strip. If your bars come out the same length, or in the wrong order, the page is still open.

**This page is one of five.** The Financial analysis set on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/) is this page plus [Current Ratio vs Quick Ratio](https://michaelnocito.github.io/analyst-prep-kit/guides/liquidity-and-leverage-ratios/), [Contribution Margin and Break-Even](https://michaelnocito.github.io/analyst-prep-kit/guides/contribution-margin-break-even/), [Net Present Value (NPV)](https://michaelnocito.github.io/analyst-prep-kit/guides/net-present-value-npv/) and [Budget vs Actual Variance](https://michaelnocito.github.io/analyst-prep-kit/guides/budget-vs-actual-variance/). They share a worked company, so the numbers carry across. The index also holds every other how-to: SQL, Excel, Tableau, and the working habits around them.

## The whole thing on one screen

Cover the right column and work down the left. Saying each answer out loud before you look is what makes it stick.

| Concept                 | What it is                                                                         |
|-------------------------|------------------------------------------------------------------------------------|
| Margin                  | A profit line divided by revenue. Cents kept per sales dollar.                     |
| Kept, on paper          | A 14% margin is not 14 cents in the bank. Unpaid customers still count as profit.  |
| Why divide              | Profit dollars grow with size. A margin survives a change in size.                 |
| Gross margin            | (Revenue − cost of goods) ÷ revenue. The product's own economics.                  |
| Operating margin        | Operating income ÷ revenue. The core business, before financing and tax.           |
| Net margin              | Net income ÷ revenue. What is left after absolutely everything.                    |
| The cascade rule        | Gross ≥ operating ≥ net. Each strips one more layer of cost.                       |
| Reading the cascade     | The first margin that stops looking healthy names the layer to investigate.        |
| The integer trap        | 2400000 / 4000000 returns 0. Put `100.0 *` at the front, before the division.      |
| Why ROUND does not help | The 0 already happened. ROUND(0, 1) is 0.0 and looks fine.                         |
| The averaging trap      | AVG of twelve monthly margins gave 18.9%. The truth was 22.0%.                     |
| The rule that fixes it  | Add the money, then divide once. SUM(profit) / SUM(revenue).                       |
| Four benchmarks         | Its own past, the plan, the industry, a named peer.                                |
| Net above operating     | Money arrived from outside the business. Find it and say so.                       |
| Points vs percent       | 17.9 to 14.0 is 3.9 points, and also about 22% of the margin. Pick one.            |
| Mix                     | Selling more of the cheaper product moves the blended margin with no price change. |
| The deliverable         | One sentence: the margin, the direction, and what it cost in dollars.              |

**The one habit to keep.** One habit, if you keep only one. Never average a rate. Add the numerators, add the denominators, divide once. That one habit covers margins, conversion rates, defect rates, retention and every other percentage you will ever roll up. If a query fights back in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first margin I ever reported was averaged across months, and it was wrong by about three points for four straight quarters before anyone checked. Nobody caught it because it was in the right neighbourhood every single time. What is the wrongest number you have shipped that survived because it looked reasonable?

## References

  * Simpson, E. H. (1951). The interpretation of interaction in contingency tables. _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241.
  * Blyth, C. R. (1972). On Simpson's paradox and the sure-thing principle. _Journal of the American Statistical Association_ , 67(338), 364–366.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*Originally published on Analyst Prep Kit: [Gross vs Operating vs Net Margin: What Each One Tells You](https://michaelnocito.github.io/analyst-prep-kit/guides/gross-vs-operating-vs-net-margin/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
