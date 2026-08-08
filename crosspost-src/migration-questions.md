Most migration trouble traces back to a question nobody asked in week one. This is the list I run through before agreeing to a date, grouped by what each answer protects you from.

**The short version.** Five questions decide the project: what success is, who signs, who decides, what happens if it goes wrong, and what happens to work created during the gap.

## What does success look like?

Before reading on, try answering it for a project you are on now. Harder than it sounds, isn't it.

Push until it is countable. "All active clients available on day one, visit history back to 2019, documents attached to the right client, no client appearing twice." Every one of those is checkable, which means every one becomes a line in [reconciliation](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-questions/../migration-dry-run/).

Then ask the other half: what does failure look like? People answer that one faster and more honestly, and the answer tells you what they are actually protecting.

## Who signed the contract?

This is not the same person as your daily contact, and you need to know both.

The signer owns the outcome and the budget. They are who you copy on gate emails and who you turn to when the project stalls, and knowing who they are before you need them is the whole point. Asking for the first time during a crisis is expensive.

## Who decides on data questions?

Different from both of the above. You need a named person who can say "yes, those two records are the same person" and "yes, that status maps to Active", and whose answer is final.

Ask what their availability actually is. An expert who is available two days a week is a schedule constraint, and it belongs on the plan as a named risk rather than as a surprise in week five.

Also ask for one point of contact for everything else. You are not there to manage their address book. One person receives, one person forwards.

## What is the recovery plan?

Ask it plainly: if this goes wrong, what do we do? The answer needs three parts.

**What we go back to.** Usually the old system, which is why it goes read only rather than being switched off, and why the date it is decommissioned matters.

**Who decides to go back.** A named person and a threshold. "If reconciliation does not pass by Tuesday, we postpone" is a decision made calmly in advance.

**What we keep.** The final export, the load files, the crosswalk of old ID to new ID. Keep them for the whole contract, not just until go-live.

## What happens to work created during the migration?

The question almost nobody asks up front, and the one the client's staff feel every day of the project.

A migration takes weeks. The business keeps running. Settle the freeze date, what read only means, and where new work goes instead. [The cutover article](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-questions/../migration-cutover/) covers the bridge sheet that answers it.

## The rest of the list

| Question                                           | What the answer protects you from                       |
|----------------------------------------------------|---------------------------------------------------------|
| What is not migrating?                             | The dispute in month three                              |
| How much history is there, really?                 | A timeline built on an estimate                         |
| Is any of it on paper?                             | A scanning workstream discovered late                   |
| Who has read access to the source, and when?       | Two weeks of waiting for credentials                    |
| What are the privacy rules on this data?           | Handling health or financial data carelessly            |
| Who tests, and do they have the time booked?       | UAT that never happens                                  |
| When is the old system decommissioned?             | Losing your fallback without warning                    |
| What holidays and busy periods fall in the window? | A gate that cannot close for two weeks                  |
| When does the contract end?                        | Discovering the deadline at the same time as the client |

## How to ask without sounding like an interrogation

Frame every question against their goal. "So that everyone is live before your audit in October, I need to know who can decide on data questions and how often they are available." The question is the same and it now belongs to them.

Write every answer into the same follow up email, with next actions and dates. Naming the action, the person and the day is not just tidy. It is the pattern Gollwitzer and Sheeran found produced a medium to large improvement in whether an intention became a completed action, across ninety four tests.

## The one habit

Ask what failure looks like. It is the fastest way to find out what the project is really about.

What question do you always ask at the start, that other people seem to skip?

## References

  1. Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. _Advances in Experimental Social Psychology, 38_ , 69–119.
  2. Haller, K., Matthes, F., & Schulz, C. (2012). A detailed process model for large scale data migration projects. _Business Information Systems (BIS 2012), Lecture Notes in Business Information Processing, 117_. Springer.

---

*The full version of this guide lives on my site: [Ask the Right Questions First](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-questions/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
