
// app/api/token/route.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0'; // ajustá este path si tu instancia está en otro lado

export async function GET() {
  const session = await auth0.getSession();

  if (!session || !session.tokenSet?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ accessToken: session.tokenSet.accessToken });
}
