import { getSortValue } from "../sortUtils";
import type { DigitalProductPassport } from "@/types/dpp";

const mockDpp: DigitalProductPassport = {
  id: "1",
  productName: "Test",
  category: "cat",
  metadata: { last_updated: "2024-01-01T00:00:00Z", status: "draft" },
  compliance: {},
};

describe("getSortValue", () => {
  it("handles metadata.status", () => {
    expect(getSortValue(mockDpp, "metadata.status")).toBe("draft");
  });
  it("handles metadata.last_updated", () => {
    expect(getSortValue(mockDpp, "metadata.last_updated")).toBe(
      new Date("2024-01-01T00:00:00Z").getTime(),
    );
  });
  it("handles ebsiVerification.status", () => {
    const dppWithEbsi: DigitalProductPassport = {
      ...mockDpp,
      ebsiVerification: {
        status: "verified",
        lastChecked: "2024-01-02T00:00:00Z",
      },
    };
    expect(getSortValue(dppWithEbsi, "ebsiVerification.status")).toBe(
      "verified",
    );
  });
  it("handles default keys", () => {
    expect(getSortValue(mockDpp, "productName")).toBe("Test");
  });
});
