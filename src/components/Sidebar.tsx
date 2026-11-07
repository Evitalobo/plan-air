import { useState } from 'react';
import { DESK, OWNER } from '../data/desk';
import { KIND } from '../data/theme';
import { usePlanner } from '../state/store';
import { Icon, type IconName } from './Icon';

const KIND_ICON: Record<string, IconName> = { pm: 'laptop', music: 'music', tufting: 'sewing', custom: 'star' };

const NAV: { key: string; label: string; icon: IconName }[] = [
  { key: 'desk', label: 'Desk', icon: 'desk' },
  { key: 'projects', label: 'Projects', icon: 'projects' },
  // Notes is hidden for now: notes live in the Desk's right rail and Quick capture.
  { key: 'decisions', label: 'Decisions', icon: 'decisions' },
];

export function Sidebar() {
  const { projects, screen, projectId, openDesk, openProject, setDrawerOpen, backend, sync, resetData } = usePlanner();
  const [confirmReset, setConfirmReset] = useState(false);
  const status =
    sync === 'loading' ? 'Loading…' : sync === 'saving' ? 'Saving…' : sync === 'error' ? 'Couldn’t save the last change' : backend === 'server' ? 'Saved to the server' : 'Saved in this browser';

  return (
    <nav className="sidebar" aria-label="Primary">
      <div className="sidebar__brand">
        <div className="sidebar__wordmark" aria-label="planAir">
          plan<em>Air</em>
        </div>
        <div className="sidebar__owner">
          {OWNER.name} · {OWNER.mode}
        </div>
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
              onClick={() => {
                if (item.key === 'desk') openDesk();
                if (item.key === 'projects') openProject(projectId);
              }}
            >
              <span className="nav-row__icon">
                <Icon name={item.icon} />
              </span>
              {item.label}
              {item.key === 'notes' && (
                <>
                  <span className="grow" />
                  <span className="nav-row__count">{DESK.noteTotal}</span>
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
              onClick={() => openProject(p.id)}
            >
              <span className="proj-row__icon" style={{ color: KIND[p.kind].dot }} aria-hidden="true">
                <Icon name={(p.icon as IconName) ?? KIND_ICON[p.kind]} size={14} />
              </span>
              <span className="proj-row__name">{p.name}</span>
              <span className="grow" />
              <span className="proj-row__badge">{p.typeLabel?.toLowerCase() ?? KIND[p.kind].badge}</span>
            </button>
          );
        })}
      </div>

      <span className="grow" />

      <button type="button" className="capture" onClick={() => setDrawerOpen(true)}>
        <span className="capture__title">
          <Icon name="plus" size={12} />
          Quick capture
        </span>
        <span className="capture__sub">Drop a thought now, file it later</span>
      </button>

      <div className={`sync sync--${sync}`} role="status" aria-live="polite">
        <span className="sync__dot" aria-hidden="true" />
        <span className="sync__text">{status}</span>
        {!confirmReset ? (
          <button type="button" className="sync__reset" onClick={() => setConfirmReset(true)}>Reset</button>
        ) : (
          <span className="sync__confirm">
            Reset all data?
            <button type="button" onClick={() => { resetData(); setConfirmReset(false); }}>Yes</button>
            <button type="button" onClick={() => setConfirmReset(false)}>No</button>
          </span>
        )}
      </div>
    </nav>
  );
}
