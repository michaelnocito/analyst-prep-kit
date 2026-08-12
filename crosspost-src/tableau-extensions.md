By the end of this page you can add an extension to a dashboard, tell the two hosting kinds apart, and read the permission box well enough to know what you're agreeing to. You'll also know the one behavior that surprises people after publishing, which is what an extension looks like in a PDF. It's about twelve minutes.

Here's what to do before you add your first one. Find out where it runs. An extension you drop onto a dashboard is a web application, and some of them are hosted on Tableau-managed servers while others are hosted by whoever built them. That single fact decides how much thought the rest of the decision needs.

The short version: an extension is a third-party web application running inside a dashboard object, and one of the two permission levels gives it your full underlying data along with table and field names.

Where the code actually runs is the thing the panel doesn't show you, so it gets the picture.

> _The original carries a diagram here. In words: A large rectangle labeled your dashboard contains four panels that all look alike. Three of them are shaded the same and marked as ordinary views. The fourth, in the lower right and outlined in a warning color, is labeled extension. A line runs from that fourth panel, crosses the boundary of the dashboard rectangle, and continues out to a separate box drawn outside and to the right labeled third-party host. The three ordinary views have no lines leaving the rectangle. The drawing shows that the extension panel sits inside the dashboard visually while its code and its data traffic reach outside it, which the other three panels never do._

## 1. What an extension actually is

Before the explanation: you drop an extension onto a dashboard and it draws a chart type Tableau doesn't have. Where did that chart come from?

From a web application, written by somebody else, running inside a panel on your dashboard. Tableau's own description is that extensions "let you add unique features to dashboards or directly integrate them with applications outside Tableau," and that they are "web applications created by third-party developers."

That's a bigger idea than a plugin. A worksheet is Tableau drawing your data. An extension panel is a separate application that Tableau has given a rectangle to, and which can be given access to the data behind the dashboard.

The things people use them for are genuinely useful and genuinely outside what a worksheet does: write-back to a database from inside the dashboard, chart types Tableau doesn't ship, integration with a planning or ticketing tool, or a control that changes several sheets at once in a way parameters can't.

Extensions are added as a dashboard object, which puts them in the same family as a text box, an image or a web page object rather than in the same family as a sheet.

**The sentence to remember.** An extension is somebody else's application borrowing a rectangle on your dashboard. Everything else on this page follows from taking that literally.

## 2. The two kinds, and where the code runs

Before the distinction: two extensions do the same job and look identical on the dashboard. What could make one a much easier decision than the other?

Who is hosting it. Tableau splits extensions by exactly that, and it's the first thing to establish about any one you're considering.

| Kind                | Where it runs                                                                                                                              | What that means for you                                                                |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **Tableau Trusted** |  Tableau-managed hosts. Reviewed by Tableau, and includes ones built by Tableau and by Exchange Partners through Tableau's review service. | Someone with a stake in it has looked at the code, and the hosting is not a stranger's |
| **Network-enabled** |  A third-party host. The developer manages delivery without Tableau in the middle.                                                         | Your judgment about that developer is the whole safeguard                              |

There's also a sandboxed option, which runs an extension in an isolated environment with no access to the network outside. It's the tightest of the choices, and it needs Tableau Server 2019.4 or later.

Say out loud why hosting matters more than what the extension displays, before reading on. It's because the panel's appearance is authored by the same people you'd be trusting. A polished panel is evidence of design effort and nothing else. Where it runs is a fact about the software rather than a claim by it.

None of that makes network-enabled extensions a bad choice. Plenty of good tools are delivered that way, and being outside Tableau's review service is not a mark against a developer. It means the question moves to you, and the question is the ordinary one you'd ask about any vendor handling company data.

## 3. What the permission box is really asking

Before the answer: an extension asks for permission and you click allow. What did you just agree to?

It depends which of two things it asked for, and the difference is large. Tableau's model has you "allow or deny the dashboard extension access to data in the workbook," and a network-enabled extension may request the higher level, called Full Data Access.

Full Data Access includes access to full underlying data, plus table and field names from the data sources. Read that as a sentence about your database rather than about your chart. Field and table names are the shape of your systems, and underlying data is the rows themselves rather than the totals on screen.

| What it can reach                          | Summary data | Full Data Access |
|--------------------------------------------|--------------|------------------|
| The aggregated numbers shown in the view   | Yes          | Yes              |
| The underlying rows behind those numbers   | No           | Yes              |
| Table and field names from the data source | No           | Yes              |

The practical rule falls out of the table. An extension that draws a chart of what's already on screen has no need for the underlying rows. If one asks for Full Data Access and its job is drawing a picture of a summary, that mismatch is the thing to ask about, and asking is reasonable rather than paranoid.

If you change your mind later, Tableau has Reset Permissions, so an early allow is not permanent. Worth knowing before you spend an afternoon worrying about a click you already made.

Picture the dashboards you've built at work. If one of their extensions could read every underlying row, whose data would that be, and would they know? That question is the whole of this section.

## 4. Adding one, and what it needs to work

Before the steps: your extension panel is blank on a colleague's machine and fine on yours. What's the most likely cause?

Usually one of two things, and both are in this section. Adding an extension is three steps.

  1. Open a dashboard sheet in a Tableau workbook.
  2. Drag an Extension object from the Objects section onto the dashboard.
  3. Either search for an extension, or browse locally for a `.trex` file you've already downloaded.

That `.trex` file is the manifest, meaning it's the small file that tells Tableau where the extension lives and what it's called. It isn't the extension itself, which is the point people miss when they wonder why such a small file added such a large feature.

Three requirements, each of which produces a blank or missing panel when unmet.

**JavaScript must be enabled in Tableau Desktop.** It's a dashboard setting, and an extension cannot run without it.

**An administrator can disable extensions entirely.** On Tableau Server and Tableau Cloud this is a setting someone else controls, so an extension that works on your machine can be blocked in the environment you publish to. Check before you design a dashboard around one.

**Sandboxed extensions need Tableau Server 2019.4 or later.** An older server is a hard stop rather than a degraded experience.

Then the one that catches people after publishing. On Tableau Server and Tableau Cloud, extension objects appear blank in prints, PDFs and images. So a dashboard that gets exported for a monthly pack has a blank rectangle where the extension was, and nobody finds out until the pack is circulated.

## 5. When to reach for one, and when not to

Before the list: an extension would solve your problem in ten minutes. What's worth checking before you use it?

Whether Tableau already does it, because a native answer costs no permission decision, no hosting question and no blank box in the PDF.

Extensions earn their place when the job is genuinely outside Tableau: writing data back to a source, a chart type that isn't in the Show Me options, or connecting the dashboard to another system your team works in. That's real capability and there's no native substitute.

Three cases where the native route is the better answer, and all three are common.

| What you want                               | Native answer                                                                                                                            |
|---------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| One control that drives several sheets      | A parameter, or a dashboard action                                                                                                       |
| Readers changing which group is highlighted | A [set action](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sets/), which updates set membership from the dashboard   |
| Drill-down from summary to detail           | A [hierarchy](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-hierarchies/), which puts the control on the pill for free |

Two more things worth deciding before you commit, both about the dashboard rather than the extension. An extension panel occupies space, and space on a dashboard is the scarce thing: the [two or three views](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sheets-to-dashboard/) guidance applies to a panel that isn't a view either. And an extension is a dependency, so a dashboard built around one stops working properly if the developer stops maintaining it.

## Why the permission box is the hard part

The technical steps here are easy and the judgment is not, and that split is worth naming because it's where the real risk sits. The problem isn't that the permission box is hidden. It's shown, clearly, at the moment you add the extension. The problem is that permission prompts are a weak way to get a good decision out of anyone.

Felt and colleagues studied exactly this on Android, where users see a permission list before installing an application. Their conclusion was that the permission warnings did not help most users make correct security decisions, while a notable minority did both notice them and understand them reasonably well (Felt, Ha, Egelman, Haney, Chin, & Wagner, 2012, _Proceedings of the Eighth Symposium on Usable Privacy and Security_). The finding generalises past Android because the mechanism is the same: a prompt arrives when someone has already decided they want the thing, and it asks them to weigh a cost they can't see against a benefit they came for.

The fix that follows is not to concentrate harder at the prompt. It's to move the decision earlier, to a moment when you haven't yet committed. Establish where an extension is hosted and what it needs access to before you drag it onto the dashboard, and the box at the end becomes a confirmation of something you already decided rather than the decision itself.

The product behavior on this page comes from Tableau's own documentation, which is the authority on it. Use dashboard extensions (Tableau Help, current version) is the source for the definition of an extension, the trusted and network-enabled distinction, the Full Data Access description, Reset Permissions, the three steps for adding one, the JavaScript requirement, the administrator control, the Tableau Server 2019.4 requirement for sandboxed extensions, and the statement that extension objects appear blank in prints, PDFs and images. Where a secondary write-up disagrees with that page, the page wins.

## Using this on your own dashboard

Think about any dashboard you've published with an extension on it. Could you say today who hosts that extension and what data it was granted?

Do this per extension rather than as a project, in this order.

  1. **Ask whether Tableau already does it.** Parameters, dashboard actions, set actions and hierarchies cover more of the common asks than people expect.
  2. **Establish the hosting before you install.** Tableau Trusted, network-enabled or sandboxed. This is a fact you can look up, not a judgment call.
  3. **Decide what level of access the job actually needs** , then compare it with what's requested. A mismatch is a question, not necessarily a problem.
  4. **Check your environment allows extensions at all** , and check the server version if you need a sandboxed one. Both are hard stops and both are cheap to check first.
  5. **Export the dashboard to PDF before you call it finished.** The blank rectangle is much better discovered by you than by the person who circulates the monthly pack.
  6. **Write down what you granted and why** , next to the workbook. Six months later, nobody remembers, and Reset Permissions is a much easier conversation with a note beside it.

If you have paper and five spare minutes, there's one sketch worth doing and it's optional. Draw your dashboard as boxes, then draw a line out of the page from every box whose contents come from outside your organization. Most dashboards produce no lines at all, which is exactly why the one that does deserves a minute of thought.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                | What it does                                                                         |
|------------------------|--------------------------------------------------------------------------------------|
| Dashboard extension    | A third-party web application running in a dashboard object                          |
| What it adds           | Features outside Tableau, or integration with an outside application                 |
| Tableau Trusted        | Reviewed by Tableau and deployed on Tableau-managed hosts                            |
| Network-enabled        | Hosted by a third party, delivered without Tableau in the middle                     |
| Sandboxed              | Runs isolated, with no outside network access. Needs Tableau Server 2019.4 or later. |
| Permission choice      | Allow or deny the extension access to data in the workbook                           |
| Full Data Access       | Full underlying data, plus table and field names from the data sources               |
| Changed your mind      | Reset Permissions                                                                    |
| Adding one             | Drag an Extension object from Objects, then search or browse for a .trex file        |
| .trex file             | The manifest. It points at the extension, it is not the extension.                   |
| Requirement            | JavaScript enabled in Tableau Desktop                                                |
| Administrator control  | Extensions can be disabled entirely on Server and Cloud                              |
| In a PDF or image      | Extension objects appear blank on Server and Cloud                                   |
| Reach for native first | Parameters, dashboard actions, set actions, hierarchies                              |
| The standing cost      | A dependency on someone else continuing to maintain it                               |

**The one habit to keep.** Decide where an extension is hosted and what access it needs before you drag it onto the dashboard. Making the call while you still have nothing invested is the only reliable way to make it well, and it turns the permission box into a confirmation instead of a decision.

One last thought, and I'd like other people's answers. The detail that changed how I think about these is the blank rectangle in a PDF, because it means the dashboard behaves differently depending on how someone consumes it, and nothing warns you. What's the extension you've actually found worth the dependency?

## References

  * Tableau. Use dashboard extensions. _Tableau Desktop and Web Authoring Help_ , current version. help.tableau.com. The authority for the product behavior described here.
  * Felt, A. P., Ha, E., Egelman, S., Haney, A., Chin, E., & Wagner, D. (2012). Android permissions: User attention, comprehension, and behavior. _Proceedings of the Eighth Symposium on Usable Privacy and Security (SOUPS '12)_.

---

*The full version of this guide lives on my site: [Tableau Dashboard Extensions: What They Add, and What They Can Read](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-extensions/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
