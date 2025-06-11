import type { Supplier } from '@/types/dpp';

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "SUP001", name: "GreenCompress Ltd.", contactPerson: "Sarah Miller", email: "sarah.miller@greencompress.com", location: "Stuttgart, Germany", materialsSupplied: "Eco-friendly compressors, Cooling units", status: "Active", lastUpdated: "2024-07-15T10:00:00Z" },
  { id: "SUP002", name: "RecycleSteel Corp.", contactPerson: "John Davis", email: "jdavis@recyclesteel.com", location: "Rotterdam, Netherlands", materialsSupplied: "Recycled steel panels, Stainless steel components", status: "Active", lastUpdated: "2024-06-20T14:30:00Z" },
  { id: "SUP003", name: "Organic Textiles Co.", contactPerson: "Aisha Khan", email: "akhan@organictextiles.com", location: "Coimbatore, India", materialsSupplied: "GOTS certified organic cotton yarn, Natural dyes", status: "Active", lastUpdated: "2024-07-01T09:00:00Z" },
  { id: "SUP004", name: "PolySolutions Inc.", contactPerson: "Mike Chen", email: "chen.m@polysolutions.com", location: "Shanghai, China", materialsSupplied: "Recycled PET pellets, Bio-polymers, LED Chips & Drivers", status: "Pending Review", lastUpdated: "2024-05-10T11:00:00Z" },
];
