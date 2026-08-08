A migration produces hundreds of files: extracts, load files, rejected rows, mapping versions, exception lists. Losing track of which sheet is current costs an hour and, worse, it costs your confidence in your own numbers. This is the structure I use and the three rules that matter most.

**The short version.** One folder per stage, dates at the front of file names, never overwrite an extract, and keep every rejected rows file.

## The folder structure
    
    
    client-name/
      00-admin/          contract dates, plan, contacts, meeting notes
      01-extracts/       raw exports, never edited, never overwritten
      02-profiling/      counts, findings, the queries that produced them
      03-mapping/        the map, versioned, plus the signed-off copy
      04-cleaning/       transformation rules, exception lists, decisions
      05-loads/          load files, by attempt
      06-rejects/        rejected rows, by attempt, never deleted
      07-reconciliation/ before and after counts, the final report
      08-handover/       what goes to the client and to support
    

Numbering the folders makes them sort in the order the work happens, so the folder list is the project status. Anyone opening it, including you in six weeks, can see where things are.

## Naming that sorts itself

Put the date first, in year month day order, then what it is, then the version.

`2026-07-14_client-extract_full.csv` sorts chronologically without you doing anything. `final_v2_REALFINAL.xlsx` does not, and you know exactly which of those two you have created.

What do you think goes wrong first with a name like `mapping_final.xlsx`? It stops being final, and nothing in the name tells you when it stopped.

## Three rules that matter more than the structure

**Never edit an extract in place.** The raw export is evidence. Copy it into the working folder and edit the copy. When a number is questioned three weeks later, the untouched original is what settles it.

**Never overwrite a load file.** Every attempt gets its own dated file. Attempt three failing differently from attempt two is information, and it is gone if you saved over it.

**Keep every rejected rows file.** These are the most useful files in the project and the ones people delete first. They tell you what the loader hates, and they are the evidence behind a schedule change or a support ticket.

## Log the loader's behaviour as you learn it

Bulk loaders are strict, quiet about failures, and slow to say which row broke. Nobody documents their quirks for you, and you will meet the same ones on the next client.

Keep one file. Date, what you tried, what it did, how long it took, what fixed it.

| Date       | What happened                                    | Fix                              | Timing             |
|------------|--------------------------------------------------|----------------------------------|--------------------|
| 2026-07-14 | Rejected all rows with an apostrophe, no message | Escape on export                 | Lost half a day    |
| 2026-07-16 | 50k row file took 4h, expected 30m               | Split into 5k batches, 40m total | Reported to vendor |

Two reasons this is worth the minute it takes. It makes you faster on the next client. And poor performance you can evidence with dates and timings is a business finding, whereas the same complaint without timings is folklore.

## Version the map, keep the signed copy separate

The [field map](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-file-hygiene/../migration-field-mapping/) changes through the project and one version of it is the one the client agreed to.

Keep that copy in its own file, named with the date it was signed off, and never edit it. Later versions live alongside it. When somebody says the data is wrong, you open the signed copy, and the question becomes whether the load matches the agreement, which you can answer in seconds.

## One more thing you will thank yourself for

Keep a running note of decisions with dates. Not a formal log, one file, one line per decision, who made it.

Almost every dispute in a project is about a decision somebody does not remember making. A line saying who chose what and when ends it without anyone having to be wrong in front of their manager.

## The one habit

Date at the front of every file name. It is a two second habit that removes a whole category of confusion.

What is your own worst file naming crime?

## References

  1. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33.
  2. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.

---

*The full version of this guide lives on my site: [Keeping Your Own Files Straight](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-file-hygiene/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
