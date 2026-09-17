import { SEVERITY } from '../data/theme';
import type { Direction } from '../data/types';

/**
 * The dossier for one parallel direction: brief, research, draft, drawbacks,
 * design system, verdict. Swapping the A/B/C tab swaps this whole block.
 */
export function Dossier({ direction }: { direction: Direction }) {
  return (
    <>
      <div className="row row--top">
        <div className="brief">
          <div className="eyebrow">Brief</div>
          <p className="brief__text">{direction.brief}</p>
          <div className="brief__tags">
            {direction.tags.map((t) => (
              <span className="brief__tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <section className="status-card">
          <div className="eyebrow">Status</div>
          {direction.status.map((s) => (
            <div className="kv" key={s.k}>
              <span className="kv__k">{s.k}</span>
              <span className="kv__v">{s.v}</span>
            </div>
          ))}
        </section>
      </div>

      <div className="row">
        <section className="card dossier-card">
          <div className="card__head">
            <h2 className="card__title">Research</h2>
            <span className="grow" />
            <span className="card__meta">{direction.researchMeta}</span>
          </div>
          {direction.research.map((r) => (
            <div className="finding" key={r.title}>
              <div className="finding__row">
                <span className="finding__title">{r.title}</span>
                <span className="finding__src">{r.src}</span>
              </div>
              <div className="finding__body">{r.body}</div>
            </div>
          ))}
        </section>

        <section className="card dossier-card">
          <div className="card__head">
            <h2 className="card__title">Draft</h2>
            <span className="grow" />
            <span className="card__meta">{direction.draftMeta}</span>
          </div>
          {/* Placeholder slot — a real sketch or screenshot belongs here. */}
          <div className="sketch">Sketch placeholder — {direction.draftShot}</div>
          {direction.draft.map((d) => (
            <div className="draft-note" key={d.n}>
              <span className="draft-note__n">{d.n}</span>
              <div className="draft-note__body">{d.body}</div>
            </div>
          ))}
        </section>
      </div>

      <div className="row">
        <section className="drawbacks">
          <div className="card__head">
            <h2 className="drawbacks__title">Drawbacks</h2>
            <span className="grow" />
            <span className="drawbacks__meta">{direction.drawbackMeta}</span>
          </div>
          {direction.drawbacks.map((d) => {
            const sev = SEVERITY[d.sev];
            return (
              <div className="drawback" key={d.title}>
                <div className="drawback__row">
                  <span className="drawback__title">{d.title}</span>
                  <span
                    className="drawback__sev"
                    style={{ background: sev.bg, color: sev.fg }}
                  >
                    {d.sev}
                  </span>
                </div>
                <div className="drawback__body">{d.body}</div>
              </div>
            );
          })}
        </section>

        <section className="card ds">
          <div className="card__head">
            <h2 className="card__title">Design system</h2>
            <span className="grow" />
            <span className="card__meta">{direction.dsName}</span>
          </div>
          <div className="ds__swatches">
            {direction.colors.map((hex) => (
              <div className="ds__swatch" key={hex}>
                <div className="ds__chip" style={{ background: hex }} />
                <div className="ds__hex">{hex}</div>
              </div>
            ))}
          </div>
          <div className="ds__specs">
            <div className="ds__spec">
              <div className="ds__spec-label">Yarn</div>
              <div className="ds__spec-display">{direction.typeDisplay}</div>
            </div>
            <div className="ds__spec">
              <div className="ds__spec-label">Pile &amp; backing</div>
              <div className="ds__spec-ui">{direction.typeUi}</div>
            </div>
          </div>
          <div className="ds__rules">
            {direction.dsNotes.map((n) => (
              <span className="ds__rule" key={n}>
                {n}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className="verdict">
        <div className="verdict__text">{direction.verdict}</div>
        <span className="grow" />
        <button type="button" className="verdict__btn">
          Log this as a decision
        </button>
      </div>
    </>
  );
}
