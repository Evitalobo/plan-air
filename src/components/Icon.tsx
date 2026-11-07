/**
 * The mockup used text glyphs (▤ ◫ ✎ ⚑ ⌕ ✓ ↗ ＋ ?) as placeholders for a real
 * icon set. These are minimal stroke icons standing in for that set — swap the
 * whole file for the target codebase's icon library and keep the names.
 */

export type IconName =
  | 'desk'
  | 'projects'
  | 'notes'
  | 'decisions'
  | 'search'
  | 'plus'
  | 'check'
  | 'external'
  | 'arrow-right'
  | 'music'
  | 'laptop'
  | 'sewing'
  | 'grip'
  | 'close'
  | 'arrow-up'
  | 'arrow-left'
  | 'star'
  | 'brush'
  | 'book'
  | 'camera'
  | 'leaf'
  | 'home';

interface Props {
  name: IconName;
  size?: number;
  className?: string;
}

const PATHS: Record<IconName, JSX.Element> = {
  desk: (
    <>
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" />
      <path d="M1.5 5.5h11" />
    </>
  ),
  projects: (
    <>
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" />
      <path d="M5.5 2.5v9" />
    </>
  ),
  notes: (
    <>
      <path d="M9.6 2.4 11.6 4.4 5 11H3V9z" />
      <path d="M8.2 3.8 10.2 5.8" />
    </>
  ),
  decisions: (
    <>
      <path d="M3.5 12V2.5" />
      <path d="M3.5 3h7l-1.4 2.2L10.5 7.5h-7" />
    </>
  ),
  search: (
    <>
      <circle cx="6.2" cy="6.2" r="3.9" />
      <path d="M9.2 9.2 12 12" />
    </>
  ),
  plus: (
    <>
      <path d="M7 2.8v8.4M2.8 7h8.4" />
    </>
  ),
  check: (
    <>
      <path d="M2.6 7.3 5.4 10 11.4 4" />
    </>
  ),
  external: (
    <>
      <path d="M5 2.8h6.2V9" />
      <path d="M11.2 2.8 3.2 10.8" />
    </>
  ),
  music: (
    <>
      <path d="M5.2 10.4V3.2l6-1.2v7" />
      <circle cx="3.8" cy="10.6" r="1.6" />
      <circle cx="9.8" cy="9.2" r="1.6" />
    </>
  ),
  laptop: (
    <>
      <rect x="2.6" y="3" width="8.8" height="6" rx="0.9" />
      <path d="M1.2 11.2h11.6" />
    </>
  ),
  sewing: (
    <>
      <path d="M11.6 2.4 3 11" />
      <ellipse cx="10.6" cy="3.4" rx="0.5" ry="0.9" transform="rotate(45 10.6 3.4)" />
      <path d="M10.2 3.8c-3 1-6.6 1.2-7.4 3.6-.6 1.9 1.6 2.6 3 1.5" />
    </>
  ),
  grip: (
    <>
      <circle cx="5.2" cy="3.6" r=".7" /><circle cx="8.8" cy="3.6" r=".7" />
      <circle cx="5.2" cy="7" r=".7" /><circle cx="8.8" cy="7" r=".7" />
      <circle cx="5.2" cy="10.4" r=".7" /><circle cx="8.8" cy="10.4" r=".7" />
    </>
  ),
  close: (<path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />),
  'arrow-up': (<><path d="M7 11.4V2.6" /><path d="M3.4 6.2 7 2.6l3.6 3.6" /></>),
  'arrow-left': (<><path d="M11.4 7H2.6" /><path d="M6.2 3.4 2.6 7l3.6 3.6" /></>),
  star: (<path d="M7 1.8l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 10l-3.2 1.7.6-3.6L1.8 5.6l3.6-.5z" />),
  brush: (<><path d="M12 2 6.4 7.6" /><path d="M6.4 7.6c-1.5-.4-3 .6-3 2.2 0 .9-.6 1.6-1.4 1.8 2.6.9 5.2-.3 5.4-2.6z" /></>),
  book: (<><path d="M2.4 2.8h3.4A1.6 1.6 0 0 1 7.4 4.4v7.2a1.2 1.2 0 0 0-1.2-1.2H2.4z" /><path d="M11.6 2.8H8.2A1.6 1.6 0 0 0 6.6 4.4v7.2a1.2 1.2 0 0 1 1.2-1.2h3.8z" /></>),
  camera: (<><path d="M1.8 4.6h2.4l1-1.6h3.6l1 1.6h2.4v6.6H1.8z" /><circle cx="7" cy="7.8" r="2" /></>),
  leaf: (<><path d="M11.8 2.2C6 2 2.6 4.8 2.8 9.6c4.6.4 8.8-2.4 9-7.4z" /><path d="M2.4 11.6 7.4 6.6" /></>),
  home: (<><path d="M2 6.6 7 2.4l5 4.2" /><path d="M3.4 5.6v6h7.2v-6" /></>),
  'arrow-right': (
    <>
      <path d="M2.6 7h8.8" />
      <path d="M7.8 3.4 11.4 7l-3.6 3.6" />
    </>
  ),
};

export function Icon({ name, size = 14, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
