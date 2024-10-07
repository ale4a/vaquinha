import SavingCard from '@/components/global/SavingCard/SavingCard';
import DetailsCard from '../../components/global/DetailsCard/DetailsCard';
import Table from '@/components/global/Table/Table';
import { item } from '@/components/global/Table/Table.types';
import InputText from '@/components/global/form/InputText/InputText';
import InputSelect from '@/components/global/form/InputSelect/InputSelect';
import { Option } from '@/components/global/form/InputSelect/InputSelect.types';

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
    status: 'Pending',
  },
  {
    id: '2',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Pending',
  },
  {
    id: '3',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Play Now',
  },
  {
    id: '4',
    amount: 69,
    paymentDeadline: '14-11-2024',
    status: 'Pending',
  },
];

const optionsCrypto: Option[] = [
  {
    text: 'USDT',
    value: 'USDT',
  },
  {
    text: 'ETH',
    value: 'Etherium',
  },
];

const optionsMembers: Option[] = [
  {
    text: '1',
    value: '1',
  },
  {
    text: '2',
    value: '2',
  },
];

const page = () => {
  return (
    <div>
      <InputText label="Group Name" type="text" />
      <div className="grid grid-cols-2 gap-2">
        <InputText label="Amount" type="number" />
        <InputSelect label="Crypto" options={optionsCrypto} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <InputSelect label="Members" options={optionsMembers} />
        <InputSelect
          label="Payment"
          options={[
            {
              text: 'Monthly',
              value: 'Monthly',
            },
          ]}
        />
        <InputSelect
          label="Start in"
          options={[
            {
              text: '5 days',
              value: '5 days',
            },
          ]}
        />
      </div>
      <br />
      <br />
      <br />
      {/* <SavingCard name={'El Pasanaku'} amount={68} collateral={341} startIn='10-10-2024' peopleCount={3} period='montly' /> */}
      <br />
      <hr />
      <br />
      <DetailsCard
        detail={{
          members: 5,
          interestEarned: 5,
          period: 'Monthly',
          finalized: '06-10-2024',
          groupId: '454474792930446547',
          name: 'Pasanaku',
          amount: 68,
        }}
      />
      <br />
      <br />
      <Table items={items} />
      <br />
      <br />
    </div>
  );
};

export default page;
