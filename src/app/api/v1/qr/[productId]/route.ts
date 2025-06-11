import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  try {
    const dataUrl = await QRCode.toDataURL(`/passport/${productId}`);
    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="qr-${productId}.png"`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: { code: 500, message: 'Failed to generate QR code.' } }, { status: 500 });
  }
}
