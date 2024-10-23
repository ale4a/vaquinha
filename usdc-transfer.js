const fetch = require('node-fetch');
const crypto = require('crypto');
const forge = require("node-forge");
const { v4: uuid4 } = require("uuid");
require('dotenv').config();

const randomBytes = crypto.randomBytes(32);
console.log('Hex encoded entity secret (randomBytes): ', randomBytes);
console.log('Hex encoded entity secret (randomBytes to string(hex)): ', randomBytes.toString('hex'));

const entitySecret = forge.util.hexToBytes(process.env.NEXT_PUBLIC_CIRCLE_SECRET_KEY);
const publicKey = forge.pki.publicKeyFromPem(process.env.NEXT_PUBLIC_CIRCLE_PUBLIC_KEY);
const encryptedData = publicKey.encrypt(entitySecret, 'RSA-OAEP', {
  md: forge.md.sha256.create(),
  mgf1: {
    md: forge.md.sha256.create(),
  },
})

console.log({encryptedData});
console.log('encryptedData encoded: ', forge.util.encode64(encryptedData));

const url = 'https://api.circle.com/v1/w3s/developer/transactions/transfer';
const options = {
  method: 'post',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    idempotencyKey: uuid4(),
    destinationAddress: '3BksCpiYUprLUNnyGLDCYN6DnAeieuaQknG23RXtCAXd',
    entitySecretCiphertext: forge.util.encode64(encryptedData),
    feeLevel: 'LOW',
    tokenAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    blockchain: 'SOL-DEVNET',
    walletId: 'b3112909-14cc-58f1-945d-1b9b51d82962',
    amounts: ['1']
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));