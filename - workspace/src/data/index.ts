export * from "./mockDpps";
export * from "./simpleMockProducts";
export * from "./mockSuppliers";
export * from "./mockPublicPassports";
export * from "./mockImportJobs";
export * from "./mockTransitProducts";
export * from "./mockCustomsAlerts";
export * from "./mockServiceJobs";
export type {
  TransitProduct,
  CustomsAlert,
  InspectionEvent,
} from "@/types/dpp"; // Re-export types if used by components importing from @/data
