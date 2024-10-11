import { getGroups, getGroupsByState } from '@/services';
import { dbClient } from '@/services/database';
import { GroupResponse, GroupStatus } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  await dbClient.connect();

  const status = request.nextUrl.searchParams.get(
    'status'
  ) as GroupStatus | null;

  let groups = [];
  if (status) {
    groups = await getGroupsByState(status);
  } else {
    groups = await getGroups();
  }

  const contents: GroupResponse[] = groups.map((group) => ({
    id: group._id.toString(),
    owner: group.owner,
    crypto: group.crypto,
    name: group.name,
    amount: group.amount,
    collateral: group.collateral,
    members: group.members,
    slots: group.slots,
    period: group.period,
    startsOnTimestamp: group.startsOnTimestamp,
    status: group.status,
  }));

  return Response.json({ contents });
}
