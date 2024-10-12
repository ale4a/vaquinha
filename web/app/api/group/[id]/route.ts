import { toGroupResponseDTO } from '@/services/app/group/helpers';
import { getGroup } from '@/services/app/group/services';
import { dbClient } from '@/services/database';
import { GroupResponseDTO } from '@/types';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbClient.connect();

  const groupId = params.id;
  const customerPublicKey = request.nextUrl.searchParams.get(
    'customerPublicKey'
  ) as string | '';

  const group = await getGroup(groupId);
  const content: GroupResponseDTO = toGroupResponseDTO(
    group,
    customerPublicKey
  );

  return Response.json({ content });
}
