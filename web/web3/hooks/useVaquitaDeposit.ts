import { useProgramMethods } from '@/components/vaquinha/vaquinha-data-access';
import { NO_TRANSACTION_ERRORS } from '@/config/settings';
import { GroupPeriod, GroupResponseDTO } from '@/vaquita-ui-submodule/types';
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

export const useVaquitaDeposit = () => {
  const { initializeRound, addPlayer, payTurn } = useProgramMethods();

  const depositCollateralAndCreate = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const paymentAmount = group.amount * USDC_DECIMALS;
      const numberOfPlayers = group.totalMembers;
      const frequencyOfTurns = convertFrequencyToTimestamp(group.period);
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Circle USDC
      let tx, error;
      try {
        const result = await initializeRound(
          group.id,
          paymentAmount,
          numberOfPlayers,
          frequencyOfTurns,
          tokenMintAddress,
          group.myPosition
        );
        tx = result.tx || '';
        error = result.error;
      } catch (error: any) {
        console.log(error);
        console.log(error?.message);
        console.log(error?.stack);
        console.log({ ...(error || {}) });
        if (
          error?.message ===
          'failed to send transaction: Transaction simulation failed: This transaction has already been processed'
        ) {
          return {
            tx: 'failed to send transaction: Transaction simulation failed: This transaction has already been processed',
            error: '',
            success: true,
          };
        }
        throw error;
      }

      if (NO_TRANSACTION_ERRORS) {
        return { tx: 'testing', error: '', success: true };
      }

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [initializeRound]
  );

  const depositCollateralAndJoin = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
      const { tx, error } = await addPlayer(
        group.id,
        tokenMintAddress,
        group.myPosition
      );

      if (NO_TRANSACTION_ERRORS) {
        return { tx: 'testing', error: '', success: true };
      }

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [addPlayer]
  );

  const depositRoundPayment = useCallback(
    async (
      group: GroupResponseDTO,
      turn: number
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
      const { tx, error } = await payTurn(group.id, tokenMintAddress, turn);

      if (NO_TRANSACTION_ERRORS) {
        return { tx: 'testing', error: '', success: true };
      }

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [payTurn]
  );

  return {
    depositCollateralAndCreate,
    depositCollateralAndJoin,
    depositRoundPayment,
  };
};
