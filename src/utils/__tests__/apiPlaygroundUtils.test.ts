import { generateMockCodeSnippet } from "../apiPlaygroundUtils";

describe("generateMockCodeSnippet", () => {
  it("generates cURL snippet", () => {
    const result = generateMockCodeSnippet(
      "getProduct",
      "GET",
      "cURL",
      { productId: "123" },
      null,
      "dev",
    );
    expect(result).toBe(
      "curl -X GET \\\n  '/api/v1/dpp/123' \\\n  -H 'Authorization: Bearer YOUR_DEV_API_KEY'",
    );
  });

  it("generates JavaScript snippet", () => {
    const result = generateMockCodeSnippet(
      "createDpp",
      "POST",
      "JavaScript",
      {},
      '{"name":"foo"}',
      "prod",
    );
    expect(result).toBe(
      "fetch('/api/v1/dpp', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_PROD_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\"name\":\"foo\"})\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));",
    );
  });

  it("generates Python snippet", () => {
    const result = generateMockCodeSnippet(
      "updateDpp",
      "PUT",
      "Python",
      { productId: "abc" },
      '{"hi":"there"}',
      "prod",
    );
    expect(result).toBe(
      'import requests\nimport json\n\nurl = "/api/v1/dpp/abc"\nheaders = {\n  "Authorization": "Bearer YOUR_PROD_API_KEY",\n  "Content-Type": "application/json"\n}\npayload = json.loads("""{"hi":"there"}""")\nresponse = requests.request("PUT", url, headers=headers, json=payload)\n\nprint(response.json())',
    );
  });

  it("handles unsupported language", () => {
    const result = generateMockCodeSnippet(
      "getProduct",
      "GET",
      "Ruby",
      { productId: "123" },
      null,
      "dev",
    );
    expect(result).toBe("Code snippet not available for this language.");
  });
});
