Cleaning is where you fix what can be fixed automatically and escalate everything else to the client. The output is a source that the target system will accept, and an exception list where every row has a decision. This article covers the split between the two, and how to de-duplicate without destroying real records.

**The short version.** If a rule can fix it safely, fix it. If a human has to decide, it goes on the exception list, and the list is a gate that closes only when every row has an answer.

## What a rule can fix

Which of these do you think is riskier to automate: trimming spaces, or standardizing a date? Have an answer before the list.

Safe to fix by rule, because the intent is not in doubt: leading and trailing spaces, inconsistent capitalization in codes, a date format that is unambiguous, a phone number written with different punctuation, a country name that appears in two spellings.

Not safe by rule, because you would be guessing at meaning: a date that could be March 4th or April 3rd, a status string nobody recognizes, a blank in a required field, two records that look similar but might be two real people.

The date one is the trap. 03/04/24 is ambiguous, and a rule that picks a side silently converts thousands of rows to the wrong day. Check the source system's setting, confirm it with a value you can verify independently, then apply the rule.

## Every rule gets previewed

Never run a transformation you have not looked at on real rows. Show the original and the result side by side, twenty rows, and read them.

This catches the thing that no error message will. A rule that strips a suffix and accidentally invents a value that does not exist will run without complaint on a hundred thousand rows. The only defence is looking at the output. The [entity resolution guide](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/) walks a real example where two rounds of preview caught two separate defects in one rule.

## De-duplication without damage

One client becoming two in the new system is the failure users notice first. Merging two real people into one is worse, and harder to undo.

Work in three passes.

**Exact duplicates first.** Same identifier, same name, same date of birth. These are safe and they are usually the bulk of the problem.

**Near matches second.** Same person, different spelling. These are candidates, not decisions. Build the list, sort it so the most consequential are at the top, and read it.

**Ambiguous cases to the client.** A father and son with the same name at the same address are not a duplicate, and no rule will tell you that. The client knows. Ask.

Picture two records in front of you: same name, same address, birth dates two years apart. Say what you would do before reading on. The answer is that you do not decide it. That row goes on the exception list.

## The exception list is a gate, not a document

Format it so a non-technical person can work through it. One row per problem, the record identifier, what is wrong in words, the options, and an empty decision column.

Send it in batches with a date attached. A four hundred row list arriving in one email gets nothing back. Fifty rows with a Friday deadline gets answers.

The stage closes when every row has a decision. "Leave it for now" is not a decision, it is a deferred problem that resurfaces during [user testing](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-uat/) when there is no time left. Write down who decided and when, next to each row.

## What you do not clean

Resist fixing things that are merely untidy. A client's data does not have to be good, it has to be acceptable to the target system and true to what they had.

Cleaning past that point costs time, introduces risk, and changes records the client never asked you to change. When you find genuine quality problems that are out of scope, write them up as a limitation and hand them over at close. That is a gift to the client, not a failure. [Documenting limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) covers how to write them so they are useful.

## Cheat sheet

| Situation                         | Rule or exception                    |
|-----------------------------------|--------------------------------------|
| Trailing spaces, mixed case codes | Rule                                 |
| Unambiguous date reformat         | Rule, after confirming source format |
| Ambiguous date                    | Exception                            |
| Blank required field              | Exception                            |
| Exact duplicate                   | Rule                                 |
| Near duplicate                    | Exception                            |
| Unrecognized status value         | Exception                            |
| Untidy but valid data             | Leave it, note it at close           |

## The one habit

Preview every rule on real rows before you run it at scale. The data will not tell you when a rule is wrong.

What is the cleaning rule you have seen do the most damage?

## References

  1. Fellegi, I. P., & Sunter, A. B. (1969). A theory for record linkage. _Journal of the American Statistical Association, 64_(328), 1183–1210. doi:10.1080/01621459.1969.10501049
  2. Wang, R. Y., & Strong, D. M. (1996). Beyond accuracy: What data quality means to data consumers. _Journal of Management Information Systems, 12_(4), 5–33.
  3. Matthes, F., Schulz, C., & Haller, K. (2011). Testing & quality assurance in data migration projects. _27th IEEE International Conference on Software Maintenance (ICSM)_ , 438–447.

---

*Originally published on Analyst Prep Kit: [Stage 4: Clean and De-dupe](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-cleaning/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
