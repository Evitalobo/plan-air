import { DESK, QUESTIONS, WEEK, WEEK_TONE } from '../data/desk';
import { usePlanner } from '../state/store';
import { useEffect, useRef, useState } from 'react';
import { NewProjectDrawer, PLACEMENT } from './NewProjectDrawer';
import { Icon } from './Icon';
import { ProjectCard } from './ProjectCard';

export function Desk() {
  const { projects, notes, lastAddedId } = usePlanner();
  const newCard = useRef<HTMLDivElement>(null);
  useEffect(() => {
    newCard.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [lastAddedId]);
  const [drawer, setDrawer] = useState(false);
  // The notes column starts minimized; the choice is remembered in this browser.
  const [railOpen, setRailOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('planair:rail') === 'open';
    } catch {
      return false;
    }
  });
  const toggleRail = (open: boolean) => {
    setRailOpen(open);
    try {
      localStorage.setItem('planair:rail', open ? 'open' : 'closed');
    } catch {
      /* not stored: fine for this visit */
    }
  };

  // Full-page placement: the flow replaces the Desk until it is done or cancelled.
  if (drawer && PLACEMENT === 'page') {
    return (
      <div className="desk">
        <NewProjectDrawer onClose={() => setDrawer(false)} />
      </div>
    );
  }

  return (
    <div className="desk">
      {drawer && PLACEMENT !== 'page' && <NewProjectDrawer onClose={() => setDrawer(false)} />}
      <main className="desk__main">
        <header className="page-head">
          <div className="page-head__text">
            <h1 className="page-head__title">{DESK.title}</h1>
          </div>
          <span className="grow" />
          <div className="page-head__actions">
            <button type="button" className="btn btn--ghost">
              New note
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setDrawer(true)} aria-haspopup="dialog">
              New project
            </button>
          </div>
        </header>

        {/* Projects in motion ------------------------------------- */}
        <div className="section-head">
          <h2 className="section-head__title">Projects in motion</h2>
        </div>

        <div className="proj-cards">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              isNew={p.id === lastAddedId}
              cardRef={p.id === lastAddedId ? newCard : undefined}
            />
          ))}
        </div>

      </main>

      {/* Right rail ----------------------------------------------- */}
      {railOpen ? (
        <aside className="rail" id="desk-rail" aria-label="Notes, questions and this week">
          <button type="button" className="rail__min" onClick={() => toggleRail(false)} aria-expanded="true" aria-controls="desk-rail">
            <Icon name="arrow-right" size={14} />
            Minimize
          </button>
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
      ) : (
        <aside className="rail rail--min" aria-label="Notes, questions and this week (minimized)">
          <button type="button" className="rail__expand" onClick={() => toggleRail(true)} aria-expanded="false" title="Show notes, questions and this week">
            <Icon name="notes" size={16} />
            <span className="rail__expand-label">Notes</span>
            <span className="rail__expand-count">{notes.length}</span>
          </button>
        </aside>
      )}
    </div>
  );
}
