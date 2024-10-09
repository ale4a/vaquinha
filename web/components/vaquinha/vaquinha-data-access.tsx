'use client';

import { getVaquinhaProgram, getVaquinhaProgramId } from '@vaquinha/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { BN } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

export const useInitializeRound = () => {
  const provider = useAnchorProvider();
  const wallet = useWallet();
  const transactionToast = useTransactionToast();

  return {
    initializeRound: async function (paymentAmount: number,
      numberOfPlayers: number,
      frequencyOfTurns: number,
      tokenMintAddress: string) {

      const roundKeypair = Keypair.generate();
      const paymentAmountBN = new BN(paymentAmount);
      const frequencyOfTurnsBN = new BN(frequencyOfTurns);

      const tokenMint = new PublicKey(tokenMintAddress);
      const program = getVaquinhaProgram(provider);

      // const [roundTokenAccount, _bump] = await PublicKey.findProgramAddressSync(
      //   [Buffer.from("round_token_account"), roundKeypair.publicKey.toBuffer()],
      //   program.programId
      // );
      const roundTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        roundKeypair.publicKey
      );

      // Create the associated token account instruction
      const createAtaIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey as PublicKey, // payer
        roundTokenAccount, // ata address
        roundKeypair.publicKey, // owner
        tokenMint // mint
      );

      const initializerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey as PublicKey
      );

      // console.log('[', roundKeypair.publicKey, wallet.publicKey, tokenMint, initializerTokenAccount, roundTokenAccount, TOKEN_PROGRAM_ID, SystemProgram.programId, ']');

      try {
        const tx = await program.methods
          .initializeRound(paymentAmountBN, numberOfPlayers, frequencyOfTurnsBN)
          .accounts({
            round: roundKeypair.publicKey,
            initializer: wallet.publicKey as PublicKey,
            tokenMint: tokenMint,
            initializerTokenAccount: initializerTokenAccount,
            roundTokenAccount: roundTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .preInstructions([createAtaIx])
          .signers([roundKeypair])
          .rpc();

        console.log("Transaction signature:", tx);
        console.log("Round initialized:", roundKeypair.publicKey.toString());
        transactionToast(tx);
        return { tx };

        // console.log("Simulation result:", tx);
        // console.log("Simulated round initialization for:", roundKeypair.publicKey.toString());

        // // Log more detailed information from the simulation
        // console.log("Logs:", tx.logs);
        // console.log("Accounts:", tx.accounts);
        // console.log("Unitsconsumed:", tx.unitsConsumed);
        // if (tx.returnData) {
        //   console.log("ReturnData:", tx.returnData.toString());
        // }
      } catch (error) {
        console.error("Error initializing round:", error);
        return { error }
      }
    }
  }
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
