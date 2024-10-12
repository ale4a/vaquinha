import { GroupDocument } from '@/types';

export const toGroupResponseDTO = (
  group: GroupDocument,
  customerPublicKey: string
) => {
  return {
    id: group._id.toString(),
    crypto: group.crypto,
    name: group.name,
    amount: group.amount,
    collateral: group.collateral,
    members: group.members,
    totalMembers: group.totalMembers,
    slots: group.totalMembers - Object.keys(group.members).length,
    period: group.period,
    startsOnTimestamp: group.startsOnTimestamp,
    status: group.status,
    isOwner: !!group.members?.[customerPublicKey]?.isOwner,
    collateralDeposited:
      group.members?.[customerPublicKey]?.collateralDeposit?.amount ===
      group.collateral,
    isActive:
      Object.values(group.members).reduce(
        (sum, groupMember, b) =>
          sum +
          (groupMember.collateralDeposit?.amount === group.collateral ? 1 : 0),
        0
      ) === group.totalMembers && group.startsOnTimestamp <= Date.now(),
  };
};
