import { useAnchorProvider } from '@/components/solana/solana-provider';
import { USDC_DECIMALS } from '@/config/constants';
import {
  GroupCrypto,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
} from '@/types';
import { initiateTransfer } from '@/utils/crypto';
import { BN } from '@coral-xyz/anchor';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { getVaquinhaProgram } from '@vaquinha/anchor';
import { useCallback, useMemo } from 'react';
import { Group } from '../../../group-management/.dfx/local/canisters/group-management-backend/service.did';

export const useVaquitaProgram = () => {
  const provider = useAnchorProvider();
  const program = useMemo(() => getVaquinhaProgram(provider), [provider]);
  const { publicKey } = useWallet();

  const getGroupData = useCallback(
    async (group: Group) => {
      const [roundPDA, _bump] = await PublicKey.findProgramAddress(
        [Buffer.from('round'), Buffer.from(group.id)],
        program.programId
      );

      const round = (await program.account.round.fetch(roundPDA)) as {
        paymentAmount: BN;
        numberOfPlayers: number;
        availableSlots: number;
        status: any;
      };

      console.log({ round });
      const responseGroup: GroupResponseDTO = {
        id: group.id,
        crypto: GroupCrypto.USDC, // TODO:
        name: group.name,
        amount: (round.paymentAmount?.toNumber?.() ?? 0) / USDC_DECIMALS,
        collateralAmount:
          round.paymentAmount.toNumber() * round.numberOfPlayers,
        myDeposits: {},
        totalMembers: round.numberOfPlayers,
        slots: round.availableSlots,
        period:
          (group.period as any)?.[GroupPeriod.MONTHLY] == null
            ? GroupPeriod.MONTHLY
            : GroupPeriod.WEEKLY,
        currentPosition: 1,
        myPosition: group.memberPublicKeys.findIndex(
          (pK) => pK === publicKey?.toBase58()
        ),
        startsOnTimestamp: 0,
        status: round.status.pending
          ? GroupStatus.PENDING
          : round.status.active
          ? GroupStatus.ACTIVE
          : GroupStatus.ABANDONED,
        isOwner: false,
        myWithdrawals: {},
      };
      return { success: true, content: responseGroup, error: null };
    },
    [program.account.round, program.programId, publicKey]
  );

  const initializeGroup = useCallback(
    async (
      roundId: string,
      paymentAmount: number,
      numberOfPlayers: number,
      frequencyOfTurns: number,
      tokenMintAddress: string,
      position: number
    ) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

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
        publicKey, // payer
        roundTokenAccount, // ata address
        roundPDA, // owner
        tokenMint // mint
      );

      const initializerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        publicKey
      );

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
          initializer: publicKey,
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
      return { success: true, content: tx, error: null };
    },
    [program.methods, program.programId, publicKey]
  );

  return {
    getGroupData,
    initializeGroup,
  };
};
