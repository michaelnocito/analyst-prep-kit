Every one of these has a cheap check that catches it early and an expensive version that catches it late. This is the list, ordered by how much the late version costs.

**The short version.** Almost all migration pain comes from six failures, and five of them are caught by counting things before and after.

## 1. Duplicates that survive

One client becomes two in the new system. Their history splits between the two records. Staff pick whichever they find first, and now both are half right.

This is the failure users notice first and forgive last, because it makes the new system look worse than the old one on day one.

**The cheap check.** Group by the identifying field and count anything appearing more than once, during [profiling](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-pitfalls/../migration-profiling/). **The expensive version.** Finding out from a user in month two, when both records have new activity on them and merging is no longer clean.

## 2. A move nobody can prove

The load ran, nothing errored, and no one compared the numbers. Weeks later someone notices a year of visits is missing.

Say what makes this one so much worse than the others before reading on. It is the fallback: by the time it surfaces, the old system may be gone.

**The cheap check.** Row counts and totals, written down before and after. **The expensive version.** An audit finding, with no source left to recover from.

## 3. Orphaned documents

A file loads successfully but attaches to nothing, or to the wrong person. In a regulated industry that is not untidy, it is a compliance problem, and a document attached to the wrong client is worse than a missing one.

**The cheap check.** A left join from documents to clients where the client is null. The answer must be zero. **The expensive version.** Finding it during an inspection.

## 4. The loader that fails quietly

Bulk loaders reject rows without always making it obvious. A load reports success, and four thousand rows are simply not there.

**The cheap check.** Compare the row count in your load file to the row count in the target, every single time, and keep the rejected rows file from every attempt. **The expensive version.** Discovering the shortfall after go-live, when you no longer know which attempt dropped them.

## 5. The ambiguous date

03/04/24 is either March 4th or April 3rd. A rule that picks silently converts thousands of records to the wrong day, and nothing errors.

Picture a care visit dated three weeks off. Who notices, and when? Usually nobody, until a bill or an audit disagrees.

**The cheap check.** Confirm the source system's date format against a value you can verify independently, then preview the transformation on real rows. **The expensive version.** A billing dispute traced back to a format assumption.

## 6. The gap nobody planned for

The migration takes three weeks and the business keeps running. Nobody decided where new work goes, so it goes into four places, and the client's first week on the new system is spent re-keying.

**The cheap check.** A bridge sheet, shaped like the import file, handed over before the freeze. [The cutover article](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-pitfalls/../migration-cutover/) covers it. **The expensive version.** A go-live that feels like an outage to every member of staff.

## The pitfalls that are not about data

**Silence treated as approval.** No reply to a sign off request is not a yes. It is the thing that becomes a dispute later, and [chasing it properly](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-pitfalls/../migration-quiet-client/) is a skill of its own.

**Scope that grew without the plan changing.** Each addition was small and reasonable. The date did not move, because nobody showed what the additions cost. [Handling that](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-pitfalls/../migration-scope-creep/) is mostly a matter of having a plan to point at.

**Working files nobody can find.** Including your own, three weeks later. [Keeping your files straight](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-pitfalls/../migration-file-hygiene/) is unglamorous and it is time you get back every day.

## The cheat sheet

| Failure               | Catch it with                           | Which stage         |
|-----------------------|-----------------------------------------|---------------------|
| Duplicates survive    | Group by identifier, count > 1          | Profiling           |
| Unprovable move       | Counts and totals, before and after     | Dry run and cutover |
| Orphans               | Left join, right side null, expect zero | Dry run             |
| Silent loader failure | Load file count against target count    | Every load          |
| Ambiguous dates       | Confirm format, preview the rule        | Cleaning            |
| The gap               | Bridge sheet before the freeze          | Cutover             |
| Silence as approval   | Written confirmation at each gate       | All                 |

## Where this comes from

Matthes, Schulz and Haller's work on testing in migration projects lands on the same conclusion from the research side: the quality assurance activity, rather than the loading, is what separates a migration that worked from one that appeared to. Wang and Strong's fitness for use standard is the other half. Data does not have to be perfect. It has to be good enough for what it is about to be used for, and the target system defines that.

## The one habit

Write the counts down before you load. Almost every failure on this page is caught by a number you already had.

Which of these six have you actually lived through?

## References

  1. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.
  2. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33.

---

*The full version of this guide lives on my site: [What Goes Wrong, and What It Costs](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-pitfalls/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
