This guide gives you a test that takes ten seconds and tells you whether the thing you just built is a report or an analysis. Then it gives you four moves that turn one into the other. Every move has a worked SQL example and real numbers. The whole method is here.

What you actually do: take the number you just produced, and ask what someone would do differently because of it. If the honest answer is nothing, you have a report. Then you run the four moves below, in order, until the answer is a specific action a specific person can take on Monday.

**The short version.** Data analysis is looking at records of things that already happened and finding a pattern that changes what someone does next. If nothing changes, it was not analysis. It was a report.

The same starting number, two endings.

## The test: what would someone do differently?

Before you read the answer, look at the last thing you built and try it yourself. Who was going to act on it, and what were they going to do?

Take any number you have produced and finish this sentence out loud: "Because of this, _someone_ should _do a specific thing_." Both blanks have to fill in with something real. A named person or team, and an action they control.

Here is a real one. "Churn was 4.1% in Q3." Who acts, and how? Nobody can act on that. It is a true, correctly calculated, carefully formatted number, and it changes nothing. That is a report, and reports are useful. A dashboard that tells you the servers are up is doing its job. It is just not analysis.

Now the same underlying data, worked further. "Monthly-plan accounts that never opened the import tool churn at 9.2%. Ones that did churn at 1.8%. The email introducing that tool goes out on day 14, and most cancellations happen on day 11." Who acts? The lifecycle marketing owner. What do they do? Move the email to day 3. That is analysis, and the only difference is that it ended somewhere a person can stand.

The word "analysis" is doing a lot of quiet work in job descriptions, so it is worth being concrete about what it is. If you want the wider picture of the role first, the guide on [what data analysis actually is](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/../what-is-data-analysis/) covers the four steps end to end.

## Move one: give the number something to sit next to

Before the answer: 4.1% churn. Is that good or bad? Say what you would need to know to answer.

You cannot answer it, and neither can anyone else, because a number on its own carries no meaning. Meaning comes from the gap between the number and something else. That something else is a reference point, and there are only three worth using.

  * **Itself, earlier.** 4.1% this quarter against 2.6% last quarter.
  * **A different group, now.** 4.1% on monthly plans against 0.9% on annual.
  * **A target someone agreed to.** 4.1% against the 3% the team committed to.

Say why a number with no comparison cannot be acted on, before you read the next sentence. The reason is that action is a choice between options, and a single figure gives you nothing to choose between. Reference points are not decoration on the number. They are the thing that makes it mean anything at all.
    
    
    -- WHY: "Churn was 4.1%" cannot be acted on. Put it next to itself,
    -- one quarter earlier, so the reader can see a direction.
    SELECT
        quarter,
        COUNT(*)                                          AS accounts,
        SUM(churned)                                      AS churned,
        ROUND(100.0 * SUM(churned) / COUNT(*), 1)         AS churn_pct
    FROM   accounts
    WHERE  quarter IN ('2026-Q2', '2026-Q3')
    GROUP  BY quarter
    ORDER  BY quarter;

Two rows instead of one, and the number has somewhere to sit. Picture running that on a table you actually work with. What are your two rows, and which direction do they point?

Choosing which reference point is fair, rather than which one flatters, is its own skill. The guide on [defining metrics](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/../defining-metrics/) covers how to pin a measure down so it means the same thing every time you run it.

## Move two: split it until the split stops mattering

Before the answer: if the overall number is 4.1%, what is the most useful thing you could learn about how that 4.1% is spread across your customers?

An average hides the thing you need. If churn is 4.1% across everyone, it is almost never 4.1% for everyone. It is 9% for one group and 1% for another, and the whole decision lives in that difference. So you split the number by one column at a time and look for the split where the two halves are furthest apart.

Start with columns a person could act on. Plan type, signup month, acquisition channel, whether they finished onboarding. Splitting by something nobody controls, like the customer's time zone, gives you a fact rather than a lever.
    
    
    -- WHY: find which single column separates churners from stayers
    -- most sharply. The widest gap is where the decision lives.
    SELECT
        plan_type,
        used_import_tool,
        COUNT(*)                                          AS accounts,
        ROUND(100.0 * SUM(churned) / COUNT(*), 1)         AS churn_pct
    FROM   accounts
    WHERE  quarter = '2026-Q3'
    GROUP  BY plan_type, used_import_tool
    HAVING COUNT(*) >= 50          -- ignore slices too small to trust
    ORDER  BY churn_pct DESC;

Two things about that query are worth keeping. The `HAVING COUNT(*) >= 50` throws away slices with too few accounts to mean anything, which is where most false findings come from. And it groups by two columns rather than ten, because a split you cannot explain in one sentence is not a finding, it is a coincidence you have not caught yet.

You stop splitting when the next split stops changing the picture. If breaking the 9.2% group down further gives you 9.1% and 9.3%, that column is not the story, and you go back and try another one. Working out which columns are worth trying at all is the job covered in [exploratory data analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/../exploratory-data-analysis/).

## Move three: land it on a decision someone already owns

Before the answer: you now know monthly-plan accounts that skipped the import tool churn at 9.2%. Name the person who could act on that, and the thing they would change.

This is where most analysis stops one step short. The pattern is real, the query is right, and the finding is handed over as a fact. "Accounts that skip the import tool churn five times more often." True, and still nobody moves, because it does not name a lever anyone is holding.

A lever is something a specific person can change next week without asking permission from three others. The onboarding email schedule is a lever. "Customers should be more engaged" is not. So you go looking for where the pattern touches something adjustable.

In this case: the email that introduces the import tool goes out on day 14. Cancellations cluster on day 11. The tool is being introduced to people who already left. That is a lever, it belongs to one team, and the recommendation is a single sentence. Move the email to day 3.

Notice the shape of the finished thing. A number with a comparison, a split that explains it, and one action. Not five recommendations ranked by effort. One, because a list of options hands the decision back to the reader, which is the work you were supposed to do.

Where the action is a cutoff rather than a schedule, picking the number is its own problem, and [setting data-driven thresholds](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/../data-driven-thresholds/) covers how to choose one you can defend.

## Move four: say what would prove you wrong

Before the answer: what is the most likely innocent explanation for the import tool result that has nothing to do with the tool?

Here is one. People who were going to stay anyway are the same people who bother to set things up properly. The import tool did not keep them. Their existing enthusiasm did both. Moving the email to day 3 would then change nothing at all.

You cannot rule that out with the same data that produced the finding, and you should not pretend otherwise. What you do instead is write down, before anything ships, what you expect to see if you are right and what you expect to see if you are wrong.

If moving the email works, day-11 cancellations among monthly accounts fall, and import tool usage in the first week rises. If the enthusiasm explanation is the true one, usage rises and cancellations do not move. Those two outcomes look different, which is the whole point. A prediction that survives every result is not a prediction.

Putting this in writing costs you two sentences and is the difference between a finding and a claim. The guide on [documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/../documenting-data-limitations/) covers the fuller version of this habit.

## Before and after, same input

Identical data, identical query engine, two write-ups.

|                   | Report             | Analysis                                                                             |
|-------------------|--------------------|--------------------------------------------------------------------------------------|
| Headline          | Q3 churn was 4.1%. | Move the onboarding email from day 14 to day 3.                                      |
| Comparison        | None.              | Up from 2.6% in Q2.                                                                  |
| Split             | None.              | 9.2% for monthly accounts that skipped the import tool, 1.8% for those that used it. |
| The lever         | None.              | Email send day. Owned by lifecycle marketing.                                        |
| If wrong          | Not addressed.     | Tool usage rises but day-11 cancellations hold flat.                                 |
| What happens next | Filed.             | One team changes one setting, and we know within a month.                            |

## Edge cases, and when a report is the right answer

Not everything should be pushed into analysis, and forcing it produces worse work than leaving it alone.

  * **Regulatory and financial reporting.** The number is the deliverable. Nobody wants your recommendation on the tax filing.
  * **Monitoring.** A dashboard exists so that a human notices when something moves. The action is built into the alert, not into the number.
  * **Someone else owns the decision and has the context you lack.** Then your job is the cleanest possible comparison and split, handed over with the limitations attached. That is still more than a bare number.
  * **The split is real but tiny.** A gap of 4.1% against 4.4% across a big population can be perfectly true and still not worth anyone's Monday. Say so.
  * **Every column splits it.** If ten different splits all look meaningful, something upstream is wrong, usually a filter that is quietly removing a whole group.

## Where this comes from, and why it works

The distinction is older than the job title. John Tukey, the statistician who coined the word "software" and gave us the box plot, argued in 1962 that data analysis is a different activity from statistics, and defined it by its purpose rather than its methods: procedures for analysing data, judged by whether they help you learn something you can use (Tukey, 1962). The emphasis on what the work is _for_ , rather than which technique was applied, is the same emphasis as the test at the top of this page.

Why a number needs a comparison has a separate line of evidence behind it. Kahneman and Tversky showed that people do not evaluate outcomes in absolute terms at all. They evaluate them as gains or losses against a reference point, and the same outcome flips from good to bad depending on which reference point is in play (Kahneman & Tversky, 1979). A figure delivered without one does not arrive as neutral information. It arrives as nothing, and the reader silently supplies a reference point of their own, usually a wrong one.

The prompts scattered through this page are doing a job too. Asking you a question before giving you the answer, and asking you to explain a step in your own words, are two of the eight generative learning strategies catalogued by Fiorella and Mayer, and self-explanation in particular holds up across sixty-four separate reports (Fiorella & Mayer, 2016; Bisra et al., 2018).

## How to apply it to your own work

If you have paper nearby, sketch the two paths from the diagram before you start: one number stopping at a wall, one number splitting and landing on a tick. It takes twenty seconds and gives you something to check your own work against.

  1. **Pick your most recent finished piece of work.** Not your best one. Your most recent, because that is the honest sample.
  2. **Run the test on it.** Because of this, who should do what? Write the sentence out. If you cannot fill both blanks, it was a report.
  3. **Add one comparison.** Itself earlier, a different group, or an agreed target. This is usually a ten-minute change and it is the highest-value one.
  4. **Split by two columns someone controls.** Keep the slice-size floor. Stop when the next split stops changing the picture.
  5. **Find the lever and name the owner.** One action, one team. If you cannot find a lever, say that plainly rather than inventing one.
  6. **Write the two outcomes.** What you see if you are right, what you see if you are wrong.
  7. **Do not retrofit the back catalogue.** Going back through two years of old reports is miserable, mostly wasted, and the main thing it produces is a reluctance to start. Apply this from the next piece forward.

## A cheat sheet

| Move           | What you add                                          | The test                                              |
|----------------|-------------------------------------------------------|-------------------------------------------------------|
| The test       | "Because of this, X should do Y"                      | Do both blanks fill in with something real?           |
| 1. Comparison | Itself earlier, another group, or a target            | Can the reader tell good from bad without asking you? |
| 2. Split      | Two columns someone controls, with a slice-size floor | Are the two halves far enough apart to matter?        |
| 3. Lever      | One action, one named owner                           | Could they change it next week without permission?    |
| 4. Falsifier  | What you expect if right, what if wrong               | Do the two outcomes actually look different?          |
| Stop condition | The next split stops changing the picture             | Are you still learning, or just cutting thinner?      |

**The one habit to keep.** If you take nothing else from this page, finish the sentence before you send the work. "Because of this, someone should do something." Out loud, with both blanks filled. It costs ten seconds and it is the only step here that catches the problem while you can still fix it.

## References

  * Tukey, J. W. (1962). The future of data analysis. _The Annals of Mathematical Statistics_ , 33(1), 1–67.
  * Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. _Econometrica_ , 47(2), 263–291.
  * Fiorella, L., & Mayer, R. E. (2016). Eight ways to promote generative learning. _Educational Psychology Review_ , 28(4), 717–741.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

## One question back to you

The step people cut when they are short of time is almost always the fourth one, writing down what would prove them wrong. When you have skipped it, was it because you ran out of time, or because you did not want to find out? I have skipped it for the second reason more than once.

---

*The full version of this guide lives on my site: [Report or Analysis?](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
