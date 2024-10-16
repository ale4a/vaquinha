import { EMPTY_WITHDRAWALS_DOCUMENT } from '@/config/constants';
import { toGroupResponseDTO } from '@/helpers';
import { getGroup, updateGroup } from '@/services/app/group/services';
import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupDepositDTO, GroupResponseDTO } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbClient.connect();

  const groupId = params.id;
  const { customerPublicKey } = (await request.json()) as GroupDepositDTO;

  // TODO: validate amount

  const group = await getGroup(groupId);
  const memberPositions = [...group.memberPositions];

  const position = memberPositions.pop() as number;
  const newMembers: GroupBaseDocument['members'] = {
    ...group.members,
    [customerPublicKey]: {
      publicKey: customerPublicKey,
      isOwner: false,
      position,
      deposits: {},
      withdrawals: EMPTY_WITHDRAWALS_DOCUMENT,
    },
  };

  const result = await updateGroup(groupId, {
    members: newMembers,
    memberPositions: [...memberPositions],
  });

  const groupUpdated = await getGroup(groupId);
  const content: GroupResponseDTO = toGroupResponseDTO(
    groupUpdated,
    customerPublicKey
  );

  return Response.json({ content });
}
