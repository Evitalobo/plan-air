import { DESK, OWNER } from '../data/desk';
import { KIND } from '../data/theme';
import { usePlanner } from '../state/store';
import { Icon, type IconName } from './Icon';

const NAV: { key: string; label: string; icon: IconName }[] = [
  { key: 'desk', label: 'Desk', icon: 'desk' },
  { key: 'projects', label: 'Projects', icon: 'projects' },
  { key: 'notes', label: 'Notes', icon: 'notes' },
  { key: 'decisions', label: 'Decisions', icon: 'decisions' },
];

export function Sidebar() {
  const { projects, notes, screen, projectId, openDesk, openProject, setDrawerOpen } = usePlanner();

  return (
    <nav className="sidebar" aria-label="Primary">
      <div className="sidebar__brand">
        <div className="sidebar__wordmark">Planner</div>
        <div className="sidebar__owner">{OWNER.name}</div>
      </div>

      <div className="sidebar__group">
        {NAV.map((item) => {
          const active =
            (item.key === 'desk' && screen === 'desk') ||
            (item.key === 'projects' && screen === 'project');
          return (
            <button
              key={item.key}
              type="button"
              className={`nav-row${active ? ' nav-row--on' : ''}`}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              onClick={() => {
                if (item.key === 'desk') openDesk();
                if (item.key === 'projects') openProject(projectId);
              }}
            >
              <span className="nav-row__icon">
                <Icon name={item.icon} />
              </span>
              <span className="nav-row__label">{item.label}</span>
              {item.key === 'notes' && (
                <>
                  <span className="grow" />
                  <span className="nav-row__count">
                    {DESK.noteTotal - 4 + notes.length}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="eyebrow sidebar__label">Projects</div>
      <div className="sidebar__group">
        {projects.map((p) => {
          const selected = screen === 'project' && p.id === projectId;
          return (
            <button
              key={p.id}
              type="button"
              className={`proj-row${selected ? ' proj-row--on' : ''}`}
              title={p.name}
              onClick={() => openProject(p.id)}
            >
              <span className="proj-row__dot" style={{ background: KIND[p.kind].dot }} />
              <span className="proj-row__name">{p.name}</span>
              <span className="grow" />
              <span className="proj-row__badge">{KIND[p.kind].badge}</span>
            </button>
          );
        })}
      </div>

      <span className="grow" />

      <button type="button" className="capture" onClick={() => setDrawerOpen(true)}>
        <span className="capture__title">
          <Icon name="plus" size={12} />
          <span className="capture__title-text">Quick capture</span>
        </span>
        <span className="capture__sub">Drop a thought now, file it later</span>
      </button>
    </nav>
  );
}
