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
  const { depositCollateralAndJoin } = useVaquinhaDeposit();
  const {
    withdrawalEarnedRound,
    withdrawalEarnedInterest,
    withdrawalCollateral,
  } = useVaquinhaWithdrawal();
  const {
    joinGroup,
    disjoinGroup,
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
  const isConcluded = group.status === GroupStatus.CONCLUDED;
  const step1 = !!group.myDeposits[0]?.successfullyDeposited;
  const step2 = step1 && group.slots === 0;
  const step3 = step1 && step2 && isActive;

  const handleDepositCollateral = async () => {
    setIsLoading(true);
    try {
      const joinedGroup = await joinGroup(group.id, publicKey);
      const amount = joinedGroup.collateralAmount;
      console.log({ joinedGroup });
      const { tx, error, success } = await depositCollateralAndJoin(
        joinedGroup
      );
      if (!success) {
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      await depositGroupCollateral(joinedGroup.id, publicKey, tx, amount);
      await refetch();
    } catch (error) {
      await disjoinGroup(group.id, publicKey);
      logError(LogLevel.INFO)(error);
    }
    setIsLoading(false);
  };

  const handleWithdrawEarnedRound = async () => {
    setIsLoading(true);
    try {
      const amount = group.amount;
      const { tx, error, success } = await withdrawalEarnedRound(group);
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
      const { tx, error, success } = await withdrawalCollateral(group);
      if (!success) {
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      const amount = group.collateralAmount;
      await withdrawalGroupCollateral(group.id, publicKey, tx, amount);
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
          {!isActive && !isConcluded && group.slots > 0 && (
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
          {(isActive || isConcluded) && (
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
                actionLabel={
                  group.myWithdrawals.round.successfullyWithdrawn
                    ? 'Withdrawn'
                    : 'Withdraw'
                }
                type={
                  group.myPosition <= group.currentPosition &&
                  !group.myWithdrawals.round.successfullyWithdrawn
                    ? 'info'
                    : 'disabled'
                }
                onAction={
                  group.myPosition <= group.currentPosition &&
                  !group.myWithdrawals.round.successfullyWithdrawn
                    ? handleWithdrawEarnedRound
                    : undefined
                }
              />
              <SummaryAction
                title="Intersed earned"
                content={<p>1.5 USDC 6%</p>}
                actionLabel={
                  group.myWithdrawals.interest.successfullyWithdrawn
                    ? 'Withdrawn'
                    : 'Withdraw'
                }
                type={
                  group.status === GroupStatus.CONCLUDED &&
                  !group.myWithdrawals.interest.successfullyWithdrawn
                    ? 'info'
                    : 'disabled'
                }
                onAction={
                  group.status === GroupStatus.CONCLUDED &&
                  !group.myWithdrawals.interest.successfullyWithdrawn
                    ? handleWithdrawEarnedInterest
                    : undefined
                }
              />
              <SummaryAction
                title="Claim Collateral"
                content={<p>300 USDC</p>}
                actionLabel="Withdraw"
                type={
                  group.status === GroupStatus.CONCLUDED &&
                  !group.myWithdrawals.collateral.successfullyWithdrawn
                    ? 'info'
                    : 'disabled'
                }
                onAction={() => {
                  // if (group.status === GroupStatus.ACTIVE) {
                  //   showAlertWithConfirmation(
                  //     'Do you want to Pay?',
                  //     'Testing',
                  //     'info',
                  //     handleWithdrawCollateral,
                  //     'Pay Now Test'
                  //   );
                  // }
                  if (group.status === GroupStatus.CONCLUDED) {
                    void handleWithdrawCollateral();
                  } else {
                    showAlert(
                      'Ups',
                      'The collateral cannot be withdrawn if the Vaquinha has not finished yet',
                      'info',
                      'Understood'
                    );
                  }
                }}
              />
            </>
          )}
          {group.status === GroupStatus.PENDING &&
            !step1 &&
            group.slots > 0 && (
              <Message
                messageText={
                  'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately.'
                }
              />
            )}
          {group.status === GroupStatus.PENDING && step1 && !step2 && (
            <Message
              messageText={
                "We are waiting for the group to be fully filled by the specified date. If the group isn't complete by then, the collateral you deposited will be returned."
              }
            />
          )}
          {group.status === GroupStatus.PENDING && step1 && step2 && !step3 && (
            <Message
              messageText={
                "The group is all set! We're just waiting for the start date to kick things off."
              }
            />
          )}
          <div className="flex flex-col gap-5 justify-between mb-4">
            {!step1 && !!group.slots && (
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
