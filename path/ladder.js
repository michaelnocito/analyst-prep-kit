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
  drills: [
    { adds: 'Ask for three columns',
      q: 'What artists, tracks and audience sizes are in the collection?',
      why: 'The skeleton of every query you will ever write: SELECT the columns, FROM the table.',
      sql:
`SELECT artist, track, listeners
FROM gem_page;`,
      pre: 'The table holds 500 songs. How many rows come back when you have not filtered anything?',
      rows: 500 },

    { adds: 'Keep only the country songs',
      q: 'Which of those songs are country?',
      why: 'WHERE filters rows. The single quotes are how SQL knows country is text, not a column name.',
      sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country';`,
      pre: 'Out of 500 songs, is country more or fewer than 100 of them?',
      rows: 52 },

    { adds: 'Add a second condition',
      q: 'Which country songs have a real audience behind them?',
      why: 'AND stacks conditions. A row now has to pass both to stay in.',
      sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country'
  AND listeners > 20000;`,
      pre: 'You had 52 rows. Adding a condition can only do one thing to that number. Which way?',
      rows: 22 },

    { adds: 'Put the biggest audience on top',
      q: 'Which country song has the largest audience?',
      why: 'ORDER BY sorts what you already have. It never adds or removes a row.',
      sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country'
  AND listeners > 20000
ORDER BY listeners DESC;`,
      pre: 'Still 22 rows, or does sorting change the count?',
      rows: 22 },

    { adds: 'Cut it to a top ten',
      q: 'What are the ten biggest country songs?',
      why: 'LIMIT caps the list after the sort. This is how every top-ten report you will ever ship is built.',
      sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country'
  AND listeners > 20000
ORDER BY listeners DESC
LIMIT 10;`,
      pre: 'Ten rows come back. How many different artists do you expect inside them?',
      rows: 10 },

    { adds: 'Count what you are working with',
      q: 'How many country songs are there, and how many different artists made them?',
      why: 'A query always hands back a table, even when the answer is two numbers. Comparing the two tells you one artist can hold several songs.',
      sql:
`SELECT COUNT(*) AS total_rows,
       COUNT(DISTINCT artist) AS artists
FROM gem_page
WHERE genre = 'country';`,
      pre: 'You know there are 52 country songs. Will there be 52 artists too?',
      rows: 1 },
  ],

  // ── STEP 3: the lesson handoff ────────────────────────────────────────────
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
