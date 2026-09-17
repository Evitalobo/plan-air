import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { NOTES, type Note } from '../data/desk';
import { PROJECTS } from '../data/projects';
import type { LinkKind, Priority, Project, Screen, TodoFilter } from '../data/types';

/**
 * Prototype state is deliberately small — the handoff specifies four values:
 * screen, selected project, selected direction, and the to-do filter.
 *
 * Held beyond that: the project list and the note list, so that ticking a
 * checkbox and adding something from the drawer are both real. Completion
 * flows through to the phase pipeline counts, the "Open to-dos" fact and the
 * to-do header count, exactly as the handoff asks. A real implementation swaps
 * this for a persisted store; nothing else changes.
 */
interface PlannerState {
  projects: Project[];
  notes: Note[];
  screen: Screen;
  projectId: string;
  directionId: string;
  filter: TodoFilter;
}

export interface NewNote {
  tag: string;
  title: string;
  excerpt: string;
}

export interface NewTask {
  text: string;
  hint?: string;
  phase: string;
  prio: Priority;
  window?: string;
  due?: string;
}

export interface NewLink {
  kind: LinkKind;
  label: string;
}

interface PlannerApi extends PlannerState {
  project: Project;
  openDesk: () => void;
  openProject: (projectId: string) => void;
  setDirection: (directionId: string) => void;
  setFilter: (filter: TodoFilter) => void;
  toggleTodo: (projectId: string, todoId: string) => void;
  toggleSubtask: (projectId: string, todoId: string, subtaskId: string) => void;
  addNote: (note: NewNote) => void;
  addTask: (projectId: string, task: NewTask) => void;
  addLink: (projectId: string, link: NewLink) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const PlannerContext = createContext<PlannerApi | null>(null);

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${seq++}`;

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [screen, setScreen] = useState<Screen>('desk');
  const [projectId, setProjectId] = useState<string>(PROJECTS[0].id);
  const [directionId, setDirectionId] = useState<string>('A');
  const [filter, setFilter] = useState<TodoFilter>('All');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDesk = useCallback(() => setScreen('desk'), []);

  /** Selecting a project always resets the to-do filter to "All". */
  const openProject = useCallback((id: string) => {
    setProjectId(id);
    setScreen('project');
    setFilter('All');
  }, []);

  const toggleTodo = useCallback((pid: string, todoId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== pid
          ? p
          : {
              ...p,
              todos: p.todos.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t)),
            },
      ),
    );
  }, []);

  const toggleSubtask = useCallback((pid: string, todoId: string, subtaskId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== pid
          ? p
          : {
              ...p,
              todos: p.todos.map((t) =>
                t.id !== todoId || !t.subs
                  ? t
                  : {
                      ...t,
                      subs: t.subs.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)),
                    },
              ),
            },
      ),
    );
  }, []);

  const addNote = useCallback((note: NewNote) => {
    setNotes((prev) => [{ id: nextId('note'), when: 'now', ...note }, ...prev]);
  }, []);

  const addTask = useCallback((pid: string, task: NewTask) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== pid
          ? p
          : {
              ...p,
              todos: [
                ...p.todos,
                {
                  id: nextId(pid),
                  text: task.text,
                  hint: task.hint || undefined,
                  phase: task.phase,
                  prio: task.prio,
                  window: task.window || '—',
                  due: task.due || '—',
                },
              ],
            },
      ),
    );
  }, []);

  const addLink = useCallback((pid: string, link: NewLink) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== pid
          ? p
          : {
              ...p,
              links: [...p.links, link],
              // A story link satisfies the dashed "Add story link" affordance.
              storyMissing: link.kind === 'STORY' ? false : p.storyMissing,
            },
      ),
    );
  }, []);

  const project = useMemo(
    () => projects.find((p) => p.id === projectId) ?? projects[0],
    [projects, projectId],
  );

  const value = useMemo<PlannerApi>(
    () => ({
      projects,
      notes,
      screen,
      projectId,
      directionId,
      filter,
      project,
      openDesk,
      openProject,
      setDirection: setDirectionId,
      setFilter,
      toggleTodo,
      toggleSubtask,
      addNote,
      addTask,
      addLink,
      drawerOpen,
      setDrawerOpen,
    }),
    [
      projects,
      notes,
      screen,
      projectId,
      directionId,
      filter,
      project,
      openDesk,
      openProject,
      toggleTodo,
      toggleSubtask,
      addNote,
      addTask,
      addLink,
      drawerOpen,
    ],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerApi {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used inside <PlannerProvider>');
  return ctx;
}
