import type { Fact, Project, Todo, TodoFilter } from '../data/types';

const PRIO_RANK = { High: 0, Medium: 1, Low: 2 } as const;

/** Apply the to-do filter chips. "All" keeps authored order. */
export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  if (filter === 'Open') return todos.filter((t) => !t.done);
  if (filter === 'High first') {
    return [...todos].sort(
      (a, b) =>
        Number(Boolean(a.done)) - Number(Boolean(b.done)) || PRIO_RANK[a.prio] - PRIO_RANK[b.prio],
    );
  }
  return todos;
}

/** Open to-dos per phase, in the project's own phase order. */
export function openCountsByPhase(project: Project): number[] {
  const open = project.todos.filter((t) => !t.done);
  return project.phases.map((phase) => open.filter((t) => t.phase === phase).length);
}

export function openCount(project: Project): number {
  return project.todos.filter((t) => !t.done).length;
}

export function subtaskCount(project: Project): number {
  return project.todos.reduce((n, t) => n + (t.subs?.length ?? 0), 0);
}

/** The to-do card's header meta line, e.g. "8 tasks · 5 open · 9 subtasks". */
export function todoMeta(project: Project): string {
  const parts = [`${project.todos.length} tasks`, `${openCount(project)} open`];
  const subs = subtaskCount(project);
  if (subs) parts.push(`${subs} subtasks`);
  return parts.join(' · ');
}

/**
 * "At a glance" rows. Phase and open-to-do counts are derived so that ticking a
 * checkbox updates them; everything else is authored.
 */
export function facts(project: Project): Fact[] {
  const phase = project.phases[project.cur];
  return [
    { k: 'Phase', v: `${phase} · ${project.cur + 1} of ${project.phases.length}` },
    { k: 'Open to-dos', v: `${openCount(project)} of ${project.todos.length}` },
    ...project.facts,
  ];
}

/**
 * The to-do surfaced on the Desk card: the authored one while it is still open,
 * otherwise whatever is next in authored order.
 */
export function nextTodo(project: Project): Todo | undefined {
  const featured = project.todos.find((t) => t.id === project.featuredTodoId && !t.done);
  return featured ?? project.todos.find((t) => !t.done);
}

export function findTodo(project: Project, todoId: string): Todo | undefined {
  return project.todos.find((t) => t.id === todoId);
}
