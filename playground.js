const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } = require("@solana/spl-token");
const fs = require("fs");
const { publicKey } = require("@coral-xyz/anchor/dist/cjs/utils");

// Load environment variables
require("dotenv").config();

// Configure the cluster
anchor.setProvider(anchor.AnchorProvider.env());
const provider = anchor.getProvider();

// Load the wallet from the .env file
const wallet = new anchor.Wallet(Keypair.fromSecretKey(
  Buffer.from(JSON.parse(fs.readFileSync(process.env.ANCHOR_WALLET, "utf-8")))
));

// Your program ID
const programId = new PublicKey("qjRm9YEVnGNoY2vCn4LsroiYixVnkn4Fwrta2qgxa1f");

// Load your IDL file
const idl = JSON.parse(fs.readFileSync("./anchor/target/idl/vaquinha.json", "utf-8"));

// Create the program interface
const program = new anchor.Program(idl, programId, provider);

const initializeRound = async (
  paymentAmount,
  numberOfPlayers,
  frequencyOfTurns,
  tokenMintAddress
) => {
  const roundKeypair = anchor.web3.Keypair.generate();

  const paymentAmountBN = new anchor.BN(paymentAmount);
  const frequencyOfTurnsBN = new anchor.BN(frequencyOfTurns);

  const tokenMint = new PublicKey(tokenMintAddress);

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
    wallet.publicKey, // payer
    roundTokenAccount, // ata address
    roundKeypair.publicKey, // owner
    tokenMint // mint
  );

  const initializerTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    wallet.publicKey
  );

  // console.log('[', roundKeypair.publicKey, wallet.publicKey, tokenMint, initializerTokenAccount, roundTokenAccount, TOKEN_PROGRAM_ID, SystemProgram.programId, ']');

  try {
    const tx = await program.methods
      .initializeRound(paymentAmountBN, numberOfPlayers, frequencyOfTurnsBN)
      .accounts({
        round: roundKeypair.publicKey,
        initializer: wallet.publicKey,
        tokenMint: tokenMint,
        initializerTokenAccount: initializerTokenAccount,
        roundTokenAccount: roundTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .preInstructions([createAtaIx])
      .signers([roundKeypair])
      .simulate()

    // console.log("Transaction signature:", tx);
    // console.log("Round initialized:", roundKeypair.publicKey.toString());

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
  }
};

// Usage
(async () => {
  try {
    await initializeRound(10, 5, 86400, "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
  } catch (error) {
    console.error("Error:", error);
  }
})();