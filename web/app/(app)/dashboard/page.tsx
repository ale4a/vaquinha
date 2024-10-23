'use client';
import { Activity } from '@/app/(app)/dashboard/Activity';
import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { MyWalletCard } from './MyWalletCard';
import { Statistics } from './Statistics';

// Validación de variables de entorno
if (!process.env.NEXT_PUBLIC_ANCHOR_PROVIDER_URL) {
  throw new Error(
    'La variable NEXT_PUBLIC_ANCHOR_PROVIDER_URL no está definida en el archivo .env'
  );
}
if (!process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS) {
  throw new Error(
    'La variable NEXT_PUBLIC_USDC_MINT_ADDRESS no está definida en el archivo .env'
  );
}

const Page = () => {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <>
        <MainTabsHeader />
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <p className="text-accent-100">Please select a wallet</p>
        </div>
      </>
    );
  }

  return (
    <div className="px-4">
      <div className="h-20 ">
        <MainTabsHeader />
      </div>
      <div className="mt-4">
        <h1>My wallet balance</h1>
        <MyWalletCard />
        <h1>Statistics</h1>
        <Statistics />
        <Activity />
      </div>
    </div>
  );
};

export default Page;
