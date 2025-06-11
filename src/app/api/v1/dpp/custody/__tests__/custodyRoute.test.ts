import { PATCH } from '../[productId]/route';
import { MOCK_DPPS } from '@/data';

describe('custody PATCH route', () => {
  it('appends custody step and returns updated DPP', async () => {
    const productId = MOCK_DPPS[0].id;
    const initialLength = MOCK_DPPS[0].traceability?.supplyChainSteps?.length || 0;

    const body = {
      did: 'did:example:newCustodian',
      timestamp: '2024-08-01T12:00:00Z',
      location: 'Warehouse Z'
    };

    const mockRequest = { json: jest.fn().mockResolvedValue(body) } as any;

    const response = await PATCH(mockRequest, { params: { productId } });
    const data = await response.json();

    expect(data.traceability.supplyChainSteps.length).toBe(initialLength + 1);
    const added = data.traceability.supplyChainSteps[initialLength];
    expect(added.actorDid).toBe(body.did);
    expect(added.timestamp).toBe(body.timestamp);
    expect(added.location).toBe(body.location);

    expect(MOCK_DPPS[0].traceability?.supplyChainSteps?.length).toBe(initialLength + 1);
  });
});
