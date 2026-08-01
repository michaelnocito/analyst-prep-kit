// Unit 1 lesson content for the round, held here rather than borrowed at runtime.
//
// WHY IT IS COPIED. The round used to open `/sql/#lesson-1` in a new tab. That pushed the
// learner out of a five-step round and into a 4,441px kit page with its own progress, its
// own nav and its own idea of where they were. Mike's call, 2026-08-01: keep them in the
// app. The kit's Unit 1 progress and this round's progress are now independent, which is
// the point — finishing a round must not mark kit lessons done, and vice versa.
//
// SOURCE OF TRUTH FOR THE TEACHING: `sql/index.html`, the LESSONS array, entries
// id 1, 2, 104 and 3. Copied 2026-08-01. If the kit's Unit 1 wording changes, this file is
// the second place to change. The drift is real and it is deliberate; the alternative was
// sending a first-timer into the full kit to find their way back.
//
// What is copied: story, intro, the read-aloud walkthrough, notes, the result-shape
// picture, the ordering note, the close and the unlock. What is NOT copied: each lesson's
// quiz, Parsons problem and build question. The round has its own mini quiz in ladder.js,
// drawn from these same lessons, and a second copy of the drills would be three ways to
// answer the same four questions.

const LESSON_TEXT = [
  {
    id: 1,
    title: 'SELECT & FROM',
    sub: 'Pull columns from a table',
    story: "You know the mental model: databases are tables, rows have a grain, keys connect tables, queries return tables. Now write your first actual question. SELECT names the columns you want; FROM names the table to get them from. That's the whole skeleton. Every query you'll ever write starts with these two words.",
    intro: 'A SELECT query is like ordering at a deli counter: you name what you want (the columns) and which counter to get it from (the table). Every SQL query starts with <code>SELECT</code> to choose columns and <code>FROM</code> to name the table. Think of it as: &ldquo;Give me <em>these columns</em> from <em>this table</em>.&rdquo;',
    ral: {
      sql: 'SELECT name, email\nFROM customers;',
      say: 'Give me the name and email columns from the customers table.',
      lines: [
        ['SELECT', 'display — start the query by listing the columns you want back'],
        ['name, email', 'the two columns to display, separated by a comma'],
        ['FROM', 'pull from — names the table to read'],
        ['customers', 'the table holding one row per customer'],
        [';', 'ends the statement']
      ]
    },
    notes: 'Use <code>SELECT *</code> to grab every column — handy for exploration, but name columns explicitly in real queries.',
    viz: {
      columns: ['name', 'email'],
      rows: [['Maya Chen', 'maya@co.com'], ['Jordan Lee', 'jordan@co.com'], ['Sam Rivera', 'sam@co.com'], ['Alex Kim', 'alex@co.com']],
      caption: 'Two columns, one row per customer — exactly the columns you named in SELECT.'
    },
    compare: 'The order is fixed: SELECT always leads, FROM always follows. Even though you think of the table first, the query names the columns before the source.',
    close: "You can pull any column from any table. Every query you'll ever write starts with exactly this.",
    unlock: 'Naming columns explicitly instead of SELECT * is a production habit — it makes queries self-documenting and immune to breaking when someone later adds a column to the table.'
  },
  {
    id: 2,
    title: 'WHERE',
    sub: 'Filter rows by condition',
    story: "You can pull columns from a table. Your manager's first real question isn't 'show me everything' — it's 'show me just the West region.' WHERE is the filter: it checks a condition row by row and only returns the rows where it's true. SELECT tells SQL what to show; WHERE tells it which rows.",
    intro: 'WHERE is like a guest list at the door — only the rows whose name is on it (the condition is true) get in. <code>WHERE</code> filters which rows come back. Only rows where the condition is TRUE are returned.',
    ral: {
      sql: "SELECT name\nFROM customers\nWHERE status = 'active';",
      say: "Give me the names of customers whose status is 'active'.",
      lines: [
        ['SELECT name', 'display the name column'],
        ['FROM customers', 'pull from the customers table'],
        ["WHERE status = 'active'", 'keep only rows where the status column equals the text \'active\''],
        ["= 'active'", 'single quotes wrap text values; SQL uses = for equality, not ==']
      ]
    },
    notes: 'Common operators: <code>=</code> <code>!=</code> <code>&gt;</code> <code>&lt;</code> <code>BETWEEN</code> <code>LIKE</code> <code>IN</code>. Combine with <code>AND</code> / <code>OR</code>.',
    viz: {
      columns: ['name'],
      rows: [['Maya Chen'], ['Jordan Lee'], ['Alex Kim']],
      caption: "Only rows where status = 'active' survive the WHERE filter — Sam (inactive) and Taylor (pending) drop out."
    },
    compare: 'WHERE goes after FROM, not before it. The clause order is always SELECT → FROM → WHERE → ORDER BY. Swapping WHERE and FROM is a syntax error.',
    close: 'You can filter to exactly the rows you need. WHERE is the single most-used clause in real analyst work.',
    unlock: 'WHERE short-circuits as soon as a row fails the condition — the database stops evaluating that row immediately. Putting the most selective condition first can speed up queries on large tables, a small habit that matters at scale.'
  },
  {
    id: 104,
    title: 'A Query Returns a Table; NULL = Unknown',
    sub: 'The output shape of every SQL query — and the special case of missing data.',
    story: "Keys connect the tables. One more idea before you query: SQL always returns a result set shaped like a table — even a single number is wrapped in a 1×1 table. And empty cells in a database aren't blank — they're NULL, which means 'unknown.' NULL is not zero and not empty string. It has its own comparison rules, and ignoring them causes silent wrong totals.",
    intro: "Every SQL query returns a table — rows and columns, even if it's one row or one column. That's the contract. And when a value is missing or unknown, databases store NULL — a special sentinel meaning 'we don't know.' NULL is NOT zero. NULL is NOT an empty string. NULL doesn't equal NULL. Comparisons with NULL require <code>IS NULL</code> / <code>IS NOT NULL</code>, not <code>= NULL</code>.",
    ral: {
      sql: 'SELECT name, revenue\nFROM orders\nWHERE region IS NULL;',
      say: 'Show me every order where the region is unknown (NULL).',
      lines: [
        ['SELECT name, revenue', 'display the name and revenue columns'],
        ['FROM orders', 'pull from the orders table'],
        ['WHERE region IS NULL', 'keep only rows where region is unknown — IS NULL is the only test that works; = NULL never matches, because NULL equals nothing'],
        ['NULL', "means 'unknown' — not zero, not blank; NULL + anything = NULL"],
        ['COUNT(*) vs COUNT(col)', 'COUNT(*) counts every row; COUNT(col) skips NULLs — the gap is your missing-value count']
      ]
    },
    notes: 'COUNT(*) and COUNT(column) return different numbers when a column has NULLs. COUNT(*) counts every row; COUNT(revenue) skips rows where revenue is NULL. If your totals seem low, check for NULLs with SELECT COUNT(*) vs SELECT COUNT(revenue) — a difference tells you how many NULL rows there are.',
    viz: {
      columns: ['order_id', 'region', 'revenue', 'COUNT(*) sees this row?', 'COUNT(revenue) sees this?'],
      rows: [['1001', 'West', '150', 'yes ✓', 'yes ✓'], ['1002', 'NULL', '200', 'yes ✓', 'yes ✓'], ['1003', 'East', 'NULL', 'yes ✓', 'no — NULL skipped']],
      caption: "COUNT(*) counts all 3 rows. COUNT(revenue) counts only 2 (skips the NULL). COUNT(region) counts only 2 (skips the NULL row 1002). These distinctions change your totals silently if you're not expecting them."
    },
    compare: "IS NULL is the only correct test for missing values. The common mistake is writing = NULL — but NULL means 'unknown', so NULL = NULL evaluates to unknown (false), not true. IS NULL bypasses that.",
    close: 'You know what SQL returns and how NULL behaves — that prevents a whole class of silent wrong answers.',
    unlock: "NULL propagation is the most silent source of wrong totals in SQL. Once you know that NULL + anything = NULL and that COUNT(col) skips NULLs, you'll catch calculation errors that fool most junior analysts."
  },
  {
    id: 3,
    title: 'ORDER BY & LIMIT',
    sub: 'Sort and cap your results',
    story: 'You can filter rows. Your manager wants the highest-revenue orders first, not whatever order the database stored them in. ORDER BY sorts the result — ASC for smallest to largest, DESC for largest to smallest. LIMIT caps how many rows come back. Two small clauses that make query output readable.',
    intro: 'ORDER BY and LIMIT are like a leaderboard: sort everyone by score, then show just the top few. <code>ORDER BY</code> sorts results. <code>LIMIT</code> caps how many rows come back — essential for large tables.',
    ral: {
      sql: 'SELECT name, order_date\nFROM orders\nORDER BY order_date DESC\nLIMIT 5;',
      say: 'Give me the name and order date from orders, sorted by most recent first, and just the top 5 results.',
      lines: [
        ['SELECT name, order_date', 'display the name and order date columns'],
        ['FROM orders', 'pull from the orders table'],
        ['ORDER BY order_date DESC', 'sort by order date — DESC = descending, newest first'],
        ['LIMIT 5', 'return only the first 5 rows after sorting']
      ]
    },
    notes: '<code>ASC</code> (ascending, A→Z, 0→9) is the default. <code>DESC</code> reverses it. Always use LIMIT when exploring large data.',
    viz: {
      columns: ['name', 'order_date'],
      rows: [['Maya Chen', '2026-05-30'], ['Alex Kim', '2026-05-28'], ['Jordan Lee', '2026-05-21'], ['Sam Rivera', '2026-05-14'], ['Maya Chen', '2026-05-02']],
      caption: 'Sorted newest-first by order_date, then LIMIT caps it at the top 5 rows.'
    },
    compare: "LIMIT must come after ORDER BY, not before it. The sort happens first, then the cap is applied. Swapping them would cap before sorting — you'd get a random 3 rows sorted, not the 3 most recent.",
    close: "You can sort results and cap them to a useful size. ORDER BY + LIMIT is behind every leaderboard, top-N report, and 'show me the latest' query.",
    unlock: 'NULL values sort to the end in ASC and the beginning in DESC in most databases. If your top-10 results look wrong, check whether NULLs are sneaking in before real values.'
  }
];
