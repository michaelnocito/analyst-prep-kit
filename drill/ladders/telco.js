// Ladder: Telco churn, the query half of a published project.
// Built 2026-08-10. The one question this ladder answers by hand:
// a rate is an average of a 1 and 0 column, and that one idea carries the whole analysis.
// Runs against telco-data.js (telco_customers, personas), the same 7,043 customer extract
// behind the Tableau story at public.tableau.com and the write-up on GitHub.
// Every query here was run against that extract before it was written down.
// rows = the row count the learner should get back.

const LADDER = {
  name: "Telco churn, a published project",
  short: "Telco churn",
  blurb: "Start at a list of month to month customers and climb to the four row summary a real churn analysis leads with. Every number you land on is a number that shipped.",
  grain: {
    telco_customers: 'one row = one customer',
    personas: 'one row = one tenure bucket'
  },
  footnote: 'The chart half of this practice is <a href="../viz/?track=telco">Viz Drill, Telco Churn track</a>: same 7,043 customers, same questions, built with shelves instead of clauses. The finished analysis is <a href="https://github.com/michaelnocito/telco-churn-analysis" target="_blank" rel="noopener">on GitHub</a>.',
  drills: [

  { adds: 'List the customers who can leave any month',
    q: 'Which customers are on a month to month contract, and what do they pay?',
    why: 'The base shape: named columns with a filter. Month to month means the customer can walk at the end of any month.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: SELECT, FROM and WHERE' },
    header:
`-- Purpose: List the month-to-month customers with what they pay and whether they left
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT customer_id, persona, monthly_charges, churn
FROM telco_customers
WHERE contract = 'Month-to-month';`,
    pre: "Out of 7,043 customers, is month to month more or less than half of them?",
    rows: 3875 },

  { adds: 'Put the biggest bill on top',
    q: 'Which month to month customers pay the most?',
    why: 'Sort the rows so the biggest bill is on top. The filter has not changed, so the row count cannot either.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: sorting with ORDER BY' },
    header:
`-- Purpose: Rank the month-to-month customers by monthly bill, largest first
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT customer_id, persona, monthly_charges, churn
FROM telco_customers
WHERE contract = 'Month-to-month'
ORDER BY monthly_charges DESC;`,
    pre: "Same 3,875 rows, or fewer?",
    rows: 3875 },

  { adds: 'Cut it to a top ten',
    q: 'What are the ten biggest bills on a month to month contract?',
    why: 'Cut the list to a top ten, which is what a ranking usually ships as.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: LIMIT and top-N lists' },
    header:
`-- Purpose: Top 10 month-to-month customers by monthly bill
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT customer_id, persona, monthly_charges, churn
FROM telco_customers
WHERE contract = 'Month-to-month'
ORDER BY monthly_charges DESC
LIMIT 10;`,
    pre: "How many of those ten do you expect to have churned?",
    rows: 10 },

  { adds: 'Count the whole base instead of listing it',
    q: 'How many customers are there in total?',
    why: 'COUNT(*) counts rows. Dropping the filter puts every customer back, and one number comes back instead of a list.',
    guide: { href: '../guides/sql-count-function/', label: 'Read: COUNT and what it counts' },
    header:
`-- Purpose: Total customers in the base
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT COUNT(*) AS customers
FROM telco_customers;`,
    pre: "One row back, or 7,043?",
    rows: 1 },

  { adds: 'Count each group separately',
    q: 'How big is each customer group?',
    why: 'GROUP BY splits the count into one row per persona. A persona here is just a tenure bucket with a name on it.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: GROUP BY without a fake answer' },
    header:
`-- Purpose: Customer count per persona
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT persona, COUNT(*) AS customers
FROM telco_customers
GROUP BY persona
ORDER BY customers DESC;`,
    pre: "Four groups. Do you expect them to be roughly even?",
    rows: 4 },

  { adds: 'Turn a 1 and 0 column into a churn rate',
    q: 'What share of each group left?',
    why: 'churned is 1 when the customer left and 0 when they stayed. The average of 1s and 0s is the share who left, and multiplying by 100 makes it a percentage. This is the whole trick behind almost every rate you will write.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: aggregates inside a group' },
    header:
`-- Purpose: Churn rate per persona, as a percentage
-- Source:  telco_customers, one row = one customer
-- Note:    churned is 1 if the customer left, 0 if they stayed, so AVG is the rate`,
    sql:
`SELECT persona,
       COUNT(*) AS customers,
       ROUND(AVG(churned) * 100, 1) AS churn_rate
FROM telco_customers
GROUP BY persona
ORDER BY churn_rate DESC;`,
    pre: "Which group do you think leaves most, the newest customers or the oldest?",
    rows: 4 },

  { adds: 'Keep only the groups above a line',
    q: 'Which groups churn at more than 25%?',
    why: 'HAVING filters groups after they are built. WHERE could not do this, because there is no such thing as a single customer with a 28% churn rate.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: why HAVING is not WHERE' },
    header:
`-- Purpose: Personas churning above 25%, the ones worth a retention play
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT persona,
       COUNT(*) AS customers,
       ROUND(AVG(churned) * 100, 1) AS churn_rate
FROM telco_customers
GROUP BY persona
HAVING AVG(churned) > 0.25
ORDER BY churn_rate DESC;`,
    pre: "Four groups go in. How many clear 25%?",
    rows: 2 },

  { adds: 'Ask the same question about contracts',
    q: 'Does the contract someone signed change how often they leave?',
    why: 'Same aggregate, a different grouping column. This is the mechanism behind the persona gap, and it is a bigger spread than the personas themselves.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: choosing what to group by' },
    header:
`-- Purpose: Churn rate by contract type
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT contract,
       COUNT(*) AS customers,
       ROUND(AVG(churned) * 100, 1) AS churn_rate
FROM telco_customers
GROUP BY contract
ORDER BY churn_rate DESC;`,
    pre: "Month to month against two year. Twice the churn, or more?",
    rows: 3 },

  { adds: 'Bring in a column from the other table',
    q: 'What tenure range does each persona actually cover?',
    why: 'The persona name says nothing about how long that is. personas holds the range and the lifecycle order, and a JOIN puts them beside the numbers.',
    guide: { href: '../guides/sql-joins/', label: 'Read: JOINs and what they match on' },
    header:
`-- Purpose: Churn rate per persona, labelled with its tenure range, in lifecycle order
-- Source:  telco_customers, one row = one customer
--          personas, one row = one tenure bucket`,
    sql:
`SELECT p.tenure_range,
       c.persona,
       COUNT(*) AS customers,
       ROUND(AVG(c.churned) * 100, 1) AS churn_rate
FROM telco_customers AS c
JOIN personas AS p ON p.persona = c.persona
GROUP BY p.tenure_range, c.persona, p.lifecycle_order
ORDER BY p.lifecycle_order;`,
    pre: "Still four rows, or does the join multiply them?",
    rows: 4 },

  { adds: 'Write your own buckets',
    q: 'Is this really a first year problem?',
    why: 'CASE builds a column that is not in the table. Two buckets instead of four, and the answer gets blunter: the first year against everything after it.',
    guide: { href: '../guides/sql-case-expression/', label: 'Read: CASE, building a column that is not there' },
    header:
`-- Purpose: Churn in the first year against churn after it
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT CASE WHEN tenure_months <= 12 THEN 'First year' ELSE 'Past the first year' END AS stage,
       COUNT(*) AS customers,
       ROUND(AVG(churned) * 100, 1) AS churn_rate
FROM telco_customers
GROUP BY stage
ORDER BY churn_rate DESC;`,
    pre: "Two rows. How far apart do you think the two rates are?",
    rows: 2 },

  { adds: 'Put three numbers beside each other',
    q: 'Are the customers who leave the cheap ones?',
    why: 'Three aggregates in one query. The answer is no, and the reason is in the third column: they pay nearly full price and buy almost nothing else.',
    guide: { href: '../guides/sql-aliasing/', label: 'Read: naming your columns with AS' },
    header:
`-- Purpose: What each persona pays, what they buy, and how often they leave
-- Source:  telco_customers, one row = one customer`,
    sql:
`SELECT persona,
       ROUND(AVG(monthly_charges), 2) AS avg_monthly,
       ROUND(AVG(add_on_services), 1) AS avg_services,
       ROUND(AVG(churned) * 100, 1) AS churn_rate
FROM telco_customers
GROUP BY persona
ORDER BY churn_rate DESC;`,
    pre: "The group that leaves most. Do you expect them to pay more or less than the loyal group?",
    rows: 4 },

  { adds: 'Finish on the table the project leads with',
    q: 'Who is leaving, and what makes them different?',
    why: 'Everything from the last eleven drills in one query. This is the table the published analysis is built on, and you have just written it.',
    guide: { href: '../guides/sql-teaching-comments/', label: 'Read: commenting a query you will hand over' },
    header:
`-- Purpose: The persona summary the churn analysis leads with
-- Source:  telco_customers, one row = one customer
--          personas, one row = one tenure bucket
-- Note:    ordered by lifecycle, not by churn, so the story reads new to loyal`,
    sql:
`SELECT p.persona,
       p.tenure_range,
       COUNT(*) AS customers,
       ROUND(AVG(c.churned) * 100, 1) AS churn_rate,
       ROUND(AVG(c.monthly_charges), 2) AS avg_monthly,
       ROUND(AVG(c.add_on_services), 1) AS avg_services
FROM telco_customers AS c
JOIN personas AS p ON p.persona = c.persona
GROUP BY p.persona, p.tenure_range, p.lifecycle_order
ORDER BY p.lifecycle_order;`,
    pre: "Read down the churn column. Does it fall the whole way?",
    rows: 4 }

  ]
};
