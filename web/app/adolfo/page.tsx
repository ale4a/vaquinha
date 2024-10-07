import Summary from '@/components/Summary/Summary';
import SummaryFooter from '@/components/SummaryFooter/SummaryFooter';
import React from 'react';

const page = () => {
  const itemsSummary = [
    {
      title: 'Crypto',
      result: 'USDT',
    },
    {
      title: 'Group name',
      result: 'Pasanaku',
    },
    {
      title: 'Amount',
      result: '68 USDT',
    },
    {
      title: 'Collateral',
      result: '341 USDT',
    },
    {
      title: 'Members',
      result: '3/5',
    },
    {
      title: 'Payment period',
      result: 'Monthly',
    },
    {
      title: 'Start In',
      result: '10-10-2024 (3 days)',
    },
  ];

  const itemsSummaryFooter = [
    {
      title: 'Total Saved',
      result: '341 USDT',
    },
    {
      title: 'Interest earned',
      result: '21.28 USDT (8%)',
    },
    {
      title: 'withdraw collateral',
      result: '341 USDT',
    },
  ];
  return (
    <div>
      <Summary itemsSummary={itemsSummary} />
      <SummaryFooter itemsSummary={itemsSummaryFooter}/>
    </div>
  );
};

export default page;
