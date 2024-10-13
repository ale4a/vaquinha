import { useInitializeRound } from '@/components/vaquinha/vaquinha-data-access';
import { GroupPeriod } from '@/types';
import { BN } from '@coral-xyz/anchor';
import { useCallback } from 'react';

const USDC_DECIMALS = 1000000;

const convertFrequencyToTimestamp = (period: GroupPeriod): BN => {
  const SECONDS_PER_DAY = 86400; // 24 hours * 60 minutes * 60 seconds
  const frequencyInDays = period === 'weekly' ? 7 : 30;
  const frequencyInSeconds = frequencyInDays * SECONDS_PER_DAY;
  // Return as BN (Big Number) which is commonly used for large integers in Solana
  return new BN(frequencyInSeconds);
};

export const useVaquinhaDeposit = () => {
  const { initializeRound } = useInitializeRound();

  const depositCollateral = useCallback(
    async (
      groupId: string,
      amount: number,
      totalMembers: number,
      period: GroupPeriod
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const paymentAmount = amount * USDC_DECIMALS;
      const numberOfPlayers = totalMembers;
      const frequencyOfTurns = convertFrequencyToTimestamp(period);
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Circle USDC
      const { tx, error } = await initializeRound(
        paymentAmount,
        numberOfPlayers,
        frequencyOfTurns,
        tokenMintAddress
      );
      const success = true;
      return { tx: tx || '', error, success };
    },
    [initializeRound]
  );

  const depositRoundPayment = useCallback(
    async (
      groupId: string,
      amount: number,
      totalMembers: number,
      period: GroupPeriod
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tx = '';
      const error = '';
      const success = true;
      return { tx: tx || '', error, success };
    },
    [initializeRound]
  );

  return { depositCollateral, depositRoundPayment };
};
