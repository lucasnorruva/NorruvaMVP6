import { PATCH } from '../[productId]/route';
import { MOCK_DPPS } from '@/data';

describe('custody PATCH route', () => {
  it('appends custody step and returns updated DPP', async () => {
    const productId = MOCK_DPPS[0].id;
    const initialLength = MOCK_DPPS[0].traceability?.supplyChainSteps?.length || 0;

    const body = {
      stepName: 'Custody Transfer',
      actorDid: 'did:example:newCustodian',
      timestamp: '2024-08-01T12:00:00Z',
      location: 'Warehouse Z',
      transactionHash: '0xnewhash'
    };

    const mockRequest = { json: jest.fn().mockResolvedValue(body) } as any;

    const response = await PATCH(mockRequest, { params: { productId } });
    const data = await response.json();

    expect(data.traceability.supplyChainSteps.length).toBe(initialLength + 1);
    const added = data.traceability.supplyChainSteps[initialLength];
    expect(added.actorDid).toBe(body.actorDid);
    expect(added.timestamp).toBe(body.timestamp);
    expect(added.location).toBe(body.location);
    expect(added.transactionHash).toBe(body.transactionHash);

    expect(MOCK_DPPS[0].traceability?.supplyChainSteps?.length).toBe(initialLength + 1);
  });
});
