import { Props } from './DetailsCard.types';

export default function DetailsCard({ detail }: Props) {
  return (
    <div className="flex justify-between border rounded-xl p-2 text-sm">
      <div>
        <p>
          <span className="opacity-75 mr-1">Group Id</span>{' '}
          <span>{detail.groupId}</span>
        </p>
        <p>
          <span className="opacity-75 mr-1">Member</span>{' '}
          <span>{detail.members} members</span>
        </p>
        <p>
          <span className="opacity-75 mr-1">Interest earned</span>{' '}
          <span>{detail.interestEarned} USDT</span>
        </p>
        <p>
          <span className="opacity-75 mr-1">Period</span>{' '}
          <span>{detail.period}</span>
        </p>
        <p>
          <span className="opacity-75 mr-1">Finalized</span>{' '}
          <span>{detail.finalized}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p>{detail.name}</p>
        <p>{detail.amount}</p>
        <button className="border border-primary-200 rounded-lg py-1 px-3">
          View Group
        </button>
      </div>
    </div>
  );
}
