Profiling is looking at the real data to find out what is actually in it. It takes a day or two and it is the only stage whose output tells you whether your timeline is honest. This article gives you the seven checks to run on every extract and what each one changes.

**The short version.** Run the same seven checks on every table before you map anything, and turn each finding into either a rule, a scope decision, or a risk on the plan.

## Why this is its own stage

What do you think the difference is between profiling and cleaning? Answer before reading on.

Profiling finds out what is there. Cleaning does something about it. They get merged in a lot of write-ups, and merging them costs you the moment where the findings could still change the plan. Once you are cleaning, you have already committed to an approach.

Profiling also gives you something to say when a client asks how long this will take. "Twelve percent of your client records have no primary address, and that field is required in the new system" is a real conversation. A gut feeling is not.

## The seven checks

Run these per table. All of them are a few lines of SQL, and most are a [COUNT with GROUP BY](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-count-function/).

**1. Row counts.** How many rows in each table. Write them down. Everything you do later gets compared to this number, and it is the baseline for [reconciliation](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-dry-run/).

**2. Blanks in required fields.** For every field the target system requires, count how many source rows have nothing in it. This single check produces most of the surprises.

**3. Distinct values in fields that should be a list.** A status field with six allowed values in the new system, holding four hundred distinct strings in the old one, means somebody was typing free text. That is a mapping project of its own.

**4. Duplicates on the identifying field.** Group by whatever should be unique and count anything appearing more than once. This is the first sight of the de-duplication work.

**5. Orphans.** Children with no parent. Documents with no client, visits with no staff member. A left join where the right side is null finds them.

**6. Formats.** Dates, phone numbers, identifiers. Look at the actual strings, not the column type. A date column stored as text will contain at least three formats and at least one impossible date.

**7. Ranges and outliers.** Minimum and maximum on every date and number. A birth date in 1899 and a visit dated 2087 are both in there, and both will be rejected by the loader at the worst possible moment.

Picture running check three on a system you know. How many different ways do you think people have spelled the same status? That number is your mapping workload.

## Turning findings into decisions

A finding that stays in your notes is worth nothing. Every one becomes exactly one of three things.

**A rule.** The fix is mechanical and safe. Trim whitespace, standardize a date format, upper case a code. This goes into the transformation work and needs no client input.

**A scope decision.** The fix requires a human to decide something. Four hundred free text statuses collapsing into six means somebody has to say which is which, and that somebody is the client. This is a decision with a date attached.

**A risk.** The finding might cost time and you cannot yet tell. Put it on the plan with a name against it. A risk that was on the plan since week two is a normal project event. The same risk raised in week eight is a failure.

## What changes the plan most often

Three findings, in order of how often they move a date.

**A required field that is mostly empty in the source.** There is no rule that invents data. Either the client fills it, or the target accepts a default, or the field does not migrate. All three take a conversation.

**Free text where the target wants a list.** Someone has to map every value, and only the client knows what the odd ones mean.

**Volume you were not told about.** The extract holds more history than the contract described, or the document store is four times the size anyone said. This changes the technical approach, not just the schedule.

## Write it down like this

| Check              | Finding                                | Becomes                  | Owner  |
|--------------------|----------------------------------------|--------------------------|--------|
| Blanks in required | 12% of clients have no primary address | Scope decision           | Client |
| Distinct values    | 412 status strings, target allows 6    | Scope decision           | Client |
| Formats            | Dates in 3 formats, 40 impossible      | Rule plus exception list | Us     |
| Volume             | Document store is 4x the estimate      | Risk                     | Us     |

That table is the gate. It closes when every row has an owner and a date, and it goes to the client as part of the stage wrap up email.

## Where this comes from

The migration process model built by Haller, Matthes and Schulz puts an analysis stage before design for the same reason given here: the findings are supposed to feed the plan, and they cannot if they arrive after it. The wider data quality literature frames it as fitness for use, from Wang and Strong. Data is not good or bad in the abstract. It is good enough for a purpose, and the purpose here is the target system's rules.

## The one habit

Never promise a date before you have counted the rows. The count is cheap and the promise is not.

What is the worst thing you have found in a source system once you actually looked?

## References

  1. Haller, K., Matthes, F., & Schulz, C. (2012). A detailed process model for large scale data migration projects. _Business Information Systems (BIS 2012), Lecture Notes in Business Information Processing, 117_. Springer.
  2. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33.

---

*Originally published on Analyst Prep Kit: [Stage 2: Profile the Source](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-profiling/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
