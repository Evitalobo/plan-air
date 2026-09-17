import { LINK_KIND_FG, PRIO, phaseStyle } from '../data/theme';
import type { Project, Todo, TodoFilter } from '../data/types';
import { filterTodos, todoMeta } from '../state/selectors';
import { usePlanner } from '../state/store';
import { Checkbox } from './Checkbox';
import { Icon } from './Icon';

const FILTERS: TodoFilter[] = ['All', 'Open', 'High first'];

/** Links row, to-do header, column headers, task rows and subtasks — one card. */
export function WorkCard({ project }: { project: Project }) {
  const { filter, setFilter } = usePlanner();
  const list = filterTodos(project.todos, filter);

  return (
    <section className="card work">
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
            {f}
          </button>
        ))}
      </div>

      <div className="todo-grid todo-cols">
        <span />
        <span>Task</span>
        <span className="col-phase">Phase</span>
        <span className="col-prio">Priority</span>
        <span className="col-window">Window</span>
        <span className="col-due">Due</span>
      </div>

      {list.map((t) => (
        <TodoRow key={t.id} projectId={project.id} todo={t} />
      ))}

      <button type="button" className="add-row work__add">
        <Icon name="plus" size={11} />
        Add a task
      </button>
    </section>
  );
}

function TodoRow({ projectId, todo }: { projectId: string; todo: Todo }) {
  const { toggleTodo, toggleSubtask } = usePlanner();
  const phase = phaseStyle(todo.phase);
  const prio = PRIO[todo.prio];
  const dueColor = todo.done
    ? 'var(--prio-low)'
    : todo.prio === 'High'
      ? 'var(--risk-fg)'
      : 'var(--dim)';

  return (
    <div className="todo">
      <div className="todo-grid todo__row">
        <Checkbox
          checked={Boolean(todo.done)}
          label={`Mark "${todo.text}" ${todo.done ? 'not done' : 'done'}`}
          onChange={() => toggleTodo(projectId, todo.id)}
        />
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
        <span className="todo__prio" style={{ color: prio.fg }}>
          <span className="todo__prio-dot" style={{ background: prio.dot }} />
          {todo.prio}
        </span>
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
