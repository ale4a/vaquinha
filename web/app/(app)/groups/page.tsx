'use client';

import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import { GroupsPage, MainHeader } from '@/vaquita-ui-submodule/components';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

const GroupPage = () => {
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
      <GroupsPage address={publicKey?.toBase58()} />
    </>
  );
};

export default GroupPage;
