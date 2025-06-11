import { NextRequest, NextResponse } from 'next/server';
import { API_KEYS } from '@/config/auth';

export function validateApiKey(request: NextRequest): NextResponse | undefined {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  }
  const providedKey = authHeader.slice('Bearer '.length).trim();
  if (!API_KEYS.includes(providedKey)) {
    return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  }
  return undefined;
}
