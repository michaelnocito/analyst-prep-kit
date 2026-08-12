By the end of this page you can turn a table of events into a funnel in one query, work out what fraction of people get from each step to the next, tell the difference between a step people pass and a step people skip, and produce the one summary a funnel is actually for: where everybody stops. It is about twenty-five minutes, and every result below was run.

Here is what to do today, on the funnel you already report. Look for any step converting at or near 100%. That is almost never a step working perfectly; it is a step that can be bypassed, or one that is logged as a side effect of the next one. Find the sessions that reached the later step without the earlier one, and you will have found it in a single query.

The short version: count distinct sessions per step with conditional aggregation, then check whether reaching a step actually required the one before it.

A step that can be bypassed is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Four horizontal bars are stacked and centred, forming a funnel that narrows downwards. The top bar is labelled view and holds the number 10, and it is the widest. Below it a narrower bar labelled cart holds 7. Below that a much narrower bar labelled checkout holds 3. At the bottom a bar labelled purchase holds 3, and it is drawn exactly as wide as the checkout bar above it, so the funnel stops narrowing at the last step. An amber pipe leaves the right-hand end of the cart bar, curves out to the right, runs down past the checkout bar without touching it, and turns back in to join the right-hand end of the purchase bar. The picture shows two things at once that are really one thing: the last two bars match in width, and there is a route from cart to purchase that never enters checkout._

**Every result on this page is real.** Twenty-four events across ten sessions, four steps, loaded into DuckDB and queried. Ten sessions is deliberately small enough that you can hold the whole thing in your head and check every number, which is how funnel queries should be built before they meet real volumes.

Here is everything the ten sessions did, so nothing later is a surprise.

| Session | Path                              | Events |
|---------|-----------------------------------|--------|
| S1      | view > cart > checkout > purchase | 4      |
| S2      | view > cart > checkout > purchase | 4      |
| S3      | view > cart > checkout            | 3      |
| S4      | view > cart                       | 2      |
| S5      | view > cart                       | 2      |
| S6      | view                              | 1      |
| S7      | view                              | 1      |
| S8      | view                              | 1      |
| S9      | view > cart > purchase            | 3      |
| S10     | view > view > cart                | 3      |

## 1. What a funnel query has to produce

A funnel is a count of _things_ that reached each of an ordered list of steps. Three decisions come before any SQL, and all three change the numbers.

**What is the thing being counted?** Sessions, users, orders, applications. A user who visits five times is one user and five sessions, and those funnels look nothing alike.

**What are the steps, in what order?** The order is your claim about the process, and section five is what happens when the data disagrees with it.

**Over what window?** All time, a day, within thirty minutes of the first step. A funnel with no window quietly counts somebody who viewed in January and purchased in May as a conversion.

Write those three down before writing the query. They are the same discipline as any other metric, and [defining a metric](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/) is the longer version of why.

## 2. Count sessions, not events

Before the explanation: ten sessions produced twenty-four events. Say how many of those events are views.
    
    
    SELECT step, COUNT(*) AS events, COUNT(DISTINCT session_id) AS sessions
    FROM events GROUP BY 1;
    
    view     | 11 | 10
    cart     |  7 |  7
    checkout |  3 |  3
    purchase |  3 |  3

Eleven view events, ten sessions. Session S10 viewed twice, which is entirely normal behaviour and completely wrong to count twice: the top of a funnel is the number of sessions that got that far, not the number of times they did it.

The gap is small here and it is never small in real data, because the first step of a funnel is exactly the step people repeat. A homepage view logged on every navigation can produce a top-of-funnel figure several times the number of visitors, which makes every conversion rate below it look terrible for no reason.

So every count in a funnel is `COUNT(DISTINCT thing_id)`. If your funnel's top number is bigger than your visitor count, this is why.

## 3. Conditional aggregation: the whole funnel in one row

The grouped version above gives one row per step, which is fine for a chart and awkward for computing rates, because each rate needs two rows. Conditional aggregation puts the whole funnel on one row instead.
    
    
    SELECT COUNT(DISTINCT CASE WHEN step='view'     THEN session_id END) AS viewed,
           COUNT(DISTINCT CASE WHEN step='cart'     THEN session_id END) AS carted,
           COUNT(DISTINCT CASE WHEN step='checkout' THEN session_id END) AS checked_out,
           COUNT(DISTINCT CASE WHEN step='purchase' THEN session_id END) AS purchased
    FROM events;
    
    10 | 7 | 3 | 3

The mechanism is worth understanding rather than copying. `CASE` returns the session id when the step matches and `NULL` when it does not, and `COUNT` ignores nulls, so each column counts only the sessions that reached that step. It is the same trick as a pivot done by hand, and [the CASE guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/) covers the expression itself.

One row of four numbers is what you want, because now every rate is arithmetic between columns rather than a join between rows.

## 4. Step to step, and overall

Two different questions, and reports routinely show one while labelling it the other.
    
    
    viewed | carted | checked_out | purchased
        10 |      7 |           3 |         3
    
    view to cart          70.0%
    cart to checkout      42.9%
    checkout to purchase 100.0%
    overall (view to purchase) 30.0%

**Step to step** divides each count by the one above it, and it answers "of the people who got here, how many went on". **Overall** divides by the top, and it answers "of everybody who started, how many finished". Multiplying the step rates together gives the overall rate, which is a useful check: 0.700 × 0.429 × 1.000 is 0.300.

Both belong on the report. Step to step tells you where to spend your effort; overall tells you what the process is worth. Publishing only the step rates lets a page with a 90% rate look like a success when only forty people a month reach it.

## 5. The 100% that means a step is being skipped

Before the explanation: checkout to purchase came out at exactly 100.0%. Say what that would mean if it were true.

That not one person who reached the checkout page failed to buy: no abandoned baskets, no failed cards, no second thoughts. On any real checkout that is not a result, it is a symptom, and the question to ask is not "why is checkout so good" but "is checkout actually on the path".

One query answers it. Reduce each session to flags, then look for the ones that reached the later step without the earlier one.
    
    
    WITH s AS (
      SELECT session_id,
             MAX(step='checkout')::INT AS did_checkout,
             MAX(step='purchase')::INT AS did_purchase
      FROM events GROUP BY 1)
    SELECT session_id FROM s WHERE did_purchase = 1 AND did_checkout = 0;
    
    S9

S9 went view, cart, purchase. Three sessions checked out and three purchased, but they are not the same three, and the ratio between two different sets of three is not a conversion rate at all.

In real systems this has ordinary causes. A one-click or saved-card path skips the checkout page. A mobile app fires different events from the website. A checkout event is logged only on submission, so anyone who pays another way never generates one. Every one of those is worth knowing, and none of them is visible in a funnel chart.

Say out loud what the ratio between two overlapping-but-different sets is called. It is not a conversion rate, and giving it that name is how a data problem becomes a target somebody is asked to improve.

## 6. The strict funnel

If your claim is that the steps happen in order, make the query enforce it. Flag each session per step, then require every earlier flag as well.
    
    
    WITH s AS (
      SELECT session_id,
             MAX(step='view')::INT     AS v,
             MAX(step='cart')::INT     AS c,
             MAX(step='checkout')::INT AS k,
             MAX(step='purchase')::INT AS p
      FROM events GROUP BY 1)
    SELECT SUM(v)       AS viewed,
           SUM(v*c)     AS carted,
           SUM(v*c*k)   AS checked_out,
           SUM(v*c*k*p) AS purchased
    FROM s;
    
    10 | 7 | 3 | 2

Multiplying the flags is an `AND`: a session counts at a step only if it has that flag and every flag before it. The first three numbers are unchanged and the last one drops from 3 to 2, because S9 no longer qualifies.

Now the two headline rates, side by side:
    
    
    any purchase at all        30.0%
    completed the full path    20.0%

Ten percentage points apart on ten sessions, from one customer using a different route. Neither number is wrong. The first answers "how many bought", the second answers "how many went through the process we designed", and a report should say which one it is showing rather than leaving the reader to assume.

## 7. Where sessions actually stop

The funnel chart shows how many reached each step. What people actually want to know is where everybody gave up, and that is a different query with a much more useful answer, because every session appears exactly once.
    
    
    SELECT CASE WHEN p=1 THEN 'purchased'
                WHEN k=1 THEN 'stopped at checkout'
                WHEN c=1 THEN 'stopped at cart'
                ELSE        'stopped at view' END AS outcome,
           COUNT(*) AS sessions
    FROM s GROUP BY 1 ORDER BY sessions DESC;
    
    purchased           | 3
    stopped at view     | 3
    stopped at cart     | 3
    stopped at checkout | 1

Three, three, three and one, adding to ten, which is the session count. That reconciliation is the reason to build it this way: a funnel's counts overlap, so they cannot be checked against a total, while a furthest-step table partitions the sessions and must add up.

The `CASE` order matters and does the work: it tests the furthest step first, so each session lands in exactly one bucket, which is the same first-true-wins ordering rule as any other condition chain.

Picture your own funnel for a moment. If you rebuilt it as a furthest-step table, would the buckets add up to the number of people who entered? If not, something in the funnel is being counted in two places.

## 8. Order and time windows

Two refinements that matter as soon as the data is real.

**Order within a session.** The flag approach above asks whether a step happened, not whether it happened after the previous one. A session that purchases and then views a product page counts as a full path. If sequence matters, compare timestamps rather than flags: require the checkout time to be after the cart time, usually with `MIN(...)` of each step's time per session.
    
    
    MIN(CASE WHEN step='cart'     THEN event_time END) AS cart_at,
    MIN(CASE WHEN step='checkout' THEN event_time END) AS checkout_at
    -- then: WHERE checkout_at > cart_at

**The window.** Decide how long a session has to complete the funnel. Without a limit, a return visit weeks later is credited to the original view, which inflates conversion and makes any change to the process impossible to measure. With a limit that is too tight, you undercount slow but genuine conversions. There is no correct answer, only a stated one, and it belongs in the report heading rather than in the query.

## The full before and after

Same events, same question: how well does the process convert?

### Before
    
    
    SELECT step, COUNT(*) AS n FROM events GROUP BY 1;
    
    view     | 11
    cart     |  7
    checkout |  3
    purchase |  3
    
    view to cart 63.6%, cart to checkout 42.9%, checkout to purchase 100%

Three problems. The top number counts events, so it is eleven rather than ten and the first rate is wrong. The final step reports a perfect 100% that nobody questions because it is good news. And there is no total anywhere, so none of it can be reconciled against the ten sessions that exist.

### After
    
    
    -- one row per session, one flag per step
    WITH s AS (
      SELECT session_id,
             MAX(step='view')::INT AS v, MAX(step='cart')::INT AS c,
             MAX(step='checkout')::INT AS k, MAX(step='purchase')::INT AS p
      FROM events GROUP BY 1)                                   -- 10 rows
    
    SELECT SUM(v) AS viewed, SUM(v*c) AS carted,
           SUM(v*c*k) AS checked_out, SUM(v*c*k*p) AS purchased,
           ROUND(100.0*SUM(p)/SUM(v),1)       AS any_purchase,
           ROUND(100.0*SUM(v*c*k*p)/SUM(v),1) AS full_path
    FROM s;
    
    10 | 7 | 3 | 2 | 30.0 | 20.0
    
    -- and the table that has to add up
    purchased 3, stopped at view 3, stopped at cart 3, stopped at checkout 1   = 10

One row per session before any counting, so events cannot be double counted. Both conversion figures, labelled. And a furthest-step table that reconciles to the session count.

The claim, and it is the reason to look at a perfect step rather than celebrate it: **checkout to purchase read 100%, and the reason was that one session in ten never went through checkout at all, which also moved the honest conversion rate from 30% to 20%.**

## Edge cases that break a funnel

Six worth knowing.

**The step names changed.** A release renames `add_to_cart` to `cart_add` and the middle of the funnel collapses overnight. Check the distinct step values before believing a sudden drop.

**A step that is not logged everywhere.** Web fires it, the app does not. The funnel then measures platform mix rather than behaviour, and it moves whenever marketing changes channel.

**Sessions that start mid-funnel.** Somebody arrives on a product page from an email and never sees the homepage. They are a real conversion and they fail the strict funnel. Decide whether your top step is genuinely required.

**Bots.** They view and never buy, so they inflate the top of the funnel and depress every rate below it. Filter them before counting, not after questioning the numbers.

**Sessions spanning midnight or a timeout.** One person becomes two sessions, one of which viewed and one of which purchased, so a real conversion appears as two failures. This is the same identity problem as [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/), applied to sessions rather than customers.

**Comparing funnels of different populations.** A funnel that improved after a campaign may just have started with different people. The fix is the same as everywhere else in analytics: compare cohorts rather than periods, which is what [cohort analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-cohort-retention/) is for.

## Why this works

A funnel is a claim about sequence, and sequence is not something a table of events contains by itself; it has to be imposed. Work on mining patterns from event data treats the ordering as the object of study rather than as background, precisely because the interesting questions are about which things happen after which, and answering them requires a definition of what counts as a sequence and over what span (Agrawal & Srikant, 1995, _Proceedings of the 11th International Conference on Data Engineering_ , 3–14). Section eight's two refinements, comparing timestamps and choosing a window, are the small version of that. A funnel without them is not measuring a process, it is counting whether four things ever happened to the same session.

The deeper problem on this page is what happens when a number that does not mean what it says gets published anyway. Once a figure becomes a performance measure, people act on it, and a measure that captures only part of what it claims to reliably produces effort aimed at the measure rather than at the thing it stands for (Ridgway, 1956, _Administrative Science Quarterly_ , 1(2), 240–247). A checkout step reading 100% because it can be bypassed is exactly that shape: it is not merely wrong, it is wrong in the direction that invites a team to be congratulated and then asked to improve a different step instead.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because the benefit of self-testing carries over to problems that differ from the ones you tested on, which is what matters when the next funnel has different steps (Pan & Rickard, 2018, _Psychological Bulletin_ , 144(7), 710–756).

## Using this on your own project

Rebuilding every funnel at once is unnecessary. Do this instead, in order.

  1. **Check the top number against your visitor or session count.** If it is larger, you are counting events.
  2. **Reduce to one row per thing first** , with a flag per step, before any counting happens. Everything else becomes arithmetic on that.
  3. **Look at every step converting above about 95%** and run the bypass query on it.
  4. **Publish both rates** , any-completion and full-path, with the labels on them.
  5. **Build the furthest-step table** and check it adds to your entry count. It is the only reconciliation a funnel has.
  6. **State the window in the heading** , not in the query, so the reader knows what "converted" means.

If you have paper nearby, one optional sketch is worth five minutes. Draw your funnel as boxes, then draw every arrow you know about that skips a box: the saved-card path, the phone order, the salesperson entering it manually. Most funnels have at least one, and the ones with none usually have one nobody has drawn yet.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) gives you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                          | What it does                                                           |
|--------------------------------|------------------------------------------------------------------------|
| Three decisions first          | What is counted, what the steps are, over what window.                 |
| Count the thing, not the event | `COUNT(DISTINCT session_id)`. Views get repeated.                      |
| Conditional aggregation        | `COUNT(DISTINCT CASE WHEN step='x' THEN id END)`, one column per step. |
| Why it works                   | CASE returns NULL when the step does not match, and COUNT skips nulls. |
| Step to step                   | Each count over the one above it.                                      |
| Overall                        | Each count over the top. Step rates multiply to it.                    |
| A step at 100%                 | Not a perfect step. A step being skipped or logged as a side effect.   |
| Finding the bypass             | Flag per session, then later step is 1 and earlier step is 0.          |
| Strict funnel                  | Multiply the flags: `SUM(v*c*k*p)`. Requires every earlier step.       |
| Two headline rates             | Any completion, and full path. Here 30.0% and 20.0%.                   |
| Furthest step table            | Every session once. Must add to the entry count.                       |
| CASE order there               | Furthest step first, so each session lands in one bucket.              |
| Order within a session         | Flags do not check it. Compare `MIN(time)` per step.                   |
| The window                     | No limit credits a purchase months later to the original view.         |
| Renamed steps                  | A collapse in the middle. Check the distinct step values first.        |
| Bots                           | Inflate the top, depress every rate. Filter before counting.           |

**The one habit to keep.** Build the furthest-step table alongside the funnel and check it adds up to the number of sessions that entered. Funnel counts overlap, so they can never disagree with each other visibly; the furthest-step table partitions the same sessions, so it can, and it is the only reconciliation this shape of analysis has. If a funnel misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one I remember was a signup funnel where the email-verification step converted at 99.6%, which everyone read as a well-designed email, until it turned out verification was auto-completed for anyone arriving through a partner link and the real number for everybody else was around sixty. What has a suspiciously good step turned out to be in something you own?

## References

  * Agrawal, R., & Srikant, R. (1995). Mining sequential patterns. _Proceedings of the 11th International Conference on Data Engineering_ , 3–14.
  * Ridgway, V. F. (1956). Dysfunctional consequences of performance measurements. _Administrative Science Quarterly_ , 1(2), 240–247.
  * Pan, S. C., & Rickard, T. C. (2018). Transfer of test-enhanced learning: Meta-analytic review and synthesis. _Psychological Bulletin_ , 144(7), 710–756.

---

*Originally published on Analyst Prep Kit: [Funnel Conversion in SQL, and the Step That Shows 100%](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-funnel-analysis/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
