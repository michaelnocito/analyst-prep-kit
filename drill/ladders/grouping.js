// Ladder: GROUP BY and HAVING, on the music gems data.
// Built 2026-08-05 for interview prep. The one question this ladder answers by hand:
// WHERE filters rows before grouping, HAVING filters groups after it.
// Runs against data.js (gem_page, artist_era) exported from music_gems.db.
// Every query here was run against music_gems.db before it was written down.
// rows = the row count the learner should get back.

const LADDER = {
  name: "GROUP BY and HAVING",
  short: "Grouping",
  blurb: "Start at 500 raw tracks and climb to a six row genre summary. Watch the row count collapse at drill 2, then watch WHERE and HAVING cut it from opposite sides.",
  grain: {
    gem_page: 'one row = one curated gem track'
  },
  footnote: 'The concept half of this practice is <a href="../guides/sql-group-by-having/">GROUP BY and HAVING without a fake answer</a>. This ladder is the typing half.',
  drills: [

  { adds: 'Look at the raw rows first',
    q: 'What does one row of this table actually look like?',
    why: 'Every grouping question starts here. One row is one track, and that is the grain you are about to change.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: tables, rows and grain' },
    header:
`-- Purpose: Look at the raw grain before grouping anything
-- Source:  gem_page, one row = one curated gem track`,
    sql:
`SELECT genre, listeners
FROM gem_page;`,
    pre: "How many rows do you think come back?",
    rows: 500 },

  { adds: 'Collapse the rows into groups',
    q: 'How many tracks are in each genre?',
    why: 'This is the whole idea. Every row with the same genre becomes one row, and COUNT(*) runs inside each group.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: what GROUP BY does to your rows' },
    header:
`-- Purpose: Count the gem tracks in each genre
-- Source:  gem_page, one row = one curated gem track
-- Note:    the grain changes here, from one row per track to one row per genre`,
    sql:
`SELECT genre, COUNT(*) AS tracks
FROM gem_page
GROUP BY genre;`,
    pre: "500 rows went in. More or fewer than 100 come back?",
    rows: 52 },

  { adds: 'Sort it, which GROUP BY did not do',
    q: 'Which genre has the most tracks?',
    why: 'GROUP BY changed how many rows came back. It did not put them in any useful order. That is a different clause.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: sorting with ORDER BY' },
    header:
`-- Purpose: Rank the genres by how many gem tracks each one holds
-- Source:  gem_page, one row = one curated gem track`,
    sql:
`SELECT genre, COUNT(*) AS tracks
FROM gem_page
GROUP BY genre
ORDER BY tracks DESC;`,
    pre: "Same 52 rows, or fewer?",
    rows: 52 },

  { adds: 'Drop the tiny genres with HAVING',
    q: 'Which genres have more than 20 tracks?',
    why: 'HAVING filters groups, after the grouping has happened. It is the only place a COUNT can be used as a filter.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: why this cannot be a WHERE' },
    header:
`-- Purpose: Keep only the genres large enough to say anything about
-- Source:  gem_page, one row = one curated gem track
-- Note:    HAVING runs after grouping, so it can see COUNT(*)`,
    sql:
`SELECT genre, COUNT(*) AS tracks
FROM gem_page
GROUP BY genre
HAVING COUNT(*) > 20
ORDER BY tracks DESC;`,
    pre: "52 genres go in. Do you expect more or fewer than 10 to survive?",
    rows: 5 },

  { adds: 'Add a WHERE, and watch it do a different job',
    q: 'Same question, but ignoring tracks almost nobody has heard.',
    why: 'Now both filters are in one query. WHERE threw away 109 individual tracks before grouping. HAVING still throws away whole genres after it.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: WHERE and HAVING side by side' },
    header:
`-- Purpose: Genre sizes, counting only tracks with a real audience
-- Source:  gem_page, one row = one curated gem track
-- Note:    WHERE drops tracks, HAVING drops genres. Two filters, two jobs.`,
    sql:
`SELECT genre, COUNT(*) AS tracks
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre
HAVING COUNT(*) > 20
ORDER BY tracks DESC;`,
    pre: "The WHERE removes 109 of the 500 tracks. Will fewer genres come back than last time?",
    rows: 5 },

  { adds: 'Add up the audience',
    q: 'How big is each genre by total listeners, not just track count?',
    why: 'A second aggregate in the same group. Counting rows and adding a column up are different questions about the same rows.',
    guide: { href: '../guides/sql-foundations/', label: 'Read: the five aggregate functions' },
    header:
`-- Purpose: Genre sizes by both track count and total audience
-- Source:  gem_page, one row = one curated gem track`,
    sql:
`SELECT genre,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre
HAVING COUNT(*) > 20
ORDER BY tracks DESC;`,
    pre: "Will the genre with the most tracks also have the most listeners?",
    rows: 5 },

  { adds: 'Turn the total into a per track average',
    q: 'Which genre has the biggest tracks, rather than the most of them?',
    why: 'The rate version of the total. This is the count against rate question, in SQL.',
    guide: { href: '../guides/operations-analytics-foundations/', label: 'Read: count against rate' },
    header:
`-- Purpose: Genre sizes by count, total audience, and audience per track
-- Source:  gem_page, one row = one curated gem track
-- Note:    avg_listeners is the rate. total_listeners is the volume.`,
    sql:
`SELECT genre,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(AVG(listeners)) AS avg_listeners
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre
HAVING COUNT(*) > 20
ORDER BY tracks DESC;`,
    pre: "Will the biggest genre by total also be the biggest per track?",
    rows: 5 },

  { adds: 'Count the artists, not the rows',
    q: 'How many different artists are behind each genre?',
    why: 'COUNT(*) counts rows. COUNT(DISTINCT artist) counts things. An artist with six tracks is six rows and one artist.',
    guide: { href: '../guides/sql-count-function/', label: 'Read: COUNT(*) against COUNT(DISTINCT)' },
    header:
`-- Purpose: Genre summary, separating how many tracks from how many artists
-- Source:  gem_page, one row = one curated gem track
-- Note:    artists is always at or below tracks, and the gap is repeat artists`,
    sql:
`SELECT genre,
       COUNT(DISTINCT artist) AS artists,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(AVG(listeners)) AS avg_listeners
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre
HAVING COUNT(*) > 20
ORDER BY tracks DESC;`,
    pre: "Pop has 116 tracks. More or fewer than 60 different artists?",
    rows: 5 },

  { adds: 'Filter on a different aggregate',
    q: 'Which genres reach more than a million listeners?',
    why: 'HAVING is not only for COUNT. It can filter on any aggregate, and swapping the test changes which groups survive.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: what HAVING can see' },
    header:
`-- Purpose: Genres that reach a million listeners or more
-- Source:  gem_page, one row = one curated gem track
-- Note:    the filter moved from track count to audience, so the answer moves too`,
    sql:
`SELECT genre,
       COUNT(DISTINCT artist) AS artists,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(AVG(listeners)) AS avg_listeners
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre
HAVING SUM(listeners) > 1000000
ORDER BY total_listeners DESC;`,
    pre: "Last drill kept 5 genres. Does this filter keep more or fewer?",
    rows: 6 },

  { adds: 'Give each genre its share of the whole',
    q: 'What share of the total audience does each genre hold?',
    why: 'A total is hard to judge. A percentage of the whole is the number a person can actually act on.',
    guide: { href: '../guides/report-vs-analysis/', label: 'Read: a number against a finding' },
    header:
`-- Purpose: Each genre's share of the total gem audience
-- Source:  gem_page, one row = one curated gem track
-- Note:    the subquery totals the same filtered set, so the shares are comparable`,
    sql:
`SELECT genre,
       COUNT(DISTINCT artist) AS artists,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(AVG(listeners)) AS avg_listeners,
       ROUND(100.0 * SUM(listeners) /
             (SELECT SUM(listeners) FROM gem_page WHERE listeners >= 10000), 1) AS pct_of_audience
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre
HAVING SUM(listeners) > 1000000
ORDER BY total_listeners DESC;`,
    pre: "Do these six genres add up to more or less than half the audience?",
    rows: 6 },

  { adds: 'Add a second grouping column',
    q: 'How does each genre break down by decade?',
    why: 'Every column you add to GROUP BY changes the grain again. One row per genre becomes one row per genre per decade.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: grouping on more than one column' },
    header:
`-- Purpose: Genre and decade combinations that reach a million listeners
-- Source:  gem_page, one row = one curated gem track
-- Note:    the grain is now one row per genre per decade, not one row per genre`,
    sql:
`SELECT genre,
       debut_decade,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre, debut_decade
HAVING SUM(listeners) > 1000000
ORDER BY total_listeners DESC;`,
    pre: "Six genres survived last time. More or fewer rows now that decade splits them?",
    rows: 10 },

  { adds: 'Keep the grain, count the spread instead',
    q: 'Which genres are broad, and which are one moment in time?',
    why: 'The finished answer. Back to one row per genre, with a count of how many decades each one spans, so breadth and size sit in the same table.',
    guide: { href: '../guides/sql-group-by-having/', label: 'Read: the whole clause order' },
    header:
`-- Purpose: Genre summary for the collection: size, breadth, and share of audience
-- Source:  gem_page, one row = one curated gem track
-- Note:    decades_spanned counts distinct decades, so the grain stays one row per genre`,
    sql:
`SELECT genre,
       COUNT(DISTINCT artist) AS artists,
       COUNT(*) AS tracks,
       COUNT(DISTINCT debut_decade) AS decades_spanned,
       SUM(listeners) AS total_listeners,
       ROUND(AVG(listeners)) AS avg_listeners,
       ROUND(100.0 * SUM(listeners) /
             (SELECT SUM(listeners) FROM gem_page WHERE listeners >= 10000), 1) AS pct_of_audience
FROM gem_page
WHERE listeners >= 10000
GROUP BY genre
HAVING SUM(listeners) > 1000000
ORDER BY total_listeners DESC;`,
    pre: "Trap is the smallest of the six. How many decades do you think it spans?",
    rows: 6 }

  ]
};
