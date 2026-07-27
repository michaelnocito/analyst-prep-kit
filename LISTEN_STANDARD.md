# Listen — the read-aloud standard for every page we publish

**Canon. This file is the single source of truth for the Listen feature.**
Opened 2026-07-27. Any change to how Listen looks, where it sits, what it reads,
or what it skips gets written here **in the same commit as the code change**.
If the behaviour and this file disagree, this file is the bug report.

Implementation: `analyst-prep-kit/assets/listen.js` (one file, no CSS file, no
config). Served from `https://michaelnocito.github.io/analyst-prep-kit/assets/listen.js`,
which every one of our sites can point at because they share the
`michaelnocito.github.io` origin.

**Status: on two pages for Mike's review, rollout on hold.**
Live on `guides/sql-joins/` and `play-area/writing/test-the-verb/`. Do not add
it to anything else until Mike has listened and said go.

---

## 1. Why it exists

Mike reads a growing share of our own material by ear, on a phone, away from a
desk. The platform options do not cover us: Safari's "Listen to Page" only
appears when Safari judges a page to be Reader-eligible, and our hand-built
pages mostly are not. The alternative is the OS-level Speak Screen gesture,
which works but has to be switched on in accessibility settings first and reads
everything on screen including our navigation.

So the page carries its own control. Beyond serving Mike, it is a genuine
selling point: a written guide you can put in your pocket and walk with.

**The engagement case, for reference.** Audio players on article pages get
clicked by roughly 1 in 25 of the people who load them, but the ones who click
stay for about 59% of the audio — around 3m45s against an average time on page
of 55 seconds. The Washington Post measured audio listeners engaging over three
times longer than readers. Listen earns its place on depth, not reach, which is
why the control is small and calm rather than a banner.

---

## 2. Placement, and the friction rule

**One tap to start, and nothing on the page until you take it.**

- **The control sits directly under the byline**, above the first paragraph.
  This matches how publishers place audio controls: above the fold, attached to
  the article's identity block, not floating over the text.
- **It is a small pill, not a player.** Text-led: `▶ Listen · 18 min`. The
  minute count is computed from the real word count at ~155 wpm, so it is an
  honest number and it also tells a reader how long the piece is.
- **The transport bar does not exist until audio is playing.** A floating bar
  fades in at the bottom only once there is something to control, then carries
  back a paragraph, pause, forward a paragraph, position, speed, and close.
  Publishers use a floating control specifically so a listener can pause without
  scrolling back to the top; that is the only reason it is there.
- **Anchor order is `.byline`, then `.meta`, then `.standfirst`, then `h1`.**
  A CSS selector list returns whichever element comes first in the document, so
  these are tried one at a time on purpose. The control must land BELOW the
  byline, never above it.

---

## 3. What gets read, and what does not

Read: headings, paragraphs, list items, blockquotes, figure captions, in
document order.

Not read, replaced by one short spoken marker:

| Element | Spoken instead |
|---|---|
| `pre` (code) | "A code example follows on screen." |
| `table` | "A table follows on screen." |
| `ul.refs`, `ol.refs` | "The references are listed on screen." |

**Why these three are markers rather than content.** A screenful of SQL read
character by character is not listening. A table read left to right loses the
column meanings that make it a table. Author-year-journal-DOI is reference
apparatus, and nobody listening on a walk is writing down a DOI.

Skipped entirely, no marker: `.crumb`, `.morelinks`, `.toc`, `nav`, `footer`,
and the Listen controls themselves. These are navigation, and navigation read
aloud is noise.

**The kit CTA is read.** It is one honest mention placed after the reader has
everything, per section 5 of the article standard, and a listener deserves the
same offer a reader gets.

---

## 4. Behaviour

- **Block-by-block speech, not one long utterance.** This is a deliberate
  choice, not an implementation detail. It buys paragraph skip, tap-a-paragraph
  to jump, and an honest position readout, and it avoids two real platform bugs:
  iOS does not fire reliable word-boundary events, and Chrome truncates long
  utterances.
- **Tap any paragraph while playing to jump there.**
- **A faint highlight marks the paragraph being spoken.** Deliberately faint.
  It shows where the voice is without turning the page into a karaoke screen.
- **Speeds cycle 1× → 1.25× → 1.5× → 0.85×.**
- **It stops when you leave.** Page hide, unload, and tab-hidden all stop or
  pause. A voice still talking after you have left the page is alarming.

---

## 5. Platform rules that are not optional

These are the things that break silently if someone "tidies" the code later.

- **`speak()` must run inside a real user gesture.** iOS Safari rejects it
  otherwise and fails silently. Never move a speak call behind a timer, a
  promise, or a page-load handler. Chaining the next block from `onend` is fine;
  iOS treats the sequence as belonging to the gesture that started it.
- **`getVoices()` is asynchronous** in Chrome, Edge and Firefox. An empty first
  result is normal. Listen for `voiceschanged` and re-pick.
- **Prefer `localService` voices**, so playback keeps working with no network
  and no per-word request going anywhere.
- **Chrome pauses synthesis after roughly fifteen seconds.** A periodic
  `pause(); resume();` poke is the long-standing workaround and is in the code.
  Removing it will look fine on a short test page and fail on a real article.

---

## 6. The iPhone voice ceiling — verified 2026-07-27, do not re-litigate

Mike's verdict on the first listen: **"sounds like garbage by default on iPhone,
very robot Siri."** He is right, and **no change to our code fixes it.**

Apple does not expose its good voices to the web. `speechSynthesis.getVoices()`
in Safari returns the compact system voice. The Enhanced and Premium voices a
user can download under Settings → Accessibility → Spoken Content → Voices are
reachable by Apple's own features — VoiceOver, Speak Screen, Listen to Page —
and **not** by a web page. Safari has a long history here: for a stretch it
returned nothing at all from `getVoices()`, iOS 17 briefly exposed some
high-quality voices, and they went away again. Chrome and Edge list every voice
installed on the machine; Safari does not.

**Tested on device, 2026-07-27.** Mike downloaded a better voice and set it as the
iPhone default under Settings → Accessibility → Spoken Content → Voices, then
reloaded the page and tapped Listen. **Still the same robotic voice.** So the
system default does not reach the browser either. This is not a
"pick the right voice" problem and there is no settings path around it.

**So do not "fix" this by writing cleverer voice-selection code.** The preferred
name list in `listen.js` is a best-effort nicety for desktop and Android. On
iPhone there is one voice available to us and it is the compact one.

**The only real fix is pre-rendered audio** — generate the narration ahead of
time as a file and play the file instead of synthesising live. Tracked as [L4]
in `ROADMAP.md`. **Hard-blocked** until Mike has finalised page content, because
a recording is frozen: edit a paragraph and the audio no longer matches the
page. Mike can override the block.

**What to tell a user who complains about the voice on iPhone:** the honest
answer is the device's built-in reader sounds better than any web page can.
Settings → Accessibility → Spoken Content → Voices → English, download a Premium
or Enhanced voice, then use the two-finger swipe down from the top of the
screen. That upgrades Speak Screen. It does not change our button.

## 7. The voice is the user's, not ours

The speech engine belongs to the device, so the same page sounds different on
iPhone, Android and Windows. We pick the best available local voice by name
where we recognise one, otherwise the platform default. **We do not ship an
audio file and we do not call a paid TTS API.** If voice quality is the
complaint, the fix is the device's speech settings, not our code — say so
plainly rather than promising a fix we do not control.

---

## 8. Adding it to a page

```html
<script defer src="../../assets/listen.js"></script>
```

Cross-site (play-area and anything else on the same origin):

```html
<script defer src="https://michaelnocito.github.io/analyst-prep-kit/assets/listen.js"></script>
```

It self-limits: fewer than three readable blocks and it does not insert
anything, so it is safe to include on index and hub pages.

Optional: put `data-listen-root` on a container to override the default, which
is `main`.

---

## 9. Where this is referenced

- `marketing/ARTICLE_STANDARD.md` — guides and articles
- `CURRICULUM_STANDARD.md` — lesson kits
- `../play-area/BUILD_PILLARS.md` — games and apps

Those three point here. Do not restate the rules in them; a rule written in four
places drifts in four directions.
