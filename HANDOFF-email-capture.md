# Handoff — capture email on every property

**Written 2026-07-31.** For a fresh chat. Read it all before touching anything.

Item 2 in `marketing/REACH_PLAN.md`. Roughly 237 users a month arrive across the
portfolio and almost none are captured. A list is the only asset here that is
not rented from a platform.

**A received handoff means start executing.** Do not write a plan about this
plan.

Why a giveaway is the mechanism: Bawa & Shoemaker (2004), "The Effects of Free
Sample Promotions on Incremental Brand Sales," *Marketing Science*
23(3):345-363, DOI 10.1287/mksc.1030.0052. Free samples produced measurable
sales effects up to 12 months later, mainly through an **expansion effect**,
pulling in buyers who would never otherwise have considered the product. The
same paper also found a real **cannibalization effect**, which is why the sample
has to be the thing that makes people want the rest, not the thing that replaces
it.

---

## 1. ⚠️ Read this before building anything

**There is already an email capture system running and nobody has looked at it.**

`assets/supabase_auth_sync.js` is live on **12 kit pages** and implements:

- email and password sign-up (`signUpWithEmail`)
- email and password sign-in
- Google OAuth (`signInWithGoogle`)

Project `liiivtbyyawueboeavmw.supabase.co`. Every account created since it
shipped has an email address sitting in `auth.users`.

### Step 0, before writing a line of code

Ask Mike to open the Supabase dashboard and report:

1. **Row count in `auth.users`.**
2. **Sign-ups per month** for the last six months.
3. Whether any are Google OAuth rather than email and password.

That number changes what this session is. If there are 200 accounts, the job is
consent and activation, not construction. If there are 4, the job is that the
sign-in is invisible and nobody is being asked.

---

## 2. ⚠️ The consent problem, which is not optional

**An account created for progress sync is not permission to send marketing
email.** That is true under CAN-SPAM in the US and much more strictly under
GDPR for any EU visitor. Signing up to save your place in a lesson is not
consent to be sold to.

So:

- **Existing `auth.users` emails cannot be mailed marketing.** Do not import
  them into a newsletter. You may email them about the service itself.
- **Every new capture point needs an explicit, unticked opt-in**, with its own
  sentence saying what will be sent and roughly how often.
- **Every marketing email needs a working unsubscribe** and a real postal
  address in the footer. That is CAN-SPAM, not a nicety.
- Keep opt-in state as a real column, for example `marketing_opt_in` with a
  timestamp, so consent is provable later.

The clean way to convert the existing pool: send **one** service message about a
genuine product change, and put a plain invitation to subscribe in it. People
who click are consented. People who do not are left alone. Never assume.

---

## 3. The gating question, Mike's idea

Mike asked whether the Analyst Prep Kit should **require** signup.

**My recommendation is no, not as a hard gate on the whole kit.** Stated plainly
and then this handoff carries out whichever he picks.

Three reasons, and none of them are "gating is bad":

1. The kit is the top of the funnel for the entire portfolio. It is what the
   guides, the books, the games and the job sims all point at. A wall in front
   of it reduces the traffic feeding everything downstream.
2. It contradicts `ARTICLE_STANDARD.md` §1, give the whole thing away, which is
   the reason the material earns trust in the first place.
3. Bawa & Shoemaker's expansion effect depends on the sample reaching people who
   would never have considered the product. A signup wall filters those people
   out first. The cannibalization risk they document is real, but it argues for
   choosing the right sample, not for gating the sample.

**The ladder, weakest to strongest.** Pick a rung with Mike; do not silently
choose.

| Rung | What it does | Cost to traffic |
|---|---|---|
| **A. Passive** | A subscribe block in the closing area of each page | None |
| **B. Value exchange** ⭐ | Kit stays open. Signup unlocks progress sync across devices, and the download pack | None, and it is honest |
| **C. Soft gate** | Free through lesson 5 or the first module, signup to continue | Small |
| **D. Content gate** | The PDF, cheat sheet or download needs an email; lessons stay open | Small, and well targeted |
| **E. Hard gate** | Signup before anything | Large |

**Recommended: B plus D.** The kit stays open, the account earns its keep by
doing something the visitor actually wants, and the downloadable artefacts are
where the email is asked for. That is the same shape as the $0 Migration Gate
Sign-off Sheet, which already works this way.

If Mike wants C or E anyway, that is his call and it gets built. Say the cost
once, then build it.

---

## 4. Every way to capture, given static hosting

All properties are static GitHub Pages. There is no server, so anything needing
a backend is out unless it is a third-party endpoint or Supabase.

### Already available at zero cost

1. **Gumroad follow link.** `https://michaelnocito.gumroad.com/subscribe` is
   live and verified. Gumroad handles storage, unsubscribe and compliance.
   Lowest effort route that exists. **Start here.**
2. **Gumroad $0 product.** Email is taken at checkout and lands in the Gumroad
   audience. This is what the Migration Gate Sign-off Sheet is for.
3. **Supabase**, already wired, already paid for, already has auth. Best option
   if capture needs to live on-site rather than off-site.

### Third-party embeds, free tiers, one script tag

4. **Buttondown**, **MailerLite**, **Kit** (formerly ConvertKit). All embed as
   a form on a static page and all handle unsubscribe and compliance.
5. **Google Forms** as a stopgap. Ugly, works, no sending ability.

### Mechanisms, independent of provider

6. **Inline block in the closing area.** The pattern already used for the book
   pointers. Same placement rules: after the content, one per page.
7. **Completion capture.** On the job sims, at the completion state, where the
   visitor just finished something. Highest intent moment in the portfolio.
8. **Download gate** on any artefact: cheat sheets, templates, the sign-off
   sheet.
9. **Progress sync offer**, rung B above.
10. **Exit intent or scroll-depth prompt.** Works, and it is the most intrusive
    thing on this list. Would need Mike's explicit approval; it conflicts with
    `feedback_action_always_visible` in spirit.

**Not recommended:** popups on first load, anything that covers the primary
action, and anything that interrupts a game.

---

## 5. Which properties, and what to offer

**"Where applicable" is a question, not an assumption**
(`feedback_triage_cross_kit_pass`). Work this matrix; do not bulk-add a form
everywhere.

| Property | Capture? | Mechanism and offer |
|---|---|---|
| `analyst-prep-kit` hub and 11 kits | **Yes** | Rung B, progress sync. Auth already exists on 12 pages |
| 42 guides | **Yes** | Inline block in the closing area, beside the existing book pointer |
| `spreadsheet-archaeology` + sql, tableau tracks | **Yes** | Completion capture. The book pointer is already there; add the subscribe line to the same block |
| `sql-dry-run` | **Yes** | On the weakness report, where the book pointer already sits |
| `prep-companion-apps` excel, sql | **Yes** | Footer, next to the book pointer |
| `nexus-sql-mystery` | **Yes** | Footer |
| Steam, Streaming, Music hidden gems | **Yes, one line** | These already carry a prompt pack link and a Buy Me a Coffee link. **One pointer per page is the rule**, so this needs a decision with Mike, not a third link |
| `michaelnocito.github.io` personal site | **Decide with Mike** | It is the job-hunt landing page. A newsletter signup may not belong there during a search |
| `sql-quest`, `play-area`, `keygarden`, `draw-lab`, `art` | **No** | Wrong audience, and it breaks the feel of a game |
| `recordforge`, `spreadsheet-cleaner` | **No** | Different audience entirely |

---

## 6. What to build

1. **A single shared snippet**, not eleven bespoke forms. One file in
   `analyst-prep-kit/assets/`, styled to inherit each host page's tokens, so a
   copy change is one edit rather than twenty.
2. **Explicit unticked opt-in checkbox** with its own sentence.
3. **GA4 event** `email_capture` with a `from:'<site>'` label, matching the
   existing `book_click` pattern, so you can see which property actually
   converts.
4. **A real confirmation state.** Not an alert. Tell them what arrives and when.
5. **Double opt-in** if the provider offers it. Lower numbers, far better list.

---

## 7. What to measure

Baseline before, same numbers after.

| Number | Where |
|---|---|
| `auth.users` count and monthly rate | Supabase |
| `email_capture` events by `from` | GA4 |
| Sessions by property | GA4 |
| Capture rate per property | events ÷ sessions |
| Gumroad followers and $0 downloads | Gumroad |

**Read the rate, not the total.** 5% of 237 is 12 a month, which is the
realistic target. Under 1% means the placement is wrong or the offer is not
worth an email. Do not respond to a bad rate by making the prompt louder.

---

## 8. Guardrails

- **Never lead on price or on anything being free** (`feedback_no_free_framing`).
  Say what the thing does. "Progress that follows you between devices", not
  "free account".
- `marketing/ARTICLE_STANDARD.md` §9: every asset teaches one usable concept.
  That applies to what you promise the subscriber too. A newsletter nobody would
  miss is not worth the address.
- **Do not promise a cadence Mike will not keep.** "Occasionally" is honest and
  survivable. "Weekly" is a debt.
- One pointer per page. If a page already has a book link and a Buy Me a Coffee
  link, adding a third ask needs a decision, not a commit.
- Commit as Michael Nocito, no AI trailers (`feedback_solo_authorship`).
- **Verify on the live URL, not on a green push**
  (`feedback_verify_deploy_not_push`). Submit a real address and confirm it
  arrives where you expect.
- Handoffs live at repo root and need `git add -f`, because `.gitignore` has a
  `HANDOFF-*.md` rule that postdates the tracked handoffs.

---

## 9. Order of work

1. **Get the Supabase `auth.users` numbers from Mike. Blocking.**
2. **Get his decision on the gating ladder in §3.** Blocking for the kit only.
3. Report what those two mean for the plan.
4. Build the shared snippet, and ship it to the guides first. That is 42 pages
   and the largest surface.
5. Job sims and companion apps, at the completion states.
6. The kit itself, per the rung chosen.
7. Verify live on each, then baseline the numbers.

Items 4 through 6 can proceed while waiting on the kit decision.

---

## 10. The honest note

Twelve emails a month is not a business. It is 144 a year, and a list of that
size will not move revenue this year.

It is still the right item, because it is the only asset on the list that
compounds and the only one that cannot be taken away by an algorithm change. But
nobody should expect it to produce a sale in 30 days, and this handoff should not
pretend otherwise.

**The job hunt outranks this.** If a week forces the choice, the job hunt wins.
