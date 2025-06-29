import { GET as listDpp } from "@/app/api/v1/dpp/route";
import { POST as validateQr } from "@/app/api/v1/qr/validate/route";

const makeRequest = (
  url: string,
  headers: Record<string, string> = {},
  body?: any,
) =>
  ({
    url,
    headers: new Headers(headers),
    json: async () => body,
  }) as any;

describe("API routes authentication", () => {
  beforeAll(() => {
    process.env.VALID_API_KEYS = "KEY1,KEY2";
  });

  afterAll(() => {
    delete process.env.VALID_API_KEYS;
  });

  it("returns 401 when Authorization header is missing", async () => {
    const res = await listDpp(makeRequest("http://test"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when API key is invalid", async () => {
    const res = await validateQr(
      makeRequest(
        "http://test",
        { Authorization: "Bearer BAD" },
        { qrIdentifier: "id" },
      ),
    );
    expect(res.status).toBe(401);
  });

  it("allows request when API key matches the first configured key", async () => {
    const res = await listDpp(
      makeRequest("http://test", { Authorization: "Bearer KEY1" }),
    );
    expect(res.status).toBe(200);
  });

  it("allows request when API key matches another configured key", async () => {
    const res = await validateQr(
      makeRequest(
        "http://test",
        { Authorization: "Bearer KEY2" },
        { qrIdentifier: "DPP001" },
      ),
    );
    expect(res.status).toBe(200);
  });
});
