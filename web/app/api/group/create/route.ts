import { createGroup } from '@/services';
import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupCreateDTO } from '@/types';
import { shuffle } from '@/utils/array';

export async function POST(request: Request) {
  // const now = new Date();
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
  const memberPositions = [];
  for (let i = 0; i < totalMembers; i++) {
    memberPositions.push(i);
  }
  shuffle(memberPositions);
  const position = memberPositions.pop() as number;

  const newGroup: GroupBaseDocument = {
    crypto,
    name,
    amount,
    collateral,
    totalMembers,
    period,
    startsOnTimestamp,
    memberPositions,
    members: {
      [customerPublicKey]: {
        position,
        publicKey: customerPublicKey,
        isOwner: true,
        deposits: {
          // [0]: {
          //   amount: collateral,
          //   round: 0,
          //   timestamp: now.getTime(),
          //   transactionSignature,
          // },
        },
        withdrawals: {},
      },
    },
  };

  const result = await createGroup(newGroup);

  return Response.json({ content: { id: result.insertedId } });
}
