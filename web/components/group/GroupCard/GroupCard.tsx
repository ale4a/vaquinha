'use client';

import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import { GroupCrypto, GroupStatus } from '@/types';
import { getRelativeTime } from '@/utils/time';
import Link from 'next/link';

interface Props {
  groupId: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  members: number;
  period: 'monthly' | 'weekly';
  startsOnTimestamp: number;
  status: GroupStatus;
}

export default function GroupCard({
  name,
  amount,
  startsOnTimestamp,
  period,
  members,
  groupId,
  crypto,
}: Props) {
  const handleViewDetails = (groupId: string) => {
    console.log(groupId);
  };

  return (
    <div className="flex justify-between bg-bg-100 py-4 px-2 border-b-2 border-white/25">
      <div>
        <p>
          <span className="text-accent-300">Collateral</span>&nbsp;
          <span className="text-accent-200">
            {amount * members} {crypto}
          </span>
        </p>
        <p>
          <span className="text-accent-300">Member</span>&nbsp;
          <span className="text-accent-200">
            {members} {members === 1 ? 'member' : 'members'}
          </span>
        </p>
        <p>
          <span className="text-accent-300">Period</span>&nbsp;
          <span className="text-accent-200">{period}</span>
        </p>
        <p>
          <span className="text-accent-300">Starts</span>&nbsp;
          <span className="text-accent-200">
            {getRelativeTime(startsOnTimestamp - Date.now())}
          </span>
        </p>
        <p>
          <span className="text-accent-300">Group id</span>&nbsp;
          <span className="text-accent-200">{groupId}</span>
        </p>
      </div>
      <div className="flex flex-col justify-evenly items-end">
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
