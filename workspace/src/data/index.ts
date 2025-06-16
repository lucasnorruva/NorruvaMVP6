
export * from './mockDpps';
export * from './simpleMockProducts';
export * from './mockSuppliers';
export * from './mockPublicPassports';
export * from './mockImportJobs';
export * from './mockTransitProducts';
export * from './mockCustomsAlerts'; // This is the problematic line according to the error
export * from './mockServiceJobs';
// Re-export specific types from @/types/dpp for easier access in components that use mock data
export type { TransitProduct, CustomsAlert, InspectionEvent } from '@/types/dpp';
```