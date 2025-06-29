import { POST } from "../v1/qr/validate/route";
import { MOCK_DPPS } from "@/data";
import { MOCK_DPPS as ORIGINAL_DPPS } from "@/data/mockDpps";
import { NextRequest } from "next/server";

beforeEach(() => {
  process.env.VALID_API_KEYS = "SANDBOX_KEY_123";
  MOCK_DPPS.length = 0;
  ORIGINAL_DPPS.forEach((d) => MOCK_DPPS.push(JSON.parse(JSON.stringify(d))));
});

describe("/api/v1/qr/validate route", () => {
  it("returns product summary for valid qrIdentifier", async () => {
    const body = { qrIdentifier: "DPP001" };
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer SANDBOX_KEY_123",
        },
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.productId).toBe("DPP001");
  });

  it("returns 404 for unknown qrIdentifier", async () => {
    const body = { qrIdentifier: "UNKNOWN" };
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer SANDBOX_KEY_123",
        },
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 when qrIdentifier missing", async () => {
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer SANDBOX_KEY_123",
        },
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
