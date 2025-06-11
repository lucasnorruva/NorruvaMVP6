import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';

export async function GET(
  _request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  await new Promise(resolve => setTimeout(resolve, 100));

  if (!product) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const now = new Date().toISOString();

  const credential = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: `urn:uuid:${productId}`,
    type: ["VerifiableCredential", "DigitalProductPassportCredential"],
    issuer: product.manufacturer?.did || "did:example:norruva",
    issuanceDate: now,
    credentialSubject: {
      id: product.id,
      productName: product.productName,
      category: product.category,
      manufacturer: product.manufacturer?.name,
      modelNumber: product.modelNumber,
      gtin: product.gtin,
    },
    proof: {
      type: "Ed25519Signature2018",
      created: now,
      proofPurpose: "assertionMethod",
      verificationMethod: "did:example:norruva#key-1",
      jws: "eyJhbGciOiJFZERTQSJ9..mock",
    },
  };

  return NextResponse.json(credential);
}
