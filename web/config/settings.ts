// Load environment variables
require('dotenv').config();

export const MONGO_DATABASE_URI = process.env.MONGO_DATABASE_URI || '';
export const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME || '';

export const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API || '';

export const NO_TRANSACTION_ERRORS =
  !!process.env.NO_TRANSACTION_ERRORS || false;
