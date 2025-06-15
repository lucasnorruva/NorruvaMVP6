
// --- File: src/utils/apiPlaygroundUtils.ts ---
// Description: Utility functions for the API Playground in the Developer Portal.


interface ApiPlaygroundParams {
  productId?: string;
  productIdPath?: string; // For endpoints where productId is a path param but named differently in the UI state
  dppId?: string; // For ZKP endpoints where dppId is the path param
  supplierId?: string; // For private layer attestations
  claimType?: string; // For ZKP verify claim
  status?: string;
  category?: string;
  searchQuery?: string;
  blockchainAnchored?: string;
  fileType?: string;
  sourceDescription?: string;
  tokenId?: string; // For token operations
}

export const generateMockCodeSnippet = (
  endpointKey: string,
  method: string,
  language: string,
  params: ApiPlaygroundParams,
  body: string | null,
  currentEnv: string
): string => {
  const apiKeyPlaceholder = `YOUR_${currentEnv.toUpperCase()}_API_KEY`;
  const baseUrl = '/api/v1'; 

  let urlPath = "";
  switch (endpointKey) {
    case "getProduct": urlPath = `/dpp/${params.productId || '{productId}'}`; break;
    case "listDpps":
        const queryParams = new URLSearchParams();
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
        if (params.blockchainAnchored && params.blockchainAnchored !== 'all') queryParams.append('blockchainAnchored', params.blockchainAnchored);
        urlPath = `/dpp${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        break;
    case "createDpp": urlPath = "/dpp"; break;
    case "updateDpp": urlPath = `/dpp/${params.productId || '{productId}'}`; break;
    case "patchDppExtend": urlPath = `/dpp/extend/${params.productId || '{productId}'}`; break;
    case "deleteDpp": urlPath = `/dpp/${params.productId || '{productId}'}`; break;
    case "qrValidate": urlPath = "/qr/validate"; break;
    case "addLifecycleEvent": urlPath = `/dpp/${params.productId || '{productId}'}/lifecycle-events`; break;
    case "getComplianceSummary": urlPath = `/dpp/${params.productId || '{productId}'}/compliance-summary`; break;
    case "verifyDpp": urlPath = `/dpp/verify/${params.productIdPath || '{productId}'}`; break;
    case "getDppHistory": urlPath = `/dpp/history/${params.productId || '{productId}'}`; break;
    case "importDpps": urlPath = "/dpp/import"; break;
    case "getDppGraph": urlPath = `/dpp/graph/${params.productId || '{productId}'}`; break;
    case "getDppStatus": urlPath = `/dpp/status/${params.productId || '{productId}'}`; break;
    case "onchainStatus": urlPath = `/dpp/${params.productId || '{productId}'}/onchain-status`; break;
    case "onchainLifecycleStage": urlPath = `/dpp/${params.productId || '{productId}'}/onchain-lifecycle-stage`; break;
    case "logCriticalEvent": urlPath = `/dpp/${params.productId || '{productId}'}/log-critical-event`; break;
    case "registerVcHash": urlPath = `/dpp/${params.productId || '{productId}'}/register-vc-hash`; break;
    case "mintToken": urlPath = `/token/mint/${params.productId || '{productId}'}`; break;
    case "updateTokenMetadata": urlPath = `/token/metadata/${params.tokenId || '{tokenId}'}`; break;
    case "getTokenStatus": urlPath = `/token/status/${params.tokenId || '{tokenId}'}`; break;
    // Private Layer Endpoints
    case "getSupplierAttestations": urlPath = `/private/dpp/${params.productId || '{productId}'}/supplier/${params.supplierId || '{supplierId}'}/attestations`; break;
    case "postComponentTransfer": urlPath = `/private/dpp/${params.productId || '{productId}'}/component-transfer`; break;
    // ZKP Layer Endpoints
    case "zkpSubmitProof": urlPath = `/zkp/submit-proof/${params.dppId || '{dppId}'}`; break;
    case "zkpVerifyClaim": urlPath = `/zkp/verify-claim/${params.dppId || '{dppId}'}?claimType=${encodeURIComponent(params.claimType || '{claimType}')}`; break;
    default: urlPath = "/unknown-endpoint";
  }

  const fullUrl = `${baseUrl}${urlPath}`;
  const safeBody = body || '{}';

  if (language === "cURL") {
    let curlCmd = `curl -X ${method} \\\n  '${fullUrl}' \\\n  -H 'Authorization: Bearer ${apiKeyPlaceholder}'`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      curlCmd += ` \\\n  -H 'Content-Type: application/json' \\\n  -d '${safeBody.replace(/'/g, "'\\''")}'`;
    }
    return curlCmd;
  } else if (language === "JavaScript") {
    let jsFetch = `fetch('${fullUrl}', {\n  method: '${method}',\n  headers: {\n    'Authorization': 'Bearer ${apiKeyPlaceholder}'`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      jsFetch += `,\n    'Content-Type': 'application/json'`;
    }
    jsFetch += `\n  }`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      jsFetch += `,\n  body: JSON.stringify(${safeBody})`;
    }
    jsFetch += `\n})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;
    return jsFetch;
  } else if (language === "Python") {
    let pyRequests = `import requests\nimport json\n\nurl = "${fullUrl}"\nheaders = {\n  "Authorization": "Bearer ${apiKeyPlaceholder}"`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      pyRequests += `,\n  "Content-Type": "application/json"`;
    }
    pyRequests += `\n}`;
    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      pyRequests += `\npayload = json.loads("""${safeBody}""")`; 
      pyRequests += `\nresponse = requests.request("${method}", url, headers=headers, json=payload)`; 
    } else {
      pyRequests += `\nresponse = requests.request("${method}", url, headers=headers)`;
    }
    pyRequests += `\n\nprint(response.json())`;
    return pyRequests;
  }
  return "Code snippet not available for this language.";
};
