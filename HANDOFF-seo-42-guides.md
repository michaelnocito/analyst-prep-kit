# Handoff — SEO on the 42 guides

**Written 2026-07-31.** For a fresh chat. Read it all before touching anything.

Companion to `marketing/REACH_PLAN.md`, which ranks this as the highest return
per hour of work in the whole portfolio. This file is only that one item.

**A received handoff means start executing.** Do not write a plan about this
plan.

---

## 1. Why this is the top item

86% of site traffic is direct, meaning somebody was personally told. Search
sends almost nobody. The content to fix that is already written and costs
nothing new to publish.

The theory behind picking the tail rather than the head: Brynjolfsson, Hu &
Simester (2011), "Goodbye Pareto Principle, Hello Long Tail: The Effect of
Search Costs on the Concentration of Product Sales," *Management Science*
57(8):1373-1386, DOI 10.1287/mnsc.1110.1371. When search costs fall, demand
shifts toward niches. "SQL tutorial" is a head term nobody here wins. "Data
migration gate sign-off" is a tail term with almost no competition and Mike owns
the material.

**So the job is not to rank for big terms. It is to own a hundred small ones.**

---

## 2. What is already done, so you do not redo it

Audited 2026-07-31, all 42 guides in `analyst-prep-kit/guides/`:

| Thing | State |
|---|---|
| `<title>` | 42 of 42, keyword-aware and specific |
| `<meta name="description">` | 42 of 42 |
| `rel="canonical"` | 42 of 42 |
| Open Graph tags | 42 of 42 |
| `sitemap.xml` | 43 guide URLs, complete |
| `robots.txt` | Clean, sitemap declared |
| Internal links | Every guide footer links every other guide |
| GA4 | `G-6C09BL3WH1` |

The basics are genuinely done. Do not spend the session rewriting meta
descriptions that are already fine.

---

## 3. ⚠️ Do the diagnosis before any optimisation

**You cannot tell which problem this is without Search Console, and the two
problems have opposite fixes.**

Ask Mike to open Search Console for `michaelnocito.github.io` and report, for
the last 3 months, filtered to `/analyst-prep-kit/guides/`:

1. **Pages indexed vs discovered but not indexed.** From the Pages report.
2. **Total impressions and clicks.** From the Performance report.
3. **The top 25 queries by impressions**, with average position.
4. **Any guide with zero impressions.**

Then read it like this:

- **Not indexed** → a technical or authority problem. Optimising copy does
  nothing. Fix indexing, request indexing, and get external links (§5).
- **Indexed, near-zero impressions** → wrong keywords. The pages answer
  questions nobody types. Re-target the titles (§4.2).
- **Impressions, no clicks** → titles and descriptions are not earning the
  click. Rewrite those, not the pages.
- **Position 11 to 20** → the best possible news. Small on-page changes move
  page-two results to page one; nothing else in SEO is that cheap.

**Do not skip this.** Guessing which of the four it is, then spending a day on
the wrong one, is the standard way this work gets wasted.

---

## 4. The four gaps, highest value first

### 4.1 Structured data — nothing has any

**Zero of 42 guides carry JSON-LD.** This is the largest untapped technical win
and it is mechanical work.

Add to every guide:

- **`Article`** with headline, description, datePublished, dateModified, author
  (Michael Nocito), and image (the existing og image).
- **`BreadcrumbList`**: Analyst Prep Kit → Guides → this guide. Breadcrumbs
  render in results and lift click-through.
- **`FAQPage`** on any guide that can honestly carry three or more real
  questions. This is the one that wins extra space in results.
- **`HowTo`** only where the guide genuinely is a numbered procedure. Do not
  force it; wrong schema is worse than none.

**A working pattern already exists in this portfolio.**
`steam-hidden-gems-list/index.html` has a human-readable FAQ block mirrored in
JSON-LD, marked with `<!-- SEO:FAQ:START -->` and `:END`. Copy that approach.
The visible FAQ and the JSON-LD must say the same thing, or it is a violation.

**Never mark up content that is not visible on the page.** That is exactly what
gets structured data penalties.

### 4.2 Keyword targeting against real queries

Once §3 gives you the actual query data, retarget titles toward what people type
rather than what the guide is called. Keep titles under about 60 characters or
Google truncates them.

Tail terms this portfolio can plausibly own, because there is little competing
material and Mike has done the work:

- data migration gate sign-off, migration cutover checklist, migration dry run,
  data migration stages, migration exception list
- SQL teaching comments, commenting SQL queries
- operational definition data analysis, defining a metric
- entity resolution for beginners, record linkage beginners
- documenting data limitations

Migration is the strongest cluster by a distance. It is also the $29 book, so
search traffic there lands on the highest priced product.

### 4.3 Cluster the internal links

Right now every guide footer links every other guide. Forty-three flat links
tells a search engine nothing about which pages are important or related.

Restructure to hub and spoke:

- Pick the strongest guide per topic as the hub. For migration that is
  `data-migration-stages`.
- Each spoke links up to its hub with descriptive anchor text, never "read more".
- The hub links down to every spoke in its cluster.
- Keep a small "all guides" link, but stop linking all 42 from all 42.

Clusters: migration, SQL, Excel, Tableau, Power BI, Python, statistics, analyst
judgment.

### 4.4 Titles and descriptions that earn the click

Only after §3 shows which pages get impressions without clicks. Rewriting all 42
before you know which ones are failing is wasted work.

---

## 5. The part SEO people undersell

**On-page work cannot fix an authority problem.** If §3 says pages are indexed
and ranking at position 40, no amount of schema moves them. What moves them is
other sites linking here, and this site has almost none.

That is not this session's job, but say so plainly rather than promising that
markup alone will fix it. It connects to the cross-posting and Show HN items in
`REACH_PLAN.md`, which exist partly to earn links.

---

## 6. Guardrails

- `marketing/ARTICLE_STANDARD.md` is the bar for anything written, and **§9
  governs everything**: every asset teaches one usable concept.
- **Do not write content for search engines.** If a change makes a guide worse
  to read, it does not ship, whatever it does for a keyword.
- No em-dashes, no "plain English", no "gotcha" (`feedback_banned_phrases`).
  Note the existing `&mdash;` in guide titles is a separator, not prose. Leave
  it or replace with a pipe, but do not introduce em-dashes into sentences.
- Never sell on price or on anything being free (`feedback_no_free_framing`).
- Commit as Michael Nocito, no AI trailers (`feedback_solo_authorship`).
- **Verify on the live URL, not on a green push** (`feedback_verify_deploy_not_push`).
  For structured data, validate at `validator.schema.org` and Search Console's
  Rich Results Test after deploying.
- `marketing/` is gitignored on purpose. Handoffs live at repo root.

---

## 7. Order of work

1. Get the Search Console numbers from Mike. **Blocking.**
2. Report what they say, and which of the four diagnoses it is.
3. Structured data across all 42, since it is valuable regardless of the answer.
4. Whatever §3 pointed at.
5. Internal link clustering.
6. Validate live, then submit the sitemap for re-crawl.

---

## 8. The honest note

SEO pays late. Nothing here shows up in the numbers for six to twelve weeks, and
the first month may look like nothing happened. That is normal and it is not a
reason to abandon it, but nobody should expect this to produce a sale in
30 days. It is the item with the best return per hour precisely because it keeps
paying after the work stops, which is the opposite of a boosted post.

**The job hunt outranks this.** If a week forces the choice, the job hunt wins.
