import { TODOS } from './todos';
import type { Project } from './types';

/** Phase vocabularies. Each project picks one — or writes its own. */
export const PHASES = {
  product: ['Discovery', 'Definition', 'Build', 'Validation', 'Launch'],
  craft: ['Discovery', 'Definition', 'Build'],
  music: ['Reference', 'Sound design', 'Composition', 'Mix', 'Release'],
} as const;

/** The eight-week window the timeline grid draws. */
export const WEEKS = ['Aug 24', 'Aug 31', 'Sep 7', 'Sep 14', 'Sep 21', 'Sep 28', 'Oct 5', 'Oct 12'];

/** Grid span of the current week, for the timeline's "this week" marker. */
export const TODAY_SPAN: [number, number] = [5, 6];

export const PROJECTS: Project[] = [
  {
    id: 'healthagg',
    name: 'HealthAgg — provider search',
    badge: 'in build',
    cta: 'Move to Validation',
    sub: 'Product design · consolidated provider + coverage search · beta with two clinics, 2 Oct',
    kind: 'pm',
    phases: [...PHASES.product],
    cur: 2,
    directions: false,
    range: '18 Aug – 2 Oct',
    deskKind: 'product design',
    deskMeta: 'beta opens 2 Oct',
    featuredTodoId: 'healthagg-1',
    noteCount: 41,
    bars: [
      { phase: 'Discovery', span: [2, 3], state: 'done', note: '12 user calls' },
      { phase: 'Definition', span: [3, 5], state: 'done', note: 'PRD v3 signed off' },
      { phase: 'Build', span: [4, 7], state: 'now', note: 'search + filters in dev' },
      { phase: 'Validation', span: [7, 9], state: 'later', note: '2 clinics, 5 days' },
      { phase: 'Launch', span: [9, 10], state: 'later', note: 'staged rollout' },
    ],
    facts: [
      { k: 'Next date', v: 'Fri 2 Oct — beta opens' },
      { k: 'Squad', v: '2 eng · 1 PM · me on design' },
      { k: 'Success metric', v: 'Search-to-booking ≥ 18%' },
      { k: 'Risk', v: 'Coverage data refresh is weekly, not live' },
    ],
    links: [
      { kind: 'AHA', label: 'HAG-112 Provider search' },
      { kind: 'STORY', label: 'HAG-112-4 Coverage filter' },
      { kind: 'PRD', label: 'Provider search PRD v3' },
    ],
    linkMeta: 'synced with Aha 2h ago',
    storyMissing: false,
    extras: [
      {
        title: 'Beta readiness',
        meta: 'opens 2 Oct',
        items: [
          {
            k: 'Search latency',
            v: '410 ms',
            tone: 'ok',
            note: 'Well inside the 800 ms target on the clinic wifi.',
          },
          {
            k: 'Coverage freshness',
            v: 'weekly',
            tone: 'risk',
            note: 'Refresh is batch, not live. Results can be seven days stale at the desk.',
          },
          {
            k: 'Clinic onboarding',
            v: '1 of 2',
            tone: 'warn',
            note: 'Second clinic still needs a half-hour walkthrough with front desk.',
          },
          {
            k: 'Analytics',
            v: 'instrumented',
            tone: 'ok',
            note: 'Search-to-booking funnel events land in the dashboard.',
          },
        ],
      },
      {
        title: 'Design decisions',
        meta: '5 logged',
        items: [
          {
            k: 'Coverage filter is a chip row, not a dropdown',
            v: 'kept',
            tone: 'ok',
            note: 'Front desk scans faster than they select. Tested with six staff.',
          },
          {
            k: 'One result card, no map view',
            v: 'kept',
            tone: 'ok',
            note: 'Distance matters less than accepting the insurance.',
          },
          {
            k: 'Saved searches',
            v: 'cut',
            tone: 'neutral',
            note: 'Out of beta scope. Revisit if the same query repeats across sessions.',
          },
          {
            k: 'Stale-data banner',
            v: 'open',
            tone: 'warn',
            note: 'Needed if the weekly refresh stays. Wording not agreed.',
          },
        ],
      },
    ],
    todos: TODOS['healthagg'],
  },

  {
    id: 'ai-tutor',
    name: 'AI education tutor',
    badge: 'pre-build',
    cta: 'Lock the MVP scope',
    sub: 'Product management · AI reading tutor for Year 3 · scoping with two schools before any build',
    kind: 'pm',
    phases: [...PHASES.product],
    cur: 1,
    directions: false,
    range: 'Sep – Nov, no fixed dates',
    deskKind: 'product management',
    deskMeta: '',
    featuredTodoId: 'ai-tutor-2',
    noteCount: 14,
    bars: [
      { phase: 'Discovery', span: [2, 5], state: 'done', note: '6 teacher interviews' },
      { phase: 'Definition', span: [4, 7], state: 'now', note: 'scope, evals, pricing' },
      { phase: 'Build', span: [7, 9], state: 'later', note: 'prototype only' },
      { phase: 'Validation', span: [9, 10], state: 'later', note: 'one classroom pilot' },
      { phase: 'Launch', span: [10, 10], state: 'later', note: '' },
    ],
    facts: [
      { k: 'Team', v: '2 founders, no engineers yet' },
      { k: 'Success metric', v: 'One school paying by Jan' },
      { k: 'Risk', v: 'Tutor answers drifting off the curriculum' },
    ],
    links: [
      { kind: 'AHA', label: 'EDU-03 AI tutor MVP' },
      { kind: 'DOC', label: 'Teacher interview notes' },
    ],
    linkMeta: 'no story linked yet',
    storyMissing: true,
    extras: [
      {
        title: 'Open questions',
        meta: 'blocking scope',
        items: [
          {
            k: 'What does personalization mean here?',
            v: 'unresolved',
            tone: 'risk',
            note: 'Three candidates: pace, reading level, or pupil interests. Each implies a different data model and a different pitch to schools.',
          },
          {
            k: 'Design system before or after the pilot?',
            v: 'unresolved',
            tone: 'risk',
            note: "Building it first slows the pilot by weeks; skipping it means rebuilding the prototype's interface later.",
          },
          {
            k: 'Who signs off on tutor answers?',
            v: 'open',
            tone: 'warn',
            note: 'Teachers want a review path before anything reaches a child.',
          },
        ],
      },
      {
        title: 'Eval set',
        meta: '100 questions target',
        items: [
          {
            k: 'Questions written',
            v: '38 / 100',
            tone: 'warn',
            note: 'Year 3 reading comprehension only, drawn from real classwork.',
          },
          {
            k: 'Teacher grading',
            v: '2 graders',
            tone: 'ok',
            note: 'Both grade every answer; disagreements get flagged for discussion.',
          },
          {
            k: 'Model choice',
            v: 'deferred',
            tone: 'neutral',
            note: 'Deliberately not picked until the eval set can tell the options apart.',
          },
        ],
      },
    ],
    todos: TODOS['ai-tutor'],
  },

  {
    id: 'moss-cube',
    name: 'Moss Cube',
    badge: 'improvised',
    cta: 'Lock the pattern',
    sub: 'One tufted foam cube, 40 cm · five faces, base left bare · improvised from references, no pattern',
    kind: 'tufting',
    phases: [...PHASES.craft],
    cur: 2,
    directions: true,
    range: '4 Aug – 17 Oct',
    deskKind: 'tufting · 40 cm cube',
    deskMeta: 'yarn order Thu',
    featuredTodoId: 'moss-cube-4',
    noteCount: 36,
    bars: [
      { phase: 'Discovery', span: [2, 4], state: 'done', note: 'Pinterest refs, cube sizing' },
      { phase: 'Definition', span: [3, 6], state: 'done', note: 'colours + pile height picked' },
      { phase: 'Build', span: [5, 10], state: 'now', note: '5 faces to tuft, then assembly' },
    ],
    facts: [
      { k: 'Next date', v: 'Thu 19 Sep — yarn order' },
      { k: 'Scope', v: '1 cube · 5 faces · 40 cm' },
      { k: 'Yarn est.', v: '0.9 kg NZ wool' },
      { k: 'Risk', v: 'Dye lot mismatch on refills' },
    ],
    links: [
      { kind: 'PINTEREST', label: 'Moss & lichen textures — 46 pins' },
      { kind: 'PINTEREST', label: 'Tufted cubes and poufs — 21 pins' },
      { kind: 'PHOTO', label: 'Yarn swatches, shot in daylight' },
    ],
    linkMeta: 'references only — no tracker for this one',
    storyMissing: false,
    extras: [
      {
        title: 'Materials & cost',
        meta: 'one cube',
        items: [
          {
            k: 'NZ wool, 2-ply',
            v: '0.9 kg',
            tone: 'ok',
            note: '£31 at current prices. Order in one lot to avoid dye drift.',
          },
          {
            k: 'Primary cloth',
            v: '1.2 m',
            tone: 'ok',
            note: 'Enough for five faces plus one spare panel.',
          },
          {
            k: 'Foam core, 40 cm',
            v: '1 ordered',
            tone: 'warn',
            note: 'Two-week lead time. Placed 12 Sep, arriving the week of the 26th.',
          },
          {
            k: 'Binding tape and glue',
            v: 'in stock',
            tone: 'ok',
            note: 'Roughly half a roll left, enough for this set.',
          },
        ],
      },
      {
        title: 'Frame log',
        meta: '3 h of 13 planned',
        items: [
          {
            k: 'Top face',
            v: 'done',
            tone: 'ok',
            note: 'Three hours, worked freehand from the Pinterest refs. Denser than planned and better for it.',
          },
          {
            k: 'Side faces',
            v: '0 of 4',
            tone: 'warn',
            note: 'Waiting on the deep green refill before starting.',
          },
          {
            k: 'Finishing',
            v: 'not started',
            tone: 'neutral',
            note: 'Shear, glue, bind, then wrap the core.',
          },
        ],
      },
    ],
    todos: TODOS['moss-cube'],
  },

  {
    id: 'dungeon-synth',
    name: 'Dungeon synth EP',
    badge: '4 tracks',
    cta: 'Move to Composition',
    sub: 'Four-track tape EP · slow analogue pads, no percussion · researching browser and free synths before committing to a chain',
    kind: 'music',
    phases: [...PHASES.music],
    cur: 1,
    directions: false,
    range: '1 Sep – 24 Oct',
    deskKind: 'music',
    deskMeta: '',
    featuredTodoId: 'dungeon-synth-1',
    noteCount: 17,
    bars: [
      { phase: 'Reference', span: [2, 4], state: 'done', note: '12 albums, 3 eras' },
      { phase: 'Sound design', span: [4, 6], state: 'now', note: 'shortlisting synths' },
      { phase: 'Composition', span: [6, 8], state: 'later', note: '4 tracks, 5–7 min each' },
      { phase: 'Mix', span: [8, 9], state: 'later', note: 'tape saturation last' },
      { phase: 'Release', span: [9, 10], state: 'later', note: 'Bandcamp + cassette run' },
    ],
    facts: [
      { k: 'DAW', v: 'FL Studio · 48 kHz / 24-bit' },
      { k: 'Target', v: '4 tracks · ~24 min' },
      { k: 'Risk', v: 'Endless synth research, no writing' },
    ],
    links: [
      { kind: 'DOC', label: 'Synth shortlist + notes' },
      { kind: 'REF', label: 'Reference playlist, 12 albums' },
      { kind: 'DAW', label: 'FL Studio template — dungeon synth' },
    ],
    linkMeta: 'no Aha record — personal project',
    storyMissing: true,
    extras: [
      {
        title: 'Synth shortlist',
        meta: 'free / browser only',
        items: [
          {
            k: 'Surge XT',
            v: 'front-runner',
            tone: 'ok',
            note: 'Best pads of the four. Deep, but the patch browser rewards an afternoon of filing.',
          },
          {
            k: 'Vital',
            v: 'second',
            tone: 'warn',
            note: 'Beautiful wavetables, slightly too clean for tape-era dungeon synth.',
          },
          {
            k: 'TAL-NoiseMaker',
            v: 'keep for leads',
            tone: 'ok',
            note: 'Cheap on CPU and the chorus is exactly right for single-line melodies.',
          },
          {
            k: 'Browser synths',
            v: 'reference only',
            tone: 'neutral',
            note: 'Viktor NV-1 and Ableton Learning Synths are useful for sketching, not for tracking.',
          },
        ],
      },
      {
        title: 'DAW production steps',
        meta: 'FL Studio · 48 kHz / 24-bit',
        items: [
          {
            k: '1 — Template',
            v: 'in progress',
            tone: 'warn',
            note: 'Four pad channels routed to their own mixer inserts, one lead, a shared reverb send, and the tape chain on the master.',
          },
          {
            k: '2 — Track long takes',
            v: 'next',
            tone: 'neutral',
            note: 'Five to seven minutes in one pass. Piano roll snap off, quantise off — drift is the point. Pattern length set well past the ruler default.',
          },
          {
            k: '3 — Layer and detune',
            v: 'next',
            tone: 'neutral',
            note: 'Two saws at 7 cents apart. Wider than that and the pad turns into a chorus wash.',
          },
          {
            k: '4 — Reverb, then saturation',
            v: 'to test',
            tone: 'warn',
            note: 'Long hall on the send, tape saturation after it on the master. Test both orders on track 2 before committing the mixer state.',
          },
          {
            k: '5 — Master and export',
            v: 'later',
            tone: 'neutral',
            note: 'Soft Clipper then Limiter on the master, target around -14 LUFS. Export WAV per track for Bandcamp plus one cassette master.',
          },
        ],
      },
    ],
    todos: TODOS['dungeon-synth'],
  },
];
