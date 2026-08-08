By the end of this page you will have done a real piece of data analysis. It is a small one, on paper, with arithmetic you can do in your head. You will also know what the actual jobs look like hour by hour, which is the part most beginner articles skip, and what to learn first if you want one.

The work itself is four moves. You start with a question that has a decision behind it. You get the records of what happened. You split those records into groups and compare the groups. Then you say what to do about it. Everything else, every tool and every job title, is a variation on those four moves.

**The short version.** Data analysis is looking at records of things that already happened and finding a pattern that changes what someone does next. If nothing changes, it was not analysis. It was a report.

Many records become one comparison, and the comparison points at a choice.

## What data analysis actually is

Data is just a record of something that happened. A receipt is data. A timestamp on a door badge is data. A row saying customer 4471 cancelled on March 3rd is data.

Analysis is what you do to a pile of those records to answer a question. Usually the question is a comparison. Which group is bigger? Which one is growing? Which one costs us money?

Here is the part that makes it a job rather than a hobby. A single record tells you nothing useful. One customer cancelled, so what. Ten thousand records have a shape to them, and the shape is only visible once you group them. Grouping is the whole trick. You take rows that are alike, put them in a bucket, and count the buckets.

One word you will see everywhere: **a metric**. A metric is a number you decided to track, with a definition attached. "Sales" is not a metric until someone says whether it includes refunds. Half of all analysis arguments are really arguments about a definition, and the [guide on defining metrics](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../defining-metrics/) is entirely about that.

## A worked example you can follow on paper

A coffee shop owner has a question with a decision behind it. She is paying staff for two extra hours, one at each end of the day. She can only afford one. Should she open at 7am, or stay open until 8pm?

Stop for a second and decide what you would want to know to answer that. Not how you would calculate it. Just what you would need to see. Hold onto your answer and compare it to the four steps she takes.

She has a till record of every sale for the last three months. That is about 1,200 rows, and every row looks like this:
    
    
    date         time     item        amount
    2026-04-02   07:14    latte       4.50
    2026-04-02   07:22    croissant   3.20
    2026-04-02   19:41    tea         2.80

Nobody can read 1,200 rows. So she groups them. Every sale before 8am goes in one bucket. Every sale after 7pm goes in the other. Then she adds up the amounts in each bucket.

| Hour       | Sales in 90 days | Total money | Per day |
|------------|------------------|-------------|---------|
| 7am to 8am | 612              | $2,570      | $28.56  |
| 7pm to 8pm | 184              | $690        | $7.67   |

That is a complete analysis. Four columns, two rows, and a decision falls out of it: open early. The morning hour brings in close to four times as much per day as the evening hour.

Notice what you did not need. No statistics. No machine learning. No forecast. You grouped rows and compared the groups, which is what the overwhelming majority of paid analysis work is.

**The one extra step a professional adds.** She checks the staff cost. If the 7am hour costs $32 in wages and brings in $28.55, the answer flips. An analysis is not finished until the number is next to the thing it has to beat.

## Where data analysis gets used

Anywhere someone keeps records and has to make a choice. That is broader than "tech company", and the everyday version is far more common than the famous version.

| Field                  | A real question someone gets paid to answer                                                              |
|------------------------|----------------------------------------------------------------------------------------------------------|
| Retail and restaurants | Which products do people buy together, so which two should sit on the same shelf?                        |
| Hospitals              | Which day of the week has the most missed appointments, and can we text those patients the night before? |
| Banking                | Which transactions look unlike everything else this customer has ever done?                              |
| Subscription apps      | How many people who signed up in January are still paying in June?                                       |
| Logistics              | Which delivery routes run late most often, and is it the route or the driver's start time?               |
| Local government       | Which intersections produce the most collision reports per thousand vehicles?                            |
| Sports                 | From which spots on the floor does this player actually score, rather than shoot most?                   |
| Farming                | Which field sections yield least, and does that line up with the soil test map?                          |

Every one of those is the coffee shop. Take the records, split them into groups, compare the groups, recommend a change.

## The four steps, in order

Every analysis you will ever do is these four steps. The step names change between companies. The order does not.

## 1. Pin down the question

Someone asks "how are sales doing?" That is not answerable. Turn it into something that has one answer and a decision attached to it. "Is the 7am hour worth more than the 7pm hour?" is answerable. Write the question down before you touch the data, because it decides everything you do next.

This is also where you settle definitions. Does a refunded sale count? Does a $0 loyalty redemption count as a sale? Decide now, in writing, or you will redo the work.

## 2. Get the data and look at it

Find the records. They will be in a spreadsheet, or a database, or an export from some system nobody has logged into since 2021. Then, before you trust any of it, look at it. Count the rows. Check the date range is what you expected. Find the blanks. Find the duplicates.

This step is called exploratory data analysis, and it is where problems get caught while they are still cheap. The [guide on exploratory data analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../exploratory-data-analysis/) covers what to look for.

## 3. Group and compare

This is the analysis. Put alike rows in buckets, count or add up each bucket, and put the buckets side by side. In a spreadsheet that is a pivot table. In SQL that is `GROUP BY`. It is the same operation with two names.

Then split the groups further. Not just morning versus evening, but morning versus evening on weekdays and on weekends. Splitting is where the real findings live, and the next section shows why.

## 4. Say what it means, and what to do

A chart is not an answer. The answer is a sentence: "open at 7am, it earns about $21 a day more than the evening hour, and that holds on every weekday." Then state what would make you wrong. "This is three months of spring data, and it does not cover December."

Saying what would make you wrong is not weakness, it is the main thing that separates an analyst from someone who ran a query. The [guide on documenting limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../documenting-data-limitations/) goes into it properly.

## The tools, and the order to learn them

Guess the order first. Excel, SQL, a visualisation tool, Python. Which comes first, and which can wait longest? Most people put the wrong one last.

The tools do the four steps for you at larger sizes. That is all they are. There is a sensible order, and it is not the order the job ads imply.

| Tool                                 | What it is                                               | When you need it                                                                                                         |
|--------------------------------------|----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| Spreadsheets (Excel, Google Sheets)  | A grid you can type in, with formulas and pivot tables   | Always. It is still the most used tool in the field, and a pivot table is step three.                                    |
| SQL                                  | A language for asking a database questions               | Once the data is too big for a spreadsheet, or lives in a company database. This is the skill most job ads test.         |
| A dashboard tool (Power BI, Tableau) | Turns a table into charts other people can click through | When the same question gets asked every week and you are tired of answering it.                                          |
| Python or R                          | Programming languages with data libraries                | When the job needs something a spreadsheet cannot do: statistics, prediction, or repeating a messy clean-up every night. |
| Statistics                           | Methods for saying how sure you are                      | When the difference between two groups is small and someone will spend money on it.                                      |

Learn them in that order. Spreadsheets and SQL cover most entry-level work on their own. Python is genuinely useful and it is also the most common way beginners stall out for six months without producing anything anyone can look at.

## When the obvious answer is wrong

Here is the thing that makes analysis a skill rather than a lookup. The number for the whole group can point one way while every subgroup points the other way.

Say whether you believe that before reading the example. A hospital has a worse survival rate than another one overall, and yet does better with every single type of patient. Possible, or a mistake in the arithmetic?

A made-up example first, so the mechanic is clear. Two hospitals, and you want the one more likely to get you home alive.

| Patients                  | Hospital A survived  | Hospital B survived  |
|---------------------------|----------------------|----------------------|
| Arrived in good condition | 95 of 100 (95%)      | 180 of 200 (90%)     |
| Arrived in poor condition | 120 of 200 (60%)     | 55 of 100 (55%)      |
| **Everyone**              | **215 of 300 (72%)** | **235 of 300 (78%)** |

Hospital B looks better overall, 78% against 72%. But A is better in both of the groups it actually treats, 95% against 90% and 60% against 55%. B simply receives twice as many easy cases. The overall number is measuring who walks in the door, not what the hospital does.

This is not a curiosity. It happened in public, on real data, in 1973. The University of California, Berkeley looked like it was admitting men at a much higher rate than women to graduate study: 8,442 men applied and about 44% got in, against 4,321 women and about 35%. Three researchers then split the numbers by department, and the pattern largely vanished. Women were applying in far greater numbers to the departments that admitted the smallest share of anyone (Bickel, Hammel & O'Connell, 1975, _Science_ 187(4175), 398–404).

One habit protects you from this: after you compare two groups, split them again and check the answer survives. That is it. It costs one extra pivot table.

## The jobs, and what the day actually looks like

Job titles in this field are not consistent between companies. The same work is called three different things, and the same title means three different jobs. So the table below describes the work rather than the label, and gives a rough split of where a week actually goes.

| Role                                | What you actually do most days                                                                                                                                                                             | Rough week                        | The honest note |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|-----------------|
| **Data Analyst**                    |
|                                     | Answer questions people send you. Pull the rows, group them, build a small table or chart, explain it in a meeting. Then find out why your number disagrees with someone else's number.                    | Finding and cleaning data 45%     |
| Actual analysis 20%                 |
| Explaining and meetings 25%         |
| Fixing old work 10%                 | You will use statistics far less than the coursework implies. The skill that gets you promoted is asking the requester what decision they are making, before you build anything.                           |
| **Business or BI Analyst**          | Own a set of dashboards. Add measures, fix broken ones, retrain people on them, and take requests for new views of the same data.                                                                          | Maintaining dashboards 40%        |
| Building new ones 20%               |
| Stakeholder meetings 30%            |
| Analysis 10%                        | You maintain more than you build. A real share of requested dashboards get looked at twice and then never again, and nobody tells you which ones.                                                          |
| **Reporting or Operations Analyst** | Produce the same set of reports on a fixed schedule, in Excel, for the same audience. Investigate anything that looks off.                                                                                 | Producing scheduled reports 55%   |
| Investigating oddities 20%          |
| Meetings 15%                        |
| Improving the process 10%           | The easiest door into the field and the most predictable hours. It is also the role where you can spend three years without learning anything new, unless you deliberately automate your own work.         |
| **Analytics Engineer**              | Write and maintain the SQL that turns raw tables into the clean tables everyone else uses. Version control, tests, documentation.                                                                          | Writing SQL 50%                   |
| Testing and reviewing 20%           |
| Documentation 15%                   |
| Meetings 15%                        | The newest of these titles and the one closest to software engineering. Heads-down, few stakeholder meetings, and it usually needs a year or two of analyst work first.                                    |
| **Data Engineer**                   | Build and babysit the pipelines that move data between systems. Handle failures, volume, and cost.                                                                                                         | Building and fixing pipelines 60% |
| On-call and incidents 15%           |
| Design and review 15%               |
| Meetings 10%                        | This is a software engineering job, not an analysis job. You rarely look at what the data means. It typically pays the most of the roles here and carries the most on-call.                                |
| **Data Scientist**                  | Varies more than any other title here. At many companies it is an analyst role that uses Python. At some it is building and monitoring predictive models.                                                  | Data preparation 45%              |
| Modelling 20%                       |
| Analysis 20%                        |
| Meetings 15%                        | Read the actual duties in the posting, not the title. Roles that are genuinely about modelling usually ask for a graduate degree, and they are a smaller share of the openings than the internet suggests. |

The pattern across all six: preparing data takes more of the week than analysing it. That is not a sign of a badly run company. It is the job.

On pay, I would rather point you at the source than repeat a number from a salary blog. The US Bureau of Labor Statistics publishes median pay, expected growth and typical entry education for each of these, and it is updated yearly: [bls.gov/ooh](https://www.bls.gov/ooh/). Search there for "data scientists", "management analysts", and "operations research analysts", since those are the categories that cover most analyst work.

## Where these numbers come from

The claim that data preparation eats the week is not folklore. Researchers interviewed 35 analysts at 25 organisations, in sectors including healthcare, retail, marketing and finance. Finding the data, cleaning it and working out what is in it came up again and again as the recurring pain points of the job, across every kind of analyst they spoke to (Kandel, Paepcke, Hellerstein & Heer, 2012, _IEEE Transactions on Visualization and Computer Graphics_ 18(12), 2917–2926).

The same study found analysts split into three groups by how they work: people who write code freely, people who write scripts, and people who work inside an application such as Excel or a dashboard tool. All three are real analyst jobs. You do not have to be the first kind.

A later study interviewed thirty professional analysts about exploration specifically. It found no single tidy pipeline. Sometimes exploration is a warm-up before a directed analysis, and sometimes finding something interesting is itself the goal, and analysts disagree with each other about whether that second one counts (Alspaugh, Zokaei, Liu, Jin & Hearst, 2019, _IEEE Transactions on Visualization and Computer Graphics_ 25(1), 22–31).

That is worth holding on to as a beginner. The four steps are the right order to learn. In real work you will go back to step one halfway through step three, because the data told you the question was wrong. That is the work going well, not badly.

## How to get into the field

The barrier is not intelligence and it is usually not a degree. It is that hiring managers cannot tell from a certificate whether you can actually do it. So the whole plan is aimed at producing something they can look at.

  1. **Get comfortable in a spreadsheet first.** Pivot tables, `SUMIFS`, `VLOOKUP` or `XLOOKUP`, and basic charts. A week or two. This is genuinely most of step three, and it is on almost every job description.
  2. **Learn SQL next, and go further than the basics.** `SELECT`, `WHERE`, `GROUP BY`, and then joins. Joins are where beginners quietly lose or duplicate rows, and they are the single most tested topic in analyst interviews. Budget a month of real practice.
  3. **Do one project on data you actually care about.** Not the Titanic dataset. Something you have an opinion about: your city's open data, a game you play, your own spending. Caring is what gets you through the boring cleaning part.
  4. **Write the project up so a stranger can follow it.** State the question, show the data's problems, show the comparison, state the recommendation, and state what would make you wrong. This document is your qualification. It is what actually gets read.
  5. **Publish it on GitHub.** A link beats a bullet point on a résumé. The [Git guide](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../git-for-analysts/) covers this from zero.
  6. **Add a dashboard tool only if the postings you want ask for it.** Read ten real job ads in your city first. Let them tell you whether to learn Power BI or Tableau, instead of guessing.
  7. **Practice explaining out loud.** Interviews are mostly "walk me through a time you found something surprising." Say your project's story to a person who does not work in data, and cut anything they glaze over at.

Two things to skip early on: a second certificate before you have a first project, and Python before SQL. Both feel productive and both delay the thing that gets you hired.

## A cheat sheet

| Term                      | What it means                                                         | Where you meet it                               |
|---------------------------|-----------------------------------------------------------------------|-------------------------------------------------|
| Data                      | A record of something that happened                                   | A row in a spreadsheet or a table               |
| Row and column            | A row is one thing that happened. A column is one fact about it.      | Every table, everywhere                         |
| Metric                    | A number you track, plus the definition of what counts                | Step one, and every argument after it           |
| Grouping                  | Putting alike rows in buckets and counting each bucket                | Pivot table in Excel, `GROUP BY` in SQL         |
| Cleaning                  | Fixing blanks, duplicates and inconsistent spellings before you count | Step two, and most of the week                  |
| Exploratory data analysis | Looking at the data before you trust it                               | Step two                                        |
| Joining                   | Matching rows in one table to rows in another                         | SQL, and the top interview topic                |
| Splitting the groups      | Re-checking a comparison inside each subgroup                         | Step three, and it saves you from wrong answers |
| Limitations               | What your answer does not cover and what would make it wrong          | Step four, always written down                  |

**The one habit to keep.** Before you pull a single row, ask what decision the answer will change. If nobody can name one, the analysis has no right answer, because there is nothing for it to be right about.

## What to read next

Each of the four steps has a guide that goes deeper. In order:

  * Step one, pinning down the question: [Turning fuzzy questions into measurable definitions](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../defining-metrics/) and [picking cutoffs you can defend](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../data-driven-thresholds/).
  * Step two, looking at the data: [Why exploratory data analysis matters](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../exploratory-data-analysis/), and [how to set up a SQL database](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../set-up-a-sql-database/) when the file gets too big.
  * Step three, grouping and comparing: [COUNT in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../sql-count-function/), [the CASE expression](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../sql-case-expression/), and [joins without losing or doubling rows](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../sql-joins/).
  * Step four, saying what it means: [documenting limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../documenting-data-limitations/) and [building a dashboard and story](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../build-a-tableau-dashboard/).
  * When the tools fight back, which they will: [Technical tenacity](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/../technical-tenacity/).

**A question, if you have a minute.** What is the first question you would want to answer with data, from your own life or your own job? Not a practice dataset. The real one you already wonder about. That question is a better starting project than anything I could assign you, and I read every reply.

## References

  * Bickel, P. J., Hammel, E. A., & O'Connell, J. W. (1975). Sex bias in graduate admissions: Data from Berkeley. _Science_ , 187(4175), 398–404.
  * Kandel, S., Paepcke, A., Hellerstein, J. M., & Heer, J. (2012). Enterprise data analysis and visualization: An interview study. _IEEE Transactions on Visualization and Computer Graphics_ , 18(12), 2917–2926.
  * Alspaugh, S., Zokaei, N., Liu, A., Jin, C., & Hearst, M. A. (2019). Futzing and moseying: Interviews with professional data analysts on exploration practices. _IEEE Transactions on Visualization and Computer Graphics_ , 25(1), 22–31.

---

*The full version of this guide lives on my site: [What Is Data Analysis?](https://michaelnocito.github.io/analyst-prep-kit/guides/what-is-data-analysis/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
