'use client';

import Button from '@/components/global/ButtonComponent/ButtonComponent';
import InputSelect from '@/components/global/form/InputSelect/InputSelect';
import { Option } from '@/components/global/form/InputSelect/InputSelect.types';
import InputText from '@/components/global/form/InputText/InputText';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import Message from '@/components/message/Message';
import Summary from '@/components/Summary/Summary';
import { GroupCreateDTO, GroupCrypto, LogLevel } from '@/types';
import { logError } from '@/utils/log';
import { BN } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useInitializeRound } from '../../../components/vaquinha/vaquinha-data-access';

const USDC_DECIMALS = 1000000;

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

const messageText =
  'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately';

const ONE_DAY = 86400000;

const Page = () => {
  const [newGroup, setNewGroup] = useState<GroupCreateDTO>({
    name: '',
    amount: 50,
    crypto: GroupCrypto.USDC,
    totalMembers: 2,
    period: 'weekly',
    startsOnTimestamp: ONE_DAY,
    customerPublicKey: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { publicKey } = useWallet();
  const { initializeRound } = useInitializeRound();
  useEffect(() => {
    if (!publicKey) {
      router.push('/groups');
    }
  }, [router, publicKey]);

  const convertFrequencyToTimestamp = (period: 'weekly' | 'monthly'): BN => {
    const SECONDS_PER_DAY = 86400; // 24 hours * 60 minutes * 60 seconds
    const frequencyInDays = period === 'weekly' ? 7 : 30;
    const frequencyInSeconds = frequencyInDays * SECONDS_PER_DAY;
    // Return as BN (Big Number) which is commonly used for large integers in Solana
    return new BN(frequencyInSeconds);
  };

  const onSave = async () => {
    const paymentAmount = newGroup.amount * USDC_DECIMALS;
    const numberOfPlayers = newGroup.totalMembers;
    const frequencyOfTurns = convertFrequencyToTimestamp(newGroup.period);
    const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Circle USDC

    setLoading(true);
    const { tx, error } = await initializeRound(
      paymentAmount,
      numberOfPlayers,
      frequencyOfTurns,
      tokenMintAddress
    );

    if (tx) {
      try {
        await fetch('/api/group/create', {
          method: 'POST',
          body: JSON.stringify({
            ...newGroup,
            customerPublicKey: publicKey,
          }),
        });
        router.push('/my-groups?tab=pending');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('---------------------------------');
      logError(LogLevel.INFO)(error);
    }

    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const startsIn = Math.ceil(
    (newGroup.startsOnTimestamp - Date.now()) / ONE_DAY
  );

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
              value={newGroup.totalMembers}
              onChange={(totalMembers) =>
                setNewGroup((prevState) => ({ ...prevState, totalMembers }))
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
              value={newGroup.startsOnTimestamp}
              onChange={(gap) =>
                setNewGroup((prevState) => ({
                  ...prevState,
                  startsOnTimestamp: Date.now() + gap,
                }))
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
                  result: newGroup.amount * newGroup.totalMembers,
                },
                {
                  title: 'Members',
                  result: newGroup.totalMembers,
                },
                {
                  title: 'Payment period',
                  result: newGroup.period,
                },
                {
                  title: 'Starts In',
                  result: startsIn ? '1 day' : startsIn + ' days',
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
