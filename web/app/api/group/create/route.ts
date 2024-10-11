import { createGroup } from '@/services';
import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupCreateDTO, GroupStatus } from '@/types';

export async function POST(request: Request) {
  await dbClient.connect();

  const {
    name,
    amount,
    crypto,
    totalMembers,
    period,
    startsOnTimestamp,
    customerPublicKey,
  } = (await request.json()) as GroupCreateDTO;

  const newGroup: GroupBaseDocument = {
    crypto,
    name,
    amount,
    collateral: amount * totalMembers,
    totalMembers,
    period,
    startsOnTimestamp,
    status: GroupStatus.PENDING,
    members: {
      [customerPublicKey]: { publicKey: customerPublicKey, isOwner: true },
    },
  };

  const result = await createGroup(newGroup);

  return Response.json({ id: result.insertedId });
}
