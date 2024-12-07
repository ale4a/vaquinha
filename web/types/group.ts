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
    [key in GroupWithdrawalType]: {
      amount: number;
      type: GroupWithdrawalType;
      timestamp: number;
      transactionSignature: string;
    };
  };
}

export interface GroupBaseDocument {
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateralAmount: number;
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

export enum GroupWithdrawalType {
  COLLATERAL = 'collateral',
  INTEREST = 'interest',
  ROUND = 'round',
}

export interface GroupWithdrawalDTO {
  customerPublicKey: string;
  transactionSignature: string;
  type: GroupWithdrawalType;
  amount: number;
}

export interface GroupResponseDTO {
  id: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateralAmount: number;
  myDeposits: {
    [key: number]: {
      amount: number;
      round: number; // 0: collateral, [1, N] rounds
      timestamp: number;
      successfullyDeposited: boolean;
    };
  };
  totalMembers: number;
  slots: number;
  period: GroupPeriod;
  currentPosition: number;
  myPosition: number;
  startsOnTimestamp: number;
  status: GroupStatus;
  isOwner: boolean;
  myWithdrawals: {
    [key in GroupWithdrawalType]: {
      amount: number;
      type: GroupWithdrawalType;
      timestamp: number;
      successfullyWithdrawn: boolean;
      enabled: boolean;
    };
  };
}

export interface GroupFilters {
  period: GroupPeriod;
  orderBy: string;
  crypto: GroupCrypto;
  amount: number;
}
