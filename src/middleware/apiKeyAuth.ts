import { NextRequest, NextResponse } from "next/server";
import { API_KEYS } from "@/config/auth";

export function validateApiKey(request: NextRequest): NextResponse | undefined {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: {
          code: 401,
          message: "API key missing or invalid (no Bearer token).",
        },
      },
      { status: 401 },
    );
  }
  const providedKey = authHeader.slice("Bearer ".length).trim();

  if (!API_KEYS.includes(providedKey)) {
    // For server-side debugging, you might log here in a real scenario:
    // console.log('Auth failed. Provided Key:', providedKey, 'Expected Keys:', API_KEYS, 'Raw ENV:', process.env.VALID_API_KEYS);
    return NextResponse.json(
      {
        error: {
          code: 401,
          message: "API key missing or invalid (key not found in valid list).",
        },
      },
      { status: 401 },
    );
  }
  return undefined; // Key is valid
}
