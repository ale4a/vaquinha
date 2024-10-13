import { ONE_DAY } from '@/config/constants';
import {
  GroupDocument,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
} from '@/types';

export const getGroupStatus = (group: GroupDocument) => {
  let depositedCollaterals = 0;
  for (const member of Object.values(group.members || {})) {
    if (
      member.deposits?.[0]?.round === 0 &&
      member.deposits?.[0]?.amount === group.collateral
    ) {
      depositedCollaterals++;
    }
  }

  if (depositedCollaterals < group.totalMembers) {
    // pending, abandoned
    if (group.startsOnTimestamp >= Date.now()) {
      return GroupStatus.PENDING;
    }
    return GroupStatus.ABANDONED;
  } else if (depositedCollaterals === group.totalMembers) {
    // active, concluded
    let endDate =
      group.period === GroupPeriod.MONTHLY
        ? new Date(group.startsOnTimestamp)
        : new Date(group.startsOnTimestamp + 7 * ONE_DAY * group.totalMembers);
    for (let i = 0; i < group.totalMembers; i++) {
      endDate = endDate.increaseMonth();
    }
    if (endDate.getTime() > Date.now()) {
      return GroupStatus.CONCLUDED;
    }
    return GroupStatus.ACTIVE;
  }

  return GroupStatus.ABANDONED;
};

export const getGroupSlots = (group: GroupDocument) => {
  let depositedCollaterals = 0;
  for (const member of Object.values(group.members || {})) {
    if (
      member.deposits?.[0]?.round === 0 &&
      member.deposits?.[0]?.amount === group.collateral
    ) {
      depositedCollaterals++;
    }
  }

  return group.totalMembers - depositedCollaterals;
};

export const toGroupResponseDTO = (
  group: GroupDocument,
  customerPublicKey: string
): GroupResponseDTO => {
  const myDeposits: GroupResponseDTO['myDeposits'] = {};

  for (const deposit of Object.values(
    group.members?.[customerPublicKey]?.deposits || {}
  )) {
    myDeposits[deposit.round] = {
      round: deposit.round,
      paid:
        deposit.round === 0
          ? deposit.amount === group.collateral
          : deposit.amount === group.amount,
      amount: deposit.amount,
      timestamp: deposit.timestamp,
    };
  }

  return {
    id: group._id.toString(),
    crypto: group.crypto,
    name: group.name,
    amount: group.amount,
    collateral: group.collateral,
    myDeposits,
    totalMembers: group.totalMembers,
    slots: getGroupSlots(group),
    period: group.period,
    startsOnTimestamp: group.startsOnTimestamp,
    status: getGroupStatus(group),
    isOwner: !!group.members?.[customerPublicKey]?.isOwner,
  };
};
