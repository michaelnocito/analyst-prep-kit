By the end of this page you can say, out loud and in your own words, what every core operations number does. What the unit of work is. Throughput, and why a count on its own answers nothing. Cycle time, and the rule that ties it to how much work is sitting open. Backlog. Utilization, and why aiming for 100 percent makes everything slower. Error rate, rework and first pass yield. Service levels, and why the average hides the customers you are failing. That list is most of what an operations analyst job, a technical screen, and a first real dataset will ask of you.

Here is what to actually do with it. Go through once end to end without stopping, just for the shape. Then come back to the retrieval sheet near the bottom, cover the right-hand column, and try to say each answer before you read it. That second pass is where the learning happens, and there is measured evidence for it further down.

The short version: operations analytics is the study of how work moves through a process. Every number in it is either how much, how fast, how much is stuck, or how much was wrong.

One idea decides more of your operations work than any other, so it gets the picture. Work arrives, waits, gets done, and leaves. How much is in progress and how long each item takes are two different spans over that same picture, and they are locked to each other.

> _The original carries a diagram here. In words: A left-to-right process diagram. On the far left an arrow labelled "arriving" points into a row of three small stacked boxes labelled "waiting", representing a queue. An arrow leads from the queue into a single larger rounded box labelled "working", representing the person or machine doing the job. A final arrow leads out of that box to the right and is labelled "done". Above the queue and the working box, a bracket in a strong accent colour spans both and is labelled "in progress", showing that work in progress includes everything waiting as well as everything actively being worked on. Below, a second bracket in the same accent colour spans from the arrival arrow all the way to the exit arrow and is labelled "time in system", showing that the time an item experiences covers its whole journey, waiting included, not just the part where somebody is working on it. The two brackets deliberately cover different spans of the same picture._

**What this page is, and what it is not.** This is the concept layer: what each number is and what question it answers. It is not a course in a particular tool. The calculations here are all division and subtraction, and they run in a spreadsheet or in SQL equally well.

## 1. What this field is called, and what a process is

Before the explanation: a coffee shop, a hospital ward, a warehouse and a support inbox all get measured with the same handful of numbers. What do those four things have in common?

The job title is usually **operations analyst** , **operations data analyst** , or **business operations analyst**. The field is called **operations analytics** , and you will also see **operational analytics** and **process analytics** for the same work. All of them mean measuring how work gets done and finding where it gets stuck.

There is one older name that means something different, and it is worth knowing so a job posting does not confuse you. **Operations research** is a mathematical field about optimizing decisions, built on things like linear programming. It shares an ancestor with operations analytics and it is a much heavier maths discipline. If a posting says operations research and asks for a maths degree, that is a different job from the one this guide prepares you for.

Now the thing all four examples share. A **process** is any repeated sequence of steps that turns something arriving into something finished. Coffee orders arrive and become drinks. Patients arrive and become discharges. Pallets arrive and become shipments. Tickets arrive and become resolutions.

Every process has the same four parts, and every number in this guide measures one of them:

  * **Arrivals.** Work showing up.
  * **A queue.** Work that has arrived and is waiting.
  * **Capacity.** The people, machines or hours available to do it.
  * **Completions.** Work leaving, finished.

That is the whole vocabulary. Once you can name those four parts in a business you have never seen before, you can measure it.

## 2. The unit of work, and the one word that prevents most mistakes

Before the explanation: a warehouse says it shipped 4,000 things last month. Do you know how much work that was?

You do not, and that is the point. Four thousand what? Orders, boxes, individual items, or pallets? A pallet might hold 200 items. An order might be one item or forty. The number 4,000 is useless until somebody says what one of them is.

The **unit of work** is the thing you are counting. Pick it first, name it out loud, and keep it the same all the way through the analysis. In a support inbox it is usually the ticket. In a warehouse it might be the order line. In a clinic it is the visit.

The related idea in the data itself is **grain** , which means what one row of your table represents. Say it as a sentence starting with "one row per". One row per order. One row per order line. One row per shipment. Those three tables can all have 4,000 rows and describe completely different amounts of work.

This is the single most common way an operations number comes out wrong. Somebody counts rows in a table whose grain is order lines and reports it as orders. The calculation is correct and the answer is wrong. Grain is covered in more depth in the [SQL foundations guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/), because it is the same idea wearing different clothes.

Say this one out loud before you read on: in a hospital, what is the difference between counting patients and counting visits?

## 3. Throughput, and why a count on its own answers nothing

Before the explanation: night shift processed 900 orders and day shift processed 500. Which shift is better?

You cannot say yet, and the reason is the most important habit in this whole guide.

A **count** is how many things happened. 900 orders. It tells you the volume that got done and nothing else.

A **rate** is that count divided by the opportunity somebody had to produce it. Almost always hours. In operations the rate has a name: **throughput** , meaning completed work per unit of time.

Back to the two shifts. Night worked 160 hours, day worked 60.

  * Night: 900 ÷ 160 = **5.6 orders per hour**
  * Day: 500 ÷ 60 = **8.3 orders per hour**

Day shift is faster. The count said the opposite, because night shift simply had more hours to work with.

Both numbers are real and both have a job. The count tells you how much got delivered, which is what a customer experiences. The rate tells you how efficiently it was produced, which is what a manager can act on. Reporting only one of them is the mistake, in either direction.

The habit to keep from this section is short. Before you compare two operational numbers, ask what each one was divided by. If neither was divided by anything, you are comparing volumes and you should say so out loud.

## 4. Cycle time, and the three numbers that lock together

Before the explanation: your team wants tickets resolved twice as fast. Nobody is allowed to work faster and nobody is getting hired. Is there anything left to change?

There is, and this section is the answer. First, the time words, because they get mixed up constantly.

  * **Cycle time.** How long one item takes from starting work on it to finishing it.
  * **Lead time.** How long one item takes from arriving to finishing, waiting included. This is what the customer feels.
  * **Wait time.** The gap between the two. Usually the biggest part, and usually the one nobody measures.

People say cycle time loosely to mean either. In an interview, say which one you mean and you will sound like you have done the job.

Now the rule that connects everything. There is a formula in queueing theory called **Little's Law** , and it is one line:
    
    
    work in progress = arrival rate × time in system

Work in progress is how many items are open right now, waiting or being worked on. Arrival rate is how many show up per day. Time in system is how long an average item takes end to end.

A worked example. Tickets arrive at 20 a day, and at any moment 60 tickets are sitting open. Rearrange the formula and time in system is 60 ÷ 20, which is **3 days**. You just measured your own resolution time without timing a single ticket.

And here is the answer to the prequestion. To cut that 3 days to 1.5, you change one of the two other numbers. Halve the open tickets to 30, and 30 ÷ 20 gives 1.5 days. Or double throughput so items leave faster. Nobody had to type faster. Limiting how much work is open at once is a real lever, and it is why teams cap their in-progress column.

Picture your own work now. How many things do you personally have open and unfinished at this moment, and what would happen to how fast each one finishes if you cut that number in half?

## 5. Backlog, which is just arrivals minus completions

Before the explanation: a team closes 90 tickets every single week without fail. Is that team keeping up?

**Backlog** is the work that has arrived and is not finished. The number that matters is not the size of the backlog, it is which way it is moving.

The arithmetic is one subtraction. Arrivals minus completions, per period.

  * 100 arrive a week, 90 close a week. Backlog grows by 10 a week.
  * Ten weeks of that and the backlog is 100 items deeper than it started.
  * Nothing about the team's performance changed. They closed 90 every week.

That is the answer to the prequestion. Whether 90 is keeping up is not a fact about the team, it is a fact about how much arrived. A closure number reported without an arrival number next to it cannot answer the question anyone is actually asking.

This is the finding that gets an operations analyst noticed, because it reframes a performance conversation as a capacity conversation. "Rep B is slower" is an accusation. "Rep B's queue receives 4 tickets an hour and one person can clear 2" is a staffing decision with a number attached.

One more term you will meet. **Aging** is how long the items in the backlog have been sitting. A backlog of 100 where the oldest is 2 days old is healthy. A backlog of 100 where the oldest is 8 months old contains work nobody is ever going to do, and saying so is usually more useful than another dashboard.

## 6. Utilization, and why 100 percent is the wrong target

Before the explanation: your team is busy 95 percent of the time. Your manager wants to know why everything is late. What would you tell him?

**Utilization** is the share of available time that is actually spent working. Four hours of work in an eight hour shift is 50 percent utilization. It feels like the number should be as high as possible. It should not, and the reason is the most counterintuitive idea in operations.

Waiting time does not rise steadily as a team gets busier. It rises gently, then explodes. The part of the maths that causes this is a single fraction: utilization divided by one minus utilization. Watch what it does.

  * At 80 percent busy: 0.8 ÷ 0.2 = **4**
  * At 90 percent busy: 0.9 ÷ 0.1 = **9**
  * At 95 percent busy: 0.95 ÷ 0.05 = **19**

Going from 80 percent busy to 90 percent busy more than doubles the waiting. Going from 90 to 95 doubles it again. The team took on a little more work each time and the queue behind them grew far faster than the workload did.

That is the answer to the prequestion, and it is why the honest response to "everything is late" is often "because we are 95 percent busy, and the last 5 percent of capacity is what absorbs a bad day". A process with no slack has nowhere to put a surprise.

Two things make this worse, and both are worth naming because you can measure them. **Variability in arrivals** , meaning the work shows up in bursts rather than evenly. And **variability in service** , meaning some items take far longer than others. A process with steady arrivals and predictable work can run much closer to full than a process with spiky arrivals. That is why a factory can run at 90 percent and an emergency room cannot.

## 7. Quality: error rate, rework, and first pass yield

Before the explanation: two teams both complete 1,000 items a week. One of them is doing noticeably more work than the other. How?

Because some of those completions were the same item twice. Work that comes back is **rework** , and it is invisible in a completion count.

Three numbers cover quality, and they are all shares of a total.

| Number               | What it asks                                                                                                |
|----------------------|-------------------------------------------------------------------------------------------------------------|
| **Error rate**       |  Of everything we did, what share was wrong? 30 wrong out of 1,000 is 3 percent.                            |
| **Rework rate**      |  What share had to be done again? This is the one that eats capacity.                                       |
| **First pass yield** |  What share went through correctly the first time, with no rework? 1,000 started, 940 clean, so 94 percent. |

First pass yield is the one worth learning by name, because it is the number that connects quality to speed. Every point of yield you lose comes back as extra volume through the same process. A team at 85 percent first pass yield is doing roughly 15 percent of its work twice, which means its real capacity is smaller than its headcount suggests.

That is the answer to the prequestion. Same 1,000 completions, different amounts of actual work delivered, because one team's number includes items it had already counted once.

One caution before you report any of these. An error rate is only as good as the definition of an error, and that definition is a decision somebody has to make on purpose. What counts as wrong, who decides, and when. Getting that written down before you measure is its own skill, and there is a walkthrough of it in [turning fuzzy questions into measurable definitions](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/).

## 8. Service levels, and why the average hides your worst customers

Before the explanation: your promise is to resolve every ticket within 8 hours. Your average resolution time is 5.8 hours. Are you keeping the promise?

An **SLA** , a service level agreement, is a promise about time. Resolve within 8 hours. Ship within 2 days. Answer within 30 seconds. **SLA attainment** is the share of items that met the promise.

Here is why the average cannot tell you. One hundred tickets:

  * 90 of them resolved in 2 hours.
  * 10 of them took 40 hours.

The mean is (90 × 2 + 10 × 40) ÷ 100, which is (180 + 400) ÷ 100, which is **5.8 hours**. Comfortably inside an 8 hour promise.

And yet 10 customers waited 40 hours, five times the promise. Those are the ones who complain, escalate, and leave. The average did not lie, it answered a question nobody asked.

The fix is a **percentile**. The 95th percentile is the value that 95 percent of your items came in under. In the example above the 95th percentile is 40 hours, which tells the true story in one number. Operations reporting runs on percentiles for exactly this reason, and you will see them written as p50, p90 and p95. The p50 is the median.

The rule to carry into a job: an average describes the typical case, and a percentile describes the bad case. A promise is about the bad case, so measure it with a percentile. This connects directly to [picking cutoffs you can defend](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/), because somebody has to decide whether the promise is p90 or p95, and that decision is worth more than the dashboard.

## 9. Telling a real change from noise

Before the explanation: throughput dropped 6 percent this week. Should you tell anyone?

Not yet. Every process varies week to week without anything having changed. Reporting normal variation as a finding is the fastest way for an analyst to lose credibility, because the number goes back up next week and the alarm looks silly.

The distinction has names, and they are worth using. **Common cause variation** is the ordinary wobble a stable process always has. **Special cause variation** is a real change with a real reason behind it. The job is telling them apart before you say anything.

The cheapest honest test does not need statistics. Take the last 20 periods, look at how much the number normally bounces around, and ask whether this week's move is bigger than the moves you already ignored. If the number has swung 5 percent every week for five months, a 6 percent drop is Tuesday.

Three questions that catch most false alarms:

  1. **How many items is this based on?** A 6 percent drop on 2,000 orders is a signal. On 30 orders it is two people taking a day off.
  2. **Is the denominator stable?** A rate can move because the top changed or because the bottom did. A holiday week has fewer hours in it.
  3. **Does anything else move with it?** A real change usually shows up in two places. If throughput fell and backlog rose, something happened. If throughput fell and nothing else moved, look at your data before you look for a cause.

Being able to say "that is inside our normal range" is a professional skill, not a dodge. It is also the section of this guide most likely to come up in an interview as a scenario question, because it separates people who report numbers from people who interpret them. The difference between those two jobs is covered in [the difference between a report and an analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/).

## 10. The same report, counts and rates side by side

Same warehouse, same month, same underlying data. On the left, what most first drafts look like. On the right, the same facts with a denominator attached.

| Counts only                                                       | The same month, as rates                                                                          |
|-------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Night shift shipped 900 orders. Day shift shipped 500.            | Night ran 5.6 orders per hour across 160 hours. Day ran 8.3 across 60.                            |
| We closed 90 tickets a week, every week.                          | 100 arrived a week and 90 closed, so the backlog grew by 10 a week.                               |
| Average resolution time was 5.8 hours, inside our 8 hour promise. | Ninety percent resolved in 2 hours. The slowest 10 percent took 40, so p95 attainment failed.     |
| The team completed 1,000 items.                                   | 940 went through clean, so first pass yield was 94 percent and 60 items were done twice.          |
| The team is busy 95 percent of the time.                          | At 95 percent utilization the queue term is 19, against 4 at 80 percent, so lateness is expected. |

Nothing on the right required new data. Every one of those is the same figure with the question "compared to what" answered.

## 11. Where these ideas come from

Two of the rules in this guide are not conventions somebody agreed on. They are proved results, and knowing that is worth a sentence in an interview.

The formula in section 4 is **Little's Law** , proved by John Little in 1961 (Little, 1961, _Operations Research_ , 9(3), 383–387). The striking part is how few assumptions it needs. It does not care what order the work is done in, how many people are working, or how the arrivals are distributed. If the process is stable over the period you measure, work in progress equals arrival rate times time in system. That is why you can apply it to a hospital and a helpdesk with the same confidence.

The explosion in section 6 comes from queueing theory, and the specific result is **Kingman's formula** (Kingman, 1961, _Mathematical Proceedings of the Cambridge Philosophical Society_ , 57(4), 902–904). It shows that as a server approaches full utilization, waiting time grows in proportion to that utilization over one minus utilization fraction, scaled by how variable the arrivals and the service times are. The arithmetic in section 6 is that fraction on its own. It is also why reducing variability, rather than working faster, is often the cheapest way to make a process feel quicker.

The idea in section 9 is older still. Walter Shewhart separated ordinary process variation from genuine signals while working at Bell Labs in the 1920s, and published the method in 1931 (Shewhart, 1931, _Economic Control of Quality of Manufactured Product_ , Van Nostrand). The control chart on a factory wall and the "is this inside our normal range" question in section 9 are the same idea, ninety years apart.

## 12. How to study this so it sticks

Reading this page again will feel like learning and mostly will not be. Three findings change what an hour of study is worth, and all three are cheap to act on.

The first is that retrieving something from memory stores it better than reviewing it does. Students who read a passage once and then took recall tests remembered far more a week later than students who read the same passage four times, even though the re-readers felt more confident (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). Applied here: cover the right-hand column of the retrieval sheet below and say each answer before you look. The struggle is the mechanism, not a sign you are doing it badly.

The second is spacing. The same total study time, spread across days rather than packed into one sitting, produces substantially better retention, and the effect holds across hundreds of experiments (Cepeda, Pashler, Vul, Wixted, & Rohrer, 2006, _Psychological Bulletin_ , 132(3), 354–380). Three twenty-minute passes on three days beats one hour tonight.

The third is why this guide keeps asking you to say things out loud. Learners who explain a worked example to themselves as they go understand it substantially better, and transfer it to new problems better, than learners who read the same example without explaining it (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182). Operations is where that pays off most, because the mistake is almost never in the arithmetic. It is in what you believe the number was divided by.

If you have paper nearby and a spare five minutes, there is one drawing worth doing, and it is optional. Draw the picture at the top from memory: arriving, waiting, working, done, then the two brackets over it. Label which bracket is work in progress and which is time in system. Getting the second bracket to start at the arrival rather than at the working box is the whole idea, and drawing it from memory is both a retrieval attempt and a check on whether you actually have it.

## 13. The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                    | What it does                                                                           |
|----------------------------|----------------------------------------------------------------------------------------|
| Process                    | A repeated sequence turning arrivals into completions.                                 |
| The four parts             | Arrivals, queue, capacity, completions. Every number measures one.                     |
| Unit of work               | The thing you are counting. Name it before you count anything.                         |
| Grain                      | What one row of your table means. Say it as "one row per something".                   |
| Count                      | How many happened. Volume delivered, and nothing else.                                 |
| Rate                       | A count divided by the opportunity to produce it. Usually hours.                       |
| Throughput                 | Completed work per unit of time. The rate version of a count.                          |
| Cycle time                 | Start of work to finish, for one item.                                                 |
| Lead time                  | Arrival to finish, waiting included. What the customer feels.                          |
| Wait time                  | The gap between the two. Usually the biggest part.                                     |
| Little's Law               | Work in progress = arrival rate × time in system.                                      |
| Using Little's Law         | Cut time in system by cutting work in progress, without anyone working faster.         |
| Backlog                    | Arrived and not finished. Direction matters more than size.                            |
| Backlog growth             | Arrivals minus completions, per period.                                                |
| Aging                      | How long backlog items have been sitting. Old backlog is usually dead work.            |
| Utilization                | Share of available time actually spent working.                                        |
| Why 100 percent fails      | Waiting scales with utilization over one minus utilization. 80% gives 4, 95% gives 19. |
| Variability                | Bursty arrivals or unpredictable job lengths. Makes every queue longer.                |
| Error rate                 | Share of output that was wrong.                                                        |
| Rework rate                | Share that had to be done again. Eats capacity invisibly.                              |
| First pass yield           | Share that went through clean the first time. Links quality to speed.                  |
| SLA                        | A promise about time. Resolve in 8 hours, ship in 2 days.                              |
| SLA attainment             | Share of items that met the promise.                                                   |
| Percentile                 | The value a given share of items came in under. p95 is the bad case.                   |
| Average against percentile | An average describes the typical case. A promise is about the bad case.                |
| Common cause variation     | The ordinary wobble a stable process always has.                                       |
| Special cause variation    | A real change with a real reason. Prove it before you report it.                       |
| Cost per unit              | Total cost divided by units produced. Where headcount enters the reporting.            |

**The one habit to keep.** Before you report any operations number, say out loud what it was divided by. "Nine hundred orders, divided by nothing" is a volume. "Nine hundred orders across 160 hours" is a finding. Nearly every wrong operations conclusion is a correct count compared against a different denominator than the one somebody assumed, and that one sentence catches it before the number leaves your desk.

One genuine question, and I would like other people's answers. The idea that took me longest was utilization, because "busier is better" is so obviously true right up until you see what it does to a queue. Which operations idea did you understand backwards for the longest, and what finally fixed it?

## References

  * Little, J. D. C. (1961). A proof for the queuing formula: L = λW. _Operations Research_ , 9(3), 383–387.
  * Kingman, J. F. C. (1961). The single server queue in heavy traffic. _Mathematical Proceedings of the Cambridge Philosophical Society_ , 57(4), 902–904.
  * Shewhart, W. A. (1931). _Economic Control of Quality of Manufactured Product_. New York: D. Van Nostrand Company.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.
  * Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. _Psychological Bulletin_ , 132(3), 354–380.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [Operations Analytics, Start to Finish](https://michaelnocito.github.io/analyst-prep-kit/guides/operations-analytics-foundations/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
