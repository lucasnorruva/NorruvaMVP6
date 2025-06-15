
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server } from "lucide-react";

interface ApiReferenceDppEndpointsProps {
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
    exampleUpdateOnChainStatusRequestBody: string;
    exampleUpdateOnChainLifecycleStageRequestBody: string;
    exampleLogCriticalEventRequestBody: string;
    exampleRegisterVcHashRequestBody: string;
    exampleUpdatedDppResponse: string;
    error400_create_dpp: string;
    error400_update_dpp: string;
    error400_patch_dpp: string;
    error400_lifecycle_event: string;
    error400_general: string;
    error401: string;
    error404: string;
    error500: string;
}

export default function ApiReferenceDppEndpoints({
    exampleListDppsResponse,
    exampleDppResponse,
    conceptualCreateDppRequestBody,
    conceptualCreateDppResponseBody,
    conceptualUpdateDppRequestBody,
    conceptualUpdateDppResponseBody,
    conceptualDeleteDppResponseBody,
    conceptualPatchDppExtendRequestBody,
    conceptualPatchDppExtendResponseBody,
    addLifecycleEventRequestBodyExample,
    addLifecycleEventResponseExample,
    exampleUpdateOnChainStatusRequestBody,
    exampleUpdateOnChainLifecycleStageRequestBody,
    exampleLogCriticalEventRequestBody,
    exampleRegisterVcHashRequestBody,
    exampleUpdatedDppResponse,
    error400_create_dpp,
    error400_update_dpp,
    error400_patch_dpp,
    error400_lifecycle_event,
    error400_general,
    error401,
    error404,
    error500
}: ApiReferenceDppEndpointsProps) {

    return (
        <>
            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">List Digital Product Passports</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp</code>
                        </span>
                        <br />
                        Retrieves a list of DPPs, with optional filtering.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Query Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">status</code> (query, optional): Filter by DPP status (e.g., draft, published, archived).
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">category</code> (query, optional): Filter by product category.
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">searchQuery</code> (query, optional): Search term for product name, ID, GTIN, or manufacturer.
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">blockchainAnchored</code> (query, optional): Filter by blockchain anchoring status.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object containing a list of DPPs, filters applied, and the total count.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleListDppsResponse}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Retrieve Digital Product Passport</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Fetches the complete Digital Product Passport for a specific product.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object representing the Digital Product Passport.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleDppResponse}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Create Digital Product Passport</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp</code>
                        </span>
                        <br />
                        Creates a new Digital Product Passport with the provided initial data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the data for the new Digital Product Passport.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Conceptual Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{conceptualCreateDppRequestBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 201 Created)</h4>
                        <p className="text-sm mb-1">Returns a JSON object representing the newly created Digital Product Passport.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Conceptual Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{conceptualCreateDppResponseBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                           <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_create_dpp}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Update Digital Product Passport</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">PUT</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Updates an existing Digital Product Passport. You can send partial or full updates.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the DPP to update.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the fields to update in the Digital Product Passport.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Conceptual Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{conceptualUpdateDppRequestBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object representing the updated Digital Product Passport.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Conceptual Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{conceptualUpdateDppResponseBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                           <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_update_dpp}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Archive Digital Product Passport</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 mr-2 font-semibold">DELETE</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Archives an existing Digital Product Passport by setting its status to 'archived'.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the DPP to archive.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object confirming the product has been archived.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Conceptual Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{conceptualDeleteDppResponseBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Extend Digital Product Passport</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 mr-2 font-semibold">PATCH</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/extend/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Allows for extending a DPP by adding document references or other modular data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the DPP to extend.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the data to extend the Digital Product Passport.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Conceptual Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{conceptualPatchDppExtendRequestBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object representing the extended Digital Product Passport.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Conceptual Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{conceptualPatchDppExtendResponseBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_patch_dpp}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Add a Lifecycle Event to a DPP</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/&#123;productId&#125;/lifecycle-events</code>
                        </span>
                        <br />
                        Adds a new lifecycle event to the specified Digital Product Passport.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the details of the lifecycle event.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{addLifecycleEventRequestBodyExample}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 201 Created)</h4>
                        <p className="text-sm mb-1">Returns a JSON object representing the newly created lifecycle event.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{addLifecycleEventResponseExample}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_lifecycle_event}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Update DPP On-Chain Status (Conceptual)</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/onchain-status/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Conceptually updates the on-chain status of a Digital Product Passport.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the new on-chain status.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleUpdateOnChainStatusRequestBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object confirming the on-chain status has been updated.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleUpdatedDppResponse}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_general}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Update DPP On-Chain Lifecycle Stage (Conceptual)</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/onchain-lifecycle-stage/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Conceptually updates the on-chain lifecycle stage of a Digital Product Passport.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the new on-chain lifecycle stage.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleUpdateOnChainLifecycleStageRequestBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object confirming the on-chain lifecycle stage has been updated.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleUpdatedDppResponse}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_general}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Log Critical Event for a DPP (Conceptual)</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/log-critical-event/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Conceptually logs a critical event on-chain for a specified DPP.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the description of the critical event.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleLogCriticalEventRequestBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object confirming the critical event has been logged.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleUpdatedDppResponse}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_general}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>

            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Register Verifiable Credential Hash (Conceptual)</CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center font-mono text-sm">
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
                            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/register-vc-hash/&#123;productId&#125;</code>
                        </span>
                        <br />
                        Conceptually registers a Verifiable Credential's hash on-chain for a DPP.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <section>
                        <h4 className="font-semibold mb-1">Parameters</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">&#123;productId&#125;</code> (path, required): The unique identifier of the product.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
                        <p className="text-sm mb-1">A JSON object containing the VC ID and its hash.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request Body
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleRegisterVcHashRequestBody}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
                        <p className="text-sm mb-1">Returns a JSON object confirming the VC Hash has been registered.</p>
                        <details className="border rounded-md">
                            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
                            </summary>
                            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                                <code>{exampleUpdatedDppResponse}</code>
                            </pre>
                        </details>
                    </section>
                    <section>
                        <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid request body.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error400_general}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                                <details className="border rounded-md mt-1">
                                    <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.
                                <details className="border rounded-md mt-1">
                                    <summary  className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre>
                                </details>
                            </li>
                            <li>
                                <code  className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                                <details  className="border rounded-md mt-1">
                                    <summary  className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary>
                                    <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre>
                                </details>
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </>
    );
}

    