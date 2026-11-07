import { DESK } from './data/desk';
import { AddDrawer } from './components/AddDrawer';
import { Desk } from './components/Desk';
import { Icon } from './components/Icon';
import { ProjectScreen } from './components/ProjectScreen';
import { Sidebar } from './components/Sidebar';
import { PlannerProvider, usePlanner } from './state/store';
import './styles/app.css';

/**
 * Plan Air — a coded prototype of the Planner design handoff.
 *
 * Two screens: Desk (the dashboard) and Project detail. Design width is a fixed
 * 1440 × 900 window; the chrome drawn below stands in for the OS window, and a
 * packaged desktop build would drop it.
 */
export default function App() {
  return (
    <PlannerProvider>
      <div className="shell">
        <div className="shell__caption">
          <span className="shell__mark" aria-label="planAir">
            plan<em>Air</em>
          </span>
          <span className="shell__note">Desktop prototype · solo workspace</span>
          <span className="grow" />
          <span className="shell__size">fits any window</span>
        </div>

        <div className="window">
          <WindowChrome />
          <div className="app">
            <Sidebar />
            <div className="screen">
              <Screen />
            </div>
          </div>
        </div>
      </div>
      <AddDrawer />
    </PlannerProvider>
  );
}

function Screen() {
  const { screen } = usePlanner();
  return screen === 'desk' ? <Desk /> : <ProjectScreen />;
}

function WindowChrome() {
  return (
    <div className="chrome">
      <div className="chrome__lights">
        <span />
        <span />
        <span />
      </div>
      <span className="grow" />
      <div className="chrome__search">
        <Icon name="search" size={11} />
        <span>{DESK.searchPlaceholder}</span>
        <span className="grow" />
        <span className="chrome__kbd">⌘K</span>
      </div>
      <span className="grow" />
      <span className="chrome__date">{DESK.today}</span>
    </div>
  );
}
