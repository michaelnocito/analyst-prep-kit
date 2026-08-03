// Ladder: music gems, country section, generalist junior business analyst.
// Every query here was run against music_gems.db before it was written down.
// rows = the row count the learner should get back.

const LADDER = {
  name: "Country gems, generalist junior BA",
  short: "General",
  blurb: "Start at a filtered list of country tracks and climb to the two row answer about where the audience actually sits.",
  grain: {
    gem_page: 'one row = one curated gem track',
    artist_era: 'one row = one artist'
  },
  footnote: 'The chart half of this practice is <a href="../viz/">Viz Drill</a>: same 52 country tracks, same questions, built with shelves instead of clauses.',
  drills: [

  { adds: 'List the country tracks',
    q: 'Which country tracks are in the collection, and how big is each one?',
    why: 'The base shape: named columns with a filter.',
    header:
`-- Purpose: List the country tracks in the gems collection with their audience size
-- Source:  gem_page, one row = one curated gem track`,
    sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country';`,
    pre: "Out of 500 gem tracks, is country more or less than 100 of them?",
    rows: 52 },

  { adds: 'Put the biggest audience on top',
    q: 'Which country track has the most listeners?',
    why: 'Sort the rows so the biggest audience is on top.',
    header:
`-- Purpose: Rank the country gems by audience size, largest first
-- Source:  gem_page, one row = one curated gem track`,
    sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country'
ORDER BY listeners DESC;`,
    pre: "Same 52 rows, or fewer?",
    rows: 52 },

  { adds: 'Cut it to a top ten',
    q: 'What are the ten biggest country tracks?',
    why: 'Cut the list to a top ten, which is what a ranking usually ships as.',
    header:
`-- Purpose: Top 10 country gems by audience size for the country section
-- Source:  gem_page, one row = one curated gem track`,
    sql:
`SELECT artist, track, listeners
FROM gem_page
WHERE genre = 'country'
ORDER BY listeners DESC
LIMIT 10;`,
    pre: "How many different artists do you expect inside those 10 rows?",
    rows: 10 },

  { adds: 'Count the tracks each artist has',
    q: 'Which country artists appear most often in the collection?',
    why: 'GROUP BY, which collapses the rows to one per artist so you can count them.',
    header:
`-- Purpose: Which country artists have the most gem tracks in the collection
-- Source:  gem_page, one row = one artist after grouping`,
    sql:
`SELECT artist, COUNT(*) AS tracks
FROM gem_page
WHERE genre = 'country'
GROUP BY artist
ORDER BY tracks DESC
LIMIT 10;`,
    pre: "More rows than the 52 you started with, or fewer?",
    rows: 10 },

  { adds: 'Keep only the artists with more than one track',
    q: 'Which artists show up more than once, and how often?',
    why: 'HAVING, which filters the groups after counting. The LIMIT comes off.',
    header:
`-- Purpose: Country artists with more than one gem track, ranked by track count
-- Source:  gem_page, one row = one artist after grouping
-- Note:    HAVING filters groups after counting, WHERE filters rows before it`,
    sql:
`SELECT artist, COUNT(*) AS tracks
FROM gem_page
WHERE genre = 'country'
GROUP BY artist
HAVING COUNT(*) >= 2
ORDER BY tracks DESC, artist;`,
    pre: "Closer to 12 rows or closer to 30?",
    rows: 12 },

  { adds: 'Add up the audience for each artist',
    q: 'Which repeat artist has the biggest total audience?',
    why: 'A second aggregate, so each artist reports total audience as well as track count.',
    header:
`-- Purpose: Repeat country artists ranked by the total audience across their gem tracks
-- Source:  gem_page, one row = one artist after grouping
-- Note:    total_listeners sums across that artist's tracks, so track count inflates it`,
    sql:
`SELECT artist,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners
FROM gem_page
WHERE genre = 'country'
GROUP BY artist
HAVING COUNT(*) >= 2
ORDER BY total_listeners DESC;`,
    pre: "Does the artist on top here match the one who topped drill 3?",
    rows: 12 },

  { adds: 'Add how hard their fans replay them',
    q: 'Do the biggest artists also have the most loyal listeners?',
    why: 'An average, rounded, so the column is readable in a report.',
    header:
`-- Purpose: Repeat country artists with audience size and how hard their fans replay them
-- Source:  gem_page, one row = one artist after grouping
-- Note:    plays_per_listener is playcount divided by listeners, so it is a loyalty read`,
    sql:
`SELECT artist,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(AVG(plays_per_listener), 2) AS avg_plays_per_listener
FROM gem_page
WHERE genre = 'country'
GROUP BY artist
HAVING COUNT(*) >= 2
ORDER BY total_listeners DESC;`,
    pre: "Will the biggest artist also have the highest plays per listener?",
    rows: 12 },

  { adds: 'Bring in the decade each artist started',
    q: 'When did these artists first chart?',
    why: 'A JOIN pulls the debut decade in from a second table.',
    header:
`-- Purpose: Repeat country artists with the decade they first charted
-- Source:  gem_page joined to artist_era, one row = one artist after grouping
-- Note:    the join key is artist name, so an artist missing from artist_era drops out`,
    sql:
`SELECT g.artist,
       e.debut_decade,
       COUNT(*) AS tracks,
       SUM(g.listeners) AS total_listeners
FROM gem_page AS g
JOIN artist_era AS e ON e.primary_artist = g.artist
WHERE g.genre = 'country'
GROUP BY g.artist, e.debut_decade
HAVING COUNT(*) >= 2
ORDER BY total_listeners DESC;`,
    pre: "Same 12 artists as last drill, or does the join lose some?",
    rows: 12 },

  { adds: 'Ask the question by decade instead of by artist',
    q: 'Which decade of artists holds the biggest audience?',
    why: 'Change the grain: group by decade instead of by artist.',
    header:
`-- Purpose: Which debut decades the country gem audience actually sits in
-- Source:  gem_page joined to artist_era, one row = one debut decade
-- Note:    artists is a distinct count, because one artist has several tracks`,
    sql:
`SELECT e.debut_decade,
       COUNT(DISTINCT g.artist) AS artists,
       COUNT(*) AS tracks,
       SUM(g.listeners) AS total_listeners
FROM gem_page AS g
JOIN artist_era AS e ON e.primary_artist = g.artist
WHERE g.genre = 'country'
GROUP BY e.debut_decade
ORDER BY total_listeners DESC;`,
    pre: "Which decade do you expect on top?",
    rows: 7 },

  { adds: 'Turn the totals into shares',
    q: 'What share of the country audience does each decade hold?',
    why: 'Share of total, using a subquery for the denominator.',
    header:
`-- Purpose: Share of the country gem audience held by each debut decade
-- Source:  gem_page joined to artist_era, one row = one debut decade
-- Note:    100.0 forces decimal division, 100 alone would round every share to zero`,
    sql:
`SELECT e.debut_decade,
       COUNT(DISTINCT g.artist) AS artists,
       COUNT(*) AS tracks,
       SUM(g.listeners) AS total_listeners,
       ROUND(100.0 * SUM(g.listeners) /
             (SELECT SUM(listeners) FROM gem_page WHERE genre = 'country'), 1) AS pct_of_country
FROM gem_page AS g
JOIN artist_era AS e ON e.primary_artist = g.artist
WHERE g.genre = 'country'
GROUP BY e.debut_decade
ORDER BY total_listeners DESC;`,
    pre: "Should the pct column add up to 100, or slightly less?",
    rows: 7 },

  { adds: 'Name the set once so you stop repeating it',
    q: 'Same shares, written so a reviewer can follow it.',
    why: 'A CTE, which names the filtered set once so the rest of the query stops repeating it.',
    header:
`-- Purpose: Share of the country gem audience by debut decade, built on a named set
-- Source:  country_gems, one row = one country gem track with its artist's decade
-- Note:    the CTE runs first, so the subquery denominator now reads from the same set`,
    sql:
`WITH country_gems AS (
  SELECT g.artist, g.track, g.listeners, e.debut_decade
  FROM gem_page AS g
  JOIN artist_era AS e ON e.primary_artist = g.artist
  WHERE g.genre = 'country'
)
SELECT debut_decade,
       COUNT(DISTINCT artist) AS artists,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(100.0 * SUM(listeners) /
             (SELECT SUM(listeners) FROM country_gems), 1) AS pct_of_country
FROM country_gems
GROUP BY debut_decade
ORDER BY total_listeners DESC;`,
    pre: "Should the numbers change from the last drill, or match it exactly?",
    rows: 7 },

  { adds: 'Bucket the decades into new and old',
    q: 'Which decades count as new artists, and which as catalog?',
    why: 'CASE, which buckets the decades into two groups you can actually talk about.',
    header:
`-- Purpose: Country gem audience by decade, tagged modern or catalog
-- Source:  country_gems, one row = one country gem track with its artist's decade
-- Note:    modern means the artist first charted in 2010 or later`,
    sql:
`WITH country_gems AS (
  SELECT g.artist, g.track, g.listeners, e.debut_decade,
         CASE WHEN e.debut_decade IN ('2010s', '2020s') THEN 'modern'
              ELSE 'catalog' END AS era_group
  FROM gem_page AS g
  JOIN artist_era AS e ON e.primary_artist = g.artist
  WHERE g.genre = 'country'
)
SELECT debut_decade,
       era_group,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(100.0 * SUM(listeners) /
             (SELECT SUM(listeners) FROM country_gems), 1) AS pct_of_country
FROM country_gems
GROUP BY debut_decade, era_group
ORDER BY total_listeners DESC;`,
    pre: "Still 7 rows, or does the CASE column split some decades in two?",
    rows: 7 },

  { adds: 'Finish on the two-row answer',
    q: 'Does the country audience sit with new artists or older ones?',
    why: 'The payoff: group by the bucket, and the whole ladder collapses into two rows a manager can act on.',
    header:
`-- Purpose: How the country gem audience splits between modern and catalog artists
-- Source:  country_gems, one row = one era group
-- Note:    avg_listeners_per_track is the fair comparison, since the groups hold different track counts`,
    sql:
`WITH country_gems AS (
  SELECT g.artist, g.track, g.listeners, e.debut_decade,
         CASE WHEN e.debut_decade IN ('2010s', '2020s') THEN 'modern'
              ELSE 'catalog' END AS era_group
  FROM gem_page AS g
  JOIN artist_era AS e ON e.primary_artist = g.artist
  WHERE g.genre = 'country'
)
SELECT era_group,
       COUNT(DISTINCT artist) AS artists,
       COUNT(*) AS tracks,
       SUM(listeners) AS total_listeners,
       ROUND(AVG(listeners)) AS avg_listeners_per_track,
       ROUND(100.0 * SUM(listeners) /
             (SELECT SUM(listeners) FROM country_gems), 1) AS pct_of_country
FROM country_gems
GROUP BY era_group
ORDER BY total_listeners DESC;`,
    pre: "Catalog artists are the larger group by headcount. Will they be larger by audience?",
    rows: 2 }

  ]
};
