
import { Server } from "lucide-react";
import {
  ListDigitalProductPassports,
  RetrieveDigitalProductPassport,
  CreateDigitalProductPassport,
  UpdateDigitalProductPassport,
  ExtendDigitalProductPassport,
  AddLifecycleEventToDpp,
  ArchiveDigitalProductPassport,
} from "./index"; // Import all from index
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

// Component for UpdateOnChainStatus
function UpdateDppOnChainStatus({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Update DPP On-Chain Status</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/onchain-status</code>
          </span>
          <br />
          Conceptually updates the on-chain status of a Digital Product Passport.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - UpdateOnChainStatusRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
          <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid status value or missing field.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// Component for UpdateOnChainLifecycleStage
function UpdateDppOnChainLifecycleStage({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Update DPP On-Chain Lifecycle Stage</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/onchain-lifecycle-stage</code>
          </span>
          <br />
          Conceptually updates the on-chain lifecycle stage of a Digital Product Passport.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - UpdateOnChainLifecycleStageRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
           <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
         <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid lifecycleStage value or missing field.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// Component for LogCriticalEvent
function LogDppCriticalEvent({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Log Critical Event for a DPP</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/log-critical-event</code>
          </span>
          <br />
          Conceptually logs a critical event on-chain for a specified DPP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - LogCriticalEventRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
           <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
         <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Missing eventDescription or invalid severity.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// Component for RegisterVcHash
function RegisterDppVcHash({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Register Verifiable Credential Hash</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/register-vc-hash</code>
          </span>
          <br />
          Conceptually registers a Verifiable Credential's hash on-chain for a DPP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - RegisterVcHashRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
           <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
         <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Missing vcId or vcHash.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}


// Component for Issue Authentication VC
function IssueDppAuthVc({ exampleDppResponse, error401, error404, error500 }: { exampleDppResponse: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Issue Authentication Verifiable Credential (VC)</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/issue-auth-vc</code>
          </span>
          <br />
          Conceptually issues an authentication VC for the product and links its ID to the DPP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body</h4>
          <p className="text-sm mb-1">No request body is required for this conceptual endpoint.</p>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
          <p className="text-sm mb-1">Returns a confirmation message, the product ID, the new VC ID, and the updated DPP object.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code> (Product not found).</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// Component for Link Ownership NFT
function LinkDppOwnershipNft({ exampleDppResponse, error400, error401, error404, error500 }: { exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  const exampleRequestBody = JSON.stringify({
    registryUrl: "https://mock-nft-market.example/token/0xContract/123",
    contractAddress: "0xMockNFTContractAddressForDPP",
    tokenId: "123",
    chainName: "MockEthereum"
  }, null, 2);
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Link Ownership NFT to DPP</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/link-nft</code>
          </span>
          <br />
          Conceptually links an NFT representing product ownership to the specified DPP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - OwnershipNftLinkRequestBody</h4>
           <p className="text-sm mb-1">Requires contractAddress and tokenId. Registry URL and chainName are optional.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
          <p className="text-sm mb-1">Returns a confirmation message, the product ID, the linked NFT details, and the updated DPP object.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Missing contractAddress or tokenId.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code> (Product not found).</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}


interface DppEndpointsProps {
  exampleListDppsResponse: string;
  exampleDppResponse: string;
  conceptualCreateDppRequestBody: string;
  conceptualCreateDppResponseBody: string;
  conceptualUpdateDppRequestBody: string;
  conceptualUpdateDppResponseBody: string;
  conceptualDeleteDppResponseBody: string;
  conceptualPatchDppExtendRequestBody: string;
  conceptualPatchDppExtendResponseBody: string;
  addLifecycleEventRequestBodyExample: string;
  addLifecycleEventResponseExample: string;
  // Props for new conceptual on-chain operations
  exampleUpdateOnChainStatusRequestBody: string;
  exampleUpdateOnChainLifecycleStageRequestBody: string;
  exampleLogCriticalEventRequestBody: string;
  exampleRegisterVcHashRequestBody: string;
  exampleUpdatedDppResponse: string; 
  // Error responses
  error401: string;
  error404: string;
  error500: string;
  error400_create_dpp: string;
  error400_update_dpp: string;
  error400_patch_dpp: string;
  error400_lifecycle_event: string;
  error400_general: string;
}

export default function ApiReferenceDppEndpoints(props: DppEndpointsProps) {
  return (
    <section id="dpp-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> Digital Product
        Passport (DPP) Endpoints
      </h2>
      <ListDigitalProductPassports
        exampleListDppsResponse={props.exampleListDppsResponse}
        error401={props.error401}
        error500={props.error500}
      />
      <RetrieveDigitalProductPassport
        exampleDppResponse={props.exampleDppResponse}
        error401={props.error401}
        error500={props.error500}
      />
      <CreateDigitalProductPassport
        conceptualCreateDppRequestBody={props.conceptualCreateDppRequestBody}
        conceptualCreateDppResponseBody={props.conceptualCreateDppResponseBody}
        error400_create_dpp={props.error400_create_dpp}
        error401={props.error401}
        error500={props.error500}
      />
      <UpdateDigitalProductPassport
        conceptualUpdateDppRequestBody={props.conceptualUpdateDppRequestBody}
        conceptualUpdateDppResponseBody={props.conceptualUpdateDppResponseBody}
        error400_update_dpp={props.error400_update_dpp}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <ExtendDigitalProductPassport
        conceptualPatchDppExtendRequestBody={
          props.conceptualPatchDppExtendRequestBody
        }
        conceptualPatchDppExtendResponseBody={
          props.conceptualPatchDppExtendResponseBody
        }
        error400_patch_dpp={props.error400_patch_dpp}
      />
      <AddLifecycleEventToDpp
        addLifecycleEventRequestBodyExample={
          props.addLifecycleEventRequestBodyExample
        }
        addLifecycleEventResponseExample={
          props.addLifecycleEventResponseExample
        }
        error400_lifecycle_event={props.error400_lifecycle_event}
      />
      <ArchiveDigitalProductPassport
        conceptualDeleteDppResponseBody={props.conceptualDeleteDppResponseBody}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <IssueDppAuthVc 
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <LinkDppOwnershipNft
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <UpdateDppOnChainStatus
        exampleRequestBody={props.exampleUpdateOnChainStatusRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <UpdateDppOnChainLifecycleStage
        exampleRequestBody={props.exampleUpdateOnChainLifecycleStageRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <LogDppCriticalEvent
        exampleRequestBody={props.exampleLogCriticalEventRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <RegisterDppVcHash
        exampleRequestBody={props.exampleRegisterVcHashRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
    </section>
  );
}

ApiReferenceDppEndpoints.defaultProps = {
  error400_general: JSON.stringify({ error: { code: 400, message: "Invalid request body or parameters." } }, null, 2)
};
