
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth'; // Import API key validation
import { getOverallComplianceDetails } from '@/utils/dppDisplayUtils'; // For consistent status

export async function GET(
  request: NextRequest, // Changed from _request to request to use it for auth
  { params }: { params: { productId: string } }
) {
  const auth = validateApiKey(request); // Add API key validation
  if (auth) return auth;

  const productId = params.productId;
  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay

  if (!product) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const now = new Date().toISOString();
  const overallCompliance = getOverallComplianceDetails(product);

  const credentialSubject: Record<string, any> = {
    id: product.id, // Product ID itself as the subject ID
    productIdentifier: product.id, // Explicit product ID field
    productName: product.productName,
    category: product.category,
    manufacturer: product.manufacturer?.name || "N/A",
    modelNumber: product.modelNumber || "N/A",
    gtin: product.gtin || "N/A",
    description: product.productDetails?.description?.substring(0, 150) + (product.productDetails?.description && product.productDetails.description.length > 150 ? "..." : "") || "No description available.",
    imageUrl: product.productDetails?.imageUrl || null,
    dppPublicUrl: `/passport/${product.id}`, // Conceptual link to public viewer
    overallComplianceStatus: overallCompliance.text,
    ebsiVerificationStatus: product.ebsiVerification?.status || "N/A",
    lastUpdated: product.metadata.last_updated,
  };

  // Add some key specifications if available
  if (product.productDetails?.specifications) {
    try {
      const specs = JSON.parse(product.productDetails.specifications);
      const specKeys = Object.keys(specs).slice(0, 3); // Max 3 specs
      specKeys.forEach(key => {
        credentialSubject[`specification_${key.toLowerCase().replace(/\s+/g, '_')}`] = specs[key];
      });
    } catch (e) {
      // Ignore if specs are not valid JSON
    }
  }
  
  // Add first 2 custom attributes if they exist
  if (product.productDetails?.customAttributes && product.productDetails.customAttributes.length > 0) {
    product.productDetails.customAttributes.slice(0, 2).forEach(attr => {
      credentialSubject[`custom_${attr.key.toLowerCase().replace(/\s+/g, '_')}`] = attr.value;
    });
  }


  const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1" // Example context
    ],
    id: `urn:uuid:vc-${product.id}-${Date.now()}`, // More unique VC ID
    type: ["VerifiableCredential", "DigitalProductPassportSummaryCredential_v1.0"],
    issuer: product.manufacturer?.did || `did:example:issuer:${product.manufacturer?.name.replace(/\s+/g, '') || 'norruva'}`,
    issuanceDate: now,
    credentialSubject: credentialSubject,
    proof: { // Conceptual proof
      type: "Ed25519Signature2020", // More modern signature type example
      created: now,
      proofPurpose: "assertionMethod",
      verificationMethod: `${product.manufacturer?.did || `did:example:issuer:${product.manufacturer?.name.replace(/\s+/g, '') || 'norruva'}`}#key-1`,
      jws: "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..mock-signature-for-dpp-${product.id}" // Mock JWS
    },
  };

  return NextResponse.json(credential);
}
