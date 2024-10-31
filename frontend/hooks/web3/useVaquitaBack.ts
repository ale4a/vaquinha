import { groupManagementBackend } from '@/lib/icp-backend';
import { GroupCrypto, GroupPeriod } from '@/types';
import { useCallback } from 'react';
import {
  Group,
  GroupCrypto as GroupCrypto1,
  GroupPeriod as GroupPeriod1,
} from '../../../group-management/.dfx/local/canisters/group-management-backend/service.did';

function randomHash(nChar: number) {
  const nBytes = Math.ceil((nChar = (+nChar || 8) / 2));
  const u = new Uint8Array(nBytes);
  crypto.getRandomValues(u);
  const pad = (str: string) => '00'.slice(str.length) + str;
  const a = Array.prototype.map.call(u, (x) => pad(x.toString(16)));
  let str = a.join('').toUpperCase();
  if (nChar % 2) str = str.slice(1);
  return str;
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export const useVaquitaBack = () => {
  const listGroups = useCallback(
    async (
      publicKey: string | null,
      period: { [key: string]: null } | null,
      amount: number | null,
      crypto: { [key: string]: null } | null
    ) => {
      console.log('list', {
        publicKey,
        period,
        amount,
        crypto,
      });
      const result = await groupManagementBackend.listGroups(
        publicKey ? [publicKey] : [],
        period ? [period as GroupPeriod1] : [],
        amount ? [amount as unknown as bigint] : [],
        crypto ? [crypto as GroupCrypto1] : []
      );
      if (result?.success && result?.contents) {
        return {
          contents: (result?.contents as Group[]) || [],
          success: true,
        };
      }

      return {
        contents: [],
        success: false,
      };
    },
    []
  );

  const getGroup = useCallback(async (id: string) => {
    const result = await groupManagementBackend.getGroup(id);
    if (result?.success && result?.content && result?.content?.[0]) {
      return {
        success: true,
        content: result.content?.[0] as Group,
      };
    }

    return {
      success: false,
      content: null,
    };
  }, []);

  const createGroup = useCallback(
    async (
      name: string,
      totalMembers: number,
      period: GroupPeriod,
      amount: number,
      crypto: GroupCrypto
    ) => {
      const newId = randomHash(32);
      const memberPositions = [];
      for (let i = 1; i <= totalMembers; i++) {
        memberPositions.push(i);
      }
      shuffle(memberPositions);
      console.log({ memberPositions });
      const result = await groupManagementBackend.createGroup(
        newId,
        name,
        memberPositions as unknown as bigint[],
        { [period]: null } as GroupPeriod1,
        amount as unknown as bigint,
        { [crypto]: null } as GroupCrypto1
      );
      console.log({ result });
      if (result.success) {
        return {
          success: true,
          content: {
            id: newId,
            memberPositions,
          },
        };
      }

      return {
        success: false,
        content: {
          id: '',
          memberPositions: [],
        },
      };
    },
    []
  );

  const joinGroup = useCallback(async (id: string, publicKey: string) => {
    const result = await groupManagementBackend.joinGroup(id, publicKey);

    if (result.success) {
      return {
        success: true,
      };
    }

    return {
      success: false,
    };
  }, []);

  return {
    createGroup,
    listGroups,
    getGroup,
    joinGroup,
  };
};
