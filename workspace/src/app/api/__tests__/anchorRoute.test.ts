
import { POST } from '../v1/dpp/anchor/[productId]/route';
import { MOCK_DPPS } from '@/data';
import { MOCK_DPPS as ORIGINAL_DPPS } from '@/data/mockDpps';
import { NextRequest } from 'next/server';

beforeEach(() => {
  process.env.VALID_API_KEYS = 'SANDBOX_KEY_123';
  MOCK_DPPS.length = 0;
  ORIGINAL_DPPS.forEach(d => MOCK_DPPS.push(JSON.parse(JSON.stringify(d))));
});

describe('POST /api/v1/dpp/anchor/[productId]', () => {
  it('anchors an existing product and sets contractAddress and tokenId', async () => {
    const req = new NextRequest(new Request('http://test', {
      method: 'POST',
      body: JSON.stringify({ platform: 'Ethereum' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer SANDBOX_KEY_123'
      }
    }));

    const res = await POST(req, { params: { productId: 'DPP001' } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.blockchainIdentifiers?.anchorTransactionHash).toBeDefined();
    expect(data.blockchainIdentifiers?.platform).toBe('Ethereum');
    expect(data.blockchainIdentifiers?.contractAddress).toBe('0xMOCK_CONTRACT_FOR_DPP001');
    expect(data.blockchainIdentifiers?.tokenId).toMatch(/^MOCK_TID_DPP001_[A-Z0-9]{4}$/);

    const updatedDpp = MOCK_DPPS.find(d => d.id === 'DPP001');
    expect(updatedDpp?.blockchainIdentifiers?.anchorTransactionHash).toBeDefined();
    expect(updatedDpp?.blockchainIdentifiers?.platform).toBe('Ethereum');
    expect(updatedDpp?.blockchainIdentifiers?.contractAddress).toBe('0xMOCK_CONTRACT_FOR_DPP001');
    expect(updatedDpp?.blockchainIdentifiers?.tokenId).toMatch(/^MOCK_TID_DPP001_[A-Z0-9]{4}$/);
  });

  it('returns 404 for unknown product', async () => {
    const req = new NextRequest(new Request('http://test', {
      method: 'POST',
      body: JSON.stringify({ platform: 'Ethereum' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer SANDBOX_KEY_123' }
    }));
    const res = await POST(req, { params: { productId: 'BAD_ID' } });
    expect(res.status).toBe(404);
  });

  it('returns 400 when platform is missing', async () => {
    const req = new NextRequest(new Request('http://test', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer SANDBOX_KEY_123' }
    }));
    const res = await POST(req, { params: { productId: 'DPP001' } });
    expect(res.status).toBe(400);
  });

  it('returns 401 when API key is missing', async () => {
    const req = new NextRequest(new Request('http://test', {
      method: 'POST',
      body: JSON.stringify({ platform: 'Ethereum' })
    }));
    const res = await POST(req, { params: { productId: 'DPP001' } });
    expect(res.status).toBe(401);
  });
});

