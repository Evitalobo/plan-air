import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { NOTES, type Note } from '../data/desk';
import { PROJECTS } from '../data/projects';
import type { LinkKind, Priority, Project, Screen, TodoFilter } from '../data/types';
import { load, localRepo, serverRepo, type Backend, type PlannerData, type Repo } from './api';

const SEED: PlannerData = { projects: PROJECTS, notes: NOTES };

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
export type SyncStatus = 'loading' | 'saved' | 'saving' | 'error';

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${seq++}`;

/**
 * Prototype state is deliberately small — the handoff specifies four values:
 * screen, selected project, selected direction, and the to-do filter.
 *
 * The one thing held beyond that is the project list itself, so that ticking a
 * checkbox is real: completion flows through to the phase pipeline counts, the
 * "Open to-dos" fact and the to-do header count, exactly as the handoff asks.
 * A real implementation swaps this for a persisted store; nothing else changes.
 */
interface PlannerState {
  projects: Project[];
  notes: Note[];
  screen: Screen;
  projectId: string;
  directionId: string;
  filter: TodoFilter;
}

interface PlannerApi extends PlannerState {
  project: Project;
  openDesk: () => void;
  openProject: (projectId: string) => void;
  setDirection: (directionId: string) => void;
  setFilter: (filter: TodoFilter) => void;
  toggleTodo: (projectId: string, todoId: string) => void;
  toggleSubtask: (projectId: string, todoId: string, subtaskId: string) => void;
  /** Click a phase: it becomes current (earlier ones done). Clicking the
   *  current phase again marks it complete and moves on. */
  setPhase: (projectId: string, phaseIndex: number) => void;
  /** Drag and drop: give a task a new priority and place it before `beforeId`
   *  (or at the end of that priority group when null). */
  moveTodo: (projectId: string, todoId: string, prio: Priority, beforeId: string | null) => void;
  addProject: (project: Project) => void;
  renameProject: (projectId: string, name: string) => void;
  deleteProject: (projectId: string) => void;
  addNote: (note: NewNote) => void;
  deleteNote: (noteId: string) => void;
  addTask: (projectId: string, task: NewTask) => void;
  addLink: (projectId: string, link: NewLink) => void;
  /** Quick-add drawer (notes, tasks, links). */
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  /** Where data is kept and whether the last change has been saved. */
  backend: Backend;
  sync: SyncStatus;
  resetData: () => void;
}

const PlannerContext = createContext<PlannerApi | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backend, setBackend] = useState<Backend>('local');
  const [sync, setSync] = useState<SyncStatus>('loading');
  const repo = useRef<Repo>(localRepo);
  // The last state the backend is known to hold; edits are diffed against it.
  const saved = useRef<PlannerData | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let live = true;
    load(SEED).then(({ backend: b, data }) => {
      if (!live) return;
      repo.current = b === 'server' ? serverRepo : localRepo;
      saved.current = data;
      setBackend(b);
      setProjects(data.projects);
      setNotes(data.notes);
      setSync('saved');
    });
    return () => {
      live = false;
    };
  }, []);

  // Persist: after any edit, send only what changed (new, edited, removed, reordered).
  useEffect(() => {
    const before = saved.current;
    if (!before) return;
    const after: PlannerData = { projects, notes };
    if (before.projects === projects && before.notes === notes) return;
    const t = setTimeout(() => {
      queue.current = queue.current.then(() => flush());
    }, 300);
    const flush = async () => {
      const before = saved.current!;
      if (before.projects === projects && before.notes === notes) return;
      const r = repo.current;
      const old = new Map(before.projects.map((p) => [p.id, p]));
      const now = new Set(projects.map((p) => p.id));
      const oldNotes = new Set(before.notes.map((n) => n.id));
      const nowNotes = new Set(notes.map((n) => n.id));
      setSync('saving');
      try {
        for (const p of projects) {
          const prev = old.get(p.id);
          if (!prev) await r.createProject(p, after);
          else if (prev !== p) await r.saveProject(p, after);
        }
        for (const p of before.projects) if (!now.has(p.id)) await r.deleteProject(p.id, after);
        const order = projects.map((p) => p.id).join();
        if (order !== before.projects.map((p) => p.id).filter((id) => now.has(id)).join() && projects.every((p) => old.has(p.id)))
          await r.reorderProjects(projects.map((p) => p.id), after);
        for (const n of notes) if (!oldNotes.has(n.id)) await r.createNote(n, after);
        for (const n of before.notes) if (!nowNotes.has(n.id)) await r.deleteNote(n.id, after);
        saved.current = after;
        setSync('saved');
      } catch (err) {
        console.error('[planAir] save failed', err);
        setSync('error');
      }
    };
    return () => clearTimeout(t);
  }, [projects, notes]);
  const [screen, setScreen] = useState<Screen>('desk');
  const [projectId, setProjectId] = useState<string>(PROJECTS[0].id);
  const [directionId, setDirectionId] = useState<string>('A');
  const [filter, setFilter] = useState<TodoFilter>('All');

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

  const setPhase = useCallback((pid: string, i: number) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== pid
          ? p
          : { ...p, cur: p.cur === i ? Math.min(i + 1, p.phases.length) : i },
      ),
    );
  }, []);

  const moveTodo = useCallback(
    (pid: string, todoId: string, prio: Priority, beforeId: string | null) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== pid) return p;
          const moving = p.todos.find((t) => t.id === todoId);
          if (!moving || todoId === beforeId) return p;
          const rest = p.todos.filter((t) => t.id !== todoId);
          const moved = { ...moving, prio };
          const at = beforeId ? rest.findIndex((t) => t.id === beforeId) : -1;
          const todos = at < 0 ? [...rest, moved] : [...rest.slice(0, at), moved, ...rest.slice(at)];
          return { ...p, todos };
        }),
      );
    },
    [],
  );

  const addProject = useCallback((p: Project) => setProjects((prev) => [...prev, p]), []);

  const renameProject = useCallback((pid: string, name: string) => {
    const v = name.trim();
    if (!v) return;
    setProjects((prev) => prev.map((p) => (p.id === pid ? { ...p, name: v } : p)));
  }, []);

  const deleteProject = useCallback((pid: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== pid));
    setScreen('desk');
  }, []);

  const addNote = useCallback((note: NewNote) => {
    setNotes((prev) => [{ id: nextId('note'), when: 'now', ...note }, ...prev]);
  }, []);

  const deleteNote = useCallback((id: string) => setNotes((prev) => prev.filter((n) => n.id !== id)), []);

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
          : { ...p, links: [...p.links, link], storyMissing: link.kind === 'STORY' ? false : p.storyMissing },
      ),
    );
  }, []);

  const resetData = useCallback(() => {
    setSync('saving');
    repo.current.reset(SEED).then(
      (data) => {
        saved.current = data;
        setProjects(data.projects);
        setNotes(data.notes);
        setProjectId(data.projects[0]?.id ?? '');
        setScreen('desk');
        setSync('saved');
      },
      () => setSync('error'),
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
      setPhase,
      moveTodo,
      addProject,
      renameProject,
      deleteProject,
      addNote,
      deleteNote,
      addTask,
      addLink,
      drawerOpen,
      setDrawerOpen,
      backend,
      sync,
      resetData,
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
      setPhase,
      moveTodo,
      addProject,
      renameProject,
      deleteProject,
      addNote,
      deleteNote,
      addTask,
      addLink,
      drawerOpen,
      backend,
      sync,
      resetData,
    ],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerApi {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used inside <PlannerProvider>');
  return ctx;
}
