This article gives you chart design as two moves you can run on any chart in five minutes. **Move one: take away everything not carrying meaning.** **Move two: point, with one color, at the thing you want the reader to see.** Everything else in chart design is refinement of these two.

The reason both moves work is the same fact: a reader gives a chart a few seconds, and everything on it competes for those seconds. Whatever you leave on the chart, you are spending the reader's attention on. Spend it on the finding.

**The short version.** Delete the legend, gridlines, axis or labels, whichever half is redundant, and the field buttons always. Grey every bar that is context. Spend the one accent color on the subject, even when the subject is the small bar.

The worked example is the hero chart from [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/): hidden games against found games, the chart the whole dashboard argues from. What follows is what came off it, what went on it, and why.

## Move one: take things away

Excel turns everything on by default, and it has a good excuse: it does not know what your chart is about. You do. That asymmetry is the entire method. Every default element is a guess about what might help some reader somewhere. You know the finding, so you can name, for each element, whether it carries meaning for this chart. If it does not, it is taking attention from something that does.

Before the list: picture the last chart you made, and name one element on it that a reader never needed. Nearly everyone can, immediately, which tells you how the defaults err.

## What came off the real chart, item by item

| Removed           | Why it carried nothing here                                                                     |
|-------------------|-------------------------------------------------------------------------------------------------|
| The legend        | It named one series. There was only one. A one-entry legend is a label for nothing              |
| The field buttons | Pivot-chart editing controls. They are interface, not information, and they ship in screenshots |
| The gridlines     | Their job is helping the eye estimate values. The data labels do that job exactly               |
| The vertical axis | Same job as the gridlines, already done by the labels                                           |

And one thing went on: **data labels** , the exact number on each bar. That is the trade at the heart of move one. Labels give precise values, so the two estimation aids, axis and gridlines, become redundant and come off. A chart with axis, gridlines AND labels answers the same question three ways.

Nothing here says gridlines are bad. On a chart with many bars and no labels, gridlines are the right tool and labels would be clutter. The rule is not a list of banned elements. It is one question asked per element: what job is this doing, and is anything else already doing it?

## The never-twice rule

That question generalizes into the rule you can carry: **never make the reader do the same job twice.** An axis and data labels are two ways to read one number. A legend and direct labels on the bars are two ways to learn one name. Say which one earns its place, keep it, and delete the other. Twice is not thoroughness. Twice is noise wearing thoroughness's clothes.

## Move two: point

With the clutter gone, every bar is still the same color, and the reader has to work out which one matters. Color is how you answer that before they ask. Color is not decoration. It is a pointer.

The method: **mute what is context, save the color for the thing you want them to look at.** Context bars go grey. The subject gets the one accent color. One, because two accents is two pointers, and two pointers point at nothing.

The counter-intuitive part, and the build hit it head on: on the hero chart, the story is not the tall bar. The found games' huge audience is the context. The subject is the tiny bar, the 175 hidden games with almost nobody playing them. So the tall bar went grey and the small bar got the color. Say the principle out loud, because it runs against instinct: **emphasis follows the subject, not the size.** If the finding is about the small thing, the small thing gets the ink.

## The two-click trick

The mechanic that makes single-bar coloring possible, and the thing this article exists to teach your hands:

  1. **Click any bar once.** Excel selects the whole series. Recoloring now recolors everything, which is how people end up believing single-bar color is impossible.
  2. **Click the same bar again.** One click, not a double-click. Now just that bar is selected, and Format Data Point colors it alone.

First click, the series. Second click, the point. Grey the series with the first selection, then accent the subject with the second. The same two-click selection works in Tableau and Power BI, which is part of why this is a method and not an Excel tip.

## Titles state the finding, with its comparator

The title is the most-read text on the chart, and the default, Chart Title, or a field name like Sum of EstOwnersMid, spends that position on nothing. Write the finding into it: the sentence the chart argues, with a number in it.

The build caught a subtler failure worth passing on. The draft title said "Found games reach 21x the audience." Read it cold: 21 times _what_? A reader arriving fresh has no comparison. The shipped title says "Found games reach 21x the audience of hidden ones." Same title, finished. **A comparative claim carries its comparator** , because the reader was not in the room where the comparison was set up.

Cover your own chart's title and read the bars alone. Then read the title. If the title tells the reader what to conclude, and the bars back it up, the chart is done arguing. That division of labor, title claims, bars prove, is the whole relationship.

## Why this works

Both moves are applications of measured results, not taste.

Taking away: Cleveland and McGill's graphical perception experiments established that readers extract values most accurately from position and length judgments, and that accuracy degrades as more visual work is demanded (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531-554). Redundant elements demand visual work without adding information, which is the definition of the stuff move one deletes.

Pointing: color singletons are found fast. Treisman and Gelade's feature-integration experiments showed that a target differing from its surroundings in one feature, like color, pops out in essentially constant time regardless of how much else is on the display (Treisman & Gelade, 1980, _Cognitive Psychology_ , 12(1), 97-136). One accented bar among grey ones is exactly that: the reader's eye lands on the subject before they have decided to look for anything.

## Run it on your own chart

  1. **Open your most recent chart and inventory it.** Legend, gridlines, axis, labels, title, field buttons. Name each one's job.
  2. **Delete every element whose job is already done** by another element. Click it, press Delete. The never-twice rule decides.
  3. **Grey the series.** One click, then a grey fill.
  4. **Accent the subject.** Second click on the one bar the finding is about, then the one accent color. Ask first: is the story the big bar, or the small one?
  5. **Rewrite the title as the finding** , number and comparator included.
  6. **Glance test.** Look away, look back, and notice where your eye lands. It should land on the accented bar, then the title. If it lands anywhere else, something survived move one that should not have.

## A cheat sheet

| Element       | Keep when                                 | Delete when                              |
|---------------|-------------------------------------------|------------------------------------------|
| Legend        | Several series need naming                | One series, or bars are labeled directly |
| Gridlines     | Many values, no data labels               | Data labels are on                       |
| Value axis    | No labels, reader estimates               | Data labels are on                       |
| Data labels   | Few bars, exact values matter             | Dozens of bars, labels become texture    |
| Field buttons | Never on anything shipped                 | Always. Right-click, hide all            |
| Color         | One accent on the subject, grey context   | Rainbow series with no subject           |
| Title         | States the finding, number and comparator | Restates a field name                    |

**The one habit to keep.** Before shipping any chart, ask of every element: what job is this doing, and is anything else already doing it? Then ask of the color: where do I want the first glance to land? Two questions, five minutes, every chart.

## References

  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531-554.
  * Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. _Cognitive Psychology_ , 12(1), 97-136.

The element you named at the top, the one your reader never needed: is it still on the chart? Two clicks from now it does not have to be.

---

*Originally published on Analyst Prep Kit: [Chart Design Basics: Take Things Away, Then Point](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-chart-design-basics/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
