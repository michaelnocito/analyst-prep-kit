// Unit 1 typing ladder for the rotation trial.
// Six rungs, and nothing past LIMIT: every clause here is taught in Unit 1 of the SQL kit
// (SELECT & FROM, WHERE, ORDER BY & LIMIT, and "a query returns a table").
//
// Every query below was run against the baked drill database (drill/data.js, exported from
// music_gems.db) and the row counts are what SQLite actually returned.

const LAP = {
  unit: 'Unit 1: First Queries',
  lesson: 'SELECT, WHERE, ORDER BY, LIMIT',

  // ── STEP 1: the primer ────────────────────────────────────────────────────
  // Six lines. Only what someone needs to type rung 1 without guessing.
  primer: [
    ['A database is tables', 'A table is rows and columns, like a spreadsheet tab. This one has a table called <code>gem_page</code>, and one row in it is one song.'],
    ['SELECT names the columns', 'You list the columns you want back, separated by commas.'],
    ['FROM names the table', 'You say which table to read them from.'],
    ['WHERE keeps some rows', 'It checks every row against a condition and only keeps the ones where it is true. Text goes in single quotes: <code>WHERE genre = \'country\'</code>.'],
    ['ORDER BY sorts the rows', '<code>DESC</code> puts the biggest number on top. <code>ASC</code> is smallest first, and it is what you get if you say nothing.'],
    ['LIMIT caps the list', '<code>LIMIT 10</code> hands back ten rows instead of five hundred.'],
  ],

  // ── STEP 2: the typing rungs ──────────────────────────────────────────────
  // FOUR rungs, cut down from six on 2026-08-01 (Mike: short enough that someone finishes
  // wanting one more). One rung per read in step 3, so the typing and the lessons line up
  // exactly: SELECT & FROM, WHERE, ORDER BY & LIMIT, and a query always returns a table.
  //
  // What the cut dropped: the standalone AND rung, and the standalone ORDER BY rung that
  // was followed by a LIMIT rung. ORDER BY and LIMIT are one lesson and one idea — a top
  // ten — so they are one rung. AND survives in the WHERE lesson's notes and in the mini
  // quiz, which is where a learner meets it next.
  // `given` is the answerable-from-the-screen rule (REAL_TEST.md 5d): every decision the
  // check compares against is stated in words, on the screen, at the moment of the ask.
  // A business question does not carry its own thresholds, sort order or caps, and a learner
  // who cannot see them is being asked to guess and then told they were wrong.
  drills: [
    { adds: 'Ask for three columns',
      q: 'What artists, tracks and audience sizes are in the collection?',
      given: ['The table is <code>gem_page</code>',
              'Every song in the table, nothing filtered out'],
      why: 'The skeleton of every query you will ever write: SELECT the columns, FROM the table.',
      // `did` and `matters` are what the celebration popup carries. What you just did, in
      // words, and why a working analyst cares. Not a restatement of the syntax.
      did: 'You pulled three named columns out of a table of 500 songs.',
      matters: 'Naming the columns you want, instead of asking for all of them, is what makes a query readable to the next person and what stops it breaking when somebody adds a column to the table.',
      sql:
`SELECT artist, track, listeners
FROM gem_page;`,
      pre: 'The table holds 500 songs. How many rows come back when you have not filtered anything?',
      rows: 500 },

    { adds: 'Keep only the country songs',
      q: 'Which of those songs are country?',
      given: ['The table is <code>gem_page</code>',
              "Country means the <code>genre</code> column is exactly <code>country</code>"],
      why: 'WHERE filters rows. The single quotes are how SQL knows country is text, not a column name.',
      did: 'You cut 500 songs down to the country ones, and the table told you how many there were.',
      matters: 'WHERE is the clause you will use more than any other. Almost every question anyone brings you is a filter wearing a business question: this region, this quarter, these customers.',
      sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country';`,
      pre: 'Out of 500 songs, is country more or fewer than 100 of them?',
      rows: 52 },

    { adds: 'Sort them and cut to a top ten',
      q: 'What are the ten biggest country songs?',
      given: ['The table is <code>gem_page</code>',
              "Country means the <code>genre</code> column is exactly <code>country</code>",
              'Biggest means the most <code>listeners</code>, largest first',
              'Ten rows, no more'],
      why: 'ORDER BY sorts what you already have, then LIMIT caps it. That order matters: cap first and you would cap before sorting. This is how every top-ten report you will ever ship is built.',
      did: 'You put the biggest audience on top and kept the first ten rows.',
      matters: 'Every top-ten report, every leaderboard and every "show me the latest" is this exact shape. The order of the two clauses is the part people get wrong: sort first, cap second, or you cap a pile of unsorted rows and ship the wrong ten.',
      sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country'
ORDER BY listeners DESC
LIMIT 10;`,
      pre: 'You had 52 rows. How many come back now?',
      rows: 10 },

    { adds: 'Count what you are working with',
      q: 'How many country songs are there, and how many different artists made them?',
      given: ['The table is <code>gem_page</code>',
              "Country means the <code>genre</code> column is exactly <code>country</code>",
              // Run 008: this drill needs three words the primer never taught (COUNT,
              // DISTINCT, AS) and step 3 covers the query, so a learner was being asked to
              // retrieve syntax that had no source on the screen. Naming the words satisfies
              // 5d without writing the line: assembling them is still the work.
              '<code>COUNT(*)</code> counts rows; <code>COUNT(DISTINCT ...)</code> counts each value once',
              // The old wording said "Name the two numbers total_rows and artists", which
              // read exactly like the "Bring back" column lists on drills 1 to 3. The likely
              // first attempt was SELECT total_rows, artists — a real column that does not
              // exist. Say plainly that these are names being created.
              '<code>total_rows</code> and <code>artists</code> are names you create with <code>AS</code>, not columns in the table',
              'Different artists means each artist counted once'],
      why: 'A query always hands back a table, even when the answer is two numbers. Comparing the two tells you one artist can hold several songs.',
      did: 'You got one row back holding two numbers: how many country songs there are, and how many different artists made them.',
      matters: 'Counting rows against counting distinct values is how you find out what one row of a table actually represents. Get that wrong and every number you report afterwards is wrong in a way nobody notices, because the query still runs.',
      sql:
`SELECT COUNT(*) AS total_rows,
       COUNT(DISTINCT artist) AS artists
FROM gem_page
WHERE genre = 'country';`,
      pre: 'You know there are 52 country songs. Will there be 52 artists too?',
      rows: 1 },
  ],

  // ── STEP 4: what you did ──────────────────────────────────────────────────
  // One block per NEW thing the four queries introduced, and nothing else. Short enough to
  // read standing up. Each one says what the words do, why the query worked, and where a
  // working person actually meets it, across industries and roles rather than in the
  // abstract. This replaced a four-read lesson step that sat between the two typing passes.
  concepts: [
    { name: 'SELECT and FROM',
      does: 'SELECT names the columns you want back. FROM names the table to read them from. Every query you write starts with these two.',
      worked: 'You asked for three columns out of a table of 500 songs and got three columns back. Nothing else came with them, because you did not ask for anything else.',
      where: [
        ['Marketing analyst', 'pulling campaign names and spend out of an ad platform export'],
        ['Nurse manager', 'pulling patient IDs and admission dates for a shift handover'],
        ['Warehouse planner', 'pulling SKUs and stock counts before a reorder']
      ] },

    { name: 'WHERE',
      does: 'WHERE checks every row against a condition and keeps only the rows where it is true. Text values go in single quotes, which is how SQL knows country is a word and not a column name.',
      worked: 'The 500 rows became 52. The table did not change; you just stopped asking for the rest of it.',
      where: [
        ['Retail analyst', 'narrowing to one region before a quarterly review'],
        ['Claims analyst', 'pulling only the denied claims out of a year of submissions'],
        ['Recruiter', 'pulling only the roles still open']
      ] },

    { name: 'ORDER BY and LIMIT',
      does: 'ORDER BY sorts the rows you already have. LIMIT caps how many come back. The order of the two is fixed: sort first, cap second, or you cap a pile of unsorted rows.',
      worked: 'Sorting put the biggest audience on top without adding or removing a single row, then LIMIT kept the first ten of them.',
      where: [
        ['Sales operations', 'the top ten accounts by revenue, every Monday morning'],
        ['Support lead', 'the ten oldest tickets still open'],
        ['Media buyer', 'the worst-performing ad sets, worst first, so the cuts are obvious']
      ] },

    { name: 'COUNT, DISTINCT and AS',
      does: 'COUNT(*) counts rows. COUNT(DISTINCT column) counts each different value once. AS gives the number you produced a name, because it is not a column that exists in the table.',
      worked: 'One row came back holding two numbers. A query always hands back a table, even when the answer is a single figure.',
      where: [
        ['Any analyst, first day on a new table', 'counting rows against counting distinct IDs is how you find out what one row of it actually represents'],
        ['Ecommerce', 'how many orders against how many customers, which tells you repeat rate'],
        ['Healthcare', 'how many visits against how many patients, which is a completely different number and a completely different story']
      ] },
  ],

  // ── unused since 2026-08-01 ───────────────────────────────────────────────
  // Kept because the checkpoint work will want them back. The round no longer has a lesson
  // handoff step or a mini quiz.
  // The existing kit lessons, unchanged. Deep links open the lesson directly.
  lessons: [
    { id: 1,   title: 'SELECT & FROM',                    sub: 'Pull columns from a table' },
    { id: 2,   title: 'WHERE',                            sub: 'Filter rows by condition' },
    { id: 104, title: 'A Query Returns a Table; NULL = Unknown', sub: 'The shape that comes back, and what a blank cell really means' },
    { id: 3,   title: 'ORDER BY & LIMIT',                 sub: 'Sort and cap your results' },
  ],

  // ── STEP 4: the mini quiz ─────────────────────────────────────────────────
  // Four questions, one per lesson, taken from the kit's own lesson quizzes so the
  // trial is not inventing a second set of answers to keep in sync.
  quiz: [
    { q: 'Which clause tells SQL which table to read from?',
      opts: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'], ans: 1,
      exp: 'FROM names the table. SELECT names the columns you want back.' },

    { q: 'You want country songs with more than 20,000 listeners. Which line does that?',
      opts: ["WHERE genre = 'country' AND listeners > 20000",
             "WHERE genre = country AND listeners > 20000",
             "FILTER genre = 'country' AND listeners > 20000",
             "WHERE genre = 'country' OR listeners > 20000"], ans: 0,
      exp: 'Text values need single quotes, and AND means a row has to pass both conditions. OR would let a loud pop song through.' },

    { q: 'You run SELECT COUNT(*) and get 500. You run SELECT COUNT(album) and get 480. What does that tell you?',
      opts: ['The query has a bug',
             '20 rows have a NULL value in the album column',
             'album has 20 duplicate values',
             'You should use SUM instead'], ans: 1,
      exp: 'COUNT(*) counts every row. COUNT(column) skips NULLs. A gap of 20 means 20 rows have no album recorded.' },

    { q: 'Get the 10 oldest orders. Which query is correct?',
      opts: ['SELECT * FROM orders ORDER BY order_date ASC LIMIT 10;',
             'SELECT * FROM orders ORDER BY order_date DESC LIMIT 10;',
             'SELECT * FROM orders LIMIT 10 ORDER BY order_date;',
             'SELECT TOP 10 * FROM orders ORDER BY order_date;'], ans: 0,
      exp: 'ASC sorts oldest first. LIMIT has to come after ORDER BY, or you cap the rows before they are sorted.' },
  ],
};
