# Global Forgiveness Movement — Platform

The web platform for the Global Forgiveness Movement (Human Flourishing Program, Harvard
University): free evidence-based REACH forgiveness workbooks, a Forgiveness Groups pathway with
a video series for group leaders, an interactive workbook, and a light member area.

**Pre-launch:** the site sits behind a password until launch. The repo is public; nothing in it
is sensitive.

## How it's built

Vanilla HTML/CSS/JS ES modules, no build step — GitHub Pages serves the repo root directly.
One shared shell (`js/site.js`) renders the gate, header, nav, and footer on every page; shared
content lives as data in `js/data.js`; `js/store.js` + `js/auth.js` provide one backend
interface with two implementations (Firebase when `js/firebase-config.js` holds a config, a
labeled in-browser demo mode when it doesn't).

- `/workbook/` — the interactive REACH workbook (12 lessons, answers stay on-device;
  signed-in users sync only their position — see `js/progress-sync.js`)
- `/plan/` — the client-facing scope & process plan (separately encrypted)
- `.planning/` — GSD project state (`STATE.md` is the place to start)
- `.claude/CLAUDE.md` — the working rules for sessions on this project

## Development

```
python3 -m http.server 8000
```

No dependencies, no build. What's on `main` is what's live.

## Attribution

REACH Forgiveness model and workbooks: Everett L. Worthington, Jr., adapted by Richard Cowden
and Kate Jackson-Meyer (Human Flourishing Program, Harvard University). The workbooks are
self-guided learning, not therapy, and not a replacement for professional mental-health support.
