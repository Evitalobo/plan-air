import { DIRECTIONS } from '../data/directions';
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
  const { project, directionId, setDirection, openDesk } = usePlanner();
  const counts = openCountsByPhase(project);
  const direction = DIRECTIONS.find((d) => d.id === directionId) ?? DIRECTIONS[0];

  return (
    <div className="project">
      <header className="project__head">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <nav className="crumbs" aria-label="Breadcrumb">
              <span className="crumbs__link" onClick={openDesk} role="link" tabIndex={0}>
                Desk
              </span>
              <span>/</span>
              <span>Projects</span>
            </nav>
            <div className="project__titleline">
              <h1 className="project__title">{project.name}</h1>
              <span className="project__badge">{project.badge}</span>
            </div>
            <div className="page-head__sub">{project.sub}</div>
          </div>
          <span className="grow" />
          <div className="page-head__actions">
            <button type="button" className="btn btn--ghost">
              Add note
            </button>
            <button type="button" className="btn btn--dark">
              {project.cta}
            </button>
          </div>
        </div>

        <div style={{ paddingBottom: 18 }}>
          <Pipeline phases={project.phases} cur={project.cur} counts={counts} />
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
      </div>
    </div>
  );
}
