User acceptance testing is where the client's staff open real records in the new system and say whether they are right. It is the last gate before anything becomes permanent, and it fails for one reason more than any other: people are asked to look around instead of being asked something specific.

**The short version.** Give named people named records and a named question. Vague invitations produce silence, and silence at this stage becomes a dispute later.

## Ask a question, not for a favour

Which of these two do you think gets a reply? Decide, then read.

"The sandbox is available, please have a look and let us know if anything seems off."

"Please open these ten clients, check the visit history for 2023 against the old system, and tell me by Thursday whether anything is missing."

The second one gets a reply, because it names the action, the records, and the day. That is not a communication trick, it is the finding from Gollwitzer and Sheeran's meta-analysis of ninety four tests: an intention converted into a specific when and how produces a medium to large improvement in follow through. Apply it to every request you make of a client.

## Who should test

Not the project sponsor and not IT. The people who use the records every day. A scheduler will spot in four seconds that a visit type looks wrong, and nobody senior to them will.

Ask for two or three of them by name at [kickoff](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-kickoff-scope/), and warn the client then that these people will need real time set aside. Testing squeezed into the gaps of a working day is testing that does not happen.

## What to give them

Build the test pack yourself. Do not make the client invent it.

  * **Ten to twenty named records** , chosen deliberately: a simple one, a long standing one, one with many documents, one that was on the exception list, one that was de-duplicated.
  * **A specific thing to check on each** , in their words. Visit history complete. Documents present and attached to the right person. Address current.
  * **Somewhere to write the answer.** A sheet with a row per record and a pass or fail column, plus space for what was wrong.
  * **A date.**

Include the de-duplicated records on purpose. Those are the ones where a wrong decision does the most damage, and the client's staff are the only people who can confirm the merge was right.

## What counts as a pass

Agree this before testing starts, or you will be negotiating it while people are annoyed.

A pass is that the records match what was agreed in the [field map](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-field-mapping/). It is not that the new system works exactly like the old one, and it is not that data the client never had has appeared. That distinction is why the signed map matters, and it is worth restating in the email that opens UAT.

Findings sort into three buckets: a genuine migration defect that you fix, a difference that was agreed in the map and needs explaining, and a new request that is [out of scope](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-scope-creep/). Name the bucket for each item when you reply, politely and every time.

## The gate

The stage closes when the client confirms in writing that the sample is acceptable. In practice this is almost never a formal signature. It is an email from you saying what was tested, what was found, what was fixed, and asking them to confirm it now meets expectations, with the go-live date restated.

Copy the person who signed the contract. Not as a threat, as a courtesy. It also means the confirmation exists somewhere other than one inbox.

## The one habit

Never end UAT on silence. No reply is not approval, and it is the single most common way a migration turns into an argument three months later.

When you have been asked to test something at work, what made you actually do it?

## References

  1. Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. _Advances in Experimental Social Psychology, 38_ , 69–119.
  2. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.

---

*Originally published on Analyst Prep Kit: [Stage 6: User Acceptance Testing](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-uat/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
