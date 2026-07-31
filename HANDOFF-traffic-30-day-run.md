# Handoff — the 30 day traffic run

**Written 2026-07-30.** For a fresh chat. Read it all before posting anything.

This supersedes the channel evaluation in `HANDOFF-traffic-growth.md`. That file
asked which channels to try. This one picks one and runs it. Keep the older file
for its audience definition and brand guardrails, which still hold.

---

## 1. The situation, stated plainly

**Gumroad shows 0 sales, $0 revenue, all time.** The SQL prompt pack has been
listed at $7 and has sold nothing. That is the cleanest signal available and it
is not about price or quality. Nobody is arriving.

Ten books went live on 2026-07-30. That did not change the constraint. Thirteen
products times zero visitors is still zero.

**The arithmetic.** A digital product page converts roughly 1 to 3% of visitors.
Treat that as a rough rule, not a law. At $19, one sale needs somewhere around
50 to 100 people to actually open the page. The whole job is putting people
there.

**Honest expectation.** Without daily work, close to zero sales in 30 days. With
it, a realistic outcome is one to five sales and $40 to $200. That is not a
disappointing result for a cold start with no list. It is the normal shape of
month one, and the point of it is the list and the evidence, not the money.

---

## 2. What is already built, so you do not redo it

- **10 books published** on Gumroad, all with descriptions, summaries, tags,
  category, receipts and the VAT flag set.
- **All 42 guides** on the site link to the matching book, tracked as
  `guide_book_click`.
- **The hub has a books section**, tracked as `hub_book_click`.
- Both verified live on 2026-07-30, not merely pushed.
- **GA4 is `G-6C09BL3WH1`** across every analyst site.

The internal funnel is done. Do not spend this month improving it further. The
next marginal hour belongs outside the site.

---

## 3. The one thing to lead with

**The Data Migration Playbook, $29.**

Not SQL. Every SQL book competes with a thousand free tutorials and Mike has no
authority advantage there. Migration is different:

- there is no shelf of data migration playbooks
- the buyer is a consultant or implementation analyst with a company card
- Mike has ten years of doing it, which is the credential
- it is the highest priced single at $29
- the material is genuinely his, not a rewrite of public knowledge

Everything else is secondary this month. One product, one audience, one message.

---

## 4. The channel: LinkedIn, plus one written piece a week

Pick one channel and be consistent. Mike has about 150 LinkedIn connections,
which is small but warm, and LinkedIn activity doubles as job-hunt visibility,
which matters because **the job hunt outranks traffic** (see
`project_career_targeting`). This is the only channel where the two goals pull
the same direction.

### The weekly rhythm

| | |
|---|---|
| **3 posts a week on LinkedIn** | Short. One idea from one guide. No link in the post body; put it in the first comment, because LinkedIn suppresses posts with outbound links. |
| **1 long piece a week** | Published on LinkedIn articles or dev.to. Full standalone value, book pointer at the end. |
| **10 direct messages, once** | Week one only. Individual, not broadcast. See §6. |

### What a post looks like

Take one specific thing from a migration guide and tell it straight. The
internal handoff from Sales before the client kickoff. Why the polite nudge
fails when a client goes quiet. The two counts that catch a silent multiply.

Each of those is a post. There are 42 guides, so there is no content problem,
only a consistency problem.

**The post must stand alone.** Somebody who never clicks should still get
something. That is `marketing/ARTICLE_STANDARD.md` and it is not negotiable for
a link click.

---

## 5. Week by week

**Week 1 — warm audience.** Three posts from the migration guides. One long
piece: pick the strongest single guide, publish it whole. Ten individual
messages (§6). Set the baseline in GA4 before anything goes out.

**Week 2 — repeat, and add one outside room.** Same rhythm. Add one comment a
day somewhere the buyer already is, answering a real question with no link at
all. Build the account before it ever asks for anything.

**Week 3 — the free thing.** Publish one genuinely useful free download, gated
behind an email address. The obvious candidate is a single sheet from the
migration toolkit, the reconciliation sheet or the gate sign-off. This starts
the list, which is the only asset here that compounds.

**Week 4 — read the numbers and decide.** See §7. Do not change the plan
mid-month on a hunch; change it at the end, on data.

---

## 6. The ten messages, week one only

Not a broadcast post. Ten individual messages to people who have actually done
implementations or migrations.

- name the specific thing you wrote
- offer it, do not sell it
- give a few away free and say so plainly
- ask for nothing in return

First sales almost always come from people who already trust you. There is also
a mechanical reason: **Gumroad Discover needs at least one completed sale plus
their risk review before it will show the products to strangers at all.** Until
then the store is invisible to anyone not sent there.

---

## 7. What to measure

Set the baseline before week one. Then at the end of week 4, four numbers:

| Number | Where |
|---|---|
| Sessions on the site | GA4 |
| `guide_book_click` and `hub_book_click` | GA4 events |
| Gumroad product page views | Gumroad analytics |
| Sales | Gumroad |

**The diagnosis is in the ratios, not the totals.**

- Few sessions: the posting is not reaching anyone. Change the channel or the message.
- Sessions but few book clicks: the guides are not connecting to the books. Fix the pointers.
- Book clicks but no sales: the Gumroad page is losing them. Fix price, copy or covers.

Guessing which of those three is wrong, without the numbers, is how a month gets
wasted.

---

## 8. Do not

- **Do not post the same thing to five subreddits.** It is the fastest way to a
  permanent ban and it cannot be undone. If Reddit is used at all, comment
  helpfully for two weeks with no links before ever mentioning a product.
- **Do not buy ads.** Not at zero conversion data. You would be paying to learn
  something a free week of posting teaches.
- **Do not lead on price or on anything being free**
  (`feedback_no_free_framing`).
- **Do not position against anyone** (`feedback_no_negative_marketing`).
- **Do not use em-dashes, "plain English", or "gotcha"**
  (`feedback_banned_phrases`).
- **Do not build more product this month.** More product is the thing there is
  already too much of relative to audience.
- **Do not let this outrank the job hunt.** If a week forces a choice, the job
  hunt wins.

---

## 9. The honest comparison, keep saying it

If the goal is money inside 30 days rather than building an asset, **Upwork and
the gig platforms will out-earn ten books**, because they put Mike in front of
people already looking to pay someone. See `project_upwork_profile` and
`project_gig_site_onboarding`.

The books are a good long game and a poor 30 day plan. Both things are true and
the next chat should say so rather than quietly implying month one will pay.

---

## 10. Posting on Mike's behalf

Drafting is free. **Posting is not reversible.** A self-promotional first post
can get an account banned, and it carries his name and his job search.

Write the posts, show them to him, and post only what he has read and approved.
Do not batch-schedule anything he has not seen.
