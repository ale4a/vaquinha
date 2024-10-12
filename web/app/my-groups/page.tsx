'use client';

import Button from '@/components/global/ButtonComponent/ButtonComponent';
import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import Tabs from '@/components/global/Tabs/TabsComponent';
import GroupCard from '@/components/group/GroupCard/GroupCard';
import { GroupResponseDTO, GroupStatus } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

enum MyGroupsTab {
  ALL_FAKE = 'all-fake',
  ALL = 'all',
  PENDING = GroupStatus.PENDING,
  ACTIVE = GroupStatus.ACTIVE,
  CONCLUDED = GroupStatus.CONCLUDED,
  ELIMINATED = GroupStatus.ABANDONED,
}

const tabs = [
  { label: 'All FAKE', value: MyGroupsTab.ALL_FAKE },
  { label: 'All', value: MyGroupsTab.ALL },
  { label: 'Pending', value: MyGroupsTab.PENDING },
  { label: 'Active', value: MyGroupsTab.ACTIVE },
  { label: 'Concluded', value: MyGroupsTab.CONCLUDED },
  { label: 'Eliminated', value: MyGroupsTab.ELIMINATED },
];

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || MyGroupsTab.ALL);
  const { publicKey } = useWallet();
  const { isPending, isLoading, isFetching, data } = useQuery<{
    contents: GroupResponseDTO[];
  }>({
    enabled: !!publicKey,
    queryKey: ['groups', currentTab, publicKey],
    queryFn: () =>
      fetch(
        currentTab === MyGroupsTab.ALL_FAKE
          ? '/api/group'
          : `/api/group?customerPublicKey=${publicKey}${
              currentTab !== MyGroupsTab.ALL ? `&status=${currentTab}` : ''
            }`
      ).then((res) => res.json()),
  });

  if (!publicKey) {
    return (
      <>
        <div className="h-20 ">
          <MainTabsHeader />
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <p className="text-accent-100">Please select a valid wallet</p>
        </div>
      </>
    );
  }

  const loading = isPending || isLoading || isFetching;

  return (
    <>
      <div className="h-20 ">
        <MainTabsHeader />
      </div>
      <Tabs tabs={tabs} onTabClick={setCurrentTab} currentTab={currentTab} />
      {!loading && (data?.contents?.length || 0) > 0 && (
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
      {loading && <LoadingSpinner />}
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
      <div className="flex flex-1 flex-col overflow-x-auto">
        {!loading &&
          data?.contents?.map(
            ({
              id,
              startsOnTimestamp,
              members,
              amount,
              crypto,
              name,
              period,
              status,
            }) => (
              <div key={id}>
                <GroupCard
                  groupId={id}
                  startsOnTimestamp={startsOnTimestamp}
                  members={Object.keys(members).length}
                  amount={amount}
                  crypto={crypto}
                  name={name}
                  period={period}
                  status={status}
                />
              </div>
            )
          )}
      </div>
    </>
  );
};

const PageWithSuspense = <T extends string = string>() => (
  <Suspense fallback={<LoadingSpinner />}>
    <Page />
  </Suspense>
);

export default PageWithSuspense;
