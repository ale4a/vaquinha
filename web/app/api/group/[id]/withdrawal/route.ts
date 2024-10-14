import { getGroup, updateGroup } from '@/services/app/group/services';
import { dbClient } from '@/services/database';
import {
  GroupBaseDocument,
  GroupWithdrawalDTO,
  GroupWithdrawalType,
} from '@/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const now = new Date();
  await dbClient.connect();

  const groupId = params.id;
  const { customerPublicKey, transactionSignature, type, amount } =
    (await request.json()) as GroupWithdrawalDTO;

  // TODO: validate amount

  const group = await getGroup(groupId);
  let newMembers: GroupBaseDocument['members'] = { ...group.members };

  if (type === GroupWithdrawalType.COLLATERAL) {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        withdrawals: {
          ...group.members[customerPublicKey].withdrawals,
          [GroupWithdrawalType.COLLATERAL]: {
            amount: group.collateralAmount,
            type: GroupWithdrawalType.COLLATERAL,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }

  if (type === GroupWithdrawalType.ROUND) {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        withdrawals: {
          ...group.members[customerPublicKey].withdrawals,
          [GroupWithdrawalType.ROUND]: {
            amount: group.amount,
            type: GroupWithdrawalType.ROUND,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }

  if (type === GroupWithdrawalType.INTEREST) {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        withdrawals: {
          ...group.members[customerPublicKey].withdrawals,
          [GroupWithdrawalType.INTEREST]: {
            amount: 0,
            type: GroupWithdrawalType.INTEREST,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }

  const result = await updateGroup(groupId, {
    members: newMembers,
  });

  return Response.json({ message: 'updated' });
}
