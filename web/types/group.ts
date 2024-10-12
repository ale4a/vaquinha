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

export interface GroupMember {
  publicKey: string;
  isOwner: boolean;
  collateralDeposit: {
    timestamp: number;
    amount: number;
  };
}

export interface GroupBaseDocument {
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateral: number;
  totalMembers: number;
  members: { [key: string]: GroupMember };
  period: 'monthly' | 'weekly';
  startsOnTimestamp: number;
  status: GroupStatus;
}

export interface GroupCreateDTO
  extends Pick<
    GroupBaseDocument,
    | 'name'
    | 'amount'
    | 'crypto'
    | 'totalMembers'
    | 'period'
    | 'startsOnTimestamp'
  > {
  customerPublicKey: string;
}

export interface GroupResponseDTO {
  id: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateral: number;
  members: { [key: string]: GroupMember };
  totalMembers: number;
  slots: number;
  period: 'monthly' | 'weekly';
  startsOnTimestamp: number;
  status: GroupStatus;

  isOwner: boolean;
  collateralDeposited: boolean;
  isActive: boolean;
}

export type GroupDocument = EntityDocument<GroupBaseDocument>;
