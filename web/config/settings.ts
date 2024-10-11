// Load environment variables
require('dotenv').config();

export const MONGO_DATABASE_URI = process.env.MONGO_DATABASE_URI || '';
export const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME || '';
