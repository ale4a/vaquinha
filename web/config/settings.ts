// Load environment variables
require('dotenv').config();

export const USDC_MINT_ADDRESS = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;
export const ANCHOR_PROVIDER_URL = process.env.NEXT_PUBLIC_ANCHOR_PROVIDER_URL;

export const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API || '';

export const NO_TRANSACTION_ERRORS =
  !!process.env.NO_TRANSACTION_ERRORS || false;
