Data migration is moving a client's records from the system they have to the system they bought. If you are about to run your first one, this tells you what you are signing up for. By the end you will know the eight stages, the words you will hear in every meeting, and the two failures that account for most of the pain.

The work itself is simple to describe. A client is leaving an old system. Their history has to arrive in the new one, complete, connected, and correct. You get the data out, you line up every field with a home in the new system, you fix what is broken, you load it, and you prove the numbers match.

**The short version.** A migration is a move, not a copy. You are responsible for the history arriving intact, and for being able to prove that it did.

## Where migrations come from

Before the list: which of these four do you think produces the messiest data? Have a guess and hold it.

**A company buys new software and leaves the old vendor.** This is the common one. An agency moves off a fifteen year old scheduling system onto a modern platform.

**Two companies merge.** Now two customer lists have to become one, and the same person exists twice with different spellings.

**A system moves from a server in the building to the cloud.** The data model usually stays similar, so this is the gentlest kind.

**A business finally replaces spreadsheets with a real system.** This is the messy one. Spreadsheets have no rules, so anything a person could type is somewhere in the file.

## The words you will hear

| Term                      | What it means                                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| **Source** and **target** |  The old system and the new system. You will say these words hundreds of times.                                                                  |
| **Extract**               |  Getting the data out of the source, usually as a set of files.                                                                                  |
| **Field mapping**         |  A line by line list saying that this field in the old system becomes that field in the new one. It is the blueprint for the whole job.          |
| **Transformation**        |  Changing the shape of a value so the target will accept it. A date written as 03/04/24 becoming 2024-04-03 is a transformation.                 |
| **Profiling**             |  Looking at the real data to find out what is actually in it, rather than what the client says is in it.                                         |
| **Reconciliation**        |  Proving the move worked by comparing counts and totals, source against target.                                                                  |
| **Orphan**                |  A record that lost its parent. A document with no client attached. In a regulated industry an orphan is not untidy, it is a compliance problem. |
| **Cutover**               |  The moment the old system stops being used and the new one starts.                                                                              |
| **Hypercare**             |  The close support period straight after cutover, when the team watches for what surfaces.                                                       |

Say the difference between profiling and reconciliation out loud before reading on. If you can, the rest of this series will be easy.

## The eight stages, and what a gate is

What do you think stops a migration team from starting work before it is ready? Answer that before the paragraph does.

Every serious framework describes roughly the same shape. Kickoff and scope. Profile the source. Map the fields. Clean and de-dupe. Dry run in a sandbox. User testing. Freeze and cutover. Hypercare and close.

Each one ends at a **gate**. A gate is a checkpoint with an owner and an answer, and you do not start the next stage until it closes. Mapping does not begin until scope is agreed in writing. Nothing loads until the map is signed off. You do not go live until a client has looked at real records and said yes.

Gates feel like paperwork on a small job. They are the only reason a large job finishes. [The stages article](https://michaelnocito.github.io/analyst-prep-kit/guides/data-migration-stages/) walks all eight, with the gate that closes each one.

## The tools

Most migrations run on four kinds of tool, and you will use all four in a week.

**Spreadsheets** hold the map, the exception list, and the working files. Excel is not glamorous and it is where most of this actually happens.

**SQL** does the profiling and the reconciliation. Counting rows, finding duplicates, and checking that nothing lost its parent are each a few lines. If you can write a [COUNT with GROUP BY](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-count-function/), you can do most of the checking work.

**A bulk loader.** Every target system has one, and it is the tool you will fight. Loaders are strict about formats, quiet about failures, and slow to tell you which row broke.

**A scripting language** once the volume passes what a spreadsheet handles comfortably. Python with pandas is the usual choice, and [handling large files](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/) is its own skill.

Picture the last messy spreadsheet you saw. Now picture a loader rejecting it one row at a time with no message about why. That is the middle of a migration.

## The two failures that cost the most

**Duplicates that survive.** One client becomes two in the new system. Their history splits. Staff pick the wrong record. This is why de-duplication happens before the move and not after, and why [matching records that describe the same thing](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/) is worth learning properly.

**A move nobody can prove.** The data went across and the numbers were never checked. Weeks later someone notices a year of visits is missing. By then the old system may be gone.

The fix for both is the same and it is unglamorous. Count things, write the counts down, and compare them.

## Where this comes from

Haller, Matthes and Schulz built a detailed process model for large migration projects from the existing literature plus twenty five industry interviews. Their earlier paper with the same group makes the stronger claim, and it is the one worth carrying: the testing and reconciliation work, not the loading, is what decides whether a migration succeeds.

The vendor frameworks agree on the shape. They assess, prove the approach at small scale, migrate at full scale, then run a defined hypercare window after cutover.

My own experience adds one stage most write-ups skip, and it is the one clients feel. A migration takes weeks, and the client keeps working during those weeks. What happens to the records they create in that gap is a real question with a real answer, and it gets [its own article](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-cutover/).

## How to start on a real job

  1. Ask what success looks like, and write the answer where the client can see it.
  2. Get a full export before you promise a date.
  3. Count everything in that export. Rows per table, at minimum.
  4. Build the map before you touch the data.
  5. Load nothing into the real system until it has worked in a sandbox.

If you have paper nearby, sketch the source, the target, and the checks in between. It is the whole job on one page.

## The one habit

Count before, count after, keep the counts. Everything else in this series is detail on top of that.

Migrations are also a people job, and the hardest part is rarely the data. What is the part of a system change you have found hardest to get people through?

## References

  1. Haller, K., Matthes, F., & Schulz, C. (2012). A detailed process model for large scale data migration projects. _Business Information Systems (BIS 2012), Lecture Notes in Business Information Processing, 117_. Springer.
  2. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.
  3. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33.

---

*Originally published on Analyst Prep Kit: [What Data Migration Actually Is](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-migration/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
