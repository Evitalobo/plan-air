import type { Todo } from './types';

/**
 * Every project's to-dos. Big tasks are broken into subtasks so each step can
 * be ticked off on its own. Order within a project is the authored order; the
 * to-do table groups by priority, and dragging a task between groups changes
 * its priority.
 */
export const TODOS: Record<string, Todo[]> = {
  healthagg: [
    {
      id: 'healthagg-1', text: 'Cut scope for the clinic beta', hint: 'filters in, saved searches out',
      phase: 'Build', prio: 'High', window: '15 – 19 Sep', due: 'Fri',
      subs: [
        { id: 'healthagg-1a', text: 'List every feature in the current build', est: '1 h', done: true },
        { id: 'healthagg-1b', text: 'Mark each in, out or later with the PM', hint: 'saved searches out', est: '1 h' },
        { id: 'healthagg-1c', text: 'Update the beta scope page in the PRD', est: '30 min' },
        { id: 'healthagg-1d', text: 'Walk the two engineers through the cut', est: '30 min' },
      ],
    },
    {
      id: 'healthagg-2', text: 'Write acceptance criteria for the coverage filter', hint: 'HAG-112-4',
      phase: 'Build', prio: 'High', window: '16 – 23 Sep', due: '23 Sep',
      subs: [
        { id: 'healthagg-2a', text: 'Happy path: filter by one insurer', est: '30 min' },
        { id: 'healthagg-2b', text: 'Edge cases: no insurer, stale coverage data', est: '45 min' },
        { id: 'healthagg-2c', text: 'Chip row states: default, selected, disabled', est: '30 min' },
      ],
    },
    {
      id: 'healthagg-3', text: 'Agree the weekly data refresh with the platform team', hint: 'or the results go stale',
      phase: 'Build', prio: 'High', window: '18 – 25 Sep', due: '25 Sep',
      subs: [
        { id: 'healthagg-3a', text: 'Book the meeting with platform', est: '10 min' },
        { id: 'healthagg-3b', text: 'Draft the stale-data banner wording', est: '30 min' },
        { id: 'healthagg-3c', text: 'Decide on the refresh day', est: '30 min' },
      ],
    },
    {
      id: 'healthagg-4', text: 'Recruit five testers from the two beta clinics', hint: 'front-desk staff, not clinicians',
      phase: 'Validation', prio: 'Medium', window: '28 Sep – 3 Oct', due: '3 Oct',
      subs: [
        { id: 'healthagg-4a', text: 'Write the recruiting note for clinic managers', est: '30 min' },
        { id: 'healthagg-4b', text: 'Schedule the five sessions', est: '1 h' },
        { id: 'healthagg-4c', text: 'Prepare the test script', est: '2 h' },
      ],
    },
    { id: 'healthagg-5', text: 'Draft the staged rollout plan', hint: '10% then 50%', phase: 'Launch', prio: 'Low', window: '6 – 10 Oct', due: '10 Oct' },
    { id: 'healthagg-6', text: 'PRD v3 sign-off', phase: 'Definition', prio: 'High', window: '7 – 12 Sep', due: 'done', done: true },
    { id: 'healthagg-7', text: 'Twelve discovery calls with clinic staff', phase: 'Discovery', prio: 'Medium', window: '31 Aug – 5 Sep', due: 'done', done: true },
    { id: 'healthagg-8', text: 'Define the search-to-booking metric', phase: 'Discovery', prio: 'Low', window: '18 Aug', due: 'done', done: true },
  ],

  'ai-tutor': [
    {
      id: 'ai-tutor-1', text: 'Cut the MVP to one year group', hint: 'Year 3 only, reading comprehension',
      phase: 'Definition', prio: 'High', window: '22 – 30 Sep', due: '30 Sep',
      subs: [
        { id: 'ai-tutor-1a', text: 'Confirm Year 3 with both schools', est: '1 h' },
        { id: 'ai-tutor-1b', text: 'Write the one-page MVP scope', est: '2 h' },
      ],
    },
    {
      id: 'ai-tutor-2', text: 'Build an eval set of 100 pupil questions', hint: 'graded by two teachers, before any model choice',
      phase: 'Definition', prio: 'High', window: '22 Sep – 3 Oct', due: '3 Oct',
      subs: [
        { id: 'ai-tutor-2a', text: 'Collect real classwork from both schools', est: '2 h', done: true },
        { id: 'ai-tutor-2b', text: 'Write the first 50 questions', hint: '38 written so far', est: '4 h' },
        { id: 'ai-tutor-2c', text: 'Write the next 50 questions', est: '4 h' },
        { id: 'ai-tutor-2d', text: 'Set up grading with the two teachers', est: '1 h' },
      ],
    },
    { id: 'ai-tutor-3', text: 'Test two pricing shapes with the schools', hint: 'per-pupil vs per-class', phase: 'Definition', prio: 'Medium', window: 'Oct', due: '—' },
    { id: 'ai-tutor-4', text: 'Map the procurement cycle for both schools', hint: 'when budgets actually open', phase: 'Definition', prio: 'Medium', window: 'Oct', due: '—' },
    {
      id: 'ai-tutor-5', text: 'Prototype the tutor loop with a scripted model', hint: 'hard-coded answers, real interface',
      phase: 'Build', prio: 'Low', window: 'Oct – Nov', due: '—',
      subs: [
        { id: 'ai-tutor-5a', text: 'Sketch the question → hint → answer loop', est: '2 h' },
        { id: 'ai-tutor-5b', text: 'Script ten answers by hand', est: '2 h' },
        { id: 'ai-tutor-5c', text: 'Build the clickable prototype', est: '1 day' },
      ],
    },
    { id: 'ai-tutor-6', text: 'Six teacher interviews', phase: 'Discovery', prio: 'High', window: 'Sep', due: 'done', done: true },
  ],

  'moss-cube': [
    {
      id: 'moss-cube-1', text: 'Identify the tufting gun', hint: 'cut pile at 8 mm, fits the frame',
      phase: 'Discovery', prio: 'High', window: '25 – 29 Aug', due: 'done', done: true,
      subs: [
        { id: 'moss-cube-1a', text: 'Compare cut-pile and loop-pile guns', est: '1 h', done: true },
        { id: 'moss-cube-1b', text: 'Check the gun fits the frame and cloth', est: '30 min', done: true },
        { id: 'moss-cube-1c', text: 'Order the gun', est: '15 min', done: true },
      ],
    },
    {
      id: 'moss-cube-2', text: 'Initial sketches', hint: 'from the Pinterest refs',
      phase: 'Discovery', prio: 'Medium', window: '1 – 5 Sep', due: 'done', done: true,
      subs: [
        { id: 'moss-cube-2a', text: 'Collect moss and lichen references', est: '1 h', done: true },
        { id: 'moss-cube-2b', text: 'Thumbnail three texture layouts', est: '1.5 h', done: true },
        { id: 'moss-cube-2c', text: 'Pick one layout for each face', est: '30 min', done: true },
      ],
    },
    {
      id: 'moss-cube-3', text: 'Decide the size', hint: '40 cm cube, base left bare until the end',
      phase: 'Definition', prio: 'Medium', window: '8 – 12 Sep', due: 'done', done: true,
      subs: [
        { id: 'moss-cube-3a', text: 'Settle on a 40 cm cube', est: '15 min', done: true },
        { id: 'moss-cube-3b', text: 'Order the 40 cm foam core', hint: 'two-week lead time', est: '15 min', done: true },
        { id: 'moss-cube-3c', text: 'Mark the five face squares on the cloth', est: '1 h', done: true },
      ],
    },
    {
      id: 'moss-cube-4', text: 'Colour palette and yarn swatches', hint: 'yarn order depends on it',
      phase: 'Definition', prio: 'High', window: '15 – 19 Sep', due: 'Thu',
      subs: [
        { id: 'moss-cube-4a', text: 'Order the wool swatch card', est: '10 min', done: true },
        { id: 'moss-cube-4b', text: 'Photograph the swatches in daylight', est: '30 min', done: true },
        { id: 'moss-cube-4c', text: 'Settle the three greens', hint: 'from the Pinterest refs', est: '1 h' },
        { id: 'moss-cube-4d', text: 'Order 0.4 kg of the deep green', hint: 'same dye lot as the swatch', est: '10 min' },
      ],
    },
    {
      id: 'moss-cube-5', text: 'Tuft each side', hint: 'five faces, worked freehand',
      phase: 'Build', prio: 'High', window: '20 Sep – 3 Oct', due: '3 Oct',
      subs: [
        { id: 'moss-cube-5a', text: 'Top face', hint: 'densest moss texture', est: '3 h', done: true },
        { id: 'moss-cube-5b', text: 'Side face 1', hint: 'carry the top colours over the edge', est: '2.5 h' },
        { id: 'moss-cube-5c', text: 'Side face 2', est: '2.5 h' },
        { id: 'moss-cube-5d', text: 'Side face 3', est: '2.5 h' },
        { id: 'moss-cube-5e', text: 'Side face 4', hint: 'darkest of the four, sits to the wall', est: '2.5 h' },
      ],
    },
    {
      id: 'moss-cube-6', text: 'Sew the faces on by hand', hint: 'around the foam core',
      phase: 'Build', prio: 'Medium', window: '6 – 10 Oct', due: '10 Oct',
      subs: [
        { id: 'moss-cube-6a', text: 'Shear the five faces to 8 mm', hint: 'one pass, same direction', est: '1.5 h' },
        { id: 'moss-cube-6b', text: 'Glue the backing, 24 h cure', hint: 'flat, weighted', est: '1 h + cure' },
        { id: 'moss-cube-6c', text: 'Hand-stitch the faces together over the foam', hint: 'cotton thread, hidden seams', est: '3 h' },
      ],
    },
    {
      id: 'moss-cube-7', text: 'Dye the brown base fabric', hint: 'so the bottom matches the moss',
      phase: 'Build', prio: 'Medium', window: '11 – 14 Oct', due: '14 Oct',
      subs: [
        { id: 'moss-cube-7a', text: 'Test the dye on a scrap of the brown fabric', est: '1 h' },
        { id: 'moss-cube-7b', text: 'Dye the base panel', est: '2 h' },
        { id: 'moss-cube-7c', text: 'Rinse, dry flat and press', est: '30 min + dry' },
      ],
    },
    {
      id: 'moss-cube-8', text: 'Sew up the bottom of the cube', hint: 'last step',
      phase: 'Build', prio: 'Low', window: '15 – 17 Oct', due: '17 Oct',
      subs: [
        { id: 'moss-cube-8a', text: 'Pin the dyed base to the four side faces', est: '30 min' },
        { id: 'moss-cube-8b', text: 'Hand-sew the base closed', hint: 'ladder stitch', est: '1.5 h' },
      ],
    },
  ],

  'dungeon-synth': [
    {
      id: 'dungeon-synth-1', text: 'Compare the free browser synths side by side', hint: 'Viktor NV-1, Websynths, Ableton Learning Synths',
      phase: 'Sound design', prio: 'High', window: '15 – 22 Sep', due: '22 Sep',
      subs: [
        { id: 'dungeon-synth-1a', text: 'Make one pad patch in each', est: '1.5 h' },
        { id: 'dungeon-synth-1b', text: 'Record a 30-second sketch from each', est: '1 h' },
      ],
    },
    {
      id: 'dungeon-synth-2', text: 'Audition the free VSTs against the references', hint: 'Surge XT, Vital, Dexed, TAL-NoiseMaker',
      phase: 'Sound design', prio: 'High', window: '18 – 25 Sep', due: '25 Sep',
      subs: [
        { id: 'dungeon-synth-2a', text: 'Surge XT pads', est: '1 h', done: true },
        { id: 'dungeon-synth-2b', text: 'Vital wavetables', est: '1 h' },
        { id: 'dungeon-synth-2c', text: 'Dexed and TAL-NoiseMaker leads', est: '1 h' },
      ],
    },
    { id: 'dungeon-synth-3', text: 'Pick one pad synth and stop looking', hint: 'the research is becoming the project', phase: 'Sound design', prio: 'High', window: '26 Sep', due: '26 Sep' },
    {
      id: 'dungeon-synth-4', text: 'Build the FL Studio template', hint: '4 pad channels, reverb send, tape bus on the master',
      phase: 'Sound design', prio: 'Medium', window: '27 – 30 Sep', due: '30 Sep',
      subs: [
        { id: 'dungeon-synth-4a', text: 'Route four pad channels to mixer inserts', est: '30 min' },
        { id: 'dungeon-synth-4b', text: 'Add the shared reverb send', est: '20 min' },
        { id: 'dungeon-synth-4c', text: 'Put the tape chain on the master', est: '30 min' },
      ],
    },
    {
      id: 'dungeon-synth-5', text: 'Write the four main motifs', hint: 'one page of notation each, no DAW',
      phase: 'Composition', prio: 'Medium', window: 'Oct', due: '—',
      subs: [
        { id: 'dungeon-synth-5a', text: 'Track 1 motif', est: '1 h' },
        { id: 'dungeon-synth-5b', text: 'Track 2 motif', est: '1 h' },
        { id: 'dungeon-synth-5c', text: 'Track 3 motif', est: '1 h' },
        { id: 'dungeon-synth-5d', text: 'Track 4 motif', est: '1 h' },
      ],
    },
    { id: 'dungeon-synth-6', text: 'Track the pads in long single takes', hint: 'piano roll snap off, no quantise', phase: 'Composition', prio: 'Medium', window: 'Oct', due: '—' },
    { id: 'dungeon-synth-7', text: 'Mix: reverb before saturation, not after', hint: 'test both on track 2 first', phase: 'Mix', prio: 'Low', window: 'Oct – Nov', due: '—' },
    { id: 'dungeon-synth-8', text: 'Collect the reference playlist', phase: 'Reference', prio: 'Medium', window: '1 – 8 Sep', due: 'done', done: true },
    { id: 'dungeon-synth-9', text: 'Write down what the EP should feel like', phase: 'Reference', prio: 'Low', window: '1 Sep', due: 'done', done: true },
  ],
};
