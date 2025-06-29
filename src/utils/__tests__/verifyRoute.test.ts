import { POST } from "../../app/api/v1/dpp/verify/[productId]/route";

function createRequest() {
  return new Request("http://test", {
    method: "POST",
    headers: { Authorization: "Bearer TESTKEY" },
  }) as any;
}

describe("verify route", () => {
  beforeAll(() => {
    process.env.VALID_API_KEYS = "TESTKEY";
  });

  it("verifies an existing product", async () => {
    const res = await POST(createRequest(), {
      params: { productId: "DPP001" },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.productId).toBe("DPP001");
    expect(data.verificationStatus).toBeDefined();
    expect(data.message).toBeDefined();
    expect(data.timestamp).toBeDefined();
    expect(Array.isArray(data.checksPerformed)).toBe(true);
  });

  it("returns 404 for unknown product", async () => {
    const res = await POST(createRequest(), {
      params: { productId: "UNKNOWN" },
    });
    expect(res.status).toBe(404);
  });

  it("returns 400 when productId is empty", async () => {
    const res = await POST(createRequest(), { params: { productId: "" } });
    expect(res.status).toBe(400);
  });
});
