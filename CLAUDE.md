# Study Hub — CLAUDE.md

Static HTML/JS study platform. No build step. No framework. No package.json.
Open files directly in browser or serve with any static server.

## Structure

```
index.html              ← landing page (links to both modules)
shared/
  style.css             ← global dark theme variables + base styles
  utils.js              ← shared JS (accToggle, lang switcher, localStorage)
minesweeper/            ← Minesweeper FRC robot project (cybersecurity bagrut)
  js/data.js            ← SINGLE SOURCE OF TRUTH: FLASHCARDS, QUIZ_QUESTIONS,
                           EXAM_QUESTIONS, EXAM_TOPICS_MAP, TOPICS, SEARCH_INDEX
  js/nav.js             ← bottom nav bar injection
  js/search.js          ← search overlay logic
  css/style.css         ← module-specific styles
  index.html, topics.html, flashcards.html, quiz.html, exam.html,
  architecture.html, code.html
frc/                    ← FRC #5135 robot study (REBUILT 2025 season)
  js/data.js            ← same structure as minesweeper/js/data.js
  js/nav.js, js/search.js
  css/style.css
  index.html, topics.html, exam.html
```

## Data model (both modules share same pattern)

All content lives in `data.js`. Arrays in order:

| Array | Purpose |
|---|---|
| `FLASHCARDS` | Flip cards — `{q, a}` both multilingual `{he, en, mix}` |
| `MATCH_PAIRS` | Term↔definition pairs |
| `QUIZ_QUESTIONS` | Multiple choice — `{q, o[], c, e}` (Hebrew strings) |
| `EXAM_QUESTIONS` | Bagrut-style MC — same shape as QUIZ |
| `EXAM_TOPICS_MAP` | Parallel array, maps each EXAM_QUESTIONS index → topic string |
| `TOPICS` | Deep-dive content — `{key, icon, title, desc, content}` |
| `SEARCH_INDEX` | Auto-built from above; add manual entries at bottom |

**EXAM_TOPICS_MAP must stay parallel to EXAM_QUESTIONS.** When adding exam questions, add matching entries to EXAM_TOPICS_MAP at the same index.

## Content language

All UI and content is Hebrew (RTL, `dir="rtl"`). Flashcard content uses three modes:
- `he` — Hebrew only
- `en` — English only
- `mix` — mixed Hebrew/English (technical terms in English)

## Styling conventions

- CSS variables in `shared/style.css` (colors: `--surface`, `--border`, `--danger`, `--accent3`)
- Green accent: `#22c55e` / `rgba(34,197,94,…)`
- Accordion: `.acc` > `.acc-h` > `.acc-b` (toggled by `accToggle()` in utils.js)
- Tables: `.tbl` with `.pro` (green) / `.con` (red) cells
- Highlight box: `.highlight.green` or inline style `rgba(34,197,94,…)`
- Bagrut tip box: `.bagrut-tip`
- Level badges: `.lvl.lvl-1` / `.lvl-2` / `.lvl-3`
- Code diagrams: `.diagram` (monospace, green, `white-space: pre`)

## Rules

- No build step — edit files directly, refresh browser to test
- No node_modules, no npm, no bundler
- `.claude/` is gitignored — never commit it
- Personal data (names, IDs) must never appear in any file
- `shared/utils.js` is loaded before module JS on every page — keep it side-effect free
- Each module's `data.js` loads before `search.js` and page scripts
