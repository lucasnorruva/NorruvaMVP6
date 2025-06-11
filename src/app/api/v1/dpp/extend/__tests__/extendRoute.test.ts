import { PATCH } from '../[productId]/route';
import { MOCK_DPPS } from '@/data';

describe('extend PATCH route - chainOfCustodyUpdate', () => {
  it('appends custody step and returns updated DPP', async () => {
    const productId = MOCK_DPPS[0].id;
    const initialLength = MOCK_DPPS[0].traceability?.supplyChainSteps?.length || 0;

    const body = {
      chainOfCustodyUpdate: {
        newOwnerDid: 'did:example:newOwner',
        transferTimestamp: '2024-08-01T12:00:00Z'
      }
    };

    const mockRequest = { json: jest.fn().mockResolvedValue(body) } as any;

    const response = await PATCH(mockRequest, { params: { productId } });
    const data = await response.json();

    expect(data.traceability.supplyChainSteps.length).toBe(initialLength + 1);
    const added = data.traceability.supplyChainSteps[initialLength];
    expect(added.actorDid).toBe(body.chainOfCustodyUpdate.newOwnerDid);
    expect(added.timestamp).toBe(body.chainOfCustodyUpdate.transferTimestamp);
    expect(added.stepName).toBe('Ownership Transfer');

    expect(MOCK_DPPS[0].traceability?.supplyChainSteps?.length).toBe(initialLength + 1);
  });
});
