# -*- coding: utf-8 -*-
"""Articles 1 to 6 of the data-migration series."""

HALLER = ('Haller, K., Matthes, F., &amp; Schulz, C. (2012). A detailed process model for '
          'large scale data migration projects. <em>Business Information Systems (BIS 2012), '
          'Lecture Notes in Business Information Processing, 117</em>. Springer.')
MATTHES = ('Matthes, F., Schulz, C., &amp; Haller, K. (2011). Testing &amp; quality assurance in '
           'data migration projects. <em>27th IEEE International Conference on Software '
           'Maintenance (ICSM)</em>, 438&ndash;447.')
FELLEGI = ('Fellegi, I. P., &amp; Sunter, A. B. (1969). A theory for record linkage. '
           '<em>Journal of the American Statistical Association, 64</em>(328), 1183&ndash;1210. '
           'doi:10.1080/01621459.1969.10501049')
WANG = ('Wang, R. Y., &amp; Strong, D. M. (1996). Beyond accuracy: What data quality means to '
        'data consumers. <em>Journal of Management Information Systems, 12</em>(4), 5&ndash;33.')
GOLLWITZER = ('Gollwitzer, P. M., &amp; Sheeran, P. (2006). Implementation intentions and goal '
              'achievement: A meta-analysis of effects and processes. <em>Advances in '
              'Experimental Social Psychology, 38</em>, 69&ndash;119.')


def load(add):

    # ------------------------------------------------------------------ 1
    add("what-is-data-migration",
        "What Data Migration Actually Is: A Beginner's Guide",
        "Data migration explained for beginners: what the work involves, the vocabulary you "
        "will hear in every meeting, the tools it runs on, the eight stages, and the two "
        "failures that cost the most.",
        "What the work is, what it is called, and where it goes wrong",
        """  <p>Data migration is moving a client's records from the system they have to the system they bought. If you are about to run your first one, this tells you what you are signing up for. By the end you will know the eight stages, the words you will hear in every meeting, and the two failures that account for most of the pain.</p>

  <p>The work itself is simple to describe. A client is leaving an old system. Their history has to arrive in the new one, complete, connected, and correct. You get the data out, you line up every field with a home in the new system, you fix what is broken, you load it, and you prove the numbers match.</p>

  <p><strong>The short version.</strong> A migration is a move, not a copy. You are responsible for the history arriving intact, and for being able to prove that it did.</p>

  <div class="toc">
    <strong>What's here</strong>
    <ol>
      <li>Where migrations come from</li>
      <li>The words you will hear</li>
      <li>The eight stages, and what a gate is</li>
      <li>The tools</li>
      <li>The two failures that cost the most</li>
      <li>Where this comes from</li>
      <li>How to start on a real job</li>
    </ol>
  </div>

  <h2>Where migrations come from</h2>
  <p>Before the list: which of these four do you think produces the messiest data? Have a guess and hold it.</p>
  <p><strong>A company buys new software and leaves the old vendor.</strong> This is the common one. An agency moves off a fifteen year old scheduling system onto a modern platform.</p>
  <p><strong>Two companies merge.</strong> Now two customer lists have to become one, and the same person exists twice with different spellings.</p>
  <p><strong>A system moves from a server in the building to the cloud.</strong> The data model usually stays similar, so this is the gentlest kind.</p>
  <p><strong>A business finally replaces spreadsheets with a real system.</strong> This is the messy one. Spreadsheets have no rules, so anything a person could type is somewhere in the file.</p>

  <h2>The words you will hear</h2>
  <table>
    <tr><th>Term</th><th>What it means</th></tr>
    <tr><td><strong>Source</strong> and <strong>target</strong></td><td>The old system and the new system. You will say these words hundreds of times.</td></tr>
    <tr><td><strong>Extract</strong></td><td>Getting the data out of the source, usually as a set of files.</td></tr>
    <tr><td><strong>Field mapping</strong></td><td>A line by line list saying that this field in the old system becomes that field in the new one. It is the blueprint for the whole job.</td></tr>
    <tr><td><strong>Transformation</strong></td><td>Changing the shape of a value so the target will accept it. A date written as 03/04/24 becoming 2024-04-03 is a transformation.</td></tr>
    <tr><td><strong>Profiling</strong></td><td>Looking at the real data to find out what is actually in it, rather than what the client says is in it.</td></tr>
    <tr><td><strong>Reconciliation</strong></td><td>Proving the move worked by comparing counts and totals, source against target.</td></tr>
    <tr><td><strong>Orphan</strong></td><td>A record that lost its parent. A document with no client attached. In a regulated industry an orphan is not untidy, it is a compliance problem.</td></tr>
    <tr><td><strong>Cutover</strong></td><td>The moment the old system stops being used and the new one starts.</td></tr>
    <tr><td><strong>Hypercare</strong></td><td>The close support period straight after cutover, when the team watches for what surfaces.</td></tr>
  </table>
  <p>Say the difference between profiling and reconciliation out loud before reading on. If you can, the rest of this series will be easy.</p>

  <h2>The eight stages, and what a gate is</h2>
  <p>What do you think stops a migration team from starting work before it is ready? Answer that before the paragraph does.</p>
  <p>Every serious framework describes roughly the same shape. Kickoff and scope. Profile the source. Map the fields. Clean and de-dupe. Dry run in a sandbox. User testing. Freeze and cutover. Hypercare and close.</p>
  <p>Each one ends at a <strong>gate</strong>. A gate is a checkpoint with an owner and an answer, and you do not start the next stage until it closes. Mapping does not begin until scope is agreed in writing. Nothing loads until the map is signed off. You do not go live until a client has looked at real records and said yes.</p>
  <p>Gates feel like paperwork on a small job. They are the only reason a large job finishes. <a href="../data-migration-stages/">The stages article</a> walks all eight, with the gate that closes each one.</p>

  <h2>The tools</h2>
  <p>Most migrations run on four kinds of tool, and you will use all four in a week.</p>
  <p><strong>Spreadsheets</strong> hold the map, the exception list, and the working files. Excel is not glamorous and it is where most of this actually happens.</p>
  <p><strong>SQL</strong> does the profiling and the reconciliation. Counting rows, finding duplicates, and checking that nothing lost its parent are each a few lines. If you can write a <a href="../sql-count-function/">COUNT with GROUP BY</a>, you can do most of the checking work.</p>
  <p><strong>A bulk loader.</strong> Every target system has one, and it is the tool you will fight. Loaders are strict about formats, quiet about failures, and slow to tell you which row broke.</p>
  <p><strong>A scripting language</strong> once the volume passes what a spreadsheet handles comfortably. Python with pandas is the usual choice, and <a href="../handle-large-datasets/">handling large files</a> is its own skill.</p>
  <p>Picture the last messy spreadsheet you saw. Now picture a loader rejecting it one row at a time with no message about why. That is the middle of a migration.</p>

  <h2>The two failures that cost the most</h2>
  <p><strong>Duplicates that survive.</strong> One client becomes two in the new system. Their history splits. Staff pick the wrong record. This is why de-duplication happens before the move and not after, and why <a href="../entity-resolution/">matching records that describe the same thing</a> is worth learning properly.</p>
  <p><strong>A move nobody can prove.</strong> The data went across and the numbers were never checked. Weeks later someone notices a year of visits is missing. By then the old system may be gone.</p>
  <p>The fix for both is the same and it is unglamorous. Count things, write the counts down, and compare them.</p>

  <h2>Where this comes from</h2>
  <p>Haller, Matthes and Schulz built a detailed process model for large migration projects from the existing literature plus twenty five industry interviews. Their earlier paper with the same group makes the stronger claim, and it is the one worth carrying: the testing and reconciliation work, not the loading, is what decides whether a migration succeeds.</p>
  <p>The vendor frameworks agree on the shape. They assess, prove the approach at small scale, migrate at full scale, then run a defined hypercare window after cutover.</p>
  <p>My own experience adds one stage most write-ups skip, and it is the one clients feel. A migration takes weeks, and the client keeps working during those weeks. What happens to the records they create in that gap is a real question with a real answer, and it gets <a href="../migration-cutover/">its own article</a>.</p>

  <h2>How to start on a real job</h2>
  <ol>
    <li>Ask what success looks like, and write the answer where the client can see it.</li>
    <li>Get a full export before you promise a date.</li>
    <li>Count everything in that export. Rows per table, at minimum.</li>
    <li>Build the map before you touch the data.</li>
    <li>Load nothing into the real system until it has worked in a sandbox.</li>
  </ol>
  <p>If you have paper nearby, sketch the source, the target, and the checks in between. It is the whole job on one page.</p>

  <h2>The one habit</h2>
  <p>Count before, count after, keep the counts. Everything else in this series is detail on top of that.</p>
  <p>Migrations are also a people job, and the hardest part is rarely the data. What is the part of a system change you have found hardest to get people through?</p>""",
        (HALLER, MATTHES, WANG))

    # ------------------------------------------------------------------ 2
    add("data-migration-stages",
        "The Eight Stages of a Data Migration, and the Gate That Closes Each One",
        "The eight stages of a data migration end to end: kickoff, profiling, mapping, "
        "cleaning, dry run, UAT, cutover and hypercare, with the checkpoint that has to "
        "close before the next stage starts.",
        "The industry pattern, with commentary from ten years of running them",
        """  <p>This is the whole shape of a migration on one page. Eight stages, and for each one the single checkpoint that has to close before the next stage may start. Use it to plan a job, to explain to a client why you are not loading yet, or to work out which stage you are actually stuck in.</p>

  <p>The stage list below is the industry pattern. It is what the research describes and what the large vendors sell. The commentary under each one is mine, from running these for a living, and it is where I say what the pattern gets right and where real projects bend it.</p>

  <p><strong>The short version.</strong> Eight stages, eight gates. A gate is a checkpoint with an owner and a written answer, and skipping one does not save time, it moves the cost later.</p>

  <table>
    <tr><th>#</th><th>Stage</th><th>The gate that closes it</th></tr>
    <tr><td>1</td><td><a href="../migration-kickoff-scope/">Kickoff and scope</a></td><td>Success criteria, stakeholders and what does not migrate, confirmed in writing</td></tr>
    <tr><td>2</td><td><a href="../migration-profiling/">Profile the source</a></td><td>Row counts, blanks, duplicates and bad values documented</td></tr>
    <tr><td>3</td><td><a href="../migration-field-mapping/">Map the fields</a></td><td>Signed off data map. Nothing moves before this</td></tr>
    <tr><td>4</td><td><a href="../migration-cleaning/">Clean and de-dupe</a></td><td>Exception list returned with a client decision on every row</td></tr>
    <tr><td>5</td><td><a href="../migration-dry-run/">Dry run in a sandbox</a></td><td>Clean reconciliation, issues logged, zero orphans</td></tr>
    <tr><td>6</td><td><a href="../migration-uat/">User acceptance testing</a></td><td>Client validates a real sample and confirms in writing</td></tr>
    <tr><td>7</td><td><a href="../migration-cutover/">Freeze, cutover, bridge</a></td><td>Counts tie old to new, bridge data loaded, live together</td></tr>
    <tr><td>8</td><td><a href="../migration-hypercare/">Hypercare and close</a></td><td>Final reconciliation report, readout, handoff to support</td></tr>
  </table>

  <h2>Stage 1: Kickoff and scope</h2>
  <p>Before reading on: what is the one question a kickoff has to answer, that nothing later can fix if it is missed?</p>
  <p>The pattern says define scope, roles and success criteria. That is correct and it is thin. In practice the kickoff is where you settle four things: why the client is doing this at all, what success looks like in numbers, what is <em>not</em> coming across, and who the one person is that you route everything through.</p>
  <p><strong>My commentary.</strong> The scope item people underspend on is the exclusion list. Agreeing that seven years of history comes over is easy. Agreeing that three of those years arrive as reference only, and what that means the day a nurse cannot find a note, is the conversation that saves the project.</p>

  <h2>Stage 2: Profile the source</h2>
  <p>The pattern splits this from cleaning, and it is right to. Profiling is finding out what is really there. Cleaning is doing something about it.</p>
  <p><strong>My commentary.</strong> This is the only stage whose output tells you whether your timeline is real, so it belongs before you commit to dates rather than after. A source with a free text field where a dropdown should be is not a cleaning problem, it is a scope problem, and it is cheaper to learn in week two than week six.</p>

  <h2>Stage 3: Map the fields</h2>
  <p>Every field in the source gets a home in the target, or an explicit decision that it does not travel. The map is a document the client signs.</p>
  <p><strong>My commentary.</strong> Nothing moves until the map is signed off. That rule sounds rigid and it is the single highest value rule in the list. A map signed by the client turns "the data is wrong" into "the data matches what we agreed", which is a completely different meeting.</p>

  <h2>Stage 4: Clean and de-dupe</h2>
  <p>Fix what can be fixed by rule. Everything that cannot goes on an exception list, and the client decides row by row.</p>
  <p><strong>My commentary.</strong> The exception list is a gate, not a document. It closes when every row has a decision, and "we will deal with it later" is not a decision. De-duplication in particular has to happen here, because one client turning into two in the new system is the failure users notice first and forgive last.</p>

  <h2>Stage 5: The dry run</h2>
  <p>Load the whole thing into a sandbox, reconcile it, and log everything that broke. This is the stage the research is loudest about.</p>
  <p><strong>My commentary.</strong> Treat the dry run as the real migration and the go-live as a repeat performance. If the dry run needed manual intervention, it is not finished, because you will not have time to intervene on the night.</p>

  <h2>Stage 6: User acceptance testing</h2>
  <p>The client's own people open real records in the new system and say whether it is right.</p>
  <p><strong>My commentary.</strong> Give them named records, not a general invitation to look around. "Open these ten clients and check the visit history against the old system" gets answers. "Have a look and let us know" gets silence, and silence at this stage is what turns into a dispute later.</p>

  <h2>Stage 7: Freeze, cutover and the bridge</h2>
  <p>The source goes read only. The final export runs. The load runs. Counts are compared. Everyone goes live together.</p>
  <p><strong>My commentary.</strong> This is where the standard write-ups skip the part clients actually feel. A migration takes weeks, and business does not stop for it. The bridge is the plan for the records created during those weeks, and having one is the difference between a calm go-live and a scramble. <a href="../migration-cutover/">The cutover article</a> covers how to run it.</p>

  <h2>Stage 8: Hypercare and close</h2>
  <p>A defined window of close support after go-live, then a final reconciliation report, a readout, and a handoff to whoever supports the client from here.</p>
  <p><strong>My commentary.</strong> Hypercare needs an end date agreed at the start, or it becomes free consulting. The close also needs a real handoff, because a client who has worked with one person for three months does not want to be handed a support address and nothing else.</p>

  <h2>What a gate actually is</h2>
  <p>Say what makes a gate different from a status update before you read the answer.</p>
  <p>A gate has three parts. Something happened, a named person confirmed it in writing, and the confirmation is somewhere both sides can find. A status update has none of those. In real projects the confirmation is almost never a formal signature. It is an email that says what was completed, what is starting, and asks the client to confirm the first part meets expectations. <a href="../migration-emails/">The emails article</a> has the wording.</p>

  <h2>Where this comes from</h2>
  <p>Haller, Matthes and Schulz built their process model from the literature plus twenty five industry interviews, and the companion paper argues that testing and quality assurance, rather than the loading itself, determine whether a migration succeeds. The large cloud vendors describe the same arc in fewer words: assess, prove it small, migrate at scale, then hypercare.</p>
  <p>The eight here are those two views merged, with profiling separated out and the bridge added, because those are the two places I have seen real projects lose the most time.</p>

  <h2>The one habit</h2>
  <p>Never start a stage whose previous gate has not closed in writing. If you cannot point at the email, the gate did not close.</p>
  <p>Which of the eight do you think gets skipped most often on the jobs you have seen?</p>""",
        (HALLER, MATTHES))

    # ------------------------------------------------------------------ 3
    add("migration-kickoff-scope",
        "Data Migration Kickoff and Scope: How to Run the First Meeting",
        "How to run a data migration kickoff: the four questions that define the project, "
        "why the exclusion list matters more than the inclusion list, naming a single point "
        "of contact, and the email that closes the gate.",
        "Stage 1 of 8 &middot; The meeting that decides how the rest goes",
        """  <p>A kickoff is not a get to know you call. It is where you define the project, and anything you fail to settle here you will renegotiate later at a worse moment. This article gives you the agenda, the four questions that matter, and the email that closes the stage.</p>

  <p><strong>The short version.</strong> Leave the kickoff with a written answer to why we are here, what success looks like, what is not coming across, and who your one contact is.</p>

  <h2>The four questions</h2>
  <p>Which of these do you think clients find hardest to answer? Guess, then read.</p>
  <p><strong>Why are we doing this?</strong> There is always a reason underneath the software purchase. A failed audit, a merger, a system the vendor stopped supporting. The reason tells you what the client will care about when a tradeoff comes up.</p>
  <p><strong>What does success look like?</strong> Push until it is concrete. "All client records available in the new system on day one, with visit history back to 2019, and no client appearing twice" is a success criterion. "A smooth migration" is not.</p>
  <p><strong>What does failure look like?</strong> Ask this one out loud. It surfaces the thing they are quietly afraid of, and it is usually specific. Losing signed documents. Losing the audit trail. Staff refusing to use the new system.</p>
  <p><strong>What are the risks?</strong> Name them together: timelines, people going on holiday, an expert who is only available two days a week, a technical dependency you do not control. A risk the client named is a risk you can talk about later without it sounding like an excuse.</p>

  <h2>The exclusion list beats the inclusion list</h2>
  <p>Agreeing that seven years of history comes over is easy and it is not the useful half. The useful half is what does not come, and what that means in practice.</p>
  <p>Say out loud what happens on the day a staff member cannot find a record you agreed to leave behind. If you cannot picture that moment, the exclusion has not been agreed properly.</p>
  <p>Write the exclusions in the client's own words, not in system terms. "Anything closed before 2019 is reference only, which means you look it up in the archive, not in the new system" lands. "Pre-2019 records are out of scope" does not.</p>

  <h2>One point of contact, not an address book</h2>
  <p>Ask for a single named person on the client side who routes everything. Meeting invitations go to them. Questions go to them. They forward as needed.</p>
  <p>This is not about convenience. Trying to manage a client's internal address book means you are guessing who needs to know, and every guess is a chance to miss someone who later says they were never told. One contact makes forwarding their job, which is where it belongs.</p>
  <p>Separately, find out who signed the contract. That person is rarely your daily contact, and they are the person whose attention moves things when the project stalls. You are not going to email them weekly. You need to know who they are before you need them.</p>

  <h2>What you say about yourself</h2>
  <p>Spend two minutes, not ten. Who you are, that you have done this before, and how you are going to get them from here to live. Then put the plan on the screen and let it do the talking.</p>
  <p>A visible project plan at kickoff is worth more than any credential. It is also the thing you will point at every time someone asks for a change, which is why <a href="../migration-scope-creep/">scope creep</a> is a solved problem when the plan exists and an argument when it does not.</p>

  <h2>The agenda, in order</h2>
  <ol>
    <li>Why we are here, in the client's words.</li>
    <li>What success looks like, written down where everyone can see it.</li>
    <li>What failure looks like.</li>
    <li>Risks, named by both sides.</li>
    <li>What comes across, and what does not.</li>
    <li>Who does what, including the single point of contact and the experts who will validate data.</li>
    <li>The plan, with the milestone dates and the gates.</li>
    <li>What happens next, and by when.</li>
  </ol>

  <h2>The gate</h2>
  <p>The stage closes with an email, sent the same day. It states what was agreed, what is not in scope, who the contact is, what the next actions are with dates, and it links the plan. It asks the client to confirm that this matches their understanding, and it copies the people who need to know.</p>
  <p>Naming a specific action with a when and a who is not a stylistic choice. Gollwitzer and Sheeran's meta-analysis of ninety four tests found that turning an intention into a stated plan of when, where and how produced a medium to large improvement in whether the thing got done. Your follow up email is that, applied to a client.</p>

  <h2>Cheat sheet</h2>
  <table>
    <tr><th>Leave the kickoff with</th><th>Written where</th></tr>
    <tr><td>Why this project exists</td><td>Follow up email, first line</td></tr>
    <tr><td>Success criteria, in numbers</td><td>Follow up email and the plan</td></tr>
    <tr><td>What is out of scope</td><td>Follow up email, in the client's words</td></tr>
    <tr><td>Named risks</td><td>The plan</td></tr>
    <tr><td>Single point of contact</td><td>Follow up email</td></tr>
    <tr><td>Who signed the contract</td><td>Your own notes</td></tr>
    <tr><td>Next actions with dates</td><td>Follow up email</td></tr>
  </table>

  <h2>The one habit</h2>
  <p>Do not leave the kickoff without knowing what is <em>not</em> migrating. That sentence prevents more disputes than any other in the project.</p>
  <p>What is the question you wish someone had asked you at the start of your last project?</p>""",
        (HALLER, GOLLWITZER))

    # ------------------------------------------------------------------ 4
    add("migration-profiling",
        "Data Profiling Before a Migration: The Checks That Change the Plan",
        "How to profile a source system before a data migration: the seven checks to run on "
        "every extract, what each one tells you about the timeline, and how to turn findings "
        "into scope decisions rather than surprises.",
        "Stage 2 of 8 &middot; Find out what is really in there, before you promise dates",
        """  <p>Profiling is looking at the real data to find out what is actually in it. It takes a day or two and it is the only stage whose output tells you whether your timeline is honest. This article gives you the seven checks to run on every extract and what each one changes.</p>

  <p><strong>The short version.</strong> Run the same seven checks on every table before you map anything, and turn each finding into either a rule, a scope decision, or a risk on the plan.</p>

  <h2>Why this is its own stage</h2>
  <p>What do you think the difference is between profiling and cleaning? Answer before reading on.</p>
  <p>Profiling finds out what is there. Cleaning does something about it. They get merged in a lot of write-ups, and merging them costs you the moment where the findings could still change the plan. Once you are cleaning, you have already committed to an approach.</p>
  <p>Profiling also gives you something to say when a client asks how long this will take. "Twelve percent of your client records have no primary address, and that field is required in the new system" is a real conversation. A gut feeling is not.</p>

  <h2>The seven checks</h2>
  <p>Run these per table. All of them are a few lines of SQL, and most are a <a href="../sql-count-function/">COUNT with GROUP BY</a>.</p>
  <p><strong>1. Row counts.</strong> How many rows in each table. Write them down. Everything you do later gets compared to this number, and it is the baseline for <a href="../migration-dry-run/">reconciliation</a>.</p>
  <p><strong>2. Blanks in required fields.</strong> For every field the target system requires, count how many source rows have nothing in it. This single check produces most of the surprises.</p>
  <p><strong>3. Distinct values in fields that should be a list.</strong> A status field with six allowed values in the new system, holding four hundred distinct strings in the old one, means somebody was typing free text. That is a mapping project of its own.</p>
  <p><strong>4. Duplicates on the identifying field.</strong> Group by whatever should be unique and count anything appearing more than once. This is the first sight of the de-duplication work.</p>
  <p><strong>5. Orphans.</strong> Children with no parent. Documents with no client, visits with no staff member. A left join where the right side is null finds them.</p>
  <p><strong>6. Formats.</strong> Dates, phone numbers, identifiers. Look at the actual strings, not the column type. A date column stored as text will contain at least three formats and at least one impossible date.</p>
  <p><strong>7. Ranges and outliers.</strong> Minimum and maximum on every date and number. A birth date in 1899 and a visit dated 2087 are both in there, and both will be rejected by the loader at the worst possible moment.</p>
  <p>Picture running check three on a system you know. How many different ways do you think people have spelled the same status? That number is your mapping workload.</p>

  <h2>Turning findings into decisions</h2>
  <p>A finding that stays in your notes is worth nothing. Every one becomes exactly one of three things.</p>
  <p><strong>A rule.</strong> The fix is mechanical and safe. Trim whitespace, standardize a date format, upper case a code. This goes into the transformation work and needs no client input.</p>
  <p><strong>A scope decision.</strong> The fix requires a human to decide something. Four hundred free text statuses collapsing into six means somebody has to say which is which, and that somebody is the client. This is a decision with a date attached.</p>
  <p><strong>A risk.</strong> The finding might cost time and you cannot yet tell. Put it on the plan with a name against it. A risk that was on the plan since week two is a normal project event. The same risk raised in week eight is a failure.</p>

  <h2>What changes the plan most often</h2>
  <p>Three findings, in order of how often they move a date.</p>
  <p><strong>A required field that is mostly empty in the source.</strong> There is no rule that invents data. Either the client fills it, or the target accepts a default, or the field does not migrate. All three take a conversation.</p>
  <p><strong>Free text where the target wants a list.</strong> Someone has to map every value, and only the client knows what the odd ones mean.</p>
  <p><strong>Volume you were not told about.</strong> The extract holds more history than the contract described, or the document store is four times the size anyone said. This changes the technical approach, not just the schedule.</p>

  <h2>Write it down like this</h2>
  <table>
    <tr><th>Check</th><th>Finding</th><th>Becomes</th><th>Owner</th></tr>
    <tr><td>Blanks in required</td><td>12% of clients have no primary address</td><td>Scope decision</td><td>Client</td></tr>
    <tr><td>Distinct values</td><td>412 status strings, target allows 6</td><td>Scope decision</td><td>Client</td></tr>
    <tr><td>Formats</td><td>Dates in 3 formats, 40 impossible</td><td>Rule plus exception list</td><td>Us</td></tr>
    <tr><td>Volume</td><td>Document store is 4x the estimate</td><td>Risk</td><td>Us</td></tr>
  </table>
  <p>That table is the gate. It closes when every row has an owner and a date, and it goes to the client as part of the stage wrap up email.</p>

  <h2>Where this comes from</h2>
  <p>The migration process model built by Haller, Matthes and Schulz puts an analysis stage before design for the same reason given here: the findings are supposed to feed the plan, and they cannot if they arrive after it. The wider data quality literature frames it as fitness for use, from Wang and Strong. Data is not good or bad in the abstract. It is good enough for a purpose, and the purpose here is the target system's rules.</p>

  <h2>The one habit</h2>
  <p>Never promise a date before you have counted the rows. The count is cheap and the promise is not.</p>
  <p>What is the worst thing you have found in a source system once you actually looked?</p>""",
        (HALLER, WANG))

    # ------------------------------------------------------------------ 5
    add("migration-field-mapping",
        "Field Mapping in a Data Migration: Building the Blueprint",
        "How to build a field mapping document for a data migration: what each row needs, "
        "how to handle fields with no home, why one unique ID ties everything together, and "
        "why nothing moves until the map is signed off.",
        "Stage 3 of 8 &middot; Every field gets a home before anything moves",
        """  <p>The field map is a line by line list saying what each field in the old system becomes in the new one. It is the blueprint for the entire job, it is the document the client signs, and nothing loads until it is agreed. This article covers what goes in each row, how to handle fields with nowhere to go, and the ID rule that keeps records and documents together.</p>

  <p><strong>The short version.</strong> One row per source field. Every row ends in a home, a transformation, or a written decision that it does not travel.</p>

  <h2>What a mapping row contains</h2>
  <p>Before the list: what do you think is the column people forget, that causes the most arguments later?</p>
  <table>
    <tr><th>Column</th><th>Why it is there</th></tr>
    <tr><td>Source table and field</td><td>Exactly where it comes from</td></tr>
    <tr><td>Sample values</td><td>Three real values. This is what makes the map reviewable by someone who is not technical</td></tr>
    <tr><td>Target field</td><td>Where it lands, or "not migrated"</td></tr>
    <tr><td>Required in target</td><td>Yes or no. Drives the blanks problem from profiling</td></tr>
    <tr><td>Transformation</td><td>What has to change about the value, in words</td></tr>
    <tr><td>Decision and who made it</td><td>The column people forget. Six months later, this is the only thing that settles a dispute</td></tr>
  </table>
  <p>The sample values column is what turns the map from a technical document into something a client can actually check. Nobody can review a field called <code>cl_stat_cd</code>. Everybody can review it once they see that it holds ACT, INACT and HOLD.</p>

  <h2>Fields with nowhere to go</h2>
  <p>Every migration has them. The old system tracked something the new one does not, or tracks it somewhere different. There are four honest outcomes and you pick one per field.</p>
  <p><strong>It maps to a different field.</strong> Fine. Write the transformation down.</p>
  <p><strong>It merges with another field.</strong> Two address lines becoming one. Write down the joining rule, including what happens when one side is empty.</p>
  <p><strong>It goes into a notes or custom field.</strong> The pressure valve. Use it sparingly, because a value in a notes field cannot be reported on, and the client will eventually want to report on it.</p>
  <p><strong>It does not travel.</strong> A real answer, and the one that needs the clearest written record. Name the field, say why, and get it confirmed alongside the exclusions agreed at <a href="../migration-kickoff-scope/">kickoff</a>.</p>
  <p>Say which of those four you would push a client towards for a field nobody has used since 2018. Then read the next line. It is the fourth one, and the profiling row count is your evidence.</p>

  <h2>One ID ties it together</h2>
  <p>Pick a single identifier per real thing, usually the client, and carry it through everything. Records reference it. Documents reference it. Your working files reference it.</p>
  <p>This is what stops orphans. A document loaded with the client's name on it and nothing else is a document that will end up attached to the wrong person or to nobody. A document loaded with the client ID lands where it belongs.</p>
  <p>The old system's key is usually the right thing to carry, even when the new system generates its own. Keep a crosswalk table of old ID to new ID. You will need it during the <a href="../migration-dry-run/">dry run</a>, and you will need it again if anything has to be reloaded.</p>

  <h2>Documents are data too</h2>
  <p>Files get treated as an afterthought and they are half the job in a regulated industry. Every document needs the same treatment as a record: where it comes from, what it is called, what type it is, what date it carries, who it belongs to, and where it lands.</p>
  <p>If some of the source is paper, that is a separate workstream with its own timeline. Scanning and indexing runs in parallel and it is usually the thing that determines the go-live date. Put it on the critical path in week one, not week six.</p>

  <h2>Getting it signed off</h2>
  <p>Do not send a spreadsheet with four hundred rows and ask for approval. You will get silence, and silence is not approval.</p>
  <p>Send it in pieces the client can actually review. One table at a time, with the rows needing a decision marked and everything mechanical collapsed into a summary line. Ask for a decision on the marked rows by a date.</p>
  <p>The gate closes when every row has a target or a written decision, and the client has confirmed. That confirmation email is the one you will point at every time somebody says the data is wrong. It converts the question from "is this right" to "does this match what we agreed", which you can answer in ten seconds.</p>

  <h2>The one habit</h2>
  <p>Nothing moves until the map is signed off. Not a test load, not a quick sample, nothing. The rule only works if it has no exceptions, because the first exception is the one somebody remembers.</p>
  <p>Have you ever inherited a system where you could not tell what a field was for? What would the map have needed to say?</p>""",
        (HALLER, WANG))

    # ------------------------------------------------------------------ 6
    add("migration-cleaning",
        "Cleaning and De-duplication Before a Data Migration",
        "How to clean data before a migration: what to fix by rule, what has to go on an "
        "exception list for the client to decide, how to de-duplicate without merging real "
        "records, and why the exception list is a gate.",
        "Stage 4 of 8 &middot; Fix by rule, escalate by exception, decide before you move",
        """  <p>Cleaning is where you fix what can be fixed automatically and escalate everything else to the client. The output is a source that the target system will accept, and an exception list where every row has a decision. This article covers the split between the two, and how to de-duplicate without destroying real records.</p>

  <p><strong>The short version.</strong> If a rule can fix it safely, fix it. If a human has to decide, it goes on the exception list, and the list is a gate that closes only when every row has an answer.</p>

  <h2>What a rule can fix</h2>
  <p>Which of these do you think is riskier to automate: trimming spaces, or standardizing a date? Have an answer before the list.</p>
  <p>Safe to fix by rule, because the intent is not in doubt: leading and trailing spaces, inconsistent capitalization in codes, a date format that is unambiguous, a phone number written with different punctuation, a country name that appears in two spellings.</p>
  <p>Not safe by rule, because you would be guessing at meaning: a date that could be March 4th or April 3rd, a status string nobody recognizes, a blank in a required field, two records that look similar but might be two real people.</p>
  <p>The date one is the trap. 03/04/24 is ambiguous, and a rule that picks a side silently converts thousands of rows to the wrong day. Check the source system's setting, confirm it with a value you can verify independently, then apply the rule.</p>

  <h2>Every rule gets previewed</h2>
  <p>Never run a transformation you have not looked at on real rows. Show the original and the result side by side, twenty rows, and read them.</p>
  <p>This catches the thing that no error message will. A rule that strips a suffix and accidentally invents a value that does not exist will run without complaint on a hundred thousand rows. The only defence is looking at the output. The <a href="../entity-resolution/">entity resolution guide</a> walks a real example where two rounds of preview caught two separate defects in one rule.</p>

  <h2>De-duplication without damage</h2>
  <p>One client becoming two in the new system is the failure users notice first. Merging two real people into one is worse, and harder to undo.</p>
  <p>Work in three passes.</p>
  <p><strong>Exact duplicates first.</strong> Same identifier, same name, same date of birth. These are safe and they are usually the bulk of the problem.</p>
  <p><strong>Near matches second.</strong> Same person, different spelling. These are candidates, not decisions. Build the list, sort it so the most consequential are at the top, and read it.</p>
  <p><strong>Ambiguous cases to the client.</strong> A father and son with the same name at the same address are not a duplicate, and no rule will tell you that. The client knows. Ask.</p>
  <p>Picture two records in front of you: same name, same address, birth dates two years apart. Say what you would do before reading on. The answer is that you do not decide it. That row goes on the exception list.</p>

  <h2>The exception list is a gate, not a document</h2>
  <p>Format it so a non-technical person can work through it. One row per problem, the record identifier, what is wrong in words, the options, and an empty decision column.</p>
  <p>Send it in batches with a date attached. A four hundred row list arriving in one email gets nothing back. Fifty rows with a Friday deadline gets answers.</p>
  <p>The stage closes when every row has a decision. "Leave it for now" is not a decision, it is a deferred problem that resurfaces during <a href="../migration-uat/">user testing</a> when there is no time left. Write down who decided and when, next to each row.</p>

  <h2>What you do not clean</h2>
  <p>Resist fixing things that are merely untidy. A client's data does not have to be good, it has to be acceptable to the target system and true to what they had.</p>
  <p>Cleaning past that point costs time, introduces risk, and changes records the client never asked you to change. When you find genuine quality problems that are out of scope, write them up as a limitation and hand them over at close. That is a gift to the client, not a failure. <a href="../documenting-data-limitations/">Documenting limitations</a> covers how to write them so they are useful.</p>

  <h2>Cheat sheet</h2>
  <table>
    <tr><th>Situation</th><th>Rule or exception</th></tr>
    <tr><td>Trailing spaces, mixed case codes</td><td>Rule</td></tr>
    <tr><td>Unambiguous date reformat</td><td>Rule, after confirming source format</td></tr>
    <tr><td>Ambiguous date</td><td>Exception</td></tr>
    <tr><td>Blank required field</td><td>Exception</td></tr>
    <tr><td>Exact duplicate</td><td>Rule</td></tr>
    <tr><td>Near duplicate</td><td>Exception</td></tr>
    <tr><td>Unrecognized status value</td><td>Exception</td></tr>
    <tr><td>Untidy but valid data</td><td>Leave it, note it at close</td></tr>
  </table>

  <h2>The one habit</h2>
  <p>Preview every rule on real rows before you run it at scale. The data will not tell you when a rule is wrong.</p>
  <p>What is the cleaning rule you have seen do the most damage?</p>""",
        (FELLEGI, WANG, MATTHES))
