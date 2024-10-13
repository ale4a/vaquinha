'use client';

import Button from '@/components/global/ButtonComponent/ButtonComponent';
import { InputDate } from '@/components/global/form';
import InputSelect from '@/components/global/form/InputSelect/InputSelect';
import { Option } from '@/components/global/form/InputSelect/InputSelect.types';
import InputText from '@/components/global/form/InputText/InputText';
import TabTitleHeader from '@/components/global/Header/TabTitleHeader';
import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import { GroupSummary } from '@/components/group/GroupSummary/GroupSummary';
import Message from '@/components/message/Message';
import { ONE_DAY } from '@/config/constants';
import {
  GroupCreateDTO,
  GroupCrypto,
  GroupDepositDTO,
  GroupPeriod,
  LogLevel,
} from '@/types';
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
    amount: 50,
    crypto: GroupCrypto.USDC,
    totalMembers: 2,
    period: GroupPeriod.MONTHLY,
    startsOnTimestamp: now.getTime() + ONE_DAY,
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
    setLoading(true);
    if (publicKey) {
      try {
        const newGroupPayload: GroupCreateDTO = {
          name: newGroup.name,
          amount: newGroup.amount,
          crypto: newGroup.crypto,
          totalMembers: newGroup.totalMembers,
          period: newGroup.period,
          startsOnTimestamp: newGroup.startsOnTimestamp,
          customerPublicKey: publicKey?.toBase58(),
        };
        const result = await fetch('/api/group/create', {
          method: 'POST',
          body: JSON.stringify(newGroupPayload),
        });
        const body = await result.json();
        const groupId = body?.content?.id;
        if (typeof groupId !== 'string') {
          throw new Error('group not created');
        }
        // START: WALLET
        const paymentAmount = newGroup.amount * USDC_DECIMALS;
        const numberOfPlayers = newGroup.totalMembers;
        const frequencyOfTurns = convertFrequencyToTimestamp(newGroup.period);
        const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Circle USDC
        const { tx, error } = await initializeRound(
          paymentAmount,
          numberOfPlayers,
          frequencyOfTurns,
          tokenMintAddress
        );
        const txt = tx + 'test'; // TODO: only for development process

        if (!tx) {
          await fetch(`/api/group/${groupId}`, {
            method: 'DELETE',
          });
          throw error;
        }
        // END: WALLET
        const collateralAmount = newGroup.amount * newGroup.totalMembers;
        const depositPayload: GroupDepositDTO = {
          customerPublicKey: publicKey.toBase58(),
          transactionSignature: txt,
          round: 0,
          amount: collateralAmount,
        };
        await fetch(`/api/group/${groupId}/deposit`, {
          method: 'POST',
          body: JSON.stringify(depositPayload),
        });

        router.push('/my-groups?tab=pending');
      } catch (error) {
        logError(LogLevel.INFO)(error);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const filterDateTime = (time: Date) => {
    const selectedDate = new Date(time);
    return (
      selectedDate.getTime() >= now.getTime() &&
      selectedDate.getTime() - ONE_DAY * 7 <= now.getTime()
    );
  };

  return (
    <div>
      <TabTitleHeader text="Create new group" />
      <div className="flex flex-col justify-center">
        <div>
          <div className="mb-3">
            <InputText
              label="Group Name"
              type="text"
              value={newGroup.name}
              onChange={(name) =>
                setNewGroup((prevState) => ({
                  ...prevState,
                  name: name,
                }))
              }
            />
            {!newGroup.name && <p className="text-accent-100">Required</p>}
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
          </div>
          <div className="flex justify-center text-2xl text-accent-100">
            Group Information
          </div>
          <div className="mb-5">
            <GroupSummary {...newGroup} />
          </div>
          <Message messageText={messageText} />
          <div className="flex gap-5 my-5 justify-between">
            <Link href="/my-groups" className="contents">
              <Button
                label="Cancel"
                type="secondary"
                size="large"
                className="flex-1"
              />
            </Link>
            <Button
              label="Deposit Collateral"
              type="primary"
              size="large"
              onClick={onSave}
              disabled={!newGroup.name.length}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
