'use client';

import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import ErrorView from '@/components/global/Error/ErrorView';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import SummaryAction from '@/components/global/SummaryAction/SummaryAction';
import { GroupSummary } from '@/components/group/GroupSummary/GroupSummary';
import Message from '@/components/message/Message';
import BuildingStatus from '@/components/status/BuildingStatus';
import { getPaymentsTable } from '@/helpers';
import { useGroup, useVaquinhaDeposit } from '@/hooks';
import { useVaquinhaWithdrawal } from '@/hooks/web3/useVaquinhaWithdrawal';
import { GroupResponseDTO, GroupStatus, LogLevel } from '@/types';
import { showAlertWithConfirmation } from '@/utils/commons';
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
  const { depositCollateral } = useVaquinhaDeposit();
  const {
    withdrawalEarnedRound,
    withdrawalEarnedInterest,
    withdrawalCollateral,
  } = useVaquinhaWithdrawal();
  const {
    depositGroupCollateral,
    withdrawalGroupCollateral,
    withdrawalGroupEarnedInterest,
    withdrawalGroupEarnedRound,
  } = useGroup();
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

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!data) {
    return <LoadingSpinner />;
  }
  if (!publicKey) {
    return <ErrorView />;
  }

  const group = data.content;
  const isActive = group.status === GroupStatus.ACTIVE;
  const step1 = !!group.myDeposits[0]?.successfullyDeposited;
  const step2 = step1 && group.slots === 0;
  const step3 = step1 && step2 && isActive;

  const handleDepositCollateral = async () => {
    setIsLoading(true);
    try {
      const amount = group.collateralAmount;
      const { tx, error, success } = await depositCollateral(group, amount);
      if (!success) {
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      await depositGroupCollateral(group.id, publicKey, tx, amount);
      await refetch();
    } catch (error) {
      logError(LogLevel.INFO)(error);
    }
    setIsLoading(false);
  };

  const handleWithdrawEarnedRound = async () => {
    setIsLoading(true);
    try {
      const amount = group.amount;
      const { tx, error, success } = await withdrawalEarnedRound(group, amount);
      if (!success) {
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      await withdrawalGroupEarnedRound(group.id, publicKey, tx, amount);
      await refetch();
    } catch (error) {
      logError(LogLevel.INFO)(error);
    }
    setIsLoading(false);
  };

  const handleWithdrawEarnedInterest = async () => {
    setIsLoading(true);
    try {
      const amount = 0;
      const { tx, error, success } = await withdrawalEarnedInterest(
        group,
        amount
      );
      if (!success) {
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      await withdrawalGroupEarnedInterest(group.id, publicKey, tx, amount);
      await refetch();
    } catch (error) {
      logError(LogLevel.INFO)(error);
    }
    setIsLoading(false);
  };

  const handleWithdrawCollateral = async () => {
    setIsLoading(true);
    try {
      const amount = group.collateralAmount;
      const { tx, error, success } = await withdrawalCollateral(group, amount);
      if (!success) {
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      await withdrawalGroupCollateral(group.id, publicKey, tx, group.amount);
      await refetch();
    } catch (error) {
      logError(LogLevel.INFO)(error);
    }
    setIsLoading(false);
  };

  const handleNavigateToPayments = () => {
    router.push(`/groups/${groupId}/payments`);
  };

  const { items, firstUnpaidItemIndex } = getPaymentsTable(group);

  const totalPayments = Object.values(group.myDeposits).reduce(
    (sum, deposit) =>
      sum + (deposit.successfullyDeposited && deposit.round > 0 ? 1 : 0),
    0
  );
  const allPaymentsDone = totalPayments === group.totalMembers - 1;

  return (
    <>
      <TabTitleHeader text="Group Information" />
      {loading && <LoadingSpinner />}
      {!loading && data && (
        <div className="flex flex-col gap-2">
          {data && <GroupSummary {...group} />}
          {!isActive && (
            <BuildingStatus
              value1={step1}
              label1={step1 ? 'Collateral Deposited' : 'Deposit Collateral'}
              value2={step2}
              label2={
                group.slots
                  ? `Pending members ${group.totalMembers - group.slots} of ${
                      group.totalMembers
                    }`
                  : `Completed members (${group.totalMembers})`
              }
              value3={step3}
              label3="Waiting for starting date"
            />
          )}
          {isActive && (
            <>
              <SummaryAction
                title="Payments"
                content={
                  allPaymentsDone ? (
                    <p className="text-success-green">All rounds are paid</p>
                  ) : (
                    <>
                      <p>
                        Paid {totalPayments} of {group.totalMembers - 1}
                      </p>
                      <p>
                        Payment Deadline:{' '}
                        {new Date(
                          items[firstUnpaidItemIndex]
                            ?.paymentDeadlineTimestamp || 0
                        ).toDateString()}
                      </p>
                    </>
                  )
                }
                actionLabel={allPaymentsDone ? 'View' : 'Pay'}
                type={allPaymentsDone ? 'info' : 'primary'}
                onAction={handleNavigateToPayments}
              />
              <SummaryAction
                title="Round earned"
                content={
                  <>
                    <p>Current position: {group.currentPosition}</p>
                    <p>Your Position: {group.myPosition}</p>
                  </>
                }
                actionLabel="Withdraw"
                type={
                  group.myPosition <= group.currentPosition
                    ? 'info'
                    : 'disabled'
                }
                onAction={handleWithdrawEarnedRound}
              />
              <SummaryAction
                title="Intersed earned"
                content={<p>1.5 USDC 6%</p>}
                actionLabel="Withdraw"
                type="info"
                onAction={handleWithdrawEarnedInterest}
              />
              <SummaryAction
                title="Claim Collateral"
                content={<p>300 USDC</p>}
                actionLabel="Withdraw"
                type="info"
                onAction={() => {
                  if (group.status === GroupStatus.ACTIVE) {
                    showAlertWithConfirmation(
                      'Do you want to Pay?',
                      'Testing',
                      'info',
                      handleWithdrawCollateral,
                      'Pay Now Test'
                    );
                  }
                  if (group.status === GroupStatus.CONCLUDED) {
                    void handleWithdrawCollateral();
                  }
                }}
              />
            </>
          )}
          <Message
            messageText={
              'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately'
            }
          />
          <div className="flex flex-col gap-5 justify-between mb-4">
            {!step1 && (
              <ButtonComponent
                label="Join And Deposit Collateral"
                type="primary"
                size="large"
                onClick={handleDepositCollateral}
              />
            )}
            <ButtonComponent
              label="Back"
              type="secondary"
              size="large"
              onClick={() => {
                window.history.back();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GroupDetailPage;
