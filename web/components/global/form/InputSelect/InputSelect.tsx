import { useId } from "react";

interface Option {
  value: string;
  text: string;
}

interface InputSelectProps {
  label: string;
  options: Option[];
  defaultValue?: string; // Añade la prop defaultValue
}

export default function InputSelect({ label, options, defaultValue }: InputSelectProps) {
  const id = useId();

  return (
    <div className="flex flex-col">
      <label className="text-sm mb-0.5 mb-2" htmlFor={id}>{label}</label>
      <select
        id={id}
        className="text-sm rounded-lg block w-full p-3 bg-bg-200 border border-white/40 outline-0 focus:ring-bg-200 focus:bg-bg-300"
        defaultValue={defaultValue} // Usa defaultValue aquí
      >
        <option value="" disabled>
          Choose an option
        </option>
        {
          options.map(option => (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          ))
        }
      </select>
    </div>
  );
}
