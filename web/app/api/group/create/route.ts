import { Group, GROUPS, GroupState } from '@/store';
import { v4 } from 'uuid';

export async function POST(request: Request) {
  const { crypto, name, amount, collateral, members, slots, period, startIn } =
    await request.json();

  const id = v4();

  const newGroup: Group = {
    id,
    owner: 'test',
    crypto,
    name,
    amount,
    collateral,
    members,
    slots,
    period,
    startIn,
    state: GroupState.PENDING,
  };

  await new Promise((resolve) => setTimeout(resolve, 3000));
  GROUPS.push(newGroup);

  return Response.json({ id });
}
