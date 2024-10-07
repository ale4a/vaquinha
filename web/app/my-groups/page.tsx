'use client';
import TabsComponent from '@/components/global/TabsComponent/TabsComponent';
import React from 'react';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Concluded', value: 'concluded' },
  { label: 'Eliminated', value: 'eliminated' },
];

const page = () => {
  return (
    <div>
      <TabsComponent tabs={tabs} />
    </div>
  );
};

export default page;
