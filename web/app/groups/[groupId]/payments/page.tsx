'use client';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import Table from '@/components/global/Table/Table';
import { item } from '@/components/global/Table/Table.types';
import React from 'react';

const items: item[] = [
  {
    id: '0',
    amount: 68,
    paymentDeadline: '13-11-2024',
    status: 'Paid',
  },
  {
    id: '1',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Paid',
  },
  {
    id: '2',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Paid',
  },
  {
    id: '3',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Pay',
  },
  {
    id: '4',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Pending',
  },
];

const PaymentsPage = () => {
  return (
    <>
      <div className="h-20">
        <TabTitleHeader text="Group Information" />
      </div>
      <Table items={items} />
    </>
  );
};

export default PaymentsPage;
