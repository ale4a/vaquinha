import { useId } from 'react';
import { Props } from './InputText.types';

const SIZE = {
  small: 'px-0 py-0.5 h-8',
  medium: 'px-3 py-1.5 h-12',
  large: 'px-3 py-1.5 h-12',
};

export default function InputText<T extends string | number = string>({
  label,
  type = 'text',
  value,
  onChange,
  className,
  placeHolder,
  size = 'medium',
  maxLength = 20,
}: Props<T>) {
  const id = useId();
  return (
    <div className={'flex flex-col w-full ' + className}>
      {/* <label className="text-sm mb-2 text-accent-100" htmlFor={id}>
        {label}
      </label> */}
      <input
        className={
          'border border-white/40 rounded-lg bg-bg-200 outline-0 focus:bg-bg-300 text-accent-100 ' +
          SIZE[size]
        }
        id={id}
        min={0}
        placeholder={placeHolder}
        type={type}
        autoComplete="off"
        value={value}
        maxLength={maxLength}
        onChange={({ target }) =>
          onChange?.(
            (type === 'number' ? target.valueAsNumber : target.value) as T
          )
        }
      />
    </div>
  );
}
