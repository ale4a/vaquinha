import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';

// Import the IDL as a module
import VaquinhaIDL from '../target/idl/vaquinha.json';

// Import the Vaquinha type
import type { Vaquinha } from '../target/types/vaquinha';

// Re-export the generated IDL and type
export { Vaquinha, VaquinhaIDL };

// The programId is imported from the program IDL.
export const VAQUINHA_PROGRAM_ID = new PublicKey(VaquinhaIDL.metadata.address);

// This is a helper function to get the Vaquinha Anchor program.
export function getVaquinhaProgram(provider: AnchorProvider) {
  return new Program(VaquinhaIDL as Idl, VAQUINHA_PROGRAM_ID, provider);
}

// This is a helper function to get the program ID for the Vaquinha program depending on the cluster.
export function getVaquinhaProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return VAQUINHA_PROGRAM_ID;
  }
}