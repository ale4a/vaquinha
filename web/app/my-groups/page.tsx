'use client';
import TabsComponent from '@/components/global/TabsComponent/TabsComponent';
import React, { useState } from 'react';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Concluded', value: 'concluded' },
  { label: 'Eliminated', value: 'eliminated' },
];

const page = () => {
  const [currentTab, setCurrentTab] = useState('all');

  const handleTabClick = (tabValue: string) => {
    setCurrentTab(tabValue);
  };
  return (
    <div className="flex justify-center">
      <TabsComponent
        tabs={tabs}
        onTabClick={handleTabClick}
        currentTab={currentTab}
      />
    </div>
  );
};

export default page;
