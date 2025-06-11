jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({ data, status: init?.status || 200 }),
  },
}));

import { GET } from '../route';

describe('GET /api/v1/dpp/[productId]/credential', () => {
  it('returns a verifiable credential structure', async () => {
    const res = await GET({} as any, { params: { productId: 'DPP001' } });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('@context');
    expect(res.data).toHaveProperty('credentialSubject');
    expect(res.data.type).toContain('VerifiableCredential');
  });

  it('returns 404 for unknown product', async () => {
    const res = await GET({} as any, { params: { productId: 'UNKNOWN' } });
    expect(res.status).toBe(404);
    expect(res.data.error).toBeDefined();
  });
});
