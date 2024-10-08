'use client';
import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import Message from '@/components/message/Message';
import BuildingStatus from '@/components/status/BuildingStatus';
import Summary from '@/components/Summary/Summary';
import { itemsSummary } from '@/components/Summary/Summary.types';
// src/pages/groups/[idGroup].tsx
import { usePathname } from 'next/navigation';
import React from 'react';

const GroupDetailPage = () => {
  const pathname = usePathname();    

  return (
    <div>
      <h1>Group Detail: {pathname}</h1>
      <Summary itemsSummary={itemsSummary} />
      <BuildingStatus value1={true} value2={false} value3={false} />
      <Message messageText={'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately'} />
      <div className='flex gap-2'>
        <ButtonComponent label='Back' type='secondary' size='large' onClick={() => {
          window.history.back()
        }} />
        <ButtonComponent label='Deposit Collateral' type='primary' size='large' />
      </div>
    </div>
  );
};

export default GroupDetailPage;
