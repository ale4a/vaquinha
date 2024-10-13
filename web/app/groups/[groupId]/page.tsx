'use client';
import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import SummaryAction from '@/components/global/SummaryAction/SummaryAction';
import { GroupSummary } from '@/components/group/GroupSummary/GroupSummary';
import Message from '@/components/message/Message';
import BuildingStatus from '@/components/status/BuildingStatus';
import {
  GroupDepositDTO,
  GroupResponseDTO,
  GroupStatus,
  LogLevel,
} from '@/types';
import { showAlert } from '@/utils/commons';
import { logError } from '@/utils/log';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const GroupDetailPage = () => {
  const router = useRouter();
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

  const isActive = data?.content?.status === GroupStatus.ACTIVE;
  const step1 = !!data?.content?.myDeposits[0]?.paid;
  const step2 = step1 && data.content.slots === 0;
  const step3 = step1 && step2 && isActive;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const depositCollateral = async () => {
    setIsLoading(true);
    // TODO: INTEGRATE WEB3
    const tx = 'test';
    const error = '';
    if (tx && publicKey) {
      try {
        const payload: GroupDepositDTO = {
          customerPublicKey: publicKey.toBase58(),
          transactionSignature: tx,
          round: 0,
          amount: data?.content.collateral || 0,
        };
        await fetch(`/api/group/${groupId}/deposit`, {
          method: 'POST',
          body: JSON.stringify(payload),
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

  const handleNavigateToPayments = () => {
    router.push(`/groups/${groupId}/payments`);
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
          {!isActive && (
            <BuildingStatus
              value1={step1}
              label1="Collateral Deposited"
              value2={step2}
              label2={`Pending members ${
                data.content.totalMembers - data.content.slots
              } / ${data.content.totalMembers}`}
              value3={step3}
              label3="Active Group"
            />
          )}
          {isActive && (
            <>
              <SummaryAction
                title="Payments"
                content={
                  <>
                    <p>Paid of 2/9</p>
                    <p>Payment Deadline: 14-10-2024</p>
                  </>
                }
                actionLabel="Paid"
                type="primary"
                onAction={handleNavigateToPayments}
              />
              <SummaryAction
                title="Round earned"
                content={
                  <>
                    <p>Current Position: 1</p>
                    <p>Your position: 3</p>
                  </>
                }
                actionLabel="Withdraw"
                type="info"
                onAction={() => {
                  showAlert(
                    'Success!',
                    'Do you want to continue?',
                    'success',
                    'Cool'
                  );
                }}
              />
              <SummaryAction
                title="Intersed earned"
                content={<p>1.5 USDC 6%</p>}
                actionLabel="Withdraw"
                type="info"
                onAction={() => {
                  showAlert(
                    'Success!',
                    'Do you want to continue?',
                    'success',
                    'Cool'
                  );
                }}
              />
              <SummaryAction
                title="Claim Collateral"
                content={<p>300 USDC</p>}
                actionLabel="Withdraw"
                type="info"
                onAction={() => {
                  showAlert(
                    'Success!',
                    'Do you want to continue?',
                    'success',
                    'Cool'
                  );
                }}
              />
            </>
          )}
          <Message
            messageText={
              'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately'
            }
          />
          <div className="flex gap-5 justify-between mb-4">
            <ButtonComponent
              label="Back"
              type="secondary"
              size="large"
              onClick={() => {
                window.history.back();
              }}
              className="flex-1"
            />
            {!step1 && (
              <ButtonComponent
                label="Deposit Collateral"
                type="primary"
                size="large"
                onClick={depositCollateral}
                className="flex-1"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GroupDetailPage;
