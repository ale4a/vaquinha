import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Keypair, Connection, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Vaquinha } from '../target/types/vaquinha';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
import fs from 'fs';

describe('vaquinha', () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const payer = new anchor.Wallet(Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync("/Users/flaura-macbook/.config/solana/id.json", "utf-8")))
  ));

  const program = anchor.workspace.Vaquinha as Program<Vaquinha>;
  const roundId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  console.log({roundId});
  let roundPDA: PublicKey;
  let roundBump: number;
  let roundTokenAccount: PublicKey;
  let tokenMint: PublicKey;
  let newPlayer: Keypair;
  let playerTokenAccount: PublicKey;

  it('Initialize Round', async () => {
    const paymentAmount = 5;
    const numberOfPlayers = 2;
    const frequencyOfTurns = 86400; // 1 day in seconds;
    const tokenMintAddress = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    tokenMint = new PublicKey(tokenMintAddress);
    // Derive the round PDA
    [roundPDA, roundBump] = await PublicKey.findProgramAddress(
      [Buffer.from("round"), Buffer.from(roundId)],
      program.programId
    );
    console.log({roundPDA, roundBump})

    roundTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      roundPDA, //roundKeypair.publicKey,
      true
    );
    
    const paymentAmountBN = new anchor.BN(paymentAmount);
    const frequencyOfTurnsBN = new anchor.BN(frequencyOfTurns);

    const createAtaIx = createAssociatedTokenAccountInstruction(
      payer.publicKey, // payer
      roundTokenAccount, // ata address
      roundPDA, // owner
      tokenMint // mint
    );

    const initializerTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      payer.publicKey
    );

    const result = await program.methods
      .initializeRound(roundId, paymentAmountBN, numberOfPlayers, frequencyOfTurnsBN, 0)
      .accounts({
        round: roundPDA, //roundKeypair.publicKey,
        initializer: payer.publicKey,
        tokenMint: tokenMint,
        initializerTokenAccount: initializerTokenAccount,
        roundTokenAccount: roundTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      })
      .preInstructions([createAtaIx])
      .signers([payer.payer])
      .rpc();

    const round = await program.account.round.fetch(
      roundPDA//roundKeypair.publicKey
    );

    console.log({result});

    console.log({round})
    expect(Number(round.paymentAmount)).toEqual(paymentAmount);
    console.log({roundPDA, tokenMint, roundTokenAccount})
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
  
    try {
      // Add the player to the round
      console.log("Adding player to round...");
      await program.methods
        .addPlayer(1)
        .accounts({
          round: roundPDA,//roundKeypair.publicKey,
          player: newPlayer.publicKey,
          playerTokenAccount: playerTokenAccount,
          roundTokenAccount: roundTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([newPlayer, payer.payer])
        .rpc();
      console.log("Player added to round");
    } catch (error) {
      console.log("Error adding player to round:", error);
    }
  
    // Fetch the updated round data
    const updatedRound = await program.account.round.fetch(
      roundPDA //roundKeypair.publicKey
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
    let round = await program.account.round.fetch(roundPDA); //roundKeypair.publicKey);
    console.log("Initial round state:", JSON.stringify(round, null, 2));
    const turn = 0;
    
    // Get the public key of the second player (added in the previous test)
    const player2PublicKey = newPlayer.publicKey;
    console.log("Player 2 Public Key:", player2PublicKey.toString());
    console.log("newPlayer Public Key:", newPlayer.publicKey.toString());
    
    // Get the token account for the recipient (first player/initializer)
    const recipientTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      newPlayer.publicKey
    );
    console.log("Recipient Token Account:", recipientTokenAccount.toString());
    
    // Get the token account for player 2
    const player2TokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      newPlayer.publicKey
    );
    console.log("Player 2 Token Account:", player2TokenAccount.toString());

    // Check recipient's token balance before the payment
    const recipientAccountBefore = await provider.connection.getTokenAccountBalance(roundTokenAccount);
    const balanceBefore = recipientAccountBefore.value.uiAmount;
    console.log("Recipient balance before payment:", balanceBefore);

    // Check player 2's token balance before the payment
    const player2AccountBefore = await provider.connection.getTokenAccountBalance(player2TokenAccount);
    console.log("Player 2 balance before payment:", player2AccountBefore.value.uiAmount);
    
    // Execute the pay_turn instruction
    try {
      const tx = await program.methods
        .payTurn(turn)
        .accounts({
          round: roundPDA, //roundKeypair.publicKey,
          player: player2PublicKey,
          playerTokenAccount: player2TokenAccount,
          roundTokenAccount: roundTokenAccount,
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
    const updatedRound = await program.account.round.fetch(roundPDA); //roundKeypair.publicKey);
    console.log("Updated round state:", JSON.stringify(updatedRound, null, 2));

    // Check recipient's token balance after the payment
    const recipientAccountAfter = await provider.connection.getTokenAccountBalance(roundTokenAccount);
    const balanceAfter = recipientAccountAfter.value.uiAmount;
    console.log("Recipient balance after payment:", balanceAfter);

    // Check player 2's token balance after the payment
    const player2AccountAfter = await provider.connection.getTokenAccountBalance(player2TokenAccount);
    console.log("Player 2 balance after payment:", player2AccountAfter.value.uiAmount);
    
    // Assert that the turn has been paid and the state has been updated correctly
    expect(updatedRound.status).toEqual({ active: {} });
    
    // Assert that the recipient's balance has increased by the payment amount
    const expectedIncrease = Number(round.paymentAmount) / (10 ** recipientAccountAfter.value.decimals);
    expect(balanceAfter).toBeCloseTo(balanceBefore as number + expectedIncrease, 5);

    console.log("Number of players:", round.players.length);
    console.log("Payment amount:", round.paymentAmount.toString());
    console.log("Balance increase:", (balanceAfter as number) - (balanceBefore as number));
  }, 30000);

  it('Player 1 withdraws funds deposit on the first round', async () => {
    console.log("Starting 'Player 1 withdraws funds for the current turn' test");
  
    // Fetch the current state of the round
    let round = await program.account.round.fetch(roundPDA);
    console.log("Initial round state:", JSON.stringify(round, null, 2));
  
    // const currentPlayerIndex = round.currentIndexOfPlayer;
    const currentPlayer = payer.publicKey;
    console.log("player public key:", currentPlayer.toString());
  
    const currentPlayerTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      currentPlayer
    );
    console.log("Current player token account:", currentPlayerTokenAccount.toString());

    // Check round token account ownership
    const roundTokenAccountInfo: any = await provider.connection.getAccountInfo(roundTokenAccount);
    console.log("Round Token Account owner:", roundTokenAccountInfo.owner.toString());
    console.log("Expected owner (Round PDA):", roundPDA.toString());
    console.log("Bump", roundBump);
  
    // Check current player's balance before withdrawal
    const balanceBefore = await provider.connection.getTokenAccountBalance(currentPlayerTokenAccount);
    console.log("Current player balance before withdrawal:", balanceBefore.value.uiAmount);
  
    // Check round token account balance
    const roundTokenAccountBalance = await provider.connection.getTokenAccountBalance(roundTokenAccount);
    console.log("Round token account balance before withdrawal:", roundTokenAccountBalance.value.uiAmount);
  
    // Execute the withdraw instruction
    try {
      console.log("Attempting withdrawal with the following accounts:");
      console.log("Round PDA:", roundPDA.toString());
      console.log("Current Player:", currentPlayer.toString());
      console.log("Player Token Account:", currentPlayerTokenAccount.toString());
      console.log("Round Token Account:", roundTokenAccount.toString());
  
      const tx = await program.methods
        .withdrawTurn()
        .accounts({
          round: roundPDA,
          player: currentPlayer,
          playerTokenAccount: currentPlayerTokenAccount,
          roundTokenAccount: roundTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([payer.payer])
        .rpc();
      
      console.log("Withdrawal transaction signature:", tx);
    } catch (error) {
      console.error("Error during withdrawal:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      if ('logs' in error) {
        console.error("Program logs:", error.logs);
      }
      throw error;
    }
  
    // Check current player's balance after withdrawal
    const balanceAfter = await provider.connection.getTokenAccountBalance(currentPlayerTokenAccount);
    console.log("Current player balance after withdrawal:", balanceAfter.value.uiAmount);
  
    // Fetch the updated round data
    const updatedRound = await program.account.round.fetch(roundPDA); //roundKeypair.publicKey);
    console.log("Updated round state after withdrawal:", JSON.stringify(updatedRound, null, 2));
  
    // Assertions
    const expectedIncrease = Number(round.paymentAmount) / (10 ** balanceAfter.value.decimals);
    expect(balanceAfter.value.uiAmount).toBeCloseTo((balanceBefore.value.uiAmount ?? 0) + expectedIncrease, 5);
    // expect(updatedRound.currentTurnPaidAmount.toNumber()).toEqual(1);
    // expect(updatedRound.currentIndexOfPlayer).not.toEqual(currentPlayerIndex);
  
    // console.log("Current turn paid amount:", updatedRound.currentTurnPaidAmount.toString());
    // console.log("Current index of player:", updatedRound.currentIndexOfPlayer.toString());
    console.log("Number of players:", updatedRound.players.length);
    console.log("Payment amount:", updatedRound.paymentAmount.toString());
    console.log("Balance increase:", (balanceAfter.value.uiAmount ?? 0) - (balanceBefore.value.uiAmount ?? 0));
  }, 30000);

  it('Player 1 pays the second round', async () => {
    console.log("Starting 'Player 1 pays the second round' test");

    // Fetch the current state of the round
    let round = await program.account.round.fetch(roundPDA); //roundKeypair.publicKey);
    console.log("Initial round state:", JSON.stringify(round, null, 2));
    const turn = 1;
    
    // Get the public key of the second player (added in the previous test)
    const player1PublicKey = payer.publicKey;
    
    // Get the token account for the recipient (first player/initializer)
    const recipientTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      newPlayer.publicKey
    );
    console.log("Recipient Token Account:", recipientTokenAccount.toString());
    
    // Get the token account for player 2
    // const player2TokenAccount = playerTokenAccount;
    const player1TokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      payer.publicKey
    );
    console.log("Player 1 Token Account:", player1TokenAccount.toString());

    // Check recipient's token balance before the payment
    const recipientAccountBefore = await provider.connection.getTokenAccountBalance(roundTokenAccount);
    const balanceBefore = recipientAccountBefore.value.uiAmount;
    console.log("Recipient balance before payment:", balanceBefore);

    // Check player 2's token balance before the payment
    const player2AccountBefore = await provider.connection.getTokenAccountBalance(player1TokenAccount);
    console.log("Player 1 balance before payment:", player2AccountBefore.value.uiAmount);
    
    // Execute the pay_turn instruction
    try {
      const tx = await program.methods
        .payTurn(turn)
        .accounts({
          round: roundPDA, //roundKeypair.publicKey,
          player: player1PublicKey,
          playerTokenAccount: player1TokenAccount,
          roundTokenAccount: roundTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([payer.payer])
        .rpc();
        // .transaction();

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
    const updatedRound = await program.account.round.fetch(roundPDA); //roundKeypair.publicKey);
    console.log("Updated round state:", JSON.stringify(updatedRound, null, 2));

    // Check recipient's token balance after the payment
    const recipientAccountAfter = await provider.connection.getTokenAccountBalance(roundTokenAccount);
    const balanceAfter = recipientAccountAfter.value.uiAmount;
    console.log("Recipient balance after payment:", balanceAfter);

    // Check player 2's token balance after the payment
    const player1AccountAfter = await provider.connection.getTokenAccountBalance(player1TokenAccount);
    console.log("Player 1 balance after payment:", player1AccountAfter.value.uiAmount);
    
    console.log({updatedRound});
    expect(updatedRound.status).toEqual({ completed: {} });
    
    // Assert that the recipient's balance has increased by the payment amount
    const expectedIncrease = Number(round.paymentAmount) / (10 ** recipientAccountAfter.value.decimals);
    expect(balanceAfter).toBeCloseTo(balanceBefore as number + expectedIncrease, 5);

    console.log("Number of players:", round.players.length);
    console.log("Payment amount:", round.paymentAmount.toString());
    console.log("Balance increase:", (balanceAfter as number) - (balanceBefore as number));
  }, 30000);

  it('Player 1 withdraws collateral', async () => {
    console.log("Starting 'Withdraw funds for the current turn' test");
  
    // Fetch the current state of the round
    let round = await program.account.round.fetch(roundPDA);
    console.log("Initial round state:", JSON.stringify(round, null, 2));
  
    // const currentPlayerIndex = round.currentIndexOfPlayer;
    const currentPlayer = payer.publicKey;
    console.log("current player public key:", currentPlayer.toString());
  
    const currentPlayerTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      currentPlayer
    );
    console.log("Current player token account:", currentPlayerTokenAccount.toString());

    // Check round token account ownership
    const roundTokenAccountInfo: any = await provider.connection.getAccountInfo(roundTokenAccount);
    console.log("Round Token Account owner:", roundTokenAccountInfo.owner.toString());
    console.log("Expected owner (Round PDA):", roundPDA.toString());
    console.log("Bump", roundBump);
  
    // Check current player's balance before withdrawal
    const balanceBefore = await provider.connection.getTokenAccountBalance(currentPlayerTokenAccount);
    console.log("Current player balance before withdrawal:", balanceBefore.value.uiAmount);
  
    // Check round token account balance
    const roundTokenAccountBalance = await provider.connection.getTokenAccountBalance(roundTokenAccount);
    console.log("Round token account balance before withdrawal:", roundTokenAccountBalance.value.uiAmount);
  
    // Execute the withdraw instruction
    try {
      console.log("Attempting withdrawal with the following accounts:");
      console.log("Round PDA:", roundPDA.toString());
      console.log("Current Player:", currentPlayer.toString());
      console.log("Player Token Account:", currentPlayerTokenAccount.toString());
      console.log("Round Token Account:", roundTokenAccount.toString());
  
      const tx = await program.methods
        .withdrawCollateral()
        .accounts({
          round: roundPDA,
          player: currentPlayer,
          playerTokenAccount: currentPlayerTokenAccount,
          roundTokenAccount: roundTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID
        })
        .signers([payer.payer])
        .rpc();
      
      console.log("Withdrawal transaction signature:", tx);
    } catch (error) {
      console.error("Error during withdrawal:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      if ('logs' in error) {
        console.error("Program logs:", error.logs);
      }
      throw error;
    }
  
    // Check current player's balance after withdrawal
    const balanceAfter = await provider.connection.getTokenAccountBalance(currentPlayerTokenAccount);
    console.log("Current player balance after withdrawal:", balanceAfter.value.uiAmount);
  
    // Fetch the updated round data
    const updatedRound = await program.account.round.fetch(roundPDA); //roundKeypair.publicKey);
    console.log("Updated round state after withdrawal:", JSON.stringify(updatedRound, null, 2));
  
    // Assertions
    const expectedIncrease = Number(round.paymentAmount) * Number(round.numberOfPlayers) / (10 ** balanceAfter.value.decimals);
    console.log({expectedIncrease});
    expect(balanceAfter.value.uiAmount).toBeCloseTo((balanceBefore.value.uiAmount ?? 0) + expectedIncrease, 5);
    
    console.log("Number of players:", updatedRound.players.length);
    console.log("Payment amount:", updatedRound.paymentAmount.toString());
    console.log("Balance increase:", (balanceAfter.value.uiAmount ?? 0) - (balanceBefore.value.uiAmount ?? 0));
  }, 30000);
});
