import { getGroups } from '@/services';
import { toGroupResponseDTO } from '@/services/app/group/helpers';
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
  const contents: GroupResponseDTO[] = groups.map((group) =>
    toGroupResponseDTO(group, customerPublicKey)
  );

  return Response.json({ contents });
}
