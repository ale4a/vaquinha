import { useId } from "react"
import { Props } from './InputSelect.types'

export default function InputSelect({ label, options }: Props) {
    const id = useId()
    return (
        <div className="flex flex-col">
            <label className="text-sm mb-0.5" htmlFor={id}>{label}</label>
            <select id={id} className="text-sm rounded-lg block w-full p-3 bg-bg-200 border border-white/40 outline-0 focus:ring-bg-200 focus:bg-bg-300">
                <option selected>Choose an option</option>
                {
                    options.map(option => {
                        return <option value={option.value} key={option.value}>
                            {option.text}
                        </option>
                    })
                }
            </select>
        </div>
    )
}
