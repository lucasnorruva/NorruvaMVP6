
import { config } from 'dotenv';
config();

import '@/ai/flows/extract-product-data.ts';
import '@/ai/flows/generate-product-summary.ts';
import '@/ai/flows/compliance-copilot-flow.ts';
import '@/ai/flows/check-product-compliance-flow.ts';
import '@/ai/flows/suggest-sustainability-claims-flow.ts';
import '@/ai/flows/generate-product-image-flow.ts';
import '@/ai/flows/sync-eprel-data-flow.ts';
import '@/ai/flows/generate-csrd-summary-flow.ts'; 
import '@/ai/flows/generate-product-name-flow.ts'; 
import '@/ai/flows/generate-product-description-flow.ts';
import '@/ai/flows/generate-product-specifications-flow.ts';
import '@/ai/flows/generate-custom-attributes-flow.ts';
import '@/ai/flows/suggest-battery-details-flow.ts';
import '@/ai/flows/suggest-maintenance-schedule.ts'; // Added import for the new flow


    