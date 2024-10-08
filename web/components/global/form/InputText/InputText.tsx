import { useId } from "react"
import { Props } from "./InputText.types"


export default function InputText({ label, type = 'text' }: Props) {
    const id = useId()
    return (
        <div className="flex flex-col">
            <label className="text-sm mb-0.5 mb-2" htmlFor={id}>{label}</label>
            <input className="px-3 py-1.5 border border-white/40 rounded-lg text-lg bg-bg-200 outline-0 focus:bg-bg-300" id={id} type={type} />
        </div>
    )
}
