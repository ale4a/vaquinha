import { GroupResponseDTO } from '@/types';
import { QueryObserverBaseResult } from '@tanstack/react-query';

export interface GroupTablePaymentItem {
  round: number;
  amount: number;
  paymentDeadlineTimestamp: number;
  status: 'Paid' | 'Pay' | 'Pending';
}

export interface GroupTablePaymentsProps {
  items: GroupTablePaymentItem[];
  group: GroupResponseDTO;
  refetch: QueryObserverBaseResult['refetch'];
}
