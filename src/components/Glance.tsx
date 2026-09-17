import { facts } from '../state/selectors';
import type { Project } from '../data/types';

/** Phase and open-to-do counts here are derived, so checkboxes move them. */
export function Glance({ project }: { project: Project }) {
  return (
    <section className="card glance">
      <div className="eyebrow">At a glance</div>
      {facts(project).map((f) => (
        <div className="kv" key={f.k}>
          <span className="kv__k">{f.k}</span>
          <span className="kv__v">{f.v}</span>
        </div>
      ))}
    </section>
  );
}
