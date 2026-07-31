# Handoff — drive traffic to the Gumroad store

**Written 2026-07-31.** For a fresh chat. Read it all before touching anything.

Companion to `HANDOFF-traffic-30-day-run.md`, which sets the weekly posting
rhythm. This one covers the store itself, cross-linking across every property,
and paid outreach.

---

## 1. The state, so you do not rediscover it

**Live and selling:** 10 books on Gumroad, `michaelnocito.gumroad.com/l/<slug>`,
plus the $7 SQL prompt pack. **Zero sales, all time.**

**Built, not yet listed** (blocked, see §2):

| Item | File | Price |
|---|---|---|
| Migration Gate Sign-off Sheet | `migration-toolkit/dist/Migration-Gate-Sign-off-Sheet.xlsx` | **$0**, the list builder |
| The Data Migration Toolkit | `migration-toolkit/dist/Data-Migration-Toolkit-{TEMPLATE,WORKED-EXAMPLE}.xlsx` | ~$39, Mike to confirm |
| Core Analyst Pack | `analyst-prep-kit/dist/pack-core.pdf` | $39 |
| BI Tools Pack | `analyst-prep-kit/dist/pack-bi.pdf` | $39 |
| The Complete Analyst Library | `analyst-prep-kit/dist/pack-everything.pdf` | $79 |

Art for all of them is built: `cover-*.png` and `thumb-*.png` in each `dist/`.

**Already cross-linked:** all 42 guides in `analyst-prep-kit/guides/` and the hub
`index.html`. GA4 events `guide_book_click` and `hub_book_click`. Nothing else
on any other property links to Gumroad yet. That is the main job here.

---

## 2. ⚠️ Two things that will waste your time

**Gumroad caps product creation at 10 per rolling 24 hours.** Not per calendar
day. Ten were created around 19:00 on 2026-07-30, and a 08:00 attempt on 07-31
was still refused. Assume the window clears about 24 hours after the tenth. If
you see "Sorry, you can only create 10 products per day", stop and come back
later; there is no way around it.

**Never buy your own product to unlock Discover.** Gumroad's own help page says
charging your own card "appears exactly the same as money laundering to our
security systems, and your account may be automatically suspended as a result",
and that they are "required by our banking partners to refund these sales". The
test-purchase feature exists for checking the flow and does not count as a sale.
Discover needs one real stranger to buy one thing.

**Uploads cannot be automated.** The browser extension refuses files outside a
shared session folder, and desktop control is read-only for browsers, which is
what the Windows file picker counts as. Mike attaches the PDF, cover and
thumbnail by hand for every product. Everything else on the page you can do.

---

## 3. First job: finish the store

Once the cap clears. In this order, because the $0 sheet is what every link
should point at.

1. **Migration Gate Sign-off Sheet, $0.** Digital product, not E-book. This is
   the email capture: Gumroad takes the address at checkout and it lands in the
   audience you can write to from the Emails tab.
2. The three packs, then the Toolkit.
3. For each: name, price, URL slug, description, summary, Call to action set to
   "Buy this", category Education, five tags, the receipt text, and the
   **e-publication for VAT** switch on for the PDF books (not the spreadsheets).
   Copy for the books is in `packs-internal/GUIDE_BOOKS_LISTINGS.md`.

**Email capture works today without any of this.** The Gumroad follow link
`https://michaelnocito.gumroad.com/subscribe` is live and verified. Use it as
the fallback if the store work slips.

---

## 4. Second job: cross-link every applicable property

**"Where applicable" is a question, not an assumption** (`feedback_triage_cross_kit_pass`).
Work the matrix below rather than bulk-adding a footer everywhere.

Sites confirmed live on 2026-07-31:

| Property | Link to Gumroad? | What to link, and where |
|---|---|---|
| `analyst-prep-kit` | **Done** | 42 guides + hub. Add the $0 sheet when it exists. |
| `michaelnocito.github.io` (personal site) | **Yes** | It is the job-hunt landing page. One line, understated. Books prove the expertise; do not turn it into a shop. |
| `prep-loop` | **Yes** | Analyst audience, warm. One pointer in the footer. |
| `spreadsheet-archaeology` | **Yes** | Excel audience. Link the Excel book only. |
| `tableau-archaeology` | **Yes** | Link the Tableau book only. |
| `prep-companion-apps` (excel, sql) | **Yes** | Link the matching book on each. |
| `sql-dry-run` | **Yes** | Link the SQL book. |
| `nexus-sql-mystery` | **Yes** | Link the SQL book. |
| `sql-quest` | **Decide with Mike** | It is a game with a broad audience. A buy link may break the feel. Ask. |
| `excel-interview` | **Decide with Mike** | Local-only tool per memory. Check whether it is genuinely public first. |
| `steam-hidden-gems-list`, `streaming-`, `music-` | **Yes, one line** | These are the SQL portfolio pieces. A reader who likes the analysis is exactly the buyer. Link SQL and Thinking Like an Analyst. |
| `recordforge`, `spreadsheet-cleaner`, `keygarden`, `draw-lab`, `play-area`, `art` | **No** | Wrong audience. Do not link. |

**Rules for every link you add**

- One pointer per page. Not a banner, not a popup, not mid-article.
- After the content, in the closing block.
- Name the book and say what it adds. No "check out my store".
- Track it: `onclick="if(window.gtag)gtag('event','book_click',{from:'<site>'})"`.
  GA4 is `G-6C09BL3WH1` on every analyst property.
- Add UTM tags on links from outside the sites, so GA4 can separate them:
  `?utm_source=linkedin&utm_medium=social&utm_campaign=migration`.
- Verify on the live URL after each site (`feedback_verify_deploy_not_push`).

---

## 5. Third job: outreach, cheapest first

**Free, and where the return is**

1. **LinkedIn.** 150 warm connections and it doubles as job-hunt visibility.
   Three short posts a week plus one long piece. Link in the first comment, not
   the post body.
2. **dev.to.** Full articles, its own audience, supports a canonical link back
   to the site so it does not compete with your own SEO. Mike needs to create
   the account; a fresh chat cannot.
3. **Ten direct messages, once.** To people who have actually run migrations.
   Offer the sheet, ask for nothing. First sales come from warm contacts, and
   one real sale is what unlocks Discover.
4. **Bluesky.** Small but active in data circles, and unlike LinkedIn it does
   not punish outbound links. Cheap to try.
5. **Reddit: not yet.** Highest reach, fastest ban. Two weeks of helpful
   comments with no links before ever mentioning a product, or skip it.

**Paid: the Facebook boost**

Mike has just been set up as a content creator and can boost a post. Treat it as
a test with a budget cap, not a channel.

- **Boost the free sheet, never the $29 book.** Cold Facebook traffic converting
  on a $29 professional PDF is unlikely. Cold traffic giving an email for a
  useful spreadsheet is plausible. The email is the asset.
- **Cap it at $20 to $30.** Enough to learn, small enough that a null result
  costs nothing that matters.
- **Target by job title and interest**: data analyst, implementation
  consultant, business analyst, Smartsheet, data migration. Not "everyone".
- **Send it to the $0 product page**, with a UTM tag, not to the site root.
- **What success looks like:** an email costing under about $1. Above roughly
  $3 an email, stop, and say so plainly rather than letting it run.
- Report the number honestly either way. A failed $25 test that is measured is
  worth more than an unmeasured one that "seemed to do something".

---

## 6. What to measure

Baseline everything before the first post or the first boost.

| Number | Where |
|---|---|
| Sessions, and by source | GA4 |
| `guide_book_click`, `hub_book_click`, `book_click` | GA4 events |
| Gumroad product page views | Gumroad analytics |
| Followers and $0 downloads | Gumroad audience |
| Sales | Gumroad |

Read the ratios, not the totals. Few sessions means the outreach is not
landing. Sessions with no clicks means the pages are not connecting. Clicks with
no sales means the Gumroad page loses them.

---

## 7. Guardrails

- `marketing/ARTICLE_STANDARD.md` is the bar for anything written.
- `feedback_no_free_framing` — never sell on price or on anything being free.
  The $0 is visible on the page and does not need selling.
- `feedback_no_negative_marketing` — never position against anyone.
- `feedback_banned_phrases` — no em-dashes, no "plain English", no "gotcha".
- `feedback_solo_authorship` — commit as Michael Nocito, no AI trailers.
- **The job hunt outranks this.** If a week forces a choice, the job hunt wins.
- **Nothing gets posted or boosted until Mike has read it.** Drafting is free,
  publishing is not reversible, and it carries his name during a job search.

---

## 8. The honest note to keep repeating

Ten books, a toolkit and a store is a good asset and a poor 30-day earner. If
the goal is money this month, Upwork and the gig platforms put Mike in front of
people already looking to pay someone. Say that plainly rather than implying
month one will pay.
