'use client';
import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import SummaryAction from '@/components/global/SummaryAction/SummaryAction';
import { GroupSummary } from '@/components/group/GroupSummary/GroupSummary';
import Message from '@/components/message/Message';
import BuildingStatus from '@/components/status/BuildingStatus';
import { GroupResponseDTO, LogLevel } from '@/types';
import { logError } from '@/utils/log';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const GroupDetailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { groupId } = useParams();
  const { publicKey } = useWallet();
  const {
    isPending: isPendingData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    data,
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

  const step01 = !!data?.content?.collateralDeposited;
  const step02 = step01 && data.content.slots === 0;
  const step03 = step01 && step02 && data.content.isActive;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const depositCollateral = async () => {
    setIsLoading(true);
    const tx = '';
    const error = '';
    if (!tx) {
      try {
        await fetch(`/api/group/${groupId}/deposit-collateral`, {
          method: 'POST',
          body: JSON.stringify({
            customerPublicKey: publicKey,
          }),
        });
        await refetch();
      } catch (error) {
        logError(LogLevel.INFO)(error);
      }
    } else {
      logError(LogLevel.INFO)(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="h-20">
        <TabTitleHeader text="Group Information" />
      </div>
      {loading && <LoadingSpinner />}
      {!loading && data && (
        <div className="flex flex-col gap-2">
          {data && <GroupSummary {...data?.content} />}
          <SummaryAction
            title="Payments"
            content={<p>Payment Deadline: 14-10-2024</p>}
            actionLabel="Withdraw"
            onAction={() => {
              Swal.fire({
                title: 'Success!',
                backdrop: 'rgba(0, 0, 0, 0.6)',
                background: '#1D1F21',
                text: 'Do you want to continue',
                icon: 'success',
                confirmButtonText: 'Cool',
              });
            }}
          />

          {/* <Message
            messageText={
              'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately'
            }
          /> */}
          <div className="flex gap-5 justify-between">
            <ButtonComponent
              label="Back"
              type="secondary"
              size="large"
              onClick={() => {
                window.history.back();
              }}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GroupDetailPage;
