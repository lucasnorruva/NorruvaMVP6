
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import QRCode from 'qrcode';
import { validateApiKey } from '@/middleware/apiKeyAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  const authError = validateApiKey(request); // No API key for public QR image
  if (authError) return authError;

  // Construct the full URL for the passport page
  const passportPageUrl = `${request.nextUrl.origin}/passport/${productId}`;

  try {
    const dataUrl = await QRCode.toDataURL(passportPageUrl);
    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="qr-${productId}.png"`
      }
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    return NextResponse.json({ error: { code: 500, message: 'Failed to generate QR code.' } }, { status: 500 });
  }
}
