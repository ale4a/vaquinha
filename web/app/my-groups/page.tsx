'use client';
import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import TabsComponent from '@/components/global/TabsComponent/TabsComponent';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Concluded', value: 'concluded' },
  { label: 'Eliminated', value: 'eliminated' },
];

const groups = []; // Este es el array que estamos verificando

const Page = () => {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false)
  const doNextStep = async () => {
    
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 5500)) // Only for simulate the fetch
      router.push('/my-groups/create');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }
  const [currentTab, setCurrentTab] = useState('all');

  const handleTabClick = (tabValue: string) => {
    setCurrentTab(tabValue);
  };
  return (
    <div className="flex flex-col justify-center">
      <TabsComponent
        tabs={tabs}
        onTabClick={handleTabClick}
        currentTab={currentTab}
      />
      {groups.length === 0 && (
        <div className="h-[65vh] flex justify-center items-center flex-col">
          <div className=''>There are no groups available.</div>
          <div className='flex gap-2 my-4'>
          <ButtonComponent label='Create Group' type='primary' size='large' onClick={doNextStep} />
      </div>
        </div>
        
      )}
    </div>
  );
};

export default Page;
