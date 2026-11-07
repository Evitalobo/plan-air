// Writes server/seed.json from the app's own sample data, so the API and the
// offline fallback always start from the same projects and notes.
// Run with: npm run seed
import { writeFileSync } from 'node:fs';
import { NOTES } from '../src/data/desk';
import { PROJECTS } from '../src/data/projects';

writeFileSync(new URL('../server/seed.json', import.meta.url), JSON.stringify({ projects: PROJECTS, notes: NOTES }, null, 2) + '\n');
console.log(`server/seed.json: ${PROJECTS.length} projects, ${NOTES.length} notes`);
