import { DESK, QUESTIONS, RESUME, UP_NEXT, WEEK, WEEK_TONE } from '../data/desk';
import { nextTodo } from '../state/selectors';
import { usePlanner } from '../state/store';
import { Checkbox } from './Checkbox';
import { Icon } from './Icon';
import { Pipeline } from './Pipeline';

export function Desk() {
  const { projects, notes, openProject, toggleTodo } = usePlanner();
  const byId = (id: string) => projects.find((p) => p.id === id);

  return (
    <div className="desk">
      <main className="desk__main">
        <header className="page-head">
          <div className="page-head__text">
            <h1 className="page-head__title">{DESK.title}</h1>
            <div className="page-head__sub">{DESK.sub}</div>
          </div>
          <span className="grow" />
          <div className="page-head__actions">
            <button type="button" className="btn btn--ghost">
              New note
            </button>
            <button type="button" className="btn btn--primary">
              New project
            </button>
          </div>
        </header>

        {/* Resume ------------------------------------------------- */}
        <section className="resume">
          <div className="resume__text">
            <div className="eyebrow resume__eyebrow">{RESUME.eyebrow}</div>
            <div className="resume__title">{RESUME.title}</div>
            <div className="resume__meta">{RESUME.meta}</div>
          </div>
          <span className="grow" />
          <button
            type="button"
            className="btn btn--dark btn--tall"
            onClick={() => openProject(RESUME.projectId)}
          >
            Open project
            <Icon name="arrow-right" size={12} />
          </button>
        </section>

        {/* Projects in motion ------------------------------------- */}
        <div className="section-head">
          <h2 className="section-head__title">Projects in motion</h2>
          <span className="section-head__hint">stage pipeline</span>
        </div>

        <div className="proj-cards">
          {projects.map((p) => {
            const next = nextTodo(p);
            return (
              <button
                type="button"
                key={p.id}
                className="card proj-card"
                onClick={() => openProject(p.id)}
              >
                <div className="proj-card__top">
                  <span className="proj-card__name">{p.name}</span>
                  <span className="proj-card__kind">{p.deskKind}</span>
                  <span className="grow" />
                  <span className="proj-card__meta">{p.deskMeta}</span>
                </div>

                <Pipeline phases={p.phases} cur={p.cur} />

                <div className="proj-card__foot">
                  <span className="proj-card__next-label">Next</span>
                  <span className="proj-card__next">{next ? next.text : 'Nothing open'}</span>
                  <span className="grow" />
                  <span className="proj-card__notes">{p.noteCount} notes</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Up next ------------------------------------------------ */}
        <div className="section-head">
          <h2 className="section-head__title">Up next</h2>
        </div>
        <div className="card upnext">
          {UP_NEXT.map((row) => {
            const project = byId(row.projectId);
            const todo = project?.todos.find((t) => t.id === row.todoId);
            const done = Boolean(todo?.done);
            return (
              <div className="upnext__row" key={row.todoId}>
                <Checkbox
                  checked={done}
                  label={`Mark "${row.label}" ${done ? 'not done' : 'done'}`}
                  onChange={() => toggleTodo(row.projectId, row.todoId)}
                />
                <span
                  className={`upnext__text${done ? ' upnext__text--done' : ''}`}
                  onClick={() => openProject(row.projectId)}
                >
                  {row.label}
                </span>
                <span className="grow" />
                <span className="pill">{row.project}</span>
                <span
                  className="upnext__due"
                  style={{
                    color: done
                      ? 'var(--prio-low)'
                      : row.urgent
                        ? 'var(--risk-fg)'
                        : 'var(--muted)',
                  }}
                >
                  {row.due}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      {/* Right rail ----------------------------------------------- */}
      <aside className="rail">
        <section className="rail__block">
          <div className="rail__head">
            <h2 className="rail__title">Recent notes</h2>
            <span className="grow" />
            <a href="#notes" style={{ fontSize: 11.5 }}>
              All
            </a>
          </div>
          {notes.map((n) => (
            <article className="note-card" key={n.id}>
              <div className="note-card__top">
                <span className="note-card__tag">{n.tag}</span>
                <span className="grow" />
                <span className="note-card__when">{n.when}</span>
              </div>
              <div className="note-card__title">{n.title}</div>
              <div className="note-card__excerpt">{n.excerpt}</div>
            </article>
          ))}
        </section>

        <section className="rail__block" style={{ gap: 11 }}>
          <h2 className="rail__title">Open questions</h2>
          {QUESTIONS.map((q) => (
            <div className="question" key={q.text}>
              <span className="question__mark">?</span>
              <div className="question__body">
                <div className="question__text">{q.text}</div>
                <div className="question__project">{q.project}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="rail__block" style={{ gap: 11 }}>
          <h2 className="rail__title">This week</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {WEEK.map((w) => {
              const tone = WEEK_TONE[w.tone];
              return (
                <div className="week-row" key={w.day}>
                  <span className="week-row__day">{w.day}</span>
                  <div className="week-row__bar" style={{ background: tone.bg, color: tone.fg }}>
                    {w.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </aside>
    </div>
  );
}
