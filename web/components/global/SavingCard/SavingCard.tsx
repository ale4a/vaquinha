'use client';
import Image from 'next/image';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import Link from 'next/link';

interface Props {
  name: string;
  amount: number;
  collateral: number;
  startIn: string;
  period: string;
  peopleCount: number;
  groupId: string;
}

export default function SavingCard({
  name,
  amount,
  collateral,
  startIn,
  period,
  peopleCount,
  groupId,
}: Props) {
  const handleViewDetails = (groupId: string) => {
    console.log(groupId);
  };

  return (
    <div className="flex justify-between bg-bg-100 p-1 pb-4 border-b-2 border-white/25">
      <div className="  w-2/3">
        <div>
          <h2 className="text-base font-medium">{name}</h2>
          <h3 className="text-2xl font-medium">{amount} USDC</h3>
          <p className="text-sm font-satoshi opacity-85">
            Collateral: {collateral} USDT
          </p>
          <p className="text-sm font-satoshi opacity-85">
            Start In: {startIn} (3 days)
          </p>
        </div>
      </div>
      <div className=" w-1/3 flex flex-col justify-between items-end">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <Image
              src="icons/PeopleIcon.svg"
              alt="people icon"
              height="15"
              width="15"
            />
            <p className="opacity-85">{peopleCount}/5</p>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src="icons/DateIcon.svg"
              alt="date icon"
              height="15"
              width="15"
            />
            <p className="opacity-85">{period}</p>
          </div>
        </div>
        <Link href={`/groups/${groupId}`} passHref className="w-full max-w-80">
          <ButtonComponent
            label={'Join Group'}
            type={'primary'}
            className="w-full"
            onClick={() => handleViewDetails(groupId)}
          />
        </Link>
      </div>
    </div>
  );
}
