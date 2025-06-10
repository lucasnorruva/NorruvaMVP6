
import { describe, it, expect } from 'vitest';
import { generateMockCodeSnippet } from '../apiPlaygroundUtils';

describe('generateMockCodeSnippet', () => {
  const apiKeyPlaceholder = 'YOUR_SANDBOX_API_KEY';
  const baseUrl = '/api/v1';

  // Test cases for GET requests
  describe('GET requests', () => {
    it('should generate cURL snippet for GET /dpp/{productId}', () => {
      const snippet = generateMockCodeSnippet('getProduct', 'GET', 'cURL', { productId: 'DPP001' }, null, 'sandbox');
      expect(snippet).toContain(`curl -X GET`);
      expect(snippet).toContain(`'${baseUrl}/dpp/DPP001'`);
      expect(snippet).toContain(`-H 'Authorization: Bearer ${apiKeyPlaceholder}'`);
    });

    it('should generate JavaScript snippet for GET /dpp (listDpps) with query params', () => {
      const params = { status: 'published', category: 'Electronics', searchQuery: 'Smart', blockchainAnchored: 'anchored' };
      const snippet = generateMockCodeSnippet('listDpps', 'GET', 'JavaScript', params, null, 'sandbox');
      expect(snippet).toContain(`fetch('${baseUrl}/dpp?status=published&category=Electronics&searchQuery=Smart&blockchainAnchored=anchored', {`);
      expect(snippet).toContain(`method: 'GET'`);
      expect(snippet).toContain(`'Authorization': 'Bearer ${apiKeyPlaceholder}'`);
    });

    it('should generate Python snippet for GET /dpp/history/{productId}', () => {
      const snippet = generateMockCodeSnippet('getDppHistory', 'GET', 'Python', { productId: 'DPP007' }, null, 'sandbox');
      expect(snippet).toContain(`requests.request("GET", url, headers=headers)`);
      expect(snippet).toContain(`url = "${baseUrl}/dpp/history/DPP007"`);
      expect(snippet).toContain(`"Authorization": "Bearer ${apiKeyPlaceholder}"`);
    });
  });

  // Test cases for POST requests
  describe('POST requests', () => {
    const sampleBody = JSON.stringify({ name: 'Test Product', category: 'Test' });
    it('should generate cURL snippet for POST /dpp (createDpp)', () => {
      const snippet = generateMockCodeSnippet('createDpp', 'POST', 'cURL', {}, sampleBody, 'sandbox');
      expect(snippet).toContain(`curl -X POST`);
      expect(snippet).toContain(`'${baseUrl}/dpp'`);
      expect(snippet).toContain(`-H 'Content-Type: application/json'`);
      expect(snippet).toContain(`-d '${sampleBody}'`);
    });

    it('should generate JavaScript snippet for POST /qr/validate', () => {
      const qrBody = JSON.stringify({ qrIdentifier: 'QR123' });
      const snippet = generateMockCodeSnippet('qrValidate', 'POST', 'JavaScript', {}, qrBody, 'sandbox');
      expect(snippet).toContain(`fetch('${baseUrl}/qr/validate', {`);
      expect(snippet).toContain(`method: 'POST'`);
      expect(snippet).toContain(`body: JSON.stringify(${qrBody})`);
    });

    it('should generate Python snippet for POST /dpp/{productId}/lifecycle-events', () => {
        const eventBody = JSON.stringify({ eventType: "Shipped", location: "Warehouse" });
        const snippet = generateMockCodeSnippet('addLifecycleEvent', 'POST', 'Python', { productId: 'DPP003' }, eventBody, 'sandbox');
        expect(snippet).toContain(`requests.request("POST", url, headers=headers, json=payload)`);
        expect(snippet).toContain(`url = "${baseUrl}/dpp/DPP003/lifecycle-events"`);
        expect(snippet).toContain(`payload = json.loads("""${eventBody}""")`);
    });
  });

  // Test cases for PUT requests
  describe('PUT requests', () => {
    const updateBody = JSON.stringify({ description: 'Updated description' });
    it('should generate cURL snippet for PUT /dpp/{productId}', () => {
      const snippet = generateMockCodeSnippet('updateDpp', 'PUT', 'cURL', { productId: 'DPP002' }, updateBody, 'sandbox');
      expect(snippet).toContain(`curl -X PUT`);
      expect(snippet).toContain(`'${baseUrl}/dpp/DPP002'`);
      expect(snippet).toContain(`-d '${updateBody}'`);
    });
  });

  // Test cases for PATCH requests
  describe('PATCH requests', () => {
    const patchBody = JSON.stringify({ documentReference: { documentName: "Test Doc" }});
    it('should generate JavaScript snippet for PATCH /dpp/extend/{productId}', () => {
      const snippet = generateMockCodeSnippet('patchDppExtend', 'PATCH', 'JavaScript', { productId: 'DPP004' }, patchBody, 'sandbox');
      expect(snippet).toContain(`fetch('${baseUrl}/dpp/extend/DPP004', {`);
      expect(snippet).toContain(`method: 'PATCH'`);
      expect(snippet).toContain(`body: JSON.stringify(${patchBody})`);
    });
  });

  // Test cases for DELETE requests
  describe('DELETE requests', () => {
    it('should generate Python snippet for DELETE /dpp/{productId}', () => {
      const snippet = generateMockCodeSnippet('deleteDpp', 'DELETE', 'Python', { productId: 'DPP005' }, null, 'sandbox');
      expect(snippet).toContain(`requests.request("DELETE", url, headers=headers)`);
      expect(snippet).toContain(`url = "${baseUrl}/dpp/DPP005"`);
    });
  });

  it('should handle unknown endpoint key gracefully', () => {
    const snippet = generateMockCodeSnippet('unknownEndpoint', 'GET', 'cURL', {}, null, 'sandbox');
    expect(snippet).toContain('/unknown-endpoint');
  });

  it('should return a message for unsupported language', () => {
    const snippet = generateMockCodeSnippet('getProduct', 'GET', 'Java', { productId: 'DPP001' }, null, 'sandbox');
    expect(snippet).toBe("Code snippet not available for this language.");
  });

  it('should use production API key placeholder for production environment', () => {
    const snippet = generateMockCodeSnippet('getProduct', 'GET', 'cURL', { productId: 'DPP001' }, null, 'production');
    expect(snippet).toContain(`-H 'Authorization: Bearer YOUR_PRODUCTION_API_KEY'`);
  });

  it('should correctly construct URL for listDpps with no filters', () => {
    const snippet = generateMockCodeSnippet('listDpps', 'GET', 'cURL', {}, null, 'sandbox');
    expect(snippet).toContain(`'${baseUrl}/dpp'`);
    expect(snippet).not.toContain('?');
  });
});

    