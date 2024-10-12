'use client';
import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import { ListGroups } from '@/components/group/ListGroups/ListGroups';
import { GroupResponseDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const GroupPage = () => {
  const { isPending, isLoading, isFetching, data } = useQuery<{
    contents: GroupResponseDTO[];
  }>({
    queryKey: ['groups'],
    queryFn: () => fetch(`/api/group?filters=134`).then((res) => res.json()),
  });

  const loading = isPending || isLoading || isFetching;

  return (
    <>
      <MainTabsHeader />
      <ListGroups groups={data?.contents || []} loading={loading} />
    </>
  );
};

export default GroupPage;
