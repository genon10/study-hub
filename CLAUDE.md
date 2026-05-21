# Study Hub — Claude Instructions

## Project Overview
Multi-project study website for bagrut (matriculation) exam preparation.
Currently contains: MineMaster Android (minesweeper/) and FRC Robotics (frc/).

## Design System
**ALWAYS read `/mnt/skills/public/frontend-design/SKILL.md` before writing any HTML, CSS, or JS.**
This is mandatory — do not skip it even for small changes.

The design tokens are:
- Background: `--bg: #0a0a0f`
- Surface: `--surface: #111118`
- Card: `--card: #16161f`
- MineMaster accent: `--accent: #6366f1` (indigo)
- FRC accent: `--accent: #22c55e` (green)
- Fonts: Inter (body) + JetBrains Mono (code blocks)
- Glass cards: `backdrop-filter: blur`, `rgba` borders
- Dark theme only

## Project Structure
```
study hub/
├── CLAUDE.md              ← you are here
├── index.html             ← homepage with project cards
├── shared/
│   ├── style.css          ← global design tokens
│   └── utils.js           ← getLang(), setLang(), t(), localStorage helpers
├── minesweeper/           ← COMPLETE — do not modify unless asked
│   ├── index.html, architecture.html, code.html
│   ├── topics.html, flashcards.html, quiz.html, exam.html
│   ├── css/style.css
│   └── js/data.js, nav.js, search.js, progress.js,
│       flashcards.js, quiz.js, exam.js
└── frc/                   ← FRC Robotics section
    ├── index.html, architecture.html, code.html
    ├── topics.html, flashcards.html, quiz.html, exam.html
    ├── css/style.css
    └── js/data.js, nav.js, search.js, progress.js,
        flashcards.js, quiz.js, exam.js
```

## Rules

### Never touch minesweeper/ unless explicitly asked
The minesweeper section is complete and working. Do not modify it.

### Always match the existing section structure
New pages must mirror the minesweeper/ pattern exactly:
- Same navbar structure and classes
- Same accordion pattern (`accToggle()`)
- Same progress ring
- Same language toggle (he/en/mix) using shared/utils.js

### localStorage key prefixes
- MineMaster: `mm_`
- FRC: `frc_`
Never mix prefixes between sections.

### Language support
All user-facing strings must exist in 3 languages in data.js:
```js
{ he: "עברית", en: "English", mix: "Mixed" }
```
No hardcoded Hebrew or English strings in HTML files.

### GitHub integration (frc/code.html)
Branch name is `main!` (with exclamation mark).
All API calls must include `?ref=main!`
```
https://api.github.com/repos/KipodHater/RebuiltCode2026/contents/{path}?ref=main!
```
Decode with: `atob(response.content.replace(/\n/g,''))`

### Privacy — never include personal data
Do not include in any file:
- Real student names
- ID numbers (ת"ז)
- Teacher names
- Windows username or local file paths

### Git workflow
After any set of changes:
```bash
git add .
git commit -m "description of change"
git push
```
GitHub Pages auto-deploys from main branch.
Live URL: https://genon10.github.io/study-hub/

## Content Source
FRC content is based on:
- Robot book (ספר רובוט) — mechanical specs and systems
- REBUILT project paper — theory, game rules, subsystems
- GitHub repo: https://github.com/KipodHater/RebuiltCode2026

Season name is **REBUILD** (not Reefscape, not 2026).