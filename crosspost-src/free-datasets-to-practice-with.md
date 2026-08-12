By the end of this page you will have a shortlist of places that hold millions of free datasets, and something more useful than that: a five-minute screen that tells you whether a particular file can teach you anything before you spend a week on it. Finding data is not the hard part. Almost every list of free datasets skips the part where you decide.

Here is what to actually do today. Open any dataset you are considering, and check it has three things: a date column, a category column you can group by, and a number column worth adding up. If it is missing one of the three, most analyst techniques cannot be practised on it, however interesting the subject is.

The short version: government open data portals are the best raw material, Kaggle is the fastest to search, and the screen in section 6 is what stops you a week in.

Those three column types are the one idea the rest of this hangs from, so they get the picture.

> _The original carries a diagram here. In words: One wide table of six rows and five columns. Three of the five columns are shaded and marked at the top by a small symbol: the first shaded column carries a calendar grid, the second carries a luggage-tag shape, and the third carries a hash mark. The two remaining columns are left plain and unshaded, showing they are optional. Below the table, three short arrows rise from the three shaded columns and meet at a single point, indicating that the three together are what make an analysis possible, rather than any one of them alone._

**Every source listed here was checked on 8 August 2026.** Links rot faster than anything else on a page like this, so if one has moved by the time you read it, the name is still the thing to search for.

## 1. What makes a dataset worth practising on

Before the explanation: think of a topic you would enjoy analysing. What would one row of that data have to contain for you to be able to say anything at all about it?

A dataset teaches you something when it can carry a question. Three column types are what let it do that.

**A date.** Without one you cannot ask whether anything changed, which rules out trends, seasonality, growth rates and before-and-after comparisons. That is a large fraction of what analysts are actually paid for.

**A category.** A region, a product, a department, a species. This is what you group by, and grouping is the move that turns a pile of rows into a comparison. One category column is enough; two lets you cross them.

**A number.** Something worth summing or averaging: a price, a count, a duration, a temperature. An identifier is not this, even though it is made of digits, and [summing an ID column](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sum-of-id-trap/) is a mistake with its own guide.

Two more things raise a dataset from usable to good. **Enough rows that a group is not tiny** , which in practice means thousands rather than dozens, so an average means something. And **a second table you could join to** , because joining is the skill that separates spreadsheet work from database work.

## 2. The places worth your time

There are hundreds of lists of dataset sources. Most of the entries are dead, duplicated, or a single file somebody posted once. These are the ones that repay a bookmark.

| Source                                                                 | What is there                                                             | Best for                                                                                       |
|------------------------------------------------------------------------|---------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| [data.gov](https://data.gov/)                                          | US federal, state and local open data across every subject.               | Messy, real, genuinely uncleaned data. The closest thing to a work file.                       |
| [data.gov.uk](https://data.gov.uk/) and [ONS](https://www.ons.gov.uk/) | UK government and national statistics.                                    | The same, for UK readers, plus well-documented statistical series.                             |
| [Kaggle Datasets](https://www.kaggle.com/datasets)                     | A very large searchable collection, uploaded by users.                    | Finding something on a specific subject quickly. Free account needed to download.              |
| [Our World in Data](https://ourworldindata.org/)                       | Long global time series on health, energy, population, climate.           | Date columns going back decades. Every chart offers its data as CSV.                           |
| [World Bank Open Data](https://data.worldbank.org/)                    | Country-level indicators, most years, most countries.                     | Practising joins on country codes, and reshaping wide tables to tall ones.                     |
| [Google Dataset Search](https://datasetsearch.research.google.com/)    | A search engine over published datasets rather than a host.               | When you know the subject and not the source.                                                  |
| [FiveThirtyEight data](https://github.com/fivethirtyeight/data)        | Around 150 tidy CSVs behind published stories, Creative Commons licensed. | Small clean files with a question already attached. Sports forecasts stopped updating in 2023. |
| [UCI repository](https://archive.ics.uci.edu/)                         | Long-standing academic collection, heavily used in teaching.              | Classic exercises. Many files are small and already tidy.                                      |

Notice what the table is really sorted by. The further up you go, the messier and more real the data, and the more it resembles what lands in your inbox on a Tuesday. The further down, the cleaner and more convenient. Both have a place, and knowing which you are picking is the point.

## 3. Government open data, and why it is the closest thing to real work

Open government data has a quality that curated collections cannot fake: nobody tidied it for a learner. Column names are inconsistent, dates arrive in three formats, categories have been renamed halfway through the series, and a footnote in a separate PDF explains that 2019 is not comparable to 2020.

That sounds like a reason to avoid it. It is the reason to use it. Cleaning, reconciling and documenting are most of an analyst's day, and they cannot be practised on a file where somebody already did them. A portfolio project built on messy public data lets you show the part of the work that actually distinguishes people, which is judgement about what the data can and cannot support. [Documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) is the write-up half of that skill.

One practical tip for these portals. Look for a data dictionary, sometimes called a codebook or a schema, before you download anything. It is the document explaining what each column means and how it was collected. A dataset with one is worth three without, because the alternative is guessing what `STATUS_CD = 4` meant to whoever typed it.

## 4. Kaggle, and the one thing to check there

Kaggle holds an enormous searchable collection and is usually the fastest way to find data on a named subject. You need a free account to download, and the search is far better than most government portals.

The thing to check is where a dataset came from. Anyone can upload, so a Kaggle page can be an original release, a copy of a government file, a copy of somebody else's copy, or a synthetic file somebody generated. Those are very different things to build a portfolio on, and the page does not always make the difference obvious.

Two signals sit on every dataset page and take ten seconds to read. The **provenance or source** section should name where the data actually came from, ideally with a link you can follow to the original. The **licence** tells you whether you may republish it, which matters the moment your project goes on the public web. If a page names no source at all, treat it as an exercise file rather than evidence, and do not build a portfolio claim on it.

Say why a synthetic dataset would be a poor choice for a portfolio project before reading on. The reason is that your findings would be about somebody's random number generator rather than about the world, and a reviewer who recognises the file knows that. Practising your technique on it is fine. Presenting a conclusion from it is not.

## 5. The famous teaching datasets, and what they can and cannot give you

A handful of files appear in nearly every tutorial: the Titanic passenger list, the iris flower measurements, the tips dataset, the Boston housing file. They are famous because they are small, clean, and load in one line, which makes them excellent for demonstrating a function.

What they cannot give you is a project. They are a few hundred rows with no date column, every question anyone might ask has been asked and published thousands of times, and a reviewer has seen the same analysis many times before yours. Using them to learn `groupby` is efficient. Putting them in a portfolio spends the one slot you have on something that shows nothing about your judgement.

So use them deliberately, for the ten minutes they are good at, and get your project data from section 2. There is a straightforward test: if a search for the dataset name returns a thousand finished analyses, it is a teaching file rather than a portfolio subject.

## 6. The five-minute screen

Run this before committing to any dataset. Every step is one action and the whole thing fits in five minutes, which is a good trade against a week.

  1. **Open it and read the column names.** Can you find a date, a category and a number? If not, stop here.
  2. **Count the rows.** Under a thousand and most groups will be too small for an average to mean anything.
  3. **Look for the data dictionary.** If there is none, can you honestly say what each column means? Guessing is how a confident wrong finding gets made.
  4. **Sort each important column and look at both ends.** The largest and smallest values expose placeholder numbers, negative quantities, and dates in the year 1900.
  5. **Count the blanks in your key columns.** A category column that is a third empty will quietly drop a third of your rows from every grouped result.
  6. **Write the question you would answer with it, in one sentence.** If you cannot, the dataset is not the problem, but you do not have a project yet.

That last step is the one people skip and it is the one that decides the outcome. A dataset is not a project. [Turning a fuzzy question into a measurable definition](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/) is the step between them.

Now picture the last file somebody sent you at work. Which of those six checks would it have failed? That is usually the same check that cost you an afternoon later on.

## The full before and after

Same intent both times: build a portfolio project over a weekend.

### Before
    
    
    Searched "best datasets for data analysis"
    Downloaded a 400-row file on a subject that sounded fun
    Opened it: two text columns and one number, no dates
    Made a bar chart
    Realised there is no second question to ask

The work stalls at the first chart, and it is not a motivation problem. Without a date column there is no trend to find, and with 400 rows split across categories there is nothing whose average is stable enough to compare. The dataset could not carry a second question, and that was knowable in the first two minutes.

### After
    
    
    Wrote the question first: "which categories grew fastest since 2020?"
    Searched a government portal for that subject
    Screened three candidates: dates, categories, numbers, row counts, dictionaries
    Picked the one with a data dictionary and 60,000 rows
    Found a second table to join on a shared code

Same weekend, and now there is somewhere to go. The date column gives a trend, the category column gives a comparison, the row count means the comparison is stable, and the joinable second table means the project can demonstrate a skill a spreadsheet cannot. The question came first, which is what made the screening possible at all.

## What goes wrong, and the fix

Six that cost people the most time.

**The download is an Excel file with the real table starting on row 8.** Government portals do this constantly: title, logo, notes, blank row, then the headers. Skip those rows on import rather than deleting them by hand, so the step is repeatable when the file is updated.

**The numbers are text.** Thousands separators, currency symbols, footnote markers and a stray "N/A" all turn a numeric column into text. Fix it at the import step, and check the total afterwards.

**Leading zeros have vanished from zip codes or account numbers.** Opening a CSV by double-clicking it in Excel does this silently. The [CSV import fix](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) covers the correct route.

**The file is far bigger than the page said.** Compressed downloads describe their compressed size. A 200 MB download can be several gigabytes on disk. [Handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/) is the guide for when that happens.

**The categories changed partway through the series.** A region renamed in 2022 becomes two categories in a grouped result, each covering part of the period. Always list the distinct values of a category column before trusting a grouping, and when the duplicates are messier than a rename, that is [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/).

**The licence does not allow republishing.** Check before your project goes public, not after. Government open data is usually fine; a scraped copy of a commercial source usually is not.

## Why choosing well matters more than the tool

There is a reason the screen in section 6 leads with "write the question". Analysis is not the act of summarising a file; it is the act of answering something, and the summary is only evidence. A dataset chosen without a question in hand can only produce descriptions, which is why so many first projects end at a bar chart. The chart is not wrong. It simply has nothing to argue.

This is also why the messy government file beats the tidy teaching file for a portfolio. The parts of the work that distinguish one analyst from another, deciding what a column means, noticing that a category was renamed, saying out loud what the data cannot support, have all been removed from a cleaned file. What is left is syntax, and syntax is the cheapest thing you have.

One note on the way this page is written. It kept asking you to commit to an answer, what one row would need to contain, why synthetic data is a poor portfolio subject, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). And the reason this page ends with a table to cover and recall rather than a summary to re-read is that retrieving beats reviewing for long-term retention, by a margin that grows with time (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255).

## Using this on your own portfolio

Five steps, in order. The first is the one that changes the outcome.

  1. **Write the question before you search.** One sentence, with a comparison in it. "Which categories grew fastest since 2020" beats "something about housing".
  2. **Screen three candidates, not one.** Five minutes each. Choosing between three is a decision; taking the first is a coincidence.
  3. **Prefer the file with a data dictionary** , even if the subject is slightly less interesting. You will spend far more time understanding columns than choosing a topic.
  4. **Check for a joinable second table** before you commit. It is what lets the project show database skills rather than spreadsheet skills.
  5. **Write down what the data cannot answer** , on the first day, in the same file as your notes. That paragraph ends up being the most credible part of the finished piece.

If you have paper nearby, one optional drawing is worth five minutes. Sketch the columns of a dataset you are considering as a row of boxes, and mark which is your when, which is your what, and which is your how much. Any box you cannot label is a column you do not yet understand, and any missing label is a question you will not be able to ask.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                   | What it is, or what it does                                                    |
|-------------------------|--------------------------------------------------------------------------------|
| The three columns       | A date, a category, a number. Trend, compare, measure.                         |
| Missing the date        | No trends, no growth, no before and after. Most of the job is gone.            |
| Missing the category    | Nothing to group by, so no comparison.                                         |
| An ID column            | Made of digits, not a number. Never sum it.                                    |
| Enough rows             | Thousands, so a group average is stable. Hundreds is a demonstration.          |
| A joinable second table | What lets the project show database skills rather than spreadsheet skills.     |
| Government portals      | Messy and real. Cleaning and documenting are the skills they teach.            |
| Kaggle                  | Fastest search. Check provenance and licence on every page.                    |
| Data dictionary         | The document saying what each column means. Worth more than the topic.         |
| Teaching datasets       | Titanic, iris and friends. Good for ten minutes, poor for a portfolio.         |
| Synthetic data          | Fine for technique. Never for a conclusion about the world.                    |
| The five-minute screen  | Columns, rows, dictionary, both ends, blanks, the question.                    |
| Headers on row 8        | Normal in government spreadsheets. Skip rows on import, do not delete by hand. |
| Renamed categories      | Split one group into two across time. List distinct values before grouping.    |
| Licence                 | Decides whether your project may go public. Check before, not after.           |

**The one habit to keep.** Write the question before you search for the data. Everything else on this page is a way of checking whether a particular file can answer the question you already have, and none of it works in the other order. If a dataset fights you in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. I once spent most of a weekend on a file before noticing that its category column had been renamed halfway through the period, which meant every comparison I had made was between two halves of the same thing. What did a dataset hide from you until you were too far in to start over?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*The full version of this guide lives on my site: [Where to Find Free Datasets to Practice With (And How to Pick One)](https://michaelnocito.github.io/analyst-prep-kit/guides/free-datasets-to-practice-with/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
