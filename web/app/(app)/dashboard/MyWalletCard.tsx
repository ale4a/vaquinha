import InfoCard from '@/components/global/InfoCard/InfoCard';
import { ANCHOR_PROVIDER_URL, USDC_MINT_ADDRESS } from '@/config/settings';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import React, { useEffect, useMemo, useState } from 'react';

export const MyWalletCard = () => {
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const { publicKey } = useWallet();

  const connection = useMemo(
    () => new Connection(ANCHOR_PROVIDER_URL!),
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
    <InfoCard
      address={formattedAddress}
      savedAmount={usdcBalance || 0}
      growth="+0.00 (1D)"
    />
  );
};
