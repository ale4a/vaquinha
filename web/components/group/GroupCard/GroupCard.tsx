'use client';

import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import { GroupCrypto, GroupStatus } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  groupId: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  totalMembers: number;
  slots: number;
  period: 'monthly' | 'weekly' | 'all';
  startsOnTimestamp: number;
  status: GroupStatus;
}

export default function GroupCard({
  name,
  amount,
  startsOnTimestamp,
  period,
  totalMembers,
  slots,
  groupId,
  crypto,
  status,
}: Props) {
  const handleViewDetails = (groupId: string) => {
    console.log(groupId);
  };

  return (
    <div className="flex justify-between bg-bg-200 px-5 pt-4 pb-6 rounded-lg">
      <div className="w-2/3">
        <p className="text-primary-200 text-xl">{name}</p>
        <p className="text-accent-100 text-2xl">
          {amount} <span className="text-lg">{crypto}</span>
        </p>
        <p className="flex">
          <span className="text-accent-200 mr-1">{period}</span>
          <Image
            src="/icons/date-active.svg"
            alt="members"
            width={12}
            height={12}
          />
        </p>
      </div>
      <div className="flex flex-col justify-center items-end w-1/3 gap-1">
        <div className="flex items-center gap-1">
          <p className="text-accent-100">
            {totalMembers - slots} / {totalMembers}
          </p>
          <Image
            src="/icons/person-active.svg"
            alt="members"
            width={14}
            height={14}
          />
        </div>
        {status !== GroupStatus.ACTIVE && (
          <div className="flex items-center gap-1 text-sm">
            {/* <p className="text-accent-100">
              {getRelativeTime(startsOnTimestamp - Date.now())}
            </p> */}
          </div>
        )}
        <Link
          href={`/groups/${groupId}?myGroups=true`}
          passHref
          style={{ display: 'contents' }}
        >
          <ButtonComponent
            label="View"
            type="outline-primary"
            onClick={() => handleViewDetails(groupId)}
            className="w-full"
          />
        </Link>
      </div>
    </div>
  );
}
