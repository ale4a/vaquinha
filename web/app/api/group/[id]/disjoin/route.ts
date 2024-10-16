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
  if (group.members[customerPublicKey]) {
    const newMembers: GroupBaseDocument['members'] = { ...group.members };
    const memberPositions = [
      newMembers[customerPublicKey].position,
      ...group.memberPositions,
    ];
    delete newMembers[customerPublicKey];
    await updateGroup(groupId, {
      members: newMembers,
      memberPositions: [...memberPositions],
    });
  }

  const groupUpdated = await getGroup(groupId);
  const content: GroupResponseDTO = toGroupResponseDTO(
    groupUpdated,
    customerPublicKey
  );

  return Response.json({ content });
}
