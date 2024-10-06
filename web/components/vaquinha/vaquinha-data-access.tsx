'use client';

import { getVaquinhaProgram, getVaquinhaProgramId } from '@vaquinha/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useVaquinhaProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getVaquinhaProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getVaquinhaProgram(provider);

  const accounts = useQuery({
    queryKey: ['vaquinha', 'all', { cluster }],
    queryFn: () => program.account.vaquinha.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['vaquinha', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ vaquinha: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useVaquinhaProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useVaquinhaProgram();

  const accountQuery = useQuery({
    queryKey: ['vaquinha', 'fetch', { cluster, account }],
    queryFn: () => program.account.vaquinha.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['vaquinha', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ vaquinha: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['vaquinha', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ vaquinha: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['vaquinha', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ vaquinha: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['vaquinha', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ vaquinha: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
