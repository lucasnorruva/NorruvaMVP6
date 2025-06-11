import { POST } from '../v1/dpp/transfer-ownership/[productId]/route';
import { MOCK_DPPS } from '@/data';
import { MOCK_DPPS as ORIGINAL_DPPS } from '@/data/mockDpps';
import { NextRequest } from 'next/server';

beforeEach(() => {
  process.env.VALID_API_KEYS = 'SANDBOX_KEY_123';
  MOCK_DPPS.length = 0;
  ORIGINAL_DPPS.forEach(d => MOCK_DPPS.push(JSON.parse(JSON.stringify(d))));
});

describe('POST /api/v1/dpp/transfer-ownership/[productId]', () => {
  it('updates manufacturer and traceability for existing product', async () => {
    const productId = 'DPP001';
    const payload = {
      newOwner: { name: 'New Owner Inc', did: 'did:example:new' },
      transferTimestamp: '2024-08-01T12:00:00Z',
    };
    const request = new NextRequest(new Request('http://test', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    }));

    const response = await POST(request, { params: { productId } });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.manufacturer.name).toBe('New Owner Inc');
    const lastStep = data.traceability.supplyChainSteps[data.traceability.supplyChainSteps.length - 1];
    expect(lastStep).toEqual(
      expect.objectContaining({
        stepName: 'Ownership Transfer',
        actorDid: 'did:example:new',
        timestamp: '2024-08-01T12:00:00Z',
      })
    );
    expect(MOCK_DPPS.find(dpp => dpp.id === productId)?.manufacturer?.name).toBe('New Owner Inc');
  });

  it('returns 404 for unknown product', async () => {
    const request = new NextRequest(new Request('http://test', {
      method: 'POST',
      body: JSON.stringify({ newOwner: { name: 'Foo' }, transferTimestamp: '2024-08-01T12:00:00Z' }),
      headers: { 'Content-Type': 'application/json' },
    }));
    const response = await POST(request, { params: { productId: 'BAD_ID' } });
    expect(response.status).toBe(404);
  });

  it('returns 401 when API key is missing', async () => {
    const payload = {
      newOwner: { name: 'No Auth Inc', did: 'did:example:noauth' },
      transferTimestamp: '2024-08-01T12:00:00Z',
    };
    const request = new NextRequest(new Request('http://test', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    }));
    const res = await POST(request, { params: { productId: 'DPP001' } });
    expect(res.status).toBe(401);
  });
});
