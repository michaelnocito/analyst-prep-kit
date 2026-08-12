**New to this?** Read [the eight stages](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/) first. That page tells you which stage you are in and what to do about it. This page shows all eight happening on one real-shaped job, so it makes more sense second.

By the end of this page you will have seen a whole migration run, start to finish. You will know what was sent on the day each stage closed, who signed it, what it cost when the client asked for more, and what the paper trail looked like at the end.

**The short version.** A migration is eight stages, and each one ends at a **gate**. A gate is a checkpoint with an owner and a written answer: one named person agrees, in writing, that the stage is finished and the next one can start. Getting that agreement is the job. The rest is checking.

Two of the eight closing emails are reproduced here in full, at gate 1 and gate 6. All four email types, including the chase and the handoff, are in [the emails guide](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-emails/).

## The engagement

All of it is invented. The shape is not.

| Client            | Northwind Care Services, a home care agency                                                                                                        |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Moving from       | CareTrack 4.2, in use since 2011                                                                                                                   |
| Moving to         | Meridian Care Platform                                                                                                                             |
| What moves        | 1,482 client records, 58,740 visits, 6,310 documents, some of them paper                                                                           |
| Kickoff           | 23 February 2026                                                                                                                                   |
| Go-live           | 3 August 2026. Go-live is the day staff stop using the old system and start using the new one.                                                     |
| Where it is today | Mid cutover. Cutover is the actual move: the old system goes read only, and the data is loaded across. Six gates signed, go-live not yet accepted. |

Note the last row. This is a live tracker, caught in the middle. A finished project would teach you less, because the interesting part of a migration is what it looks like while the answer is still open.

## Stage 1: kickoff and scope, 24 February to 13 March

Before you read on, guess: of everything agreed in a kickoff, which single item saves the most time later?

It is not the scope. It is the name of the one person who answers data questions. Here that was action A003, raised on 27 February, answered by 2 March. The client named their Data Owner, J. Okafor. Every ambiguous field for the next five months went to one inbox instead of a committee.

The other thing that happened in week one was the [exclusion list](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-kickoff-scope/). Records before 2019 were confirmed as archive only and did not move. That one decision cut the volume by about a third.

Gate 1

**Scope, including the exclusion list.** Signed by A. Reyes, Client PM, on 13 March. Evidence held: the confirming email, saved to the `01-scope` folder.

**Subject:** Northwind migration, scope confirmed and what happens nextCopy this email

Hi Alex,

Thanks for Tuesday. Scope is now agreed and attached as v1.0. In summary, we are moving client records, visit records and documents from 2019 onward. Records before 2019 stay in CareTrack as an archive and are not migrated.

**Your next actions**

  * Confirm read access to CareTrack for our team, by 11 March. Owner: your IT contact.
  * Confirm J. Okafor as the single point of contact for data questions, by 11 March.

**Our next actions**

  * Take the full initial export, starting 16 March.
  * Profiling report back to you by 1 April.

**If access slips** , profiling slips with it, and profiling is what tells us whether the August date holds. A week lost here is a week off the end.

The plan is here [link]. Please confirm you have received this and forward it to anyone who needs it.

The highlighted parts are the ones you swap for your own. Everything else is the shape, and the shape is what makes it work.

Four parts, every time: your actions with dates, our actions with dates, the impact of delay in their terms, and the link to the plan. The [emails guide](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-emails/) takes those apart.

## Stage 2: profile the source, 16 March to 1 April

Profiling is where the estimate meets the data. Two findings changed the plan.

1,204 client records had no date of birth. That is a required field in the target, so it would have failed the load. The client accepted moving them blank and cleaning up afterward, logged as exception E008 and action A004.

The second was the picklist. Service type was free text in the old system, so `home aide`, `HHA` and `H.H.A.` were all the same thing typed three ways. That is normal, and it is the sort of thing you only find by looking. It is the reason the [look before you trust](https://michaelnocito.github.io/analyst-prep-kit/guides/exploratory-data-analysis/) habit exists.

Gate 2

**The profiling report, and the decisions taken from it.** Signed by A. Reyes on 1 April. Evidence held: report v1.2, countersigned.

The wording of that gate matters. Not "the report", the report _and the decisions_. A finding with no decision attached is just a fact you will rediscover in June. See [the seven checks](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-profiling/).

## Stage 3: map the fields, and the first real pressure, 2 April to 1 May

On 2 April, the day mapping started, the client's Data Owner asked for scheduling history to be migrated as well. It was not in the signed scope.

Before reading the next paragraph, decide what you would say.

The answer is not yes and it is not no. It is the number. Scheduling history was three more weeks on the timeline and two weeks of effort. That was written into the change log as CR-02 the same day, with the impact filled in before any conversation about whether to do it.

Then two doors, both of them real:

  * **Door one.** We do it, and go-live moves from early August to late August.
  * **Door two.** We hold the date, and scheduling history becomes phase two.

The client took door two, on 13 April. That is the usual outcome, and the reason is worth understanding. The request was never unreasonable. It just had a price nobody had seen yet, and the person asking did not own the date. Once the cost was in front of somebody who did own the date, it answered itself. This is the whole of [scope creep](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-scope-creep/) in one move.

CR-03 followed on 23 April: keep the legacy note formatting exactly as it looks today. Declined on 27 April, because the target cannot hold it. What made that decline land was explaining what the target can and cannot do, then agreeing plain text, rather than just saying no.

Gate 3

**The field map, version frozen.** Signed by J. Okafor, Client Data Owner, on 1 May. Evidence held: map v3.0, signed. The working copy is kept separately.

Two details in that gate line. The Data Owner signs, not the PM, because the Data Owner is the person who can actually be wrong about a field. And the signed copy lives apart from the working copy, so that in September nobody has to argue about which version was agreed. More in [field mapping](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-field-mapping/) and [file hygiene](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-file-hygiene/).

## Stage 4: clean, de-dupe, and eight things a rule could not fix, 4 May to 1 June

Cleaning is rules, not edits. A rule can be previewed, counted, reversed and explained. An edit cannot.

Eight records were left that no rule could handle, and those became the exception sheet. One was a duplicate client, the same name and date of birth under two numbers. Only the client could say which record survived and whether the visit history merged. They chose to keep NW-4471 and merge.

Another, E007, was a date of birth reading `02/03/1948`, which is February in one country and March in another. Somebody checked the paper chart. It was 3 February.

The client worked the whole list between 22 and 29 May. Every one carries a decision and a date.

Gate 4

**Exception list closed or formally accepted.** Signed by J. Okafor on 1 June. Evidence held: the exception sheet, eight items, all answered.

Read "or formally accepted" carefully. E008, the 1,204 blank dates of birth, was never fixed. It was accepted, in writing, with a named owner for the cleanup. An open exception is a decision nobody made yet, and it will surface after go-live wearing a different hat. See [cleaning](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-cleaning/).

## Stage 5: the dry run, 2 to 24 June

Everything goes into a sandbox. Everything, not a sample. A sample tells you nothing about the record that breaks the loader, because that record is always the strange one.

Six checks run against it, and they split into two halves. Counts, control totals, orphan links and spot checks on real records all ask the same question: did the data arrive. Then two more ask whether it works. **Processability** means putting the target system through a real job, generating an invoice, scheduling a visit, running the report the client runs every Monday. **Integration** means checking that everything downstream still works, the payroll export and the billing handoff included.

That distinction is not academic. Data can sit in the database looking perfect and still be unusable, because the loader wrote straight into the tables and skipped something the application expects to find.

The dry run earned its place here. On 12 June the loader was found to be silently truncating notes longer than 4,000 characters. Silently. No error, no warning, just shorter notes. In a care agency those notes are the clinical record.

That became action A008, fixed by splitting the overflow into a linked note record, and the field map was reopened and re-signed for that one row. A frozen map that changes after a dry run is fine, as long as the change is signed the same way the original was.

Gate 5

**A clean reconciliation in the sandbox.** Signed by the migration lead on 24 June. Evidence held: the reconciliation tab, every row Pass.

This is the one gate the client does not sign, and that is deliberate. It is an internal bar. You do not put a broken load in front of testers and ask them to be understanding about it. See [the dry run](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-dry-run/).

## Stage 6: user acceptance testing, 25 June to 14 July

Testers were people who do the work daily, not managers. That distinction is the whole stage. A manager will click through a system and say it looks fine. A scheduler will try to find one specific client on a Tuesday and notice that something is missing.

Which is what happened. Two testers reported service type showing as blank on older records. A free-text variant had been missed by the picklist map. Rule added, reloaded, re-checked, logged as A009 and closed on 13 July.

That is a good UAT finding, and it is worth saying why. It was found by somebody who knew what should have been there. No count, no reconciliation and no automated check would have caught it, because the number of records was right. Only the meaning was wrong.

Gate 6

**UAT passed by the people who did the testing.** Signed by A. Reyes on 14 July. Evidence held: the sign-off sheet, six testers.

**Subject:** UAT sign-off, and the cutover plan for the last two weeks of JulyCopy this email

Hi Alex,

UAT is complete. Six testers ran the scripts, twelve findings were raised, and all twelve are closed. The sheet is attached with each finding and how it was resolved.

The two that changed the load were the blank service type on older records, now fixed and reloaded, and the note truncation found in the dry run, now split into linked notes.

**Your next actions**

  * Reply to confirm UAT sign-off, by 14 July. This is the gate. Cutover does not start without it.
  * Tell your staff the freeze window: CareTrack is read only from 15 July.

**Our next actions**

  * Cutover rehearsal, 17 to 21 July. Full sequence, clock running, no production data touched.
  * Final delta export, 22 July.
  * Go/no-go call, 23 July, 9am. You decide, on the rehearsal timings and the reconciliation.
  * Cutover 24 to 27 July, then the bridge import, then reconciliation.
  * Go-live acceptance meeting, 3 August.

**If sign-off slips past Monday** , the freeze moves with it, and the freeze is the part your staff feel. Every day it moves is another day of double entry for the schedulers.

Plan is here [link]. Please confirm receipt.

Note what the delay costs, in their words. Not "this will delay the project". The schedulers doing double entry. See [UAT](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-uat/).

## The one that was declined

On 19 May the client PM asked to bring go-live forward by a week, to suit a board meeting. It was declined on 21 May, and the reason went in writing: the week had to come out of UAT, and skipping UAT sign-off would mean going live on a system nobody had tested.

Saying no to a client is a service, when the thing they asked for would hurt them. What makes it survivable is that the refusal is on the record with its reason, in the change log, next to the three requests that were not refused. A change log with only rejections in it looks like obstruction. This one shows one accepted, one deferred, two declined, and that pattern is what makes the declines credible.

| CR    | Asked for                                               | Timeline         | Outcome                      |
|-------|---------------------------------------------------------|------------------|------------------------------|
| CR-01 | A custom referral source field promised during the sale | None if done now | Accepted                     |
| CR-02 | Scheduling history as well as records                   | Plus 3 weeks     | Deferred to phase two        |
| CR-03 | Legacy note formatting kept exactly                     | Plus 1 week      | Declined, alternative agreed |
| CR-04 | Go-live pulled forward one week                         | Minus 1 week     | Declined, reason in writing  |

CR-01 is the quiet lesson in that table. Sales promised something that was not in the target system. It was small, so it was absorbed, and it was still written down as a change request. Things that cost half a day are exactly the things that never get logged, and a change log with gaps in it is not evidence of anything.

## Stage 7: rehearse, freeze, cutover, bridge, 15 July onward

This is where the project is now.

The week before anything real happened, the whole sequence was rehearsed. Final export, load, reconcile, bridge, reconcile again, in order, with the clock running. Not to check the data, which the dry run had already settled, but to check the time. It came in at nineteen hours against a freeze window of a full weekend, which is the answer you want on the Tuesday before rather than at 4am on the Saturday.

Then the freeze went out, the delta export was taken on 22 July, and on the morning of 23 July there was a fifteen minute call with one question on it: go, or not.

That call had been in the plan since kickoff, with the name of the person who decides written next to it. A. Reyes, the client PM. The evidence list was agreed in advance too: rehearsal timings, dry run reconciliation clean, UAT signed, freeze confirmed by their own staff. Nobody was inventing a standard at nine in the morning.

It is worth being honest about what "no" would have meant, because it is smaller than it sounds. Once the new system is open and people are working in it, going back is close to impossible, since the old system is now missing everything created since. The real fallback is not a rollback. It is _do not start, wait for the next window_. That is why the decision sits before the load and not during it.

The load then ran in order: records, then documents, then the links between them. That order is not a preference. A document cannot be attached to a client record that is not there yet.

The bridge import closes the gap. Between the initial export in March and the freeze in July, staff kept working, and everything they created in those four months has to be brought across too. Naming that gap at kickoff is what stops it from being a discovery in week twenty.

Post-load reconciliation is running now.

| Check                        | Source  | Target  | Result |
|------------------------------|---------|---------|--------|
| Client records               | 1,482   | 1,482   | Pass   |
| Visit records                | 58,740  | 58,740  | Pass   |
| Documents                    | 6,310   | 6,310   | Pass   |
| Active clients               | 913     | 913     | Pass   |
| Control total, balances      | 284,655 | 284,655 | Pass   |
| Documents with a client link | 6,310   | 6,310   | Pass   |

**This table is a tab in the workbook.** Open the [worked example](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/toolkit/Data-Migration-Toolkit-WORKED-EXAMPLE.xlsx) and you can see the formulas behind the Pass column, plus every other row on this page.

Five of those are counts. One is not. The control total sums the balances rather than counting the rows, and it is there because counts can match while values are wrong. If a decimal moved during a transform, the row count would not notice.

Every row above answers the same question: did the data arrive. Two more checks answer a different one, and they are not in this table because they do not produce a number. Can the target system actually _use_ the data, and does everything downstream still work. Both were run again here, as they were in the dry run. See [cutover](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-cutover/).

Gate 7, not yet signed

**Go-live accepted.** Pending. Post-load reconciliation runs to 3 August. Until the client accepts it in writing, this gate is open, and the tracker says so.

An honest tracker has open rows in it. A tracker where everything is green on the day you are asked for it is a tracker somebody filled in backwards.

## Stage 8: hypercare and close, from 4 August

Hypercare is the support period straight after go-live, when people hit the new system for real and find the things testing did not. It is agreed before it is needed, not during the first panic. Length, route, and who answers. Here it runs to 25 August.

One item is already open. A010: the client wants a count of documents loaded per year for their auditor. That is not a defect, it is the long tail, and it is what hypercare is actually for. Requests like it arrive for weeks and each one needs logging rather than answering off the side of a desk.

The stage ends with the final reconciliation report, an internal readout on what to change next time, and a handoff to Support that includes context rather than just a ticket. See [hypercare](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-hypercare/).

## When the client goes quiet

It has not happened on this engagement, which is itself the point. The single point of contact named on 2 March is why.

When it does happen, the ladder has three rungs and you climb them on a schedule you decided in advance. Restate the one action and the date it was agreed. Then attach the consequence to their goal, not yours. Then raise it to whoever owns the outcome, having told your contact you are about to. The wording for each rung is in [when the client goes quiet](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-quiet-client/).

Write the plan down at kickoff and follow it without deciding again each time. Deciding each time is how a chase becomes personal, and how three weeks pass with nothing on the record.

## What the paper trail is actually for

Five months produced this: eight gates with a name and a date on each, ten actions with owners and due dates, four change requests with their cost written down before the decision, eight exceptions each with a client decision, a field map signed and version frozen, and a reconciliation that ties.

None of that is bureaucracy. It is the answer to one question, asked months later by somebody who was not in the room: _why is it like this?_

Every one of those rows answers it. The blank dates of birth are blank because the client accepted it on 27 March. Scheduling history is missing because it was deferred on 13 April to hold the date. Go-live was not pulled forward because UAT would have been skipped. You will not remember any of that in November, and you should not have to.

**The tools on this page are free and open.** The [blank template](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/toolkit/Data-Migration-Toolkit-TEMPLATE.xlsx) and the [worked example](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/toolkit/Data-Migration-Toolkit-WORKED-EXAMPLE.xlsx) are the workbook this walkthrough describes. The [Python that generates them is on GitHub](https://github.com/michaelnocito/migration-toolkit), where every date is read off the plan rather than typed twice, so the gate sheet and the schedule cannot disagree.

## The one habit

End every stage with an email that names what was agreed, who agreed it, and what happens next, then ask for confirmation. Eight of those emails are a migration you can defend.

Look back at the last piece of work you finished. Could you show, today, who agreed to it and when?

## References

  1. Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. _Advances in Experimental Social Psychology, 38_ , 69–119.
  2. Ariely, D., & Wertenbroch, K. (2002). Procrastination, deadlines, and performance: Self-control by precommitment. _Psychological Science, 13_(3), 219–224. doi:10.1111/1467-9280.00441
  3. Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science, 17_(3), 249–255. doi:10.1111/j.1467-9280.2006.01693.x

---

*Originally published on Analyst Prep Kit: [One Migration, Start to Finish](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-walkthrough/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
