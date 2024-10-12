import { useId } from 'react';
import { Props } from './InputSelect.types';

export default function InputSelect<T extends string | number = string>({
  label,
  options,
  defaultValue,
  value,
  onChange,
}: Props<T>) {
  const id = useId();

  return (
    <div className="flex flex-col">
      <label className="text-sm mb-0.5 mb-2 text-accent-100" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="p-3 border border-white/40 rounded-lg bg-bg-200 outline-0 focus:bg-bg-300 text-accent-100 focus:ring-bg-200 h-12"
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
