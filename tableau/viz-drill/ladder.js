// The 17 steps. Written to be done, not read.
//
// Rules for this file, because the first version failed them:
//   title  one short line, says what you will see when you finish
//   do     numbered actions, one physical move each, no clauses
//   why    one or two short sentences, everyday words, term defined in place
//   sql    the same thing as a query, short
//   target the state the check compares against
//
// If a sentence needs a comma to hold two ideas, split it.

const LADDER = {
  name: 'Country gems, from query to chart',
  rungs: [

  { adds: 'Make a list of artists',
    q: 'Which country artists are in this collection?',
    do: ['Drag <b>Artist</b> from the blue list onto the <b>Rows</b> shelf.'],
    why: 'Artist is a dimension. A dimension is a field you group by, and it is blue. Drop one on a shelf and you get one row per value.',
    sql: 'SELECT DISTINCT artist FROM country_gems',
    tie: 'Same as drill 1 in SQL Drill.',
    target: {rows: ['artist']} },

  { adds: 'Turn that list into bars',
    q: 'Who has the biggest audience?',
    do: ['Drag <b>Listeners</b> from the green list onto the <b>Columns</b> shelf.'],
    why: 'Listeners is a measure. A measure is a number you add up, and it is green. Drop one on a shelf and every artist gets a bar.',
    sql: 'SELECT artist, SUM(listeners) FROM country_gems GROUP BY artist',
    tie: 'You never typed GROUP BY. The dimension on Rows did it for you.',
    target: {rows: ['artist'], cols: ['listeners'], agg: 'SUM'} },

  { adds: 'Put the biggest bar on top',
    q: 'Who are the top few, at a glance?',
    do: ['Click <b>Desc</b> in the Sort buttons.'],
    why: 'Desc is short for descending. It means biggest first.',
    sql: 'ORDER BY SUM(listeners) DESC',
    tie: 'Same as drill 2.',
    target: {rows: ['artist'], cols: ['listeners'], sort: 'desc'} },

  { adds: 'Count tracks instead of adding up listeners',
    q: 'Who has the most tracks in here?',
    do: ['Click the <b>x</b> on the Listeners pill to take it off Columns.',
         'Drag <b>Number of Records</b> onto <b>Columns</b>.'],
    why: 'Number of Records counts the rows. Here that means how many tracks each artist has.',
    sql: 'SELECT artist, COUNT(*) FROM country_gems GROUP BY artist',
    tie: 'Same as drill 4. Number of Records is how a chart tool says COUNT(*).',
    target: {rows: ['artist'], cols: ['records'], sort: 'desc'} },

  { adds: 'Show only the newer artists',
    q: 'Among newer artists only, who has the most tracks?',
    do: ['Drag <b>Era</b> onto the <b>Filter</b> shelf.',
         'Under the shelf, click <b>catalog</b> to switch it off.'],
    why: 'Every value starts switched on. Clicking one leaves it out. Era says whether an artist is new (modern) or older (catalog).',
    sql: "WHERE era_group = 'modern'",
    tie: 'Same as drill 5. A filter drops rows before anything is added up.',
    target: {rows: ['artist'], cols: ['records'], filter: 'era', filterVals: ['modern']} },

  { adds: 'Ask the question by decade instead of by artist',
    q: 'Which decade of artists holds the biggest audience?',
    do: ['Click the <b>x</b> on the Era pill to clear the filter.',
         'Click the <b>x</b> on the Artist pill on Rows.',
         'Drag <b>Decade</b> onto <b>Rows</b>.',
         'Click the <b>x</b> on Number of Records, then drag <b>Listeners</b> onto <b>Columns</b>.'],
    why: 'One bar per decade now, instead of one per artist. Swapping the blue field changes what a bar means.',
    sql: 'SELECT debut_decade, SUM(listeners) FROM country_gems GROUP BY debut_decade',
    tie: 'Same as drill 9.',
    target: {rows: ['decade'], cols: ['listeners'], filter: null} },

  { adds: 'Put two blue fields on one shelf',
    q: 'Inside each decade, which artists carry the audience?',
    do: ['Drag <b>Artist</b> onto <b>Rows</b>, to the right of Decade.'],
    why: 'A shelf holds a list, not one field. Two blue fields give you headers inside headers. The order you drop them is the order you see.',
    sql: 'SELECT debut_decade, artist, SUM(listeners) FROM country_gems GROUP BY debut_decade, artist',
    tie: 'In SQL this is a second column in GROUP BY. There the order changes nothing. Here it changes the picture.',
    target: {rows: ['decade', 'artist'], cols: ['listeners']} },

  { adds: 'Put two green fields on one shelf',
    q: 'Do listeners and plays tell the same story by decade?',
    do: ['Click the <b>x</b> on the Artist pill.',
         'Drag <b>Playcount</b> onto <b>Columns</b>, next to Listeners.'],
    why: 'Two numbers cannot share one bar. The tool splits them and colors them apart for you. Real Tableau calls that Measure Names.',
    sql: 'SELECT debut_decade, SUM(listeners), SUM(playcount) FROM country_gems GROUP BY debut_decade',
    tie: 'Two aggregates in one query, drawn as two sets of bars.',
    target: {rows: ['decade'], cols: ['listeners', 'playcount']} },

  { adds: 'Color the bars by a blue field',
    q: 'Is the audience in new artists or older ones?',
    do: ['Click the <b>x</b> on the Playcount pill.',
         'Drag <b>Era</b> onto <b>Color</b>, in the Marks box.'],
    why: 'A blue field on Color gives one color per value. Look at the legend under the Marks box.',
    sql: "CASE WHEN debut_decade IN ('2010s','2020s') THEN 'modern' ELSE 'catalog' END",
    tie: 'Same buckets you wrote by hand with CASE in drill 12.',
    target: {rows: ['decade'], cols: ['listeners'], color: 'era'} },

  { adds: 'Color the bars by a green field instead',
    q: 'Which decades get replayed hardest, not just heard most?',
    do: ['Drag <b>Playcount</b> onto <b>Color</b>. It replaces Era.'],
    why: 'This is the drop that catches everyone. A green field on Color does not split the bars. It shades them light to dark. The legend changes from patches to a strip.',
    sql: 'The rows do not change. The shade is a second number per bar.',
    tie: 'Blue on Color splits. Green on Color shades. That is the whole difference.',
    target: {rows: ['decade'], cols: ['listeners'], color: 'playcount'} },

  { adds: 'Write the number on each bar',
    q: 'What are the actual figures, without reading the axis?',
    do: ['Drag <b>Listeners</b> onto <b>Label</b>, in the Marks box.'],
    why: 'Label prints a value on the mark. It is why some charts need no axis.',
    sql: 'Nothing new is asked of the data. The number was already there.',
    tie: 'A cluttered chart usually has too much on Label.',
    target: {rows: ['decade'], cols: ['listeners'], color: 'playcount', label: 'listeners'} },

  { adds: 'Split the bars without showing why',
    q: 'How much of a decade is one artist?',
    do: ['Click the <b>x</b> on the Playcount pill on Color.',
         'Click the <b>x</b> on the Listeners pill on Label.',
         'Drag <b>Artist</b> onto <b>Detail</b>, in the Marks box.'],
    why: 'Detail splits each bar into smaller ones, one per artist. Nothing on screen says it happened. That is what Detail does.',
    sql: 'GROUP BY debut_decade, artist',
    tie: 'Extra marks you cannot explain usually mean a field is sitting on Detail.',
    target: {rows: ['decade'], cols: ['listeners'], color: null, label: null, detail: 'artist'} },

  { adds: 'See the numbers as a table',
    q: 'What exactly is behind the picture?',
    do: ['Click the <b>x</b> on the Artist pill on Detail.',
         'Click <b>Text table</b> in the Marks buttons.'],
    why: 'Every chart is a table underneath. This shows the table instead of drawing it.',
    sql: 'The same result set, printed instead of drawn.',
    tie: 'It matches the Underlying data tab exactly.',
    target: {rows: ['decade'], cols: ['listeners'], detail: null, mark: 'text'} },

  { adds: 'Change the maths without changing the fields',
    q: 'Is the typical track big, or just the total?',
    do: ['Click <b>Bar</b> to go back to bars.',
         'Click the body of the <b>Listeners</b> pill once. It reads AVG.'],
    why: 'SUM adds every track together. AVG gives the typical track. Same field, different question.',
    sql: 'SELECT debut_decade, AVG(listeners) FROM country_gems GROUP BY debut_decade',
    tie: 'Same as drill 7.',
    target: {rows: ['decade'], cols: ['listeners'], agg: 'AVG', mark: 'bar'} },

  { adds: 'Turn the chart on its side',
    q: 'Same answer, easier to read across time?',
    do: ['Click the pill body until it reads <b>SUM</b> again.',
         'Take <b>Decade</b> off Rows and <b>Listeners</b> off Columns.',
         'Drag <b>Decade</b> onto <b>Columns</b>.',
         'Drag <b>Listeners</b> onto <b>Rows</b>.'],
    why: 'Rows and Columns are just up and across. The numbers stay the same. Only the drawing turns.',
    sql: 'The query does not change at all.',
    tie: 'This one has no SQL to learn. That is the point of it.',
    target: {cols: ['decade'], rows: ['listeners'], agg: 'SUM', mark: 'bar'} },

  { adds: 'Draw it as a line',
    q: 'Is the audience rising decade by decade?',
    do: ['Click <b>Line</b> in the Marks buttons.'],
    why: 'A line says these points follow on from each other. Bars say compare these. Pick the one you mean.',
    sql: 'Still the same query underneath.',
    tie: 'Choosing between them is on the exam.',
    target: {cols: ['decade'], rows: ['listeners'], mark: 'line'} },

  { adds: 'Finish on the answer you already wrote in SQL',
    q: 'Where does the country audience actually sit, new artists or old?',
    do: ['Click <b>Bar</b>.',
         'Take <b>Decade</b> off Columns.',
         'Drag <b>Era</b> onto <b>Columns</b>.',
         'Drag <b>Era</b> onto <b>Color</b>.',
         'Click <b>Desc</b> to sort.'],
    why: 'Two bars: newer artists against older ones. This is the chart you would show at work.',
    sql: 'SELECT era_group, SUM(listeners) FROM country_gems GROUP BY era_group ORDER BY 2 DESC',
    tie: 'Same two numbers drill 13 gave you: 1,431,201 and 168,938.',
    target: {cols: ['era'], rows: ['listeners'], color: 'era', mark: 'bar', sort: 'desc'} }

  ]
};
