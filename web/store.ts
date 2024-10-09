export enum GroupState {
  PENDING = 'pending',
  ACTIVE = 'active',
  CONCLUDED = 'concluded',
  ABANDONED = 'abandoned',
}

export enum GroupCrypto {
  USDC = 'USDC',
  SOL = 'SOL',
}

export interface Group {
  id: string;
  owner: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateral: number;
  members: number;
  slots: number;
  period: 'monthly' | 'weekly';
  startIn: number;
  state: GroupState;
}

export const GROUPS: Group[] = [];
