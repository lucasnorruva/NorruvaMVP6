
import { config } from 'dotenv';
config();

import '@/ai/flows/extract-product-data.ts';
import '@/ai/flows/generate-product-summary.ts';
import '@/ai/flows/compliance-copilot-flow.ts';
import '@/ai/flows/check-product-compliance-flow.ts'; // Added new flow
