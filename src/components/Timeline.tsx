import { TODAY_SPAN, WEEKS } from '../data/projects';
import { BAR } from '../data/theme';
import type { Project } from '../data/types';

/**
 * Eight-week grid: a 98px phase-label column plus eight equal week columns.
 * Each phase bar is placed with `grid-column: start / end`, so the bar's span
 * and the week ruler above it stay locked together.
 */
export function Timeline({ project }: { project: Project }) {
  return (
    <section className="card timeline">
      <div className="card__head">
        <h2 className="card__title">Timeline</h2>
        <span className="grow" />
        <span className="card__meta">{project.range}</span>
      </div>

      <div className="tl-grid">
        <span />
        {WEEKS.map((w) => (
          <div className="tl__week" key={w}>
            {w}
          </div>
        ))}
      </div>

      <div className="tl__rows">
        {project.bars.map((b) => {
          // Bar state follows the project's current phase, so clicking a phase
          // in the pipeline updates the timeline too.
          const idx = project.phases.indexOf(b.phase);
          const state = idx < 0 ? b.state : idx < project.cur ? 'done' : idx === project.cur ? 'now' : 'later';
          const tone = BAR[state];
          return (
            <div className="tl-grid tl-grid--rows" key={b.phase}>
              <div className="tl__phase" style={{ color: tone.label }}>
                {b.phase}
              </div>
              <div
                className="tl__bar"
                style={{
                  gridColumn: `${b.span[0]} / ${b.span[1]}`,
                  background: tone.bg,
                  color: tone.ink,
                }}
              >
                {b.note}
              </div>
            </div>
          );
        })}
      </div>

      <div className="tl-grid tl__foot">
        <span className="tl__foot-label">this week</span>
        <div className="tl__marker" style={{ gridColumn: `${TODAY_SPAN[0]} / ${TODAY_SPAN[1]}` }}>
          <span />
        </div>
      </div>
    </section>
  );
}
