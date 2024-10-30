import { GroupTablePaymentItem } from '@/components/group/GroupTablePayments/GroupTablePayments.types';
import { GroupPeriod, GroupResponseDTO } from '@/types';
import { addMonths, addWeeks } from 'date-fns';

export const getPaymentsTable = (
  group: Pick<
    GroupResponseDTO,
    | 'startsOnTimestamp'
    | 'totalMembers'
    | 'period'
    | 'amount'
    | 'myDeposits'
    | 'myPosition'
  >
) => {
  const items: GroupTablePaymentItem[] = [];
  let startDate = new Date(group.startsOnTimestamp || 0);
  let endDate = startDate;
  let firstUnpaidItemIndex = -1;
  let currentPosition = -1;
  for (let i = 0; i < (group.totalMembers || 0); i++) {
    if (group.period === GroupPeriod.MONTHLY) {
      endDate = addMonths(startDate, 1);
    } else {
      endDate = addWeeks(startDate, 1);
    }
    if (startDate.getTime() <= Date.now() && Date.now() < endDate.getTime()) {
      currentPosition = i + 1;
    }
    const round = i + 1;

    items.push({
      round,
      amount: group.amount || 0,
      paymentDeadlineTimestamp: endDate.getTime(),
      status: group.myDeposits[round]?.successfullyDeposited
        ? 'Paid'
        : firstUnpaidItemIndex === -1
        ? 'Pay'
        : 'Pending',
    });
    if (
      firstUnpaidItemIndex === -1 &&
      round !== group.myPosition &&
      !group.myDeposits[round]?.successfullyDeposited
    ) {
      firstUnpaidItemIndex = i;
    }
    startDate = endDate;
  }

  return { items, firstUnpaidItemIndex, currentPosition };
};
