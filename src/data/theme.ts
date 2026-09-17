import type { BarState, ChipTone, LinkKind, Priority, ProjectKind, Severity } from './types';

export interface Pair {
  bg: string;
  fg: string;
}

/**
 * Phase chip colours. Keyed by phase name across every project vocabulary —
 * the palette rhymes by position in a pipeline rather than by domain, so
 * Discovery and Reference share a pair, Build and Composition share a pair,
 * and so on. Unknown phases fall back to a neutral stone pair.
 */
export const PHASE_STYLE: Record<string, Pair> = {
  // Product design / product management
  Discovery: { bg: '#eef3f6', fg: '#3f6076' },
  Definition: { bg: '#f4f0f6', fg: '#5b4a76' },
  Build: { bg: '#edf4ef', fg: '#2f6f4e' },
  Validation: { bg: '#f6f1ea', fg: '#7a6132' },
  Launch: { bg: '#f0f4f1', fg: '#46555d' },
  // Music
  Reference: { bg: '#eef3f6', fg: '#3f6076' },
  'Sound design': { bg: '#f4f0f6', fg: '#5b4a76' },
  Composition: { bg: '#edf4ef', fg: '#2f6f4e' },
  Mix: { bg: '#f6f1ea', fg: '#7a6132' },
  Release: { bg: '#f0f4f1', fg: '#46555d' },
  // Craft
  Pattern: { bg: '#f4f0f6', fg: '#5b4a76' },
  Materials: { bg: '#f6f1ea', fg: '#7a6132' },
  Tufting: { bg: '#edf4ef', fg: '#2f6f4e' },
  Finishing: { bg: '#eef3f6', fg: '#3f6076' },
  Photograph: { bg: '#f0f4f1', fg: '#46555d' },
};

export const PHASE_FALLBACK: Pair = { bg: '#f2f1ef', fg: '#6b6558' };

export const phaseStyle = (phase: string): Pair => PHASE_STYLE[phase] ?? PHASE_FALLBACK;

export const PRIO: Record<Priority, { dot: string; fg: string }> = {
  High: { dot: '#8a4a3a', fg: '#8a4a3a' },
  Medium: { dot: '#c9902f', fg: '#7a6132' },
  Low: { dot: '#b6c0c4', fg: '#7b8a91' },
};

/** Timeline bar fill / inline-note ink / phase-label ink, by state. */
export const BAR: Record<BarState, { bg: string; ink: string; label: string }> = {
  done: { bg: '#2f6f4e', ink: '#ffffff', label: '#46555d' },
  now: { bg: '#93c0a6', ink: '#17352a', label: '#101a21' },
  later: { bg: '#e7efe9', ink: '#46555d', label: '#9aa6ab' },
};

export const CHIP: Record<ChipTone, Pair> = {
  ok: { bg: '#edf4ef', fg: '#2f6f4e' },
  warn: { bg: '#f6ece4', fg: '#7a6132' },
  risk: { bg: '#f3ded8', fg: '#8a4a3a' },
  neutral: { bg: '#f1f4f5', fg: '#5b6a72' },
};

export const SEVERITY: Record<Severity, Pair> = {
  Blocker: { bg: '#f3ded8', fg: '#8a4a3a' },
  Medium: { bg: '#f6ece4', fg: '#8a6a3a' },
  Low: { bg: '#eef1f3', fg: '#5b6a72' },
};

/** Mono kind tag colour inside a link pill. */
export const LINK_KIND_FG: Record<LinkKind, string> = {
  AHA: '#2f6f4e',
  STORY: '#3f6076',
  REF: '#3f6076',
  PRD: '#7a6132',
  PATTERN: '#7a6132',
  PHOTO: '#7a6132',
  DOC: '#7a6132',
  DAW: '#6b6558',
  FORM: '#6b6558',
  PINTEREST: '#8a4a3a',
};

/** Sidebar dot colour and trailing type badge, by project kind. */
export const KIND: Record<ProjectKind, { dot: string; badge: string }> = {
  tufting: { dot: '#2f6f4e', badge: 'rug' },
  music: { dot: '#5b4a76', badge: 'EP' },
  pm: { dot: '#c9902f', badge: 'product' },
};

/** Pipeline bar fill for a phase at `i`, given the current phase index. */
export const pipelineBar = (i: number, cur: number): string =>
  i < cur ? '#2f6f4e' : i === cur ? '#93c0a6' : '#e7efe9';

/** Pipeline label ink for a phase at `i`, given the current phase index. */
export const pipelineLabel = (i: number, cur: number): string => (i <= cur ? '#46555d' : '#9aa6ab');
