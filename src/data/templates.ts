import type { Extra, LayoutItem, Project, ProjectKind, SectionKey, Todo } from './types';

/**
 * New-project templates and the section library the custom form builder draws
 * from. Every section here is one of the blocks a project page already uses.
 */

export interface SectionDef {
  key: SectionKey;
  label: string;
  hint: string;
}

/** Everything a project page can show, in a sensible default order. */
export const SECTION_LIBRARY: SectionDef[] = [
  { key: 'timeline', label: 'Timeline', hint: 'Phases laid out across eight weeks' },
  { key: 'glance', label: 'At a glance', hint: 'Phase, open to-dos and key facts' },
  { key: 'links', label: 'Links', hint: 'Trackers, docs, boards and references' },
  { key: 'todos', label: 'To-do list', hint: 'Tasks by priority, with subtasks' },
  { key: 'extra:Materials & cost', label: 'Materials & cost', hint: 'What to buy and what it costs' },
  { key: 'extra:Frame log', label: 'Frame log', hint: 'Hours and progress per piece' },
  { key: 'extra:Open questions', label: 'Open questions', hint: 'What is blocking scope' },
  { key: 'extra:Design decisions', label: 'Design decisions', hint: 'What was kept, cut or left open' },
  { key: 'extra:Synth shortlist', label: 'Synth shortlist', hint: 'Instruments under consideration' },
  { key: 'extra:Production steps', label: 'Production steps', hint: 'An ordered checklist for the work' },
  { key: 'extra:Readiness', label: 'Readiness', hint: 'Launch or release checks' },
  { key: 'directions', label: 'Directions A / B / C', hint: 'Compare parallel options side by side' },
];

export const sectionDef = (key: SectionKey) => SECTION_LIBRARY.find((s) => s.key === key);

/** Starting width for each section, matching the built-in project pages. */
export const defaultSpan = (key: SectionKey): LayoutItem['span'] =>
  key === 'timeline' ? 4 : key === 'glance' ? 2 : key.startsWith('extra:') ? 3 : 6;

export const defaultLayout = (keys: SectionKey[]): LayoutItem[] => keys.map((key) => ({ key, span: defaultSpan(key) }));

export interface Template {
  id: string;
  kind: ProjectKind;
  label: string;
  defaultName: string;
  blurb: string;
  phases: string[];
  sections: SectionKey[];
  todos: Omit<Todo, 'id'>[];
}

export const TEMPLATES: Template[] = [
  {
    id: 'work',
    kind: 'pm',
    label: 'Work',
    defaultName: 'New product project',
    blurb: 'Product design or PM work, from discovery to launch.',
    phases: ['Discovery', 'Definition', 'Build', 'Validation', 'Launch'],
    sections: ['timeline', 'glance', 'links', 'todos', 'extra:Open questions', 'extra:Design decisions'],
    todos: [
      { text: 'Write the problem statement', phase: 'Discovery', prio: 'High', window: 'Week 1', due: '—',
        subs: [{ id: 's1', text: 'List who it is for', est: '30 min' }, { id: 's2', text: 'Write the one-line problem', est: '30 min' }] },
      { text: 'Interview five users', phase: 'Discovery', prio: 'High', window: 'Week 1–2', due: '—' },
      { text: 'Draft the PRD', phase: 'Definition', prio: 'High', window: 'Week 3', due: '—' },
      { text: 'Prototype the core flow', phase: 'Build', prio: 'Medium', window: 'Week 4–5', due: '—' },
      { text: 'Usability test with five people', phase: 'Validation', prio: 'Medium', window: 'Week 6', due: '—' },
      { text: 'Plan the rollout', phase: 'Launch', prio: 'Low', window: 'Week 7', due: '—' },
    ],
  },
  {
    id: 'music',
    kind: 'music',
    label: 'Music',
    defaultName: 'New EP',
    blurb: 'A release, from references and sound design to mix.',
    phases: ['Reference', 'Sound design', 'Composition', 'Mix', 'Release'],
    sections: ['timeline', 'glance', 'links', 'todos', 'extra:Synth shortlist', 'extra:Production steps'],
    todos: [
      { text: 'Collect a reference playlist', phase: 'Reference', prio: 'Medium', window: 'Week 1', due: '—' },
      { text: 'Choose the synths', phase: 'Sound design', prio: 'High', window: 'Week 2', due: '—' },
      { text: 'Build the DAW template', phase: 'Sound design', prio: 'Medium', window: 'Week 2', due: '—' },
      { text: 'Write the main motifs', phase: 'Composition', prio: 'High', window: 'Week 3–4', due: '—' },
      { text: 'Track and arrange', phase: 'Composition', prio: 'Medium', window: 'Week 5', due: '—' },
      { text: 'Mix and master', phase: 'Mix', prio: 'Medium', window: 'Week 6', due: '—' },
      { text: 'Release on Bandcamp', phase: 'Release', prio: 'Low', window: 'Week 7', due: '—' },
    ],
  },
  {
    id: 'sewing',
    kind: 'tufting',
    label: 'Sewing',
    defaultName: 'New tufting piece',
    blurb: 'A tufted or sewn piece, from sketches to the last seam.',
    phases: ['Discovery', 'Definition', 'Build'],
    sections: ['timeline', 'glance', 'links', 'todos', 'extra:Materials & cost', 'extra:Frame log'],
    todos: [
      { text: 'Identify the tufting gun', phase: 'Discovery', prio: 'High', window: 'Week 1', due: '—' },
      { text: 'Initial sketches', phase: 'Discovery', prio: 'Medium', window: 'Week 1', due: '—' },
      { text: 'Decide the size', phase: 'Definition', prio: 'Medium', window: 'Week 2', due: '—' },
      { text: 'Colour palette and yarn swatches', phase: 'Definition', prio: 'High', window: 'Week 2', due: '—' },
      { text: 'Tuft each side', phase: 'Build', prio: 'High', window: 'Week 3–4', due: '—' },
      { text: 'Sew the pieces on by hand', phase: 'Build', prio: 'Medium', window: 'Week 5', due: '—' },
      { text: 'Dye the base fabric', phase: 'Build', prio: 'Medium', window: 'Week 5', due: '—' },
      { text: 'Sew up the last seam', phase: 'Build', prio: 'Low', window: 'Week 6', due: '—' },
    ],
  },
];

const DESK_KIND: Record<ProjectKind, string> = { pm: 'product design', music: 'music', tufting: 'tufting', custom: 'custom' };

/** Build a full Project from a name, a kind, phases, sections and starter tasks. */
export function makeProject(opts: {
  name: string;
  kind: ProjectKind;
  phases: string[];
  sections: SectionKey[];
  todos: Omit<Todo, 'id'>[];
  typeLabel?: string;
  icon?: string;
  layout?: LayoutItem[];
}): Project {
  const deskKind = opts.typeLabel ? opts.typeLabel.toLowerCase() : DESK_KIND[opts.kind];
  const id = `p-${Date.now().toString(36)}`;
  const phases = opts.phases.length ? opts.phases : ['Start', 'Middle', 'Finish'];
  // Spread the phases evenly across the eight-week timeline.
  const step = 8 / phases.length;
  const bars = phases.map((phase, i) => {
    const start = 2 + Math.floor(i * step);
    const end = Math.max(start + 1, Math.min(10, 2 + Math.floor((i + 1) * step)));
    return { phase, span: [start, end] as [number, number], state: i === 0 ? ('now' as const) : ('later' as const), note: '' };
  });
  const todos: Todo[] = opts.todos.map((t, i) => ({
    ...t,
    id: `${id}-${i + 1}`,
    subs: t.subs?.map((s, j) => ({ ...s, id: `${id}-${i + 1}${String.fromCharCode(97 + j)}` })),
  }));
  const extras: Extra[] = opts.sections
    .filter((s) => s.startsWith('extra:'))
    .map((s) => ({ title: s.slice(6), meta: 'nothing yet', items: [] }));
  return {
    id,
    name: opts.name.trim() || 'Untitled project',
    badge: 'new',
    sub: `${deskKind[0].toUpperCase()}${deskKind.slice(1)} · just created`,
    cta: phases[1] ? `Move to ${phases[1]}` : 'Mark complete',
    kind: opts.kind,
    phases,
    cur: 0,
    directions: opts.sections.includes('directions'),
    range: 'No dates yet',
    bars,
    facts: [],
    links: [],
    linkMeta: 'no links yet',
    storyMissing: false,
    todos,
    extras,
    deskKind,
    deskMeta: '',
    featuredTodoId: todos[0]?.id ?? '',
    noteCount: 0,
    sections: opts.sections,
    layout: opts.layout ?? defaultLayout(opts.sections),
    typeLabel: opts.typeLabel,
    icon: opts.icon,
  };
}
