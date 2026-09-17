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
 * Two screens: Desk (the dashboard) and Project detail. The app fills the
 * viewport; the OS window is the only frame. Layout holds from roughly 960px
 * up — see the breakpoints at the end of app.css for what gives way where.
 */
export default function App() {
  return (
    <PlannerProvider>
      <div className="app-root">
        <TopBar />
        <div className="app">
          <Sidebar />
          <div className="screen">
            <Screen />
          </div>
        </div>
        <AddDrawer />
      </div>
    </PlannerProvider>
  );
}

function Screen() {
  const { screen } = usePlanner();
  return screen === 'desk' ? <Desk /> : <ProjectScreen />;
}

function TopBar() {
  return (
    <div className="topbar">
      <span className="topbar__side" />
      <div className="topbar__search">
        <Icon name="search" size={11} />
        <span className="topbar__placeholder">{DESK.searchPlaceholder}</span>
        <span className="grow" />
        <span className="topbar__kbd">⌘K</span>
      </div>
      <span className="topbar__side topbar__side--end">
        <span className="topbar__date">{DESK.today}</span>
      </span>
    </div>
  );
}
