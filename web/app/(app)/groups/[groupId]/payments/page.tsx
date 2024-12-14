'use client';

import { GroupPaymentsPage } from '@/vaquita-ui-submodule/components';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

const PaymentsPage = () => {
  const { publicKey } = useWallet();

  return <GroupPaymentsPage address={publicKey?.toBase58()} />;
};

export default PaymentsPage;
