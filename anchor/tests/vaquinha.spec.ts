import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Vaquinha } from '../target/types/vaquinha';

describe('vaquinha', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Vaquinha as Program<Vaquinha>;

  const vaquinhaKeypair = Keypair.generate();

  it('Initialize Vaquinha', async () => {
    await program.methods
      .initialize()
      .accounts({
        vaquinha: vaquinhaKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([vaquinhaKeypair])
      .rpc();

    const currentCount = await program.account.vaquinha.fetch(
      vaquinhaKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Vaquinha', async () => {
    await program.methods
      .increment()
      .accounts({ vaquinha: vaquinhaKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.vaquinha.fetch(
      vaquinhaKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Vaquinha Again', async () => {
    await program.methods
      .increment()
      .accounts({ vaquinha: vaquinhaKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.vaquinha.fetch(
      vaquinhaKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Vaquinha', async () => {
    await program.methods
      .decrement()
      .accounts({ vaquinha: vaquinhaKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.vaquinha.fetch(
      vaquinhaKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set vaquinha value', async () => {
    await program.methods
      .set(42)
      .accounts({ vaquinha: vaquinhaKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.vaquinha.fetch(
      vaquinhaKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the vaquinha account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        vaquinha: vaquinhaKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.vaquinha.fetchNullable(
      vaquinhaKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
