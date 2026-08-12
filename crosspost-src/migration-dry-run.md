The dry run is a full load into a sandbox, followed by reconciliation. It is the stage the research is loudest about, and it is the one that decides whether your go-live is calm. This article covers what to load, the six checks that have to pass, and how to log what breaks so the second run is faster.

**The short version.** Load everything, reconcile it four ways, and log every fix. If the run needed you to intervene by hand, it is not finished.

## Load everything, not a sample

What do you think a sample load fails to find? Answer before reading on.

A sample proves the mapping. A full load proves the mapping, the volume, the timing, and the long tail of weird values that only exist a few hundred times in a million rows. Those are what break a go-live, and a sample cannot see them.

The full load also tells you how long the real one takes. That number goes on the plan and it drives the freeze window.

## The six checks

**1. Counts.** Rows in the source against rows in the target, per table. They match, or you can explain the difference with a number. "We are 412 short because 412 records were excluded on the exception list" is an explanation. "Roughly the same" is not.

**2. Totals.** Sum the numbers that matter. Visit hours, invoice amounts, balances. Counts can match while values are wrong, and a total catches a transformation that shifted a decimal.

**3. Orphans.** Zero. Every document attached to a client, every visit attached to a staff member. This is a [left join where the right side is null](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/), and the answer has to be an empty result.

**4. Spot checks on real records.** Pick ten clients, including the two most complicated, and compare them field by field against the old system. This is the check that finds what the aggregates hide.

**5. Processability.** The data loaded and it looks right on screen. Now make the target system actually _use_ it. Run a real workflow end to end: generate an invoice, schedule a visit, produce the report the client runs every Monday. Data can display perfectly and still be unusable, because the loader wrote straight into the tables and skipped a value the application expects to be there.

**6. Integration.** Everything that talks to this system still works. The payroll export, the reporting feed, the billing handoff. Those break quietly, and they break after go-live, in front of somebody else.

Checks 1 to 4 ask whether the data arrived. Checks 5 and 6 ask whether it works. Those are different questions and a clean reconciliation only answers the first one.

Picture a load where counts match perfectly and totals are ten percent low. Say what could cause that before you read the next sentence. A currency or unit conversion applied to some rows and not others is the usual answer, and only the totals check finds it.

## Log everything that breaks

The dry run's real output is not the loaded sandbox. It is the issue log.

Every issue gets the same four things: what happened, which records, what fixed it, and whether the fix is now part of the process. That last one is the important one. A fix that lives in your head is a fix that will not happen on the night.

| Issue                                               | Records | Fix                             | In the process now?      |
|-----------------------------------------------------|---------|---------------------------------|--------------------------|
| Loader rejected rows with an apostrophe in the name | 1,840   | Escape before export            | Yes, in the extract step |
| Document dates arrived as 1900-01-01                | 612     | Blank source dates now excluded | Yes, in the transform    |

## Bulk loaders and their moods

The loader is where the time goes. They are strict, they are quiet about why they rejected something, and they will fail a hundred thousand row file because of one bad character.

Three habits make it survivable. Load in batches small enough that a failure tells you something. Keep the rejected rows file from every attempt, dated. And write down the loader's specific complaints as you learn them, because you will meet the same ones on the next client and nobody documents this for you.

Poor loader performance is also a reportable finding. If a load that should take an hour takes nine, that belongs in your notes with timings, because it is the evidence behind either a schedule change or a support ticket.

## The gate

The stage closes when a full load reconciles clean, the issue log has a fix against every entry, and no fix required a human hand during the run. Treat the dry run as the real migration and go-live as a repeat performance. If you cannot repeat it, you are not ready.

## Where this comes from

Matthes, Schulz and Haller's paper on testing and quality assurance in migration projects makes the case directly: the quality assurance activity, not the loading, is what determines whether a migration succeeds. Their process model puts a full rehearsal before cutover for the same reason.

## The one habit

If the dry run needed a manual fix, run it again. The second run is the one that tells you the truth.

What is the strangest reason a load has ever failed on you?

## References

  1. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.
  2. Haller, K., Matthes, F., & Schulz, C. (2012). A detailed process model for large scale data migration projects. _Business Information Systems (BIS 2012), Lecture Notes in Business Information Processing, 117_. Springer.

---

*Originally published on Analyst Prep Kit: [Stage 5: The Dry Run](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-dry-run/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
