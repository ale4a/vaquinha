import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent label={'Deposit Collateral'} type={'primary'} />
      <ButtonComponent label={'Back'} type={'secondary'} />
      <ButtonComponent label={"It's Your Turn to Receive"} type={'outline'} />
      <ButtonComponent label={'Payout Received'} type={'disabled'} />
      <ButtonComponent label={'Leave the Group'} type={'danger'} />
      <ButtonComponent label={'View Group'} type={'info'} />
      <ButtonComponent label={'Pay Now'} type={'success'} />
      <ButtonComponent label={'Pending'} type={'muted'} disabled />
    </div>
  );
};

export default page;
