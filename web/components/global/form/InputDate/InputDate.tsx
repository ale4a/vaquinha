import { useId } from 'react';
import DatePicker from 'react-datepicker';
import { Props } from './InputDate.types';

export default function InputDate({
  label,
  value,
  onChange,
  filterTime,
  filterDate,
}: Props) {
  const id = useId();

  return (
    <div className="flex flex-col">
      <label className="text-sm mb-0.5 mb-2 text-accent-100" htmlFor={id}>
        {label}
      </label>
      <DatePicker
        selected={value}
        onChange={(date) => date && onChange?.(date)}
        showTimeSelect
        filterTime={filterTime}
        filterDate={filterDate}
        dateFormat="MMMM d, yyyy h:mm aa"
        className="px-3 py-2 border border-white/40 rounded-lg bg-bg-200 outline-0 focus:bg-bg-300 text-accent-100 h-12"
      />
    </div>
  );
}
