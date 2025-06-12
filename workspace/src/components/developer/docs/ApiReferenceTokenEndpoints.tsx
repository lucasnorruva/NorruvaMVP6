
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server, ArrowRight } from "lucide-react";

interface TokenEndpointsProps {
  mintRequest: string;
  mintResponse: string;
  updateRequest: string;
  updateResponse: string;
  statusResponse: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferenceTokenEndpoints({
  mintRequest,
  mintResponse,
  updateRequest,
  updateResponse,
  statusResponse,
  error401,
  error404,
  error500,
}: TokenEndpointsProps) {
  return (
    <section id="token-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> DPP Token Endpoints (Conceptual Smart Contract Interaction)
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        These API endpoints facilitate interactions with the conceptual DPPToken smart contract. The descriptions below outline how a backend service for these APIs would typically interact with the blockchain. The current playground uses mock responses.
      </p>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Mint DPP Token</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/token/mint/{"{productId}"}</code>
            </span>
            <br />
            Mints a blockchain token (e.g., ERC-721 NFT) representing the specified product passport.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product for which to mint a token.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON) - MintTokenRequest</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
              <code>{mintRequest}</code>
            </pre>
             <ul className="list-disc list-inside text-sm space-y-1 mt-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">contractAddress</code> (string, required): Smart contract address (DPPToken) to use for minting.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">recipientAddress</code> (string, required): Blockchain address to receive the token (e.g., the manufacturer's or initial owner's address).</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">metadataUri</code> (string, optional but recommended): URI pointing to the off-chain metadata for the token. This will be used to construct the `metadataHash` for the smart contract.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Conceptual Backend Interaction</h4>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>The backend receives the request and validates the `productId` and request body.</li>
              <li>It retrieves the full DPP data for the `productId` to determine or construct the `metadataHash`. (E.g., hash the DPP JSON or use a pre-calculated hash).</li>
              <li>A unique `tokenId` for the new token is generated or assigned (e.g., derived from `productId`, or a sequential counter).</li>
              <li>The backend, using a pre-configured wallet with `MINTER_ROLE` on the `DPPToken.sol` contract, calls:
                <br /><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dppToken.mint(recipientAddress, tokenId, metadataHash)</code>.
              </li>
              <li>The backend waits for the transaction to be mined.</li>
              <li>The `transactionHash` and the minted `tokenId` are returned in the API response.</li>
              <li>The `MOCK_DPPS` data is updated with the `tokenId` and `contractAddress`.</li>
            </ol>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (201 Created)</h4>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{mintResponse}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Missing required fields in body.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code> (Product for `productId` not found).</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code> (e.g., if blockchain interaction fails).</li>
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Update Token Metadata</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 mr-2 font-semibold">PATCH</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/token/metadata/{"{tokenId}"}</code>
            </span>
            <br />
            Updates the metadata URI (which implies updating the `metadataHash`) stored on-chain for an existing token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
         <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">tokenId</code> (string, required): The ID of the token to update.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Request Body (JSON) - UpdateTokenMetadataRequest</h4>
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto mt-2">
              <code>{updateRequest}</code>
            </pre>
            <ul className="list-disc list-inside text-sm space-y-1 mt-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">metadataUri</code> (string, required): New URI for the off-chain metadata. The backend would typically hash this or parts of it to get the `newMetadataHash`.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">contractAddress</code> (string, optional): Contract address if different from a default `DPPToken` address.</li>
            </ul>
          </section>
           <section>
            <h4 className="font-semibold mb-1">Conceptual Backend Interaction</h4>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>The backend receives the request and validates the `tokenId` and `metadataUri`.</li>
              <li>It derives/calculates the `newMetadataHash` from the provided `metadataUri`.</li>
              <li>Using a wallet with `UPDATER_ROLE` (or the token owner's delegated key), it calls:
                <br /><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dppToken.updateMetadataHash(tokenId, newMetadataHash)</code>.
              </li>
              <li>The backend waits for the transaction and returns the `transactionHash`.</li>
            </ol>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (200 OK)</h4>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{updateResponse}</code>
              </pre>
            </details>
          </section>
           <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Missing required `metadataUri`.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code> (Token not found).</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Get Token On-Chain Status</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/token/status/{"{tokenId}"}</code>
            </span>
            <br />
            Retrieves conceptual blockchain status information for a token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h4 className="font-semibold mb-1">Path Parameters</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">tokenId</code> (string, required): The ID of the token to query.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Conceptual Backend Interaction</h4>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>The backend connects to the blockchain node.</li>
              <li>It instantiates the `DPPToken` contract.</li>
              <li>Calls <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dppToken.ownerOf(tokenId)</code> to get the current owner.</li>
              <li>Calls <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">dppToken.tokenURI(tokenId)</code> to get the metadata URI (which includes the hash).</li>
              <li>Optionally, it could query past `Transfer` events or other relevant custom events for the `tokenId` to determine a detailed on-chain status or history.</li>
              <li>The assembled information (owner, URI, conceptual status) is returned.</li>
              <li>The `MOCK_DPPS` data is checked to see if this `tokenId` is associated with any product.</li>
            </ol>
          </section>
          <section>
            <h4 className="font-semibold mb-1">Example Response (200 OK)</h4>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{statusResponse}</code>
              </pre>
            </details>
          </section>
           <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code> (Token not found).</li>
              <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}
