import fetch from 'node-fetch';
import crypto from 'crypto';
import forge from 'node-forge';
import { v4 as uuid4 } from 'uuid';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

/**
 * Creates and encrypts entity secret for Circle transfer
 * @returns {string} Base64 encoded encrypted data
 */
const createEncryptedEntitySecret = () => {
  const entitySecret = forge.util.hexToBytes(process.env.NEXT_PUBLIC_CIRCLE_SECRET_KEY);
  const publicKey = forge.pki.publicKeyFromPem(process.env.NEXT_PUBLIC_CIRCLE_PUBLIC_KEY);
  const encryptedData = publicKey.encrypt(entitySecret, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });
  
  return forge.util.encode64(encryptedData);
};

/**
 * Initiates a Circle transfer to the specified destination address
 * @param {string} destinationAddress - The blockchain address to send to
 * @param {Object} options - Optional parameters for the transfer
 * @param {string} options.tokenAddress - The token address (defaults to USDC on SOL-DEVNET)
 * @param {string} options.amount - The amount to transfer (defaults to '10')
 * @param {string} options.blockchain - The blockchain to use (defaults to SOL-DEVNET)
 * @param {string} options.walletId - The source wallet ID
 * @param {string} options.feeLevel - The fee level to use (defaults to LOW)
 * @returns {Promise<Object>} The response from Circle's API
 */
export async function initiateTransfer(destinationAddress, {
  tokenAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  amount = '1',
  blockchain = 'SOL-DEVNET',
  walletId = 'b3112909-14cc-58f1-945d-1b9b51d82962',
  feeLevel = 'LOW'
} = {}) {
  if (!destinationAddress) {
    throw new Error('Destination address is required');
  }

  if (!process.env.NEXT_PUBLIC_CIRCLE_API_KEY || !process.env.NEXT_PUBLIC_CIRCLE_SECRET_KEY || !process.env.NEXT_PUBLIC_CIRCLE_PUBLIC_KEY) {
    throw new Error('Missing required Circle API credentials in environment variables');
  }

  const entitySecretCiphertext = createEncryptedEntitySecret();
  
  const url = 'https://api.circle.com/v1/w3s/developer/transactions/transfer';
  const requestOptions = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      idempotencyKey: uuid4(),
      destinationAddress,
      entitySecretCiphertext,
      feeLevel,
      tokenAddress,
      blockchain,
      walletId,
      amounts: [amount]
    })
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    
    if (!data.data.id) {
      throw new Error(data.message || 'Failed to initiate transfer');
    }
    
    return data;
  } catch (error) {
    console.error('Transfer error:', error);
    throw error;
  }
}

// Example usage:
// import { initiateTransfer } from './transfer.js';
// 
// try {
//   const result = await initiateTransfer('3BksCpiYUprLUNnyGLDCYN6DnAeieuaQknG23RXtCAXd', {
//     amount: '20',
//     feeLevel: 'MEDIUM'
//   });
//   console.log('Transfer initiated:', result);
// } catch (error) {
//   console.error('Failed to initiate transfer:', error);
// }