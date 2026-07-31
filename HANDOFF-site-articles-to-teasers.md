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
- **The URLs exist. Use these exactly.** All are `https://michaelnocito.gumroad.com/l/<slug>`:

| Book | Slug |
|---|---|
| SQL for Analysts | `sql-for-analysts` |
| Excel for Analysts | `excel-for-analysts` |
| Python for Analysts | `python-for-analysts` |
| Power BI for Analysts | `power-bi-for-analysts` |
| Tableau for Analysts | `tableau-for-analysts` |
| Statistics for Analysts | `statistics-for-analysts` |
| Thinking Like an Analyst | `thinking-like-an-analyst` |
| Charts and Visualization | `charts-and-visualization` |
| Forecasting for Analysts | `forecasting-for-analysts` |
| The Data Migration Playbook | `data-migration-playbook` |

  ⚠️ As of 2026-07-30 only `sql-for-analysts` is published. The rest are live
  listings awaiting their files. **Check the link resolves before shipping a
  page that points at it**, or you publish a dead buy link.

---

## 7b. ⚠️ Read this before you cut a single guide (added 2026-07-31)

**The books are generated from the site pages.** `tools/guidebook-data.js`
reads `guides/<slug>/index.html` and nothing else. As originally written, this
handoff would have deleted the same words from the book it was trying to make
worth buying. The Playbook would have dropped from 53 pages to roughly 30, and
the $29 listing that promises 53 pages would have become false.

**The fix is in and tested.** A guide can now keep its full-length text in a
book-source file outside this repo, at
`C:\Users\Mike\Projects\packs-internal\guidebook-source\<slug>.html`. Outside,
because this repo is public. When that file exists the book builds from it and
the site page is free to be short. When it does not, the site page is the
source, exactly as before.

**Nothing is split yet, so nothing has moved.** All 42 guides still build from
their live pages.

**The order of operations is not optional:**

1. `node tools/split-guide.js <slug>` snapshots the full page into the book
   source. Do this FIRST.
2. Then cut `guides/<slug>/index.html` back.
3. `node tools/split-guide.js --status` shows what is split and flags any
   stored chapter that is shorter than its own live page.

Re-seeding after the page is cut would overwrite the long version with the
short one. The tool refuses that and exits non-zero. If a split chapter needs
to change, edit the book-source file by hand.

**Once a guide is split, the book source is the only copy of the long text.**
See §10.

---

## 8. Sequencing

1. Confirm with Mike which books are published (§7). Nothing else blocks you.
2. Rewrite in batches, **one book's worth per chat** (`feedback_backlog_discipline`,
   `project_apk_kit_rollout_train`). Start with Data Migration: 16 guides, one
   clean book, and the material with the least search traffic to lose.
3. Verify on the live URL after each batch (`feedback_verify_deploy_not_push`).

---

## 9. State when this was written

- 13 books built, tagged for screen readers, and verified. Real page numbers in
  every contents. Built by `node tools/build-guidebook.js`.
- Covers and thumbnails at `dist/cover-<id>.png` and `dist/thumb-<id>.png`.
  Files staged for upload by `node tools/stage-uploads.js` into `dist/UPLOAD/`.
- 10 of 13 Gumroad listings created. Names, prices, URLs, descriptions,
  summaries, categories, tags, receipts and the VAT flag are all set. Only
  `sql-for-analysts` is published; the other nine await their file uploads,
  which Mike does by hand. The three packs hit Gumroad's 10-per-day cap and are
  not created yet.
- **No site article has been touched. This handoff is the whole of that work.**

---

## 10. Progress (updated 2026-07-31)

**Data Migration batch: done, live, verified on all 16 URLs.**

- All 16 migration guides carry one closing pointer at the Playbook, after
  the SQL Kit CTA. Outcome first, two sentences, per `PACK_BIBLE.md` Part 1.
  Each carries a `guide_book_click` GA4 event labelled per page.
- `book` added to the print strip list, so the PDF never carries an ad to buy
  itself.
- **No prose was cut.** These 16 were already written at 890 to 1,500 words
  against a 700 to 1,000 target, and those counts include the footer link row
  and the references. §4 covers this: already at target, pointer only.
- The Playbook is **published** and buyable at $29. §7 is out of date on that.
  Checked against the live Gumroad page, not the status code.
- The book still builds at exactly 53 pages. No regression.

**Split-source builder: built and tested.** See §7b.

**⚠️ Open, needs Mike's call.** `C:\Users\Mike\Projects\packs-internal\` is
not a git repository and has no remote. The moment a guide is split, the
book-source file there is the ONLY copy of that long text, with no version
history and no backup. Do not split the SQL or Thinking guides until that
folder is under version control with a private remote.

**Next:** SQL batch (11 `sql-*` guides plus `set-up-a-sql-database`), then
Thinking (11 guides). Both are `sql-for-analysts` and
`thinking-like-an-analyst`, both published.
