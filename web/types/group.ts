import { EntityDocument } from '@/types/commons';

export enum GroupStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  CONCLUDED = 'concluded',
  ABANDONED = 'abandoned',
}

export enum GroupCrypto {
  USDC = 'USDC',
  SOL = 'SOL',
}

export interface GroupBaseDocument {
  owner: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateral: number;
  members: number;
  slots: number;
  period: 'monthly' | 'weekly';
  startsOnTimestamp: number;
  status: GroupStatus;
}

export interface GroupResponse {
  id: string;
  owner: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateral: number;
  members: number;
  slots: number;
  period: 'monthly' | 'weekly';
  startsOnTimestamp: number;
  status: GroupStatus;
}

export type GroupDocument = EntityDocument<GroupBaseDocument>;
