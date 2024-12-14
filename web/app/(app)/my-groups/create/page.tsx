'use client';

import { GroupCreatePage } from '@/vaquita-ui-submodule/components';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

const Page = () => {
  const { publicKey } = useWallet();

  return <GroupCreatePage address={publicKey?.toBase58()} />;
};

export default Page;
