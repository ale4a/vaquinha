'use client';

import { GroupViewPage } from '@/vaquita-ui-submodule/components';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

const Page = () => {
  const { publicKey } = useWallet();

  return <GroupViewPage address={publicKey?.toBase58()} />;
};

export default Page;
