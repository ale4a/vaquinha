'use client';

import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import { GroupFiltersHead } from '@/components/group/GroupFiltersHead/GroupFiltersHead';
import { ListGroups } from '@/components/group/ListGroups/ListGroups';
import { REFETCH_INTERVAL } from '@/config/constants';
import { useVaquita } from '@/hooks';
import { groupManagementBackend } from '@/lib/icp-backend';
import { GroupCrypto, GroupFilters, GroupPeriodFilter } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const GroupPage = () => {
  const [filters, setFilters] = useState<GroupFilters>({
    period: GroupPeriodFilter.ALL,
    orderBy: '+amount',
    crypto: GroupCrypto.USDC,
    amount: 0,
  });
  const { listGroups } = useVaquita();
  const { isPending, isLoading, data } = useQuery({
    refetchInterval: REFETCH_INTERVAL,
    queryKey: ['groups', filters],
    queryFn: () =>
      listGroups({
        publicKey: null,
        crypto: filters.crypto,
        orderBy: filters.orderBy,
        amount: filters.amount,
        period: filters.period,
      }),
  });

  const loading = isPending || isLoading; // || isFetching;
  const groups = data?.contents || [];
  console.log({ groups, groupManagementBackend });

  return (
    <>
      <MainTabsHeader />
      <GroupFiltersHead filters={filters} setFilters={setFilters} />
      <ListGroups groups={groups} loading={loading} />
    </>
  );
};

export default GroupPage;
