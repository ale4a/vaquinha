'use client';

import ErrorView from '@/components/global/Error/ErrorView';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import GroupTablePayments from '@/components/group/GroupTablePayments/GroupTablePayments';
import { GroupTablePaymentItem } from '@/components/group/GroupTablePayments/GroupTablePayments.types';
import { GroupPeriod, GroupResponseDTO } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { addMonths, addWeeks } from 'date-fns';
import { useParams } from 'next/navigation';
import React from 'react';

const PaymentsPage = () => {
  const { groupId } = useParams();
  const { publicKey } = useWallet();
  const {
    isPending: isPendingData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    data,
    error,
    refetch,
  } = useQuery<{
    content: GroupResponseDTO;
  }>({
    enabled: !!publicKey,
    queryKey: ['group', publicKey],
    queryFn: () =>
      fetch(`/api/group/${groupId}?customerPublicKey=${publicKey}`).then(
        (res) => res.json()
      ),
  });

  const loading = isPendingData || isLoadingData || isFetchingData;

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!data) {
    return <LoadingSpinner />;
  }
  if (!publicKey) {
    return <ErrorView />;
  }

  const items: GroupTablePaymentItem[] = [];
  let startDate = new Date(data?.content?.startsOnTimestamp || 0);
  let firstPay = true;
  for (let i = 0; i < (data?.content?.totalMembers || 0); i++) {
    if (data?.content?.period === GroupPeriod.MONTHLY) {
      startDate = addMonths(startDate, 1);
    } else {
      startDate = addWeeks(startDate, 1);
    }
    const round = i + 1;

    items.push({
      round,
      amount: data?.content?.amount || 0,
      paymentDeadlineTimestamp: startDate.getTime(),
      status: data?.content?.myDeposits[round]?.paid
        ? 'Paid'
        : firstPay
        ? 'Pay'
        : 'Pending',
    });
    if (!data?.content?.myDeposits[round]?.paid) {
      firstPay = false;
    }
  }

  return (
    <>
      <TabTitleHeader text="Group Information" />
      {loading && <LoadingSpinner />}
      {error && !loading && !data && <ErrorView />}
      {!loading && data && (
        <GroupTablePayments
          items={items}
          group={data?.content}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default PaymentsPage;
