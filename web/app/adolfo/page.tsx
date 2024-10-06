import Summary from '@/components/Summary/Summary';
import React from 'react';

const page = () => {
  const itemsSummary = [
    {
      title: 'Crypto',
      result: 'USDT',
    },
    {
      title: 'Crypto',
      result: 'USDT',
    },
    {
      title: 'Crypto',
      result: 'USDT',
    },
  ];
  return (
    <div>
      <Summary itemsSummary={itemsSummary} />
    </div>
  );
};

export default page;
