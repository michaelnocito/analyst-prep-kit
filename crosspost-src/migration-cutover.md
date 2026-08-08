Cutover is the switch from old system to new. The part most write-ups skip is the gap: a migration takes weeks, and the business does not stop while you run it. This article covers the freeze, what staff do during the gap, and the bridge import that catches everything created in between.

**The short version.** Freeze the old system as read only on the day you take the final export, capture new work in a structured sheet during the gap, and load that sheet the moment the new system is live.

## The gap, and why it is your problem

Before the answer: a client's staff sign up four new customers the week after you take the export. Where does that data live? Think it through.

It has to live somewhere, and if you have not decided where, it lives in four different places. Someone's notebook, an email, a spreadsheet nobody else can find, and the old system, which you are about to stop using.

This is the single biggest difference between a migration that feels professional to the client's staff and one that feels like an outage. The data work is invisible to them. The gap is not.

## The freeze

On the day the final export is taken, the old system goes read only. Staff can look things up. They cannot add, edit, or delete.

Read only rather than switched off matters. People need their history during the gap, and taking it away for two weeks is how you lose the room. The point of the freeze is that the export you are working from stays true, not that the old system disappears.

Announce the freeze date at least two weeks ahead, and again the week of. Say what read only means in concrete terms: you can look, you cannot change, here is where new work goes instead.

## The bridge

New work during the gap goes onto a structured sheet, built by you, shaped exactly like the import that will load it.

That last part is the whole trick. If the sheet has the same columns, the same value lists and the same date format as your load file, then the moment the new system is live you import it in minutes. If the sheet is a free form list somebody invented, you spend a day cleaning it while the client waits.

Build it with the same rules as the [field map](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-field-mapping/): required fields marked, dropdowns where the target has dropdowns, one row per record, and the client ID column present. Give it to the client before the freeze starts and walk one person through filling a row.

Picture a scheduler at 4pm on a Friday during the freeze, signing up a new client. What has to be true about your sheet for that to take them two minutes? That is the design brief.

## The rehearsal, before any of this is real

The dry run proved the data is right. It did not prove the move fits in the window.

Those are separate failures, and the second one is the one that ruins a weekend. So before cutover, run the whole sequence end to end with the clock going. Final export, load, reconcile, bridge, reconcile again, exactly the steps and exactly the order you will use for real.

You are measuring one thing: how long it takes. If the freeze window is a weekend and the rehearsal takes thirty-one hours, you have found that out on a Tuesday, when it is a planning problem. Find it on the night and it is an outage.

What the rehearsal catches that a dry run never does:

  * **The total elapsed time** , including the steps nobody counts. Waiting for an export. Somebody being asleep.
  * **The order dependencies** , when run under time pressure rather than over three unhurried afternoons.
  * **Who is actually available.** A cutover that needs the client's DBA at 2am needs that agreed in advance, by that person.

Write down the timings. They are the evidence behind your go/no-go, and behind asking for a longer window if you need one.

## Go, or no-go

There is a moment before the load where somebody has to say yes. Name it, put it in the plan, and hold it as a short meeting rather than an assumption.

Three things get agreed there, and all three are agreed _before_ the day, not during it:

  * **Who decides.** One named person, usually the client PM. Not a consensus, because consensus at 6am is nobody deciding.
  * **On what evidence.** The rehearsal timings, the dry run reconciliation, UAT signed, the freeze confirmed. Write the list before you need it, so nobody is arguing about the standard while the clock runs.
  * **What happens if it is no.** This is the one people skip.

Be honest with yourself about that last one, because the fallback is smaller than it sounds. Once the new system is released to users and they start working in it, going back is close to impossible: the old system is now missing everything created since. The real fallback is almost always _do not start_ , and stay on the old system until the next window.

That means the decision point is genuinely before the load, not during it. After the load begins, you are going forward. Say that out loud at the meeting, so everyone knows which side of the line they are standing on.

## Cutover day, in order

  1. Confirm the freeze held. Ask, do not assume.
  2. Take the final export.
  3. Go/no-go. The named person says yes, on the evidence agreed in advance.
  4. Run the load, exactly as rehearsed in the [dry run](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-dry-run/).
  5. Reconcile: counts, totals, orphans, spot checks, processability, integration. The same six as the dry run.
  6. Load the bridge sheet.
  7. Reconcile again, including the bridge rows.
  8. Confirm with the client that the new system is open, and say so in writing.

Go live together. The client's team and yours, on a call, crossing at the same moment. It costs an hour and it is the difference between a milestone and an email nobody read.

## What can still go wrong

**The freeze did not hold.** Somebody kept working in the old system. You find this in reconciliation when counts do not match the export. Ask early rather than discovering it late.

**The bridge sheet grew.** Two weeks of new work is manageable. Six weeks is a second migration. If the gap stretches, the sheet needs a mid point load into the sandbox to prove it still imports cleanly.

**Something needs reloading.** This is why you kept the crosswalk of old ID to new ID. Without it, a reload creates duplicates, and now you have the failure users hate most.

## The gate

The stage closes when counts tie old to new including bridge records, spot checks pass, and the client has been told in writing that they are live, with the hypercare window and its end date stated.

## The one habit

Design the bridge sheet as an import file, not as a form. Everything else about the gap follows from that.

How has your workplace handled the gap when a system changed over?

## References

  1. Haller, K., Matthes, F., & Schulz, C. (2012). A detailed process model for large scale data migration projects. _Business Information Systems (BIS 2012), Lecture Notes in Business Information Processing, 117_. Springer.
  2. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.

---

*The full version of this guide lives on my site: [Stage 7: Freeze, Cutover, Bridge](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-cutover/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
