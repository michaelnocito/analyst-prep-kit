By the end of this page you can take a project that costs money now and pays money later, and produce one number that says whether it is worth doing. You will know the discount factor and where it comes from, the SQL that computes NPV in one line, the three ways that line silently returns the wrong answer, and how to present a result whose whole meaning depends on an assumption you chose.

The fastest way in is to do it once on something real. Take any project with an upfront cost and a few years of expected returns. Divide each future year's cash by 1.10 raised to that year's number, add them all up, then subtract the upfront cost. If what is left is positive, the project beats a 10% required return.

The whole idea in one line: a dollar arriving in five years is not a dollar. NPV shrinks every future amount down to what it is worth today, then adds the whole stream up, including the negative one at the start.

The shrinking is the idea the rest of the page rests on, so it gets the picture.

> _The original carries a diagram here. In words: Five vertical bars rising from a common baseline, one for each of years one to five. The full height of each bar is the cash the project expects to collect in that year, and the bars grow steadily taller from left to right, from one hundred and fifty thousand in year one to one hundred and ninety thousand in year five. Each bar is split into two parts. The solid accent-colored part at the bottom is what that cash is worth today after discounting at ten percent, and the pale hatched cap sitting on top of it is the part the waiting takes away. The solid parts shrink steadily from left to right, from about one hundred and thirty six thousand down to about one hundred and eighteen thousand, while the pale caps grow from a thin sliver in year one to a thick block in year five. A dashed line joins the tops of the five solid parts and slopes downward across the chart, against bars that are getting taller. That opposition is the whole point: a payment can be bigger and still be worth less, because each extra year of waiting divides it by another factor of one point one. A small legend at the top right pairs a pale swatch with the word waiting and a solid swatch with the word today._

**Every number on this page is verified, and you can check them.** The worked project is six rows, shown in full below. Every discount factor, present value, NPV, rate table and error figure was computed in SQLite and cross-checked in pandas before it went on the page, so you can check any row on a calculator and it will agree.

## 1. Why a future dollar is worth less, in arithmetic rather than words

You are offered $100 today or $100 in a year. Beyond simple impatience, name one concrete reason today is worth more.

Because $100 today can be doing something for the next year. Put it somewhere that returns 10% and by this time next year it is $110. So $100 today and $100 next year are not the same offer, and the size of the difference is whatever return you could have got.

Run that backwards and you have the whole method. If $100 today grows to $110 in a year, then $110 arriving in a year is worth exactly $100 today. Growing forwards multiplies by 1.10. Coming backwards divides by 1.10. The dividing is called discounting, and the 10% is called the discount rate.

Do it twice for two years. $100 today grows to $110, then to $121. So $121 in two years is worth $100 today, and the division is by 1.10 twice, which is 1.21. Three years is 1.331. The number you divide by grows fast, which is why money far in the future gets cut down hard.

Two numbers to hold on to, both from this page's project. At a 10% discount rate, a dollar arriving in five years is worth 62 cents today. Raise the rate to 15% and the same dollar is worth 50 cents. Nothing about the dollar changed. The rate did.

## 2. The discount factor, and the year-0 rule

What should the discount factor be for money you spend today?

One. Money spent today is already in today's dollars, so it does not get discounted at all, and dividing by 1 leaves it alone. That is not a special case bolted onto the formula. It falls out of it, because any number raised to the power of 0 is 1.

The discount factor for year _t_ at rate _r_ is `(1 + r)` raised to the power _t_. Present value is the cash flow divided by that factor.

| Year | Factor at 10% | How it is built     | A dollar is worth |
|------|---------------|---------------------|-------------------|
| 0    | 1.0000        | 1.10 to the power 0 | 100 cents         |
| 1    | 1.1000        | 1.10                | 91 cents          |
| 2    | 1.2100        | 1.10 × 1.10         | 83 cents          |
| 3    | 1.3310        | 1.10 × 1.10 × 1.10  | 75 cents          |
| 4    | 1.4641        | and again           | 68 cents          |
| 5    | 1.61051       | and again           | 62 cents          |

Net present value is the sum of every year's present value, with the upfront cost included as a negative number at year 0. The word "net" is that subtraction. A present value that ignores the cost is not an NPV, and section five shows what that mistake looks like when it reaches a slide.

The decision rule is one line. NPV above zero means the project earns more than the rate you required of it, so it adds value. NPV below zero means it does not. NPV of exactly zero means it earns precisely the required return, no more.

## 3. The worked project, row by row

A project costs $500,000 today and pays back $850,000 over five years. Guess whether it clears a 10% required return, and by roughly how much.

Here is the project. A production line expansion: $500,000 to build, then five years of extra cash from the capacity it adds. The required return is 10%.

| Year    | Cash flow   | Factor at 10% | Present value |
|---------|-------------|---------------|---------------|
| 0       | -500,000    | 1.0000        | -500,000      |
| 1       | 150,000     | 1.1000        | 136,364       |
| 2       | 160,000     | 1.2100        | 132,231       |
| 3       | 170,000     | 1.3310        | 127,724       |
| 4       | 180,000     | 1.4641        | 122,942       |
| 5       | 190,000     | 1.61051       | 117,975       |
| **NPV** | **350,000** |               | **137,236**   |

Check one row by hand to trust the rest. Year 3: 170,000 divided by 1.331 is 127,723.5, which rounds to 127,724. Add the present-value column and you get 137,236.

Look at the two totals on the bottom row, because they are the whole lesson. Undiscounted, the project nets $350,000. Discounted at 10%, it nets $137,236. The $212,764 difference is not a cost anyone pays and not a number in any ledger. It is the return you would have earned on that money elsewhere over five years, and NPV charges the project for it.

The verdict, in a sentence someone can act on: **the line expansion is worth $137,236 more than the 10% return we could get elsewhere on the same $500,000.** Notice how much work "at 10%" is doing in that sentence. Section six is about how much.

Say why the discounted total is smaller than the undiscounted one, in your own words, before reading on. If you can say it, the rest of this page is careful arithmetic.

## 4. The query, and the rate written as 10/100

In SQL, what does `10/100` return when both are whole numbers?

Zero. And that turns the whole NPV calculation into something else without changing a single row of data. Follow it through: `10/100` is 0, so `1 + 10/100` is 1, so `POWER(1, year)` is 1 for every year, so every cash flow is divided by 1 and no discounting happens at all. The query runs, returns $350,000, and $350,000 is just the raw sum of the cash-flow column.

That is the worst kind of wrong. It is not an error, it is not a null, and $350,000 is a believable answer for this project. The only way to catch it is to know it can happen.

The working query, with the rate written as a decimal.
    
    
    SELECT ROUND(SUM(cash_flow / POWER(1 + 0.10, year)), 0) AS npv
    FROM project_cash_flows
    WHERE project = 'Line Expansion';        -- 137236

And the same idea one row at a time, which is what you actually want on screen, because a single NPV number is impossible to check.
    
    
    SELECT year,
           cash_flow,
           ROUND(POWER(1 + 0.10, year), 4)             AS discount_factor,
           ROUND(cash_flow / POWER(1 + 0.10, year), 0) AS present_value
    FROM project_cash_flows
    WHERE project = 'Line Expansion'
    ORDER BY year;

Three notes on the arithmetic, all worth checking once on your own database.

| What you write         | Returns | Why                                             |
|------------------------|---------|-------------------------------------------------|
| `10/100`               | 0       | Whole divided by whole. The rate vanishes.      |
| `10/100.0`             | 0.1     | One decimal makes the whole expression decimal. |
| `POWER(1 + 10/100, 5)` | 1.0     | Every factor is 1. No discounting happened.     |
| `POWER(1 + 0.10, 5)`   | 1.61051 | Correct.                                        |

`POWER` itself is safe, because it returns a decimal even when handed whole numbers, so `cash_flow / POWER(...)` stays decimal. The danger is entirely in how the rate reaches it. Write rates as `0.10`. If the rate has to come from a column, make that column a decimal type when the table is created, and check one value before you trust the output. The same trap in its percentage form is worked in [gross vs operating vs net margin](https://michaelnocito.github.io/analyst-prep-kit/guides/gross-vs-operating-vs-net-margin/).

One portability note. `POWER` exists in SQLite, PostgreSQL, SQL Server, MySQL, Oracle, Snowflake and BigQuery, though older SQLite builds may not have it compiled in. Where it is missing, `EXP(year * LN(1 + 0.10))` is the same calculation and works anywhere that has logs.

## 5. Two off-by-one errors, and which one flips the decision

Your cash-flow table was built with a row number instead of a year number, so the first inflow is labelled 0 instead of 1. Does NPV come out too high or too low?

Too high, and by a lot. Every inflow is being discounted one year less than it should be, so each one is worth more today than it really is, while the cost at year 0 is untouched. On this project the correct answer is $137,236 and the mislabelled one is $200,960, an overstatement of $63,724, which is 46%.

It matters because it can change the answer. Take the same five inflows against a $660,000 upfront cost instead of $500,000.

| Version                           | NPV at 10% | Decision |
|-----------------------------------|------------|----------|
| Inflows correctly at years 1 to 5 | -22,764    | Reject   |
| Inflows mislabelled 0 to 4        | +40,960    | Accept   |

A row number and a year number look identical in a table. Nothing in the query can tell them apart. The check that catches it takes five seconds: **the year-0 row is the money you spend today, and it should be the only negative one and the only one whose present value equals its cash flow.** If your year-0 row is an inflow, the labels are shifted.

The second off-by-one is worth knowing because it behaves completely differently. If the _whole_ stream shifts, cost and all, so the cost sits at year 1 and the inflows at 2 to 6, then every present value gets divided by one extra 1.10 and NPV goes from $137,236 to $124,760. That is exactly $137,236 divided by 1.10. Because everything moved together, the sign cannot change, so the accept-or-reject decision is always safe even though the value is 9.1% off. Only the partial shift is dangerous, and the partial shift is the one that happens.

The third mistake in this family has nothing to do with years. The upfront cost simply is not in the table, because it lives in a different system, or because someone filtered on `year > 0` to drop what looked like an empty row.
    
    
    SELECT ROUND(SUM(cash_flow / POWER(1 + 0.10, year)), 0)
    FROM project_cash_flows
    WHERE project = 'Line Expansion' AND year > 0;      -- 637236

$637,236, against a real NPV of $137,236. Overstated by exactly the $500,000 that was left out, and there is nothing in the number itself to say so. That is a present value, not a net present value, and the missing word is the entire cost of the project.

Picture your own company's project table. Where does the upfront cost live, and is it a row in the same table as the returns? If it lives in a capital budget somewhere else, every NPV anyone runs on that table is a gross present value wearing the wrong name.

## 6. The rate is the assumption, and IRR is the other way round

Same five cash flows, same $500,000 cost. Guess what rate would make this project not worth doing.

Just under 20%. Here is the same project at seven different required returns, with nothing else changed.

| Discount rate | NPV     | Decision |
|---------------|---------|----------|
| 0%            | 350,000 | Accept   |
| 5%            | 231,791 | Accept   |
| 10%           | 137,236 | Accept   |
| 15%           | 60,575  | Accept   |
| 20%           | -2,347  | Reject   |
| 25%           | -54,573 | Reject   |
| 30%           | -98,367 | Reject   |

One project, one set of cash flows, and the verdict flips between 15% and 20%. Every row is arithmetically perfect. The rate is not something the data tells you; it is something you choose and then have to defend. An NPV presented without the rate beside it is not a result, it is half of one.

Where the rate comes from, in practice. It is the return the company requires on money it puts at risk, usually its weighted average cost of capital, sometimes a hurdle rate set by the finance team, sometimes the return available on a comparable investment. Riskier projects get a higher rate, which is how risk enters the arithmetic: a higher rate punishes distant cash flows hardest, so speculative projects with far-off payoffs have to be much bigger to clear.

The rate that makes NPV exactly zero has a name: the internal rate of return, or IRR. On this project it is 19.80%. Read it as the project's own return, the break-even required rate. Above it the project is worth doing; below it, not.

IRR is not a SQL calculation. There is no closed-form solution, so it is found by trying rates until NPV lands on zero, which needs iteration that plain SQL does not do. That is why the practical division of labour is: compute NPV in SQL at the rate your company uses, and hand IRR to a spreadsheet or a Python script. If you want an approximate IRR without leaving SQL, run the NPV query at a handful of rates as above and read off where the sign changes. Between 15% and 20% here, and 19.80% when solved properly.

Two more numbers worth having, both from the same project. Payback period, the point where the undiscounted cash adds back up to the cost, is 3.11 years. Discounted payback, the same question in today's dollars, is 3.84 years. Payback is easy to explain and it ignores everything that happens after it lands, which is why it is a useful second number and a poor first one.

## 7. The full before and after

Same project, two ways of putting it in front of a decision maker.

### Before

"The line expansion costs $500,000 and returns $850,000 over five years, a 70% return. Recommend approval." Nothing there is false. The reader has no way to know that the $850,000 arrives slowly, that the return is 70% spread over five years rather than 70% a year, or that the same project loses money if the company's required return is 20%. And the single number carries no rate, so nobody in the room can disagree with it usefully.

### After

| Measure            | Value      | Read                            |
|--------------------|------------|---------------------------------|
| Upfront cost       | -500,000   | Year 0, spent today             |
| Total inflows      | 850,000    | Undiscounted, years 1 to 5      |
| Discount rate used | 10%        | The company hurdle rate, stated |
| NPV at 10%         | +137,236   | Clears the hurdle               |
| NPV at 15%         | +60,575    | Still clears it                 |
| NPV at 20%         | -2,347     | Does not                        |
| IRR                | 19.80%     | The rate where it breaks even   |
| Discounted payback | 3.84 years | When today's dollars come back  |

Same project, four extra rows, and the whole conversation changes. The rate is on the page, so it can be argued with. Two other rates are on the page, so the reader can see how much room there is before the answer changes. And the recommendation now has a shape: **fund it if our required return is below about 19.8%, and the margin gets thin above 15%.** That is a sentence a finance director can either agree with or correct, which is the most useful thing an analysis can be.

## 8. Edge cases NPV cannot see

NPV comes out at exactly zero. Accept or reject?

**Zero means it earns precisely the required return.** It is not a failure and it is not a win. The project would return exactly what the money would have earned elsewhere, so on the numbers alone it is a coin toss, and the decision moves to everything the numbers left out: strategy, risk, what else the money could do, what the team learns by doing it.

**Cash flow is not profit.** NPV wants cash moving in and out, not accounting profit. Depreciation is a real expense on the income statement and no cash leaves the building, so it does not belong in a cash-flow row. If someone hands you a project's projected profit and asks for an NPV, the first job is converting it back to cash.

**The end of the model is not the end of the project.** A production line that still works in year 6 has value that a five-year model gives away for nothing. Either extend the model or add a terminal value in the final year. Whichever you do, say so, because a five-year NPV on a fifteen-year asset understates it badly.

**The cash flows are forecasts, and NPV reports to the nearest dollar.** $137,236 has six digits of apparent precision built on estimates that could be 20% out either way. Presenting NPV to the dollar invites a confidence nobody has earned. Round to the nearest thousand in the summary, keep the full number in the working, and show at least one alternative rate so the range is visible.

**Years are not always the right period.** If cash arrives monthly, discount monthly, and the rate has to be converted first. A 10% annual rate is not 10 divided by 12 per month; it is 1.10 raised to the power of one twelfth, minus 1, which is about 0.797% a month. Mixing an annual rate with monthly periods is a large error dressed as a small one.

**Sign conventions have to be consistent.** Every model needs one rule: costs negative, inflows positive. A cost stored as a positive number in a column the query then adds up will not fail, it will just tell you the project is wonderful.

## Why this works

Discounting is not a modern convenience. Fisher set out the theory that the value of an asset is its future income discounted to the present, and that the rate connecting them is the market rate of interest (Fisher, 1930, _The Theory of Interest_ , Macmillan). Hirshleifer's later paper is the cleaner statement of why NPV rather than IRR should decide, showing that the present-value rule follows directly from optimal investment choice while rate-of-return rules can rank projects wrongly (Hirshleifer, 1958, _Journal of Political Economy_ , 66(4), 329–352). That is the formal version of section six's point: IRR is a useful second number and a poor rule.

The stronger practical reason to keep the year-by-year table on screen, rather than a single NPV, is that people are bad at future money in a specific and measurable way. Thaler found the implied discount rate people apply falls sharply as the delay lengthens, so a single constant rate does not describe how anyone actually feels about it (Thaler, 1981, _Economics Letters_ , 8(3), 201–207). Frederick, Loewenstein and O'Donoghue's review of the field found implied annual rates in the published literature ranging from below zero to many thousand percent, depending only on how the question was asked (Frederick, Loewenstein, & O'Donoghue, 2002, _Journal of Economic Literature_ , 40(2), 351–401). A reader shown one NPV has to trust your rate. A reader shown the schedule and three rates can find their own.

The question at the top of each section is deliberate. Attempting an answer before receiving one improves learning of that specific material across sixty-four studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing what `10/100` returns, before section four told you, is why that one will still be with you the next time you write a rate into a query.

## Using this on your own numbers

Rebuilding every capital model in the company is not a job anyone will thank you for. Do this instead, in order.

  1. **Show the schedule, not just the NPV.** Year, cash flow, factor, present value. Four columns, and it makes every other check on this list possible.
  2. **Verify the year-0 row.** It should be negative, and its present value should equal its cash flow exactly. If it does not, your factors or your labels are wrong.
  3. **Check the rate reached the query as a decimal.** Run `SELECT POWER(1 + your_rate, 5)` on its own. If it returns 1, the rate vanished, and section four has the fix.
  4. **Put the rate in the output.** A column or a header, not a comment in the code. An NPV without its rate cannot be checked by the person reading it.
  5. **Run it at two more rates, one above and one below.** This is one more query and it converts a number into a range, which is what the estimate always was.
  6. **Find where the sign changes and report that as the approximate IRR.** If the decision is close, take the exact figure from a spreadsheet, and say which method you used.

Optional, and only if there is paper to hand. One drawing fixes this. Draw the figure from the top of this page from memory: five outlined bars getting taller left to right, five solid bars in front of them getting shorter, and the point where the two trends cross. Label one axis with the years. If your solid bars grow along with the outlines, the discounting has not landed yet, and the page is still open.

**This page is one of five.** The Financial analysis set on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/) is this page plus [Gross vs Operating vs Net Margin](https://michaelnocito.github.io/analyst-prep-kit/guides/gross-vs-operating-vs-net-margin/), [Current Ratio vs Quick Ratio](https://michaelnocito.github.io/analyst-prep-kit/guides/liquidity-and-leverage-ratios/), [Contribution Margin and Break-Even](https://michaelnocito.github.io/analyst-prep-kit/guides/contribution-margin-break-even/) and [Budget vs Actual Variance](https://michaelnocito.github.io/analyst-prep-kit/guides/budget-vs-actual-variance/). They share a worked company, so the numbers carry across. The index also holds every other how-to: SQL, Excel, Tableau, and the working habits around them.

## The whole thing on one screen

Cover the right column first. This one works as a test and does very little as a reread.

| Concept             | What it is                                                                     |
|---------------------|--------------------------------------------------------------------------------|
| Time value of money | Today's dollar can be invested, so it is worth more than tomorrow's.           |
| Discounting         | Dividing a future amount back to what it is worth today.                       |
| Discount factor     | (1 + rate) raised to the power of the year. At 10%, year 5 is 1.6105.          |
| Present value       | Cash flow ÷ discount factor. 190,000 in year 5 is 117,975 today.               |
| The year-0 rule     | Factor is 1, so today's money is undiscounted. Anything to the power 0 is 1.   |
| Net present value   | Every year's present value added up, including the negative cost.              |
| The word "net"      | The upfront cost is in there. Without it you have a present value, not an NPV. |
| The decision rule   | Above zero, it beats the required return. Below zero, it does not.             |
| The worked answer   | -500,000 then 150k to 190k over five years is +137,236 at 10%.                 |
| The rate trap       | Writing 10/100 gives 0, every factor becomes 1, and NPV returns the raw sum.   |
| The partial shift   | Inflows labelled 0 to 4 gave 200,960 instead of 137,236, and flipped a reject. |
| The whole shift     | Everything one year late divides NPV by 1.10. Wrong value, safe decision.      |
| The missing cost    | Filtering out year 0 gave 637,236. Overstated by exactly the cost.             |
| Rate sensitivity    | Same project: +137,236 at 10%, +60,575 at 15%, -2,347 at 20%.                  |
| IRR                 | The rate where NPV is zero. 19.80% here. Needs iteration, so not SQL.          |
| Payback             | 3.11 years undiscounted, 3.84 discounted. Ignores everything after.            |
| Cash, not profit    | Depreciation is an expense and not a cash flow. Convert before discounting.    |
| The deliverable     | The schedule, the rate, and NPV at two other rates beside it.                  |

**The one habit to keep.** If only one thing survives the week, make it this. Never present an NPV without the discount rate next to it, in the output rather than in the code. The rate is the only part of the calculation that was a judgement, it is the part most likely to be wrong, and it is the part the person reading is best placed to correct. If a model fights back in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One thing I have never settled, and I would like to know how other people handle it. The first discounted model I built used a rate somebody had typed into a spreadsheet four years earlier, and nobody in the company could say where it came from. What is the oldest unexplained assumption still running in a model you rely on?

## References

  * Fisher, I. (1930). _The Theory of Interest: As Determined by Impatience to Spend Income and Opportunity to Invest It_. Macmillan.
  * Hirshleifer, J. (1958). On the theory of optimal investment decision. _Journal of Political Economy_ , 66(4), 329–352.
  * Thaler, R. (1981). Some empirical evidence on dynamic inconsistency. _Economics Letters_ , 8(3), 201–207.
  * Frederick, S., Loewenstein, G., & O'Donoghue, T. (2002). Time discounting and time preference: A critical review. _Journal of Economic Literature_ , 40(2), 351–401.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [Net Present Value (NPV): How to Discount Cash Flows and Read the Answer](https://michaelnocito.github.io/analyst-prep-kit/guides/net-present-value-npv/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
