# Handoff — Analyst Prep Kit: All-Access Pass (freemium launch)

**This chat = `.a`. Next chat = `.b`.** Full living detail is in memory `project_freemium_ecosystem.md` (loads via MEMORY.md). This file is the quick-resume.

## What this is
Monetizing the Analyst Prep Kit via freemium. Free core (~156 lessons + games + Simulator) vs the **All-Access Pass** (premium tier — interview tracks, mock exams, job-sim, final exam, + new advanced modules over time; it EXPANDS, don't box it into "interview prep").

## Pricing (locked)
- **Founding: $5.55 / first year** (555 = "change"). **Launch: $11.11/mo** (11:11 = "new beginnings"). 95.837084% off — number is a *private wink*, NEVER shown to buyers (drops fire-sale framing).
- **Launch date: August 1, 2026.** At launch: flip `MODE` in `assets/apk-pass.js` from `'founding'` → `'live'` (auto-swaps gate to $11.11/mo, retires founding card) + hide the hub founding banner.

## ✅ Done & live (pushed to main)
- **Gate** (`assets/apk-pass.js`) across SQL/Excel/Python/PowerBI: locks interview-track lessons (SQL id>=501, Excel>=500, Python/PowerBI>=400), lock icons, unlock-code `PREP-PASS-2026` (djb2 2935497303), 1-yr localStorage expiry. Per-kit lesson gate title = "Premium lesson".
- **Hub** `index.html`: founding-offer banner + "Back up/move your progress" tool (`assets/apk-sync.js`).
- **Legal**: `privacy.html` + `terms.html` (footer-linked).
- **Covers**: `assets/cover-all-access-pass-{1080,1600x400}.{svg,png}` (render via `cd _shotkit && node` + sharp).
- **BMC product** (`buymeacoffee.com/michaelnocito/e/551812`): "Analyst Prep Kit — All-Access Pass (Founding, 1 year)", $5.55, repositioned desc, code in confirmation msg, All-Access cover, "Data Analytics" category, **"Ask a question" OFF** (no checkout friction). Buy buttons wired to `/e/551812`.
- **BMC page**: GA4 `G-6C09BL3WH1` added (tracks funnel); old gardening membership tiers gone.

## ⏳ Pending
- **Final Exam gate** — the ONE premium piece still ungated (whole-kit entry gate, structurally different). Next obvious task.
- **Mike-only manual (automation can't):** (1) BMC main-page **About text** still old gardening copy → replace w/ Analyst-Prep-Kit bio (in memory); (2) BMC main-page **cover banner** still old "Interview Prep Pass" → swap to `assets/cover-all-access-pass-1600x400.png`.
- **Before $11.11/mo recurring launch:** add **Supabase accounts** (cross-device progress sync + proper entitlement; the export/import code is the stopgap). Also fill `excel-dry-run` question bank + publish `good-enough-analytics` to complete premium catalog.

## ⚠️ Gotchas
- **BMC product Name field is React-controlled** — JS native-setter does NOT persist (silently reverts). Edit Name with REAL keystrokes (click → Ctrl+A → type) → Save → verify on reload. Description (contenteditable) is fine via execCommand on the VISIBLE editor (there's a hidden mirror — target by `getBoundingClientRect`).
- **Can't auto-upload to BMC** (only user-shared files) → Mike uploads images manually.
- **Stripe dashboard is BLOCKED** for automation (financial-site safety); BMC studio is not. Stripe is BMC's connected account anyway → use BMC, not standalone Stripe links.
- BMC extras enforce a **minimum** price but always allow "pay more" (the "+"); no toggle to force exact (would need Gumroad).
- Don't gate flashcards/study aids; let GA4 data drive further gating. Sponsorship was CUT (freemium-only focus).
- Commit as Michael Nocito, NO AI trailers ([[feedback_solo_authorship]]).
