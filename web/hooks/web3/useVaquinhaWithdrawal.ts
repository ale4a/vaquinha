import { useProgramMethods } from '@/components/vaquinha/vaquinha-data-access';
import { GroupResponseDTO } from '@/types';
import { useCallback } from 'react';

export const useVaquinhaWithdrawal = () => {
  const { withdrawTurn, withdrawCollateral } = useProgramMethods();

  const withdrawalCollateral = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
      const { tx, error } = await withdrawCollateral(
        group.id,
        tokenMintAddress
      );

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [withdrawCollateral]
  );

  const withdrawalEarnedRound = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
      const { tx, error } = await withdrawTurn(group.id, tokenMintAddress);

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [withdrawTurn]
  );

  const withdrawalEarnedInterest = useCallback(
    async (
      group: GroupResponseDTO,
      amount: number
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tx = 'testing';
      const error = '';
      const success = true;
      return { tx, error, success };
    },
    []
  );

  return {
    withdrawalEarnedRound,
    withdrawalCollateral,
    withdrawalEarnedInterest,
  };
};
