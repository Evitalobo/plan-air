# Plan Air

A tool to make project planning easier, with the use of customizable templates.

A coded prototype of the **Planner** design handoff — a desktop app for one
person running several unrelated projects at once: product design work, a
product-management scoping project, a hand-tufting craft project, and a music
release. It holds the plan and the notes in the same place.

The template each project customises is its **phase vocabulary**. A product
project runs Discovery → Definition → Build → Validation → Launch; a rug runs
Discovery → Definition → Build; an EP runs Reference → Sound design →
Composition → Mix → Release. Every to-do belongs to one of its own project's
phases, and nothing in the app assumes a single shared workflow.

Built from the `design_handoff_planner` bundle — a high-fidelity spec, since
extended to fill the window and adapt across desktop widths.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

Node 18+. No other setup.

## Stack

React 18 + TypeScript + Vite, plain CSS. N

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
- **The add drawer is real.** The floating button bottom-right opens a drawer
  with a form per kind. A note lands at the top of Recent notes; a task lands in
  its project's to-do table and moves that phase's open count; a link lands in
  the project's links row, and a `STORY` link clears the dashed "Add story link"
  affordance. Escape closes it, and the sidebar's Quick capture opens it.


No modals, no loading states, no error states — none were designed.

## Layout

The app fills the viewport — the OS window is the only frame. It holds from
roughly 960px up, giving way in this order as the window narrows:

| Width | What changes |
|---|---|
| 1400 | Right rail narrows, screen padding tightens |
| 1240 | The to-do table drops its Window column |
| 1180 | Side-by-side cards stack — timeline/at-a-glance, the extras pair, the dossier pairs |
| 1080 | The right rail moves under the main column, its three blocks in a row |
| 960 | Sidebar collapses to an icon rail |



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


