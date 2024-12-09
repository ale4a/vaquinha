import { TiArrowSortedDown } from 'react-icons/ti';
import { useId } from 'react';
import { Props } from './InputSelect.types';

const SIZE_SELECT = {
  small: 'p-0 h-8',
  medium: 'p-3 h-12 text-sm',
  large: 'p-3 h-12',
};

// const SIZE_LABEL = {
//   small: 'text-xs mb-0',
//   medium: 'text-sm mb-2',
//   large: 'text-sm mb-2',
// };

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
    <div className={'flex flex-col w-full gap-1 ' + className}>
      {/* <label className={'text-accent-100 ' + SIZE_LABEL[size]} htmlFor={id}>
        {label}
      </label> */}
      <div className="relative ">
        <select
          id={id}
          className={
            'appearance-none border w-full border-white/40 px-2 rounded-lg bg-bg-200 outline-0 focus:bg-bg-300 text-accent-100 focus:ring-bg-200 ' +
            SIZE_SELECT[size] +
            ' focus-within:border-primary-200 hover:border-primary-200 transition-colors duration-500'
          }
          defaultValue={defaultValue} // Usa defaultValue aquí
          value={value}
          onChange={({ target }) => onChange?.(target.value as T)}
        >
          <option value="" disabled>
            Order by
          </option>
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <TiArrowSortedDown />
        </div>
      </div>
    </div>
  );
}
