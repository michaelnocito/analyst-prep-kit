Analysts ship work that still has flaws in it. They do it by **documenting every imperfection and making it defensible**. This guide covers how, at the three levels real analysts use, with examples from open projects you can read.

The reason it has to work that way is simple. **Data cleaning never finishes.** You fix the import bug, standardize the messy names, handle the missing values. There are _still_ duplicates you chose not to merge, edge cases your rules miss, and quirks you have not found yet.

## The standard is fitness, not purity

Take a second on this before reading the answer. Can the same table be good data and bad data at the same time? Commit to yes or no.

The data-quality research field settled this decades ago. Quality is not an absolute property of data. It is **fitness for use** , meaning whether the data is good enough for the specific decision it feeds (Wang & Strong, 1996).

Yes, and here is the case that proves it. The same customer table can be excellent for counting customers and useless for mailing them, if the addresses are stale. That reframing changes the job. The question is never "is this data clean?", because the answer is always no. The question is whether it is clean enough for _this_ conclusion, and whether you have told the reader where it is not.

Here is what that looks like on a real project. An analysis of Billboard chart history had to standardize artist names, because one artist can appear under seven different credit spellings. The cleaning rules fixed most of it, and deliberately left some of it.

Duo names containing "&" were never split. Splitting would shred real bands like Hall & Oates into solo artists who do not exist. The cost is that a duo member's work never merges with their solo career.

That is not a bug someone missed. It is a **documented tradeoff**. The alternative rule caused worse damage, the cost was measured and written down, and the analysis proceeds with eyes open. Multiply that by every rule in every project and you have the professional reality: a finished analysis is a stack of defensible tradeoffs, not an absence of flaws.

## Level 1: the limitations section (in the deliverable)

Every serious deliverable carries a section stating what the analysis can _not_ claim, and why. That goes for a report, a README, dashboard notes or an academic paper. It travels under a few names: _Limitations_ , _Scope & Assumptions_, _Caveats_. Academic journals require one in every paper. Skip it in industry and your conclusions get stretched past what the data supports, with your name still on them.

You can read real ones in the wild. The [Steam Hidden Gems](https://github.com/michaelnocito/steam-hidden-gems) and [Streaming Hidden Gems](https://github.com/michaelnocito/streaming-hidden-gems) projects each carry a "Scope & Assumptions" section. They state which records were excluded and why, what the source data cannot see, and which cleaning decisions carry known costs.

The [Telco Churn project](https://github.com/michaelnocito/telco-churn-analysis) shows the boundary-condition flavor in one paragraph. Its personas are tenure segments read from a single snapshot, not customers followed over time. So the write-up says plainly that the pattern is directionally reliable, and that a longitudinal cohort study would be needed to firm up the projected savings. Naming that before a reader finds it is what keeps the recommendation credible.

What belongs in it:

  * **Deliberate tradeoffs.** Rules you chose knowing they have a cost, like the "&" decision above.
  * **Known unfixables.** Problems you found and could not resolve, like aliases or gaps in the source's coverage.
  * **Boundary conditions.** What the data structurally cannot answer. "This dataset ends in June, so nothing here speaks to later months."
  * **Population limits.** Who or what the data does not represent.

## Level 2: the data-quality log (the working record)

The limitations section is the public summary. Behind it, analysts keep a running log of every issue found while working: what the clue was, how it was confirmed, what was decided. Months later, when someone asks why artist X appears twice, the answer is in the log rather than in a departed analyst's memory. In regulated industries this is not optional, because data lineage and decision audit trails are compliance requirements.

A useful format has four parts per issue. **The clue** , meaning what looked off. **The validation** , the query or check that confirmed it. **The decision** , what was done or deliberately not done. And **the concept** , what class of problem it was, so you recognize it next time.

An issue log written that way doubles as a learning document. Each entry is a small case study in data forensics.

## Level 3: quantified caveats (limitations with numbers)

The strongest limitation statements carry a measurement. Compare:

| Weak (a shrug)                                            | Strong (a finding)                                                                                                         |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| "Some song titles may not match between the two sources." | "The title join matched 84% of songs; the unmatched 16% skew toward titles with parenthetical suffixes, documented below." |
| "There may be some duplicate artists."                    | "Case-variant duplicates affect 12 of 1,570 roster artists (0.8%), listed in the appendix."                                |
| "Older data may be less reliable."                        | "Records before 1990 are missing genre in 31% of rows, vs 4% after."                                                       |

The pattern is this. When you find a limitation, spend one more query measuring its size. A limitation with a number is a deliverable in itself, because it tells the reader exactly how much weight the conclusion can bear. A limitation without one leaves the reader to guess, and readers guess pessimistically.

## The trust paradox: admitting flaws makes you more credible

Put yourself on the other side of the desk first. You are reviewing someone else's analysis and it lists six problems with its own data. Does your trust go up or down? Answer before reading on, because most people get their own instinct backwards here.

It is tempting to hide limitations, on the theory that they make the work look weak. Experienced reviewers read it the other way round.

An analysis that claims no limitations was not examined closely. An analysis that says "here are the six problems I found, how I confirmed each one, what each cost, and why the conclusion survives them" was. **A reader who finds a flaw you already documented trusts you more. A reader who finds a flaw you did not mention stops trusting everything else.**

This is also worth having in an interview. "Walk me through your project" answered with findings alone is a book report. Answer it with the findings _and_ what the data could not tell you, and how you bounded that. That is the version that sounds like a working analyst, because accounting for uncertainty is most of what working analysts do.

## How to write yours: a starter template
    
    
    ## Limitations & Assumptions
    
    1. [Deliberate tradeoff] We did X instead of Y because Y caused
       worse damage (evidence: ...). Cost of X: ... (measured: N rows /
       M% affected).
    2. [Known unfixable] The source data cannot distinguish A from B.
       Conclusions about A alone are therefore approximate.
    3. [Boundary] Data covers [range]. Nothing here speaks to [outside].
    4. [Match/coverage rate] Step Z joined/matched N% of records. The
       unmatched remainder looks like: ...

Try one entry now, on something you have already built. Pick a piece of work you have shown someone, and finish this sentence: this analysis cannot tell you anything about ___. Whatever fills that blank is your first limitation, and it was true whether or not you wrote it down.

Write it as you work, not at the end. Each entry takes a minute while the issue is fresh, and an afternoon of archaeology once it is not. The habit pairs with [exploratory data analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/exploratory-data-analysis/). Exploration is how you _find_ the issues. The limitations ledger is how you _account_ for them. Finding without accounting wastes the find.

## References

  1. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33. doi:10.1080/07421222.1996.11518099
  2. Tukey, J. W. (1977). _Exploratory Data Analysis._ Addison-Wesley. (The exploratory tradition this guide's companion piece covers.)

---

*Originally published on Analyst Prep Kit: [Your Data Is Never Fully Clean, and Analysts Ship Anyway](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
