interface Props {
  name: string
  amount: number
  collateral: number
  startIn: string
  period: string
  peopleCount: number
}

export default function SavingCard({ name, amount, collateral, startIn, period, peopleCount }: Props) {
  return (
    <div className="flex justify-between bg-bg-100 p-1 border-b-2 border-white/25">
      <div>
        <h2 className="text-base font-bold">{name}</h2>
        <h3 className="text-2xl font-bold">{amount} USDT</h3>
        <p className="text-sm font-satoshi opacity-85">Collateral: {collateral} USDT</p>
        <p className="text-sm font-satoshi opacity-85">Start In: {startIn} (3 days)</p>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <img src="icons/PeopleIcon.svg" alt="people icon" />
            <p className="opacity-85">{peopleCount}/5</p>
          </div>
          <div className="flex items-center gap-1">
            <img src="icons/DateIcon.svg" alt="people icon" />
            <p className="opacity-85">{period}</p>
          </div>
        </div>
        <button className="rounded-xl px-6 py-1 bg-primary-200 text-2xl">Save</button>
      </div>
    </div>
  )
}