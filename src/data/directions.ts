import type { Direction } from './types';

/**
 * Parallel options explored inside a project that carries directions.
 * Only Moss Cube uses these in the prototype; the A/B/C tabs swap the whole
 * dossier below the to-do card.
 */
export const DIRECTIONS: Direction[] = [
  {
    id: 'A',
    name: 'Tide Lines',
    stage: 'Definition',
    brief:
      'Horizontal bands of unequal width, drawn from a tide chart of the bay. Cut pile throughout, with the palette shifting from wet slate at one end to dry sand at the other.',
    tags: ['Cut pile 8 mm', '5 colours', 'Simplest to tuft'],
    status: [
      { k: 'Phase', v: 'Definition · locked draft' },
      { k: 'Confidence', v: 'High' },
      { k: 'Frame time', v: '~18 h' },
      { k: 'Yarn', v: '3.1 kg · 5 colours' },
    ],
    researchMeta: '4 tests',
    research: [
      {
        title: 'Straight bands tuft fast',
        src: 'scrap test, 2 Sep',
        body: 'Long straight passes ran roughly a third quicker than curves, with far fewer restarts.',
      },
      {
        title: 'Unequal widths read as intentional',
        src: 'photos, 6 Sep',
        body: 'Even bands looked like a shop rug. Widths taken from the real tide chart read as designed.',
      },
      {
        title: 'Colour drift needs one dye lot',
        src: 'swatch card',
        body: 'Two of the five greys shift noticeably between lots. Whole quantity must be ordered at once.',
      },
    ],
    draftMeta: 'v4 · 2h ago',
    draftShot: 'banded layout, full rug',
    draft: [
      { n: '01', body: 'Bands run the short way, so the rug reads wider in the hallway.' },
      { n: '02', body: 'Widest band sits a third up from the bottom, not centred.' },
      { n: '03', body: 'Border in loop pile to hold the edge straight.' },
    ],
    drawbackMeta: '2 concerns',
    drawbacks: [
      {
        title: 'Shows wandering edges',
        sev: 'Blocker',
        body: 'Any drift in a band line is visible across the whole rug. Needs row marks every ten rows.',
      },
      {
        title: 'Least distinctive',
        sev: 'Medium',
        body: 'Close to two rugs already made. Little learned from tufting it.',
      },
      {
        title: 'Heavy on grey',
        sev: 'Low',
        body: 'Five near-neighbours in the palette flatten under warm hallway light.',
      },
    ],
    dsName: 'Tide Lines · palette v2',
    colors: ['#2a3b45', '#2f6f4e', '#93c0a6', '#e8e0d2', '#8a4a3a'],
    typeDisplay: 'NZ wool 2-ply, 3.1 kg',
    typeUi: 'Cut 8 mm · loop border · non-slip backing',
    dsNotes: [
      'Band widths from the tide chart',
      'One dye lot per colour',
      'Loop only at the edge',
      'No colour repeats side by side',
    ],
    verdict:
      'The safe build: quickest on the frame, and the one direction that teaches nothing new.',
  },
  {
    id: 'B',
    name: 'Fern Spiral',
    stage: 'Definition',
    brief:
      'A single unfurling fern spiral filling the field, cut pile at two heights so the frond catches light differently from the ground. Three colours only.',
    tags: ['Two pile heights', '3 colours', 'Hardest to tuft'],
    status: [
      { k: 'Phase', v: 'Definition · in test' },
      { k: 'Confidence', v: 'Medium' },
      { k: 'Frame time', v: '~28 h' },
      { k: 'Yarn', v: '3.4 kg · 3 colours' },
    ],
    researchMeta: '6 tests',
    research: [
      {
        title: 'Curves need slower passes',
        src: 'scrap test, 4 Sep',
        body: 'Tight curves at the spiral centre took three attempts before the line held. Budget extra yarn for redos.',
      },
      {
        title: 'Two pile heights read well',
        src: 'scrap test, 9 Sep',
        body: 'A 4 mm difference was enough to separate frond from ground without a colour change.',
      },
      {
        title: 'Three colours is plenty',
        src: 'photos, 11 Sep',
        body: 'Adding a fourth green muddied the spiral. Contrast came from height, not hue.',
      },
    ],
    draftMeta: 'v2 · 3d ago',
    draftShot: 'spiral centred low-left',
    draft: [
      {
        n: '01',
        body: 'Spiral centre sits low and left, frond unfurling toward the top right corner.',
      },
      { n: '02', body: 'Ground tufted at 12 mm, frond sheared back to 8 mm.' },
      { n: '03', body: 'Ground colour carries under the frond so no gap shows at the join.' },
    ],
    drawbackMeta: '1 blocker',
    drawbacks: [
      {
        title: 'Shearing two heights by hand',
        sev: 'Blocker',
        body: 'No jig for it yet. One slip flattens the frond and cannot be undone.',
      },
      {
        title: 'Longest frame time',
        sev: 'Medium',
        body: 'Roughly ten hours more than Tide Lines, against a Thursday yarn deadline.',
      },
      {
        title: 'Hard to repeat as a commission',
        sev: 'Low',
        body: 'If it sells well, a second one is a full re-draw rather than a recolour.',
      },
    ],
    dsName: 'Fern Spiral · palette v1',
    colors: ['#13221c', '#2f6f4e', '#9cc2a4', '#f2f3ef', '#c9772f'],
    typeDisplay: 'NZ wool 2-ply, 3.4 kg',
    typeUi: 'Cut 12 mm ground · 8 mm frond · glue + bind',
    dsNotes: [
      'Height does the contrast',
      'Three colours, no more',
      'Spiral off-centre by a third',
      'Test the shear on scrap first',
    ],
    verdict:
      'The best rug of the three and the riskiest to make. The shearing question decides it.',
  },
  {
    id: 'C',
    name: 'Colour Block',
    stage: 'Definition',
    brief:
      'Four large blocks, one per colour, meeting slightly off-square so the seams read hand-drawn. Loop pile throughout for a flat, dense surface.',
    tags: ['Loop pile', '4 colours', 'Most forgiving'],
    status: [
      { k: 'Phase', v: 'Definition · sketch' },
      { k: 'Confidence', v: 'Medium' },
      { k: 'Frame time', v: '~20 h' },
      { k: 'Yarn', v: '3.6 kg · 4 colours' },
    ],
    researchMeta: '3 tests',
    research: [
      {
        title: 'Loop hides small errors',
        src: 'scrap test, 7 Sep',
        body: 'Off-line rows disappeared into the loop surface in a way cut pile never managed.',
      },
      {
        title: 'Off-square seams look deliberate',
        src: 'photos, 10 Sep',
        body: 'A 2–3 cm wander at the seam read as handmade. Beyond 5 cm it read as a mistake.',
      },
      {
        title: 'Loop uses more yarn',
        src: 'weight check',
        body: 'About 15% more than cut pile at the same coverage.',
      },
    ],
    draftMeta: 'sketch · 1w ago',
    draftShot: 'four blocks, off-square seams',
    draft: [
      { n: '01', body: 'Two large blocks, two small, so the rug does not read as a grid.' },
      { n: '02', body: 'Seams drawn freehand on the cloth rather than ruled.' },
      { n: '03', body: 'Darkest block placed at the door end where wear shows most.' },
    ],
    drawbackMeta: '2 open risks',
    drawbacks: [
      {
        title: 'Reads flat in photos',
        sev: 'Medium',
        body: 'Loop pile loses all shadow under even light, which makes it hard to sell online.',
      },
      {
        title: 'Most yarn of the three',
        sev: 'Medium',
        body: 'About £40 more, and the deep green would need a second order.',
      },
      {
        title: 'Least tested',
        sev: 'Low',
        body: 'Only three scrap tests so far, none at full block size.',
      },
    ],
    dsName: 'Colour Block · palette v0',
    colors: ['#1a1725', '#5b4bd6', '#b7b0ee', '#f4f1f6', '#c0455f'],
    typeDisplay: 'NZ wool 2-ply, 3.6 kg',
    typeUi: 'Loop 9 mm throughout · glue + bind',
    dsNotes: [
      'Blocks never equal in size',
      'Seams freehand, not ruled',
      'Dark block at the door end',
      'Loop pile only, no mixing',
    ],
    verdict:
      'Most forgiving on the frame, weakest in photographs. A good fallback if the shear test fails.',
  },
];
