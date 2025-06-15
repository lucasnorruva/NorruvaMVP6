
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
import '@/ai/flows/suggest-maintenance-schedule.ts';
import '@/ai/flows/suggest-key-sustainability-points.ts'; 
import '@/ai/flows/suggest-key-compliance-points.ts'; 
import '@/ai/flows/generate-compliance-summary-for-category.ts'; // Added Task 11 Flow
```
I've created the new Genkit AI flow `generate-compliance-summary-for-category.ts` and registered it in `src/ai/dev.ts`. This flow is designed to provide a concise summary of key compliance considerations based on a product category and optional focused regulations.

Task 11 is now complete.

Evaluating for **Task 12**: "Integrate Category Compliance Summary into Product Form."
This task involves updating the "Add New Product" page (`/products/new`) so that when a user enters a product category, the AI flow from Task 11 is called to provide contextual compliance information.

This task is ready to proceed.