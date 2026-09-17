/**
 * The de-facto schema from the Planner design handoff.
 *
 * The organising idea: every project defines its own phase vocabulary, and
 * every to-do belongs to one of that project's phases. Nothing here assumes a
 * single shared workflow — `phases` is just `string[]` per project.
 */

export type Priority = 'High' | 'Medium' | 'Low';

export type ProjectKind = 'pm' | 'tufting' | 'music';

/** Where a timeline bar sits relative to the project's current phase. */
export type BarState = 'done' | 'now' | 'later';

/** Status-chip vocabulary used by the project-specific "extras" cards. */
export type ChipTone = 'ok' | 'warn' | 'risk' | 'neutral';

export type LinkKind =
  | 'AHA'
  | 'STORY'
  | 'PRD'
  | 'PATTERN'
  | 'PHOTO'
  | 'DOC'
  | 'REF'
  | 'DAW'
  | 'FORM'
  | 'PINTEREST';

export type Severity = 'Blocker' | 'Medium' | 'Low';

export interface Subtask {
  id: string;
  text: string;
  hint?: string;
  /** Human-readable effort estimate, e.g. "2.5 h". */
  est: string;
  done?: boolean;
}

export interface Todo {
  id: string;
  text: string;
  hint?: string;
  /** Must be one of the owning project's `phases`. */
  phase: string;
  prio: Priority;
  /** Human-readable working window, e.g. "15 – 19 Sep". */
  window: string;
  /** Human-readable due label, e.g. "Fri", "3 Oct", "—". */
  due: string;
  done?: boolean;
  subs?: Subtask[];
}

export interface TimelineBar {
  phase: string;
  /** CSS grid column span within the 8-week grid: [start, end). */
  span: [number, number];
  note: string;
  state: BarState;
}

/** A key/value row in the "At a glance" card. */
export interface Fact {
  k: string;
  v: string;
}

export interface ProjectLink {
  kind: LinkKind;
  label: string;
  href?: string;
}

export interface ExtraItem {
  k: string;
  v: string;
  tone: ChipTone;
  note: string;
}

/** One of the two project-specific cards below the to-do table. */
export interface Extra {
  title: string;
  meta: string;
  items: ExtraItem[];
}

export interface Project {
  id: string;
  name: string;
  /** Short status chip beside the title, e.g. "in build". */
  badge: string;
  /** One sentence of project context under the title. */
  sub: string;
  /** Label for the project-specific dark primary button. */
  cta: string;
  kind: ProjectKind;
  /** This project's own phase vocabulary. */
  phases: string[];
  /** Index into `phases` of the phase currently in flight. */
  cur: number;
  /** Whether this project carries parallel design directions (A/B/C). */
  directions: boolean;
  /** Human-readable date range shown beside the timeline title. */
  range: string;
  bars: TimelineBar[];
  /** Static rows for "At a glance". Phase and open-to-do counts are derived. */
  facts: Fact[];
  links: ProjectLink[];
  linkMeta: string;
  /** Shows the dashed "＋ Add story link" affordance in the links row. */
  storyMissing: boolean;
  todos: Todo[];
  extras: Extra[];
  /** Desk card copy. */
  deskKind: string;
  deskMeta: string;
  /** The to-do surfaced on the Desk card, while it is still open. */
  featuredTodoId: string;
  noteCount: number;
}

/** A parallel option explored inside a project that carries directions. */
export interface Direction {
  id: string;
  name: string;
  stage: string;
  brief: string;
  tags: string[];
  status: Fact[];
  researchMeta: string;
  research: { title: string; src: string; body: string }[];
  draftMeta: string;
  /** Description of the sketch that belongs in the placeholder slot. */
  draftShot: string;
  draft: { n: string; body: string }[];
  drawbackMeta: string;
  drawbacks: { title: string; sev: Severity; body: string }[];
  dsName: string;
  colors: string[];
  typeDisplay: string;
  typeUi: string;
  dsNotes: string[];
  verdict: string;
}

export type TodoFilter = 'All' | 'Open' | 'High first';

export type Screen = 'desk' | 'project';
