import { AddDrawer } from './components/AddDrawer';
import { Desk } from './components/Desk';
import { ProjectScreen } from './components/ProjectScreen';
import { Sidebar } from './components/Sidebar';
import { PlannerProvider, usePlanner } from './state/store';
import './styles/app.css';

/**
 * planAir — a solo project planner.
 *
 * Two screens: Desk (the dashboard) and Project detail. The app fills the
 * browser window like any website: sidebar on the left, the screen beside it,
 * and each pane scrolls on its own.
 */
export default function App() {
  return (
    <PlannerProvider>
      <div className="app">
        <Sidebar />
        <div className="screen">
          <Screen />
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
