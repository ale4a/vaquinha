'use client';

import Button from '@/components/global/ButtonComponent/ButtonComponent';
import ErrorView from '@/components/global/Error/ErrorView';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import GroupTablePayments from '@/components/group/GroupTablePayments/GroupTablePayments';
import { useVaquita } from '@/hooks';
import { GroupResponseDTO } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const PaymentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const { publicKey } = useWallet();
  const { getGroup } = useVaquita();
  const {
    isPending: isPendingData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    data,
    error,
    refetch,
  } = useQuery<{
    success: boolean;
    content: GroupResponseDTO | null;
    error: any;
  }>({
    enabled: !!publicKey,
    queryKey: ['group', publicKey],
    queryFn: () => getGroup(groupId as string),
  });

  const loading = isPendingData || isLoadingData || isFetchingData;

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!data) {
    return <LoadingSpinner />;
  }
  if (!publicKey) {
    return (
      <>
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <p className="text-accent-100">Please select a wallet</p>
        </div>
      </>
    );
  }

  if (!data.success || !data.content) {
    return <ErrorView />;
  }

  console.log({ data });

  return (
    <>
      <TabTitleHeader text="Group Information" />
      {loading && <LoadingSpinner />}
      {error && !loading && !data && <ErrorView />}
      {!loading && data && (
        <GroupTablePayments group={data?.content} refetch={refetch} />
      )}
      <div className="flex flex-col gap-5 my-5 justify-between">
        <Button
          label="Back"
          type="secondary"
          size="large"
          onClick={() => router.back()}
        />
      </div>
    </>
  );
};

export default PaymentsPage;
