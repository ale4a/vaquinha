'use client';
import SavingCard from '@/components/global/SavingCard/SavingCard';
import { useSavingData } from '@/components/global/SavingCard/useSavingData';
import TabsComponent from '@/components/global/TabsComponent/TabsComponent';
import React, { useState } from 'react';

const tabs = [
  { label: 'USDT', value: 'usdt' },
  { label: 'SOL', value: 'sol' },
];

const page = () => {
  const [currentTab, setCurrentTab] = useState('usdt');

  const { data: savingData, isLoading } = useSavingData(currentTab);

  const handleTabClick = (tabValue: string) => {
    setCurrentTab(tabValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex  justify-center w-full">
        <TabsComponent
          tabs={tabs}
          onTabClick={handleTabClick}
          currentTab={currentTab}
        />
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          savingData?.map((saving) => (
            <SavingCard key={saving.groupId} {...saving} />
          ))
        )}
      </div>
    </div>
  );
};

export default page;
