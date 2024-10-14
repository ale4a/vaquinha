'use client';

import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import { GroupFiltersHead } from '@/components/group/GroupFiltersHead/GroupFiltersHead';
import { ListGroups } from '@/components/group/ListGroups/ListGroups';
import {
  GroupCrypto,
  GroupFilters,
  GroupPeriod,
  GroupResponseDTO,
} from '@/types';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const GroupPage = () => {
  const [filters, setFilters] = useState<GroupFilters>({
    period: GroupPeriod.ALL,
    orderBy: '+amount',
    crypto: GroupCrypto.USDC,
    amount: 0,
  });
  const { isPending, isLoading, isFetching, data } = useQuery<{
    contents: GroupResponseDTO[];
  }>({
    queryKey: ['groups', filters],
    queryFn: () =>
      fetch(
        `/api/group?orderBy=${encodeURIComponent(filters.orderBy)}${
          filters.period !== GroupPeriod.ALL ? `&period=${filters.period}` : ''
        }&crypto=${filters.crypto}${
          filters.amount ? `&amount=${filters.amount}` : ''
        }`
      ).then((res) => res.json()),
  });

  const loading = isPending || isLoading || isFetching;

  return (
    <>
      <MainTabsHeader />
      <GroupFiltersHead filters={filters} setFilters={setFilters} />
      <ListGroups groups={data?.contents || []} loading={loading} />
    </>
  );
};

export default GroupPage;
