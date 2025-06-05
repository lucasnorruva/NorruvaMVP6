
export interface DigitalProductPassport {
  id: string;
  productName: string;
  category: string;
  metadata: {
    last_updated: string; // ISO date string
    status: 'draft' | 'published' | 'archived' | 'pending_review'; // Added pending_review for more states
  };
  compliance: {
    eu_espr?: { status: 'compliant' | 'non_compliant' | 'pending' };
    us_scope3?: { status: 'compliant' | 'non_compliant' | 'pending' };
    battery_regulation?: { status: 'compliant' | 'non_compliant' | 'pending' };
    // Add more regulations as needed
  };
  consumerScans?: number; // Mock field
  // Add other relevant DPP fields as needed
}

export interface DashboardFiltersState {
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review';
  regulation: 'all' | 'eu_espr' | 'us_scope3' | 'battery_regulation';
  // timeRange: '7d' | '30d' | '90d' | 'all'; // Time range filtering can be added later
}

export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    metadata: { last_updated: "2024-07-28T10:00:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "non_compliant" },
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
    compliance: {
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
    compliance: {
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
      us_scope3: { status: "non_compliant" },
    },
    consumerScans: 1520,
  },
  {
    id: "DPP007",
    productName: "Smart Home Thermostat G2",
    category: "Electronics",
    metadata: { last_updated: "2024-07-10T12:45:00Z", status: "published" },
    compliance: {
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "compliant" }, // Assuming it has a small battery
    },
    consumerScans: 980,
  },
];
