import SavingCard from '@/components/SavingCard/SavingCard';
import React from 'react';

const page = () => {
  return <div>
    <SavingCard name={'El Pasanaku'} amount={68} collateral={341} startIn='10-10-2024' peopleCount={3} period='montly' />
  </div>;
};

export default page;
