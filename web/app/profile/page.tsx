'use client';
import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import InfoCard from '@/components/global/InfoCard/InfoCard';
import React from 'react';

const page = () => {
  return (
    <>
      <div className="h-20 ">
        <MainTabsHeader />
      </div>
      <InfoCard
        address="5wd1xC1N...ReA122N"
        savedAmount={9_823_21}
        growth="+92.34 (1D)"
      />
    </>
  );
};

export default page;
