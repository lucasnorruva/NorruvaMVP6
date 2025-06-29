// --- File: src/components/developer/docs/api-reference/ApiReferenceQrEndpoints.tsx ---
"use client";

import { QrCode } from "lucide-react";
import {
  EndpointDetailCard,
  type EndpointDefinition,
} from "./EndpointDetailCard";

interface ApiReferenceQrEndpointsProps {
  exampleQrValidationResponse: string;
  error400_qr: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferenceQrEndpoints({
  exampleQrValidationResponse,
  error400_qr,
  error401,
  error404,
  error500,
}: ApiReferenceQrEndpointsProps) {
  const errorExamples = {
    "400_qr": error400_qr,
    "401": error401,
    "404": error404,
    "500": error500,
  };

  const qrEndpoints: EndpointDefinition[] = [
    {
      title: "Validate QR Code & Retrieve DPP Summary",
      method: "POST",
      path: "/api/v1/qr/validate",
      description:
        "Validates a unique identifier (typically from a QR code) and retrieves a summary of the product passport.",
      requestBodySchema: "QrValidateRequestBody",
      requestBodyExample: JSON.stringify({ qrIdentifier: "DPP001" }, null, 2),
      responseExample: exampleQrValidationResponse,
      commonErrors: ["400_qr", "401", "404", "500"],
      errorExamples,
    },
    {
      title: "Generate QR Code (JSON Response)",
      method: "GET",
      path: "/api/v1/qr/generate/{productId}",
      description:
        "Returns JSON containing a data URL for a PNG QR code image that links to the product's public passport.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Unique product ID.",
        },
      ],
      responseExample: JSON.stringify(
        {
          qrCode: "data:image/png;base64,...",
          productId: "DPP001",
          linksTo: "/passport/DPP001",
        },
        null,
        2,
      ),
      responseSchema: "QrGenerateResponse",
      commonErrors: ["401", "404", "500"],
      errorExamples,
    },
    {
      title: "Get QR Code Image",
      method: "GET",
      path: "/api/v1/qr/{productId}",
      description:
        "Returns a QR code image directly, linking to the public passport.",
      pathParams: [
        {
          name: "productId",
          type: "string",
          required: true,
          description: "Unique product ID.",
        },
      ],
      responseExample: "(Binary image data)",
      responseContentType: "image/png",
      commonErrors: ["404", "500"],
      errorExamples,
    },
  ];

  return (
    <section id="qr-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <QrCode className="mr-3 h-6 w-6 text-primary" /> QR Code & Validation
        Endpoints
      </h2>
      {qrEndpoints.map((endpoint, index) => (
        <EndpointDetailCard key={index} {...endpoint} />
      ))}
    </section>
  );
}
