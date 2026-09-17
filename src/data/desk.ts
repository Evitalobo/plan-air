/** Content that belongs to the Desk screen rather than to any one project. */

export interface Note {
  id: string;
  tag: string;
  when: string;
  title: string;
  excerpt: string;
}

export interface Question {
  text: string;
  project: string;
}

export interface WeekRow {
  day: string;
  label: string;
  tone: 'accent' | 'neutral' | 'deadline';
}

/** A row in "Up next" — a short label pointing at a to-do inside a project. */
export interface UpNext {
  label: string;
  projectId: string;
  todoId: string;
  project: string;
  due: string;
  /** True when the due date reads as urgent (this week). */
  urgent: boolean;
}

export const OWNER = { name: 'Evita' };

export const DESK = {
  title: 'Desk',
  sub: 'Two products in flight · one rug on the frame · one EP',
  noteTotal: 214,
  today: 'Mon 16 Sep',
  searchPlaceholder: 'Search notes, projects, yarn colours',
};

export const RESUME = {
  eyebrow: 'Pick up where you left off',
  title: 'HealthAgg — cut the beta scope before Friday',
  meta: 'Phase: Build · last touched 2 hours ago · 41 notes',
  projectId: 'healthagg',
};

export const UP_NEXT: UpNext[] = [
  {
    label: 'Settle the three greens',
    projectId: 'moss-cube',
    todoId: 'moss-cube-1',
    project: 'Moss Cube',
    due: 'Thu',
    urgent: true,
  },
  {
    label: 'Order 0.4 kg of the deep green',
    projectId: 'moss-cube',
    todoId: 'moss-cube-2',
    project: 'Moss Cube',
    due: 'Fri',
    urgent: true,
  },
  {
    label: 'Build the eval set for the tutor',
    projectId: 'ai-tutor',
    todoId: 'ai-tutor-2',
    project: 'AI tutor',
    due: '3 Oct',
    urgent: false,
  },
  {
    label: 'Cut scope for the clinic beta',
    projectId: 'healthagg',
    todoId: 'healthagg-1',
    project: 'HealthAgg',
    due: 'Fri',
    urgent: true,
  },
  {
    label: 'Cut the MVP to one year group',
    projectId: 'ai-tutor',
    todoId: 'ai-tutor-1',
    project: 'AI tutor',
    due: '30 Sep',
    urgent: false,
  },
];

/** Tags offered in the add drawer. Free text is allowed too. */
export const NOTE_TAGS = ['Materials', 'Decision', 'Technique', 'Sound', 'Research', 'Idea'];

export const NOTES: Note[] = [
  {
    id: 'note-1',
    tag: 'Materials',
    when: '2h',
    title: 'Dye lots differ between orders',
    excerpt:
      'The second cream came out a shade warmer. Buy the whole quantity in one order, always.',
  },
  {
    id: 'note-2',
    tag: 'Decision',
    when: '1d',
    title: 'Cut pile for the field, loop for the border',
    excerpt: 'Loop holds the edge much better at 8 mm. Costs about an hour extra on a 2 m² rug.',
  },
  {
    id: 'note-3',
    tag: 'Technique',
    when: '3d',
    title: 'Stripe edges wander after 30 rows',
    excerpt:
      'Mark every tenth row on the cloth before starting. Cheaper than re-tufting two passes.',
  },
  {
    id: 'note-4',
    tag: 'Sound',
    when: '4d',
    title: 'Detune two saws by 7 cents, not 15',
    excerpt:
      'Wider detune turns the pad into a chorus wash. The references sit far narrower than expected.',
  },
];

export const QUESTIONS: Question[] = [
  { text: 'Is 8 mm pile too short for the hallway traffic?', project: 'Moss Cube · A' },
  { text: 'Can the spiral hold its shape in cut pile at all?', project: 'Moss Cube · B' },
  { text: 'Does the weekly coverage refresh undermine the metric?', project: 'HealthAgg' },
  {
    text: 'What does personalization actually mean here — pace, reading level, or interests?',
    project: 'AI tutor',
  },
  { text: 'Do we build out a design system before the pilot, or after?', project: 'AI tutor' },
  { text: 'Is one pad synth enough for the whole EP?', project: 'Dungeon synth EP' },
];

export const WEEK: WeekRow[] = [
  { day: 'Mon', label: 'Pick the three greens', tone: 'accent' },
  { day: 'Tue', label: 'Teacher call — eval set', tone: 'neutral' },
  { day: 'Wed', label: 'HealthAgg scope cut', tone: 'neutral' },
  { day: 'Thu', label: 'Yarn order closes', tone: 'deadline' },
];

export const WEEK_TONE: Record<WeekRow['tone'], { bg: string; fg: string }> = {
  accent: { bg: '#e7efe9', fg: '#2f6f4e' },
  neutral: { bg: '#f1f4f5', fg: '#46555d' },
  deadline: { bg: '#f3ded8', fg: '#8a4a3a' },
};
