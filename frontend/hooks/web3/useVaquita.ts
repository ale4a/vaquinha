import { NO_TRANSACTION_ERRORS } from '@/config/settings';
import {
  GroupCrypto,
  GroupPeriod,
  GroupPeriodFilter,
  GroupResponseDTO,
  GroupStatus,
  LogLevel,
} from '@/types';
import { logError, logMessage } from '@/utils/log';
import { BN } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback } from 'react';
import { useVaquitaBack } from './useVaquitaBack';
import { useVaquitaProgram } from './useVaquitaProgram';

const convertFrequencyToTimestamp = (period: GroupPeriod): BN => {
  const SECONDS_PER_DAY = 86400; // 24 hours * 60 minutes * 60 seconds
  const frequencyInDays = period === 'weekly' ? 7 : 30;
  const frequencyInSeconds = frequencyInDays * SECONDS_PER_DAY;
  // Return as BN (Big Number) which is commonly used for large integers in Solana
  return new BN(frequencyInSeconds);
};

export const useVaquita = () => {
  const { getGroupData, initializeGroup } = useVaquitaProgram();
  const {
    createGroup: createGroupBack,
    joinGroup: joinGroupBack,
    listGroups: listGroupsBack,
  } = useVaquitaBack();
  const { publicKey } = useWallet();

  const listGroups = useCallback(
    async ({
      crypto,
      amount,
      period,
      publicKey,
      orderBy,
      status,
    }: {
      crypto: GroupCrypto;
      orderBy: string;
      amount: number;
      period: GroupPeriodFilter;
      status?: GroupStatus;
      publicKey?: PublicKey | null;
    }) => {
      try {
        const groups: GroupResponseDTO[] = [];
        const result = await listGroupsBack(
          publicKey ? publicKey.toBase58() : null,
          period === GroupPeriodFilter.MONTHLY
            ? { [GroupPeriod.MONTHLY]: null }
            : period === GroupPeriodFilter.WEEKLY
            ? { [GroupPeriod.WEEKLY]: null }
            : null,
          amount > 0 ? amount : null,
          crypto === GroupCrypto.USDC
            ? { [GroupCrypto.USDC]: null }
            : crypto === GroupCrypto.SOL
            ? { [GroupCrypto.SOL]: null }
            : null
        );
        console.log({ result });
        for (const group of result.contents) {
          try {
            const groupData = await getGroupData(group);
            if (
              groupData.success &&
              groupData.content &&
              (status ? groupData.content.status === status : true)
            ) {
              groups.push(groupData.content);
            }
          } catch (error) {
            logError(LogLevel.INFO)(error, 'error on getGroupData');
          }
        }
        return { success: true, contents: groups, error: null };
      } catch (error) {
        logError(LogLevel.INFO)(error, 'error on listGroups');
      }
      return { success: false, contents: [], error: null };
    },
    [getGroupData, listGroupsBack]
  );

  const createGroup = useCallback(
    async ({
      name,
      totalMembers,
      period,
      amount,
      crypto,
    }: {
      name: string;
      totalMembers: number;
      period: GroupPeriod;
      amount: number;
      crypto: GroupCrypto;
    }) => {
      if (!publicKey) {
        return {
          success: false,
          content: null,
          error: new Error('no public key defined'),
        };
      }
      let newId = '';
      try {
        const createGroupResult = await createGroupBack(
          name,
          totalMembers,
          period,
          amount,
          crypto
        );
        if (!createGroupResult.success) {
          return {
            success: false,
            content: null,
            error: new Error('group not created'),
          };
        }
        const myPosition = createGroupResult.content.memberPositions[0];

        const paymentAmount = amount;
        const numberOfPlayers = totalMembers;
        const frequencyOfTurns = convertFrequencyToTimestamp(period);
        const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Circle USDC
        await initializeGroup(
          createGroupResult.content.id,
          paymentAmount,
          numberOfPlayers,
          frequencyOfTurns,
          tokenMintAddress,
          myPosition
        );
        newId = createGroupResult.content.id;
      } catch (error: any) {
        if (
          error?.message ===
          'failed to send transaction: Transaction simulation failed: This transaction has already been processed'
        ) {
          return {
            success: true,
            content:
              'failed to send transaction: Transaction simulation failed: This transaction has already been processed',
            error: null,
          };
        }
        if (NO_TRANSACTION_ERRORS) {
          return { success: true, content: 'testing', error: null };
        }
        return {
          success: false,
          content: null,
          error,
        };
      }
      if (NO_TRANSACTION_ERRORS) {
        return { success: true, content: 'testing', error: null };
      }
      try {
        const resultJoinGroup = await joinGroupBack(
          newId,
          publicKey!.toBase58()
        );
        if (!resultJoinGroup.success) {
          throw new Error('member not joined');
        }
        return { success: true, content: 'ok', error: null };
      } catch (error) {
        logMessage(LogLevel.INFO)(error);
        return { success: false, content: null, error };
      }
    },
    [createGroupBack, initializeGroup, joinGroupBack, publicKey]
  );

  return {
    listGroups,
    createGroup,
  };
};
