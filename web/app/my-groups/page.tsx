'use client';

import Button from '@/components/global/ButtonComponent/ButtonComponent';
import GroupCard from '@/components/global/GroupCard/GroupCard';
import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import Tabs from '@/components/global/Tabs/TabsComponent';
import { GroupState } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

enum MyGroupsTab {
  ALL = 'all',
  PENDING = GroupState.PENDING,
  ACTIVE = GroupState.ACTIVE,
  CONCLUDED = GroupState.CONCLUDED,
  ELIMINATED = GroupState.ABANDONED,
}

const tabs = [
  { label: 'All', value: MyGroupsTab.ALL },
  { label: 'Pending', value: MyGroupsTab.PENDING },
  { label: 'Active', value: MyGroupsTab.ACTIVE },
  { label: 'Concluded', value: MyGroupsTab.CONCLUDED },
  { label: 'Eliminated', value: MyGroupsTab.ELIMINATED },
];

const LoadingCard = () => (
  <div className="border border-accent-100 shadow rounded-md p-4 w-full mx-auto my-4">
    <div className="animate-pulse flex space-x-4">
      {/*<div className="rounded-full bg-slate-200 h-10 w-10"></div>*/}
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || MyGroupsTab.ALL);

  const { isPending, isLoading, isFetching, data } = useQuery({
    queryKey: ['groups', currentTab],
    queryFn: () =>
      fetch(
        `/api/group${
          currentTab !== MyGroupsTab.ALL ? `?state=${currentTab}` : ''
        }`
      ).then((res) => res.json()),
  });

  const loading = isPending || isLoading || isFetching;

  return (
    <>
      <div className="h-20 ">
        <MainTabsHeader />
      </div>
      <Tabs tabs={tabs} onTabClick={setCurrentTab} currentTab={currentTab} />
      {!loading && data?.contents?.length > 0 && (
        <div
          className="rounded-full border-primary-200 border-2 absolute bottom-24 right-4"
          style={{ width: 80, height: 80 }}
          onClick={() => router.push('/my-groups/create')}
        >
          <FaPlus
            className="text-primary-200"
            style={{ width: 80, height: 80 }}
          />
        </div>
      )}
      {loading && (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      )}
      {!loading && data?.contents?.length === 0 && (
        <div className="flex flex-1 justify-center items-center flex-col">
          <div className="text-accent-100">There are no groups available.</div>
          {currentTab == MyGroupsTab.ALL && (
            <div className="flex gap-2 my-4">
              <Button
                label="Create Group"
                type="primary"
                size="large"
                onClick={() => router.push('/my-groups/create')}
              />
            </div>
          )}
        </div>
      )}
      {!loading &&
        data?.contents?.map(
          ({
            id,
            startIn,
            members,
            amount,
            crypto,
            name,
            period,
            state,
          }: any) => (
            <div key={id}>
              <GroupCard
                groupId={id}
                startIn={startIn}
                members={members}
                amount={amount}
                crypto={crypto}
                name={name}
                period={period}
                state={state}
              />
            </div>
          )
        )}
    </>
  );
};

const PageWithSuspense = <T extends string = string>() => (
  <Suspense fallback={<LoadingSpinner />}>
    <Page />
  </Suspense>
);

export default PageWithSuspense;
