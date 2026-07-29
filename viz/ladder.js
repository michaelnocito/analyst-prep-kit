// Viz ladder: the same country-gems analysis the SQL ladder types out, built with shelves
// instead of clauses. Every rung names the SQL drill it answers, because the transfer is
// the point: a learner who can write GROUP BY should recognise it when it becomes a shelf.
//
// target is the state a rung is asking for. Only the keys present are checked, so a rung
// never fails someone for a mark type or a sort it did not ask about.

const LADDER = {
  name: 'Country gems, from query to chart',
  rungs: [

  { adds: 'A dimension on Rows. That is all a header list is.',
    task: 'Put <b>Artist</b> on Rows.',
    sql: 'SELECT DISTINCT artist FROM gem_page WHERE genre = \'country\'',
    tie: 'Drill 1 of SQL Drill. A dimension on a shelf is SELECT of a text column: one header per distinct value.',
    target: {rows: ['artist']} },

  { adds: 'A measure beside it. Tableau aggregates it the moment it lands.',
    task: 'Add <b>Listeners</b> to Columns. Leave the aggregation on SUM.',
    sql: 'SELECT artist, SUM(listeners) FROM gem_page WHERE genre = \'country\' GROUP BY artist',
    tie: 'Drill 6. You never wrote GROUP BY here, and that is the lesson: the dimension on Rows is the GROUP BY, and dropping a measure is the SUM.',
    target: {rows: ['artist'], cols: ['listeners'], agg: 'SUM'} },

  { adds: 'Sorting, which is a click here and a clause there.',
    task: 'Sort the bars <b>descending</b> by the measure.',
    sql: 'ORDER BY SUM(listeners) DESC',
    tie: 'Drill 2. Same ORDER BY, no typing.',
    target: {rows: ['artist'], cols: ['listeners'], sort: 'desc'} },

  { adds: 'Counting rows rather than adding a column up.',
    task: 'Replace Listeners on Columns with <b>Number of Records</b>.',
    sql: 'SELECT artist, COUNT(*) FROM gem_page WHERE genre = \'country\' GROUP BY artist',
    tie: 'Drill 4. Number of Records is Tableau\'s COUNT(*), and it is the field people hunt for longest in their first week.',
    target: {rows: ['artist'], cols: ['records'], sort: 'desc'} },

  { adds: 'A filter, which is WHERE with tick boxes.',
    task: 'Put <b>Era</b> on Filter, then click <b>catalog</b> to leave it out. Everything starts included, so filtering here means switching values off.',
    sql: 'WHERE debut_decade IN (\'2010s\', \'2020s\')',
    tie: 'Drill 5 taught WHERE against HAVING. A filter shelf is WHERE: it drops rows before the aggregation runs.',
    target: {rows: ['artist'], cols: ['records'], filter: 'era', filterVals: ['modern']} },

  { adds: 'A change of grain, which is the whole analysis turning over.',
    task: 'Clear the filter, put <b>Decade</b> on Rows instead of Artist, and <b>Listeners</b> back on Columns.',
    sql: 'SELECT debut_decade, SUM(listeners) ... GROUP BY debut_decade',
    tie: 'Drill 9. One row per decade instead of one row per artist. Swapping the dimension is swapping the GROUP BY.',
    target: {rows: ['decade'], cols: ['listeners'], filter: null} },

  { adds: 'A second dimension on the same shelf, which nests rather than replaces.',
    task: 'Add <b>Artist</b> to Rows, underneath Decade. Order matters: Decade first, then Artist.',
    sql: 'SELECT debut_decade, artist, SUM(listeners) ... GROUP BY debut_decade, artist',
    tie: 'A shelf holds a list, not a field. Two dimensions on Rows give you headers inside headers, and the order you dropped them is the order they nest. In SQL that is simply a second column in the GROUP BY, and the order there changes nothing, which is the difference worth holding onto.',
    target: {rows: ['decade', 'artist'], cols: ['listeners']} },

  { adds: 'Two measures on one shelf, and the field that appears to hold them apart.',
    task: 'Take Artist back off Rows, then add <b>Playcount</b> to Columns beside Listeners.',
    sql: 'SELECT debut_decade, SUM(listeners), SUM(playcount) ... GROUP BY debut_decade',
    tie: 'Two measures cannot share one set of marks, so the tool splits them and colours them by measure name. That is what Measure Names and Measure Values are for, and it is why they appear in the field list of a real workbook without anybody creating them.',
    target: {rows: ['decade'], cols: ['listeners', 'playcount']} },

  { adds: 'Colour, which is a second dimension without a second axis.',
    task: 'Take Playcount back off Columns, then put <b>Era</b> on Colour.',
    sql: 'CASE WHEN debut_decade IN (\'2010s\',\'2020s\') THEN \'modern\' ELSE \'catalog\' END',
    tie: 'Drill 12. You wrote that CASE by hand. Here the bucket is already a field, and Colour is what shows it.',
    target: {rows: ['decade'], cols: ['listeners'], color: 'era'} },

  { adds: 'The same card, a measure instead of a dimension, and a different legend.',
    task: 'Drop <b>Playcount</b> on Colour, replacing Era.',
    sql: 'No clause changes. The colour is a second aggregate computed per bar.',
    tie: 'This is the drop that catches everyone. A dimension on Colour splits the marks and gives you one swatch per value. A measure on Colour keeps the marks whole and shades them along a ramp, light to dark. Same card, two behaviours, and the legend is how you tell which one you did.',
    target: {rows: ['decade'], cols: ['listeners'], color: 'playcount'} },

  { adds: 'Label, which writes the number onto the mark.',
    task: 'Put <b>Listeners</b> on Label.',
    sql: 'Nothing new is asked of the data. The number was always there.',
    tie: 'Label prints a value on each mark. It is the reason a chart can be read without an axis, and the reason a cluttered chart usually has a field on Label that should not be there.',
    target: {rows: ['decade'], cols: ['listeners'], color: 'playcount', label: 'listeners'} },

  { adds: 'Detail, the card that splits marks and shows nothing.',
    task: 'Clear Colour and Label, then put <b>Artist</b> on Detail.',
    sql: 'GROUP BY debut_decade, artist',
    tie: 'Detail adds a field to the grouping without encoding it. One bar per decade becomes one bar per artist within each decade, and nothing on screen says why. That invisibility is what Detail is for, and it is why an unexplained pile of extra marks is usually a stray field sitting on Detail.',
    target: {rows: ['decade'], cols: ['listeners'], color: null, label: null, detail: 'artist'} },

  { adds: 'The text table, which is the chart type that is not a chart.',
    task: 'Clear Detail, then switch the mark type to <b>Text table</b>.',
    sql: 'The result set you have been building all along, printed rather than drawn.',
    tie: 'Every viz is a table underneath. Switching to Text table shows the same numbers as a crosstab, which is what the Underlying data tab has been showing you the whole time.',
    target: {rows: ['decade'], cols: ['listeners'], detail: null, mark: 'text'} },

  { adds: 'Changing the aggregation, which changes the question.',
    task: 'Switch the measure from SUM to <b>AVG</b>. Click the pill to change it.',
    sql: 'SELECT debut_decade, AVG(listeners) ... GROUP BY debut_decade',
    tie: 'Drill 7. Same shelf, different question: total audience against typical audience per track.',
    target: {rows: ['decade'], cols: ['listeners'], agg: 'AVG', color: 'era'} },

  { adds: 'Rows and Columns are axes, not roles.',
    task: 'Switch back to <b>Bar</b>, then swap the shelves: <b>Decade</b> on Columns, <b>Listeners</b> on Rows. Put the aggregation back to SUM.',
    sql: 'The query does not change at all. Only the drawing does.',
    tie: 'No SQL equivalent, and that is worth knowing. Orientation is a display choice, which is why the exam asks about Rows and Columns rather than about x and y.',
    target: {cols: ['decade'], rows: ['listeners'], agg: 'SUM', mark: 'bar'} },

  { adds: 'The mark type, which is the one thing SQL never had.',
    task: 'Change the mark type to <b>Line</b>.',
    sql: 'Still the same query underneath.',
    tie: 'A line implies order and continuity, so it reads as a trend where bars read as a comparison. Choosing between them is Domain 2 of the exam.',
    target: {cols: ['decade'], rows: ['listeners'], mark: 'line'} },

  { adds: 'The payoff: the same two-row answer SQL Drill ends on.',
    task: 'Back to <b>Bar</b>. Put <b>Era</b> on Columns and <b>Listeners</b> on Rows, with <b>Era</b> on Colour, sorted descending.',
    sql: 'SELECT era_group, SUM(listeners) ... GROUP BY era_group ORDER BY 2 DESC',
    tie: 'Drill 13. Thirteen queries typed and fifteen steps built arrive at the same two bars, and now you can produce that answer either way.',
    target: {cols: ['era'], rows: ['listeners'], color: 'era', mark: 'bar', sort: 'desc'} }

  ]
};
