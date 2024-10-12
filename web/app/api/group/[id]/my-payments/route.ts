import { dbClient } from '@/services/database';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  await dbClient.connect();
}
