This is the whole shape of a migration on one page. Eight stages, and for each one the single checkpoint that has to close before the next stage may start. Use it to plan a job, to explain to a client why you are not loading yet, or to work out which stage you are actually stuck in.

The stage list below is the industry pattern. It is what the research describes and what the large vendors sell. The commentary under each one is mine, from running these for a living, and it is where I say what the pattern gets right and where real projects bend it.

**The short version.** Eight stages, eight gates. A gate is a checkpoint with an owner and a written answer, and skipping one does not save time, it moves the cost later.

| #   | Stage                                                                                                                          | The gate that closes it                                                        |
|-----|--------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| 1   | [Kickoff and scope](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-kickoff-scope/) | Success criteria, stakeholders and what does not migrate, confirmed in writing |
| 2   | [Profile the source](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-profiling/)    | Row counts, blanks, duplicates and bad values documented                       |
| 3   | [Map the fields](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-field-mapping/)    | Signed off data map. Nothing moves before this                                 |
| 4   | [Clean and de-dupe](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-cleaning/)      | Exception list returned with a client decision on every row                    |
| 5   | [Dry run in a sandbox](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-dry-run/)    | Clean reconciliation, issues logged, zero orphans                              |
| 6   | [User acceptance testing](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-uat/)     | Client validates a real sample and confirms in writing                         |
| 7   | [Freeze, cutover, bridge](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-cutover/) | Counts tie old to new, bridge data loaded, live together                       |
| 8   | [Hypercare and close](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-hypercare/)   | Final reconciliation report, readout, handoff to support                       |

## Stage 1: Kickoff and scope

Before reading on: what is the one question a kickoff has to answer, that nothing later can fix if it is missed?

The pattern says define scope, roles and success criteria. That is correct and it is thin. In practice the kickoff is where you settle four things: why the client is doing this at all, what success looks like in numbers, what is _not_ coming across, and who the one person is that you route everything through.

**My commentary.** The scope item people underspend on is the exclusion list. Agreeing that seven years of history comes over is easy. Agreeing that three of those years arrive as reference only, and what that means the day a nurse cannot find a note, is the conversation that saves the project.

## Stage 2: Profile the source

The pattern splits this from cleaning, and it is right to. Profiling is finding out what is really there. Cleaning is doing something about it.

**My commentary.** This is the only stage whose output tells you whether your timeline is real, so it belongs before you commit to dates rather than after. A source with a free text field where a dropdown should be is not a cleaning problem, it is a scope problem, and it is cheaper to learn in week two than week six.

## Stage 3: Map the fields

Every field in the source gets a home in the target, or an explicit decision that it does not travel. The map is a document the client signs.

**My commentary.** Nothing moves until the map is signed off. That rule sounds rigid and it is the single highest value rule in the list. A map signed by the client turns "the data is wrong" into "the data matches what we agreed", which is a completely different meeting.

## Stage 4: Clean and de-dupe

Fix what can be fixed by rule. Everything that cannot goes on an exception list, and the client decides row by row.

**My commentary.** The exception list is a gate, not a document. It closes when every row has a decision, and "we will deal with it later" is not a decision. De-duplication in particular has to happen here, because one client turning into two in the new system is the failure users notice first and forgive last.

## Stage 5: The dry run

Load the whole thing into a sandbox, reconcile it, and log everything that broke. Six checks, not four: counts, totals, orphans and spot checks prove the data arrived, then processability and integration prove it works. This is the stage the research is loudest about.

**My commentary.** Treat the dry run as the real migration and the go-live as a repeat performance. If the dry run needed manual intervention, it is not finished, because you will not have time to intervene on the night.

## Stage 6: User acceptance testing

The client's own people open real records in the new system and say whether it is right.

**My commentary.** Give them named records, not a general invitation to look around. "Open these ten clients and check the visit history against the old system" gets answers. "Have a look and let us know" gets silence, and silence at this stage is what turns into a dispute later.

## Stage 7: Freeze, cutover and the bridge

The source goes read only. The whole sequence is rehearsed once with the clock running, to prove it fits the window. Then the final export runs, somebody named says go, the load runs, counts are compared, and everyone goes live together.

**My commentary.** This is where the standard write-ups skip the part clients actually feel. A migration takes weeks, and business does not stop for it. The bridge is the plan for the records created during those weeks, and having one is the difference between a calm go-live and a scramble. [The cutover article](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-cutover/) covers how to run it, including the rehearsal and the go/no-go, and why the honest fallback is almost always "do not start" rather than "roll back".

## Stage 8: Hypercare and close

A defined window of close support after go-live, then a final reconciliation report, a readout, and a handoff to whoever supports the client from here.

**My commentary.** Hypercare needs an end date agreed at the start, or it becomes free consulting. The close also needs a real handoff, because a client who has worked with one person for three months does not want to be handed a support address and nothing else.

## What a gate actually is

Say what makes a gate different from a status update before you read the answer.

A gate has three parts. Something happened, a named person confirmed it in writing, and the confirmation is somewhere both sides can find. A status update has none of those. In real projects the confirmation is almost never a formal signature. It is an email that says what was completed, what is starting, and asks the client to confirm the first part meets expectations. [The emails article](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-emails/) has the wording.

## Where this comes from

Haller, Matthes and Schulz built their process model from the literature plus twenty five industry interviews, and the companion paper argues that testing and quality assurance, rather than the loading itself, determine whether a migration succeeds. The large cloud vendors describe the same arc in fewer words: assess, prove it small, migrate at scale, then hypercare.

The eight here are those two views merged, with profiling separated out and the bridge added, because those are the two places I have seen real projects lose the most time.

## The one habit

Never start a stage whose previous gate has not closed in writing. If you cannot point at the email, the gate did not close.

Which of the eight do you think gets skipped most often on the jobs you have seen?

**Want to see all eight run on one job?** [One Migration, Start to Finish](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/../migration-walkthrough/) walks a single engagement day by day, with the email that closed each gate, the four change requests, and what it cost to say no.

## References

  1. Haller, K., Matthes, F., & Schulz, C. (2012). A detailed process model for large scale data migration projects. _Business Information Systems (BIS 2012), Lecture Notes in Business Information Processing, 117_. Springer.
  2. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.

---

*The full version of this guide lives on my site: [The Eight Stages of a Data Migration](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
