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
    <>
      <MainTabsHeader />
      <div className="flex flex-col gap-6 mt-2">
        {/* <div>
          <h1 className="text-lg font-medium">My wallet balance</h1>
          <MyWalletCard />
        </div> */}
        <Statistics />
        <Activity />
      </div>
    </>
  );
};

export default Page;
