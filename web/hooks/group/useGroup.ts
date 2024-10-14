import {
  GroupCreateDTO,
  GroupCrypto,
  GroupDepositDTO,
  GroupPeriod,
  GroupResponseDTO,
  GroupWithdrawalDTO,
  GroupWithdrawalType,
} from '@/types';
import type { PublicKey } from '@solana/web3.js';
import { useCallback } from 'react';

export const useGroup = () => {
  const createGroup = useCallback(
    async (
      name: string,
      amount: number,
      crypto: GroupCrypto,
      totalMembers: number,
      period: GroupPeriod,
      startsOnTimestamp: number,
      publicKey: PublicKey
    ) => {
      const newGroupPayload: GroupCreateDTO = {
        name: name,
        amount: amount,
        crypto: crypto,
        totalMembers: totalMembers,
        period: period,
        startsOnTimestamp: startsOnTimestamp,
        customerPublicKey: publicKey.toBase58(),
      };
      const result = await fetch('/api/group/create', {
        method: 'POST',
        body: JSON.stringify(newGroupPayload),
      });
      const body = await result.json();
      return body?.content as GroupResponseDTO;
    },
    []
  );

  const deleteGroup = useCallback(async (groupId: string) => {
    return await fetch(`/api/group/${groupId}`, { method: 'DELETE' });
  }, []);

  const depositGroupCollateral = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      amount: number
    ) => {
      const payload: GroupDepositDTO = {
        customerPublicKey: publicKey.toBase58(),
        transactionSignature,
        round: 0,
        amount,
      };
      return await fetch(`/api/group/${groupId}/deposit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    []
  );

  const depositGroupPayment = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      round: number,
      amount: number
    ) => {
      const payload: GroupDepositDTO = {
        customerPublicKey: publicKey.toBase58(),
        transactionSignature,
        round,
        amount,
      };
      return await fetch(`/api/group/${groupId}/deposit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    []
  );

  const withdrawalGroupCollateral = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      amount: number
    ) => {
      const payload: GroupWithdrawalDTO = {
        customerPublicKey: publicKey.toBase58(),
        transactionSignature,
        type: GroupWithdrawalType.COLLATERAL,
        amount,
      };
      return await fetch(`/api/group/${groupId}/withdrawal`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    []
  );

  const withdrawalGroupEarnedInterest = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      amount: number
    ) => {
      const payload: GroupWithdrawalDTO = {
        customerPublicKey: publicKey.toBase58(),
        transactionSignature,
        type: GroupWithdrawalType.INTEREST,
        amount,
      };
      return await fetch(`/api/group/${groupId}/withdrawal`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    []
  );

  const withdrawalGroupEarnedRound = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      amount: number
    ) => {
      const payload: GroupWithdrawalDTO = {
        customerPublicKey: publicKey.toBase58(),
        transactionSignature,
        type: GroupWithdrawalType.ROUND,
        amount,
      };
      return await fetch(`/api/group/${groupId}/withdrawal`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    []
  );

  return {
    createGroup,
    deleteGroup,
    depositGroupCollateral,
    depositGroupPayment,
    withdrawalGroupCollateral,
    withdrawalGroupEarnedRound,
    withdrawalGroupEarnedInterest,
  };
};
