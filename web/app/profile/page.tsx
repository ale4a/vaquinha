'use client';
import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import InfoCard from '@/components/global/InfoCard/InfoCard';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import React, { useEffect, useMemo, useState } from 'react';

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

const USDC_MINT_ADDRESS = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;

const Page = () => {
  const { publicKey } = useWallet();
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);

  const connection = useMemo(
    () => new Connection(process.env.NEXT_PUBLIC_ANCHOR_PROVIDER_URL!),
    [] // Solo se crea una vez ya que la URL no cambia
  );

  useEffect(() => {
    if (publicKey) {
      setFormattedAddress(
        `${publicKey.toBase58().slice(0, 4)}...${publicKey
          .toBase58()
          .slice(-4)}`
      );
      const getTokenAccounts = async () => {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: new PublicKey(
              'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' // Programa de tokens SPL
            ),
          }
        );

        tokenAccounts.value.forEach((accountInfo) => {
          const accountData = accountInfo.account.data.parsed.info;
          if (accountData.mint === USDC_MINT_ADDRESS) {
            setUsdcBalance(parseFloat(accountData.tokenAmount.uiAmountString));
          }
        });
      };

      getTokenAccounts();
    } else {
      setFormattedAddress(null);
      setUsdcBalance(null);
    }
  }, [publicKey, connection]);

  return (
    <>
      <div className="h-20 ">
        <MainTabsHeader />
      </div>
      <div className="mt-4">
        <InfoCard
          address={formattedAddress}
          savedAmount={usdcBalance || 0}
          growth="+0.00 (1D)"
        />
      </div>
    </>
  );
};

export default Page;
