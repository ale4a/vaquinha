import { TiArrowSortedDown } from 'react-icons/ti';
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
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  optionValue?: T;
  onChangeOption?: (value: T) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  options: Option<T>[];
  placeHolder: string;
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
  placeHolder,
}: CurrencyInputTextProps<T>) {
  const id = useId();
  return (
    <div className={'flex flex-col gap-1 ' + className}>
      {/* <label
        className={'text-sm text-accent-100 ' + SIZE_LABEL[size]}
        htmlFor={id}
      >
        {label}
      </label> */}
      <div className="bg-bg-200 flex flex-row border border-white/40 rounded-lg px-2 focus-within:border-primary-200 hover:border-primary-200 transition-colors duration-500">
        <input
          className={
            'flex-1 bg-transparent outline-0 text-accent-100 text-xs ' +
            SIZE[size]
          }
          min={0}
          placeholder={placeHolder}
          id={id}
          autoComplete={'off'}
          // TODO: its necessary to show placeholder at the begin, but the value is it necessary? because this works without value
          // value={value}
          onChange={({ target }) => onChange?.(target.valueAsNumber)}
          type="number"
          style={{ width: 24 }}
        />
        <div className="border-l border-white/40 mx-2 my-2"></div>
        <div className="relative">
          <select
            id={id}
            className={
              'appearance-none w-14 bg-transparent outline-0 text-accent-100 focus:ring-bg-200 text-xs ' +
              SIZE_SELECT[size]
            }
            value={optionValue}
            onChange={({ target }) => onChangeOption?.(target.value as T)}
          >
            {/* <option value="" disabled>
              Choose an option
            </option> */}
            {options.map((option) => (
              <option value={option.value} key={option.value}>
                {option.text}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
            <TiArrowSortedDown />
          </div>
        </div>
      </div>
    </div>
  );
}
