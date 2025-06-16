
export * from './mockDpps';
export * from './simpleMockProducts';
export * from './mockSuppliers';
export * from './mockPublicPassports';
export * from './mockImportJobs';
export * from './mockTransitProducts';
export * from './mockCustomsAlerts'; // Ensure this filename matches exactly: mockCustomsAlerts.ts
export * from './mockServiceJobs';

// Re-export specific types from @/types/dpp for easier access in components that use mock data
// This is also a good place to ensure types needed by the mock data files themselves are available if they were to be imported from here.
export type { TransitProduct, CustomsAlert, InspectionEvent, ServiceJob } from '@/types/dpp';
