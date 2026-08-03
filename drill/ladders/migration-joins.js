// Ladder: joins, framed as a data migration. Junior analyst on a migration team.
// Every query here was run against the baked tables before it was written down.
// rows = the row count the learner should get back.
//
// The spine is INNER and LEFT, because those two carry almost all migration work:
// INNER answers "who made it across", LEFT answers "who did not". RIGHT, FULL, CROSS
// and the self join each get one rung so none of them is a stranger later.
//
// Drills 6 and 7 are the pair that has to land. Six is the wrong join, run on purpose:
// 40 customers come back as 78 rows and nothing errors. Seven is the same question
// asked correctly. That trap is shown once, here, and never repeated.

const LADDER = {
  name: "JOINs, a customer migration",
  short: "JOINs, a data migration",
  blurb: "Two systems, one moving day. Reconcile the old customer list against the new one, find what did not make it, and put a number on what it is worth.",
  grain: {
    legacy_customer: 'one row = one customer in the old system',
    new_customer:    'one row = one customer record in the new system',
    legacy_order:    'one row = one order in the old system',
    contact_note:    'one row = one support contact, several per customer',
    migration_wave:  'one row = one cutover wave'
  },
  footnote: 'The reading half of this practice is the migration series: ' +
            '<a href="../guides/what-is-data-migration/">what a migration is</a> &middot; ' +
            '<a href="../guides/migration-profiling/">profiling the old system</a> &middot; ' +
            '<a href="../guides/migration-pitfalls/">where migrations go wrong</a>.',
  drills: [

  { adds: 'Look at what the old system is handing over',
    q: 'Who is in the old customer system, and what state are their accounts in?',
    why: 'The base shape, and the number every drill after it is measured against.',
    header:
`-- Purpose: The full customer list coming out of the legacy system before cutover
-- Source:  legacy_customer, one row = one customer in the old system`,
    sql:
`SELECT legacy_id, customer_name, region, account_status
FROM legacy_customer;`,
    pre: "Write the row count down. Every drill after this one is compared to it.",
    rows: 40 },

  { adds: 'Match them to the new system with an INNER JOIN',
    q: 'Which customers made it across into the new system?',
    why: 'INNER JOIN keeps only the rows that matched on both sides. That is exactly the question "who landed".',
    header:
`-- Purpose: Legacy customers that have a matching record in the new system
-- Source:  legacy_customer joined to new_customer, one row = one migrated customer
-- Note:    the join key is legacy_id, which the new system carries forward`,
    sql:
`SELECT c.legacy_id, c.customer_name, c.region, n.new_id
FROM legacy_customer AS c
JOIN new_customer AS n ON n.legacy_id = c.legacy_id;`,
    pre: "Forty went in. Do you get forty back?",
    rows: 34 },

  { adds: 'Keep everyone with a LEFT JOIN',
    q: 'What does the same list look like if nobody is allowed to disappear?',
    why: 'LEFT JOIN keeps every row from the left table whether it matched or not. The unmatched ones come back with NULL on the right.',
    header:
`-- Purpose: Every legacy customer, with the new system record beside it where there is one
-- Source:  legacy_customer joined to new_customer, one row = one legacy customer
-- Note:    a NULL new_id means that customer has no record in the new system`,
    sql:
`SELECT c.legacy_id, c.customer_name, c.region, n.new_id
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id;`,
    pre: "One word changed. How many rows come back now?",
    rows: 40 },

  { adds: 'Filter down to the ones that did not make it',
    q: 'Who failed to migrate?',
    why: 'LEFT JOIN plus IS NULL on the right side is the miss list. This one pattern is most of a reconciliation job.',
    header:
`-- Purpose: Legacy customers with no record in the new system after the load
-- Source:  legacy_customer joined to new_customer, one row = one missing customer
-- Note:    IS NULL on new_id only means anything after a LEFT JOIN, never after an INNER one`,
    sql:
`SELECT c.legacy_id, c.customer_name, c.region, c.account_status
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
WHERE n.new_id IS NULL;`,
    pre: "Forty legacy rows, thirty four matched. How many rows should this return?",
    rows: 6 },

  { adds: 'Report the reconciliation as one line',
    q: 'How many went in, how many landed, how many are missing?',
    why: 'COUNT(*) counts rows, COUNT(column) skips NULLs. Put them side by side on a LEFT JOIN and you have a reconciliation.',
    header:
`-- Purpose: Cutover reconciliation counts for the customer table
-- Source:  legacy_customer joined to new_customer, one row = the whole load
-- Note:    COUNT(*) counts every row, COUNT(n.new_id) skips the NULLs, so the gap is the misses`,
    sql:
`SELECT COUNT(*) AS legacy_rows,
       COUNT(n.new_id) AS migrated_rows,
       COUNT(*) - COUNT(n.new_id) AS missing_rows
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id;`,
    pre: "One row back, three numbers on it. Name all three before you run it.",
    rows: 1 },

  { adds: 'The wrong join. Add support history and watch the count break',
    q: 'Same customer list, with how they last contacted support. What could go wrong?',
    why: 'Nothing errors here. The join is valid SQL and the answer is wrong, because contact_note holds several rows per customer and every one of them multiplies its customer.',
    header:
`-- Purpose: Legacy customers with their support contact channel
-- Source:  legacy_customer joined to new_customer and contact_note
-- Note:    RUN THIS AND READ THE COUNT. The grain is no longer one row per customer`,
    sql:
`SELECT c.legacy_id, c.customer_name, n.new_id, t.channel
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
LEFT JOIN contact_note AS t ON t.legacy_id = c.legacy_id;`,
    pre: "There are still only 40 customers. How many rows do you think come back?",
    rows: 78 },

  { adds: 'The fix. Put the grain back',
    q: 'The same question, asked so the answer is one row per customer again.',
    why: 'The join type was never the bug. Joining to a table that holds several rows per customer is what moved the grain, so you collapse it back with GROUP BY. Check that the count is 40 again.',
    header:
`-- Purpose: Legacy customers with a count of their support contacts
-- Source:  legacy_customer joined to new_customer and contact_note, one row = one legacy customer
-- Note:    GROUP BY puts the grain back at one row per customer after the one to many join`,
    sql:
`SELECT c.legacy_id, c.customer_name, n.new_id, COUNT(t.note_id) AS notes
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
LEFT JOIN contact_note AS t ON t.legacy_id = c.legacy_id
GROUP BY c.legacy_id, c.customer_name, n.new_id;`,
    pre: "Back to 40 rows, or still 78?",
    rows: 40 },

  { adds: 'Aggregate first, then join',
    q: 'What is each customer worth, and how many orders are they bringing over?',
    why: 'The other way to survive a one to many table: total it in a CTE first, so what you join to is already one row per customer. This is the habit that stops the last drill happening by accident.',
    header:
`-- Purpose: Every legacy customer with their order count and lifetime value
-- Source:  legacy_customer joined to new_customer and a per customer order total
-- Note:    order_totals is already one row per customer, so joining to it cannot change the grain`,
    sql:
`WITH order_totals AS (
  SELECT legacy_id, COUNT(*) AS orders, SUM(amount) AS lifetime_value
  FROM legacy_order
  GROUP BY legacy_id
)
SELECT c.legacy_id, c.customer_name, n.new_id,
       COALESCE(o.orders, 0) AS orders,
       ROUND(COALESCE(o.lifetime_value, 0), 2) AS lifetime_value
FROM legacy_customer AS c
LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
LEFT JOIN order_totals AS o ON o.legacy_id = c.legacy_id;`,
    pre: "Some customers never ordered. Does COALESCE give them a zero or drop them?",
    rows: 40 },

  { adds: 'Turn the question around with a RIGHT JOIN',
    q: 'Are there records in the new system that the old system never had?',
    why: 'RIGHT JOIN keeps every row from the table on the right. It is a LEFT JOIN with the tables the other way round, and it is how you catch records the migration invented.',
    header:
`-- Purpose: New system customer records with no matching legacy record
-- Source:  legacy_customer joined to new_customer, one row = one unexplained new record
-- Note:    these are not migration failures, they are records the new system created on its own`,
    sql:
`SELECT n.new_id, n.customer_name, n.region, c.legacy_id
FROM legacy_customer AS c
RIGHT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
WHERE c.legacy_id IS NULL;`,
    pre: "The new system holds 37 records and 34 of them matched. How many are left?",
    rows: 3 },

  { adds: 'Show both failures at once with a FULL OUTER JOIN',
    q: 'Can I hand my lead one table that covers every mismatch in both directions?',
    why: 'FULL OUTER JOIN keeps everything from both sides. With a CASE on top it becomes the single status table a migration lead actually asks for.',
    header:
`-- Purpose: Every customer record on either side of the migration, tagged with its outcome
-- Source:  legacy_customer joined to new_customer, one row = one customer on either side
-- Note:    34 matched plus 6 that did not migrate plus 3 with no legacy record`,
    sql:
`SELECT c.legacy_id,
       n.new_id,
       CASE WHEN n.new_id IS NULL THEN 'did not migrate'
            WHEN c.legacy_id IS NULL THEN 'no legacy record'
            ELSE 'matched' END AS outcome
FROM legacy_customer AS c
FULL OUTER JOIN new_customer AS n ON n.legacy_id = c.legacy_id
ORDER BY outcome, c.legacy_id;`,
    pre: "Add up the three groups in the note above. That is your row count.",
    rows: 43 },

  { adds: 'Build a complete grid with a CROSS JOIN',
    q: 'What does the cutover plan look like with every region in every wave, including the empty ones?',
    why: 'CROSS JOIN pairs every row on the left with every row on the right. Used on purpose it is how you build a reporting grid with no missing cells.',
    header:
`-- Purpose: The full region by wave grid for the cutover plan, empty cells included
-- Source:  the distinct regions crossed with migration_wave, one row = one region in one wave
-- Note:    CROSS JOIN has no ON clause, which is why an accidental one explodes a query`,
    sql:
`SELECT r.region, w.wave_no, w.wave_name, w.cutover_date
FROM (SELECT DISTINCT region FROM legacy_customer) AS r
CROSS JOIN migration_wave AS w
ORDER BY r.region, w.wave_no;`,
    pre: "Four regions, three waves. How many rows?",
    rows: 12 },

  { adds: 'Join a table to itself to find duplicates',
    q: 'Is the same person in the old export twice under two different ids?',
    why: 'A self join compares a table to itself. Matching on email and keeping only the higher id gives each duplicate pair once instead of twice.',
    header:
`-- Purpose: Customers entered twice in the legacy export under two ids
-- Source:  legacy_customer joined to itself on email, one row = one duplicate pair
-- Note:    b.legacy_id > a.legacy_id stops every pair coming back a second time reversed`,
    sql:
`SELECT a.legacy_id, b.legacy_id AS duplicate_of, a.email, a.customer_name
FROM legacy_customer AS a
JOIN legacy_customer AS b ON b.email = a.email AND b.legacy_id > a.legacy_id;`,
    pre: "Drop the second condition and the count doubles. Why?",
    rows: 2 },

  { adds: 'Finish on the number the meeting is about',
    q: 'Which region lost the most, and what is the missing revenue worth?',
    why: 'The payoff. A LEFT JOIN reconciliation, an aggregate joined at the right grain, and a CASE that turns the misses into money. This is the query that goes in the status email.',
    header:
`-- Purpose: Migration success rate and unmigrated revenue by region
-- Source:  recon, one row = one region
-- Note:    value_at_risk is lifetime order value belonging to customers that did not migrate`,
    sql:
`WITH order_totals AS (
  SELECT legacy_id, SUM(amount) AS lifetime_value
  FROM legacy_order
  GROUP BY legacy_id
),
recon AS (
  SELECT c.region, c.legacy_id, n.new_id,
         COALESCE(o.lifetime_value, 0) AS lifetime_value
  FROM legacy_customer AS c
  LEFT JOIN new_customer AS n ON n.legacy_id = c.legacy_id
  LEFT JOIN order_totals AS o ON o.legacy_id = c.legacy_id
)
SELECT region,
       COUNT(*) AS legacy_customers,
       COUNT(new_id) AS migrated,
       COUNT(*) - COUNT(new_id) AS missing,
       ROUND(100.0 * COUNT(new_id) / COUNT(*), 1) AS pct_migrated,
       ROUND(SUM(CASE WHEN new_id IS NULL THEN lifetime_value ELSE 0 END), 2) AS value_at_risk
FROM recon
GROUP BY region
ORDER BY value_at_risk DESC;`,
    pre: "Four regions. Will the region with the most misses also hold the most money?",
    rows: 4 }

  ]
};
