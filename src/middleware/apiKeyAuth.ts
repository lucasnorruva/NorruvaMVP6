import { NextRequest, NextResponse } from 'next/server';

export function validateApiKey(request: NextRequest): NextResponse | undefined {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  }
  const providedKey = authHeader.slice('Bearer '.length).trim();
  const validKeysEnv = process.env.VALID_API_KEYS || '';
  const validKeys = validKeysEnv.split(',').map(k => k.trim()).filter(Boolean);
  if (!validKeys.includes(providedKey)) {
    return NextResponse.json({ error: { code: 401, message: 'API key missing or invalid.' } }, { status: 401 });
  }
  return undefined;
}
