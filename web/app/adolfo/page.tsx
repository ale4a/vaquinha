import ButtonComponent from '@/components/global/ButtonComponent/ButtonComponent';
import Message from '@/components/message/Message';
import BuildingStatus from '@/components/status/BuildingStatus';
import StatusStarted from '@/components/status/started/StatusStarted';
import Summary from '@/components/Summary/Summary';
import SummaryFooter from '@/components/SummaryFooter/SummaryFooter';
import React from 'react';

const page = () => {
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

  const itemsSummaryFooter = [
    {
      title: 'Total Saved',
      result: '341 USDT',
    },
    {
      title: 'Interest earned',
      result: '21.28 USDT (8%)',
    },
    {
      title: 'withdraw collateral',
      result: '341 USDT',
    },
  ];
  const messageText =
    'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately';

  const showFirst = false;
  const showSecond = false;
  const showThird = false;
  return (
    <div>
      <Summary itemsSummary={itemsSummary} />
      <SummaryFooter itemsSummary={itemsSummaryFooter} />
      <Message messageText={messageText} />
      <BuildingStatus
        value1={showFirst}
        value2={showSecond}
        value3={showThird}
      />
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
