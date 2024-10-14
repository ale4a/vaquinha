import { GroupResponseDTO } from '@/types';
import { useCallback } from 'react';

export const useVaquinhaWithdrawal = () => {
  const withdrawalCollateral = useCallback(
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

  const withdrawalEarnedRound = useCallback(
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
