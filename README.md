# planAir

A coded prototype of **Planner** — a desktop app for one person running several
unrelated projects at once: product design work, a product-management scoping
project, a hand-tufting craft project, and a music release. It holds the plan
and the notes in the same place.

The organising idea: **every project defines its own phase vocabulary**, and
every to-do belongs to one of that project's phases. Nothing in the app assumes
a single shared workflow.

Built from the `design_handoff_planner` bundle (high-fidelity spec, fixed
1440 × 900 desktop window).

## Running it

```bash
npm install
npm run dev      # API on :8787 + app on http://localhost:5173 (proxied /api)
npm start        # production: build the app, serve app + API from :8787
npm run build    # type-check + production build into dist/
```

Node 22.5+ (the API uses the built-in `node:sqlite`; nothing else to install).

## Stack

React 18 + TypeScript + Vite, plain CSS. No component library and no state
library — the prototype is small enough that adding either would obscure the
design rather than serve it. Everything is deliberately easy to lift into an
existing codebase:

- **Design tokens** live as CSS custom properties in `src/styles/tokens.css`.
  Every colour, radius and shadow in the handoff resolves to one of them.
- **Icons** are a single file of stroke SVGs (`src/components/Icon.tsx`)
  standing in for the placeholder glyphs (▤ ◫ ✎ ⚑ ⌕ ✓ ↗ ＋ ?). Swap the file
  for a real icon library and keep the names.
- **Data** is typed against the handoff's de-facto schema and lives apart from
  the components, so replacing it with an API is a one-file change.

## Screens

**Desk** (`src/components/Desk.tsx`) — the dashboard. Answers "what am I doing
today, and what is waiting on me" across all projects: a resume card, one
pipeline card per project, an "Up next" list, and a right rail of recent notes,
open questions and the week ahead.

**Project detail** (`src/components/ProjectScreen.tsx`) — one page per project:
phase pipeline with open counts, an eight-week timeline, at-a-glance facts,
links, the to-do table with subtasks, two project-specific cards, and — for a
project carrying parallel options — an A/B/C direction dossier.

## What is wired

- Sidebar rows, Desk project cards and "Open project" all navigate. Selecting a
  project resets the to-do filter to "All".
- Filter chips: **All** keeps authored order, **Open** hides completed tasks,
  **High first** sorts incomplete before complete, then High → Medium → Low.
- Direction tabs swap the entire dossier below.
- **Checkboxes are real.** Ticking a task or subtask updates the struck-through
  row, the phase pipeline's "N open" counts, the "Open to-dos" fact and the
  to-do header count — all derived, never stored. A task ticked on the Desk's
  "Up next" list is the same task inside the project.

Everything else is an unwired affordance marking where a flow belongs:
"New note", "New project", "Add note", "＋ Add a task", "＋ Add a subtask",
"＋ Add story link", "＋ New pattern direction", "Log this as a decision", quick
capture, search, and the project CTA.

No modals, no loading states, no error states — none were designed.

## Layout

Fixed 1440 × 900, not responsive; below that width the app scrolls rather than
reflows. The window chrome drawn around the app (traffic lights, search field,
date) stands in for the OS window — a packaged desktop build drops
`WindowChrome` and the `.shell` wrapper.

One layout rule worth keeping: every card in the project screen's scrolling
body is `flex: none`. Cards with `overflow: hidden` collapse to zero height
inside a fixed-height flex column otherwise.

## Project structure

```
src/
  data/
    types.ts        the schema — Project, Todo, Subtask, Direction
    projects.ts     the four projects, each with its own phase vocabulary
    directions.ts   the three parallel pattern directions
    desk.ts         dashboard content that belongs to no single project
    theme.ts        phase/priority/status colour lookups
  state/
    store.tsx       screen, selected project, selected direction, filter
    selectors.ts    derived values — open counts, filtered lists, facts
  components/       one file per region of the two screens
  styles/
    tokens.css      design tokens
    app.css         component styles
```

## What a real implementation still needs

Persistence; task and subtask CRUD; note CRUD with tags; link records with an
external-tracker sync (Aha, in the handoff); and a decisions log — the
"Decisions" nav item and the "Log this as a decision" button are both unbuilt.

The `Direction` type is currently tufting-flavoured (yarn, pile, backing) because
that is the only project using it. Generalising the two spec slots is the first
change if another project grows directions.

## Typography

Interface: **Bricolage Grotesque**. Reading and editorial — note excerpts,
briefs, research bodies, verdicts, questions and the two screen titles:
**Newsreader**. Both load from Google Fonts in `index.html`; self-host them for
an offline desktop build.

## New-project placements

"New project" opens a flow with three templates (Work, Music, Sewing) or a custom
form builder. Where that flow opens is chosen at build time with `VITE_NP_VARIANT`:

```bash
npm run build:drawer  # bottom sheet (default for npm run dev / build)
npm run build:modal   # centred dialog
npm run build:side    # full-height panel on the right
npm run build:page    # full page replacing the Desk
```

## What changed since the handoff

- planAir brand: Gontserrat → Inter type, dark red (#500000) system colour, red primary buttons.
- Clickable phase pipeline with a circle per phase and a small circle per task.
- To-dos grouped by priority, with drag and drop between groups.
- Subtasks on every big task; Moss Cube follows its real build steps.
- Responsive layout down to phone width.

## Backend

`server/index.mjs` is a small Node server with SQLite storage
(`server/data/planair.db`, created on first run and seeded from `server/seed.json`).
Every project and note is one row holding its JSON.

| Method | Path | What it does |
|---|---|---|
| GET | `/api/state` | All projects and notes |
| GET / POST | `/api/projects` | List, or create a project (409 if the id exists) |
| GET / PUT / PATCH / DELETE | `/api/projects/:id` | Read, replace, partially update, delete |
| PUT | `/api/projects/order` | Save sidebar order: `{ "ids": [...] }` |
| GET / POST | `/api/notes` | List, or add a note |
| DELETE | `/api/notes/:id` | Remove a note |
| POST | `/api/reset` | Reseed from `server/seed.json` |
| GET | `/api/health` | `{ "ok": true }` |

The app (`src/state/api.ts`) loads from the API on start and, after every edit,
sends only what changed: new projects, edited projects, deletions, new notes.
When no API answers (for example the static build hosted on its own), the same
data is kept in the browser's localStorage instead. The sidebar shows which one
is in use and whether the last change was saved, with a Reset link.

What persists: new projects (templates or custom), phase changes, ticking tasks
and subtasks, priority changes and drag and drop, renaming and deleting projects,
and notes, tasks and links from Quick capture.

`npm run seed` rewrites `server/seed.json` from `src/data/` after you change the
sample data. Set `VITE_API_URL` to point the app at an API on another host,
`PORT` to change the API port, `PLANAIR_DB` to move the database file.
