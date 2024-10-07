import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import SavingCard from '@/components/global/SavingCard/SavingCard';
import TabsComponent from '@/components/global/TabsComponent/TabsComponent';
import React from 'react';

const tabs = [
  { label: 'USDT', value: 'usdt' },
  { label: 'SOL', value: 'sol' },
];

const page = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* <ButtonComponent label={'Deposit Collateral'} type={'primary'} />
      <ButtonComponent label={'Back'} type={'secondary'} />
      <ButtonComponent label={"It's Your Turn to Receive"} type={'outline'} />
      <ButtonComponent label={'Payout Received'} type={'disabled'} />
      <ButtonComponent label={'Leave the Group'} type={'danger'} />
      <ButtonComponent label={'View Group'} type={'info'} />
      <ButtonComponent label={'Pay Now'} type={'success'} />
      <ButtonComponent label={'Pending'} type={'muted'} disabled /> */}

      <div className="flex justify-center">
        <TabsComponent tabs={tabs} />
      </div>
      <div className="flex flex-col gap-4">
        <SavingCard
          name={'El Pasanaku'}
          amount={68}
          collateral={341}
          startIn="10-10-2024"
          peopleCount={3}
          period="montly"
        />
        <SavingCard
          name={'El Pasanaku'}
          amount={68}
          collateral={341}
          startIn="10-10-2024"
          peopleCount={3}
          period="montly"
        />
        <SavingCard
          name={'El Pasanaku'}
          amount={68}
          collateral={341}
          startIn="10-10-2024"
          peopleCount={3}
          period="montly"
        />
        <SavingCard
          name={'El Pasanaku'}
          amount={68}
          collateral={341}
          startIn="10-10-2024"
          peopleCount={3}
          period="montly"
        />
        <SavingCard
          name={'El Pasanaku'}
          amount={68}
          collateral={341}
          startIn="10-10-2024"
          peopleCount={3}
          period="montly"
        />
        <SavingCard
          name={'El Pasanaku'}
          amount={68}
          collateral={341}
          startIn="10-10-2024"
          peopleCount={3}
          period="montly"
        />
      </div>
    </div>
  );
};

export default page;
