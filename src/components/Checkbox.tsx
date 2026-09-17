import { Icon } from './Icon';

interface Props {
  checked: boolean;
  onChange: () => void;
  label: string;
  small?: boolean;
}

export function Checkbox({ checked, onChange, label, small }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`checkbox${small ? ' checkbox--sm' : ''}${checked ? ' checkbox--on' : ''}`}
      onClick={onChange}
    >
      {checked && <Icon name="check" size={small ? 8 : 9} />}
    </button>
  );
}
