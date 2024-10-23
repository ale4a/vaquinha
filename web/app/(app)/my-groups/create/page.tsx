'use client';

import Button from '@/components/global/ButtonComponent/ButtonComponent';
import ErrorView from '@/components/global/Error/ErrorView';
import { InputDate } from '@/components/global/form';
import InputSelect from '@/components/global/form/InputSelect/InputSelect';
import { Option } from '@/components/global/form/InputSelect/InputSelect.types';
import InputText from '@/components/global/form/InputText/InputText';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import { GroupSummary } from '@/components/group/GroupSummary/GroupSummary';
import Message from '@/components/message/Message';
import { ONE_DAY } from '@/config/constants';
import { useGroup, useVaquinhaDeposit } from '@/hooks';
import { GroupCreateDTO, GroupCrypto, GroupPeriod, LogLevel } from '@/types';
import { showNotification } from '@/utils/commons';
import { logError } from '@/utils/log';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
    text: '12',
    value: 12,
  },
];

const messageText =
  'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately';

const Page = () => {
  const now = new Date();
  const [newGroup, setNewGroup] = useState<
    Omit<GroupCreateDTO, 'customerPublicKey' | 'transactionSignature'>
  >({
    name: '',
    amount: 0,
    crypto: GroupCrypto.USDC,
    totalMembers: 2,
    period: GroupPeriod.MONTHLY,
    startsOnTimestamp: now.getTime() + ONE_DAY,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { publicKey } = useWallet();
  const { depositCollateralAndCreate } = useVaquinhaDeposit();
  const { createGroup, depositGroupCollateral, deleteGroup } = useGroup();
  useEffect(() => {
    if (!publicKey) {
      router.push('/groups');
    }
  }, [router, publicKey]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!publicKey) {
    return <ErrorView />;
  }

  const onSave = async () => {
    setLoading(true);
    try {
      const group = await createGroup(
        newGroup.name,
        newGroup.amount,
        newGroup.crypto,
        newGroup.totalMembers,
        newGroup.period,
        newGroup.startsOnTimestamp,
        publicKey
      );
      if (typeof group.id !== 'string') {
        throw new Error('group not created');
      }
      const amount = group.collateralAmount;
      const { tx, error, success } = await depositCollateralAndCreate(group);
      if (!success) {
        await deleteGroup(group.id);
        logError(LogLevel.INFO)(error);
        throw new Error('transaction error');
      }
      await depositGroupCollateral(group.id, publicKey, tx, amount);
      router.push('/my-groups?tab=pending');
      showNotification('Group created successfully!', 'success');
    } catch (error) {
      logError(LogLevel.INFO)(error);
      showNotification('Failed to create group.', 'error');
    }
    setLoading(false);
  };

  const filterDateTime = (time: Date) => {
    const selectedDate = new Date(time);
    return (
      selectedDate.getTime() >= now.getTime() &&
      selectedDate.getTime() - ONE_DAY * 7 <= now.getTime()
    );
  };

  return (
    <div className="px-4">
      <TabTitleHeader text="Create new group" />
      <div className="flex flex-col justify-center gap-2">
        <div className="flex flex-col gap-2 w-full ">
          <label className="text-sm mb-0.5 text-accent-100">Name *</label>
          <InputText
            label="Group Name *"
            type="text"
            placeHolder="e.g. Pasanaku 2024"
            value={newGroup.name}
            onChange={(name) =>
              setNewGroup((prevState) => ({
                ...prevState,
                name: name,
              }))
            }
          />

          {/* {!newGroup.name && <p className="text-accent-100">Required</p>} */}
        </div>
        <div className="flex gap-2 w-full">
          <div className="w-1/2">
            <label className="text-sm mb-0.5 text-accent-100">Amount *</label>
            <InputText<number>
              label="Amount"
              type="number"
              value={newGroup.amount}
              placeHolder="e.g. 300"
              onChange={(amount) => {
                const updatedAmount = amount === undefined ? 0 : amount;

                setNewGroup((prevState) => ({
                  ...prevState,
                  amount: updatedAmount,
                }));
              }}
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm mb-0.5 text-accent-100">Crypto</label>
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
        </div>
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label className="text-sm mb-0.5 text-accent-100">
              Payment period
            </label>
            <InputSelect
              label="Payment period"
              options={[
                {
                  text: 'Monthly',
                  value: GroupPeriod.MONTHLY,
                },
                {
                  text: 'Weekly',
                  value: GroupPeriod.WEEKLY,
                },
              ]}
              value={newGroup.period}
              onChange={(period) =>
                setNewGroup((prevState) => ({ ...prevState, period }))
              }
            />
          </div>
          {/* <div className="w-1/2">
            <label className="text-sm mb-0.5 text-accent-100">Starts in</label>
            <InputDate
              label="Starts in"
              value={new Date(newGroup.startsOnTimestamp)}
              onChange={(date) =>
                setNewGroup((prevState) => ({
                  ...prevState,
                  startsOnTimestamp: date.getTime(),
                }))
              }
              filterTime={filterDateTime}
              filterDate={filterDateTime}
            />
          </div> */}
          <div className="w-1/2">
            <label className="text-sm mb-0.5 text-accent-100">Members</label>
            <InputSelect<number>
              label="Members"
              options={optionsMembers}
              value={newGroup.totalMembers}
              onChange={(totalMembers) =>
                setNewGroup((prevState) => ({
                  ...prevState,
                  totalMembers: +totalMembers,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-center text-2xl text-accent-100">
          Group Information
        </div>
        <div className="mb-5">
          <GroupSummary {...newGroup} />
        </div>
        <Message messageText={messageText} />
        <div className="flex flex-col gap-5 my-5 justify-between">
          <Button
            label="Create and deposit collateral"
            type="primary"
            size="large"
            onClick={onSave}
            disabled={!(newGroup.name.length > 2 && newGroup.amount > 0)}
          />
          <Link href="/my-groups" className="contents">
            <Button label="Cancel" type="secondary" size="large" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
