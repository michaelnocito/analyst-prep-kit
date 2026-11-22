// The Telco Churn track. Twelve steps that end on the chart the published project
// leads with, built on the same 7,043 customers.
//
// Same rules as ladder.js, because the first version of that file failed them:
//   adds   one short line, says what you will see when you finish
//   do     numbered actions, one physical move each, no clauses
//   why    one or two short sentences, everyday words, term defined in place
//   sql    the same thing as a query, short
//   target the state the check compares against
//
// Every figure quoted here was read off the real data, not remembered.

const TELCO_LADDER = {
  name: 'Telco churn, from customer list to the published chart',
  rungs: [

  { adds: 'Make a list of the four customer groups',
    q: 'Who is in this customer base?',
    do: ['Drag <b>Persona</b> from the blue list onto the <b>Rows</b> shelf.'],
    why: 'Persona is a dimension. A dimension is a field you group by, and it is blue. Persona buckets every customer by how long they have been a customer.',
    sql: 'SELECT DISTINCT persona FROM telco_customers',
    tie: 'Four names for four tenure buckets. The project made them up so the groups have something to be called.',
    target: {rows: ['persona']} },

  { adds: 'Count the customers in each group',
    q: 'How big is each group?',
    do: ['Drag <b>Number of Records</b> from the green list onto the <b>Columns</b> shelf.'],
    why: 'Number of Records counts the rows. One row is one customer, so this is a headcount.',
    sql: 'SELECT persona, COUNT(*) FROM telco_customers GROUP BY persona',
    tie: 'The four bars add up to 7,043, the whole customer base.',
    target: {rows: ['persona'], cols: ['records']} },

  { adds: 'Put the biggest group on top',
    q: 'Which group has the most customers?',
    do: ['Click <b>Desc</b> in the Sort buttons.'],
    why: 'Desc is short for descending. It means biggest first.',
    sql: 'ORDER BY COUNT(*) DESC',
    tie: 'Loyal Core is the biggest group at 2,239. Group size tells you nothing about the problem yet.',
    target: {rows: ['persona'], cols: ['records'], sort: 'desc'} },

  { adds: 'Turn a column of 1s and 0s into a churn rate',
    q: 'What share of each group left?',
    do: ['Click the <b>x</b> on the Number of Records pill.',
         'Drag <b>Churned</b> onto <b>Columns</b>.',
         'Click the body of the <b>Churned</b> pill until it reads <b>AVG</b>.'],
    why: 'Churned is 1 when the customer left and 0 when they stayed. The average of 1s and 0s is the share who left. That is a rate.',
    sql: 'SELECT persona, AVG(churned) FROM telco_customers GROUP BY persona',
    tie: 'This is the whole trick behind rates. Store the yes as a 1, average it, and you have a percentage.',
    target: {rows: ['persona'], cols: ['churned'], agg: 'AVG', sort: 'desc'} },

  { adds: 'Write the rate on each bar',
    q: 'What are the actual percentages?',
    do: ['Drag <b>Churned</b> onto <b>Label</b>, in the Marks box.'],
    why: 'Label prints the value on the mark, so you can quote the number without reading the axis.',
    sql: 'Nothing new is asked of the data. The number was already there.',
    tie: 'New and At-Risk churn at 47.4%. Loyal Core churn at 9.5%. That is the five times gap the project is built on.',
    target: {rows: ['persona'], cols: ['churned'], agg: 'AVG', label: 'churned', sort: 'desc'} },

  { adds: 'Ask the same question about contracts',
    q: 'Does the contract someone signed change how often they leave?',
    do: ['Click the <b>x</b> on the Persona pill on Rows.',
         'Drag <b>Contract</b> onto <b>Rows</b>.'],
    why: 'Swapping the blue field changes what a bar means. Contract is what the customer signed. Month to month means they can walk any month.',
    sql: 'SELECT contract, AVG(churned) FROM telco_customers GROUP BY contract',
    tie: 'Month to month churns at 42.7%. Two year churns at 2.8%. Same customers, different commitment.',
    target: {rows: ['contract'], cols: ['churned'], agg: 'AVG', label: 'churned'} },

  { adds: 'Put both questions in one chart',
    q: 'Inside each group, which contracts are people on?',
    do: ['Click the <b>x</b> on the Contract pill.',
         'Drag <b>Persona</b> onto <b>Rows</b>.',
         'Drag <b>Contract</b> onto <b>Rows</b>, to the right of Persona.'],
    why: 'A shelf holds a list, not one field. Two blue fields give you groups inside groups. The order you drop them is the order you see.',
    sql: 'SELECT persona, contract, AVG(churned) FROM telco_customers GROUP BY persona, contract',
    tie: 'Twelve bars now. In SQL this is a second column in GROUP BY, and it changes nothing about the query. Here it changes the picture.',
    target: {rows: ['persona', 'contract'], cols: ['churned'], agg: 'AVG'} },

  { adds: 'Colour by the thing that explains it',
    q: 'Same twelve numbers, easier to compare?',
    do: ['Click the <b>x</b> on the Contract pill on Rows.',
         'Drag <b>Contract</b> onto <b>Color</b>, in the Marks box.'],
    why: 'A blue field on Color gives one colour per value. You get the same split as nesting, read side by side instead of stacked down the page.',
    sql: 'The query does not change. Only where the second field sits.',
    tie: 'Nesting and colouring ask the data the same question. Which one you pick is a reading decision, not a data one.',
    target: {rows: ['persona'], cols: ['churned'], color: 'contract', agg: 'AVG'} },

  { adds: 'Drop the safe contracts and look at the risky one',
    q: 'Among month to month customers only, who leaves most?',
    do: ['Click the <b>x</b> on the Contract pill on Color.',
         'Drag <b>Contract</b> onto the <b>Filter</b> shelf.',
         'Under the shelf, click <b>One year</b> and <b>Two year</b> to switch them off.'],
    why: 'Every value starts switched on. Clicking one leaves it out. A filter drops rows before anything is averaged.',
    sql: "WHERE contract = 'Month-to-month'",
    tie: 'Inside month to month, New and At-Risk churn at 51.4%. Half of them are gone.',
    target: {rows: ['persona'], cols: ['churned'], color: null,
             filter: 'contract', filterVals: ['Month-to-month'], agg: 'AVG'} },

  { adds: 'Swap the question to what they pay',
    q: 'Are the customers who leave the cheap ones?',
    do: ['Click the <b>x</b> on the Contract pill on Filter.',
         'Click the <b>x</b> on the Churned pill on Label.',
         'Click the <b>x</b> on the Churned pill on Columns.',
         'Drag <b>Monthly Charges</b> onto <b>Columns</b>.'],
    why: 'Same four groups, a different number. The pill still reads AVG, so each bar is what a typical customer in that group pays each month.',
    sql: 'SELECT persona, AVG(monthly_charges) FROM telco_customers GROUP BY persona',
    tie: 'The at-risk group pays $56 a month against $74 for the loyal group. They are not the cheap customers. They are paying near full price and leaving.',
    target: {rows: ['persona'], cols: ['charges'], agg: 'AVG', label: null, filter: null} },

  { adds: 'Plot one number against another',
    q: 'Do the customers who pay more also buy more?',
    do: ['Click the <b>x</b> on the Persona pill on Rows.',
         'Drag <b>Add-on Services</b> onto <b>Rows</b>.',
         'Drag <b>Persona</b> onto <b>Detail</b>, in the Marks box.',
         'Drag <b>Number of Records</b> onto <b>Size</b>.',
         'Click <b>Scatter</b> in the Marks buttons.'],
    why: 'A scatter needs a number on each shelf. Detail splits it into one dot per persona. Size makes the dot as big as the group.',
    sql: 'SELECT persona, AVG(monthly_charges), AVG(add_on_services), COUNT(*) FROM telco_customers GROUP BY persona',
    tie: 'This is the bubble chart in the published project. The at-risk group buys 1.0 add-ons against 3.2 for the loyal group. Nothing is holding them.',
    target: {cols: ['charges'], rows: ['services'], detail: 'persona',
             size: 'records', mark: 'scatter', agg: 'AVG'} },

  { adds: 'Finish on the chart the project leads with',
    q: 'Where is this company losing its customers?',
    do: ['Click <b>Clear worksheet</b>.',
         'Drag <b>Persona</b> onto <b>Rows</b>.',
         'Drag <b>Churned</b> onto <b>Columns</b>.',
         'Click the body of the <b>Churned</b> pill until it reads <b>AVG</b>.',
         'Drag <b>Churned</b> onto <b>Label</b>.',
         'Click <b>Desc</b>.'],
    why: 'You have built this before. Building it again from an empty worksheet, without the steps in between, is the part that sticks.',
    sql: 'SELECT persona, AVG(churned) AS churn_rate\nFROM telco_customers\nGROUP BY persona\nORDER BY churn_rate DESC',
    tie: 'That is the headline: churn is not spread evenly, it is front loaded in the first year. The full write-up, the dashboard and the three retention plays are linked under the chart.',
    target: {rows: ['persona'], cols: ['churned'], agg: 'AVG', label: 'churned',
             sort: 'desc', color: null, detail: null, size: null, filter: null, mark: 'bar'} }

  ]
};
