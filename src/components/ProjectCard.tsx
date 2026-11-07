import { useState, type Ref } from 'react';
import { LINK_KIND_FG, PRIO, phaseStyle } from '../data/theme';
import type { Project } from '../data/types';
import { nextTodo } from '../state/selectors';
import { usePlanner } from '../state/store';
import { Checkbox } from './Checkbox';
import { Icon } from './Icon';
import { Pipeline } from './Pipeline';
import { Timeline } from './Timeline';

const RANK = { High: 0, Medium: 1, Low: 2 } as const;

/**
 * One project on the Desk. Collapsed: name, phase pipeline, next step.
 * Expanded: the open to-dos (tick them off here), the timeline, and the
 * project's references, without leaving the Desk.
 */
export function ProjectCard({ project: p, isNew, cardRef }: { project: Project; isNew: boolean; cardRef?: Ref<HTMLDivElement> }) {
  const { openProject, setPhase, toggleTodo } = usePlanner();
  const [open, setOpen] = useState(false);
  const next = nextTodo(p);
  const openTodos = p.todos.filter((t) => !t.done).sort((a, b) => RANK[a.prio] - RANK[b.prio]);
  const doneCount = p.todos.length - openTodos.length;
  const panelId = `card-${p.id}-details`;

  return (
    <div className={`card proj-card${isNew ? ' proj-card--new' : ''}${open ? ' proj-card--open' : ''}`} ref={cardRef}>
      <div className="proj-card__top">
        <button type="button" className="proj-card__name proj-card__open" onClick={() => openProject(p.id)} title="Open project">
          {p.name}
        </button>
        {isNew && <span className="proj-card__new">New</span>}
        <span className="proj-card__kind">{p.deskKind}</span>
        <span className="grow" />
        {p.deskMeta && <span className="proj-card__meta">{p.deskMeta}</span>}
        <button
          type="button"
          className="proj-card__toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Less' : 'Details'}
          <span className={`proj-card__chev${open ? ' proj-card__chev--up' : ''}`} aria-hidden="true">
            <Icon name="arrow-right" size={13} />
          </span>
        </button>
      </div>

      <Pipeline phases={p.phases} cur={p.cur} onSelect={(i) => setPhase(p.id, i)} />

      <div className="proj-card__foot">
        <span className="proj-card__next-label">Next</span>
        <span className="proj-card__next">{next ? next.text : 'Nothing open'}</span>
        <span className="grow" />
        <span className="proj-card__notes">{p.noteCount} notes</span>
      </div>

      {open && (
        <div className="proj-card__details" id={panelId}>
          <section className="pc-todos" aria-label={`${p.name} to-dos`}>
            <div className="pc-head">
              <h3 className="pc-title">To do</h3>
              <span className="pc-meta">{openTodos.length} open · {doneCount} done</span>
            </div>
            {openTodos.length === 0 && <p className="pc-empty">Nothing open. Add tasks from the project page or Quick capture.</p>}
            <ul className="pc-list">
              {openTodos.map((t) => {
                const ph = phaseStyle(t.phase);
                const pr = PRIO[t.prio];
                const subsDone = t.subs?.filter((s) => s.done).length ?? 0;
                return (
                  <li className="pc-task" key={t.id}>
                    <Checkbox checked={false} label={`Mark "${t.text}" done`} onChange={() => toggleTodo(p.id, t.id)} />
                    <span className="pc-task__text">
                      <span className="pc-task__title">{t.text}</span>
                      {t.subs?.length ? <span className="pc-task__sub">{subsDone}/{t.subs.length} subtasks</span> : null}
                    </span>
                    <span className="chip" style={{ background: ph.bg, color: ph.fg }}>{t.phase}</span>
                    <span className="pc-task__prio" style={{ color: pr.fg }}>
                      <span className="todo__prio-dot" style={{ background: pr.dot }} />
                      {t.prio}
                    </span>
                    <span className="pc-task__due">{t.due !== '—' ? t.due : ''}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="pc-side">
            <div className="pc-timeline">
              <Timeline project={p} />
            </div>
            <section className="pc-refs" aria-label={`${p.name} references`}>
              <div className="pc-head">
                <h3 className="pc-title">References</h3>
                <span className="pc-meta">{p.links.length || 'none yet'}</span>
              </div>
              {p.links.length === 0 ? (
                <p className="pc-empty">No links yet. Add one with Quick capture.</p>
              ) : (
                <div className="pc-links">
                  {p.links.map((l) => (
                    <a className="link-pill" href={l.href ?? '#link'} key={`${l.kind}-${l.label}`}>
                      <span className="link-pill__kind" style={{ color: LINK_KIND_FG[l.kind] }}>{l.kind}</span>
                      <span className="link-pill__label">{l.label}</span>
                      <span className="link-pill__out"><Icon name="external" size={10} /></span>
                    </a>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="pc-foot">
            <button type="button" className="btn btn--ghost" onClick={() => openProject(p.id)}>
              Open project
              <Icon name="arrow-right" size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
