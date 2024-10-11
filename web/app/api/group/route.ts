import { getGroups } from '@/services';
import { dbClient } from '@/services/database';
import { GroupDocument, GroupResponseDTO, GroupStatus } from '@/types';
import { Filter } from 'mongodb';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  await dbClient.connect();

  const status = request.nextUrl.searchParams.get(
    'status'
  ) as GroupStatus | null;
  const customerPublicKey = request.nextUrl.searchParams.get(
    'customerPublicKey'
  ) as string | '';

  const filter: Filter<GroupDocument> = {};
  if (status) {
    filter.status = status;
  }

  if (customerPublicKey) {
    filter[`members.${customerPublicKey}`] = { $exists: true };
  }

  const groups = await getGroups(filter);
  const contents: GroupResponseDTO[] = groups.map((group) => ({
    id: group._id.toString(),
    isOwner: !!group.members?.[customerPublicKey]?.isOwner,
    crypto: group.crypto,
    name: group.name,
    amount: group.amount,
    collateral: group.collateral,
    members: group.members,
    slots: group.totalMembers - Object.keys(group.members).length,
    period: group.period,
    startsOnTimestamp: group.startsOnTimestamp,
    status: group.status,
  }));

  return Response.json({ contents });
}
