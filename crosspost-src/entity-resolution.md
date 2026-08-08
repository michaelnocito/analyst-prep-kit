This guide walks through five steps for working out which records are the same real thing, and merging them without wrecking your data. It runs on real chart data, and it includes the two times the rules came out wrong.

Here is the problem in one example. Count the distinct artists in Billboard's public chart history and the number is wrong. "Elvis Presley" and "Elvis Presley With The Jordanaires" are the same man, and so are five other credit strings. One real-world _entity_ , seven database _strings_.

Every dataset with human-entered names has this. Customers who signed up twice. "IBM" against "I.B.M." against "International Business Machines". The same supplier in two systems, spelled two ways.

The work of fixing it is called **entity resolution**. Matching across two datasets is **record linkage**. Removing duplicates inside one is **deduplication**. They are the same skill pointed at different situations, and it is one of the most common tasks an analyst actually gets handed.

## The vocabulary map

| Term                                | Meaning                                                                                                                                |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Entity**                          |  The real-world thing: one artist, one customer, one company                                                                           |
| **Entity resolution**               |  Figuring out which records refer to the same entity                                                                                   |
| **Record linkage**                  |  The same problem across two datasets. "Is row 5 in file A the same person as row 90 in file B?" Formalized by Fellegi & Sunter (1969) |
| **Deduplication**                   |  The same problem inside one dataset                                                                                                   |
| **Normalization / standardization** |  Transforming values toward a canonical form (lowercasing, trimming, cutting suffixes) so equal things become equal strings            |
| **Match key**                       |  The cleaned column(s) you actually join on                                                                                            |
| **Match rate**                      |  The share of records that found their counterpart. This is the number that keeps the whole exercise honest                            |
| **Clerical review**                 |  Human eyes on the records the rules could not decide. This is a formal stage of the classic framework, not an admission of failure    |

## Step 1: measure the fragmentation before fixing anything

The worked example is Billboard Hot 100 history, 1958 to present. The goal is one clean row per artist. Before writing a single fix, size the problem. Guess the number first: how many different ways do you think one famous artist appears in a chart database? Hold that number.

  * **Depth:** every credit containing "Elvis Presley" gave **seven** distinct strings for one man. His catalog splits almost evenly between "Elvis Presley" at 50 songs and "Elvis Presley With The Jordanaires" at 53. Count by raw credit and you undercount him by half.
  * **Breadth:** across all 11,275 distinct credits, " Featuring " appears in 2,662, " With " in 244, and " & " in 1,994. Up to **43% of all credits** carry a joiner. That is not edge-case cleanup. It is a core design requirement.

Those two numbers decided everything after them. Fragmentation this widespread makes normalization rules mandatory. And any rule will touch thousands of rows, so the rules have to be _tested_ rather than trusted.

## Step 2: build rules by preview, catch, fix, re-check

The extraction rule was simple to state: the primary artist is the text before the joiner word. It was built as a CASE ladder and proven on real rows before anything else was built from it. What happened next is the lesson:

  1. First preview caught **"2Pac Duet With Mopreme" → "2Pac Duet"** : the credit joins with " Duet With ", the rule only knew " With ". A fake artist, invented by a cleaning rule.
  2. The fix added a " Duet With " rung above " With ". In a CASE ladder, specific patterns must sit above the general patterns they contain. Re-checking the exact rows the fix targeted caught another one: **"Patti Austin A Duet With James Ingram" became "Patti Austin A"**. So it needed one more rung, " A Duet With ".
  3. Re-check again: clean. The ladder was frozen and used to build the artist table: 11,275 raw credits collapsed to 8,896 artists.

Nobody writes the complete rule first time. And the data will not raise an error when your rule invents "2Pac Duet". So the loop is: preview on real rows, catch the defect, add a rung, re-check the exact rows you targeted. Repeat until the exceptions stop. The full ladder, with every defect it caught, is walked through in the [CASE expression guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/).

## Step 3: know when NOT to merge (the false-positive check)

The "&" joiner appeared in 1,994 credits. Should it split too? Decide before you read the next paragraph. The rule is simple and it worked on the other joiners, so the case for splitting is strong.

Reading the highest-volume "&" credits first settled it. The list is dominated by **permanent duos and bands** : Kool & The Gang, Earth, Wind & Fire, Simon & Garfunkel. Only a few are temporary collaborations. Say what that means for the rule before reading on. Splitting on "&" would shred real bands into artists who do not exist.

**So the decision was not to split.** That has a cost. A duo member's solo career never merges with their duo work. The cost was written down as a limitation instead of being fixed.

This is the half of entity resolution that is easy to skip. Over-merging destroys as much as under-merging does, and sometimes the right output is a refusal you wrote down.

The same project made the point twice more. One duo appeared as both "¥$: Ye & Ty Dolla $ign" and "¥$: Kanye West & Ty Dolla $ign". Those are aliases, and no rule can know they are one act without a lookup dictionary. Separately, three artists were split purely by capitalization, "Tyler, The Creator" against "Tyler, the Creator". That one was cured by lowercased match keys.

## Step 4: match rates, the number that keeps you honest

Picture your own messy column for a moment. Customer names, product codes, hospital sites, whatever you actually work with. How many distinct values does it hold, and how many real things are behind them? If those two numbers are the same, you have no problem here. Most people find they cannot answer the second one at all, and that gap is the job.

The payoff needed the chart data linked to a second dataset, listener statistics from a music API, matched on artist and title text. That is record linkage. The discipline is simple: **measure the match rate before and after every cleaning rule.**

  * Baseline, case-insensitive matching only: **31.2%** of tracks found their chart counterpart.
  * After one targeted rule, **37.0%**. The rule trimmed " (feat. …)" and " (with …)" tails, which the API titles carry and the chart titles do not. It recovered 763 real matches.
  * Stripping all parentheses would have scored higher still, and been wrong. A quick look showed parentheses are often part of the song's real name, as in "Single Ladies (Put a Ring on It)". Same lesson as "&": read before you rule.

Note what the match rate is _for_. In this project it was never meant to reach 100%. Unmatched tracks were the whole point, because they were songs that never charted.

The rate's job is to separate signal from defect. A good rule recovers the _spelling casualties_ without inventing false matches. The rate shows what each rule contributed, so you know to stop cleaning when the improvements stop.

## Step 5: clerical review, or reading the leftovers

The classic record-linkage framework sorts candidate pairs three ways: confident matches, confident non-matches, and a middle zone that goes to a human (Fellegi & Sunter, 1969).

In everyday analyst work that third bucket is simpler and cheaper than it sounds. **After the rules run, read the unmatched rows, sorted so the most consequential come first.**

Then judge what you see. If the top of that list is full of records that obviously should have matched, your rules have a gap. If it reads as genuinely unmatched, the linkage is done, and what is left becomes a limitation you document and quantify.

It takes about ten minutes. It is the difference between "the join ran" and "the join is right".

## The principles, distilled

| Principle                      | One-line version                                                                                                                                                                          |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Measure first                  | Size the fragmentation (depth on one entity, breadth across the table) before writing any rule.                                                                                           |
| Preview every rule             | Show original and transformed side by side on real rows; read them.                                                                                                                       |
| Specific above general         | In any rule ladder, the narrow pattern outranks the broad pattern it contains.                                                                                                            |
| Check false positives          | Before merging or splitting, read the rows where a wrong rule does the most damage.                                                                                                       |
| Sometimes: don't merge         | Over-merging destroys real entities. A documented refusal is a valid output.                                                                                                              |
| Match keys, stored and indexed | Compute normalized keys once into real columns; join on those, not on function-wrapped originals.                                                                                         |
| Match rate per rule            | Measure before and after each rule; stop when the rate stops moving for honest reasons.                                                                                                   |
| Clerical review                | Read the leftovers before declaring victory.                                                                                                                                              |
| Log everything                 | Every decision (including refusals) goes in the data-quality record and the [limitations section](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/). |

## References

  1. Fellegi, I. P., & Sunter, A. B. (1969). A theory for record linkage. _Journal of the American Statistical Association, 64_(328), 1183–1210. doi:10.1080/01621459.1969.10501049
  2. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33. (The fitness-for-use standard the merge/don't-merge tradeoffs answer to.)

---

*The full version of this guide lives on my site: [Entity Resolution: One Real Thing, Many Messy Names](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
