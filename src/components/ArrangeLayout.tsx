import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { sectionDef } from '../data/templates';
import type { LayoutItem, SectionKey } from '../data/types';
import { Icon, type IconName } from './Icon';

const WIDTHS: { span: LayoutItem['span']; label: string; name: string }[] = [
  { span: 2, label: '⅓', name: 'one third' },
  { span: 3, label: '½', name: 'half' },
  { span: 4, label: '⅔', name: 'two thirds' },
  { span: 6, label: 'Full', name: 'full width' },
];

/**
 * Step two of the custom form: the project page laid out with empty
 * placeholders. Drag a block to move it, pick its width, and the page reads
 * exactly as it will once the project has data.
 */
export function ArrangeLayout({
  name,
  typeIcon,
  phases,
  layout,
  setLayout,
}: {
  name: string;
  typeIcon: IconName;
  phases: string[];
  layout: LayoutItem[];
  setLayout: (next: LayoutItem[]) => void;
}) {
  const [dragging, setDragging] = useState<SectionKey | null>(null);
  const [dropAt, setDropAtState] = useState<number | null>(null);
  const dragRef = useRef<SectionKey | null>(null);
  const dropRef = useRef<number | null>(null);
  const setDropAt = (i: number | null) => {
    dropRef.current = i;
    setDropAtState(i);
  };

  const move = (key: SectionKey, to: number) => {
    const item = layout.find((l) => l.key === key);
    if (!item) return;
    const rest = layout.filter((l) => l.key !== key);
    const i = Math.max(0, Math.min(to, rest.length));
    setLayout([...rest.slice(0, i), item, ...rest.slice(i)]);
  };
  const setSpan = (key: SectionKey, span: LayoutItem['span']) =>
    setLayout(layout.map((l) => (l.key === key ? { ...l, span } : l)));
  const remove = (key: SectionKey) => setLayout(layout.filter((l) => l.key !== key));

  const onDragStart = (e: DragEvent, key: SectionKey) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', key);
    dragRef.current = key;
    setDragging(key);
  };
  const onDragEnd = () => {
    dragRef.current = null;
    setDragging(null);
    setDropAt(null);
  };
  /** Blocks sit side by side, so the drop side follows the pointer horizontally. */
  const onDragOver = (e: DragEvent<HTMLElement>, i: number) => {
    if (!dragRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    const at = e.clientX > r.left + r.width / 2 ? i + 1 : i;
    if (dropRef.current !== at) setDropAt(at);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const key = dragRef.current;
    if (key && dropRef.current !== null) {
      const old = layout.findIndex((l) => l.key === key);
      let at = dropRef.current;
      if (old < at) at -= 1;
      move(key, at);
    }
    onDragEnd();
  };
  const onKey = (e: KeyboardEvent, key: SectionKey, i: number) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(key, i - 1);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      move(key, i + 1);
    }
  };

  return (
    <div className="arrange">
      <p className="arrange__help">
        Drag a block to move it, or select it and use the arrow keys. Pick a width to set it beside another block. This is how the project page will look before it has any data.
      </p>

      <div className="arrange__page" aria-label="Project page layout">
        <div className="arrange__header" aria-hidden="true">
          <div className="arrange__crumb">Desk / Projects</div>
          <div className="arrange__titleline">
            <span className="arrange__icon"><Icon name={typeIcon} size={18} /></span>
            <span className="arrange__title">{name.trim() || 'Untitled project'}</span>
            <span className="arrange__badge">new</span>
          </div>
          <div className="arrange__pipeline">
            {phases.map((p, i) => (
              <div className="arrange__phase" key={p}>
                <span className="arrange__track">
                  <span className={`arrange__node${i === 0 ? ' arrange__node--now' : ''}`} />
                  <span className="arrange__bar" />
                </span>
                <span className="arrange__phase-label">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <ol className="arrange__grid" onDragOver={(e) => { if (dragRef.current) { e.preventDefault(); if (dropRef.current === null) setDropAt(layout.length); } }} onDrop={onDrop}>
          {layout.map((item, i) => {
            const def = sectionDef(item.key);
            return (
              <li
                key={item.key}
                className={`block${dragging === item.key ? ' block--dragging' : ''}${dragging && dropAt === i ? ' block--drop-before' : ''}${dragging && dropAt === i + 1 && i === layout.length - 1 ? ' block--drop-after' : ''}`}
                style={{ gridColumn: `span ${item.span}` }}
                draggable
                onDragStart={(e) => onDragStart(e, item.key)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => onDragOver(e, i)}
              >
                <div className="block__bar">
                  <button
                    type="button"
                    className="block__handle"
                    aria-label={`${def?.label}, position ${i + 1} of ${layout.length}. Arrow keys move it.`}
                    onKeyDown={(e) => onKey(e, item.key, i)}
                  >
                    <Icon name="grip" size={16} />
                  </button>
                  <span className="block__name">{def?.label}</span>
                  <span className="grow" />
                  <span className="block__widths" role="group" aria-label={`Width of ${def?.label}`}>
                    {WIDTHS.map((w) => (
                      <button
                        type="button"
                        key={w.span}
                        className={`block__width${item.span === w.span ? ' block__width--on' : ''}`}
                        aria-pressed={item.span === w.span}
                        aria-label={`Make ${def?.label} ${w.name}`}
                        onClick={() => setSpan(item.key, w.span)}
                      >
                        {w.label}
                      </button>
                    ))}
                  </span>
                  <button type="button" className="icon-btn icon-btn--bare" aria-label={`Remove ${def?.label}`} onClick={() => remove(item.key)}>
                    <Icon name="close" size={14} />
                  </button>
                </div>
                <Skeleton k={item.key} />
              </li>
            );
          })}
          {layout.length === 0 && <li className="block block--empty" style={{ gridColumn: 'span 6' }}>Go back and add at least one section.</li>}
        </ol>
      </div>
    </div>
  );
}

/** Empty, data-free stand-ins that echo each section's real shape. */
function Skeleton({ k }: { k: SectionKey }) {
  if (k === 'timeline')
    return (
      <div className="sk sk--timeline" aria-hidden="true">
        {[[1, 3], [2, 5], [4, 8]].map(([a, b], i) => (
          <div className="sk__tlrow" key={i}>
            <span className="sk__line sk__line--label" />
            <span className="sk__tlbar" style={{ marginLeft: `${a * 10}%`, width: `${(b - a) * 10}%` }} />
          </div>
        ))}
      </div>
    );
  if (k === 'glance')
    return (
      <div className="sk" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div className="sk__kv" key={i}><span className="sk__line sk__line--k" /><span className="sk__line" /></div>
        ))}
      </div>
    );
  if (k === 'links')
    return (
      <div className="sk sk--row" aria-hidden="true">
        <span className="sk__pill" /><span className="sk__pill" /><span className="sk__pill sk__pill--dash">+ Add link</span>
      </div>
    );
  if (k === 'todos')
    return (
      <div className="sk" aria-hidden="true">
        {['High', 'Medium', 'Low'].map((p) => (
          <div className="sk__group" key={p}>
            <span className="sk__grouplabel">{p}</span>
            <div className="sk__task"><span className="sk__box" /><span className="sk__line" /><span className="sk__chip" /></div>
          </div>
        ))}
      </div>
    );
  if (k === 'directions')
    return (
      <div className="sk sk--row" aria-hidden="true">
        {['A', 'B', 'C'].map((x) => <span className="sk__tab" key={x}>{x}</span>)}
      </div>
    );
  return (
    <div className="sk" aria-hidden="true">
      {[0, 1].map((i) => (
        <div className="sk__item" key={i}><span className="sk__line sk__line--k" /><span className="sk__chip" /><span className="sk__line sk__line--wide" /></div>
      ))}
    </div>
  );
}
