import { POST, GET } from "../v1/dpp/route";
import { MOCK_DPPS } from "@/data";
import { MOCK_DPPS as ORIGINAL_DPPS } from "@/data/mockDpps";
import { NextRequest } from "next/server";

beforeEach(() => {
  process.env.VALID_API_KEYS = "SANDBOX_KEY_123";
  MOCK_DPPS.length = 0;
  ORIGINAL_DPPS.forEach((d) => MOCK_DPPS.push(JSON.parse(JSON.stringify(d))));
});

describe("/api/v1/dpp route", () => {
  it("creates a new DPP when payload is valid", async () => {
    const body = { productName: "Test Prod", category: "TestCat" };
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
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.productName).toBe("Test Prod");
    expect(MOCK_DPPS.some((d) => d.id === data.id)).toBe(true);
  });

  it("returns 400 when required fields missing", async () => {
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({ category: "TestCat" }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer SANDBOX_KEY_123",
        },
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("lists DPPs with valid API key", async () => {
    const req = new NextRequest(
      new Request("http://test?status=published", {
        headers: { Authorization: "Bearer SANDBOX_KEY_123" },
      }),
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.filtersApplied.status).toBe("published");
  });

  it("returns 401 when API key missing", async () => {
    const req = new NextRequest(new Request("http://test"));
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
