import { POST } from "../../app/api/v1/dpp/anchor/[productId]/route";
import { MOCK_DPPS } from "@/data";

function createRequest(body: any) {
  return new Request("http://test", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("anchor route", () => {
  it("anchors an existing product", async () => {
    const res = await POST(createRequest({ platform: "TestChain" }) as any, {
      params: { productId: "DPP001" },
    });
    const data = await res.json();
    expect(data.blockchainIdentifiers.anchorTransactionHash).toBeDefined();
    expect(data.blockchainIdentifiers.platform).toBe("TestChain");
  });

  it("returns 400 when platform missing", async () => {
    const res = await POST(createRequest({}) as any, {
      params: { productId: "DPP001" },
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown product", async () => {
    const res = await POST(createRequest({ platform: "Chain" }) as any, {
      params: { productId: "UNKNOWN" },
    });
    expect(res.status).toBe(404);
  });
});
