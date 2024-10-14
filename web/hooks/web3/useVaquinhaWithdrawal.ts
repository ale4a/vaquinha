import { GroupPeriod } from '@/types';
import { useCallback } from 'react';

export const useVaquinhaWithdrawal = () => {
  const withdrawalCollateral = useCallback(
    async (
      groupId: string,
      amount: number,
      totalMembers: number,
      period: GroupPeriod
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
      groupId: string,
      amount: number,
      totalMembers: number,
      period: GroupPeriod
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
      groupId: string,
      amount: number,
      totalMembers: number,
      period: GroupPeriod
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
