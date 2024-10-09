'use client';
import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import Message from '@/components/message/Message';
import BuildingStatus from '@/components/status/BuildingStatus';
import Summary from '@/components/Summary/Summary';
import { itemsSummary } from '@/components/Summary/Summary.types';
// src/pages/groups/[idGroup].tsx
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const GroupDetailPage = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const step01 = false;
  const step02 = false;
  const step03 = false;

  const doNextStep = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 5500)); // Only for simulate the fetch
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh]">
        <div>
          <FaSpinner
            className="animate-spin text-primary-200 mx-auto"
            size={60}
          />
          <h3 className="text-2xl mt-4 mb-1 font-medium text-center">
            Joining the group...
          </h3>
          <p className="opacity-85 text-center">
            Saving today secures a better tomorrow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-20 ">
        <TabTitleHeader text="Group Information" />
      </div>
      <div>
        <Summary itemsSummary={itemsSummary} />
        <BuildingStatus value1={step01} value2={step02} value3={step03} />
        <Message
          messageText={
            'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately'
          }
        />
        <div className="flex gap-2 my-4">
          <ButtonComponent
            label="Back"
            type="secondary"
            size="large"
            onClick={() => {
              window.history.back();
            }}
          />
          <ButtonComponent
            label="Deposit Collateral"
            type="primary"
            size="large"
            onClick={doNextStep}
          />
        </div>
      </div>
    </>
  );
};

export default GroupDetailPage;
