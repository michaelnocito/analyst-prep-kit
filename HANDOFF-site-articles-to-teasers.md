# Handoff — cut the site articles back so the PDF books are worth buying

**Written 2026-07-30.** For a fresh chat taking this over. Read it all before
editing a single page.

---

## 1. The job

Mike sells 13 PDF guide books built from this repo (see §3). Today the books and
the website are the same words, so a book is only a convenience purchase: one
file, offline, printable, searchable.

He wants the site content rewritten to be **informative but direct and limited**,
with the depth living in the books. His words: "so they are teasers (but
informative) for the pdf packs."

**Informative is the load-bearing word.** A teaser that withholds the point is
not what he asked for and it violates `marketing/ARTICLE_STANDARD.md`, which
bans curiosity gaps and withheld payoffs outright. A reader who only ever reads
the free version must still leave with something they can use. The book is for
the reader who wants the whole method, not the reader who wants the answer.

---

## 2. ⚠️ Read this before you plan anything

**On 2026-07-30 Mike deleted the paywall, emphatically, and told me to stop
raising it.** See `CHANGELOG.md` v2.0.0 and memory `project_freemium_ecosystem`.
The gate, the All-Access Pass and the unlock code are gone from the repo. His
position: every lesson in every kit is open to everyone.

Cutting site content to make the books worth buying is, in effect, a softer
version of the thing he just killed. That is not a reason to refuse the work.
It is a reason to scope it so it does not contradict a decision he made hours
earlier and clearly cares about.

**✅ DECIDED (Mike, 2026-07-30). Scope is the 42 guides only. Do not ask again.**

He also ruled that search traffic is not a concern here, so §6 is informational
only. Cut the long guides freely; do not spend a chat on Search Console first.

**The scope, as decided:**

- **Cut the 42 long-form `guides/`.** These are 800 to 5,000 word essays. They
  are the genuine overlap with the books, they are what makes the books thick,
  and shortening them costs a learner nothing structural.
- **Leave the ~253 kit lessons completely alone.** They are the free product. He
  said every lesson is open to everyone. Trimming them would make that untrue.

That split keeps his stated position intact while still giving the books
something the site does not have. It is settled. Start work, do not re-open it.

---

## 3. What is being sold, so you know what each article should point at

Built by `tools/build-guidebook.js` into `dist/` (gitignored). Listing copy and
prices live in `C:\Users\Mike\Projects\packs-internal\GUIDE_BOOKS_LISTINGS.md`.

| Book | $ | Site content it draws from |
|---|---|---|
| SQL for Analysts | 19 | `sql/` + 11 `guides/sql-*` |
| Excel for Analysts | 19 | `excel/` |
| Python for Analysts | 19 | `python/` |
| Power BI for Analysts | 19 | `powerbi/` |
| Tableau for Analysts | 19 | `tableau/` + 4 Tableau guides |
| Statistics for Analysts | 19 | `stats/` |
| Thinking Like an Analyst | 19 | 11 analyst-thinking guides |
| Charts and Visualization | 12 | `chart-literacy/` |
| Forecasting for Analysts | 12 | `forecasting/` |
| The Data Migration Playbook | 29 | 16 `guides/migration-*` |
| Core Analyst Pack | 39 | SQL + Excel + Stats + thinking |
| BI Tools Pack | 39 | Tableau + Power BI + Charts |
| The Complete Analyst Library | 79 | everything |

Under the recommended scope, the guides map to three books: **SQL**, **Data
Migration** and **Thinking Like an Analyst**. Those are the three to work on.

---

## 4. What "informative but limited" should actually mean

Do not write a summary with the good part removed. Write a complete smaller
thing. The test: a reader who never buys should be able to do one real task.

For each guide, keep:

- The **payoff**, in the first two lines. `feedback_payoff_first` is canon and it
  outranks everything else.
- **One** worked example, carried all the way through. Not three.
- The **single most useful rule** in the piece, stated plainly.
- An honest line about what the book adds. Not a cliffhanger. Something like
  "the book works through the other five join types the same way, and the two
  counts that catch a silent multiply."

Move to the book:

- The other worked examples
- The edge cases and failure modes
- The reference tables
- The academic citations

**Target length: 700 to 1,000 words**, down from 800 to 5,000. Some guides are
already at target and need only the pointer added.

---

## 5. Hard rules you inherit

Read these before writing. They are canon and they are not negotiable.

- `marketing/ARTICLE_STANDARD.md` — the article bar. No curiosity gaps, no
  withheld point, no manufactured stakes, reader can orient at any point.
- `CURRICULUM_STANDARD.md` — the always-visible directive rule.
- `packs-internal/PACK_BIBLE.md` Part 1 — the value block, for any copy that
  sells. Outcome first, contents second, limits named.
- Memory `feedback_no_free_framing` — never sell on price or on "free".
- Memory `feedback_no_negative_marketing` — never position against anyone.
- Memory `feedback_banned_phrases` — no em-dashes, no "plain English", no
  "gotcha".
- Memory `feedback_no_insider_words` — "rung", "ladder", "rig", "kit" as a
  common noun: none of these reach the screen.
- Memory `feedback_solo_authorship` — commit as Michael Nocito, no AI trailers.

---

## 6. SEO, which is the real risk

These guides are the traffic plan (`HANDOFF-traffic-growth.md`). Cutting a
4,700-word ranking page to 900 words can cost the ranking that brings the buyer.

**Mike has ruled this is not a concern (2026-07-30): there is not enough traffic
to protect.** Kept for the record only. If that ever changes, check Search Console for which guides have
impressions. A guide that is ranking is a customer pipeline and should be cut
last, or not at all. A guide with zero impressions can be cut freely.

`sql-joins` (4,739 words), `sql-foundations` (4,078) and `tableau-concepts`
(5,161) are the biggest and the most likely to be earning. Treat them as the
riskiest edits, not the most obvious ones.

If Search Console shows real traffic, the better move on those three is to leave
the article long and add the book pointer, and take the length out of the guides
nobody is finding.

---

## 7. Where the buy link goes

Every trimmed guide ends with one pointer. One, not three.

- Not a banner, not a popup, not mid-article.
- After the content, in the closing block.
- Names the book, says what it adds, links to the Gumroad product.
- Gumroad URLs are `michaelnocito.gumroad.com/l/<slug>` and do not exist yet.
  **Get the real URLs from Mike before writing links.** The books were created
  unpublished on 2026-07-30.

---

## 8. Sequencing

1. Get the live Gumroad URLs from Mike (§7). Nothing else blocks you.
2. Rewrite in batches, **one book's worth per chat** (`feedback_backlog_discipline`,
   `project_apk_kit_rollout_train`). Start with Data Migration: 16 guides, one
   clean book, and the material with the least search traffic to lose.
3. Verify on the live URL after each batch (`feedback_verify_deploy_not_push`).

---

## 9. State when this was written

- 13 books built and verified. Real page numbers in every contents.
- Covers generated to `dist/cover-<id>.png`.
- Gumroad listings created **unpublished**. Mike publishes.
- No site article has been touched yet. This handoff is the whole of that work.
