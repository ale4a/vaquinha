'use client';

import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import { MyGroupsPage } from '@/vaquita-ui-submodule/components/group/MyGroupsPage';
import { MainHeader } from '@/vaquita-ui-submodule/components/header';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

const Page = () => {
  const { publicKey } = useWallet();

  return (
    <>
      <MainHeader
        walletButtons={
          <>
            <WalletButton />
            <ClusterUiSelect />
          </>
        }
      />
      <MyGroupsPage address={publicKey?.toBase58()} />
    </>
  );
};

export default Page;
