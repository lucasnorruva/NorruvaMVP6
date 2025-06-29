import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/apiKeyAuth";
import { MOCK_IMPORT_JOBS } from "@/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  const auth = validateApiKey(request);
  if (auth) return auth;

  const job = MOCK_IMPORT_JOBS.get(params.jobId);

  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!job) {
    return NextResponse.json(
      {
        error: { code: 404, message: `Job with ID ${params.jobId} not found.` },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(job);
}
