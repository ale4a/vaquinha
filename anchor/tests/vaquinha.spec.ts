import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Keypair, Connection, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Vaquinha } from '../target/types/vaquinha';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
import fs from 'fs';

describe('vaquinha', () => {
  // const provider = anchor.AnchorProvider.env();
  // anchor.setProvider(provider);
  // const payer = provider.wallet;
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const payer = new anchor.Wallet(Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync("/Users/flaura-macbook/.config/solana/id.json", "utf-8")))
  ));

  const program = anchor.workspace.Vaquinha as Program<Vaquinha>;
  let roundKeypair: Keypair;
  let roundTokenAccount: PublicKey;
  let tokenMint: PublicKey;

  it('Initialize Round', async () => {
    // console.log('address => ', payer.publicKey.toString());
    const paymentAmount = 5;
    const numberOfPlayers = 2;
    const frequencyOfTurns = 86400; // 1 day in seconds;
    const tokenMintAddress = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    roundKeypair = Keypair.generate();
    tokenMint = new PublicKey(tokenMintAddress);
    roundTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      roundKeypair.publicKey
    );
    
    const paymentAmountBN = new anchor.BN(paymentAmount);
    const frequencyOfTurnsBN = new anchor.BN(frequencyOfTurns);

    const createAtaIx = createAssociatedTokenAccountInstruction(
      payer.publicKey, // payer
      roundTokenAccount, // ata address
      roundKeypair.publicKey, // owner
      tokenMint // mint
    );

    const initializerTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      payer.publicKey
    );

    await program.methods
      .initializeRound(paymentAmountBN, numberOfPlayers, frequencyOfTurnsBN)
      .accounts({
        round: roundKeypair.publicKey,
        initializer: payer.publicKey,
        tokenMint: tokenMint,
        initializerTokenAccount: initializerTokenAccount,
        roundTokenAccount: roundTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      })
      .preInstructions([createAtaIx])
      .signers([roundKeypair])
      .rpc();

    const round = await program.account.round.fetch(
      roundKeypair.publicKey
    );

    console.log({round})
    expect(Number(round.paymentAmount)).toEqual(paymentAmount);
    console.log({roundKeypair, tokenMint, roundTokenAccount})
  });

  it('Add player', async () => {
    // Create a new player
    const newPlayer = Keypair.generate();
    console.log("New player public key:", newPlayer.publicKey.toString());
  
    // Transfer some SOL to the new player for transaction fees
    const transferSolIx = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newPlayer.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.1, // 0.1 SOL
    });
  
    // Create the player's token account
    const playerTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      newPlayer.publicKey
    );
  
    // Create the associated token account instruction for the player
    const createPlayerAtaIx = createAssociatedTokenAccountInstruction(
      newPlayer.publicKey, // payer (changed back to payer.publicKey)
      playerTokenAccount, // ata address
      newPlayer.publicKey, // owner
      tokenMint // mint
    );
  
    // Combine SOL transfer and ATA creation instructions
    const setupTx = new Transaction().add(
      transferSolIx,
      createPlayerAtaIx
    );
  
    // Send and confirm the setup transaction
    console.log("Sending setup transaction...");
    await provider.sendAndConfirm(setupTx, [newPlayer]);
    console.log("Setup transaction confirmed");
    
    // try {
      // Now transfer tokens in a separate transaction
      const payerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        payer.publicKey
      );
      const transferTokensIx = createTransferInstruction(
        payerTokenAccount, // source
        playerTokenAccount, // destination
        payer.publicKey, // owner
        10 // amount (adjust as needed)
      );
    
      const tokenTransferTx = new Transaction().add(transferTokensIx);
    
      console.log("Sending token transfer transaction...");
      await provider.sendAndConfirm(tokenTransferTx, [payer.payer]);
      console.log("Token transfer transaction confirmed");
    // } catch (error) {
    //   console.log("Gaaaaa!!!")
    //   console.log({error});
    // }
  
    // try {
      // Add the player to the round
      console.log("Adding player to round...");
      await program.methods
        .addPlayer()
        .accounts({
          round: roundKeypair.publicKey,
          player: newPlayer.publicKey,
          playerTokenAccount: playerTokenAccount,
          roundTokenAccount: roundTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([newPlayer, payer.payer])
        .rpc();
      console.log("Player added to round");
    // } catch (error) {
    //   console.log("Error adding player to round:", error);
    // }
  
    // Fetch the updated round data
    const updatedRound = await program.account.round.fetch(
      roundKeypair.publicKey
    );
    console.log({updatedRound});
  
    // Assert that the player was added correctly
    expect(updatedRound.players).toHaveLength(2); // Initializer + new player
    expect(updatedRound.players[1].toString()).toEqual(newPlayer.publicKey.toString());
    expect(updatedRound.availableSlots).toEqual(0);
    expect(updatedRound.status).toEqual({ active: {} }); // Assuming the round becomes active when full
  });
});
