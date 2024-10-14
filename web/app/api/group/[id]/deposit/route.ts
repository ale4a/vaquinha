import { EMPTY_WITHDRAWALS_DOCUMENT } from '@/config/constants';
import { getGroup, updateGroup } from '@/services/app/group/services';
import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupDepositDTO } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const now = new Date();
  await dbClient.connect();

  const groupId = params.id;
  const { customerPublicKey, transactionSignature, round, amount } =
    (await request.json()) as GroupDepositDTO;

  // TODO: validate amount

  const group = await getGroup(groupId);
  const collateral = group.amount * group.totalMembers;
  let newMembers: GroupBaseDocument['members'];
  const memberPositions = [...group.memberPositions];
  if (round === 0) {
    if (group.members[customerPublicKey]) {
      newMembers = {
        ...group.members,
        [customerPublicKey]: {
          ...group.members[customerPublicKey],
          deposits: {
            [round]: {
              amount: collateral,
              round,
              timestamp: now.getTime(),
              transactionSignature,
            },
          },
          withdrawals: EMPTY_WITHDRAWALS_DOCUMENT,
        },
      };
    } else {
      const position = memberPositions.pop() as number;
      newMembers = {
        ...group.members,
        [customerPublicKey]: {
          publicKey: customerPublicKey,
          isOwner: false,
          position,
          deposits: {
            [round]: {
              amount: collateral,
              round,
              timestamp: now.getTime(),
              transactionSignature,
            },
          },
          withdrawals: EMPTY_WITHDRAWALS_DOCUMENT,
        },
      };
    }
  } else {
    newMembers = {
      ...group.members,
      [customerPublicKey]: {
        ...group.members[customerPublicKey],
        deposits: {
          ...group.members[customerPublicKey].deposits,
          [round]: {
            amount: group.amount,
            round,
            timestamp: now.getTime(),
            transactionSignature,
          },
        },
      },
    };
  }

  const result = await updateGroup(groupId, {
    members: newMembers,
    memberPositions: [...memberPositions],
  });

  return Response.json({ message: 'updated' });
}
