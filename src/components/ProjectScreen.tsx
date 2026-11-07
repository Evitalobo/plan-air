import { useState } from 'react';
import { DIRECTIONS } from '../data/directions';
import type { Direction, Project } from '../data/types';
import { openCountsByPhase } from '../state/selectors';
import { usePlanner } from '../state/store';
import { Dossier } from './Dossier';
import { ExtraCard } from './ExtraCard';
import { Glance } from './Glance';
import { Icon } from './Icon';
import { Pipeline } from './Pipeline';
import { Timeline } from './Timeline';
import { WorkCard } from './WorkCard';

export function ProjectScreen() {
  const { project, directionId, setDirection, openDesk, setPhase, toggleTodo, setDrawerOpen } = usePlanner();
  const steps = project.phases.map((ph) =>
    project.todos.filter((t) => t.phase === ph).map((t) => ({ id: t.id, label: t.text, done: Boolean(t.done) })),
  );
  const counts = openCountsByPhase(project);
  const direction = DIRECTIONS.find((d) => d.id === directionId) ?? DIRECTIONS[0];

  return (
    <div className="project">
      <header className="project__head">
        <div className="project__headrow">
          <div className="project__headtext">
            <nav className="crumbs" aria-label="Breadcrumb">
              <span className="crumbs__link" onClick={openDesk} role="link" tabIndex={0}>
                Desk
              </span>
              <span>/</span>
              <span>Projects</span>
            </nav>
            <div className="project__titleline">
              <ProjectTitle key={project.id} id={project.id} name={project.name} />
              <span className="project__badge">{project.badge}</span>
            </div>
            <div className="page-head__sub">{project.sub}</div>
          </div>
          <span className="grow" />
          <div className="page-head__actions">
            <DeleteProject key={`del-${project.id}`} id={project.id} name={project.name} />
            <button type="button" className="btn btn--ghost" onClick={() => setDrawerOpen(true)}>
              Add note
            </button>
            <button type="button" className="btn btn--dark">
              {project.cta}
            </button>
          </div>
        </div>

        <div className="project__pipeline">
          <Pipeline
            phases={project.phases}
            cur={project.cur}
            counts={counts}
            onSelect={(i) => setPhase(project.id, i)}
            steps={steps}
            onToggleStep={(id) => toggleTodo(project.id, id)}
          />
        </div>

        {project.directions && (
          <div className="tabs">
            {DIRECTIONS.map((d) => (
              <button
                type="button"
                key={d.id}
                className={`tab${d.id === directionId ? ' tab--on' : ''}`}
                aria-pressed={d.id === directionId}
                onClick={() => setDirection(d.id)}
              >
                <div className="tab__row">
                  <span className="tab__id">{d.id}</span>
                  <span className="tab__name">{d.name}</span>
                  <span className="tab__stage">{d.stage}</span>
                </div>
                <div className="tab__bar" />
              </button>
            ))}
            <span className="grow" />
            <button type="button" className="tabs__add">
              <Icon name="plus" size={11} />
              New pattern direction
            </button>
          </div>
        )}
      </header>

      <div className="project__body">
        {project.sections ? (
          <CustomSections project={project} direction={direction} />
        ) : (
          <>
            <div className="row">
              <Timeline project={project} />
              <Glance project={project} />
            </div>

            <WorkCard project={project} />

            <div className="row">
              {project.extras.map((x) => (
                <ExtraCard extra={x} key={x.title} />
              ))}
            </div>

            {project.directions && <Dossier direction={direction} />}
          </>
        )}
      </div>
    </div>
  );
}

/** A custom project's page: the sections it chose, in the order it chose them. */
function CustomSections({ project, direction }: { project: Project; direction: Direction }) {
  const keys = project.sections ?? [];
  return (
    <>
      {keys.map((k) => {
        if (k === 'timeline') return <div className="row" key={k}><Timeline project={project} /></div>;
        if (k === 'glance') return <div className="row" key={k}><Glance project={project} /></div>;
        if (k === 'links') return <WorkCard key={k} project={project} todos={false} />;
        if (k === 'todos') return <WorkCard key={k} project={project} links={false} />;
        if (k === 'directions') return <Dossier key={k} direction={direction} />;
        const extra = project.extras.find((x) => x.title === k.slice(6));
        return extra ? <div className="row" key={k}><ExtraCard extra={extra} /></div> : null;
      })}
    </>
  );
}

/** The project name; click it to rename. Enter saves, Escape cancels. */
function ProjectTitle({ id, name }: { id: string; name: string }) {
  const { renameProject } = usePlanner();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  if (!editing) {
    return (
      <h1 className="project__title">
        <button type="button" className="project__rename" title="Rename project" onClick={() => { setDraft(name); setEditing(true); }}>
          {name}
        </button>
      </h1>
    );
  }
  const save = () => { renameProject(id, draft); setEditing(false); };
  return (
    <input
      className="project__title-input"
      aria-label="Project name"
      value={draft}
      autoFocus
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') setEditing(false);
      }}
    />
  );
}

/** Delete with an in-place confirmation, no browser dialog. */
function DeleteProject({ id, name }: { id: string; name: string }) {
  const { deleteProject } = usePlanner();
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button type="button" className="btn btn--quiet" onClick={() => setAsking(true)}>
        Delete
      </button>
    );
  }
  return (
    <span className="confirm-inline" role="group" aria-label={`Delete ${name}?`}>
      Delete this project?
      <button type="button" className="btn btn--dark" onClick={() => deleteProject(id)}>Delete</button>
      <button type="button" className="btn btn--ghost" onClick={() => setAsking(false)}>Keep</button>
    </span>
  );
}
