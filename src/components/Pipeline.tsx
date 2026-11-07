import type { KeyboardEvent, MouseEvent } from 'react';
import { pipelineBar, pipelineLabel } from '../data/theme';

export interface Step {
  id: string;
  label: string;
  done: boolean;
}

interface Props {
  phases: string[];
  /** Index of the phase currently in flight (phases.length = all complete). */
  cur: number;
  /** Open to-do counts per phase. Omit on the compact Desk-card variant. */
  counts?: number[];
  /** Click handler: makes phase `i` current (or completes it if already current). */
  onSelect?: (i: number) => void;
  /** Tasks per phase, drawn as small circles along that phase's bar. */
  steps?: Step[][];
  onToggleStep?: (id: string) => void;
}

/**
 * The phase pipeline: one column per phase — a large circle where the phase
 * starts, a 4px bar, then the label. With `steps`, each task in the phase sits
 * on the bar as a small circle (filled when done) that can be ticked off.
 *
 * Without steps the whole column is the click target. With steps, the large
 * circle and the label pick the phase and each small circle toggles its task,
 * so no control sits inside another. Clicks stop at the pipeline so a Desk
 * card, itself a button, doesn't also open the project.
 */
export function Pipeline({ phases, cur, counts, onSelect, steps, onToggleStep }: Props) {
  const stop = (fn: () => void) => (e: MouseEvent | KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.stopPropagation();
    e.preventDefault();
    fn();
  };
  const withSteps = Boolean(steps && onToggleStep);

  return (
    <div className="pipeline">
      {phases.map((label, i) => {
        const state = i < cur ? 'done' : i === cur ? 'now' : 'later';
        const title = !onSelect
          ? undefined
          : i === cur
            ? `${label} is current — click to mark it complete`
            : `Set ${label} as the current phase`;
        const clickCol = onSelect && !withSteps;
        const phaseSteps = steps?.[i] ?? [];
        const node = (
          <span className={`pipeline__node pipeline__node--${state}`}>
            {state === 'done' && <span className="pipeline__tick">✓</span>}
          </span>
        );
        const labelEl = counts ? (
          <span className="pipeline__foot">
            <span className="pipeline__label" style={{ color: pipelineLabel(i, cur) }}>{label}</span>
            <span className="pipeline__count">
              {phaseSteps.length ? `${phaseSteps.filter((s) => s.done).length}/${phaseSteps.length} steps` : counts[i] ? `${counts[i]} open` : ''}
            </span>
          </span>
        ) : (
          <span className="pipeline__label" style={{ color: pipelineLabel(i, cur) }}>{label}</span>
        );
        return (
          <span
            className={`pipeline__col${clickCol ? ' pipeline__col--click' : ''}`}
            key={label}
            role={clickCol ? 'button' : undefined}
            tabIndex={clickCol ? 0 : undefined}
            title={clickCol ? title : undefined}
            aria-label={clickCol ? title : undefined}
            onClick={clickCol ? stop(() => onSelect!(i)) : undefined}
            onKeyDown={clickCol ? stop(() => onSelect!(i)) : undefined}
          >
            <span className="pipeline__track">
              {withSteps && onSelect ? (
                <button type="button" className="pipeline__nodebtn" title={title} aria-label={title} onClick={stop(() => onSelect(i))}>
                  {node}
                </button>
              ) : (
                node
              )}
              <span className="pipeline__bar" style={{ background: pipelineBar(i, cur) }}>
                {withSteps &&
                  phaseSteps.map((s, k) => (
                    <button
                      type="button"
                      key={s.id}
                      className={`pipeline__step${s.done ? ' pipeline__step--done' : ''}`}
                      style={{ left: `${((k + 1) / (phaseSteps.length + 1)) * 100}%` }}
                      title={`${s.label}${s.done ? ' (done)' : ''}`}
                      aria-label={`${s.label}: mark ${s.done ? 'not done' : 'done'}`}
                      aria-pressed={s.done}
                      onClick={stop(() => onToggleStep!(s.id))}
                    />
                  ))}
              </span>
            </span>
            {withSteps && onSelect ? (
              <button type="button" className="pipeline__labelbtn" onClick={stop(() => onSelect(i))} title={title}>
                {labelEl}
              </button>
            ) : (
              labelEl
            )}
          </span>
        );
      })}
    </div>
  );
}
