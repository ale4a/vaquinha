import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupDocument, GroupStatus } from '@/types';
import { CreateEntityDocument } from '@/types/commons';

const { findByFilter, insertOne } = dbClient.crud<GroupBaseDocument>('group');

export const getGroups = async (): Promise<GroupDocument[]> => findByFilter({});

export const getGroupsByState = async (
  status: GroupStatus
): Promise<GroupDocument[]> => findByFilter({ status });

export const createGroup = async (
  contest: CreateEntityDocument<GroupBaseDocument>
) => {
  return await insertOne(null, contest);
};
