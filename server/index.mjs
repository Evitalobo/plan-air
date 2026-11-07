// planAir API — a small Node server with SQLite storage.
//
//   npm run server        start the API on http://localhost:8787
//   npm run dev           start the API and the Vite app together
//   npm start             build the app and serve it plus the API from one port
//
// Node 22.5+ (uses the built-in node:sqlite, so there is nothing to install).
// Data lives in server/data/planair.db; delete it or POST /api/reset to reseed.

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, statSync, createReadStream } from 'node:fs';
import { dirname, join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8787);
const DB_PATH = process.env.PLANAIR_DB ?? join(here, 'data', 'planair.db');
const DIST = join(here, '..', 'dist');
const SEED = JSON.parse(readFileSync(join(here, 'seed.json'), 'utf8'));

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const q = {
  listProjects: db.prepare('SELECT data FROM projects ORDER BY position'),
  getProject: db.prepare('SELECT data FROM projects WHERE id = ?'),
  maxPos: db.prepare('SELECT COALESCE(MAX(position), -1) AS m FROM projects'),
  insertProject: db.prepare('INSERT INTO projects (id, position, data) VALUES (?, ?, ?)'),
  updateProject: db.prepare("UPDATE projects SET data = ?, updated_at = datetime('now') WHERE id = ?"),
  setPos: db.prepare('UPDATE projects SET position = ? WHERE id = ?'),
  deleteProject: db.prepare('DELETE FROM projects WHERE id = ?'),
  listNotes: db.prepare('SELECT data FROM notes ORDER BY position DESC'),
  maxNotePos: db.prepare('SELECT COALESCE(MAX(position), -1) AS m FROM notes'),
  insertNote: db.prepare('INSERT INTO notes (id, position, data) VALUES (?, ?, ?)'),
  deleteNote: db.prepare('DELETE FROM notes WHERE id = ?'),
};

function tx(fn) {
  db.exec('BEGIN');
  try {
    const out = fn();
    db.exec('COMMIT');
    return out;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

function seed() {
  tx(() => {
    db.exec('DELETE FROM projects; DELETE FROM notes;');
    SEED.projects.forEach((p, i) => q.insertProject.run(p.id, i, JSON.stringify(p)));
    // Notes are listed newest first, so the seed's first note gets the highest position.
    [...SEED.notes].reverse().forEach((n, i) => q.insertNote.run(n.id, i, JSON.stringify(n)));
  });
}
if (q.listProjects.all().length === 0) seed();

const projects = () => q.listProjects.all().map((r) => JSON.parse(r.data));
const notes = () => q.listNotes.all().map((r) => JSON.parse(r.data));

// ── validation: keep obviously broken records out of the database ──
function badProject(p) {
  if (!p || typeof p !== 'object') return 'body must be a project object';
  if (typeof p.id !== 'string' || !p.id) return 'id is required';
  if (typeof p.name !== 'string' || !p.name.trim()) return 'name is required';
  if (!Array.isArray(p.phases) || p.phases.length === 0) return 'phases must be a non-empty array';
  if (!Number.isInteger(p.cur) || p.cur < 0 || p.cur > p.phases.length) return 'cur must index phases';
  if (!Array.isArray(p.todos)) return 'todos must be an array';
  return null;
}
function badNote(n) {
  if (!n || typeof n !== 'object') return 'body must be a note object';
  if (typeof n.id !== 'string' || !n.id) return 'id is required';
  if (typeof n.title !== 'string' || !n.title.trim()) return 'title is required';
  return null;
}

// ── http helpers ──
const send = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN ?? '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
};
const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 2_000_000) reject(Object.assign(new Error('body too large'), { status: 413 }));
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error('invalid JSON'), { status: 400 }));
      }
    });
  });

// ── routes ──
async function api(req, res, path) {
  const m = req.method;
  const seg = path.split('/').filter(Boolean).map(decodeURIComponent); // ['projects', id]

  if (m === 'GET' && path === '/health') return send(res, 200, { ok: true });
  if (m === 'GET' && path === '/state') return send(res, 200, { projects: projects(), notes: notes() });
  if (m === 'POST' && path === '/reset') {
    seed();
    return send(res, 200, { projects: projects(), notes: notes() });
  }

  if (seg[0] === 'projects') {
    if (seg.length === 1 && m === 'GET') return send(res, 200, projects());
    if (seg.length === 1 && m === 'POST') {
      const p = await readBody(req);
      const err = badProject(p);
      if (err) return send(res, 400, { error: err });
      if (q.getProject.get(p.id)) return send(res, 409, { error: `project ${p.id} already exists` });
      q.insertProject.run(p.id, q.maxPos.get().m + 1, JSON.stringify(p));
      return send(res, 201, p);
    }
    if (seg[1] === 'order' && m === 'PUT') {
      const { ids } = await readBody(req);
      if (!Array.isArray(ids)) return send(res, 400, { error: 'ids must be an array' });
      tx(() => ids.forEach((id, i) => q.setPos.run(i, id)));
      return send(res, 200, projects());
    }
    if (seg.length === 2) {
      const row = q.getProject.get(seg[1]);
      if (m === 'GET') return row ? send(res, 200, JSON.parse(row.data)) : send(res, 404, { error: 'not found' });
      if (m === 'PUT') {
        const p = await readBody(req);
        if (p.id !== seg[1]) return send(res, 400, { error: 'id in body must match the URL' });
        const err = badProject(p);
        if (err) return send(res, 400, { error: err });
        if (!row) q.insertProject.run(p.id, q.maxPos.get().m + 1, JSON.stringify(p));
        else q.updateProject.run(JSON.stringify(p), p.id);
        return send(res, 200, p);
      }
      if (m === 'PATCH') {
        if (!row) return send(res, 404, { error: 'not found' });
        const patch = await readBody(req);
        const next = { ...JSON.parse(row.data), ...patch, id: seg[1] };
        const err = badProject(next);
        if (err) return send(res, 400, { error: err });
        q.updateProject.run(JSON.stringify(next), seg[1]);
        return send(res, 200, next);
      }
      if (m === 'DELETE') {
        q.deleteProject.run(seg[1]);
        return send(res, 204);
      }
    }
  }

  if (seg[0] === 'notes') {
    if (seg.length === 1 && m === 'GET') return send(res, 200, notes());
    if (seg.length === 1 && m === 'POST') {
      const n = await readBody(req);
      const err = badNote(n);
      if (err) return send(res, 400, { error: err });
      q.insertNote.run(n.id, q.maxNotePos.get().m + 1, JSON.stringify(n));
      return send(res, 201, n);
    }
    if (seg.length === 2 && m === 'DELETE') {
      q.deleteNote.run(seg[1]);
      return send(res, 204);
    }
  }

  return send(res, 404, { error: `no route for ${m} /api${path}` });
}

// ── static app (after `npm run build`) ──
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' };
function serveStatic(res, urlPath) {
  if (!existsSync(DIST)) return send(res, 404, { error: 'app not built: run npm run build, or use npm run dev' });
  let file = normalize(join(DIST, urlPath));
  if (!file.startsWith(DIST)) return send(res, 403, { error: 'forbidden' });
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (req.method === 'OPTIONS') return send(res, 204);
  try {
    if (url.pathname.startsWith('/api/') || url.pathname === '/api') return await api(req, res, url.pathname.slice(4) || '/');
    return serveStatic(res, url.pathname);
  } catch (e) {
    console.error(e);
    return send(res, e.status ?? 500, { error: e.message ?? 'server error' });
  }
}).listen(PORT, () => console.log(`planAir API on http://localhost:${PORT}/api  (db: ${DB_PATH})`));
