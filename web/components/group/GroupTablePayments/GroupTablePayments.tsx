import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import ErrorView from '@/components/global/Error/ErrorView';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import { useGroup, useVaquinhaDeposit } from '@/hooks';
import { LogLevel } from '@/types';
import { logError } from '@/utils/log';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import { GroupTablePaymentsProps } from './GroupTablePayments.types';

export default function GroupTablePayments({
  items,
  group,
  refetch,
}: GroupTablePaymentsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();
  const { depositRoundPayment } = useVaquinhaDeposit();
  const { depositGroupPayment } = useGroup();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!publicKey) {
    return <ErrorView />;
  }

  const getStatusType = (status: string): string => {
    switch (status) {
      case 'Pay':
        return 'success';
      case 'Pending':
        return 'muted';
      default:
        return 'disabled';
    }
  };

  const handleClick = async (round: number) => {
    setIsLoading(true);
    try {
      const { tx, error, success } = await depositRoundPayment(
        group.id,
        group.amount,
        group.totalMembers,
        group.period
      );
      if (!success) {
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      await depositGroupPayment(
        group.id,
        publicKey,
        tx,
        round,
        group.collateralAmount
      );
      await refetch();
    } catch (error) {
      logError(LogLevel.INFO)(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr_2fr_2fr] py-4 px-1 text-sm font-semibold gap-2 text-accent-100">
        <span className="pl-1">Nro</span>
        <span>Amount</span>
        <span>Payment Deadline</span>
        <span>Status</span>
      </div>
      {items.map(({ round, amount, paymentDeadlineTimestamp, status }, i) => {
        return (
          <div
            className="grid grid-cols-[1fr_2fr_2fr_2fr] py-4 px-1 text-sm gap-2 bg-bg-200 hover:bg-bg-300 transition-colors duration-300 text-accent-100"
            key={round}
          >
            <span className="pl-3">{i + 1}</span>
            <span>
              {amount} {group.crypto}
            </span>
            <span>
              {round === group.myPosition
                ? '-'
                : new Date(paymentDeadlineTimestamp).toDateString()}
            </span>
            <span>
              {round === group.myPosition ? (
                "It's your round"
              ) : (
                <ButtonComponent
                  label={status}
                  type={getStatusType(status)}
                  onClick={() => handleClick(round)}
                  disabled={status !== 'Pay'}
                />
              )}
            </span>
          </div>
        );
      })}
    </>
  );
}
