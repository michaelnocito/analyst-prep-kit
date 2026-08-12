This article gives you the test that catches the most common beginner mistake in pivot tables, and the ten-second fix. The test is one line: **would adding two of these together mean anything?** If the answer is no, the column is a label, and it must never be summed.

The mistake happens without you doing anything wrong. You drag a column into a pivot's Values area, and Excel decides, on its own, how to summarize it. For anything numeric, it picks Sum. If that column was an ID, you now have the sum of a set of ID codes, printed with the same confidence as revenue.

**The short version.** Some columns are labels wearing a number's clothes: IDs, zips, years, phone numbers, invoice numbers. Count them or group by them, never sum them. The fix is Value Field Settings, Sum to Count.

This is not hypothetical. In [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/), over 82,956 Steam games, this exact trap fired in step 3, survived a first glance, and was caught by a check cell. Then it turned up in three more fields on the same page.

## What happened in the build

The pivot from [article 5](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-table-question/) was meant to answer: how many games in each segment, as a share of the total? AppID went into Values, because a count needs any always-filled column, and AppID is filled on every row.

Excel made it _Sum of AppID_. The pivot summed the ID codes of each group's games and reported each group's share of the total ID sum. The loved-and-found group came out as 0.45% of the total.

Stop on that number for a second. It is small, it has decimals, it is not round. It looks exactly like an answer. The correct figure, a count, was 0.71%: 590 games of 82,956. Both numbers are plausible. Nothing on the screen distinguished them. The [check cell from article 2](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/) did.

Before the next section, say out loud what Sum of AppID actually computed. Forcing the sentence is the point: "it added up the catalog numbers of 590 video games." Said aloud, the absurdity is audible. On screen, it never is.

## Why Sum is the default

Excel's rule is mechanical. A column dropped into Values gets Sum if it is numeric, Count if it holds text or blanks. The rule is not wrong; for true quantities like price and revenue it is exactly what you want, and quantities are what Values was built for.

The rule misfires because it cannot see meaning. An ID is stored as a number for convenience, but it is a name written in digits. Excel has no way to know that, so the decision defaults to you, and it gets made silently on your behalf every time you do not read the corner of the pivot.

## Why it survives review

Summing IDs does not error, and it does not produce an obviously broken number. It produces a large, confident, completely meaningless figure. A pivot cell reading 41,283,904,117 does not look like a bug. It looks like big data.

Worse, the failure compounds quietly. A share computed from a nonsense total, like the build's 0.45%, is small, tidy, and shaped like every honest percentage around it. Reviewers scan for numbers that look wrong. This trap produces numbers that look right, which is why the countermeasure is a check computed a second way, not a harder stare.

## The test, and the column types it flags

Run the one-line test on any column before it goes into Values: would adding two of these together mean anything?

| Column                                  | Two added together               | Verdict                                                                                                             |
|-----------------------------------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Price                                   | Two games' prices: real money    | Quantity. Sum away                                                                                                  |
| Median playtime                         | Meaningful in context            | Quantity. Sum or average                                                                                            |
| AppID                                   | Two catalog numbers: nonsense    | Label. Count or group by                                                                                            |
| Zip code                                | 08053 plus 02134: nonsense       | Label. And see [article 4](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) |
| Year                                    | 2015 plus 2019 is 4034: nonsense | Label. Group by it, never sum it                                                                                    |
| Invoice number, phone, SKU, employee ID | Nonsense, every time             | Labels, all of them                                                                                                 |

Year deserves its own sentence, because it is the one that fools experienced people. It is genuinely numeric, ordering matters, subtraction even means something. Addition still does not. Any pivot showing Sum of Year has this bug.

## The ten-second fix

  1. **Read the corner.** The Values box and the pivot's header name the operation: Sum of AppID, Count of AppID. Read it before reading any figure. This is the whole habit.
  2. **Click the field in Values > Value Field Settings.**
  3. **Choose Count. OK.** The header now says Count of AppID, and the sentence from [article 5](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-table-question/) is back to the one you meant to ask.

Then do what the build had to do: check the other fields on the page. This mistake travels in groups, because the same drag built every pivot on the sheet. One found means others likely.

## The family this trap belongs to

This is the second of three articles about the same underlying thing: Excel deciding what your data is, and never mentioning it.

[Article 4](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) is the decision at import: 08053 becomes the number 8053. This article is the decision at analysis: an ID column becomes a quantity. Article 15, later in the series, is the ugliest of the three: a file's alphabet guessed wrong, and 6% of a column's names corrupted.

The common defense across all three is the same: know which of your columns are labels, declare them where the tool lets you, and read what the tool decided where it does not ask. Labels are counted and grouped. Quantities are summed and averaged. That one distinction, applied at three doors, closes the family.

## Run it on your own file

  1. **Open any workbook with a pivot in it.** Yours or inherited.
  2. **Read every Values entry.** Just the corners: Sum of what, Count of what, Average of what.
  3. **Run the test on each summed column.** Would adding two together mean anything?
  4. **Fix any label that is being summed.** Value Field Settings, Count. Note what the number was before and after, because someone may have already quoted the before.
  5. **Add the check.** One COUNTIF beside the data for one group, per [article 2](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/), so the next silent default gets caught by arithmetic instead of luck.

## A cheat sheet

| Situation                       | Do                                            | Watch for                                        |
|---------------------------------|-----------------------------------------------|--------------------------------------------------|
| Any column entering Values      | Run the test: would adding two mean anything? | No means label. Count it or group by it          |
| Reading any pivot, yours or not | Read the corner first: Sum of, Count of       | Before any figure, every time                    |
| Sum of an ID found              | Value Field Settings, Count                   | Check the rest of the page. It travels in groups |
| Counting rows                   | Any always-filled column, set to Count        | A column with blanks undercounts                 |
| Years in a pivot                | Rows, as a group-by                           | Sum of Year is always the bug                    |
| A share that came from a pivot  | Recompute one group by hand                   | 0.45% and 0.71% look equally honest              |

**The one habit to keep.** Read the corner of the pivot before you read any number in it. Sum of, Count of, Average of: the operation is the claim, and it is printed right there.

Go read the corners of the last pivot you shipped. What does each Values box say it did, and is that the sentence you meant?

---

*Originally published on Analyst Prep Kit: [Excel Just Summed Your ID Numbers and Said Nothing](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sum-of-id-trap/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
