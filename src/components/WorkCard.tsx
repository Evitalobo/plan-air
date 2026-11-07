import { LINK_KIND_FG, PRIO, phaseStyle } from '../data/theme';
import { useRef, useState, type DragEvent } from 'react';
import type { Priority, Project, Todo, TodoFilter } from '../data/types';
import { filterTodos, todoMeta } from '../state/selectors';
import { usePlanner } from '../state/store';
import { Checkbox } from './Checkbox';
import { Icon } from './Icon';

const FILTERS: TodoFilter[] = ['All', 'Open'];
const PRIOS: Priority[] = ['High', 'Medium', 'Low'];
const NEXT_PRIO: Record<Priority, Priority> = { High: 'Medium', Medium: 'Low', Low: 'High' };

/** Where a dragged task would land: a priority group, before a task or at its end. */
interface DropTarget { prio: Priority; beforeId: string | null }

/** Links row, to-do header, column headers, task rows and subtasks — one card. */
export function WorkCard({ project, links = true, todos = true }: { project: Project; links?: boolean; todos?: boolean }) {
  const { filter, setFilter, moveTodo } = usePlanner();
  const list = filterTodos(project.todos, filter);
  const [dragId, setDragIdState] = useState<string | null>(null);
  const [drop, setDropState] = useState<DropTarget | null>(null);
  // Refs mirror the state so a drop that lands before React re-renders still
  // knows what is being dragged and where it would go.
  const dragRef = useRef<string | null>(null);
  const dropRef = useRef<DropTarget | null>(null);
  const setDragId = (id: string | null) => { dragRef.current = id; setDragIdState(id); };
  const setDrop = (d: DropTarget | null) => { dropRef.current = d; setDropState(d); };

  const endDrag = () => {
    setDragId(null);
    setDrop(null);
  };
  const commit = (e: DragEvent, fallbackPrio: Priority) => {
    e.preventDefault();
    e.stopPropagation();
    const id = dragRef.current ?? e.dataTransfer.getData('text/plain');
    const target = dropRef.current ?? { prio: fallbackPrio, beforeId: null };
    if (id) moveTodo(project.id, id, target.prio, target.beforeId);
    endDrag();
  };
  /** Over a row: drop above it, or below it (before the next row in the group). */
  const overRow = (e: DragEvent<HTMLDivElement>, prio: Priority, group: Todo[], i: number) => {
    if (!dragRef.current) return;
    e.preventDefault();
    e.stopPropagation(); // keep the group from resetting the position to "end"
    const r = e.currentTarget.getBoundingClientRect();
    const below = e.clientY > r.top + r.height / 2;
    const beforeId = below ? (group[i + 1]?.id ?? null) : group[i].id;
    const d = dropRef.current;
    if (d?.prio !== prio || d?.beforeId !== beforeId) setDrop({ prio, beforeId });
  };
  const overGroup = (e: DragEvent, prio: Priority) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const d = dropRef.current;
    if (d?.prio !== prio || d?.beforeId !== null) setDrop({ prio, beforeId: null });
  };

  return (
    <section className="card work">
      {links && (
      <div className="links">
        <div className="eyebrow links__label">Links</div>
        {project.links.map((l) => (
          <a className="link-pill" href={l.href ?? '#link'} key={`${l.kind}-${l.label}`}>
            <span className="link-pill__kind" style={{ color: LINK_KIND_FG[l.kind] }}>
              {l.kind}
            </span>
            <span className="link-pill__label">{l.label}</span>
            <span className="link-pill__out">
              <Icon name="external" size={10} />
            </span>
          </a>
        ))}
        {project.storyMissing && (
          <button type="button" className="link-add">
            <Icon name="plus" size={10} />
            Add story link
          </button>
        )}
        <span className="grow" />
        <span className="links__meta">{project.linkMeta}</span>
      </div>
      )}
      {todos && (
      <>

      <div className="todo-head">
        <h2 className="card__title">To do</h2>
        <span className="todo-head__meta">{todoMeta(project)}</span>
        <span className="grow" />
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f}
            className={`filter${filter === f ? ' filter--on' : ''}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {filter === f && <span className="filter__check" aria-hidden="true">✓</span>}
            {f}
          </button>
        ))}
      </div>

      <div className="todo-grid todo-cols">
        <span />
        <span>Task</span>
        <span>Phase</span>
        <span>Priority</span>
        <span>Window</span>
        <span>Due</span>
      </div>

      {PRIOS.map((prio) => {
        const group = list.filter((t) => t.prio === prio);
        const tone = PRIO[prio];
        const endHere = drop?.prio === prio && drop.beforeId === null;
        return (
          <div
            key={prio}
            className={`prio-group${dragId ? ' prio-group--dragging' : ''}`}
            onDragOver={(e) => overGroup(e, prio)}
            onDrop={(e) => commit(e, prio)}
          >
            <div className="prio-group__head">
              <span className="todo__prio-dot" style={{ background: tone.dot }} />
              <span style={{ color: tone.fg }}>{prio}</span>
              <span className="prio-group__count">{group.length}</span>
              {dragId && <span className="prio-group__hint">Drop here to make it {prio}</span>}
            </div>
            {group.map((t, i) => (
              <TodoRow
                key={t.id}
                projectId={project.id}
                todo={t}
                dragging={dragId === t.id}
                dropAbove={drop?.prio === prio && drop.beforeId === t.id}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', t.id);
                  setDragId(t.id);
                }}
                onDragEnd={endDrag}
                onDragOver={(e) => overRow(e, prio, group, i)}
              />
            ))}
            {group.length === 0 && <div className="prio-group__empty">No {prio.toLowerCase()} tasks</div>}
            {endHere && <div className="drop-line" />}
          </div>
        );
      })}

      <button type="button" className="add-row work__add">
        <Icon name="plus" size={11} />
        Add a task
      </button>
      </>
      )}
    </section>
  );
}

interface RowProps {
  projectId: string;
  todo: Todo;
  dragging: boolean;
  dropAbove: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
}

function TodoRow({ projectId, todo, dragging, dropAbove, onDragStart, onDragEnd, onDragOver }: RowProps) {
  const { toggleTodo, toggleSubtask, moveTodo } = usePlanner();
  const phase = phaseStyle(todo.phase);
  const prio = PRIO[todo.prio];
  const dueColor = todo.done
    ? 'var(--prio-low)'
    : todo.prio === 'High'
      ? 'var(--risk-fg)'
      : 'var(--dim)';

  return (
    <div
      className={`todo${dragging ? ' todo--dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      {dropAbove && <div className="drop-line" />}
      <div className="todo-grid todo__row">
        <span className="todo__lead">
          <span className="todo__grip" title="Drag to another priority" aria-hidden="true">
            <Icon name="grip" size={12} />
          </span>
          <Checkbox
          checked={Boolean(todo.done)}
          label={`Mark "${todo.text}" ${todo.done ? 'not done' : 'done'}`}
          onChange={() => toggleTodo(projectId, todo.id)}
          />
        </span>
        <div className="todo__text">
          <span
            className={`todo__title${todo.done ? ' todo__title--done' : ''}`}
            onClick={() => toggleTodo(projectId, todo.id)}
          >
            {todo.text}
          </span>
          {todo.hint && <span className="todo__hint">{todo.hint}</span>}
        </div>
        <span
          className="chip todo__phase"
          style={{ background: phase.bg, color: phase.fg }}
        >
          {todo.phase}
        </span>
        <button
          type="button"
          className="todo__prio"
          style={{ color: prio.fg }}
          title={`Priority ${todo.prio}. Click to change, or drag the row to another group.`}
          aria-label={`Priority ${todo.prio}, change to ${NEXT_PRIO[todo.prio]}`}
          onClick={() => moveTodo(projectId, todo.id, NEXT_PRIO[todo.prio], null)}
        >
          <span className="todo__prio-dot" style={{ background: prio.dot }} />
          {todo.prio}
        </button>
        <span className="todo__window">{todo.window}</span>
        <span className="todo__due" style={{ color: dueColor }}>
          {todo.due}
        </span>
      </div>

      {todo.subs && todo.subs.length > 0 && (
        <div className="subs">
          {todo.subs.map((s) => (
            <div className="sub" key={s.id}>
              <Checkbox
                small
                checked={Boolean(s.done)}
                label={`Mark "${s.text}" ${s.done ? 'not done' : 'done'}`}
                onChange={() => toggleSubtask(projectId, todo.id, s.id)}
              />
              <span
                className={`sub__text${s.done ? ' sub__text--done' : ''}`}
                onClick={() => toggleSubtask(projectId, todo.id, s.id)}
              >
                {s.text}
              </span>
              <span className="sub__hint">{s.hint ?? ''}</span>
              <span className="sub__est">{s.est}</span>
            </div>
          ))}
          <button type="button" className="add-row subs__add">
            <Icon name="plus" size={10} />
            Add a subtask
          </button>
        </div>
      )}
    </div>
  );
}
