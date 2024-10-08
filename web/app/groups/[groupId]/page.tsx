'use client';
import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import Message from '@/components/message/Message';
import BuildingStatus from '@/components/status/BuildingStatus';
import Summary from '@/components/Summary/Summary';
import { itemsSummary } from '@/components/Summary/Summary.types';
// src/pages/groups/[idGroup].tsx
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const GroupDetailPage = () => {
  const pathname = usePathname();    
  const [isLoading, setIsLoading] = useState(false)

  const doNextStep = async () => {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500)) // Only for simulate the fetch
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>Group Detail: {pathname}</h1>
      <Summary itemsSummary={itemsSummary} />
      <BuildingStatus value1={false} value2={false} value3={false} />
      <Message messageText={'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately'} />
      <div className='flex gap-2'>
        <ButtonComponent label='Back' type='secondary' size='large' onClick={() => {
          window.history.back()
        }} />
        <ButtonComponent label='Deposit Collateral' type='primary' size='large' onClick={doNextStep} />
      </div>
    </div>
  );
};

export default GroupDetailPage;
