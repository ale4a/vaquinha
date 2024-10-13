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
  const { customerPublicKey, transactionSignature, round } =
    (await request.json()) as GroupDepositDTO;
  const group = await getGroup(groupId);
  const collateral = group.amount * group.totalMembers;

  let newMembers: GroupBaseDocument['members'] = { ...group.members };
  if (round === 0) {
    const position = group.memberPositions.pop() as number;
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
        withdrawals: {},
      },
    };
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
    memberPositions: group.memberPositions,
  });

  return Response.json({ message: 'updated' });
}
