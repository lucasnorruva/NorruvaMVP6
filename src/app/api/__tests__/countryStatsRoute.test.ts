import { GET } from '../v1/dpp/country-stats/route';
import { MOCK_DPPS } from '@/data';
import { MOCK_DPPS as ORIGINAL_DPPS } from '@/data/mockDpps';
import { NextRequest } from 'next/server';

beforeEach(() => {
  process.env.VALID_API_KEYS = 'SANDBOX_KEY_123';
  MOCK_DPPS.length = 0;
  ORIGINAL_DPPS.forEach(d => MOCK_DPPS.push(JSON.parse(JSON.stringify(d))));
});

describe('/api/v1/dpp/country-stats route', () => {
  it('aggregates DPP counts by originCountry', async () => {
    const req = new NextRequest(new Request('http://test', {
      headers: { Authorization: 'Bearer SANDBOX_KEY_123' }
    }));
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    const expected: Record<string, number> = {};
    ORIGINAL_DPPS.forEach(d => {
      const c = d.traceability?.originCountry || 'unknown';
      expected[c] = (expected[c] || 0) + 1;
    });
    expect(data).toEqual(
      expect.arrayContaining(
        Object.entries(expected).map(([countryCode, count]) => ({ countryCode, count }))
      )
    );
  });

  it('returns 401 when API key missing', async () => {
    const req = new NextRequest(new Request('http://test'));
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
