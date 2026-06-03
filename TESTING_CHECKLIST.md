# Analyst Prep Kit — Whole-Kit Smoke / Acceptance Checklist

Basic, top-level QA. Go **one kit at a time**. For each kit: run the 6 shared
"every kit" checks, then the kit-specific item(s). Mark ✅ / ⚠️ / ❌.

Grounded in standard software-QA lenses (so it stays meaningful, not box-ticking):

| Lens | What it catches |
|---|---|
| 🔥 **Smoke** | white-screen / JS crash on load |
| 🎯 **Happy path** | the core user journey works end-to-end |
| 💾 **State** | progress + settings survive a reload (localStorage) |
| ♻️ **Regression** | recently-changed areas still work |
| 📐 **Non-functional** | responsive layout, light/dark, no console errors, deep links |

---

## Run these 6 on EVERY kit

| # | Lens | Do this | Pass = |
|---|------|---------|--------|
| 1 | 🔥 Smoke | Open the kit URL with the browser console open (F12) | Page renders; **no red console errors** |
| 2 | 🎯 Happy path | Click **every top-nav button** once | **Every view loads** — no blank panel |
| 3 | 🎯 Happy path | Open **Lesson 1** → answer the Quick Check → click **"Practice this"** | Visual shows; quiz marks **green on correct**; flows into a **drill** |
| 4 | ♻️ Regression | In any drill, tap a **wrong** then a **right** choice | Wrong = **red**, right = **green + advances**; **no typing box anywhere** |
| 5 | 💾 State | Complete a lesson, then **reload**; then toggle **theme** and reload | Lesson still **done**; **theme persists** |
| 6 | 📐 Non-functional | Shrink the window **narrow** + flip to **light mode** | Layout holds; text readable; nothing cut off |

---

## Kit-specific top-level item(s)

1. **Excel** — *Pivot Lab*: drag a field into Rows/Values → the table updates.
2. **SQL** — open 2 lessons: the **result-table visual** renders.
3. **Python** — open 2 lessons: the **output-block visual** renders.
4. **Tableau** — *Viz Builder*: drag fields onto shelves → a **chart draws**. **🧭 Workspace**: Tour explains a panel, Find-it scores a tap. **L20 dual-axis chart actually renders** (Chart.js).
5. **Stats** — open 2–3 lessons: **charts render** (NOT blank — known Chart.js canvas-timing risk).
6. **Power BI** — *DAX Lab* opens; **🧭 Workspace** works; nav routes cleanly (different router under the hood).
7. **Interview** — answer one behavioral question (rate-the-answer / multiple-choice flow).
8. **Simulator** — paste your API key → submit → a **manager review comes back** (live Claude API).
9. **Final Exam** — start the exam → answer → **submit a section → score shows**; **Study Guide** sections expand, each with its **"📺 See it" visual**.

---

### Suggested order
Excel → SQL → Python → Tableau → Stats → Power BI → Interview → Simulator → Final Exam.
A clean pass = all 6 shared checks ✅ + the kit-specific item ✅. Log any ❌/⚠️ as a `GR:` and I'll triage.
