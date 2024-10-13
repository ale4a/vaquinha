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

export enum GroupPeriod {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  ALL = 'all',
}

export interface GroupMember {
  publicKey: string;
  isOwner: boolean;
  position: number;
  deposits: {
    [key: number]: {
      amount: number;
      round: number; // 0: collateral, [1, N] rounds
      timestamp: number;
      transactionSignature: string;
    };
  };
  withdrawals: {
    [key: number]: {
      amount: number;
      round: number; // 0: collateral,
      timestamp: number;
      transactionSignature: string;
    };
  };
}

export interface GroupBaseDocument {
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateral: number;
  totalMembers: number;
  members: { [key: string]: GroupMember };
  period: GroupPeriod;
  startsOnTimestamp: number;
  memberPositions: number[];
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

export interface GroupDepositDTO {
  customerPublicKey: string;
  transactionSignature: string;
  round: number;
  amount: number;
}

export interface GroupResponseDTO {
  id: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateral: number;
  myDeposits: {
    [key: number]: {
      amount: number;
      round: number; // 0: collateral, [1, N] rounds
      timestamp: number;
      paid: boolean;
    };
  };
  totalMembers: number;
  slots: number;
  period: 'monthly' | 'weekly';
  startsOnTimestamp: number;
  status: GroupStatus;
  isOwner: boolean;
}

export type GroupDocument = EntityDocument<GroupBaseDocument>;

export interface GroupFilters {
  period: GroupPeriod;
  orderBy: string;
  crypto: GroupCrypto;
  amount: number;
}
