import { getGroup, updateGroup } from '@/services/app/group/services';
import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupCreateDTO } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbClient.connect();

  const groupId = params.id;
  const { customerPublicKey } = (await request.json()) as GroupCreateDTO;
  const group = await getGroup(groupId);
  const collateral = group.amount * group.totalMembers;

  // const newMembers: GroupBaseDocument['members'] = {
  //   ...group.members,
  //   [customerPublicKey]: {
  //     publicKey: customerPublicKey,
  //     isOwner: false,
  //     collateralDeposit: { timestamp: Date.now(), amount: collateral },
  //   },
  // };
  // const result = await updateGroup(groupId, {
  //   members: newMembers,
  // });

  return Response.json({ message: 'updated' });
}
