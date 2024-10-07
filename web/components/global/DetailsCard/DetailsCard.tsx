interface Props {
  members: number
  interestEarned: number
  period: string
  finalized: string
  groupId: string
  name: string
  amount: number
}

export default function DetailsCard({ members, interestEarned, period, finalized, groupId, name, amount }: Props) {
  return (
    <div className="flex justify-between border rounded-xl p-2 text-sm">
      <div>
        <p><span className="opacity-75 mr-1">Member</span> <span>{members} members</span></p>
        <p><span className="opacity-75 mr-1">Interest earned</span> <span>{interestEarned} USDT</span></p>
        <p><span className="opacity-75 mr-1">Period</span> <span>{period}</span></p>
        <p><span className="opacity-75 mr-1">Finalized</span> <span>{finalized}</span></p>
        <p><span className="opacity-75 mr-1">Group Id</span> <span>{groupId}</span></p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p>{name}</p>
        <p>{amount}</p>
        <button className="border border-primary-200 rounded-lg py-1 px-3">View Group</button>
      </div>
    </div>
  )
}
