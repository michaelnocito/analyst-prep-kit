# -*- coding: utf-8 -*-
"""Articles 7 to 11 of the data-migration series."""

from mig_part1 import HALLER, MATTHES, WANG, GOLLWITZER, FELLEGI  # noqa: F401


def load(add):

    # ------------------------------------------------------------------ 7
    add("migration-dry-run",
        "The Data Migration Dry Run: Rehearse It Before You Mean It",
        "How to run a data migration dry run in a sandbox: what to load, the four "
        "reconciliation checks that have to pass, how to log issues so the second run is "
        "faster, and why manual fixes during a dry run are a failure signal.",
        "Stage 5 of 8 &middot; Load the whole thing somewhere safe and prove it worked",
        """  <p>The dry run is a full load into a sandbox, followed by reconciliation. It is the stage the research is loudest about, and it is the one that decides whether your go-live is calm. This article covers what to load, the four checks that have to pass, and how to log what breaks so the second run is faster.</p>

  <p><strong>The short version.</strong> Load everything, reconcile it four ways, and log every fix. If the run needed you to intervene by hand, it is not finished.</p>

  <h2>Load everything, not a sample</h2>
  <p>What do you think a sample load fails to find? Answer before reading on.</p>
  <p>A sample proves the mapping. A full load proves the mapping, the volume, the timing, and the long tail of weird values that only exist a few hundred times in a million rows. Those are what break a go-live, and a sample cannot see them.</p>
  <p>The full load also tells you how long the real one takes. That number goes on the plan and it drives the freeze window.</p>

  <h2>The four checks</h2>
  <p><strong>1. Counts.</strong> Rows in the source against rows in the target, per table. They match, or you can explain the difference with a number. "We are 412 short because 412 records were excluded on the exception list" is an explanation. "Roughly the same" is not.</p>
  <p><strong>2. Totals.</strong> Sum the numbers that matter. Visit hours, invoice amounts, balances. Counts can match while values are wrong, and a total catches a transformation that shifted a decimal.</p>
  <p><strong>3. Orphans.</strong> Zero. Every document attached to a client, every visit attached to a staff member. This is a <a href="../sql-joins/">left join where the right side is null</a>, and the answer has to be an empty result.</p>
  <p><strong>4. Spot checks on real records.</strong> Pick ten clients, including the two most complicated, and compare them field by field against the old system. This is the check that finds what the aggregates hide.</p>
  <p>Picture a load where counts match perfectly and totals are ten percent low. Say what could cause that before you read the next sentence. A currency or unit conversion applied to some rows and not others is the usual answer, and only the totals check finds it.</p>

  <h2>Log everything that breaks</h2>
  <p>The dry run's real output is not the loaded sandbox. It is the issue log.</p>
  <p>Every issue gets the same four things: what happened, which records, what fixed it, and whether the fix is now part of the process. That last one is the important one. A fix that lives in your head is a fix that will not happen on the night.</p>
  <table>
    <tr><th>Issue</th><th>Records</th><th>Fix</th><th>In the process now?</th></tr>
    <tr><td>Loader rejected rows with an apostrophe in the name</td><td>1,840</td><td>Escape before export</td><td>Yes, in the extract step</td></tr>
    <tr><td>Document dates arrived as 1900-01-01</td><td>612</td><td>Blank source dates now excluded</td><td>Yes, in the transform</td></tr>
  </table>

  <h2>Bulk loaders and their moods</h2>
  <p>The loader is where the time goes. They are strict, they are quiet about why they rejected something, and they will fail a hundred thousand row file because of one bad character.</p>
  <p>Three habits make it survivable. Load in batches small enough that a failure tells you something. Keep the rejected rows file from every attempt, dated. And write down the loader's specific complaints as you learn them, because you will meet the same ones on the next client and nobody documents this for you.</p>
  <p>Poor loader performance is also a reportable finding. If a load that should take an hour takes nine, that belongs in your notes with timings, because it is the evidence behind either a schedule change or a support ticket.</p>

  <h2>The gate</h2>
  <p>The stage closes when a full load reconciles clean, the issue log has a fix against every entry, and no fix required a human hand during the run. Treat the dry run as the real migration and go-live as a repeat performance. If you cannot repeat it, you are not ready.</p>

  <h2>Where this comes from</h2>
  <p>Matthes, Schulz and Haller's paper on testing and quality assurance in migration projects makes the case directly: the quality assurance activity, not the loading, is what determines whether a migration succeeds. Their process model puts a full rehearsal before cutover for the same reason.</p>

  <h2>The one habit</h2>
  <p>If the dry run needed a manual fix, run it again. The second run is the one that tells you the truth.</p>
  <p>What is the strangest reason a load has ever failed on you?</p>""",
        (MATTHES, HALLER))

    # ------------------------------------------------------------------ 8
    add("migration-uat",
        "User Acceptance Testing for a Data Migration",
        "How to run UAT on a data migration: give named records rather than open invitations, "
        "who should test, how long to allow, what counts as a pass, and how to get a written "
        "confirmation without asking for a formal signature.",
        "Stage 6 of 8 &middot; The client's own people check real records",
        """  <p>User acceptance testing is where the client's staff open real records in the new system and say whether they are right. It is the last gate before anything becomes permanent, and it fails for one reason more than any other: people are asked to look around instead of being asked something specific.</p>

  <p><strong>The short version.</strong> Give named people named records and a named question. Vague invitations produce silence, and silence at this stage becomes a dispute later.</p>

  <h2>Ask a question, not for a favour</h2>
  <p>Which of these two do you think gets a reply? Decide, then read.</p>
  <p>"The sandbox is available, please have a look and let us know if anything seems off."</p>
  <p>"Please open these ten clients, check the visit history for 2023 against the old system, and tell me by Thursday whether anything is missing."</p>
  <p>The second one gets a reply, because it names the action, the records, and the day. That is not a communication trick, it is the finding from Gollwitzer and Sheeran's meta-analysis of ninety four tests: an intention converted into a specific when and how produces a medium to large improvement in follow through. Apply it to every request you make of a client.</p>

  <h2>Who should test</h2>
  <p>Not the project sponsor and not IT. The people who use the records every day. A scheduler will spot in four seconds that a visit type looks wrong, and nobody senior to them will.</p>
  <p>Ask for two or three of them by name at <a href="../migration-kickoff-scope/">kickoff</a>, and warn the client then that these people will need real time set aside. Testing squeezed into the gaps of a working day is testing that does not happen.</p>

  <h2>What to give them</h2>
  <p>Build the test pack yourself. Do not make the client invent it.</p>
  <ul>
    <li><strong>Ten to twenty named records</strong>, chosen deliberately: a simple one, a long standing one, one with many documents, one that was on the exception list, one that was de-duplicated.</li>
    <li><strong>A specific thing to check on each</strong>, in their words. Visit history complete. Documents present and attached to the right person. Address current.</li>
    <li><strong>Somewhere to write the answer.</strong> A sheet with a row per record and a pass or fail column, plus space for what was wrong.</li>
    <li><strong>A date.</strong></li>
  </ul>
  <p>Include the de-duplicated records on purpose. Those are the ones where a wrong decision does the most damage, and the client's staff are the only people who can confirm the merge was right.</p>

  <h2>What counts as a pass</h2>
  <p>Agree this before testing starts, or you will be negotiating it while people are annoyed.</p>
  <p>A pass is that the records match what was agreed in the <a href="../migration-field-mapping/">field map</a>. It is not that the new system works exactly like the old one, and it is not that data the client never had has appeared. That distinction is why the signed map matters, and it is worth restating in the email that opens UAT.</p>
  <p>Findings sort into three buckets: a genuine migration defect that you fix, a difference that was agreed in the map and needs explaining, and a new request that is <a href="../migration-scope-creep/">out of scope</a>. Name the bucket for each item when you reply, politely and every time.</p>

  <h2>The gate</h2>
  <p>The stage closes when the client confirms in writing that the sample is acceptable. In practice this is almost never a formal signature. It is an email from you saying what was tested, what was found, what was fixed, and asking them to confirm it now meets expectations, with the go-live date restated.</p>
  <p>Copy the person who signed the contract. Not as a threat, as a courtesy. It also means the confirmation exists somewhere other than one inbox.</p>

  <h2>The one habit</h2>
  <p>Never end UAT on silence. No reply is not approval, and it is the single most common way a migration turns into an argument three months later.</p>
  <p>When you have been asked to test something at work, what made you actually do it?</p>""",
        (GOLLWITZER, MATTHES))

    # ------------------------------------------------------------------ 9
    add("migration-cutover",
        "Cutover, the Freeze, and the Bridge Import",
        "How to run a data migration cutover: freezing the source system as read only, what "
        "staff do during the gap, how a bridge import covers records created mid-migration, "
        "and the checks that have to pass before you call it live.",
        "Stage 7 of 8 &middot; The switch, and the plan for the weeks in between",
        """  <p>Cutover is the switch from old system to new. The part most write-ups skip is the gap: a migration takes weeks, and the business does not stop while you run it. This article covers the freeze, what staff do during the gap, and the bridge import that catches everything created in between.</p>

  <p><strong>The short version.</strong> Freeze the old system as read only on the day you take the final export, capture new work in a structured sheet during the gap, and load that sheet the moment the new system is live.</p>

  <h2>The gap, and why it is your problem</h2>
  <p>Before the answer: a client's staff sign up four new customers the week after you take the export. Where does that data live? Think it through.</p>
  <p>It has to live somewhere, and if you have not decided where, it lives in four different places. Someone's notebook, an email, a spreadsheet nobody else can find, and the old system, which you are about to stop using.</p>
  <p>This is the single biggest difference between a migration that feels professional to the client's staff and one that feels like an outage. The data work is invisible to them. The gap is not.</p>

  <h2>The freeze</h2>
  <p>On the day the final export is taken, the old system goes read only. Staff can look things up. They cannot add, edit, or delete.</p>
  <p>Read only rather than switched off matters. People need their history during the gap, and taking it away for two weeks is how you lose the room. The point of the freeze is that the export you are working from stays true, not that the old system disappears.</p>
  <p>Announce the freeze date at least two weeks ahead, and again the week of. Say what read only means in concrete terms: you can look, you cannot change, here is where new work goes instead.</p>

  <h2>The bridge</h2>
  <p>New work during the gap goes onto a structured sheet, built by you, shaped exactly like the import that will load it.</p>
  <p>That last part is the whole trick. If the sheet has the same columns, the same value lists and the same date format as your load file, then the moment the new system is live you import it in minutes. If the sheet is a free form list somebody invented, you spend a day cleaning it while the client waits.</p>
  <p>Build it with the same rules as the <a href="../migration-field-mapping/">field map</a>: required fields marked, dropdowns where the target has dropdowns, one row per record, and the client ID column present. Give it to the client before the freeze starts and walk one person through filling a row.</p>
  <p>Picture a scheduler at 4pm on a Friday during the freeze, signing up a new client. What has to be true about your sheet for that to take them two minutes? That is the design brief.</p>

  <h2>Cutover day, in order</h2>
  <ol>
    <li>Confirm the freeze held. Ask, do not assume.</li>
    <li>Take the final export.</li>
    <li>Run the load, exactly as rehearsed in the <a href="../migration-dry-run/">dry run</a>.</li>
    <li>Reconcile: counts, totals, orphans, spot checks. Same four as the dry run.</li>
    <li>Load the bridge sheet.</li>
    <li>Reconcile again, including the bridge rows.</li>
    <li>Confirm with the client that the new system is open, and say so in writing.</li>
  </ol>
  <p>Go live together. The client's team and yours, on a call, crossing at the same moment. It costs an hour and it is the difference between a milestone and an email nobody read.</p>

  <h2>What can still go wrong</h2>
  <p><strong>The freeze did not hold.</strong> Somebody kept working in the old system. You find this in reconciliation when counts do not match the export. Ask early rather than discovering it late.</p>
  <p><strong>The bridge sheet grew.</strong> Two weeks of new work is manageable. Six weeks is a second migration. If the gap stretches, the sheet needs a mid point load into the sandbox to prove it still imports cleanly.</p>
  <p><strong>Something needs reloading.</strong> This is why you kept the crosswalk of old ID to new ID. Without it, a reload creates duplicates, and now you have the failure users hate most.</p>

  <h2>The gate</h2>
  <p>The stage closes when counts tie old to new including bridge records, spot checks pass, and the client has been told in writing that they are live, with the hypercare window and its end date stated.</p>

  <h2>The one habit</h2>
  <p>Design the bridge sheet as an import file, not as a form. Everything else about the gap follows from that.</p>
  <p>How has your workplace handled the gap when a system changed over?</p>""",
        (HALLER, MATTHES))

    # ------------------------------------------------------------------ 10
    add("migration-hypercare",
        "Hypercare and Closing a Data Migration Properly",
        "How to run hypercare after a data migration go-live: what to watch, how long the "
        "window should be, the final reconciliation report, the internal readout, and how to "
        "hand a client to support without it feeling like abandonment.",
        "Stage 8 of 8 &middot; The close, and the handoff people remember",
        """  <p>Hypercare is the close support period straight after go-live. It ends with a final reconciliation report, an internal readout, and a handoff to whoever supports the client from here. Done well it is the part the client remembers. Done badly it is unpaid work with no end date.</p>

  <p><strong>The short version.</strong> Agree the window and its end date before go-live, watch the three things that actually surface, then close with a report and a warm handoff to a named person.</p>

  <h2>Agree the window before you need it</h2>
  <p>What do you think happens to a support period with no stated end? Answer honestly.</p>
  <p>It does not end. It fades, and while it fades the client keeps calling the person they trust rather than the team who is meant to support them, and that person is you.</p>
  <p>State the window at kickoff and restate it in the go-live email. Two weeks is common. What matters more than the length is that the end is a date, and that the date is attached to something positive: the final report, the readout, the introduction to their ongoing contact.</p>

  <h2>What actually surfaces</h2>
  <p>Three things, in order of how often they appear.</p>
  <p><strong>"I cannot find X."</strong> Usually it is there and the person is looking in a different place than the old system put it. This is a training question wearing a data costume, and answering it as a data question wastes everyone's time. Show them where it lives.</p>
  <p><strong>"This record looks wrong."</strong> Check it against the <a href="../migration-field-mapping/">field map</a> first. Most of the time it matches what was agreed, and the answer is an explanation. Sometimes it is a real defect, and then you fix it and check whether it affected a class of records or just that one.</p>
  <p><strong>"Where is the thing we agreed not to migrate?"</strong> This is the exclusion list arriving in person. Answer it kindly and point at where the archive lives. If it comes up more than twice, tell the client's contact, because it means the exclusion was not communicated internally.</p>
  <p>Picture the first of those three landing on day two. Say what your first question back would be. If it was "which screen are you on", you have the instinct right.</p>

  <h2>The final reconciliation report</h2>
  <p>One document, and it is the artifact that outlives the project.</p>
  <ul>
    <li>Counts, source against target, per table, final numbers.</li>
    <li>Totals on the values that matter.</li>
    <li>Records excluded, with the reason and the client decision that excluded them.</li>
    <li>Exceptions and how each was resolved.</li>
    <li>Known limitations, written to be useful rather than defensive.</li>
    <li>Where the archive of non migrated data lives, and who holds it.</li>
  </ul>
  <p>Write the limitations section properly. A year from now, somebody at that client will ask why a number does not match, and this document is the answer. <a href="../documenting-data-limitations/">Documenting limitations</a> covers how to write them so they hold up.</p>

  <h2>The internal readout</h2>
  <p>Half an hour with your own team. What happened, what the numbers were, what broke, what you would do differently, and what the next person needs to know about this client.</p>
  <p>This is also where the loader complaints, the timings and the poor performance notes get handed over as evidence rather than folklore. If a load ran nine times slower than it should, that finding is worth more to the business than the migration itself, and it dies in your notes unless you present it.</p>

  <h2>The handoff, so it lands warmly</h2>
  <p>By now the client likes working with you, and being handed to a support address feels like being dropped. A few things prevent that.</p>
  <p><strong>Introduce a person, not a mailbox.</strong> A name, on a short call or in an email, with you present.</p>
  <p><strong>Say what that person is good at.</strong> "Priya handles reporting questions and knows your setup" beats "please contact support".</p>
  <p><strong>Hand over the context, not just the account.</strong> The new contact should already know the exclusion list and the two records that caused trouble.</p>
  <p><strong>Say goodbye clearly and warmly.</strong> Name the end of your involvement, thank the people who did the testing by name, and restate what they achieved against the goal they set at kickoff. Do not leave the ending implied.</p>

  <h2>The gate</h2>
  <p>The project closes when the report is delivered, the readout has happened, the client has met their ongoing contact, and the end of hypercare has been stated in writing.</p>

  <h2>The one habit</h2>
  <p>Give the ending a date and a name. A project that trails off is remembered as one that trailed off, whatever the numbers said.</p>
  <p>What made the best handoff you have ever received feel good?</p>""",
        (MATTHES, WANG))

    # ------------------------------------------------------------------ 11
    add("migration-questions",
        "The Questions to Ask Before You Touch a Client's Data",
        "The questions to ask before starting a data migration: what success looks like, who "
        "signed the contract, who decides on data, what the recovery plan is, and what "
        "happens to work created during the migration.",
        "The list I run through before agreeing to anything",
        """  <p>Most migration trouble traces back to a question nobody asked in week one. This is the list I run through before agreeing to a date, grouped by what each answer protects you from.</p>

  <p><strong>The short version.</strong> Five questions decide the project: what success is, who signs, who decides, what happens if it goes wrong, and what happens to work created during the gap.</p>

  <h2>What does success look like?</h2>
  <p>Before reading on, try answering it for a project you are on now. Harder than it sounds, isn't it.</p>
  <p>Push until it is countable. "All active clients available on day one, visit history back to 2019, documents attached to the right client, no client appearing twice." Every one of those is checkable, which means every one becomes a line in <a href="../migration-dry-run/">reconciliation</a>.</p>
  <p>Then ask the other half: what does failure look like? People answer that one faster and more honestly, and the answer tells you what they are actually protecting.</p>

  <h2>Who signed the contract?</h2>
  <p>This is not the same person as your daily contact, and you need to know both.</p>
  <p>The signer owns the outcome and the budget. They are who you copy on gate emails and who you turn to when the project stalls, and knowing who they are before you need them is the whole point. Asking for the first time during a crisis is expensive.</p>

  <h2>Who decides on data questions?</h2>
  <p>Different from both of the above. You need a named person who can say "yes, those two records are the same person" and "yes, that status maps to Active", and whose answer is final.</p>
  <p>Ask what their availability actually is. An expert who is available two days a week is a schedule constraint, and it belongs on the plan as a named risk rather than as a surprise in week five.</p>
  <p>Also ask for one point of contact for everything else. You are not there to manage their address book. One person receives, one person forwards.</p>

  <h2>What is the recovery plan?</h2>
  <p>Ask it plainly: if this goes wrong, what do we do? The answer needs three parts.</p>
  <p><strong>What we go back to.</strong> Usually the old system, which is why it goes read only rather than being switched off, and why the date it is decommissioned matters.</p>
  <p><strong>Who decides to go back.</strong> A named person and a threshold. "If reconciliation does not pass by Tuesday, we postpone" is a decision made calmly in advance.</p>
  <p><strong>What we keep.</strong> The final export, the load files, the crosswalk of old ID to new ID. Keep them for the whole contract, not just until go-live.</p>

  <h2>What happens to work created during the migration?</h2>
  <p>The question almost nobody asks up front, and the one the client's staff feel every day of the project.</p>
  <p>A migration takes weeks. The business keeps running. Settle the freeze date, what read only means, and where new work goes instead. <a href="../migration-cutover/">The cutover article</a> covers the bridge sheet that answers it.</p>

  <h2>The rest of the list</h2>
  <table>
    <tr><th>Question</th><th>What the answer protects you from</th></tr>
    <tr><td>What is not migrating?</td><td>The dispute in month three</td></tr>
    <tr><td>How much history is there, really?</td><td>A timeline built on an estimate</td></tr>
    <tr><td>Is any of it on paper?</td><td>A scanning workstream discovered late</td></tr>
    <tr><td>Who has read access to the source, and when?</td><td>Two weeks of waiting for credentials</td></tr>
    <tr><td>What are the privacy rules on this data?</td><td>Handling health or financial data carelessly</td></tr>
    <tr><td>Who tests, and do they have the time booked?</td><td>UAT that never happens</td></tr>
    <tr><td>When is the old system decommissioned?</td><td>Losing your fallback without warning</td></tr>
    <tr><td>What holidays and busy periods fall in the window?</td><td>A gate that cannot close for two weeks</td></tr>
    <tr><td>When does the contract end?</td><td>Discovering the deadline at the same time as the client</td></tr>
  </table>

  <h2>How to ask without sounding like an interrogation</h2>
  <p>Frame every question against their goal. "So that everyone is live before your audit in October, I need to know who can decide on data questions and how often they are available." The question is the same and it now belongs to them.</p>
  <p>Write every answer into the same follow up email, with next actions and dates. Naming the action, the person and the day is not just tidy. It is the pattern Gollwitzer and Sheeran found produced a medium to large improvement in whether an intention became a completed action, across ninety four tests.</p>

  <h2>The one habit</h2>
  <p>Ask what failure looks like. It is the fastest way to find out what the project is really about.</p>
  <p>What question do you always ask at the start, that other people seem to skip?</p>""",
        (GOLLWITZER, HALLER))
