import { Option } from '@/components/global/form/InputSelect/InputSelect.types';
import React, { useId } from 'react';

const SIZE = {
  small: 'px-0 py-0.5 h-8',
  medium: 'px-3 py-1.5 h-12',
  large: 'px-3 py-1.5 h-12',
};

const SIZE_SELECT = {
  small: 'p-0 h-8',
  medium: 'p-3 h-12',
  large: 'p-3 h-12',
};

const SIZE_LABEL = {
  small: 'text-xs mb-0',
  medium: 'text-sm mb-2',
  large: 'text-sm mb-2',
};

export interface CurrencyInputTextProps<T extends string | number = string> {
  label: string;
  value?: number;
  onChange?: (value: number) => void;
  optionValue?: T;
  onChangeOption?: (value: T) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  options: Option<T>[];
}

export function CurrencyInputText<T extends string | number = string>({
  label,
  value,
  optionValue,
  options,
  onChange,
  onChangeOption,
  className,
  size = 'medium',
}: CurrencyInputTextProps<T>) {
  const id = useId();
  return (
    <div className={'flex flex-col ' + className}>
      <label
        className={'text-sm text-accent-100 ' + SIZE_LABEL[size]}
        htmlFor={id}
      >
        {label}
      </label>
      <div className="bg-bg-200 flex flex-row border border-white/40 rounded-lg">
        <input
          className={
            'flex-1 bg-transparent outline-0 text-accent-100 text-xs ' +
            SIZE[size]
          }
          id={id}
          value={value}
          onChange={({ target }) => onChange?.(target.valueAsNumber)}
          type="number"
          style={{ width: 24 }}
        />
        <select
          id={id}
          className={
            'w-14 bg-transparent outline-0 text-accent-100 focus:ring-bg-200 text-xs ' +
            SIZE_SELECT[size]
          }
          value={optionValue}
          onChange={({ target }) => onChangeOption?.(target.value as T)}
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
    </div>
  );
}
