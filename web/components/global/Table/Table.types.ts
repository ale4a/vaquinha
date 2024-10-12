export interface item {
  id: string;
  amount: number;
  paymentDeadline: string;
  status: 'Paid' | 'Pay' | 'Pending';
}

export interface Props {
  items: item[];
}
