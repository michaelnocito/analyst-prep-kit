By the end of this page you can look at a folder of eight finished sheets and say which two or three belong on the dashboard, which one goes in the upper-left corner, and which of Tableau's three sizing options to pick. You'll also have a one-sentence test that decides every one of those calls. It's about fifteen minutes.

Here's the move to make today. Open your busiest dashboard and write the single question it answers, in one sentence, for one named person. Then remove every view that isn't part of answering it. Most people delete half, and the half that survives lands harder than the whole thing did.

The short version: Tableau's own guidance is two or three views on a dashboard. Crowding is what happens when one dashboard is asked to serve several audiences at once.

Where the surviving views sit is the second decision, and it has a known answer, so that gets the picture.

> _The original carries a diagram here. In words: A single dashboard rectangle divided into three panes. One large pane occupies the whole upper-left area and spans most of the width. Two smaller panes sit below it, side by side. A curved arrow enters at the top-left corner of the large pane, travels right across it, then drops down and moves left to right across the two smaller panes, showing the order a reader takes them in. A small numeral one sits on the large pane, two and three on the smaller panes. The drawing shows that the first thing a reader meets is whatever occupies the upper left, so the most important view belongs there and the supporting views belong underneath._

## 1. Why two or three, and where that number comes from

Before the explanation: you have eight finished sheets and one dashboard. How many of them would you put on it?

Two or three. That's not a taste call, it's Tableau's published guidance: "In general, it's a good idea to limit the number of views you include in your dashboard to two or three."

The reason is about attention rather than about screen space. A dashboard is read, and a reader gives it one pass. Every view you add divides that pass. Four views means each one gets a quarter of the attention that one view would have had, and none of them gets long enough to land.

There's a second cost that's easier to miss. Adding a view doesn't just take attention from the others, it takes away the reader's sense of which one mattered. A dashboard with one clear view and two supporting ones tells the reader where to look. A dashboard with eight equal panels tells them to work it out themselves, which is the job you were supposed to do.

The number isn't sacred. Four views can work when three of them are small supporting numbers rather than full charts. But if your answer to "how many views" is six or more, the honest problem is usually the next section.

## 2. The filter that decides which sheets survive

Before the answer: two people ask for the same dashboard. One runs the sales team, one runs the warehouse. Should they get one dashboard or two?

Two. And this is the whole idea of the page, because trying to serve both with one dashboard is where crowding actually comes from.

Tableau puts the standard plainly: "The best visualizations have a clear purpose and work for their intended audience." Those two things travel together. A purpose without an audience is a topic, and an audience without a purpose is a mailing list.

So the filter is one sentence, and you write it before you drag anything onto the canvas.

**This dashboard answers _[one question]_ for _[one named person or role]_.**

Then take each finished sheet in turn and ask whether a reader needs it to answer that question. Not whether it's interesting, and not whether it took you two hours to build. Whether the question can be answered without it.

Say out loud what happens to a sheet that fails that test, before reading on. It doesn't get deleted. It goes onto a different dashboard, for the audience it was actually serving, or into the appendix of the deck. The sunk cost is the reason people keep views, and moving a view somewhere useful is what makes it possible to let go of.

Picture your own busiest dashboard for a moment. How many separate people would you name if you had to say who each view was for? If the answer is more than one, you have found the crowding.

## 3. Where each surviving view goes

Before the explanation: your dashboard has one headline view and two supporting ones. Which corner does the headline go in?

Upper left. Tableau's guidance is to place your "most important view so that it occupies or spans the upper-left corner," and the reason it gives is that "most viewers scan web content starting at the top left."

That's worth taking literally. The upper-left view is your headline whether or not you meant it to be, in the same way the first sentence of a paragraph is its topic sentence whether or not you wrote it that way. If a filter panel is sitting up there, your headline is a filter panel.

Three placements that follow from it:

| Element             | Where it goes                  | Why                                                             |
|---------------------|--------------------------------|-----------------------------------------------------------------|
| The headline view   | Upper left, spanning if it can | First thing read, and size signals importance                   |
| Supporting views    | Below or to the right          | Read after the headline, which is the order they make sense in  |
| Filters and legends | Right side or under the title  | Controls, not content. They should not be the first thing read. |

One more move that costs nothing. Give the dashboard a title that states the finding rather than the subject. "Regional sales" names a topic. "The West is carrying two thirds of growth" names the answer, and a reader who only sees the title has still been told something true.

## 4. Fixed, automatic or range: picking a size

Before the options: you build a dashboard on a large monitor and email it to someone on a laptop. What do they see?

It depends entirely on one setting, and this is the decision that produces most of the "it looks wrong on my machine" messages. Here is the fork.

**The question:** what dimensions should the dashboard be?

**Answer one, fixed.** You choose exact dimensions and design at them. Everyone sees the identical layout, and nothing shifts. If their screen is smaller, they scroll or the whole thing scales down. Choosing this means you're saying you know the screen it will be read on.

**Answer two, automatic.** Tableau adapts the overall dimensions of the visualization based on screen size. Nothing gets cut off on a smaller display. The cost is that your careful placement flexes, so things you lined up may not stay lined up.

**Answer three, range.** You set a minimum and a maximum size. The dashboard flexes between them and stops flexing outside them. It's the middle option, and it exists because both of the others are absolute about something.

**What decides it:** whether you know the screen. A dashboard going onto a wall-mounted display or into a specific report has a known size, so fixed is right. A dashboard published to Tableau Public for strangers has an unknown size, so range or automatic is right.

**Why it matters:** a fixed dashboard designed at a large size and read on a laptop is the single most common reason a dashboard that looked finished arrives looking broken. It's not a rendering fault. It's an answer to this question that nobody remembered making.

In Tableau Desktop there's a fourth path worth knowing about: you can design specific device layouts, so a phone reader gets a different arrangement of the same views rather than a squeezed copy of the desktop one.

## 5. Details people miss

Before the list: someone adds a ninth view because a stakeholder asked for it. What's the honest answer to that request?

That it belongs on their dashboard, not this one. Requests are not the enemy. Putting every request on one canvas is.

Five more.

**A number can be a view.** Two or three views doesn't mean two or three charts. A single large number with a label is often the best headline a dashboard can have, and it costs almost no attention to read.

**Sheets do not have to be used.** A workbook can hold twelve sheets and put three on the dashboard. The other nine are working notes, and nobody has to see them.

**Pick the encoding your reader can read accurately.** Length and position along a scale are read more accurately than area or angle, which is why a bar chart beats a pie chart for comparing sizes. The [chart choice guide](https://michaelnocito.github.io/analyst-prep-kit/guides/choose-the-right-chart/) walks through the whole set.

**Sort the headline view.** An unsorted bar chart makes the reader do the ranking. [Sorting in Tableau](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sorts/) is one click and it's an analytic act, not decoration.

**Test it at the size it will be read.** Not at the size you built it. If it's going in a slide deck, put it in a slide before you call it finished.

## Before and after, same six sheets

One build, two ways of assembling it. Nothing was rebuilt between these, and no new analysis was done. Only the assembly changed.

|                         | Before                              | After                                                      |
|-------------------------|-------------------------------------|------------------------------------------------------------|
| Views on the dashboard  | 6                                   | 3                                                          |
| Question it answers     | Not written down                    | "Which region should we staff next quarter?"               |
| Audience                | Sales, warehouse and finance        | The sales director                                         |
| Upper-left corner       | Filter panel                        | The headline chart                                         |
| Title                   | "Regional performance"              | "The West is carrying two thirds of growth"                |
| Size setting            | Fixed, at the author's monitor size | Range, with a laptop minimum                               |
| The three views removed | Deleted                             | Moved to a warehouse dashboard, where they had an audience |

The row that matters most is the last one. The three views were not wrong, they were on the wrong page. That's what makes the cut possible: nobody is being told their work was wasted.

## Why this works

The crowding problem has a name in the research and a cause that isn't a lack of discipline. Sarikaya and colleagues surveyed a large collection of real dashboards and found that a single dashboard is routinely asked to do several jobs at once, such as informing, monitoring and enabling exploration, for different people (Sarikaya, Gleicher, & Szafir, 2019, _IEEE Transactions on Visualization and Computer Graphics_ , 25(1), 682–692). Those jobs pull the design in different directions, and the visible result is a crowded canvas. Naming the one question and the one audience is a fix aimed directly at that cause.

It's also fair to say that specific dashboard design guidance is thinner than you'd expect for such a common artefact. Bach and colleagues assembled a set of dashboard design patterns and noted how little concrete guidance existed to draw on, which is part of why the same mistakes keep being reinvented (Bach, Freeman, Abdul-Rahman, Turkay, Khan, Fan, & Chen, 2023, _IEEE Transactions on Visualization and Computer Graphics_ , 29(1), 342–352). If dashboard advice has ever felt like folklore to you, that's a reasonable read of the field rather than a gap in your reading.

The encoding point rests on older and firmer ground. Cleveland and McGill ran experiments on how accurately people judge quantities from different graphical forms and ranked them, with judgments of position along a common scale coming out most accurate and judgments of area and angle less so (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). That ordering is why a bar chart is the safe default for a headline view.

The product behavior on this page, including the two-or-three guidance, the upper-left placement advice and the three sizing options, comes from Tableau's own documentation, which is the authority on it. Where a secondary write-up disagrees, that documentation wins.

## Doing this to your own dashboard

Think of the dashboard you've shared most often. Could you say, right now, what one question it answers and who for? If that took more than a few seconds, this is worth an hour.

Rebuilding everything at once is miserable and you'll abandon it halfway. Take one dashboard, in this order.

  1. **Write the sentence first.** One question, one named person. If you can't finish the sentence, that's the finding, and no layout change will fix it.
  2. **Mark every view keep or move.** Move, not delete. Moved views go to a dashboard for the audience they were really serving.
  3. **Put the survivor that answers the question in the upper left** , and let it span if it can. Size is a signal and readers use it.
  4. **Move filters and legends off the top left.** They're controls. They should not be the first thing anyone reads.
  5. **Rewrite the title as the finding.** One sentence with a number in it. If you can't write it, the dashboard is a pile of charts.
  6. **Set the size deliberately** , using the fork above, and then open it on the screen it will actually be read on.

If you have paper and five spare minutes, there's one sketch worth doing and it's optional. Draw the dashboard as empty boxes, no data, and write the one question across the top. Then cross out every box that isn't needed to answer it. Doing that on paper is much faster than doing it on the canvas, and much easier to be honest during.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Decision                   | The answer                                                              |
|----------------------------|-------------------------------------------------------------------------|
| How many views             | Two or three, per Tableau's own guidance                                |
| Which views survive        | The ones needed to answer one question for one audience                 |
| What to do with the rest   | Move them to a dashboard for their real audience. Do not delete.        |
| Why dashboards get crowded | One dashboard serving several purposes and several audiences at once    |
| Upper-left corner          | The most important view, spanning if it can                             |
| Why upper left             | Most viewers scan web content starting at the top left                  |
| Filters and legends        | Right side or under the title. They are controls, not content.          |
| Fixed sizing               | Exact dimensions. Identical for everyone. Use when you know the screen. |
| Automatic sizing           | Tableau adapts dimensions to screen size. Placement can shift.          |
| Range sizing               | Flexes between a minimum and a maximum you set                          |
| Device layouts             | Design a separate arrangement for phone or tablet in Tableau Desktop    |
| Best headline encoding     | Length or position along a scale. Bars before pies.                     |
| The title                  | States the finding, with a number. Not the subject.                     |
| When to test the size      | On the screen it will be read on, before calling it finished            |

**The one habit to keep.** Write the sentence before you drag anything onto the canvas. One question, one named person. Every other decision on this page falls out of that sentence, and a dashboard that can't produce one is telling you something you need to know before you spend the afternoon on layout.

One last thought, and I'd like other people's answers. The thing that changed my own dashboards was realizing that a view failing the test doesn't get deleted, it gets moved, which is what finally made cutting them possible. What's the view you kept on a dashboard for months before admitting it was there for somebody else?

## References

  * Tableau. Best practices for effective dashboards. _Tableau Desktop and Web Authoring Help_ , current version. help.tableau.com. The authority for the product behavior and guidance described here.
  * Sarikaya, A., Gleicher, M., & Szafir, D. A. (2019). What do we talk about when we talk about dashboards? _IEEE Transactions on Visualization and Computer Graphics_ , 25(1), 682–692.
  * Bach, B., Freeman, E., Abdul-Rahman, A., Turkay, C., Khan, S., Fan, Y., & Chen, M. (2023). Dashboard design patterns. _IEEE Transactions on Visualization and Computer Graphics_ , 29(1), 342–352.
  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531–554.

---

*Originally published on Analyst Prep Kit: [Your Tableau Dashboard Needs Two or Three Views, Not Eight](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-sheets-to-dashboard/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
