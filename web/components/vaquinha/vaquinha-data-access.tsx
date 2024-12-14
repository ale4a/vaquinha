'use client';

import { logError, logMessage } from '@/vaquita-ui-submodule/helpers';
import { BN } from '@coral-xyz/anchor';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getVaquinhaProgram, getVaquinhaProgramId } from '@vaquinha/anchor';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { initiateTransfer } from '../../utils/crypto';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export const useProgramMethods = () => {
  const provider = useAnchorProvider();
  const wallet = useWallet();
  const transactionToast = useTransactionToast();
  const program = getVaquinhaProgram(provider);

  return {
    initializeRound: async function (
      roundId: string,
      paymentAmount: number,
      numberOfPlayers: number,
      frequencyOfTurns: number,
      tokenMintAddress: string,
      position: number
    ) {
      const paymentAmountBN = new BN(paymentAmount);
      const frequencyOfTurnsBN = new BN(frequencyOfTurns);

      const tokenMint = new PublicKey(tokenMintAddress);

      const [roundPDA, _bump] = await PublicKey.findProgramAddress(
        [Buffer.from('round'), Buffer.from(roundId)],
        program.programId
      );

      const roundTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        roundPDA,
        true
      );

      // Create the associated token account instruction
      const createAtaIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey as PublicKey, // payer
        roundTokenAccount, // ata address
        roundPDA, // owner
        tokenMint // mint
      );

      const initializerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey as PublicKey
      );

      try {
        const tx = await program.methods
          .initializeRound(
            roundId,
            paymentAmountBN,
            numberOfPlayers,
            frequencyOfTurnsBN,
            position - 1
          ) // 0-indexed position
          .accounts({
            round: roundPDA,
            initializer: wallet.publicKey as PublicKey,
            tokenMint: tokenMint,
            initializerTokenAccount: initializerTokenAccount,
            roundTokenAccount: roundTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .preInstructions([createAtaIx])
          .rpc();

        console.log('Transaction signature:', tx);
        console.log('Round initialized:', roundPDA.toString());
        const result = await initiateTransfer(roundTokenAccount.toString());
        console.log({ result });
        transactionToast(tx);
        return { tx };
      } catch (error) {
        console.error('Error initializing round:', error);
        return { error };
      }
    },

    addPlayer: async function (
      roundId: string,
      tokenMintAddress: string,
      position: number
    ) {
      const tokenMint = new PublicKey(tokenMintAddress);
      const playerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey as PublicKey
      );
      const [roundPDA, _bump] = await PublicKey.findProgramAddress(
        [Buffer.from('round'), Buffer.from(roundId)],
        program.programId
      );
      const roundTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        roundPDA,
        true
      );
      try {
        const tx = await program.methods
          .addPlayer(position - 1) // 0-indexed position
          .accounts({
            round: roundPDA,
            player: wallet.publicKey as PublicKey,
            playerTokenAccount: playerTokenAccount,
            roundTokenAccount: roundTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        console.log('Transaction signature:', tx);
        console.log('Round Joined:', roundPDA.toString());
        transactionToast(tx);
        return { tx, error: '' };
      } catch (error) {
        try {
          const round = await program.account.round.fetch(roundPDA);
          for (const playerPublicKey of (round.players as PublicKey[]) || []) {
            if (
              playerPublicKey?.toBase58?.() === wallet.publicKey?.toBase58()
            ) {
              logMessage('Adding player: No tx validating add player');
              return {
                tx: 'Adding player: No tx validating add player',
                error: '',
              };
            }
          }
        } catch (error) {
          logError('Error on validating add player', error);
        }
        logError('Error adding player', error);
        return { tx: '', error };
      }
    },

    payTurn: async function (
      roundId: string,
      tokenMintAddress: string,
      turn: number
    ) {
      const tokenMint = new PublicKey(tokenMintAddress);
      const playerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey as PublicKey
      );
      const [roundPDA, _bump] = await PublicKey.findProgramAddress(
        [Buffer.from('round'), Buffer.from(roundId)],
        program.programId
      );
      const roundTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        roundPDA,
        true
      );

      console.log({ turn });

      try {
        const tx = await program.methods
          .payTurn(turn)
          .accounts({
            round: roundPDA,
            player: wallet.publicKey as PublicKey,
            playerTokenAccount: playerTokenAccount,
            roundTokenAccount: roundTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        console.log('Transaction signature:', tx);
        console.log('Round Joined:', roundPDA.toString());
        transactionToast(tx);
        return { tx };
      } catch (error) {
        console.error('Error paying turn:', error);
        return { error };
      }
    },

    withdrawTurn: async function (roundId: string, tokenMintAddress: string) {
      const tokenMint = new PublicKey(tokenMintAddress);
      const playerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey as PublicKey
      );
      const [roundPDA, _bump] = await PublicKey.findProgramAddress(
        [Buffer.from('round'), Buffer.from(roundId)],
        program.programId
      );
      const roundTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        roundPDA,
        true
      );
      try {
        const tx = await program.methods
          .withdrawTurn()
          .accounts({
            round: roundPDA,
            player: wallet.publicKey as PublicKey,
            playerTokenAccount: playerTokenAccount,
            roundTokenAccount: roundTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        console.log('Transaction signature:', tx);
        console.log('Round Withdrawal successful:', roundPDA.toString());
        transactionToast(tx);
        return { tx };
      } catch (error) {
        console.error('Error withdrawing turn:', error);
        return { error };
      }
    },
    withdrawCollateral: async function (
      roundId: string,
      tokenMintAddress: string
    ) {
      const tokenMint = new PublicKey(tokenMintAddress);
      const playerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey as PublicKey
      );
      const [roundPDA, _bump] = await PublicKey.findProgramAddress(
        [Buffer.from('round'), Buffer.from(roundId)],
        program.programId
      );

      const roundTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        roundPDA,
        true
      );

      try {
        const tx = await program.methods
          .withdrawCollateral()
          .accounts({
            round: roundPDA,
            player: wallet.publicKey as PublicKey,
            playerTokenAccount: playerTokenAccount,
            roundTokenAccount: roundTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        console.log('Transaction signature:', tx);
        console.log('Collateral Withdrawal successful:', roundPDA.toString());
        transactionToast(tx);
        return { tx };
      } catch (error) {
        console.error('Error withdrawing collateral:', error);
        return { error };
      }
    },
    withdrawInterest: async function (
      roundId: string,
      tokenMintAddress: string
    ) {
      const tokenMint = new PublicKey(tokenMintAddress);
      const playerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey as PublicKey
      );
      const [roundPDA, _bump] = await PublicKey.findProgramAddress(
        [Buffer.from('round'), Buffer.from(roundId)],
        program.programId
      );
      const roundTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        roundPDA,
        true
      );
      try {
        const tx = await program.methods
          .withdrawInterest()
          .accounts({
            round: roundPDA,
            player: wallet.publicKey as PublicKey,
            playerTokenAccount: playerTokenAccount,
            roundTokenAccount: roundTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        console.log('Transaction signature:', tx);
        console.log('Interest Withdrawal successful:', roundPDA.toString());
        transactionToast(tx);
        return { tx };
      } catch (error) {
        console.error('Error withdrawing collateral:', error);
        return { error };
      }
    },
  };
};

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
