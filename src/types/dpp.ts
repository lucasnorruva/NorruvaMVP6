
export interface DigitalProductPassport {
  id: string;
  productName: string;
  category: string;
  metadata: {
    last_updated: string; // ISO date string
    status: 'draft' | 'published' | 'archived' | 'pending_review';
  };
  compliance: {
    eu_espr?: { status: 'compliant' | 'non_compliant' | 'pending' };
    us_scope3?: { status: 'compliant' | 'non_compliant' | 'pending' };
    battery_regulation?: { status: 'compliant' | 'non_compliant' | 'pending' };
    // Add more regulations as needed
  };
  consumerScans?: number;
}

export interface DashboardFiltersState {
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review';
  regulation: 'all' | 'eu_espr' | 'us_scope3' | 'battery_regulation';
  category: 'all' | string; // Added category filter
  // timeRange: '7d' | '30d' | '90d' | 'all';
}

export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    metadata: { last_updated: "2024-07-28T10:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "non_compliant" }, // Not fully compliant
    },
    consumerScans: 1250,
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    metadata: { last_updated: "2024-07-25T14:30:00Z", status: "draft" },
    compliance: {
      eu_espr: { status: "pending" },
    },
    consumerScans: 300,
  },
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    metadata: { last_updated: "2024-07-22T09:15:00Z", status: "published" },
    compliance: { // Fully compliant
      eu_espr: { status: "compliant" },
      us_scope3: { status: "compliant" },
    },
    consumerScans: 2100,
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    metadata: { last_updated: "2024-07-20T11:00:00Z", status: "archived" },
    compliance: { // Fully compliant
      eu_espr: { status: "compliant" },
    },
    consumerScans: 850,
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    metadata: { last_updated: "2024-07-29T08:00:00Z", status: "pending_review" },
    compliance: {
      battery_regulation: { status: "pending" },
      eu_espr: { status: "pending" },
    },
    consumerScans: 50,
  },
   {
    id: "DPP006",
    productName: "Organic FairTrade Coffee Beans",
    category: "Groceries",
    metadata: { last_updated: "2024-06-15T18:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" },
      us_scope3: { status: "non_compliant" }, // Not fully compliant
    },
    consumerScans: 1520,
  },
  {
    id: "DPP007",
    productName: "Smart Home Thermostat G2",
    category: "Electronics",
    metadata: { last_updated: "2024-07-10T12:45:00Z", status: "published" },
    compliance: { // Fully compliant
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "compliant" },
    },
    consumerScans: 980,
  },
  {
    id: "DPP008",
    productName: "Recycled Glass Water Bottle",
    category: "Homeware",
    metadata: { last_updated: "2024-08-01T10:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" },
    },
    consumerScans: 620,
  },
  {
    id: "DPP009",
    productName: "Bamboo Cutting Board Set",
    category: "Homeware",
    metadata: { last_updated: "2024-08-02T11:30:00Z", status: "pending_review" },
    compliance: {
      eu_espr: { status: "pending" },
    },
    consumerScans: 150,
  },
  {
    id: "DPP010",
    productName: "Wooden Toy Train",
    category: "Toys",
    metadata: { last_updated: "2024-08-03T10:00:00Z", status: "published" },
    compliance: {}, // No specific regulations tracked / N/A
    consumerScans: 75,
  },
  {
    id: "DPP011",
    productName: "Imported Textile Rug",
    category: "Textiles",
    metadata: { last_updated: "2024-08-03T11:00:00Z", status: "draft" },
    // @ts-ignore - Intentionally creating a case where a key might exist with undefined value
    compliance: { eu_espr: undefined, us_scope3: {status: "pending"} }, // "No Data" for eu_espr if not handled by filter(Boolean), "Pending" for us_scope3
    consumerScans: 20,
  }
];
