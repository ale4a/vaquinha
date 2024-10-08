'use client';

import InputSelect from '@/components/global/form/InputSelect/InputSelect';
import InputText from '@/components/global/form/InputText/InputText';
import { Option } from '@/components/global/form/InputSelect/InputSelect.types';
import Summary from '@/components/Summary/Summary';
import Message from '@/components/message/Message';
import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';


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

const itemsSummary = [
  {
    title: 'Crypto',
    result: 'USDT',
  },
  {
    title: 'Group name',
    result: 'Pasanaku',
  },
  {
    title: 'Amount',
    result: '68 USDT',
  },
  {
    title: 'Collateral',
    result: '341 USDT',
  },
  {
    title: 'Members',
    result: '3/5',
  },
  {
    title: 'Payment period',
    result: 'Monthly',
  },
  {
    title: 'Start In',
    result: '10-10-2024 (3 days)',
  },
];
const messageText ='It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately';

const Page = () => {
  

  return (
    <div className="flex flex-col justify-center">
      <div>
        <div className='mb-3'>
          <InputText label="Group Name" type="text" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <InputText label="Amount" type="number" />
          <InputSelect label="Crypto" options={optionsCrypto} defaultValue={optionsCrypto[0].value}/>
        </div>
        <div className="grid grid-cols-3 gap-5 mb-4">
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
        <div className='flex justify-center text-2xl'>Group Information</div>
        <div className='mb-5'>
          <Summary itemsSummary={itemsSummary} />
        </div>
        <Message messageText={messageText} />
        <div className='flex gap-5 my-5'>
          <div className='w-9/12'>
            <ButtonComponent label='Cancel' type='secondary' size='large' />
          </div>
          <ButtonComponent label='Deposit Collateral' type='primary' size='large' />
        </div>
      </div>
    </div>
  );
};

export default Page;
