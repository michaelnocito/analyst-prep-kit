# Dashboard standard

Set 2026-08-04, after the Steam Hidden Gems Excel dashboard shipped.

Governs every visual I build for the portfolio, in any tool. Excel, Tableau,
Power BI, a chart in a notebook. If it is a picture of data with my name on it,
this applies.

## The rule

**Every visual ships with the reasoning behind it, written down.**

Not what the chart shows. Why it is that chart, in that form, with those
things taken off.

Two reasons, and both matter.

It teaches. A reader who sees a finished dashboard learns nothing about how to
make one. A reader who sees the choices learns the method.

It lets me talk. In an interview nobody asks what a bar chart is. They ask why
I built it that way, and the answer has to be ready and specific. Writing it
down is how it gets ready.

## Required README sections, in this order

1. **The finding**, three sentences, then the screenshot
2. **The headline numbers**, as a table
3. **The question**, with both possible answers named before the data decides
4. **What I found**
5. **The obvious objection**, answered before anyone makes it
6. **What I threw away**
7. **What I checked before publishing**
8. **Why it looks like this** (this standard)
9. **How it is built**
10. **Files**, and build it yourself

Sections 6, 7 and 8 are the ones that do the work. The rest shows tool skill,
which is the cheap part.

## What section 8 must contain

One block per element on the page. Every block answers three questions:

- **What I chose.**
- **What I turned down.** Name a real alternative, not a straw one.
- **Why.** Tie it to what the reader is meant to take away.

Cover at minimum:

- The headline numbers. Why those, why that many, why formatted that way.
- Each chart. Why that chart type. What other chart was considered.
- Color. What is muted, what is emphasised, and why the emphasis is on the
  thing it is on.
- Sorting. Sorting is an analytic act, so it needs a reason.
- Anything excluded from a chart, like thin categories, and the threshold used.
- Any table. Why that many rows, sorted by what, why those columns.
- The page. Layout order, what lives on the answer sheet and what does not.

**Then a removal table.** Two columns, what came off and why. This is the part
readers remember, because it is the part nobody else writes.

## The rules the reasoning should keep landing on

These came out of the first build. They repeat because they are the actual
principles, not decoration.

- A number earns a spot only if it changes what you do next.
- Never make a reader do the same job twice. An axis and data labels are two
  ways to read one number.
- Color is a pointer, not decoration. Mute the context, color the subject.
  The subject is not always the biggest shape.
- **Never spend the accent on the numerous thing.** Added 2026-08-09 out of the
  guides index. That page gave its only accent colour to all 131 card titles and
  left the 10 section headings in near-black, so the things you were choosing
  between shouted louder than the signposts meant to help you choose. An accent
  used everywhere is not an accent, it is the body colour. Count how many
  elements carry it before adding one more.
- Sorted hands the reader the ranking. Unsorted makes them work it out.
- Rates compare groups of different sizes. Counts just show which group is big.
- Everything on a page competes for the same attention. Anything not carrying
  meaning is taking attention from something that is. **Inside a chart this
  stands.** For whether a non-informational element may exist elsewhere on a
  page, the ban was replaced by a four-gate friction test on 2026-08-09; see
  `marketing/ARTICLE_STANDARD.md` section 4b. Charts are not a wayfinding
  surface, so the strict reading still applies here.
- Format changes appearance. Typing changes substance. Never fake a number to
  make it look right.

## The test

Read section 8 back with the dashboard covered up. Could someone rebuild the
page from the reasoning alone, and would they understand why rather than just
what?

If a block says a choice was made but not what was rejected, it is not
finished. "I used a bar chart" is a description. "I used a bar chart instead
of a scatter, because the finding is a comparison of two groups and a scatter
makes the reader find it themselves" is a decision.

## Worked example

`steam-hidden-gems/excel/README.md`, section "Why it looks like this".
Every future dashboard copies that shape.

Voice rules apply throughout: `marketing/VOICE.md`. No em-dashes. One idea per
sentence. Define terms where they are used.
