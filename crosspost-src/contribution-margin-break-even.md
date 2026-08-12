By the end of this page you can answer three questions that come up constantly and get answered wrong: does one more sale make money, how many sales cover the fixed base, and what a discount actually costs. You will know the contribution margin formula, the break-even formula, the SQL for both, and the one mistake that turns a 750-unit answer into a 12,000-unit answer.

Start here, on one product, today. Take one product and split its costs into two piles: costs that happen because you sold that unit, and costs that would have happened anyway. Subtract only the first pile from the price. That number is what each sale is really worth, and almost nobody has it to hand.

Two formulas, and that is the lot. Contribution margin is price minus variable cost. Divide the fixed costs by it and you get break-even, the number of units where the business stops losing money.

Where the fixed costs sit is the thing everybody gets wrong, so it gets the picture.

> _The original carries a diagram here. In words: Two panels, each showing a single tall bar that represents the selling price of one unit, split into stacked segments. In the left panel, marked with a check, the price bar has just two segments: a hatched grey lower segment labeled variable, taking up sixty percent of the height, and a solid accent-colored upper segment labeled contribution, taking up the other forty percent. To the right of that bar, and deliberately not touching it, sits a separate wide low box with a dashed outline, labeled fixed. It is drawn wide and short so it reads as a container for a month of overhead rather than as anything belonging to one unit. An arrow runs from the contribution segment down into that box, and the bottom of the box is partly filled with small solid tiles, each one the same color as the contribution segment. The tiles say that the contribution from each sale is what fills the fixed box, and that filling it up is what break-even means. In the right panel, marked with a cross, the same price bar has been divided three ways instead of two: the same hatched variable segment at the bottom, then a segment above it labeled fixed share drawn with the same dashed outline as the fixed box in the left panel, so the eye can see it is that box carved up and pushed inside the unit, and finally a solid accent-colored sliver at the very top that is only a sixteenth as tall as the contribution segment in the left panel. There is no separate fixed box standing beside the right-hand bar, because it has been dissolved into it. The picture shows that the same product yields a large contribution or a tiny one depending only on whether the fixed cost was allowed inside the bar._

**Every number on this page is verified, and you can check them.** The worked example is one product's month, six inputs, shown in full below. Every contribution figure, break-even, discount scenario and leverage number was computed in SQLite and cross-checked in pandas before it went on the page, so you can check any line on a calculator and it will agree.

## 1. Fixed and variable, and the test that sorts them

Your factory rent is $60,000 a month. You sell one more grinder. How much more rent do you pay?

None. That is the whole test, and it is the only test that matters here. **Ask what happens to the cost if you sell exactly one more unit.** If the cost goes up, it is variable. If it does not move, it is fixed.

Variable costs on a grinder: the parts, the packaging, the payment processing fee, the shipping, the piece of assembly labour that only happens because this unit exists. Fixed costs: the rent, the salaried staff, the software subscriptions, the insurance. Those arrive whether you sell nine hundred units or none.

Two things make this harder than it sounds, and both are worth knowing before you sort a real cost list.

**Fixed only holds inside a range.** Rent is fixed until you need a second warehouse. A salaried team is fixed until the volume needs another hire. Accountants call that range the relevant range, and the honest version of "fixed" is "fixed across the volumes we are actually considering." Break-even arithmetic is only valid inside it.

**Some costs are both.** A phone bill with a monthly line rental and a per-minute charge is part fixed, part variable. A salesperson on base plus commission is the same shape. Split those two ways rather than forcing them into one pile, and if you cannot split them, say which way you rounded.

What makes this split worth the trouble is that it answers a question the income statement cannot. A profit and loss account sorts costs by what they are: cost of goods, then operating expense. That tells you nothing about what one more sale does, because both of those buckets contain a mix of fixed and variable. Sorting by behaviour instead of by category is the entire move.

## 2. Contribution margin, per unit and as a ratio

A grinder sells for $200 and costs $120 in parts, packaging and shipping. How much of that $200 is left to pay the rent?

Eighty dollars. That is the contribution margin: price minus variable cost, per unit. The name says exactly what it is. It is the amount each sale _contributes_ toward the fixed costs, and once those are covered, toward profit.

Notice what it is not. It is not profit per unit. There is no such thing as profit per unit until you know how many units there are, because the fixed costs have to be paid out of the pile of contributions and the size of the pile depends on the count. Contribution margin is the only per-unit number that is true at every volume, which is why it is the one to build on.

The same thing as a percentage is the contribution margin ratio: contribution divided by price. Here that is 80 divided by 200, which is 40%. Forty cents of every sales dollar survives the variable costs.

Use the per-unit version when you are counting units and the ratio when you are working in revenue. A sales manager forecasting units wants $80. A finance director looking at a revenue plan wants 40%, because 40% of any revenue number is the contribution that revenue throws off.

Here is the whole product, and everything else on this page comes out of these six numbers.

| Input                            | Value     |
|----------------------------------|-----------|
| Price per unit                   | 200       |
| Variable cost per unit           | 120       |
| Fixed costs per month            | 60,000    |
| Units sold per month             | 800       |
| **Contribution margin per unit** | **80**    |
| **Contribution margin ratio**    | **40.0%** |

## 3. Break-even, and the worked model

Fixed costs are $60,000 a month and each unit contributes $80. Work out how many units cover the fixed costs before you read on.

Seven hundred and fifty. Break-even in units is fixed costs divided by contribution margin per unit: 60,000 divided by 80. Each sale drops $80 into the fixed-cost box, so it takes 750 of them to fill a $60,000 box, and unit 751 is the first one that adds profit.

Break-even in revenue is the same answer in dollars, and there are two ways to get it. Multiply 750 units by the $200 price to get $150,000. Or divide the fixed costs by the contribution ratio: 60,000 divided by 0.40, which is also $150,000. Use the second one when you do not have a single price, because a product line with mixed prices still has a blended contribution ratio.

Check it by building the month at 750 units. Revenue is 750 times 200, which is $150,000. Variable cost is 750 times 120, which is $90,000. Add the $60,000 of fixed cost and total cost is $150,000. Revenue minus total cost is exactly zero, which is what break-even means.

Now the real month, at 800 units.

| Line                        | Amount     |
|-----------------------------|------------|
| Revenue (800 × 200)         | 160,000    |
| Variable cost (800 × 120)   | 96,000     |
| **Contribution (800 × 80)** | **64,000** |
| Fixed costs                 | 60,000     |
| **Profit**                  | **4,000**  |

The gap between 800 units and 750 is the margin of safety: 50 units, or 6.25% of current volume. That is how far sales can fall before the product starts losing money, and 6.25% is thin. Say why a product can be profitable and still be 6.25% away from losing money, in your own words, before reading on.

Here is the same month at other volumes, which is the table worth putting in front of anyone who asks "what if sales drop."

| Units | Revenue | Variable cost | Fixed cost | Total cost | Profit  |
|-------|---------|---------------|------------|------------|---------|
| 0     | 0       | 0             | 60,000     | 60,000     | -60,000 |
| 200   | 40,000  | 24,000        | 60,000     | 84,000     | -44,000 |
| 400   | 80,000  | 48,000        | 60,000     | 108,000    | -28,000 |
| 600   | 120,000 | 72,000        | 60,000     | 132,000    | -12,000 |
| 750   | 150,000 | 90,000        | 60,000     | 150,000    | 0       |
| 800   | 160,000 | 96,000        | 60,000     | 156,000    | 4,000   |
| 1,000 | 200,000 | 120,000       | 60,000     | 180,000    | 20,000  |
| 1,200 | 240,000 | 144,000       | 60,000     | 204,000    | 36,000  |

Every row moves by $80 per unit, in both directions. That is what makes the numbers around break-even feel so violent. Ten percent more units, from 800 to 880, takes profit from $4,000 to $10,400, which is 160% more profit for 10% more sales. Ten percent fewer, from 800 to 720, takes it to a $2,400 loss, which is 160% the other way.

That multiplier has a name and a formula. Operating leverage is contribution divided by profit: 64,000 over 4,000, which is 16. One percent on volume moves profit sixteen percent, and it does it in whichever direction the volume went. High fixed costs buy you that multiplier. It is the same multiplier on the way down.

## 4. The 12,000-unit mistake

Accounting tells you this grinder costs $195 to make, fully loaded. It sells for $200. Work out what that says the break-even is, then hold that number.

Here is where the $195 comes from. Fixed costs of $60,000 spread across the 800 units the product currently sells is $75 a unit. Add that to the $120 of genuine variable cost and you get $195. That is a real and legitimate number for some purposes, and it is called fully loaded or fully absorbed cost, because the fixed costs have been absorbed into the unit.

Use it in a break-even calculation and everything falls apart. Price 200 minus loaded cost 195 leaves $5 of apparent margin. Divide $60,000 of fixed costs by $5 and break-even is 12,000 units.

|                            | Correct           | Fully loaded                   |
|----------------------------|-------------------|--------------------------------|
| Cost subtracted from price | 120 variable only | 195, variable plus fixed share |
| Margin per unit            | 80                | 5                              |
| Break-even units           | 750               | 12,000                         |

Sixteen times the right answer, and 12,000 units is fifteen times the volume the product actually sells. A manager handed that number kills the product. The product is fine. It made $4,000 last month.

The reason it goes so wrong is that the fixed costs get counted twice. They are inside the $195, taking $75 off every unit's margin, and they are still sitting in the $60,000 numerator waiting to be covered. One pile of money, subtracted on both sides of the same division.

There is a second problem underneath, and it is the one that makes the mistake impossible to patch. The loaded cost depends on the volume you assumed to compute it, and volume is what you were trying to find. Watch the answer move.

| Volume assumed | Fixed per unit | Loaded cost | "Break-even" it produces                |
|----------------|----------------|-------------|-----------------------------------------|
| 400            | 150.00         | 270.00      | Impossible, cost exceeds the $200 price |
| 800            | 75.00          | 195.00      | 12,000 units                            |
| 1,200          | 50.00          | 170.00      | 2,000 units                             |

Three different break-evens for one product, decided entirely by a number you had to guess first. The correct calculation gives 750 at every volume, because contribution margin does not depend on how many units there are. That is not a convenience. It is the reason the split exists.

Picture your own company's cost-per-unit figure, the one in the pricing spreadsheet or the ERP. Does it have overhead baked into it? Most of them do, because that number was built for valuing inventory, not for deciding what one more sale is worth. Using it for the second job is the most common version of this mistake.

## 5. The query, and why break-even rounds up

Fixed costs $60,000, contribution $79 per unit. Divide them. What do you do with the 0.49 of a unit at the end?

Round up, always. You cannot sell half a grinder, and a fraction of a unit short of break-even is still short. 60,000 divided by 79 is 759.4937, and 759 units is not break-even. It generates 759 times 79, which is $59,961 of contribution, against $60,000 of fixed cost. The month loses $39. It takes 760 units, which throw off $60,040 and clear the base by $40.

SQL will not do that for you. Whole number divided by whole number truncates, so `60000 / 79` returns 759, which is the wrong direction. `CAST(... AS INT)` also truncates. The function that rounds up is `CEIL`, spelled `CEILING` in SQL Server, and some older SQLite builds ship without it.

Here is the query, with a ceiling built from the remainder rather than from `CEIL`.
    
    
    SELECT product,
           price,
           variable_cost,
           price - variable_cost                             AS cm_per_unit,
           ROUND(100.0 * (price - variable_cost) / price, 1) AS cm_ratio_pct,
           fixed_costs / (price - variable_cost)
             + CASE WHEN fixed_costs % (price - variable_cost) > 0
                    THEN 1 ELSE 0 END                        AS breakeven_units
    FROM product_economics;

The last expression is worth reading slowly, because it is a small trick that saves an argument later. `fixed_costs / (price - variable_cost)` is the truncated whole number, 759. `fixed_costs % (price - variable_cost)` is the remainder left over, and the `CASE` adds 1 when there is a remainder and 0 when there is not. Add them and you have rounded up, with no `CEIL` and no floating-point arithmetic anywhere. On a division that comes out exact, like 60,000 over 80, the remainder is 0 and the answer stays 750.

You will also see this written as `fixed_costs / cm + (fixed_costs % cm > 0)`, leaning on the comparison itself being 1 or 0. That is shorter and it is not portable. It runs in SQLite and MySQL, where a comparison is a number. PostgreSQL has a real true-or-false type that will not add to an integer, and SQL Server has no such value to add at all. Oracle spells the remainder `MOD(fixed_costs, cm)` rather than `%`. The `CASE` above is the version that survives the move, which is why it is the one printed here.

The `100.0 *` in the ratio line is the other arithmetic guard. Without the decimal point, `100 * 80 / 200` is fine but `80 / 200 * 100` is 0, because the division happens first and 80 divided by 200 truncates to zero. The same trap runs through every ratio in SQL and is worked at length in [gross vs operating vs net margin](https://michaelnocito.github.io/analyst-prep-kit/guides/gross-vs-operating-vs-net-margin/).

## 6. What a 10% discount actually costs

You cut the price 10%, from $200 to $180. By what percent does the contribution fall?

Twenty-five percent. The discount comes entirely out of the contribution, because the variable cost does not care what you charged. Contribution goes from $80 to $60, and $20 off $80 is a quarter of it.

This is the most useful thing on the page for anyone who sits near a sales team. **A discount is not a small percentage off the price. It is a large percentage off the only part of the price that was yours.** The lower the contribution ratio, the more brutal it gets. At a 40% contribution ratio, a 10% discount takes 25% of the contribution. At a 20% ratio it would take half.

What that does downstream, on the same product.

| Measure                              | At $200 | At $180 | Change      |
|--------------------------------------|---------|---------|-------------|
| Contribution per unit                | 80      | 60      | -25%        |
| Contribution ratio                   | 40.0%   | 33.3%   | -6.7 points |
| Break-even units                     | 750     | 1,000   | +33%        |
| Units to hold the same $4,000 profit | 800     | 1,067   | +33%        |

Read the last row again, because it is the sentence to take into the meeting: **a 10% discount needs 33% more units just to make the same money.** Check it if you like. 1,067 units at $60 of contribution is $64,020, minus $60,000 of fixed cost, which is $4,020, near enough the $4,000 the product made before.

That is the number that should sit next to any discount proposal. Not "we lose 10% of revenue," which is what a price cut looks like on a revenue line, but "we need a third more volume to stand still," which is what it looks like in the only unit that matters. If the sales team is confident of a third more volume, the discount is a good idea. Often the discussion has never been framed that way, and this table is the whole contribution of the analysis.

## 7. The full before and after

Same product, same month, two ways of reporting it.

### Before

"The Pro Grinder made $4,000 last month on 800 units. Unit cost is $195 against a $200 price, so we are making $5 a unit. Margin is too thin; recommend a price rise or a product review." Every number in that paragraph is arithmetically correct. The recommendation is built on the fully loaded $195, so it double-counts the fixed costs, and it puts a product with a 40% contribution ratio on a kill list.

### After

| Measure               | Value                      | Read                                   |
|-----------------------|----------------------------|----------------------------------------|
| Price                 | 200                        |                                        |
| Variable cost         | 120                        | Parts, packaging, shipping, processing |
| Contribution per unit | 80                         | What one more sale is worth            |
| Contribution ratio    | 40.0%                      | Of every sales dollar                  |
| Fixed costs           | 60,000                     | Per month, unchanged by volume         |
| Break-even            | 750 units, 150,000 revenue | Where the month turns positive         |
| Current volume        | 800 units                  | Profit 4,000                           |
| Margin of safety      | 50 units, 6.25%            | How far sales can fall                 |
| Operating leverage    | 16.0                       | 1% on volume moves profit 16%          |

The same month, and now a completely different recommendation. The product is not thin on margin, it is thin on volume, and those need opposite responses. Its contribution ratio of 40% is healthy. It is sitting 50 units above break-even, and its leverage of 16 means an extra 50 units would double the profit while 50 fewer would erase it. The finding: **the Pro Grinder is 6.25% of volume away from losing money and 40 cents of every dollar goes to profit once it clears, so this is a volume problem, not a pricing one.**

## 8. Edge cases, including the order that looks like a loss

A customer offers to buy 150 grinders at $140 each, well under the $195 it "costs" to make one. Take it or leave it?

**Take it, on these numbers.** The variable cost is $120, so each of those units contributes $20. On 150 units that is $3,000 of extra contribution, and because the fixed costs are already covered by the regular 800 units, all $3,000 is profit. The month goes from $4,000 to $7,000. The floor on any special order is the variable cost, $120, and everything above it is worth having. This is the single most valuable use of contribution margin, and it is unavailable to anyone working from a loaded unit cost.

**The conditions on that answer are real and they matter.** It holds only if the discounted order does not eat capacity you would have sold at full price, and only if the low price does not leak into your regular customers' expectations. Both of those are judgement calls rather than arithmetic, and both belong in the same email as the $3,000.

**Break-even is a monthly question or a yearly one, never a floating one.** $60,000 of fixed cost is per month here, so 750 units is a monthly break-even. Mixing an annual fixed cost with a monthly volume is a twelvefold error and it is easy to make when the two numbers come from different systems. Put the period in the column header.

**Multiple products need a weighted contribution.** Break-even for a range of products depends on the mix, because a unit is not a unit any more. Use the blended contribution ratio and the revenue version of the formula, and state the mix you assumed, because the answer changes when the mix does.

**Contribution margin is not gross margin.** They look similar and they are cut differently. Gross margin subtracts cost of goods sold, which usually contains some fixed manufacturing overhead. Contribution margin subtracts only what varies with the unit. Two numbers, two purposes, and using one where the other belongs is exactly the mistake in section four wearing better clothes.

**A negative contribution margin is a different conversation entirely.** If the price is below the variable cost, every sale makes the loss bigger, and there is no volume that fixes it. Break-even does not exist, the formula returns a negative or an error, and the answer is to change the price or stop selling it. Guard the division so the report says that in words rather than printing a negative unit count.

## Why this works

The split between fixed and variable is not just an accounting convention, it is a decision rule with a formal basis. Charnes, Cooper and Ijiri set out break-even and cost-volume-profit analysis as a constrained optimisation problem and showed the conditions the linear version depends on (Charnes, Cooper, & Ijiri, 1963, _Journal of Accounting Research_ , 1(1), 16–43). Their conditions are the relevant range from section one, stated precisely: the arithmetic holds while the cost behaviour holds, and not outside it.

The reason the loaded unit cost in section four is so persistent has been measured too. Cooper and Kaplan documented how absorption systems, built to value inventory for external reporting, get reused for pricing and product decisions they were never designed for, and produce exactly the distortion on this page (Cooper & Kaplan, 1988, _Accounting Horizons_ , 2(3), 61–66). The number is not wrong. It is answering a different question, and nothing on the report says so.

The question at the top of each section is deliberate. Attempting an answer before receiving one improves learning of that specific material across sixty-four studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Working out 60,000 divided by 80 yourself, before section three gave you 750, is why the formula will come back when you need it. The same evidence says the cheat sheet below works best covered and recalled rather than reread (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255).

## Using this on your own numbers

Re-sorting every cost in the business into two piles is a project, and it is not one anyone will fund. Do this instead, in order.

  1. **Pick one product and sort only its costs.** Two columns, fixed and variable, and the one-more-unit test from section one to decide each line. An hour on one product beats a quarter on all of them.
  2. **Check whether your existing unit cost has overhead in it.** Ask whoever owns it. If the answer is yes, or nobody knows, you cannot use it for contribution margin and section four is why.
  3. **Compute contribution per unit and the ratio.** Two numbers, and they are the two that answer every question in this article.
  4. **Put break-even and the margin of safety on the product's regular report.** Break-even alone is a fact. Break-even next to current volume is a warning system.
  5. **Round break-even up, and check it.** Multiply your answer by the contribution and confirm it clears the fixed costs. Section five has the ceiling to use when your database has no `CEIL`.
  6. **Build the discount table before the next pricing conversation.** Contribution, break-even, and units needed to hold profit, at the current price and the proposed one. It is four numbers and it changes how the meeting goes.

If there is paper nearby, draw this once and it stays. Draw the two bars from the top of this page from memory: a price bar split into variable and contribution with the fixed box standing separately beside it, then the same bar with the fixed share pushed inside and the contribution reduced to a sliver. Mark which one is right. If you draw the fixed box touching the bar, the page is still open.

**This page is one of five.** The Financial analysis set on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/) is this page plus [Gross vs Operating vs Net Margin](https://michaelnocito.github.io/analyst-prep-kit/guides/gross-vs-operating-vs-net-margin/), [Current Ratio vs Quick Ratio](https://michaelnocito.github.io/analyst-prep-kit/guides/liquidity-and-leverage-ratios/), [Net Present Value (NPV)](https://michaelnocito.github.io/analyst-prep-kit/guides/net-present-value-npv/) and [Budget vs Actual Variance](https://michaelnocito.github.io/analyst-prep-kit/guides/budget-vs-actual-variance/). They share a worked company, so the numbers carry across. The index also holds every other how-to: SQL, Excel, Tableau, and the working habits around them.

## The whole thing on one screen

Cover the right column, then work down. Answer before you look, especially where you are sure.

| Concept                  | What it is                                                                                                                   |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------|
| The sorting test         | Sell one more unit. If the cost moves, it is variable.                                                                       |
| Relevant range           | Fixed only holds across the volumes you are actually considering.                                                            |
| Contribution margin      | Price minus variable cost. 200 − 120 = $80 per unit.                                                                         |
| Contribution ratio       | Contribution ÷ price. 80 ÷ 200 = 40%.                                                                                        |
| Not profit per unit      | There is no profit per unit until you know the count.                                                                        |
| Break-even units         | Fixed ÷ contribution per unit. 60,000 ÷ 80 = 750.                                                                            |
| Break-even revenue       | Fixed ÷ contribution ratio. 60,000 ÷ 0.40 = $150,000.                                                                        |
| Margin of safety         | Current volume minus break-even. 800 − 750 = 50 units, 6.25%.                                                                |
| Operating leverage       | Contribution ÷ profit. 64,000 ÷ 4,000 = 16. Cuts both ways.                                                                  |
| The loaded-cost error    | Putting fixed inside the unit gave 12,000 units instead of 750.                                                              |
| Why it is 16x wrong      | The fixed costs are counted twice, once in the unit and once in the total.                                                   |
| Why it cannot be patched | The loaded cost depends on the volume you were trying to find.                                                               |
| Rounding                 | Break-even rounds up. 759 units leaves the month $39 short.                                                                  |
| The ceiling with no CEIL | `fixed/cm + CASE WHEN fixed % cm > 0 THEN 1 ELSE 0 END`. The shorter version without the CASE only runs in SQLite and MySQL. |
| The discount rule        | 10% off the price took 25% off the contribution.                                                                             |
| What a discount needs    | 33% more units to make the same $4,000.                                                                                      |
| The special order        | $140 beats the $120 variable cost, so 150 units added $3,000 of profit.                                                      |
| The price floor          | Variable cost. Below it, volume makes the loss bigger.                                                                       |

**The one habit to keep.** The habit worth keeping. Never subtract a fixed cost from a price. Fixed costs go in the denominator of break-even, never inside the unit, and every version of this mistake starts with someone dividing overhead by a volume. If a spreadsheet fights back in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

Last thing, and this one I am genuinely asking. The first product I ever recommended killing had a fully loaded cost a dollar under its price, and it was throwing off a 40-something percent contribution the whole time. What is a decision you have watched get made on a number that was answering a different question?

## References

  * Charnes, A., Cooper, W. W., & Ijiri, Y. (1963). Breakeven budgeting and programming to goals. _Journal of Accounting Research_ , 1(1), 16–43.
  * Cooper, R., & Kaplan, R. S. (1988). Measure costs right: Make the right decisions. _Accounting Horizons_ , 2(3), 61–66.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*Originally published on Analyst Prep Kit: [Contribution Margin and Break-Even: The Fixed Cost That Does Not Belong in the Unit](https://michaelnocito.github.io/analyst-prep-kit/guides/contribution-margin-break-even/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
