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

  const collateral = amount * totalMembers;

  const newGroup: GroupBaseDocument = {
    crypto,
    name,
    amount,
    collateral,
    totalMembers,
    period,
    startsOnTimestamp,
    status: GroupStatus.PENDING,
    members: {
      [customerPublicKey]: {
        publicKey: customerPublicKey,
        isOwner: true,
        collateralDeposit: { timestamp: Date.now(), amount: collateral },
      },
    },
  };

  const result = await createGroup(newGroup);

  return Response.json({ id: result.insertedId });
}
