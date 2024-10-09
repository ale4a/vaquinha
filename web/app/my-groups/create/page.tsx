'use client';

import Button from '@/components/global/ButtonComponent/ButtonComponent';
import InputSelect from '@/components/global/form/InputSelect/InputSelect';
import { Option } from '@/components/global/form/InputSelect/InputSelect.types';
import InputText from '@/components/global/form/InputText/InputText';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import Message from '@/components/message/Message';
import Summary from '@/components/Summary/Summary';
import { Group, GroupCrypto } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const optionsCrypto: Option<GroupCrypto>[] = [
  {
    text: 'USDC',
    value: GroupCrypto.USDC,
  },
  {
    text: 'SOL',
    value: GroupCrypto.SOL,
  },
];
const optionsMembers: Option<number>[] = [
  {
    text: '2',
    value: 2,
  },
  {
    text: '3',
    value: 3,
  },
  {
    text: '4',
    value: 4,
  },
  {
    text: '5',
    value: 5,
  },
  {
    text: '6',
    value: 6,
  },
  {
    text: '8',
    value: 8,
  },
  {
    text: '10',
    value: 10,
  },
  {
    text: '15',
    value: 15,
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
const messageText =
  'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately';

const ONE_DAY = 86400000;

const Page = () => {
  const [newGroup, setNewGroup] = useState<
    Pick<Group, 'name' | 'amount' | 'crypto' | 'members' | 'period' | 'startIn'>
  >({
    name: '',
    amount: 50,
    crypto: GroupCrypto.USDC,
    members: 2,
    period: 'weekly',
    startIn: ONE_DAY,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/group/create', {
        method: 'POST',
        body: JSON.stringify(newGroup),
      });
      router.push('/my-groups?tab=pending');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          style={{ height: 100, width: 100 }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <TabTitleHeader text="Group Information" />
      <div className="flex flex-col justify-center">
        <div>
          <div className="mb-3">
            <InputText
              label="Group Name"
              type="text"
              value={newGroup.name}
              onChange={(name) =>
                setNewGroup((prevState) => ({ ...prevState, name }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <InputText<number>
              label="Amount"
              type="number"
              value={newGroup.amount}
              onChange={(amount) =>
                setNewGroup((prevState) => ({ ...prevState, amount }))
              }
            />
            <InputSelect
              label="Crypto"
              options={optionsCrypto}
              defaultValue={optionsCrypto[0].value}
              value={newGroup.crypto}
              onChange={(crypto) =>
                setNewGroup((prevState) => ({ ...prevState, crypto }))
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-5 mb-4">
            <InputSelect<number>
              label="Members"
              options={optionsMembers}
              value={newGroup.members}
              onChange={(members) =>
                setNewGroup((prevState) => ({ ...prevState, members }))
              }
            />
            <InputSelect
              label="Payment period"
              options={[
                {
                  text: 'Monthly',
                  value: 'monthly',
                },
                {
                  text: 'Weekly',
                  value: 'weekly',
                },
              ]}
              value={newGroup.period}
              onChange={(period) =>
                setNewGroup((prevState) => ({ ...prevState, period }))
              }
            />
            <InputSelect
              label="Start in"
              options={[
                {
                  text: '1 day',
                  value: ONE_DAY,
                },
                {
                  text: '2 days',
                  value: ONE_DAY * 2,
                },
                {
                  text: '5 days',
                  value: ONE_DAY * 5,
                },
              ]}
              value={newGroup.startIn}
              onChange={(startIn) =>
                setNewGroup((prevState) => ({ ...prevState, startIn }))
              }
            />
          </div>
          <div className="flex justify-center text-2xl text-accent-100">
            Group Information
          </div>
          <div className="mb-5 text-accent-100">
            <Summary
              itemsSummary={[
                {
                  title: 'Crypto',
                  result: newGroup.crypto,
                },
                {
                  title: 'Group name',
                  result: newGroup.name,
                },
                {
                  title: 'Amount',
                  result: newGroup.amount,
                },
                {
                  title: 'Collateral',
                  result: newGroup.amount * newGroup.members,
                },
                {
                  title: 'Members',
                  result: newGroup.members,
                },
                {
                  title: 'Payment period',
                  result: newGroup.period,
                },
                {
                  title: 'Start In',
                  result:
                    newGroup.startIn === ONE_DAY
                      ? '1 day'
                      : newGroup.startIn / ONE_DAY + ' days',
                },
              ]}
            />
          </div>
          <Message messageText={messageText} />
          <div className="flex gap-5 my-5">
            <div className="w-9/12">
              <Link href="/my-groups">
                <Button label="Cancel" type="secondary" size="large" />
              </Link>
            </div>
            <Button
              label="Deposit Collateral"
              type="primary"
              size="large"
              onClick={onSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;