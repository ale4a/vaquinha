import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import { ANCHOR_PROVIDER_URL } from '@/config/settings';
import { LogLevel } from '@/types';
import { logError } from '@/utils/log';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  ConfirmedSignatureInfo,
  Connection,
  ParsedTransactionWithMeta,
} from '@solana/web3.js';
import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRotateRight } from 'react-icons/fa6';

interface ItemTransaction {
  parsedTransactionWithMeta: ParsedTransactionWithMeta;
  confirmedSignatureInfo: ConfirmedSignatureInfo;
}

export const Activity = () => {
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [transactions, setTransactions] = useState<ItemTransaction[]>(
    // [...(transactionsDummy as unknown as ItemTransaction[])]
    []
  );
  const { publicKey } = useWallet();
  const connection = useMemo(
    () => new Connection(ANCHOR_PROVIDER_URL!),
    [] // Solo se crea una vez ya que la URL no cambia
  );
  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      if (publicKey) {
        const signatures = await connection.getSignaturesForAddress(publicKey, {
          limit: 10,
        });
        const transactions: ItemTransaction[] = [];
        for (const signature of signatures) {
          try {
            const transacion = await connection.getParsedTransaction(
              // signatures.map((signature) => signature.signature)
              signature.signature
            );
            if (transacion) {
              transactions.push({
                parsedTransactionWithMeta: transacion!,
                confirmedSignatureInfo: signature,
              });
            }
          } catch (error) {
            logError(LogLevel.INFO)(error);
          }
        }
        setTransactions(transactions);
      }
      setLoading(false);
    };
    void getTransactions();
  }, [connection, publicKey, timestamp]);

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-large font-medium">Activity</h1>
        <FaArrowRotateRight onClick={() => setTimestamp(Date.now())} />
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-row gap-2 w-full border-primary-100 p-4 rounded bg-bg-200 mb-2">
            <div className="truncate flex-1 font-semibold">Signature</div>
            <div className="flex-1 text-center font-semibold">Date</div>
            <div className="flex-1 text-center font-semibold">Amount</div>
            <div className="flex-1 text-center font-semibold">Fee (SOL)</div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            {transactions.map(
              ({ parsedTransactionWithMeta, confirmedSignatureInfo }) => {
                const date = new Date(
                  (parsedTransactionWithMeta.blockTime || 0) * 1000
                );
                const amounts: { [key: string]: number } = {};
                for (const p of parsedTransactionWithMeta.meta
                  ?.preTokenBalances ?? []) {
                  amounts[p.owner ?? ''] = +p.uiTokenAmount.amount;
                }
                for (const p of parsedTransactionWithMeta.meta
                  ?.postTokenBalances ?? []) {
                  amounts[p.owner ?? ''] =
                    (+p.uiTokenAmount.amount - amounts[p.owner ?? '']) /
                    10 ** p.uiTokenAmount.decimals;
                }
                const amount = amounts[publicKey?.toBase58() || ''] ?? 0;
                return (
                  <div
                    className="flex flex-row gap-2 w-full border-primary-100 p-4 rounded bg-bg-200"
                    key={parsedTransactionWithMeta.transaction.signatures.join(
                      ','
                    )}
                  >
                    <div className="truncate flex-1">
                      {confirmedSignatureInfo.signature}
                    </div>
                    <div className="flex-1 text-center">
                      <div>{date.toLocaleDateString()}</div>
                      <div>{date.toLocaleTimeString()}</div>
                    </div>
                    <div
                      className={
                        'flex-1 text-center' +
                        (amount > 0 ? ' text-green-500' : '') +
                        (amount < 0 ? ' text-red-500' : '')
                      }
                    >
                      {amount > 0 ? '+' : ''}
                      {amount}
                    </div>
                    <div className="flex-1 text-center">
                      {(parsedTransactionWithMeta.meta?.fee ?? 0) / 1000000000}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
    </>
  );
};
