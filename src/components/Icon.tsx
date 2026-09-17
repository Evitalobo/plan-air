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
  | 'arrow-right';

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
