import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { KIND } from '../data/theme';
import { SECTION_LIBRARY, TEMPLATES, makeProject, sectionDef, type Template } from '../data/templates';
import type { ProjectKind, SectionKey } from '../data/types';
import { usePlanner } from '../state/store';
import { Icon, type IconName } from './Icon';

/**
 * Where the new-project flow opens. Set at build time (VITE_NP_VARIANT) so each
 * placement can be published as its own prototype:
 * - drawer: a sheet rising from the bottom (default)
 * - modal:  a centred dialog
 * - side:   a full-height panel on the right
 * - page:   a full page that replaces the Desk, with a breadcrumb back
 */
export type Placement = 'drawer' | 'modal' | 'side' | 'page';
export const PLACEMENT: Placement = ((import.meta.env.VITE_NP_VARIANT as string) || 'drawer') as Placement;

interface TypeOpt {
  id: string;
  kind: ProjectKind;
  label: string;
  icon: IconName;
}

const BUILT_IN_TYPES: TypeOpt[] = [
  { id: 'pm', kind: 'pm', label: 'Work', icon: 'laptop' },
  { id: 'music', kind: 'music', label: 'Music', icon: 'music' },
  { id: 'tufting', kind: 'tufting', label: 'Sewing', icon: 'sewing' },
];
const TYPE_ICONS: IconName[] = ['star', 'brush', 'book', 'camera', 'leaf', 'home'];
const KIND_ICON: Record<ProjectKind, IconName> = { pm: 'laptop', music: 'music', tufting: 'sewing', custom: 'star' };

type Step = { view: 'choose' } | { view: 'template'; template: Template } | { view: 'custom' };

export function NewProjectDrawer({ onClose }: { onClose: () => void }) {
  const { addProject, openProject } = usePlanner();
  const [step, setStep] = useState<Step>({ view: 'choose' });
  // Types a person adds live for the session, so a second custom project can reuse them.
  const [types, setTypes] = useState<TypeOpt[]>(BUILT_IN_TYPES);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
  }, [step.view]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  const create = (p: ReturnType<typeof makeProject>) => {
    addProject(p);
    openProject(p.id);
    onClose();
  };
  const title = step.view === 'choose' ? 'New project' : step.view === 'template' ? `${step.template.label} template` : 'Custom project';
  const isPage = PLACEMENT === 'page';

  return (
    <div className={`np np--${PLACEMENT}`} onKeyDown={onKey}>
      {!isPage && <div className="np__backdrop" onClick={onClose} />}
      <div
        className="np__panel"
        role={isPage ? 'region' : 'dialog'}
        aria-modal={isPage ? undefined : true}
        aria-labelledby="np-title"
        tabIndex={-1}
        ref={panel}
      >
        {PLACEMENT === 'drawer' && <div className="np__grab" aria-hidden="true" />}
        <header className="np__head">
          <div className="np__titles">
            {isPage && (
              <nav className="crumbs" aria-label="Breadcrumb">
                <a className="crumbs__link" href="#desk" onClick={(e) => { e.preventDefault(); onClose(); }}>Desk</a>
                <span>/</span>
                <span>New project</span>
              </nav>
            )}
            <h2 id="np-title" className="np__title">{title}</h2>
            {step.view !== 'choose' && (
              <button type="button" className="np__back" onClick={() => setStep({ view: 'choose' })}>
                <Icon name="arrow-left" size={14} />
                Back
              </button>
            )}
          </div>
          <span className="grow" />
          <button type="button" className="np__close" aria-label={isPage ? 'Cancel and go back to Desk' : 'Close'} onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </header>

        <div className="np__scroll">
          {step.view === 'choose' && <Choose onTemplate={(t) => setStep({ view: 'template', template: t })} onCustom={() => setStep({ view: 'custom' })} />}
          {step.view === 'template' && <FromTemplate template={step.template} onCreate={create} />}
          {step.view === 'custom' && <CustomBuilder types={types} setTypes={setTypes} onCreate={create} />}
        </div>
      </div>
    </div>
  );
}

function Choose({ onTemplate, onCustom }: { onTemplate: (t: Template) => void; onCustom: () => void }) {
  return (
    <div className="np__body">
      <div className="eyebrow np__label">Start from a template</div>
      <div className="tpl-grid">
        {TEMPLATES.map((t) => (
          <button type="button" key={t.id} className="tpl" onClick={() => onTemplate(t)}>
            <span className="tpl__icon" style={{ color: KIND[t.kind].dot }}>
              <Icon name={KIND_ICON[t.kind]} size={20} />
            </span>
            <span className="tpl__name">{t.label}</span>
            <span className="tpl__blurb">{t.blurb}</span>
            <span className="tpl__phases">{t.phases.join(' · ')}</span>
            <span className="tpl__meta">{t.todos.length} starter tasks · {t.sections.length} sections</span>
          </button>
        ))}
      </div>
      <div className="eyebrow np__label">Or build your own</div>
      <button type="button" className="tpl tpl--custom" onClick={onCustom}>
        <span className="tpl__icon">
          <Icon name="plus" size={20} />
        </span>
        <span className="tpl__name">Create a custom form</span>
        <span className="tpl__blurb">Choose or add a type, set your phases, and drag in the sections your project page needs.</span>
      </button>
    </div>
  );
}

function FromTemplate({ template, onCreate }: { template: Template; onCreate: (p: ReturnType<typeof makeProject>) => void }) {
  const [name, setName] = useState(template.defaultName);
  return (
    <form
      className="np__body"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(makeProject({ name, kind: template.kind, phases: template.phases, sections: template.sections, todos: template.todos }));
      }}
    >
      <label className="field" style={{ maxWidth: 440 }}>
        <span className="field__label">Project name</span>
        <input className="field__input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </label>
      <div className="tpl-summary">
        <div>
          <div className="eyebrow">Phases</div>
          <div className="chip-row">
            {template.phases.map((p) => <span className="chip chip--neutral" key={p}>{p}</span>)}
          </div>
        </div>
        <div>
          <div className="eyebrow">Sections</div>
          <div className="chip-row">
            {template.sections.map((s) => <span className="chip chip--neutral" key={s}>{sectionDef(s)?.label}</span>)}
          </div>
        </div>
        <div>
          <div className="eyebrow">Starter tasks</div>
          <ol className="tpl-tasks">
            {template.todos.map((t) => <li key={t.text}>{t.text}</li>)}
          </ol>
        </div>
      </div>
      <div className="np__foot">
        <button type="submit" className="btn btn--primary">Create project</button>
      </div>
    </form>
  );
}

/** Generic drag-to-reorder for a list of strings: refs survive a drop that beats the re-render. */
function useReorder<T extends string>(items: T[], setItems: (next: T[]) => void) {
  const [dragging, setDragging] = useState<T | null>(null);
  const [dropAt, setDropAtState] = useState<number | null>(null);
  const dragRef = useRef<T | null>(null);
  const dropRef = useRef<number | null>(null);
  const setDropAt = (i: number | null) => { dropRef.current = i; setDropAtState(i); };
  const end = () => { dragRef.current = null; setDragging(null); setDropAt(null); };
  const place = (item: T, at: number | null) => {
    const rest = items.filter((x) => x !== item);
    const i = at === null ? rest.length : Math.max(0, Math.min(at, rest.length));
    setItems([...rest.slice(0, i), item, ...rest.slice(i)]);
  };
  return {
    dragging, dropAt, place,
    start: (e: DragEvent, item: T) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item);
      dragRef.current = item;
      setDragging(item);
    },
    end,
    /** Over item `i`: before or after it depending on the pointer, on the given axis. */
    over: (e: DragEvent<HTMLElement>, i: number, axis: 'x' | 'y') => {
      if (!dragRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      const r = e.currentTarget.getBoundingClientRect();
      const after = axis === 'y' ? e.clientY > r.top + r.height / 2 : e.clientX > r.left + r.width / 2;
      const at = after ? i + 1 : i;
      if (dropRef.current !== at) setDropAt(at);
    },
    overEnd: (e: DragEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      if (dropRef.current === null) setDropAt(items.length);
    },
    drop: (e: DragEvent) => {
      e.preventDefault();
      const item = dragRef.current;
      if (item) {
        let at = dropRef.current;
        const old = items.indexOf(item);
        if (at !== null && old >= 0 && old < at) at -= 1;
        place(item, at);
      }
      end();
    },
    isDragging: () => dragRef.current !== null,
  };
}

function CustomBuilder({
  types, setTypes, onCreate,
}: {
  types: TypeOpt[];
  setTypes: (t: TypeOpt[]) => void;
  onCreate: (p: ReturnType<typeof makeProject>) => void;
}) {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('pm');
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState('');
  const [newIcon, setNewIcon] = useState<IconName>('star');
  const [phases, setPhases] = useState<string[]>(['Discovery', 'Definition', 'Build']);
  const [phaseDraft, setPhaseDraft] = useState('');
  const [sections, setSections] = useState<SectionKey[]>(['todos']);
  const phaseDnD = useReorder(phases, setPhases);
  const secDnD = useReorder<SectionKey>(sections, setSections);

  const type = types.find((t) => t.id === typeId) ?? types[0];
  const addPhase = () => {
    const v = phaseDraft.trim();
    if (v && !phases.includes(v)) setPhases([...phases, v]);
    setPhaseDraft('');
  };
  const saveType = () => {
    const label = newType.trim();
    if (!label) return;
    const id = `custom-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (!types.some((t) => t.id === id)) setTypes([...types, { id, kind: 'custom', label, icon: newIcon }]);
    setTypeId(id);
    setAdding(false);
    setNewType('');
  };
  const movePhase = (p: string, by: number) => phaseDnD.place(p, phases.indexOf(p) + by);
  const available = SECTION_LIBRARY.filter((s) => !sections.includes(s.key));

  return (
    <form
      className="np__body builder"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(makeProject({
          name, kind: type.kind, phases, sections, todos: [],
          ...(type.kind === 'custom' ? { typeLabel: type.label, icon: type.icon } : {}),
        }));
      }}
    >
      <div className="builder__setup">
        <label className="field">
          <span className="field__label">Project name</span>
          <input className="field__input" value={name} placeholder="e.g. Linen tote bag" onChange={(e) => setName(e.target.value)} autoFocus />
        </label>

        <fieldset className="field">
          <legend className="field__label">Type</legend>
          <div className="type-row">
            {types.map((t) => (
              <button type="button" key={t.id} className={`type-opt${typeId === t.id ? ' type-opt--on' : ''}`} aria-pressed={typeId === t.id} onClick={() => setTypeId(t.id)}>
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            ))}
            {!adding && (
              <button type="button" className="type-opt type-opt--add" onClick={() => setAdding(true)}>
                <Icon name="plus" size={15} />
                New type
              </button>
            )}
          </div>
          {adding && (
            <div className="type-new">
              <input
                className="field__input"
                value={newType}
                placeholder="Type name, e.g. Garden"
                aria-label="New type name"
                autoFocus
                onChange={(e) => setNewType(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveType(); } }}
              />
              <div className="icon-pick" role="radiogroup" aria-label="Icon for the new type">
                {TYPE_ICONS.map((ic) => (
                  <button type="button" key={ic} role="radio" aria-checked={newIcon === ic} aria-label={ic} className={`icon-pick__opt${newIcon === ic ? ' icon-pick__opt--on' : ''}`} onClick={() => setNewIcon(ic)}>
                    <Icon name={ic} size={16} />
                  </button>
                ))}
              </div>
              <div className="type-new__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setAdding(false)}>Cancel</button>
                <button type="button" className="btn btn--dark" onClick={saveType} disabled={!newType.trim()}>Add type</button>
              </div>
            </div>
          )}
        </fieldset>

        <div className="field">
          <span className="field__label">Phases, in order · drag to reorder</span>
          <ol className="phase-list" onDragOver={phaseDnD.overEnd} onDrop={phaseDnD.drop}>
            {phases.map((p, i) => (
              <li
                key={p}
                className={`phase-chip${phaseDnD.dragging === p ? ' phase-chip--dragging' : ''}${phaseDnD.dropAt === i && phaseDnD.dragging ? ' phase-chip--drop' : ''}`}
                draggable
                onDragStart={(e) => phaseDnD.start(e, p)}
                onDragEnd={phaseDnD.end}
                onDragOver={(e) => phaseDnD.over(e, i, 'x')}
              >
                <span className="phase-chip__grip" aria-hidden="true"><Icon name="grip" size={14} /></span>
                <span className="phase-chip__n">{i + 1}</span>
                <button
                  type="button"
                  className="phase-chip__name"
                  aria-label={`${p}, phase ${i + 1} of ${phases.length}. Use the left and right arrow keys to move it.`}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); movePhase(p, -1); }
                    if (e.key === 'ArrowRight' && i < phases.length - 1) { e.preventDefault(); movePhase(p, 1); }
                  }}
                >
                  {p}
                </button>
                <button type="button" className="icon-btn icon-btn--sm" aria-label={`Remove ${p}`} onClick={() => setPhases(phases.filter((x) => x !== p))}>
                  <Icon name="close" size={12} />
                </button>
              </li>
            ))}
            {phaseDnD.dragging && phaseDnD.dropAt === phases.length && <li className="phase-drop-end" aria-hidden="true" />}
          </ol>
          <div className="phase-add">
            <input
              className="field__input"
              value={phaseDraft}
              placeholder="Add a phase"
              aria-label="Add a phase"
              onChange={(e) => setPhaseDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPhase(); } }}
            />
            <button type="button" className="btn btn--ghost" onClick={addPhase}>
              <Icon name="plus" size={14} />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="builder__lists">
        <section className="builder__col" aria-label="Sections you can add">
          <div className="eyebrow">Form builder · sections</div>
          <ul className="sec-list">
            {available.map((s) => (
              <li key={s.key} className={`sec${secDnD.dragging === s.key ? ' sec--dragging' : ''}`} draggable onDragStart={(e) => secDnD.start(e, s.key)} onDragEnd={secDnD.end}>
                <span className="sec__grip" aria-hidden="true"><Icon name="grip" size={16} /></span>
                <span className="sec__text">
                  <span className="sec__name">{s.label}</span>
                  <span className="sec__hint">{s.hint}</span>
                </span>
                <button type="button" className="icon-btn" aria-label={`Add ${s.label}`} onClick={() => secDnD.place(s.key, null)}>
                  <Icon name="plus" size={16} />
                </button>
              </li>
            ))}
            {available.length === 0 && <li className="sec-empty">Every section is on the page.</li>}
          </ul>
        </section>

        <section
          className={`builder__col builder__col--form${secDnD.dragging ? ' builder__col--target' : ''}`}
          aria-label="Your project page"
          onDragOver={secDnD.overEnd}
          onDrop={secDnD.drop}
        >
          <div className="eyebrow">Your project page · drag to reorder</div>
          <div className="sec sec--fixed">
            <span className="sec__text">
              <span className="sec__name">Header and phase pipeline</span>
              <span className="sec__hint">Always at the top</span>
            </span>
          </div>
          <ol className="sec-list">
            {sections.map((k, i) => (
              <li
                key={k}
                className={`sec sec--placed${secDnD.dragging === k ? ' sec--dragging' : ''}${secDnD.dropAt === i && secDnD.dragging ? ' sec--drop-above' : ''}`}
                draggable
                onDragStart={(e) => secDnD.start(e, k)}
                onDragEnd={secDnD.end}
                onDragOver={(e) => secDnD.over(e, i, 'y')}
              >
                <span className="sec__grip" aria-hidden="true"><Icon name="grip" size={16} /></span>
                <span className="sec__text">
                  <span className="sec__name">{sectionDef(k)?.label}</span>
                  <span className="sec__hint">{sectionDef(k)?.hint}</span>
                </span>
                <button type="button" className="icon-btn" aria-label={`Move ${sectionDef(k)?.label} up`} disabled={i === 0} onClick={() => secDnD.place(k, i - 1)}>
                  <Icon name="arrow-up" size={16} />
                </button>
                <button type="button" className="icon-btn" aria-label={`Remove ${sectionDef(k)?.label}`} onClick={() => setSections(sections.filter((x) => x !== k))}>
                  <Icon name="close" size={16} />
                </button>
              </li>
            ))}
            {secDnD.dragging && secDnD.dropAt === sections.length && <li className="drop-slot" aria-hidden="true" />}
            {sections.length === 0 && <li className="sec-empty">Drag sections here</li>}
          </ol>
        </section>
      </div>

      <div className="np__foot">
        <span className="np__note">
          <Icon name={type.icon} size={14} /> {type.label} · {phases.length} {phases.length === 1 ? 'phase' : 'phases'} · {sections.length} {sections.length === 1 ? 'section' : 'sections'}
        </span>
        <button type="submit" className="btn btn--primary" disabled={!phases.length}>Create project</button>
      </div>
    </form>
  );
}
