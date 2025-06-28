
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

interface ApiReferenceTokenEndpointsProps {
  mintRequest: string;
  mintResponse: string;
  updateRequest: string;
  updateResponse: string;
  statusResponse: string;
  error401: string;
  error404: string;
  error500: string;
}

const EndpointDetailCard: React.FC<any> = ({
  title, method, path, description, pathParams, requestBodySchema, requestBodyExample, responseSchema, responseExample, commonErrors, errorExamples
}) => {
  const getBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-sky-100 text-sky-700 border-sky-300";
      case "POST": return "bg-green-100 text-green-700 border-green-300";
      case "PATCH": return "bg-orange-100 text-orange-700 border-orange-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className={`${getBadgeClass(method)} mr-2 font-semibold`}>{method}</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">{path}</code>
          </span>
          <br />
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(pathParams && pathParams.length > 0) && (
          <section><h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pathParams.map((p: any) => <li key={p.name}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{p.name}</code> ({p.type}, {p.required ? 'required' : 'optional'}): {p.description}</li>)}
            </ul>
          </section>
        )}
        {requestBodyExample && (
          <section><h4 className="font-semibold mb-1">Request Body {requestBodySchema && `(${requestBodySchema})`}</h4>
            <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{requestBodyExample}</code></pre></details>
          </section>
        )}
        <section><h4 className="font-semibold mb-1">Example Response (Success) {responseSchema && `(${responseSchema})`}</h4>
          <details className="border rounded-md"><summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
          <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{responseExample}</code></pre></details>
        </section>
        {(commonErrors && commonErrors.length > 0) && (
          <section><h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              {commonErrors.map((errCode: string) => (
                <li key={errCode}><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">{errCode.split('_')[0]} {errCode.includes('_') ? errCode.split('_')[1].toUpperCase() : 'Bad Request'}</code>
                  {errorExamples[errCode] && (
                    <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{errorExamples[errCode]}</code></pre></details>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
};


export default function ApiReferenceTokenEndpoints({
  mintRequest,
  mintResponse,
  updateRequest,
  updateResponse,
  statusResponse,
  error401,
  error404,
  error500,
}: ApiReferenceTokenEndpointsProps) {

  const tokenEndpoints = [
    { id: "mintDppToken", title: "Mint DPP Token", method: "POST", path: "/api/v1/token/mint/{productId}", description: "Mints a blockchain token representing the specified product passport.", pathParams: [{ name: "productId", type: "string", required: true, description: "Product ID." }], requestBodySchema: "MintTokenRequest", requestBodyExample: mintRequest, responseSchema: "MintTokenResponse", responseExample: mintResponse, commonErrors: ["401", "404", "500"] },
    { id: "updateTokenMetadata", title: "Update Token Metadata", method: "PATCH", path: "/api/v1/token/metadata/{tokenId}", description: "Updates the on-chain metadata URI for a minted DPP token.", pathParams: [{ name: "tokenId", type: "string", required: true, description: "Blockchain token ID." }], requestBodySchema: "UpdateTokenMetadataRequest", requestBodyExample: updateRequest, responseSchema: "UpdateTokenMetadataResponse", responseExample: updateResponse, commonErrors: ["401", "404", "500"] },
    { id: "getTokenStatus", title: "Retrieve Token On-Chain Status", method: "GET", path: "/api/v1/token/status/{tokenId}", description: "Retrieves on-chain information for a DPP token.", pathParams: [{ name: "tokenId", type: "string", required: true, description: "Blockchain token ID." }], responseSchema: "TokenStatusResponse", responseExample: statusResponse, commonErrors: ["401", "404", "500"] }
  ];
  
  const errorExamples: Record<string, string> = { "401": error401, "404": error404, "500": error500 };

  return (
    <section id="token-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> DPP Token Endpoints
      </h2>
      {tokenEndpoints.map(endpoint => (
        <EndpointDetailCard key={endpoint.id} {...endpoint} errorExamples={errorExamples} />
      ))}
    </section>
  );
}

