import { pipelineBar, pipelineLabel } from '../data/theme';

interface Props {
  phases: string[];
  /** Index of the phase currently in flight. */
  cur: number;
  /** Open to-do counts per phase. Omit on the compact Desk-card variant. */
  counts?: number[];
}

/**
 * The phase pipeline: one column per phase, a 4px bar over a label.
 * Completed phases fill accent, the current one fills accent-mid, future ones
 * stay washed. With `counts` it also shows "N open" beside each label.
 */
export function Pipeline({ phases, cur, counts }: Props) {
  return (
    <div className="pipeline">
      {phases.map((label, i) => (
        <div className="pipeline__col" key={label}>
          <div className="pipeline__bar" style={{ background: pipelineBar(i, cur) }} />
          {counts ? (
            <div className="pipeline__foot">
              <span className="pipeline__label" style={{ color: pipelineLabel(i, cur) }}>
                {label}
              </span>
              <span className="pipeline__count">{counts[i] ? `${counts[i]} open` : ''}</span>
            </div>
          ) : (
            <div className="pipeline__label" style={{ color: pipelineLabel(i, cur) }}>
              {label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
