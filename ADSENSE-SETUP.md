# AdSense trial: how to switch it on

Everything below the "wired already" line is done. The trial is off until you
paste two IDs into one file.

**Scope:** the 13 SQL guides only. One ad each, below the article, above the
footer, labelled. The SQL Kit, SQL Drill, Viz Drill and every non-SQL page are
deliberately untouched.

---

## Wired already

| Thing | Where | State |
|---|---|---|
| Ad loader | `assets/apk-ads.js` | Inert. Injects nothing until both IDs are set |
| Ad slot | `<div data-apk-ad></div>` on 13 SQL guides | In place |
| Script include | bottom of the same 13 guides | In place |
| Privacy policy | `privacy.html`, new Advertising section | Live |
| Self opt-out | reuses your `?ga=off` switch, plus `?ads=off` | Working |
| Layout-shift guard | 280px reserved before the ad loads | In place |

---

## What you do

### 1. Create the AdSense account
<https://adsense.google.com> — sign up with **hello.michaelnocito@gmail.com**,
the same account the GA4 property lives under. Add
`michaelnocito.github.io` as your site.

I cannot do this step for you; it needs your Google login.

### 2. Wait for the site review
Google reviews the site before serving anything. It usually takes a few days
and can take a couple of weeks. You already clear their content bar: 47 guides,
original writing, plus About, Contact, Privacy and Terms pages.

The ad code does not need to be live for review, but having the slot markup in
place already does no harm.

### 3. Turn OFF Auto ads
AdSense → **Ads** → **By site** → your site → toggle Auto ads **off**.

This matters more than anything else on this page. Auto ads ignore the whole
design above: Google places units wherever it likes, including mid-paragraph,
as a full-screen interstitial, and as a sticky bar at the bottom of the screen.
Leaving Auto ads on undoes the reason you picked this setup.

### 4. Create ONE display unit
AdSense → **Ads** → **By ad unit** → **Display ads** → name it
`apk-sql-guides` → **Responsive** → Create.

Copy the two IDs it shows you:
- the publisher ID, which looks like `ca-pub-1234567890123456`
- the slot ID, which is a 10-digit number

### 5. Paste them into one file
Open `assets/apk-ads.js` and fill in the two constants at the top:

```js
var PUB_ID  = 'ca-pub-XXXXXXXXXXXXXXXX';
var SLOT_ID = 'XXXXXXXXXX';
```

That is the entire activation. Commit and push; all 13 guides go live at once.

### 6. Add ads.txt
Create `ads.txt` in the **root** of the `michaelnocito.github.io` repo, so it
serves at `https://michaelnocito.github.io/ads.txt`, containing one line with
your real publisher ID:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Note the `pub-` prefix here, with no `ca-` in front of it. That differs from
the ID in step 5 and it is the most common mistake.

**Do this only once you have a real ID.** An `ads.txt` that authorizes nobody
tells ad buyers that no one may sell your inventory, which is worse than having
no file at all. That is why I did not pre-create it.

### 7. Turn on the consent message

**This one needs your hands.** The "Create a European regulations message"
button sits in an embedded frame that ignores browser automation. Verified
2026-08-07: the coordinates were right and a double-click on the same spot
selected page text, so the events land, but the button never fires. The GA4
internal-traffic expander fails the same way.

It may also just be gated until the account is activated, since the page still
shows the "Activate your account" banner. Worth retrying after step 1 clears.

Path: **Privacy & messaging** → **European regulations** → the blue
**Create a European regulations message** button → accept the defaults →
**Publish**.

Not urgent. Google's certified consent platform is required for EEA, UK and
Swiss traffic, but skipping it does not break anything: those visitors just get
non-personalized ads instead. Traffic today is effectively all US.

---

## Turning it off

Blank either constant in `assets/apk-ads.js`, then push. No third-party request
is made from that moment. Nothing else needs undoing.

## Keeping yourself out of the numbers

Load any page once with `?ads=off`, or just use your existing
`?ga=off` link, which now covers ads too. Never click your own ads; AdSense
closes accounts for it, and it is the single most common way a small publisher
loses one.

## What to expect

At a few hundred real pageviews a month, this earns single-digit dollars at
most. You know that. What the trial actually tells you is whether the ad
bothers you on your own page, and whether it moves time-on-page in GA4. Both
answers are worth having before the SEO work lands and the traffic is real.
