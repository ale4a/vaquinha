import {
  GroupDocument,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
} from '@/types';
import { addMonths, addWeeks } from 'date-fns';

export const getGroupStatus = (group: GroupDocument) => {
  let depositedCollaterals = 0;
  for (const member of Object.values(group.members || {})) {
    if (
      member.deposits?.[0]?.round === 0 &&
      member.deposits?.[0]?.amount === group.collateralAmount
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
    const endDate =
      group.period === GroupPeriod.MONTHLY
        ? addMonths(new Date(group.startsOnTimestamp), group.totalMembers)
        : addWeeks(new Date(group.startsOnTimestamp), group.totalMembers);
    if (endDate.getTime() < Date.now()) {
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
      member.deposits?.[0]?.amount === group.collateralAmount
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
  const me = group.members?.[customerPublicKey];
  for (const deposit of Object.values(me?.deposits || {})) {
    myDeposits[deposit.round] = {
      round: deposit.round,
      paid:
        deposit.round === 0
          ? deposit.amount === group.collateralAmount
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
    collateralAmount: group.collateralAmount,
    myDeposits,
    totalMembers: group.totalMembers,
    slots: getGroupSlots(group),
    period: group.period,
    startsOnTimestamp: group.startsOnTimestamp,
    status: getGroupStatus(group),
    isOwner: !!group.members?.[customerPublicKey]?.isOwner,
    myPosition: me?.position || 0,
  };
};
