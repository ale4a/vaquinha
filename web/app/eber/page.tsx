import SavingCard from '@/components/global/SavingCard/SavingCard';
import DetailsCard from '../../components/global/DetailsCard/DetailsCard';
import Table from '@/components/global/Table/Table';
import { item } from '@/components/global/Table/Table.types';

const items: item[] = [
  {
    id: '0',
    amount: 68,
    paymentDeadline: '13-11-2024',
    status: 'Paid'
  },
  {
    id: '1',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Pending'
  },
  {
    id: '2',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Pending'
  },
  {
    id: '3',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Play Now'
  },
  {
    id: '4',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Pending'
  },
]

const page = () => {
  return <div>
    <SavingCard name={'El Pasanaku'} amount={68} collateral={341} startIn='10-10-2024' peopleCount={3} period='montly' />
    <br />
    <hr />
    <br />
    <DetailsCard members={5} interestEarned={5} period='Monthly' finalized='06-10-2024' groupId='454474792930446547' name='Pasanaku' amount={68} />
    <br />
    <br />
    <Table items={items} />
    <br />
    <br />
  </div>;
};

export default page;
