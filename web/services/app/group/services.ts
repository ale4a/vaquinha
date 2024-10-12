import { dbClient } from '@/services/database';
import {
  GroupBaseDocument,
  GroupDocument,
  UpdateEntityDocument,
} from '@/types';
import { CreateEntityDocument } from '@/types/commons';
import { Filter } from 'mongodb';

const { findByFilter, insertOne, findOne, updateOne } =
  dbClient.crud<GroupBaseDocument>('group');

export const getGroups = async (
  filter: Filter<GroupDocument>
): Promise<GroupDocument[]> => findByFilter(filter);

export const createGroup = async (
  contest: CreateEntityDocument<GroupBaseDocument>
) => {
  return await insertOne(null, contest);
};

export const getGroup = async (id: string): Promise<GroupDocument> =>
  findOne(id);

export const updateGroup = async (
  id: string,
  doc: UpdateEntityDocument<GroupDocument>
) => updateOne(id, doc, null);
