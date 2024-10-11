import { dbClient } from '@/services/database';
import { GroupBaseDocument, GroupDocument } from '@/types';
import { CreateEntityDocument } from '@/types/commons';
import { Filter } from 'mongodb';

const { findByFilter, insertOne } = dbClient.crud<GroupBaseDocument>('group');

export const getGroups = async (
  filter: Filter<GroupDocument>
): Promise<GroupDocument[]> => findByFilter(filter);

export const createGroup = async (
  contest: CreateEntityDocument<GroupBaseDocument>
) => {
  return await insertOne(null, contest);
};
