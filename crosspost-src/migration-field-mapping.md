The field map is a line by line list saying what each field in the old system becomes in the new one. It is the blueprint for the entire job, it is the document the client signs, and nothing loads until it is agreed. This article covers what goes in each row, how to handle fields with nowhere to go, and the ID rule that keeps records and documents together.

**The short version.** One row per source field. Every row ends in a home, a transformation, or a written decision that it does not travel.

## What a mapping row contains

Before the list: what do you think is the column people forget, that causes the most arguments later?

| Column                   | Why it is there                                                                           |
|--------------------------|-------------------------------------------------------------------------------------------|
| Source table and field   | Exactly where it comes from                                                               |
| Sample values            | Three real values. This is what makes the map reviewable by someone who is not technical  |
| Target field             | Where it lands, or "not migrated"                                                         |
| Required in target       | Yes or no. Drives the blanks problem from profiling                                       |
| Transformation           | What has to change about the value, in words                                              |
| Decision and who made it | The column people forget. Six months later, this is the only thing that settles a dispute |

The sample values column is what turns the map from a technical document into something a client can actually check. Nobody can review a field called `cl_stat_cd`. Everybody can review it once they see that it holds ACT, INACT and HOLD.

## Fields with nowhere to go

Every migration has them. The old system tracked something the new one does not, or tracks it somewhere different. There are four honest outcomes and you pick one per field.

**It maps to a different field.** Fine. Write the transformation down.

**It merges with another field.** Two address lines becoming one. Write down the joining rule, including what happens when one side is empty.

**It goes into a notes or custom field.** The pressure valve. Use it sparingly, because a value in a notes field cannot be reported on, and the client will eventually want to report on it.

**It does not travel.** A real answer, and the one that needs the clearest written record. Name the field, say why, and get it confirmed alongside the exclusions agreed at [kickoff](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-kickoff-scope/).

Say which of those four you would push a client towards for a field nobody has used since 2018. Then read the next line. It is the fourth one, and the profiling row count is your evidence.

## One ID ties it together

Pick a single identifier per real thing, usually the client, and carry it through everything. Records reference it. Documents reference it. Your working files reference it.

This is what stops orphans. A document loaded with the client's name on it and nothing else is a document that will end up attached to the wrong person or to nobody. A document loaded with the client ID lands where it belongs.

The old system's key is usually the right thing to carry, even when the new system generates its own. Keep a crosswalk table of old ID to new ID. You will need it during the [dry run](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-dry-run/), and you will need it again if anything has to be reloaded.

## Documents are data too

Files get treated as an afterthought and they are half the job in a regulated industry. Every document needs the same treatment as a record: where it comes from, what it is called, what type it is, what date it carries, who it belongs to, and where it lands.

If some of the source is paper, that is a separate workstream with its own timeline. Scanning and indexing runs in parallel and it is usually the thing that determines the go-live date. Put it on the critical path in week one, not week six.

## Getting it signed off

Do not send a spreadsheet with four hundred rows and ask for approval. You will get silence, and silence is not approval.

Send it in pieces the client can actually review. One table at a time, with the rows needing a decision marked and everything mechanical collapsed into a summary line. Ask for a decision on the marked rows by a date.

The gate closes when every row has a target or a written decision, and the client has confirmed. That confirmation email is the one you will point at every time somebody says the data is wrong. It converts the question from "is this right" to "does this match what we agreed", which you can answer in ten seconds.

## The one habit

Nothing moves until the map is signed off. Not a test load, not a quick sample, nothing. The rule only works if it has no exceptions, because the first exception is the one somebody remembers.

Have you ever inherited a system where you could not tell what a field was for? What would the map have needed to say?

## References

  1. Haller, K., Matthes, F., & Schulz, C. (2012). A detailed process model for large scale data migration projects. _Business Information Systems (BIS 2012), Lecture Notes in Business Information Processing, 117_. Springer.
  2. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33.

---

*Originally published on Analyst Prep Kit: [Stage 3: Map the Fields](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-field-mapping/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
