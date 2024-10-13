export interface item {
  id: string;
  amount: number;
  paymentDeadlineTimestamp: number;
  status: 'Paid' | 'Pay' | 'Pending';
}

export interface Props {
  items: item[];
}
