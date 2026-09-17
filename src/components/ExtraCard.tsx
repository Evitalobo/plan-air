import { CHIP } from '../data/theme';
import type { Extra } from '../data/types';

/**
 * One of the two project-specific cards below the to-do table. The shape is
 * fixed — key, status chip, note — but what fills it is per project: beta
 * readiness for a product, a frame log for a rug, DAW steps for an EP.
 */
export function ExtraCard({ extra }: { extra: Extra }) {
  return (
    <section className="card extra">
      <div className="card__head">
        <h2 className="card__title">{extra.title}</h2>
        <span className="grow" />
        <span className="card__meta">{extra.meta}</span>
      </div>
      {extra.items.map((it) => {
        const chip = CHIP[it.tone];
        return (
          <div className="extra__item" key={it.k}>
            <div className="extra__row">
              <span className="extra__k">{it.k}</span>
              <span className="grow" />
              <span className="pill" style={{ background: chip.bg, color: chip.fg }}>
                {it.v}
              </span>
            </div>
            <div className="extra__note">{it.note}</div>
          </div>
        );
      })}
    </section>
  );
}
