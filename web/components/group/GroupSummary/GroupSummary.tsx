import Summary from '@/components/Summary/Summary';
import { GroupCrypto } from '@/types';
import { getRelativeTime } from '@/utils/time';
import React from 'react';

export const GroupSummary = ({
  crypto,
  name,
  amount,
  totalMembers,
  period,
  startsOnTimestamp,
}: {
  crypto: GroupCrypto;
  name: string;
  amount: number;
  totalMembers: number;
  period: string;
  startsOnTimestamp: number;
}) => {
  const startsIn = startsOnTimestamp - Date.now();

  return (
    <Summary
      itemsSummary={[
        {
          title: 'Crypto',
          result: crypto,
        },
        {
          title: 'Group name',
          result: name,
        },
        {
          title: 'Amount',
          result: amount,
        },
        {
          title: 'Collateral',
          result: amount * totalMembers,
        },
        {
          title: 'Members',
          result: totalMembers,
        },
        {
          title: 'Payment period',
          result: period,
        },
        {
          title: 'Starts In',
          result: getRelativeTime(startsIn),
        },
      ]}
    />
  );
};
