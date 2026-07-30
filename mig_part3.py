# -*- coding: utf-8 -*-
"""Articles 12 to 16 of the data-migration series: the project management half."""

from mig_part1 import HALLER, MATTHES, WANG, GOLLWITZER  # noqa: F401

MITCHELL = ('Mitchell, R. K., Agle, B. R., &amp; Wood, D. J. (1997). Toward a theory of '
            'stakeholder identification and salience: Defining the principle of who and what '
            'really counts. <em>Academy of Management Review, 22</em>(4), 853&ndash;886.')
ARIELY = ('Ariely, D., &amp; Wertenbroch, K. (2002). Procrastination, deadlines, and '
          'performance: Self-control by precommitment. <em>Psychological Science, 13</em>(3), '
          '219&ndash;224. doi:10.1111/1467-9280.00441')
DVIR = ('Dvir, D., &amp; Lechler, T. (2004). Plans are nothing, changing plans is everything: '
        'The impact of changes on project success. <em>Research Policy, 33</em>(1), 1&ndash;15.')


def load(add):

    # ------------------------------------------------------------------ 12
    add("migration-pitfalls",
        "Data Migration Pitfalls: What Goes Wrong and What It Costs",
        "The most common data migration failures and what each one costs: duplicates that "
        "survive, moves nobody can prove, orphaned documents, silent loader failures, "
        "ambiguous dates, and the gap nobody planned for.",
        "The failures I have seen most, and the check that catches each one",
        """  <p>Every one of these has a cheap check that catches it early and an expensive version that catches it late. This is the list, ordered by how much the late version costs.</p>

  <p><strong>The short version.</strong> Almost all migration pain comes from six failures, and five of them are caught by counting things before and after.</p>

  <h2>1. Duplicates that survive</h2>
  <p>One client becomes two in the new system. Their history splits between the two records. Staff pick whichever they find first, and now both are half right.</p>
  <p>This is the failure users notice first and forgive last, because it makes the new system look worse than the old one on day one.</p>
  <p><strong>The cheap check.</strong> Group by the identifying field and count anything appearing more than once, during <a href="../migration-profiling/">profiling</a>. <strong>The expensive version.</strong> Finding out from a user in month two, when both records have new activity on them and merging is no longer clean.</p>

  <h2>2. A move nobody can prove</h2>
  <p>The load ran, nothing errored, and no one compared the numbers. Weeks later someone notices a year of visits is missing.</p>
  <p>Say what makes this one so much worse than the others before reading on. It is the fallback: by the time it surfaces, the old system may be gone.</p>
  <p><strong>The cheap check.</strong> Row counts and totals, written down before and after. <strong>The expensive version.</strong> An audit finding, with no source left to recover from.</p>

  <h2>3. Orphaned documents</h2>
  <p>A file loads successfully but attaches to nothing, or to the wrong person. In a regulated industry that is not untidy, it is a compliance problem, and a document attached to the wrong client is worse than a missing one.</p>
  <p><strong>The cheap check.</strong> A left join from documents to clients where the client is null. The answer must be zero. <strong>The expensive version.</strong> Finding it during an inspection.</p>

  <h2>4. The loader that fails quietly</h2>
  <p>Bulk loaders reject rows without always making it obvious. A load reports success, and four thousand rows are simply not there.</p>
  <p><strong>The cheap check.</strong> Compare the row count in your load file to the row count in the target, every single time, and keep the rejected rows file from every attempt. <strong>The expensive version.</strong> Discovering the shortfall after go-live, when you no longer know which attempt dropped them.</p>

  <h2>5. The ambiguous date</h2>
  <p>03/04/24 is either March 4th or April 3rd. A rule that picks silently converts thousands of records to the wrong day, and nothing errors.</p>
  <p>Picture a care visit dated three weeks off. Who notices, and when? Usually nobody, until a bill or an audit disagrees.</p>
  <p><strong>The cheap check.</strong> Confirm the source system's date format against a value you can verify independently, then preview the transformation on real rows. <strong>The expensive version.</strong> A billing dispute traced back to a format assumption.</p>

  <h2>6. The gap nobody planned for</h2>
  <p>The migration takes three weeks and the business keeps running. Nobody decided where new work goes, so it goes into four places, and the client's first week on the new system is spent re-keying.</p>
  <p><strong>The cheap check.</strong> A bridge sheet, shaped like the import file, handed over before the freeze. <a href="../migration-cutover/">The cutover article</a> covers it. <strong>The expensive version.</strong> A go-live that feels like an outage to every member of staff.</p>

  <h2>The pitfalls that are not about data</h2>
  <p><strong>Silence treated as approval.</strong> No reply to a sign off request is not a yes. It is the thing that becomes a dispute later, and <a href="../migration-quiet-client/">chasing it properly</a> is a skill of its own.</p>
  <p><strong>Scope that grew without the plan changing.</strong> Each addition was small and reasonable. The date did not move, because nobody showed what the additions cost. <a href="../migration-scope-creep/">Handling that</a> is mostly a matter of having a plan to point at.</p>
  <p><strong>Working files nobody can find.</strong> Including your own, three weeks later. <a href="../migration-file-hygiene/">Keeping your files straight</a> is unglamorous and it is time you get back every day.</p>

  <h2>The cheat sheet</h2>
  <table>
    <tr><th>Failure</th><th>Catch it with</th><th>Which stage</th></tr>
    <tr><td>Duplicates survive</td><td>Group by identifier, count &gt; 1</td><td>Profiling</td></tr>
    <tr><td>Unprovable move</td><td>Counts and totals, before and after</td><td>Dry run and cutover</td></tr>
    <tr><td>Orphans</td><td>Left join, right side null, expect zero</td><td>Dry run</td></tr>
    <tr><td>Silent loader failure</td><td>Load file count against target count</td><td>Every load</td></tr>
    <tr><td>Ambiguous dates</td><td>Confirm format, preview the rule</td><td>Cleaning</td></tr>
    <tr><td>The gap</td><td>Bridge sheet before the freeze</td><td>Cutover</td></tr>
    <tr><td>Silence as approval</td><td>Written confirmation at each gate</td><td>All</td></tr>
  </table>

  <h2>Where this comes from</h2>
  <p>Matthes, Schulz and Haller's work on testing in migration projects lands on the same conclusion from the research side: the quality assurance activity, rather than the loading, is what separates a migration that worked from one that appeared to. Wang and Strong's fitness for use standard is the other half. Data does not have to be perfect. It has to be good enough for what it is about to be used for, and the target system defines that.</p>

  <h2>The one habit</h2>
  <p>Write the counts down before you load. Almost every failure on this page is caught by a number you already had.</p>
  <p>Which of these six have you actually lived through?</p>""",
        (MATTHES, WANG))

    # ------------------------------------------------------------------ 13
    add("migration-quiet-client",
        "When the Client Goes Quiet: Getting a Project Moving Again",
        "What to do when a client stops responding during a project: the escalation ladder, "
        "why deadlines that come from outside work better than ones you set, when to copy the "
        "contract signer, and how to stay defensible if it is ever reviewed.",
        "The project management half of the job, and the research behind it",
        """  <p>A client who stops replying is the most common reason a migration stalls, and the response most people reach for is a polite nudge that changes nothing. This article gives you an escalation ladder that works, the wording for each rung, and the evidence trail that protects you if the delay is ever reviewed.</p>

  <p><strong>The short version.</strong> Make the next action specific, attach an external deadline, then raise it to the person who owns the outcome. Keep every attempt where someone else can see it.</p>

  <h2>Why the polite nudge fails</h2>
  <p>Before the explanation: think about the last request you left unanswered. What would have made you answer it?</p>
  <p>Usually two things. Knowing exactly what was being asked, and a reason it mattered this week rather than any week.</p>
  <p>"Just checking in on the mapping document" has neither. It does not name an action, and it carries no consequence. Gollwitzer and Sheeran's meta-analysis of ninety four tests found that converting an intention into a specific plan of when, where and how produced a medium to large improvement in whether it got done. A vague nudge is the opposite of that, so it performs like one.</p>

  <h2>Rung one: make the action impossible to misread</h2>
  <p>Rewrite the request so it names the person, the action, the object and the day.</p>
  <p>"Sarah, the mapping sheet needs a decision on the 14 rows highlighted in yellow. Could you send those back by Thursday the 12th? Everything else on the sheet is agreed."</p>
  <p>Then say what it unblocks, in their terms: "That lets cleaning start on the 13th, which keeps the October go-live in place."</p>
  <p>A surprising share of quiet clients are quiet because the ask was too big to start. Fourteen highlighted rows is startable. A four hundred row spreadsheet is not.</p>

  <h2>Rung two: attach a deadline that is not yours</h2>
  <p>Deadlines improve completion, and where they come from matters. Ariely and Wertenbroch found that people do set their own deadlines to manage procrastination, and that externally imposed deadlines improved performance more than self imposed ones.</p>
  <p>So use the real external ones instead of inventing pressure. The contract end date. The client's own audit. The go-live date they chose. The point at which a resource is no longer available.</p>
  <p>"Our contract runs to September 1st. After that, remaining work may carry additional cost. I would much rather finish inside it, and to do that I need those 14 rows this week."</p>
  <p>That sentence works because it is true, it is not a threat, and the pressure belongs to the calendar rather than to you.</p>

  <h2>Rung three: raise it to whoever owns the outcome</h2>
  <p>Which of these three do you think moves a stalled project fastest: your contact's manager, the person who signed the contract, or your own account team? Decide, then read.</p>
  <p>Usually the signer. Stakeholder salience theory explains why. Mitchell, Agle and Wood argue that a claim gets attention in proportion to three attributes held by the person making it: power, legitimacy and urgency. Your contact may have legitimacy and urgency but not the power to reprioritize their own week. The signer has all three, which is why a stalled project moves the moment they can see it.</p>
  <p>Do it as a courtesy copy, not an escalation announcement. The email is addressed to your contact and reads exactly as it would have anyway. It states the goal date, what is outstanding, what it is blocking, and what you need. The signer reading it is enough. You never have to say that is why they are copied.</p>
  <p>Tell your own side at the same time. Account management or client success should never learn about a stalled project from the client.</p>

  <h2>Be ready to be asked why it slipped</h2>
  <p>When a project goes late, someone eventually asks what happened, and both sides get asked. You need to be able to show three things without assembling them in a panic.</p>
  <ul>
    <li><strong>You communicated consistently.</strong> A regular rhythm, not a burst of chasing at the end.</li>
    <li><strong>Every request was specific.</strong> Named action, named person, named date. Which is exactly what makes them get done anyway.</li>
    <li><strong>You replied quickly.</strong> Your own turnaround is the first thing checked, and it is the only part of this entirely within your control.</li>
  </ul>
  <p>This is not defensive paperwork. It is the same behaviour that prevents the delay, kept where it can be read.</p>

  <h2>The wording, rung by rung</h2>
  <table>
    <tr><th>Rung</th><th>What changes</th><th>Copy</th></tr>
    <tr><td>1</td><td>Action gets specific and small</td><td>Contact only</td></tr>
    <tr><td>2</td><td>An external date is attached</td><td>Contact only</td></tr>
    <tr><td>3</td><td>Impact on their goal is stated</td><td>Contact, signer copied</td></tr>
    <tr><td>4</td><td>Your own account team gets involved</td><td>Internal first, then jointly</td></tr>
  </table>
  <p>Move one rung at a time, with a week between, and never skip to the top. An escalation that arrives without the earlier rungs behind it damages a relationship you still need.</p>

  <h2>What not to do</h2>
  <p>Do not go quiet back. A stalled project where both sides stopped writing is one where you share the blame.</p>
  <p>Do not keep working around them indefinitely. Filling the gap by guessing at decisions feels helpful and it produces work the client never approved, which becomes rework.</p>
  <p>Do not let the tone drift. Every message stays warm and stays on their goal. The moment it reads as frustrated, the conversation becomes about the tone rather than the fourteen rows.</p>

  <h2>The one habit</h2>
  <p>Never send a nudge. Send a specific action, a date, and what it unblocks. That email is both the thing most likely to get answered and the thing you will be glad to have on file.</p>
  <p>What has actually worked for you when someone stopped replying?</p>""",
        (GOLLWITZER, ARIELY, MITCHELL))

    # ------------------------------------------------------------------ 14
    add("migration-scope-creep",
        "Scope Creep: Answering With the Project Plan",
        "How to handle scope creep on a client project without saying no: show the impact on "
        "the plan, offer to table it or discuss it, route large changes through the people "
        "who own the outcome, and keep the timeline honest.",
        "How to answer a request without saying no and without losing the date",
        """  <p>Scope creep is not one big request, it is fifteen small reasonable ones. The answer is not refusal. It is showing what each request costs on the plan, and letting the client decide with that in front of them.</p>

  <p><strong>The short version.</strong> Never answer a change request with yes or no. Answer with its impact on the plan, then ask whether they want to table it or discuss it.</p>

  <h2>The plan is the tool</h2>
  <p>Why do you think a project plan makes this conversation easier? Answer before the paragraph does.</p>
  <p>Because it moves the conversation off your opinion. Without a plan, "that will take another week" is you being difficult. With a plan, it is a milestone with a new date on it, and the client can see what else moves.</p>
  <p>The research is blunt about which half matters. Dvir and Lechler studied 448 projects and found that the positive effect of good planning was almost entirely cancelled out by the negative effect of goal changes. Their conclusion is in the title: plans are nothing, changing plans is everything. The plan's value is not that it predicts the project. It is that it lets you show what a change does.</p>

  <h2>Small requests: show the impact, offer two doors</h2>
  <p>For anything that moves a milestone by days rather than weeks, the response has three parts.</p>
  <p><strong>Take it seriously.</strong> "That is a reasonable thing to want, and I can see why."</p>
  <p><strong>Show the impact.</strong> "Adding it means mapping finishes on the 22nd instead of the 15th, which pushes the dry run into the week your team is at the conference, so go-live moves to the 6th."</p>
  <p><strong>Offer two doors.</strong> "Do you want to table this until after go-live, or shall we talk it through properly?" Both doors are open, and neither of them is you saying no.</p>
  <p>A lot of requests get tabled at that point, not because you pushed back but because the client had not seen the cost. The rest get discussed, which is the correct outcome for a request that is worth its cost.</p>
  <p>Picture a client asking for one extra field on the day mapping closes. Say your first sentence back before reading on. If it named the impact rather than the answer, you have it.</p>

  <h2>When to bring in the people who own the outcome</h2>
  <p>Once a change moves the go-live date, it stops being a conversation between you and your daily contact. It needs whoever agreed the date in the first place.</p>
  <p>Say it as a benefit, because it is one: "This changes the October date, so I would like to walk through it with the people who set that target, and make sure everyone is choosing the same tradeoff."</p>
  <p>That also protects your contact. Agreeing to a date change on their own is a risk to them, and offering to share the decision is a kindness rather than an escalation.</p>

  <h2>Large requests: route them, do not absorb them</h2>
  <p>Some requests are not a timeline change, they are a different project. A second system nobody mentioned. A data set that was never in the contract.</p>
  <p>The answer is warm and it is immediate. "That is not in the current scope, and absolutely, let me bring in client success and see what our options are."</p>
  <p>Both halves matter. "Not in the current scope" is said plainly so it cannot be misremembered. "Let me see what our options are" means you are still on their side, and it hands a commercial decision to the people whose decision it is.</p>
  <p>Never absorb a large request quietly to be helpful. It sets a precedent, it moves a date somebody else promised, and it means the next one arrives assuming the same answer.</p>

  <h2>Write it down the same day</h2>
  <p>Every change request, accepted or tabled, goes in the follow up email: what was asked, what it costs, what was decided, by whom.</p>
  <p>A tabled request especially. Six weeks later somebody remembers asking and does not remember the decision, and a one line record settles it in seconds without anyone having to be right.</p>

  <h2>Cheat sheet</h2>
  <table>
    <tr><th>Request size</th><th>Your move</th><th>Who decides</th></tr>
    <tr><td>Days on one milestone</td><td>Show impact, offer table or discuss</td><td>Your contact</td></tr>
    <tr><td>Moves the go-live date</td><td>Show impact, ask to include the people who set the date</td><td>The signer</td></tr>
    <tr><td>Outside the contract</td><td>Name it plainly, route to client success</td><td>Your own commercial team</td></tr>
    <tr><td>Anything, once decided</td><td>Write it in the follow up email</td><td>Recorded, not decided</td></tr>
  </table>

  <h2>The one habit</h2>
  <p>Answer every change request with its impact on the plan, never with yes or no. It keeps you helpful and it keeps the date honest.</p>
  <p>What is the request that most often arrives late in your projects?</p>""",
        (DVIR, GOLLWITZER))

    # ------------------------------------------------------------------ 15
    add("migration-emails",
        "The Emails That Keep a Migration Moving",
        "Email templates for running a client project: the meeting follow up, the stage "
        "sign off, the chase, and the handoff. Each one names next actions with dates, links "
        "the plan, and asks for confirmation.",
        "Four emails, and the four parts every one of them carries",
        """  <p>Most of a migration is run by email, and four of them do almost all the work. Each one carries the same four parts, and the parts are the reason they work.</p>

  <p><strong>The short version.</strong> Every project email says what you need to do, what I am doing, by when, and where the plan is. Then it asks the reader to confirm they got it.</p>

  <h2>The four parts</h2>
  <p>Before the list: which part do you think gets left out most often, and costs the most?</p>
  <p><strong>1. Your next actions, with dates.</strong> Named person, named action, named day. This is the part that makes things happen. Gollwitzer and Sheeran's meta-analysis of ninety four tests found that turning an intention into a specific when and how produced a medium to large improvement in follow through. Your email is that mechanism pointed at somebody else's week.</p>
  <p><strong>2. Our next actions, with dates.</strong> It shows the work is moving and it makes the exchange reciprocal rather than a list of demands.</p>
  <p><strong>3. A link to the plan.</strong> Every time, even when nothing changed. It is where anyone can orient themselves without asking you.</p>
  <p><strong>4. The impact of any delay, in terms of their goal.</strong> Not "this will delay the project" but "this moves go-live past your October audit".</p>
  <p>The one most often missing is the fourth, and it is the one that turns a status update into a reason to act.</p>

  <h2>Email 1: the meeting follow up</h2>
  <p>Every meeting gets one, the same day. Four sections and a request.</p>
  <ul>
    <li><strong>Completed since last time.</strong> Short. It builds the sense that this is moving.</li>
    <li><strong>Your next actions</strong>, with owners and dates.</li>
    <li><strong>Our next actions</strong>, with dates.</li>
    <li><strong>Anything that changed</strong> on the timeline, and why.</li>
    <li><strong>The request:</strong> "Please confirm you have received this and forward to anyone who needs it."</li>
  </ul>
  <p>That last line is the most valuable sentence in the whole email. It gives you a reply on the record, and it puts the forwarding where it belongs, with the person who knows their own organization. You are not there to manage their address book.</p>

  <h2>Email 2: the stage sign off</h2>
  <p>Every <a href="../data-migration-stages/">gate</a> closes with one of these. A formal signature is rare in practice. This gets you the same thing.</p>
  <div class="note">
    <p>We have completed the field mapping and are now moving on to cleaning.</p>
    <p>Please confirm that the mapping meets your expectations. If it does not, book time with me as soon as possible so we can adjust it and keep moving towards your go-live on 20 July.</p>
    <p>As a reminder, our contract runs to 1 September. After that point any remaining services may carry additional cost. I am confident we can finish well inside that, and the plan is here [link].</p>
  </div>
  <p>Three things are doing work there. It states what closed and what opens. It asks for confirmation while offering a meeting rather than demanding a signature. And it names a real external date. Ariely and Wertenbroch found external deadlines improved performance more than self imposed ones, which is why the contract date belongs in the email and invented urgency does not.</p>

  <h2>Email 3: the chase</h2>
  <p>Same shape as everything else, with the ask made smaller and one external date attached. Full ladder in <a href="../migration-quiet-client/">when the client goes quiet</a>.</p>
  <div class="note">
    <p>Sarah, the mapping sheet needs decisions on the 14 rows highlighted in yellow. Everything else is agreed.</p>
    <p>Could you send those back by Thursday 12th? That lets cleaning start on the 13th and keeps the October go-live in place.</p>
    <p>We would love to complete your project inside the contract term, which runs to 1 September. Please get in touch as soon as you can so we can carry on the work we have started.</p>
  </div>

  <h2>Email 4: the handoff</h2>
  <p>Sent at the end of hypercare, and it should not read as an ending you are relieved about.</p>
  <ul>
    <li>What was achieved, against the goal they set at kickoff, in their numbers.</li>
    <li>The final reconciliation report attached.</li>
    <li>Their ongoing contact, introduced by name, with what that person is good at.</li>
    <li>Where the archive of non migrated data lives.</li>
    <li>Thanks to the people who did the testing, by name.</li>
  </ul>
  <p>Naming the testers matters more than it looks. They did unpaid extra work inside a busy job, and their manager is on the email.</p>

  <h2>Habits that make all four work</h2>
  <p><strong>Same day.</strong> A follow up that arrives two days later has already lost to the version people remember.</p>
  <p><strong>Same shape every time.</strong> People learn where to look, and start skimming to the right place.</p>
  <p><strong>Dates, never "soon".</strong> Every action carries a day.</p>
  <p><strong>Reply fast.</strong> Your own turnaround is the one part of the communication record entirely within your control.</p>
  <p>Picture your own inbox on a Monday. Which of these emails would you actually action first, and what made it? That is the design brief for all four.</p>

  <h2>The one habit</h2>
  <p>Ask for confirmation of receipt in every follow up. It is one sentence, it creates the record, and it moves the forwarding to the person who should be doing it.</p>
  <p>What is the one line you always include in a project email?</p>""",
        (GOLLWITZER, ARIELY))

    # ------------------------------------------------------------------ 16
    add("migration-file-hygiene",
        "Keeping Your Own Files Straight During a Migration",
        "A working file structure for data migration projects: naming that sorts itself, one "
        "folder per stage, never overwriting an extract, keeping rejected-row files, and "
        "logging bulk loader problems as evidence.",
        "The unglamorous half of the job that gives you time back every day",
        """  <p>A migration produces hundreds of files: extracts, load files, rejected rows, mapping versions, exception lists. Losing track of which sheet is current costs an hour and, worse, it costs your confidence in your own numbers. This is the structure I use and the three rules that matter most.</p>

  <p><strong>The short version.</strong> One folder per stage, dates at the front of file names, never overwrite an extract, and keep every rejected rows file.</p>

  <h2>The folder structure</h2>
  <pre><code>client-name/
  00-admin/          contract dates, plan, contacts, meeting notes
  01-extracts/       raw exports, never edited, never overwritten
  02-profiling/      counts, findings, the queries that produced them
  03-mapping/        the map, versioned, plus the signed-off copy
  04-cleaning/       transformation rules, exception lists, decisions
  05-loads/          load files, by attempt
  06-rejects/        rejected rows, by attempt, never deleted
  07-reconciliation/ before and after counts, the final report
  08-handover/       what goes to the client and to support
</code></pre>
  <p>Numbering the folders makes them sort in the order the work happens, so the folder list is the project status. Anyone opening it, including you in six weeks, can see where things are.</p>

  <h2>Naming that sorts itself</h2>
  <p>Put the date first, in year month day order, then what it is, then the version.</p>
  <p><code>2026-07-14_client-extract_full.csv</code> sorts chronologically without you doing anything. <code>final_v2_REALFINAL.xlsx</code> does not, and you know exactly which of those two you have created.</p>
  <p>What do you think goes wrong first with a name like <code>mapping_final.xlsx</code>? It stops being final, and nothing in the name tells you when it stopped.</p>

  <h2>Three rules that matter more than the structure</h2>
  <p><strong>Never edit an extract in place.</strong> The raw export is evidence. Copy it into the working folder and edit the copy. When a number is questioned three weeks later, the untouched original is what settles it.</p>
  <p><strong>Never overwrite a load file.</strong> Every attempt gets its own dated file. Attempt three failing differently from attempt two is information, and it is gone if you saved over it.</p>
  <p><strong>Keep every rejected rows file.</strong> These are the most useful files in the project and the ones people delete first. They tell you what the loader hates, and they are the evidence behind a schedule change or a support ticket.</p>

  <h2>Log the loader's behaviour as you learn it</h2>
  <p>Bulk loaders are strict, quiet about failures, and slow to say which row broke. Nobody documents their quirks for you, and you will meet the same ones on the next client.</p>
  <p>Keep one file. Date, what you tried, what it did, how long it took, what fixed it.</p>
  <table>
    <tr><th>Date</th><th>What happened</th><th>Fix</th><th>Timing</th></tr>
    <tr><td>2026-07-14</td><td>Rejected all rows with an apostrophe, no message</td><td>Escape on export</td><td>Lost half a day</td></tr>
    <tr><td>2026-07-16</td><td>50k row file took 4h, expected 30m</td><td>Split into 5k batches, 40m total</td><td>Reported to vendor</td></tr>
  </table>
  <p>Two reasons this is worth the minute it takes. It makes you faster on the next client. And poor performance you can evidence with dates and timings is a business finding, whereas the same complaint without timings is folklore.</p>

  <h2>Version the map, keep the signed copy separate</h2>
  <p>The <a href="../migration-field-mapping/">field map</a> changes through the project and one version of it is the one the client agreed to.</p>
  <p>Keep that copy in its own file, named with the date it was signed off, and never edit it. Later versions live alongside it. When somebody says the data is wrong, you open the signed copy, and the question becomes whether the load matches the agreement, which you can answer in seconds.</p>

  <h2>One more thing you will thank yourself for</h2>
  <p>Keep a running note of decisions with dates. Not a formal log, one file, one line per decision, who made it.</p>
  <p>Almost every dispute in a project is about a decision somebody does not remember making. A line saying who chose what and when ends it without anyone having to be wrong in front of their manager.</p>

  <h2>The one habit</h2>
  <p>Date at the front of every file name. It is a two second habit that removes a whole category of confusion.</p>
  <p>What is your own worst file naming crime?</p>""",
        (WANG, MATTHES))
