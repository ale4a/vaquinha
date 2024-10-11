import { createGroup } from '@/services';
import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupStatus } from '@/types';

export async function POST(request: Request) {
  await dbClient.connect();

  const {
    crypto,
    name,
    amount,
    collateral,
    members,
    slots,
    period,
    startsOnTimestamp,
  } = await request.json();

  const newGroup: GroupBaseDocument = {
    owner: 'test',
    crypto,
    name,
    amount,
    collateral,
    members,
    slots,
    period,
    startsOnTimestamp,
    status: GroupStatus.PENDING,
  };

  const result = await createGroup(newGroup);

  return Response.json({ id: result.insertedId });
}
