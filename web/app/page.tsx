'use client';

import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import { Home } from '@/vaquita-ui-submodule/components';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Page() {
  const { connected } = useWallet();

  return (
    <Home
      walletButton={<WalletButton />}
      walletButtons={
        <>
          <WalletButton />
          <ClusterUiSelect />
        </>
      }
      isConnected={connected}
    />
  );
}
