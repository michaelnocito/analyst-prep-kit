Hypercare is the close support period straight after go-live. It ends with a final reconciliation report, an internal readout, and a handoff to whoever supports the client from here. Done well it is the part the client remembers. Done badly it is unpaid work with no end date.

**The short version.** Agree the window and its end date before go-live, watch the three things that actually surface, then close with a report and a warm handoff to a named person.

## Agree the window before you need it

What do you think happens to a support period with no stated end? Answer honestly.

It does not end. It fades, and while it fades the client keeps calling the person they trust rather than the team who is meant to support them, and that person is you.

State the window at kickoff and restate it in the go-live email. Two weeks is common. What matters more than the length is that the end is a date, and that the date is attached to something positive: the final report, the readout, the introduction to their ongoing contact.

## What actually surfaces

Three things, in order of how often they appear.

**"I cannot find X."** Usually it is there and the person is looking in a different place than the old system put it. This is a training question wearing a data costume, and answering it as a data question wastes everyone's time. Show them where it lives.

**"This record looks wrong."** Check it against the [field map](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-field-mapping/) first. Most of the time it matches what was agreed, and the answer is an explanation. Sometimes it is a real defect, and then you fix it and check whether it affected a class of records or just that one.

**"Where is the thing we agreed not to migrate?"** This is the exclusion list arriving in person. Answer it kindly and point at where the archive lives. If it comes up more than twice, tell the client's contact, because it means the exclusion was not communicated internally.

Picture the first of those three landing on day two. Say what your first question back would be. If it was "which screen are you on", you have the instinct right.

## The final reconciliation report

One document, and it is the artifact that outlives the project.

  * Counts, source against target, per table, final numbers.
  * Totals on the values that matter.
  * Records excluded, with the reason and the client decision that excluded them.
  * Exceptions and how each was resolved.
  * Known limitations, written to be useful rather than defensive.
  * Where the archive of non migrated data lives, and who holds it.

Write the limitations section properly. A year from now, somebody at that client will ask why a number does not match, and this document is the answer. [Documenting limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) covers how to write them so they hold up.

## The internal readout

Half an hour with your own team. What happened, what the numbers were, what broke, what you would do differently, and what the next person needs to know about this client.

This is also where the loader complaints, the timings and the poor performance notes get handed over as evidence rather than folklore. If a load ran nine times slower than it should, that finding is worth more to the business than the migration itself, and it dies in your notes unless you present it.

## The handoff, so it lands warmly

By now the client likes working with you, and being handed to a support address feels like being dropped. A few things prevent that.

**Introduce a person, not a mailbox.** A name, on a short call or in an email, with you present.

**Say what that person is good at.** "Priya handles reporting questions and knows your setup" beats "please contact support".

**Hand over the context, not just the account.** The new contact should already know the exclusion list and the two records that caused trouble.

**Say goodbye clearly and warmly.** Name the end of your involvement, thank the people who did the testing by name, and restate what they achieved against the goal they set at kickoff. Do not leave the ending implied.

## The gate

The project closes when the report is delivered, the readout has happened, the client has met their ongoing contact, and the end of hypercare has been stated in writing.

## The one habit

Give the ending a date and a name. A project that trails off is remembered as one that trailed off, whatever the numbers said.

What made the best handoff you have ever received feel good?

## References

  1. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.
  2. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33.

---

*Originally published on Analyst Prep Kit: [Stage 8: Hypercare and Close](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-hypercare/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
