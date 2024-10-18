import { toGroupResponseDTO } from '@/helpers';
import { getGroups } from '@/services';
import { dbClient } from '@/services/database';
import {
  EntityState,
  GroupCrypto,
  GroupDocument,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
} from '@/types';
import { Filter, Sort } from 'mongodb';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  await dbClient.connect();

  const status = request.nextUrl.searchParams.get(
    'status'
  ) as GroupStatus | null;
  const myGroups = request.nextUrl.searchParams.get(
    'myGroups'
  ) as GroupStatus | null;
  const period = request.nextUrl.searchParams.get(
    'period'
  ) as GroupPeriod | null;
  const crypto = request.nextUrl.searchParams.get(
    'crypto'
  ) as GroupCrypto | null;
  const amount = +(request.nextUrl.searchParams.get('amount') || 0) as
    | number
    | null;
  const customerPublicKey = request.nextUrl.searchParams.get(
    'customerPublicKey'
  ) as string | '';
  const orderBy = request.nextUrl.searchParams.get('orderBy');

  const filter: Filter<GroupDocument> = { state: EntityState.RELEASED };
  // if (status) {
  //   filter.status = status;
  // }
  if (period) {
    filter.period = period;
  }
  if (crypto) {
    filter.crypto = crypto;
  }
  if (amount) {
    filter.amount = amount;
  }
  if (customerPublicKey) {
    if (myGroups) {
      filter[`members.${customerPublicKey}`] = { $exists: true };
    } else {
      filter[`members.${customerPublicKey}`] = { $exists: false };
    }
  }

  const sort: Sort = {};
  switch (orderBy) {
    case '+amount':
      sort.amount = 1;
      break;
    case '-amount':
      sort.amount = -1;
      break;
    case '+date':
      sort.startsOnTimestamp = 1;
      break;
    case '-date':
      sort.startsOnTimestamp = -1;
      break;
    // case '+slots':
    //   sort.slots = 1;
    //   break;
    // case '-slots':
    //   sort.slots = -1;
    //   break;
    case '+totalMembers':
      sort.totalMembers = 1;
      break;
    case '-totalMembers':
      sort.totalMembers = -1;
      break;
    default:
  }
  const groups = await getGroups(filter, sort);
  const contents: GroupResponseDTO[] = groups
    .map((group) => toGroupResponseDTO(group, customerPublicKey))
    .filter(
      (group) =>
        (status ? status === group.status : true) &&
        // (customerPublicKey ? true : group.slots > 0) &&
        true
    );

  return Response.json({ contents });
}
