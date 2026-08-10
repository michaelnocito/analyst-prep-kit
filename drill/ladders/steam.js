// Ladder: Steam hidden gems, the funnel that finds 175 games.
// Built 2026-08-10. The one question this ladder answers by hand:
// a definition is a stack of WHERE conditions, and you can watch the count fall through it.
// Runs against steam-data.js (steam_games, catalog_totals).
// Every query here was run against that data before it was written down.
// rows = the row count the learner should get back.
//
// The table holds the 4,892 games that clear the 2,000 review bar, not the whole catalog,
// because 82,956 rows is not a thing to hand a browser. Drill 4 says so out loud rather
// than letting anybody believe they are counting all of Steam, and drill 11 joins the real
// catalog total back in so the headline percentage is the real one.

const LADDER = {
  name: "Steam hidden gems, the funnel",
  short: "Steam gems",
  blurb: "Start at 4,892 well reviewed games and watch three conditions cut them to the 175 that are genuinely hidden. Every count on the way down is a real one.",
  grain: {
    steam_games: 'one row = one game with 2,000+ reviews',
    catalog_totals: 'one row, the counts for the whole catalog'
  },
  footnote: 'The finished analysis, the 125,000 game dataset and the data bug that had to be fixed first are <a href="https://github.com/michaelnocito/steam-hidden-gems" target="_blank" rel="noopener">on GitHub</a>. The 175 picks are browsable at <a href="https://michaelnocito.github.io/steam-hidden-gems-list/" target="_blank" rel="noopener">the list site</a>.',
  drills: [

  { adds: 'List the games somebody could afford',
    q: 'Which well reviewed games cost twenty dollars or less?',
    why: 'The base shape: named columns with a filter. Price is the easiest of the three bars to reason about, so it goes first.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: SELECT, FROM and WHERE' },
    header:
`-- Purpose: List the games at $20 or less, with their rating and review count
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT name, price, total_reviews, pct_positive
FROM steam_games
WHERE price <= 20;`,
    pre: "Out of 4,892 games, is most of the list under twenty dollars?",
    rows: 4578 },

  { adds: 'Put the best reviewed on top',
    q: 'Which of those games do players rate highest?',
    why: 'Sort by the rating rather than the price. The filter has not changed, so the row count cannot either.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: sorting with ORDER BY' },
    header:
`-- Purpose: Rank the affordable games by how positive their reviews are
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT name, price, total_reviews, pct_positive
FROM steam_games
WHERE price <= 20
ORDER BY pct_positive DESC;`,
    pre: "Same 4,578 rows, or fewer?",
    rows: 4578 },

  { adds: 'Cut it to a shortlist',
    q: 'What are the fifteen best reviewed cheap games?',
    why: 'Cut the list to the length a person would actually read. Fifteen is the shape this analysis ships as.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: LIMIT and top-N lists' },
    header:
`-- Purpose: Top 15 affordable games by review rating
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT name, price, total_reviews, pct_positive
FROM steam_games
WHERE price <= 20
ORDER BY pct_positive DESC
LIMIT 15;`,
    pre: "How many of those fifteen do you expect to have heard of?",
    rows: 15 },

  { adds: 'Count what you are starting from',
    q: 'How many games are in this table?',
    why: 'COUNT(*) counts rows. This is 4,892, not all of Steam: it is every game with at least 2,000 reviews, which is where the hidden gem definition begins.',
    guide: { href: '../guides/sql-count-function/', label: 'Read: COUNT and what it counts' },
    header:
`-- Purpose: The size of the pool the hidden-gem definition starts from
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT COUNT(*) AS games
FROM steam_games;`,
    pre: "One row back, or 4,892?",
    rows: 1 },

  { adds: 'Apply the first bar: genuinely loved',
    q: 'How many of them are rated 95% positive or better?',
    why: 'The first real cut. A count with a WHERE on it is how you size a rule before you trust it.',
    guide: { href: '../guides/sql-funnel-analysis/', label: 'Read: counting down a funnel' },
    header:
`-- Purpose: Step 1 of the funnel, games rated 95%+ positive
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT COUNT(*) AS games
FROM steam_games
WHERE pct_positive >= 95;`,
    pre: "4,892 go in. Hundreds out, or thousands?",
    rows: 1 },

  { adds: 'Stack a second condition on it',
    q: 'How many of those are also twenty dollars or less?',
    why: 'AND stacks conditions. Every row has to satisfy both, so the count can only fall or stay level, never rise.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: AND, OR and stacking filters' },
    header:
`-- Purpose: Step 2 of the funnel, loved AND affordable
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT COUNT(*) AS games
FROM steam_games
WHERE pct_positive >= 95
  AND price <= 20;`,
    pre: "765 go in. Does price cut many of them?",
    rows: 1 },

  { adds: 'Apply the last bar and land on the answer',
    q: 'How many loved, cheap games does almost nobody own?',
    why: 'The third condition is the one that makes a gem hidden. This number is the whole project: 175 games out of a catalog of 125,855.',
    guide: { href: '../guides/sql-funnel-analysis/', label: 'Read: where a funnel actually drops' },
    header:
`-- Purpose: The hidden gems: loved, affordable, and barely owned
-- Source:  steam_games, one row = one game with 2,000+ reviews
-- Note:    est_owners_mid is the midpoint of Steam's owner range, so 200000 is "small"`,
    sql:
`SELECT COUNT(*) AS hidden_gems
FROM steam_games
WHERE pct_positive >= 95
  AND price <= 20
  AND est_owners_mid <= 200000;`,
    pre: "728 go in. Do you expect to lose most of them here?",
    rows: 1 },

  { adds: 'Split the answer by genre',
    q: 'What kind of game is a hidden gem, usually?',
    why: 'GROUP BY turns one number into one row per genre. The same filter, described rather than counted.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: GROUP BY without a fake answer' },
    header:
`-- Purpose: Which genres the 175 hidden gems fall into
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT primary_genre, COUNT(*) AS gems
FROM steam_games
WHERE pct_positive >= 95 AND price <= 20 AND est_owners_mid <= 200000
GROUP BY primary_genre
ORDER BY gems DESC;`,
    pre: "175 gems spread across how many genres?",
    rows: 9 },

  { adds: 'Drop the genres with barely any',
    q: 'Which genres have a real cluster of gems, not one or two?',
    why: 'HAVING filters groups after they are built. WHERE cannot do this, because no single game has a count of 26.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: why HAVING is not WHERE' },
    header:
`-- Purpose: Genres with at least 10 hidden gems, and what they cost on average
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT primary_genre, COUNT(*) AS gems, ROUND(AVG(price), 2) AS avg_price
FROM steam_games
WHERE pct_positive >= 95 AND price <= 20 AND est_owners_mid <= 200000
GROUP BY primary_genre
HAVING COUNT(*) >= 10
ORDER BY gems DESC;`,
    pre: "Nine genres go in. How many carry ten or more?",
    rows: 4 },

  { adds: 'Count the ones that qualify inside each group',
    q: 'Which genre is most likely to hide a gem?',
    why: 'The filter moves inside the aggregate. SUM of a CASE counts only the rows that match, while COUNT(*) still counts them all, so both numbers sit on one row and you can compare them.',
    guide: { href: '../guides/sql-segment-with-case/', label: 'Read: counting a subset with CASE' },
    header:
`-- Purpose: Hidden-gem rate by genre: how many qualify out of how many there are
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT primary_genre,
       COUNT(*) AS games,
       SUM(CASE WHEN pct_positive >= 95 AND price <= 20 AND est_owners_mid <= 200000 THEN 1 ELSE 0 END) AS gems
FROM steam_games
GROUP BY primary_genre
HAVING COUNT(*) >= 100
ORDER BY gems DESC;`,
    pre: "Action has by far the most games. Do you expect it to have the most gems?",
    rows: 7 },

  { adds: 'Measure it against the whole catalog',
    q: 'What share of Steam is a hidden gem?',
    why: 'The catalog total is not in this table, because 125,855 games will not fit in a browser. catalog_totals carries the real counts on one row, and CROSS JOIN attaches that row to the result so you can divide by it.',
    guide: { href: '../guides/sql-joins/', label: 'Read: joining a totals row onto a result' },
    header:
`-- Purpose: The 175 gems as a share of the full Steam catalog
-- Source:  steam_games, one row = one game with 2,000+ reviews
--          catalog_totals, one row, the counts for the whole catalog`,
    sql:
`SELECT t.games_in_catalog,
       COUNT(*) AS hidden_gems,
       ROUND(COUNT(*) * 100.0 / t.games_in_catalog, 3) AS pct_of_catalog
FROM steam_games AS g
CROSS JOIN catalog_totals AS t
WHERE g.pct_positive >= 95 AND g.price <= 20 AND g.est_owners_mid <= 200000;`,
    pre: "175 out of 125,855. Above or below one percent?",
    rows: 1 },

  { adds: 'Show the gap the whole project is about',
    q: 'How much smaller is a hidden gem audience?',
    why: 'CASE puts every game into one of two buckets, so the gems and everything else are averaged side by side. The gap is the finding: these games are loved just as hard and played by a fraction of the people.',
    guide: { href: '../guides/sql-case-expression/', label: 'Read: CASE, building a column that is not there' },
    header:
`-- Purpose: Average audience size, hidden gems against everything else
-- Source:  steam_games, one row = one game with 2,000+ reviews`,
    sql:
`SELECT CASE WHEN pct_positive >= 95 AND price <= 20 AND est_owners_mid <= 200000
            THEN 'Hidden gem' ELSE 'Everything else' END AS bucket,
       COUNT(*) AS games,
       ROUND(AVG(est_owners_mid)) AS avg_owners
FROM steam_games
GROUP BY bucket;`,
    pre: "Two rows. How many times bigger is the other bucket's audience?",
    rows: 2 },

  { adds: 'Finish on the list the project ships',
    q: 'So what should somebody actually play?',
    why: 'Everything from the last twelve drills in one query, ending on names instead of counts. This is the shortlist the public site is built from.',
    guide: { href: '../guides/sql-teaching-comments/', label: 'Read: commenting a query you will hand over' },
    header:
`-- Purpose: The top 15 hidden gems by rating, the shortlist the site leads with
-- Source:  steam_games, one row = one game with 2,000+ reviews
-- Note:    ties on rating are broken by review count, so the better evidenced game wins`,
    sql:
`SELECT name,
       ROUND(pct_positive, 1) AS pct_positive,
       total_reviews,
       price,
       est_owners_range
FROM steam_games
WHERE pct_positive >= 95 AND price <= 20 AND est_owners_mid <= 200000
ORDER BY pct_positive DESC, total_reviews DESC
LIMIT 15;`,
    pre: "Fifteen names. How many have you heard of?",
    rows: 15 }

  ]
};
