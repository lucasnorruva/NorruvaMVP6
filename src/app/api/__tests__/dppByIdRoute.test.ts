import { GET } from '../v1/dpp/[productId]/route';
import { MOCK_DPPS } from '@/data';
import { MOCK_DPPS as ORIGINAL_DPPS } from '@/data/mockDpps';
import { NextRequest } from 'next/server';

beforeEach(() => {
  process.env.VALID_API_KEYS = 'SANDBOX_KEY_123';
  MOCK_DPPS.length = 0;
  ORIGINAL_DPPS.forEach(d => MOCK_DPPS.push(JSON.parse(JSON.stringify(d))));
});

describe('/api/v1/dpp/[productId] route', () => {
  it('returns the product when it exists', async () => {
    const req = new NextRequest(new Request('http://test', {
      headers: { Authorization: 'Bearer SANDBOX_KEY_123' }
    }));
    const res = await GET(req, { params: { productId: 'DPP001' } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe('DPP001');
  });

  it('returns 404 for unknown product', async () => {
    const req = new NextRequest(new Request('http://test', {
      headers: { Authorization: 'Bearer SANDBOX_KEY_123' }
    }));
    const res = await GET(req, { params: { productId: 'UNKNOWN' } });
    expect(res.status).toBe(404);
  });

  it('returns 401 when API key missing', async () => {
    const req = new NextRequest(new Request('http://test'));
    const res = await GET(req, { params: { productId: 'DPP001' } });
    expect(res.status).toBe(401);
  });
});
