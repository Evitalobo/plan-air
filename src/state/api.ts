import type { Note } from '../data/desk';
import type { Project } from '../data/types';

/**
 * Persistence for planAir.
 *
 * Two backends behind one interface:
 * - server: the Node + SQLite API in /server (`npm run dev` starts both). Every
 *   project and note is a row; the app sends the changed record after each edit.
 * - local:  when no server answers (e.g. the static prototype hosted as an
 *   artifact), the same data is kept in this browser's localStorage.
 *
 * The store never talks to fetch or localStorage directly, only to this file.
 */

export interface PlannerData {
  projects: Project[];
  notes: Note[];
}

export type Backend = 'server' | 'local';

const API = ((import.meta.env.VITE_API_URL as string) || '/api').replace(/\/$/, '');
const LOCAL_KEY = 'planair:data:v1';

async function request<T>(path: string, init?: RequestInit, timeoutMs = 4000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} → ${res.status}`);
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  } finally {
    clearTimeout(timer);
  }
}

function readLocal(): PlannerData | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as PlannerData) : null;
  } catch {
    return null;
  }
}

function writeLocal(data: PlannerData) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked: the session still works, it just won't persist */
  }
}

/** Load everything. Prefers the server; falls back to this browser, then to the seed. */
export async function load(seed: PlannerData): Promise<{ backend: Backend; data: PlannerData }> {
  try {
    const data = await request<PlannerData>('/state', undefined, 1500);
    if (Array.isArray(data?.projects)) return { backend: 'server', data };
  } catch {
    /* no server: fall through to local */
  }
  return { backend: 'local', data: readLocal() ?? seed };
}

/** The operations the store needs. Each backend implements all of them. */
export interface Repo {
  backend: Backend;
  createProject(p: Project, all: PlannerData): Promise<void>;
  saveProject(p: Project, all: PlannerData): Promise<void>;
  deleteProject(id: string, all: PlannerData): Promise<void>;
  reorderProjects(ids: string[], all: PlannerData): Promise<void>;
  createNote(n: Note, all: PlannerData): Promise<void>;
  deleteNote(id: string, all: PlannerData): Promise<void>;
  reset(seed: PlannerData): Promise<PlannerData>;
}

export const serverRepo: Repo = {
  backend: 'server',
  createProject: (p) => request('/projects', { method: 'POST', body: JSON.stringify(p) }),
  saveProject: (p) => request(`/projects/${encodeURIComponent(p.id)}`, { method: 'PUT', body: JSON.stringify(p) }),
  deleteProject: (id) => request(`/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  reorderProjects: (ids) => request('/projects/order', { method: 'PUT', body: JSON.stringify({ ids }) }),
  createNote: (n) => request('/notes', { method: 'POST', body: JSON.stringify(n) }),
  deleteNote: (id) => request(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  reset: () => request<PlannerData>('/reset', { method: 'POST' }),
};

/** Local backend: every operation just writes the whole (small) data set. */
export const localRepo: Repo = {
  backend: 'local',
  createProject: async (_p, all) => writeLocal(all),
  saveProject: async (_p, all) => writeLocal(all),
  deleteProject: async (_id, all) => writeLocal(all),
  reorderProjects: async (_ids, all) => writeLocal(all),
  createNote: async (_n, all) => writeLocal(all),
  deleteNote: async (_id, all) => writeLocal(all),
  reset: async (seed) => {
    try {
      localStorage.removeItem(LOCAL_KEY);
    } catch {
      /* ignore */
    }
    return seed;
  },
};
