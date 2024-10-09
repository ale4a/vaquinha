'use client';
import { GroupCrypto, GroupState } from '@/store';
import Link from 'next/link';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

interface Props {
  groupId: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  members: number;
  period: 'monthly' | 'weekly';
  startIn: number;
  state: GroupState;
}

export default function GroupCard({
  name,
  amount,
  startIn,
  period,
  members,
  groupId,
  crypto,
}: Props) {
  const handleViewDetails = (groupId: string) => {
    console.log(groupId);
  };

  return (
    <div className="flex justify-between bg-bg-100 p-1 pb-4 border-b-2 border-white/25">
      <div>
        <p className="text-sm font-satoshi">
          <span className="text-accent-300">Collateral</span>&nbsp;
          <span className="text-accent-200">
            {amount * members} {crypto}
          </span>
        </p>
        <p className="text-sm font-satoshi">
          <span className="text-accent-300">Member</span>&nbsp;
          <span className="text-accent-200">
            {members} {members === 1 ? 'member' : 'members'}
          </span>
        </p>
        <p className="text-sm font-satoshi">
          <span className="text-accent-300">Period</span>&nbsp;
          <span className="text-accent-200">{period}</span>
        </p>
        <p className="text-sm font-satoshi">
          <span className="text-accent-300">Start in</span>&nbsp;
          <span className="text-accent-200">
            {startIn / 86400000} {startIn / 86400000 === 1 ? 'day' : 'days'}
          </span>
        </p>
        <p className="text-sm font-satoshi">
          <span className="text-accent-300">Group id</span>&nbsp;
          <span className="text-accent-200">{groupId}</span>
        </p>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <p className="text-accent-100">{name}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-accent-100">
              {amount} {crypto}
            </p>
          </div>
        </div>
        <Link href={`/groups/${groupId}`} passHref>
          <ButtonComponent
            label="View Group"
            type="outline-primary"
            onClick={() => handleViewDetails(groupId)}
          />
        </Link>
      </div>
    </div>
  );
}
