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
  let newPlayer: Keypair;
  let playerTokenAccount: PublicKey;

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
  }, 30000);

  it('Add player', async () => {
    // Create a new player
    newPlayer = Keypair.generate();
    console.log("New player public key:", newPlayer.publicKey.toString());
  
    // Transfer some SOL to the new player for transaction fees
    const transferSolIx = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newPlayer.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.1, // 0.1 SOL
    });
  
    // Create the player's token account
    playerTokenAccount = await getAssociatedTokenAddress(
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
        15 // amount (adjust as needed)
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
  }, 30000);

  it('Player 2 pays the first round', async () => {
    console.log("Starting 'Player 2 pays the first round' test");

    // Fetch the current state of the round
    let round = await program.account.round.fetch(roundKeypair.publicKey);
    console.log("Initial round state:", JSON.stringify(round, null, 2));
    
    // Get the public key of the second player (added in the previous test)
    const player2PublicKey = new PublicKey(round.players[1]);
    console.log("Player 2 Public Key:", player2PublicKey.toString());
    console.log("newPlayer Public Key:", newPlayer.publicKey.toString());
    
    // Get the token account for the recipient (first player/initializer)
    const recipientTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      new PublicKey(round.players[0])
    );
    console.log("Recipient Token Account:", recipientTokenAccount.toString());
    
    // Get the token account for player 2
    // const player2TokenAccount = playerTokenAccount;
    const player2TokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      new PublicKey(round.players[1])
    );
    console.log("Player 2 Token Account:", player2TokenAccount.toString());

    // Check recipient's token balance before the payment
    const recipientAccountBefore = await provider.connection.getTokenAccountBalance(recipientTokenAccount);
    const balanceBefore = recipientAccountBefore.value.uiAmount;
    console.log("Recipient balance before payment:", balanceBefore);

    // Check player 2's token balance before the payment
    const player2AccountBefore = await provider.connection.getTokenAccountBalance(player2TokenAccount);
    console.log("Player 2 balance before payment:", player2AccountBefore.value.uiAmount);
    
    // Execute the pay_turn instruction
    try {
      const tx = await program.methods
        .payTurn()
        .accounts({
          round: roundKeypair.publicKey,
          // player: newPlayer.publicKey,//player2PublicKey,
          player: player2PublicKey,
          // playerTokenAccount: playerTokenAccount,//player2TokenAccount,
          playerTokenAccount: player2TokenAccount,
          recipientTokenAccount: recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([newPlayer])
        .rpc();
        // .transaction();

      // console.log("Transaction created, sending...");
      // const txId = await provider.sendAndConfirm(tx, [newPlayer]);
      // console.log("Transaction sent. ID:", txId);

      // // Fetch and log transaction details
      // const txInfo = await provider.connection.getTransaction(txId, { commitment: 'confirmed' });
      // console.log("Transaction logs:", txInfo?.meta?.logMessages);
      
      // console.log("Player 2 successfully paid the first round");
    } catch (error) {
      console.error("Error during pay_turn:");
      if (error instanceof anchor.AnchorError) {
        console.error("Error code:", error.error.errorCode.number);
        console.error("Error name:", error.error.errorCode.code);
        console.error("Error message:", error.error.errorMessage);
        console.error("Program logs:", error.logs);
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error:", error);
      }
      throw error;
    }
    
    // Fetch the updated round data
    const updatedRound = await program.account.round.fetch(roundKeypair.publicKey);
    console.log("Updated round state:", JSON.stringify(updatedRound, null, 2));

    // Check recipient's token balance after the payment
    const recipientAccountAfter = await provider.connection.getTokenAccountBalance(recipientTokenAccount);
    const balanceAfter = recipientAccountAfter.value.uiAmount;
    console.log("Recipient balance after payment:", balanceAfter);

    // Check player 2's token balance after the payment
    const player2AccountAfter = await provider.connection.getTokenAccountBalance(player2TokenAccount);
    console.log("Player 2 balance after payment:", player2AccountAfter.value.uiAmount);
    
    // Assert that the turn has been paid and the state has been updated correctly
    expect(updatedRound.currentIndexOfPlayer).toEqual(1);
    expect(updatedRound.status).toEqual({ active: {} });
    
    // Assert that the recipient's balance has increased by the payment amount
    const expectedIncrease = Number(round.paymentAmount) / (10 ** recipientAccountAfter.value.decimals);
    expect(balanceAfter).toBeCloseTo(balanceBefore as number + expectedIncrease, 5);

    console.log("Current turn paid amount:", updatedRound.currentTurnPaidAmount.toString());
    console.log("Current index of player:", updatedRound.currentIndexOfPlayer.toString());
    console.log("Number of players:", round.players.length);
    console.log("Payment amount:", round.paymentAmount.toString());
    console.log("Balance increase:", (balanceAfter as number) - (balanceBefore as number));
  }, 30000);

  it('Player 1 pays the second round', async () => {
    console.log("Starting 'Player 1 pays the second round' test");

    // Fetch the current state of the round
    let round = await program.account.round.fetch(roundKeypair.publicKey);
    console.log("Initial round state:", JSON.stringify(round, null, 2));
    
    // Get the public key of the second player (added in the previous test)
    const player1PublicKey = new PublicKey(round.players[0]);
    console.log("Player 1 Public Key:", player1PublicKey.toString());
    console.log("payer Public Key:", payer.publicKey.toString());
    
    // Get the token account for the recipient (first player/initializer)
    const recipientTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      new PublicKey(round.players[1])
    );
    console.log("Recipient Token Account:", recipientTokenAccount.toString());
    
    // Get the token account for player 2
    // const player2TokenAccount = playerTokenAccount;
    const player1TokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      new PublicKey(round.players[0])
    );
    console.log("Player 1 Token Account:", player1TokenAccount.toString());

    // Check recipient's token balance before the payment
    const recipientAccountBefore = await provider.connection.getTokenAccountBalance(recipientTokenAccount);
    const balanceBefore = recipientAccountBefore.value.uiAmount;
    console.log("Recipient balance before payment:", balanceBefore);

    // Check player 2's token balance before the payment
    const player1AccountBefore = await provider.connection.getTokenAccountBalance(player1TokenAccount);
    console.log("Player 2 balance before payment:", player1AccountBefore.value.uiAmount);
    
    // Execute the pay_turn instruction
    try {
      const tx = await program.methods
        .payTurn()
        .accounts({
          round: roundKeypair.publicKey,
          // player: newPlayer.publicKey,//player2PublicKey,
          player: player1PublicKey,
          // playerTokenAccount: playerTokenAccount,//player2TokenAccount,
          playerTokenAccount: player1TokenAccount,
          recipientTokenAccount: recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([payer.payer])
        .rpc();
        // .transaction();

      // console.log("Transaction created, sending...");
      // const txId = await provider.sendAndConfirm(tx, [newPlayer]);
      // console.log("Transaction sent. ID:", txId);

      // // Fetch and log transaction details
      // const txInfo = await provider.connection.getTransaction(txId, { commitment: 'confirmed' });
      // console.log("Transaction logs:", txInfo?.meta?.logMessages);
      
      // console.log("Player 2 successfully paid the first round");
    } catch (error) {
      console.error("Error during pay_turn:");
      if (error instanceof anchor.AnchorError) {
        console.error("Error code:", error.error.errorCode.number);
        console.error("Error name:", error.error.errorCode.code);
        console.error("Error message:", error.error.errorMessage);
        console.error("Program logs:", error.logs);
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error:", error);
      }
      throw error;
    }
    
    // Fetch the updated round data
    const updatedRound = await program.account.round.fetch(roundKeypair.publicKey);
    console.log("Updated round state:", JSON.stringify(updatedRound, null, 2));

    // Check recipient's token balance after the payment
    const recipientAccountAfter = await provider.connection.getTokenAccountBalance(recipientTokenAccount);
    const balanceAfter = recipientAccountAfter.value.uiAmount;
    console.log("Recipient balance after payment:", balanceAfter);

    // Check player 2's token balance after the payment
    const player1AccountAfter = await provider.connection.getTokenAccountBalance(player1TokenAccount);
    console.log("Player 1 balance after payment:", player1AccountAfter.value.uiAmount);
    
    // Assert that the turn has been paid and the state has been updated correctly
    expect(updatedRound.currentIndexOfPlayer).toEqual(2);
    expect(updatedRound.status).toEqual({ completed: {} });
    
    // Assert that the recipient's balance has increased by the payment amount
    const expectedIncrease = Number(round.paymentAmount) / (10 ** recipientAccountAfter.value.decimals);
    expect(balanceAfter).toBeCloseTo(balanceBefore as number + expectedIncrease, 5);

    console.log("Current turn paid amount:", updatedRound.currentTurnPaidAmount.toString());
    console.log("Current index of player:", updatedRound.currentIndexOfPlayer.toString());
    console.log("Number of players:", round.players.length);
    console.log("Payment amount:", round.paymentAmount.toString());
    console.log("Balance increase:", (balanceAfter as number) - (balanceBefore as number));
  }, 30000);
});
