import { useEffect, useRef, useState } from 'react';
import { NOTE_TAGS } from '../data/desk';
import { LINK_KIND_FG } from '../data/theme';
import type { LinkKind, Priority } from '../data/types';
import { usePlanner } from '../state/store';
import { Icon } from './Icon';

type Kind = 'Note' | 'Task' | 'Link';

const KINDS: Kind[] = ['Note', 'Task', 'Link'];
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];
const LINK_KINDS = Object.keys(LINK_KIND_FG) as LinkKind[];

/**
 * Bottom-right quick-add. The floating button opens a drawer with one form per
 * kind of thing you can add. These write into the same state the rest of the
 * app reads, so a task added here appears in its project's to-do table and
 * moves that phase's open count.
 */
export function AddDrawer() {
  const { projects, projectId, drawerOpen, setDrawerOpen, addNote, addTask, addLink } = usePlanner();

  const [kind, setKind] = useState<Kind>('Note');
  const [confirmation, setConfirmation] = useState('');
  const firstField = useRef<HTMLInputElement>(null);

  // Note
  const [noteTag, setNoteTag] = useState(NOTE_TAGS[0]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteExcerpt, setNoteExcerpt] = useState('');

  // Task
  const [taskProject, setTaskProject] = useState(projectId);
  const [taskText, setTaskText] = useState('');
  const [taskHint, setTaskHint] = useState('');
  const [taskPhase, setTaskPhase] = useState('');
  const [taskPrio, setTaskPrio] = useState<Priority>('Medium');
  const [taskDue, setTaskDue] = useState('');

  // Link
  const [linkProject, setLinkProject] = useState(projectId);
  const [linkKind, setLinkKind] = useState<LinkKind>('DOC');
  const [linkLabel, setLinkLabel] = useState('');

  const taskProjectPhases = projects.find((p) => p.id === taskProject)?.phases ?? [];

  // Follow the sidebar selection until the user picks a project here.
  useEffect(() => {
    setTaskProject(projectId);
    setLinkProject(projectId);
  }, [projectId]);

  // Keep the phase valid for whichever project is selected.
  useEffect(() => {
    if (!taskProjectPhases.includes(taskPhase)) setTaskPhase(taskProjectPhases[0] ?? '');
  }, [taskProjectPhases, taskPhase]);

  useEffect(() => {
    if (drawerOpen) firstField.current?.focus();
  }, [drawerOpen, kind]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, setDrawerOpen]);

  useEffect(() => {
    if (!confirmation) return;
    const t = setTimeout(() => setConfirmation(''), 2600);
    return () => clearTimeout(t);
  }, [confirmation]);

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? '';

  const canSubmit =
    kind === 'Note'
      ? noteTitle.trim() !== ''
      : kind === 'Task'
        ? taskText.trim() !== '' && taskPhase !== ''
        : linkLabel.trim() !== '';

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    if (kind === 'Note') {
      addNote({ tag: noteTag, title: noteTitle.trim(), excerpt: noteExcerpt.trim() });
      setConfirmation(`Note filed — “${noteTitle.trim()}”`);
      setNoteTitle('');
      setNoteExcerpt('');
    }

    if (kind === 'Task') {
      addTask(taskProject, {
        text: taskText.trim(),
        hint: taskHint.trim(),
        phase: taskPhase,
        prio: taskPrio,
        due: taskDue.trim(),
      });
      setConfirmation(`Added to ${projectName(taskProject)} · ${taskPhase}`);
      setTaskText('');
      setTaskHint('');
      setTaskDue('');
    }

    if (kind === 'Link') {
      addLink(linkProject, { kind: linkKind, label: linkLabel.trim() });
      setConfirmation(`Linked to ${projectName(linkProject)}`);
      setLinkLabel('');
    }
  }

  if (!drawerOpen) {
    return (
      <button
        type="button"
        className="fab"
        aria-label="Add a note, task or link"
        onClick={() => setDrawerOpen(true)}
      >
        <Icon name="plus" size={18} />
      </button>
    );
  }

  return (
    <aside className="drawer" role="dialog" aria-label="Add">
      <div className="drawer__head">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            className={`filter${kind === k ? ' filter--on' : ''}`}
            aria-pressed={kind === k}
            onClick={() => {
              setKind(k);
              setConfirmation('');
            }}
          >
            {k}
          </button>
        ))}
        <span className="grow" />
        <button
          type="button"
          className="drawer__close"
          aria-label="Close"
          onClick={() => setDrawerOpen(false)}
        >
          ✕
        </button>
      </div>

      <form className="drawer__body" onSubmit={submit}>
        {kind === 'Note' && (
          <>
            <label className="field">
              <span className="field__label">Title</span>
              <input
                ref={firstField}
                className="field__input"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="What did you learn?"
              />
            </label>
            <label className="field">
              <span className="field__label">Tag</span>
              <input
                className="field__input"
                list="note-tags"
                value={noteTag}
                onChange={(e) => setNoteTag(e.target.value)}
              />
              <datalist id="note-tags">
                {NOTE_TAGS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </label>
            <label className="field">
              <span className="field__label">Note</span>
              <textarea
                className="field__area"
                rows={3}
                value={noteExcerpt}
                onChange={(e) => setNoteExcerpt(e.target.value)}
                placeholder="The detail you'll want in three weeks."
              />
            </label>
          </>
        )}

        {kind === 'Task' && (
          <>
            <label className="field">
              <span className="field__label">Task</span>
              <input
                ref={firstField}
                className="field__input"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="What needs doing?"
              />
            </label>
            <label className="field">
              <span className="field__label">Project</span>
              <select
                className="field__input"
                value={taskProject}
                onChange={(e) => setTaskProject(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="field__row">
              <label className="field">
                <span className="field__label">Phase</span>
                <select
                  className="field__input"
                  value={taskPhase}
                  onChange={(e) => setTaskPhase(e.target.value)}
                >
                  {taskProjectPhases.map((ph) => (
                    <option key={ph} value={ph}>
                      {ph}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field__label">Priority</span>
                <select
                  className="field__input"
                  value={taskPrio}
                  onChange={(e) => setTaskPrio(e.target.value as Priority)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="field__row">
              <label className="field">
                <span className="field__label">Note</span>
                <input
                  className="field__input"
                  value={taskHint}
                  onChange={(e) => setTaskHint(e.target.value)}
                  placeholder="optional"
                />
              </label>
              <label className="field">
                <span className="field__label">Due</span>
                <input
                  className="field__input"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  placeholder="Fri, 3 Oct…"
                />
              </label>
            </div>
          </>
        )}

        {kind === 'Link' && (
          <>
            <label className="field">
              <span className="field__label">Label</span>
              <input
                ref={firstField}
                className="field__input"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                placeholder="What are you linking?"
              />
            </label>
            <label className="field">
              <span className="field__label">Project</span>
              <select
                className="field__input"
                value={linkProject}
                onChange={(e) => setLinkProject(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Kind</span>
              <select
                className="field__input"
                value={linkKind}
                onChange={(e) => setLinkKind(e.target.value as LinkKind)}
              >
                {LINK_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <div className="drawer__foot">
          <span className="drawer__confirm">{confirmation}</span>
          <span className="grow" />
          <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
            Add {kind.toLowerCase()}
          </button>
        </div>
      </form>
    </aside>
  );
}
