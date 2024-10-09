import { GROUPS } from '@/store';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get('state');

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return Response.json({
    contents: GROUPS.filter((group) => (state ? group.state === state : true)),
  });
}
