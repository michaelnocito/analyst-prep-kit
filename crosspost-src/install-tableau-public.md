By the end of this page you will have the right free Tableau installed, a chart built from a spreadsheet, and a live link you can put on a CV. The part worth reading even if you have already installed something: Tableau ships **two** free desktop applications with almost identical names, and the one many people download cannot publish to Tableau Public at all. That is not a setting you can change later.

Here is what to actually do today. Download **Tableau Desktop Public Edition** , not Tableau Desktop Free Edition, and create the Tableau Public account before you build anything. If the app you already have has no Publish option under the File menu, you have the other one.

The short version: Public Edition can publish and is limited to 15 million rows and a short list of file-based data sources. Free Edition has no row limit and connects to far more, but has no publish. Everything you publish is visible to everyone on the internet.

That fork is the one idea this page exists to settle, so it gets the picture.

> _The original carries a diagram here. In words: Two rows, each starting with an identical application icon on the left, showing that both apps look the same. The upper row's icon has a solid arrow running right into a cloud shape, which is drawn with a globe mark meaning the public internet. The lower row's icon has an arrow that stops partway at a solid vertical bar, and the cloud on that row is drawn faint and unreachable. Both rows also have a short downward arrow into a small disk icon, drawn identically, showing that saving to your own machine works the same either way._

**Every claim in the table below comes from Tableau's own edition comparison** , checked on 8 August 2026, rather than from tutorials. Several widely repeated facts about Tableau Public are simply out of date, including the common claim that it cannot save to your own machine. It can, and the section on that is below.

## 1. The two free editions, side by side

Before the explanation: you want to build a dashboard and put a link to it on your CV. Which of the two abilities below would you give up if you had to choose, publishing or connecting to a database?

That is not a rhetorical question. It is the actual trade, and Tableau makes you take it.

| What it does                        | Desktop Public Edition                                                        | Desktop Free Edition                |
|-------------------------------------|-------------------------------------------------------------------------------|-------------------------------------|
| Costs money                         | No                                                                            | No                                  |
| Publish to Tableau Public           | **Yes**                                                                       | **No**                              |
| Save a workbook on your own machine | Yes                                                                           | Yes                                 |
| Row limit                           | 15 million                                                                    | None                                |
| Data sources                        | Files only: Excel, text, JSON, PDF, spatial, statistical, Google Drive, OData | Nearly all, including SQL databases |
| Commercial use                      | Not permitted                                                                 | Permitted                           |

Read the publish row and the data sources row together, because that is the whole design. Public Edition exists to put work on the public web, so it only accepts data you could reasonably make public: files you already hold. Free Edition exists to let you work privately against real systems, so it connects to databases and never publishes anywhere.

**For a portfolio, you want Public Edition.** A dashboard nobody can open is not a portfolio piece, and the file-only limitation costs you nothing when your project data is a CSV anyway. If you are doing paid work, neither of these is your answer, because Public Edition forbids commercial use and Free Edition cannot share.

## 2. Make the account first

Go to [public.tableau.com](https://public.tableau.com/) and create a profile before you install anything. The app asks you to sign in at the moment you publish, and being sent to a sign-up form while holding a finished dashboard is how people lose an evening's work to a browser tab.

Your profile is a public web page carrying your name and every workbook you publish. Choose the username with that in mind, because it becomes the address you put on applications. Something close to your real name reads better on a CV than a handle.

While you are there, look at a few published dashboards. Everything on that site was made with the same free app you are about to install, which is a useful thing to know before you decide what you are capable of.

## 3. Install the right one

From [public.tableau.com](https://public.tableau.com/), find the download for the desktop app and check the name on the installer before you run it. You are looking for the words **Public Edition**. Windows and macOS are both supported.

The installer is large, around 1 GB, and takes a few minutes. When it opens you land on a start page with a Connect panel down the left side. That panel is the fastest way to tell which app you have: if it lists only file types, you have Public Edition, which is the one you want. If it lists Microsoft SQL Server, PostgreSQL and a long tail of servers, you have Free Edition and there will be no Publish option later.

Already installed the wrong one? Uninstall it and install the other. There is no upgrade path and no licence key to enter, because both are free. Any workbook you have already built will open in either.

## 4. Connect a file and build one chart

Under Connect, choose **Microsoft Excel** or **Text file** and pick a spreadsheet. If you do not have one to hand, any CSV with a category column and a number column will do, and [a sample dataset](https://michaelnocito.github.io/analyst-prep-kit/guides/sample-database-for-sql-practice/) is one download away.

Tableau opens the Data Source tab and shows your rows. Two things to check here, before any charting, because both are easier to fix now than later. Look at the little symbols above each column name: `Abc` means text, `#` means a number, and a small calendar means a date. If a column of numbers arrived as text, click the symbol and change it. Then look at the row count in the bottom corner and confirm it matches the file you expected.

Now click Sheet 1 at the bottom. Your columns are listed on the left, split into Dimensions above and Measures below. Drag a text column to the **Rows** shelf and a number column to the **Columns** shelf, and you have a bar chart. That is the entire core motion of Tableau, and everything else is a refinement of it.

Sort it before you look at it. A bar chart in alphabetical order hides the comparison you built it for, and one click on the sort icon in the toolbar is the difference between a chart and a finding.

## 5. Publish it, and what publishing actually does

File, then **Save to Tableau Public As**. Sign in, give it a name, and the browser opens on your published workbook a moment later. That URL is the thing you put on your CV.

Say what you think just travelled to Tableau's servers before reading on.

Not a link to your file. A copy of your data. Publishing takes an **extract** , which is a snapshot of the rows themselves, and uploads it along with the workbook. That is why Public Edition only accepts file-based sources in the first place: there is no live connection to maintain, because the data goes with the dashboard.

Two consequences follow immediately. Your dashboard keeps working for anyone who opens it, forever, without your machine being on, which is exactly what you want from a portfolio. And your data is now on the internet, in full, downloadable by anyone who opens the workbook. Not the chart. The rows.

To update it later, open the workbook, change it, and save to Tableau Public again with the same name. It replaces the published version and the link stays the same, so a URL on a CV does not go stale.

## 6. Before you publish anything from work

Everything on your Tableau Public profile is public. Tableau's own documentation states it plainly: workbooks and data published to your profile are not private and are freely accessible to anyone. There is no private option on a free account, and unlisted is not the same as private.

So the rule is short. **Never publish anything containing real customer, patient, employee or client data.** Not to test it, not for five minutes, not with the names shortened. Anyone can download the extract behind a published dashboard, which means every row you uploaded, including the columns you hid from the view.

Hiding a field in Tableau removes it from the chart, not from the extract. That is the specific mistake worth naming, because it feels like deleting and is not. If a column should not leave the building, remove it from the file before you connect to it.

For a portfolio this is rarely a problem, because public datasets are the right raw material anyway. Building your project on open data means the question of what you may share never comes up, and it also means anyone reviewing your work can check it.

## 7. The 15 million row ceiling, and what to do at it

Public Edition caps a workbook at 15 million rows. That is a large number and you will still meet it, because raw event data reaches it quickly: a year of web clicks or till transactions can pass it on its own.

The fix is not a bigger tool, it is a better grain. Almost no dashboard needs one row per event. Summarise before you connect: group your data to one row per day per category, or per store per week, and a 40 million row file becomes a 60,000 row file that answers the same questions and redraws instantly.

Doing that summarising in SQL first is the normal analyst move, and it is what [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) is for. If the file is too big to open at all before you can summarise it, [handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/) covers that step.

Now picture the dataset you were planning to use. At what grain is one row, and does your dashboard's smallest chart actually need that grain? Most of the time the answer is no, and the ceiling stops being a limit at all.

## The full before and after

Same goal both times: a link to a dashboard, on a CV, that a stranger can open.

### Before
    
    
    Downloaded "Tableau Desktop"      → Free Edition
    Connected to a local PostgreSQL   → works
    Built the dashboard               → works
    File menu → looked for Publish    → not there

Every step succeeded and the outcome is unusable. The workbook exists only on that laptop and connects to a database only that laptop can reach, so there is nothing to send anyone. The work is not wasted, but it has to be rebuilt against an exported file in the other app before it can be shared.

### After
    
    
    Created the public.tableau.com account first
    Downloaded Tableau Desktop Public Edition
    Summarised the data to one row per day per category (61,000 rows)
    Connected to that CSV → checked column types and row count
    Built and sorted the chart
    File → Save to Tableau Public As → link opens in the browser

Same analysis, and now it has an address. The summarising step did two jobs at once: it kept the workbook under the row ceiling and it made the dashboard redraw quickly for anyone who opens it, which matters more than it sounds when the person opening it is deciding whether to interview you.

## What goes wrong, and the fix

Six that stop people on this exact page.

**There is no Publish or Save to Tableau Public option.** You have Free Edition. Uninstall it, install Public Edition, and open the same workbook in it.

**You cannot connect to your database.** Public Edition connects to files only, by design. Export a query result to CSV and connect to that. [Setting up a SQL database](https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-a-sql-database/) covers the exporting end of this.

**Publishing fails or hangs on a large workbook.** Check the row count first. Over 15 million and it will not go, whatever the error says. Summarise and try again.

**The dashboard looks wrong on the web.** Published workbooks render at a fixed size, so a layout built to fit your monitor gets cropped. In the dashboard pane, set Size to a fixed dimension rather than Automatic before publishing, and check it in the browser afterwards.

**Numbers came in as text, so no chart is possible.** Tableau decides column types on connection, and one stray value like "N/A" in a number column turns the whole column to text. Change the type on the Data Source tab, or clean the value in the file.

**You published something you should not have.** Delete the workbook from your profile immediately, then assume it was copied. Speed matters more than tidiness here.

## Why the limits are shaped this way

The two editions look arbitrary until you notice that each restriction pairs with a permission. Public Edition may publish to the open web, so it may not connect to private systems and may not be used commercially. Free Edition may connect to anything and work with unlimited rows, so it may not publish anywhere. Neither is crippled software with a feature withheld; each is one coherent answer to a different question, and the trap is only that the names do not say which is which.

The extract mechanism explains the rest. Because publishing uploads the data rather than a connection, a published dashboard is self-contained: no server to keep running, no credentials to leak, no broken link when your laptop shuts. That same property is why the data is fully public and why the row cap exists at all, since Tableau is storing every row you send on their side.

One note on the way this page is written. It kept asking you to commit to an answer, which ability you would give up, what travelled to Tableau's servers, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own portfolio

Five steps, in order. The first one is the one people skip and regret.

  1. **Check the edition before you build anything.** Open the File menu and look for Save to Tableau Public. Thirty seconds now, or a rebuild later.
  2. **Start from open data** , so the question of what you are allowed to publish never arises and a reviewer can check your work.
  3. **Summarise to the grain your dashboard needs** before connecting. It keeps you under the ceiling and makes the published version quick for visitors.
  4. **Publish early, while it is ugly.** The link existing is what makes the project real, and updating it later reuses the same URL.
  5. **Open your own link in a private browser window** before you put it on anything. That is the only way to see what a stranger sees, including whether it is cropped.

If you have paper nearby, one optional drawing is worth five minutes. Draw two boxes for the two editions and write, under each, the one thing it cannot do. Then circle the box you have installed. If you cannot say with certainty which one you have circled, that is the answer to why something is not working.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                         | What it is, or what it does                                                    |
|-------------------------------|--------------------------------------------------------------------------------|
| Tableau Public (the website)  | A free hosting site for dashboards. Everything on it is public.                |
| Desktop Public Edition        | The free app that can publish. Files only, 15 million rows, no commercial use. |
| Desktop Free Edition          | The other free app. Connects to databases, unlimited rows, cannot publish.     |
| How to tell them apart        | File menu: Save to Tableau Public exists in one and not the other.             |
| Extract                       | A snapshot of the rows themselves. Publishing uploads one.                     |
| What publishing shares        | The workbook and all its data, downloadable by anyone.                         |
| Hiding a field                | Removes it from the view, not from the extract. It still uploads.              |
| Row ceiling                   | 15 million per workbook in Public Edition. Summarise to get under it.          |
| Dimensions and Measures       | Text and dates against numbers. Drag one to Rows, one to Columns.              |
| `Abc`, `#`, calendar          | The column type symbols on the Data Source tab. Fix them before charting.      |
| Updating a published workbook | Save to Tableau Public with the same name. The URL does not change.            |
| Dashboard size                | Set a fixed size before publishing, or the web version crops.                  |
| Commercial work               | Neither free edition fits: one forbids it, the other cannot share.             |

**The one habit to keep.** Before you connect to any file, ask whether every column in it could sit on a public web page, because publishing sends all of them. That question, asked once at the start, prevents the only mistake on this page that cannot be undone. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first time I published to Tableau Public I had already built the whole thing in the wrong app, and the missing menu item was the first I knew about it. Which tool has caught you out with two products under one name?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Tableau. Tableau Desktop Public Edition, Free Edition, and Professional Edition feature comparison, and Publish workbooks to Tableau Public. Retrieved 8 August 2026 from help.tableau.com. Cited for the edition limits, which are product terms rather than research findings.

---

*Originally published on Analyst Prep Kit: [How to Install Tableau Public (And Which Free Tableau You Actually Need)](https://michaelnocito.github.io/analyst-prep-kit/guides/install-tableau-public/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
