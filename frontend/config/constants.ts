import { GroupWithdrawalType } from '@/types';

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;

export const REFETCH_INTERVAL = 3000;

export const EMPTY_WITHDRAWALS_DOCUMENT = {
  [GroupWithdrawalType.COLLATERAL]: {
    amount: 0,
    type: GroupWithdrawalType.COLLATERAL,
    timestamp: 0,
    transactionSignature: '',
  },
  [GroupWithdrawalType.ROUND]: {
    amount: 0,
    type: GroupWithdrawalType.ROUND,
    timestamp: 0,
    transactionSignature: '',
  },
  [GroupWithdrawalType.INTEREST]: {
    amount: 0,
    type: GroupWithdrawalType.INTEREST,
    timestamp: 0,
    transactionSignature: '',
  },
};
