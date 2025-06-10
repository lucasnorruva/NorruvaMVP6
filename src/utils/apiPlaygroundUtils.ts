
// --- File: src/utils/apiPlaygroundUtils.ts ---
// Description: Utility functions for the API Playground in the Developer Portal.


export const generateMockCodeSnippet = (
  endpointKey: string,
  method: string,
  language: string,
  params: any,
  body: string | null,
  currentEnv: string
): string => {
  const apiKeyPlaceholder = `YOUR_${currentEnv.toUpperCase()}_API_KEY`;
  // In a real app, baseUrl would come from an environment variable or configuration.
  // For the mock setup, we assume the API routes are served from the same origin.
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
      pyRequests += `\npayload = json.loads("""${safeBody}""")`; // Use json.loads for robust JSON parsing
      pyRequests += `\nresponse = requests.request("${method}", url, headers=headers, json=payload)`; // Use json=payload for requests library
    } else {
      pyRequests += `\nresponse = requests.request("${method}", url, headers=headers)`;
    }
    pyRequests += `\n\nprint(response.json())`;
    return pyRequests;
  }
  return "Code snippet not available for this language.";
};
