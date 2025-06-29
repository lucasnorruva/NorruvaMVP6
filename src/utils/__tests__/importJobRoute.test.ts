import { POST as importDpp } from "../../app/api/v1/dpp/import/route";
import { GET as getJob } from "../../app/api/v1/dpp/import/jobs/[jobId]/route";

function postRequest(body: any) {
  return new Request("http://test", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: "Bearer TESTKEY" },
  }) as any;
}

function getRequest() {
  return new Request("http://test", {
    headers: { Authorization: "Bearer TESTKEY" },
  }) as any;
}

describe("import job status route", () => {
  beforeAll(() => {
    process.env.VALID_API_KEYS = "TESTKEY";
  });

  it("returns 404 for unknown job ID", async () => {
    const res = await getJob(getRequest(), { params: { jobId: "UNKNOWN" } });
    expect(res.status).toBe(404);
  });

  it("returns stored status for known job", async () => {
    const postRes = await importDpp(
      postRequest({ fileType: "csv", data: "foo" }),
    );
    const postData = await postRes.json();
    const jobId = postData.jobId;
    const res = await getJob(getRequest(), { params: { jobId } });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("PendingProcessing");
    expect(data.jobId).toBe(jobId);
  });
});
