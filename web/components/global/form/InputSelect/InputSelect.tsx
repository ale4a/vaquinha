import { useId } from 'react';
import { Props } from './InputSelect.types';

const SIZE_SELECT = {
  small: 'p-0 h-8 text-xs',
  medium: 'p-3 h-12 text-sm',
  large: 'p-3 h-12',
};

const SIZE_LABEL = {
  small: 'text-xs mb-0',
  medium: 'text-sm mb-2',
  large: 'text-sm mb-2',
};

export default function InputSelect<T extends string | number = string>({
  label,
  options,
  defaultValue,
  value,
  onChange,
  size = 'medium',
  className,
}: Props<T>) {
  const id = useId();

  return (
    <div className={'flex flex-col ' + className}>
      <label className={'text-accent-100 ' + SIZE_LABEL[size]} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={
          'border border-white/40 rounded-lg bg-bg-200 outline-0 focus:bg-bg-300 text-accent-100 focus:ring-bg-200 ' +
          SIZE_SELECT[size]
        }
        defaultValue={defaultValue} // Usa defaultValue aquí
        value={value}
        onChange={({ target }) => onChange?.(target.value as T)}
      >
        <option value="" disabled>
          Choose an option
        </option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
