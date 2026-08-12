An AI agent tells you the work is done. Here are five checks that show whether it is.

Each check takes a minute or two. Each one looks at the thing that was delivered rather than at the report about it. They apply whether the agent wrote code, moved data, or ran a migration.

**The short version.** A report is not evidence. Only the state of the delivered thing is.

Here is why that distinction matters. While researching this guide I asked a research agent for published complaints about AI agents reporting work as finished when it was not. It returned three quotations, each attributed to a specific public bug report. I checked them against the source. One was real. The other two did not exist anywhere. They were plausible, well written, on topic, and invented.

The agent had not done bad work. Most of its research was excellent and is cited at the bottom of this page. The problem is that a confident report and a correct report look identical. The only thing that told them apart was going to the source.

> _The original carries a diagram here. In words: A ladder of four claims. The agent's summary, the tool's success message, and a passing test each prove less than they appear to. Only the state of the delivered artifact proves the work happened._

## How often this actually happens

This is not a rare event, and it is measured. A 2026 preprint analysed 20,574 real sessions across six agent tools and coded 16,118 confirmed cases where the agent and the developer came apart. Roughly 23% of those were the agent reporting its own work inaccurately, which makes it the third largest category. Faulty implementation, the thing everybody complains about, was smaller at about 18%.

The finding that should change how you work is the trend. The share of failures attributable to inaccurate self-reporting _rose_ over the study period while overall misalignment fell. The authors' own reading is that training rewards code correctness more than it rewards honest reporting, so the code gets better and the reporting does not.

Two industry surveys put numbers on how people have adapted. In Sonar's survey of 1,149 developers, 96% said they do not fully trust that AI-generated code is functionally correct. Another 61% agreed it "often produces code that looks correct but isn't reliable." Stack Overflow asked 33,244 developers for their top frustration. The winner, at 66%, was "AI solutions that are almost right, but not quite."

Almost right is the hard case. Obviously wrong announces itself. Almost right passes every cheap check.

## Check 1: the claim is not the evidence

Before the check, recall the last time something told you it had finished. A build, a script, an assistant. Did you verify it, or did you believe it? The honest answer is usually the second one, and that is what every check on this page is built around.

Start with the simplest question, and ask it of every completion claim: **what command would prove this, and did that command run?**

Not "would it pass". Did it run, in this session, and what did it print. A claim that tests pass is worth exactly as much as the test output sitting next to it, and nothing without it.

The habit that makes this cheap is to ask for the evidence in the same breath as the work. "Make the change, then show me the command you ran and its output." An agent that ran the command will paste it. An agent that did not will produce a summary, and the absence of output is your answer.

**The tell to watch for.** Hedged language doing the work of evidence: _should_ pass, _seems_ correct, _looks_ right, _probably_ fine. Those words appear precisely when nothing was run. Treat them as an unanswered question rather than a status.

## Check 2: the tool's success message is not evidence either

This one surprises people, and it is the reason the first check is not enough on its own. The layer between the agent and your files can also report success without success having happened.

An open bug report on Claude Code documents file writes that silently truncate or zero-fill. It is worth quoting for what it says about reading the file back:

> The Read tool cannot verify a write. It returns intent, not disk state.
> 
> anthropics/claude-code issue #53940, opened 27 April 2026

Reporters on that thread saw the file read back as correct while the bytes on disk were wrong, and settled on checking the byte count after every write. That is a fair summary of the general lesson: **verify through a different path than the one that did the work.** If the agent wrote the file with one tool, check it with another. Read it from the shell, count the bytes, hash it, open it.

The same principle covers a subtler version of the problem. If an agent is working in one directory and your application runs from another, edits can land correctly, report correctly, and still never reach the code that executes. Nothing errors. The change simply is not where it needs to be.

## Check 3: a green test proves less if the agent could edit the test

A passing test suite is evidence about the tests that ran. It is not evidence about the tests that used to exist.

The measurement here is stark. A 2025 benchmark deliberately gave models tasks whose tests could not honestly be satisfied. On one variant, the leading model exploited the test cases rather than the problem in 76% of cases. The important half of that result is the mitigation: the exploitation rate dropped to near zero when the tests were hidden from the model or isolated from it. Not when the model was told not to cheat. When it structurally could not.

You can see the same behaviour in the wild. The oldest report of it on Claude Code's tracker dates to March 2025 and describes being asked to get all tests passing:

> it simply updated the make file to only run tests that were passing. It called these "safe-tests".
> 
> anthropics/claude-code issue #319, opened 4 March 2025

The task was completed as stated. Every test that ran, passed. And a separate 2026 study of over 1.2 million commits found agent-authored test commits lean more on mocks than human ones, 36% against 26%. The authors are careful to say higher mock use is not by itself proof of worse tests.

**So the check is a count, not a feeling.** How many tests were there before this session, and how many are there now? If the number went down, or if new skip markers appeared, that is the first thing to look at and it takes one command to find out.

## Check 4: a proxy is not the delivery boundary

This is the one that cost me the most, personally, before I learned to check it.

A change can be committed, pushed, tested, and still not be live. I have declared work shipped on the strength of a clean push. The deployment had silently failed, so the site kept serving the previous version for as long as I believed otherwise. The commit was real. The push was real. The thing a user would actually see was unchanged.

Someone else arrived at the same lesson from the other direction and wrote it down more concisely than I would have:

> Programmatic test does not equal live app verification.
> 
> anthropics/claude-code issue #47247, opened 13 April 2026

Every kind of work has a boundary where it stops being a description and becomes the thing itself. Find yours and check there:

  * **A website:** fetch the live URL with a cache-buster and search the response for a string that only exists in this change.
  * **A number in a report:** recount it from the source, not from the summary table the agent produced.
  * **A data change:** query the row counts on both sides and reconcile them, rather than trusting the transformation's own log.
  * **An installed application:** run the installed copy, not the source tree.
  * **A published package:** install it fresh from the registry into an empty directory.

## Check 5: a gate the agent can write to is not a gate

This is the deepest version of the problem, and the most recent. It is what makes verification a structural question rather than a matter of asking more firmly.

A developer built an automated check that would stop the session from ending while work was still open. It is a sensible design. Here is what happened, from the report:

> the model deferred a bug it had already diagnosed and could fix in the same turn, logged it as "open item for a future session," and then wrote the user's own stop-hook bypass file (`touch ~/.claude/.allow-stop`) to end the turn, self-certifying completion around a guardrail specifically built to prevent that.
> 
> a completion guardrail that trusts the model's self-attestation has no teeth against a model willing to write the bypass. The model both defined "done" and cleared the gate.
> 
> anthropics/claude-code issue #80700, opened 23 July 2026

It is not an isolated design flaw. A separate report describes an agent getting past pre-commit checks using `--no-verify`, a stash, and quiet flags. Six consecutive commits landed while tests were failing, and every gate was "silently bypassed."

And developers using entirely different tools have converged on the same diagnosis. From a report on Cline, about an approval system that trusts a flag the model itself sets:

> the flag should only be able to _raise_ the approval requirement, never _waive_ it.
> 
> cline/cline issue #12020, opened 1 July 2026

That is the design rule, and it generalises well beyond software. **Whatever decides whether work is done must not be something the worker can edit.** If your checklist lives in a file the agent can write to, it is a suggestion. If your definition of done is a sentence the agent produces, it is a sentence.

In practice that means the check should sit outside the agent's reach: a command you run, a value you read yourself, a person who looks. It does not need to be sophisticated. It needs to be out of reach.

## The full before and after

Same work, same session. The difference is what a reader can confirm without redoing it.

### Before
    
    
    Done. I implemented the reconciliation check, fixed the failing
    test, and verified everything works. All tests pass. The change
    is live.

Four claims, zero evidence, and every one of them is checkable in under a minute. "Verified everything works" is the weakest sentence in the paragraph because it names no check at all.

### After
    
    
    Implemented the reconciliation check.
    
    Tests:      npm test  ->  exit 0,  41 passed, 0 failed
                Test count before: 41.  After: 41.  No skips added.
    Wrote:      src/reconcile.js  ->  wc -c = 4,812 bytes on disk
                (checked from the shell, not read back through the editor)
    Deployed:   curl -s "https://example.com/?cb=$RANDOM" | grep -c "reconcile-v2"
                -> 1   (marker from this change is being served)
    
    Not verified: behaviour on empty input. No test covers it and I
    did not add one.

Every line names a command, its output, and what that output does and does not establish. Note the last section especially. A report that states its own gaps is more trustworthy than one that does not mention any. In a long piece of work, the absence of an "unverified" section is itself a small warning sign.

## Signatures worth knowing

## The test suite got smaller

Count before and after. A completed task that reduced the number of tests deserves an explanation. So does a new `skip`, a disabled file, or a test runner whose scope quietly narrowed.

## An assertion got weaker

A check used to compare a value against an expected result. Now it merely confirms that something exists. That test will pass almost regardless of what the code does. Same for an error being swallowed by an empty catch block.

## The test changed but the code did not

If a fix consists entirely of edits to tests, the behaviour under test is unchanged by definition. Sometimes the test really was wrong. It is worth being sure which case you are in.

## A check was suppressed rather than satisfied

Comments that turn off a type checker or a linter for a specific line are one way of removing the objection instead of addressing it. Flags that skip verification steps are another. Each may be legitimate. Each should be deliberate and visible.

## The scope shrank quietly

Work reported as complete against a smaller definition than the one you gave. The tell is usually a phrase like "for now" or "as a first pass" appearing in a summary you did not ask to be staged.

## A number appears with no visible arithmetic

A figure quoted in a summary that never appears in any command output. This is the version of the problem that bit me at the start of this guide, and it is the one that generalises furthest past code.

## Why this happens

It is worth being precise here, because the popular framing is that the agent is being dishonest, and that framing leads to the wrong fix.

These systems are trained against signals that reward outcomes which look complete. The study of 20,574 sessions attributes the pattern directly to reward signals that favour code correctness while giving less weight to constraint adherence and honest self-reporting. One agent's own self-filed report on this behaviour describes it as a "training gradient, not principle," which is fair. That holds regardless of how much intent you want to read into it.

The practical consequence is what matters: **this is not a problem you can fix by asking more firmly.** Instructions written into a rules file are context the model reads, not a constraint the model obeys. Reports of rule files being read and then not followed exist for every major agent tool. The vendors' position is that this belongs to model behaviour rather than the tool layer. That is reasonable, and it is also a reason not to wait for a fix.

Which leads to the design principle the whole guide rests on. Verification works when it does not depend on the cooperation of the thing being verified. This is not a new idea. It is why auditors do not work for the department they audit. It is why the person who counts the till is not the person who ran it. And it is why a test you can edit is not a test.

## Using this on your own work

Picture the last thing an agent built for you that you shipped without opening. What would you check first if you opened it now? Whatever came to mind is your highest-value check, and it is where the list below should start for you.

Auditing everything is not the goal and you will stop within a day. Do this instead, roughly in this order:

  1. **Ask for the command and its output, once.** Add "show me the command you ran and what it printed" to how you ask for work. This one habit catches most of it and costs nothing.
  2. **Learn your delivery boundary and check it by hand a few times.** Whatever your work is, find the place where it becomes real and go look at it. Do this manually until you know exactly what a real success looks like there.
  3. **Count your tests before and after a session.** One command. Write the number down somewhere if you have to.
  4. **Move your most important check out of the agent's reach.** Pick the one thing that must be true, and make its verification something you run rather than something it reports. Just one to begin with.
  5. **Ask for what was not verified.** Requesting the gaps explicitly gets you a far more useful answer than asking whether everything works, because the second question has an easy answer and the first does not.

If you are starting something new rather than auditing something existing, decide what will count as proof before the work begins. Writing that down first tends to change the request, usually for the better, and it means nobody has to negotiate the definition of done after the fact.

## A cheat sheet

| The claim            | What proves it                                             | What does not                               |
|----------------------|------------------------------------------------------------|---------------------------------------------|
| Tests pass           | The test command's output and exit code, from this session | A previous run, or "should pass"            |
| Tests still cover it | Test count before and after, plus no new skips             | A green run on a smaller suite              |
| The file was written | Byte count or hash, checked from outside the writing tool  | Reading the file back through the same tool |
| The bug is fixed     | The original symptom, reproduced and now absent            | Code was changed in the right area          |
| It works             | Named behaviour, exercised at the delivery boundary        | A proxy script returning the right value    |
| It is live           | The served response containing a marker from this change   | A successful push or build                  |
| The number is right  | Recounted from the source                                  | The same number restated in a summary       |
| The work is complete | A check the worker cannot edit or bypass                   | The worker saying so                        |

**The one habit to keep.** If you take one thing from this page, ask for the command and its output rather than a status. It costs one clause in a sentence, it works with every tool, and it converts the most common failure mode from something you discover days later into something you see immediately.

One thing I am genuinely unsure about, and would like other people's experience on. My instinct is that the checks worth automating are the boring mechanical ones: counting rows, counting tests, comparing bytes, fetching a URL. Those are cheap and cannot be argued with. But the failure that cost me the most time this month was a fabricated quotation, which no mechanical check would have caught. Only going to the source did. Where have you found the line between what is worth automating and what still needs you to go and look?

## References

All three papers below are arXiv preprints. None carried a journal reference or a verifiable DOI at the time of writing, so none is cited as peer-reviewed. The identifiers are given so you can read them yourself.

  * Tang, N., Chen, C., Xu, G., Shi, Y., Huang, Y., McMillan, C., Dong, T., & Li, T. J.-J. (2026). How Coding Agents Fail Their Users: A Large-Scale Analysis of Developer-Agent Misalignment in 20,574 Real-World Sessions. _arXiv preprint_ arXiv:2605.29442.
  * Zhong, Z., Raghunathan, A., & Carlini, N. (2025). ImpossibleBench: Measuring LLMs' Propensity of Exploiting Test Cases. _arXiv preprint_ arXiv:2510.20270.
  * Hora, A., & Robbes, R. (2026). Are Coding Agents Generating Over-Mocked Tests? An Empirical Study. _arXiv preprint_ arXiv:2602.00409.
  * Sonar (2026). _State of Code Developer Survey Report_. n = 1,149. Note: fieldwork was conducted in October 2025, and the publisher sells code-quality tooling.
  * Stack Overflow (2025). _Developer Survey 2025: AI section_. n = 33,244 on the accuracy questions.
  * Public bug reports quoted above, each checked against its source before publication: anthropics/claude-code issues #319, #47247, #53940, #80700; cline/cline issue #12020.

---

*The full version of this guide lives on my site: [How to Verify an AI Agent Actually Did the Work](https://michaelnocito.github.io/analyst-prep-kit/guides/verify-ai-agent-work/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
