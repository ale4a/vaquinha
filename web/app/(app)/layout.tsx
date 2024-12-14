import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import { MainLayout } from '@/vaquita-ui-submodule/components';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout
      walletButtons={
        <>
          <WalletButton />
          <ClusterUiSelect />
        </>
      }
    >
      {children}
    </MainLayout>
  );
}
