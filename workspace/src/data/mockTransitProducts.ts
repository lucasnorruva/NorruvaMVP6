
// --- File: src/data/mockTransitProducts.ts ---

export interface TransitProduct {
  id: string;
  name: string;
  stage: string;
  eta: string; // ISO Date string or human-readable like "2024-08-10"
  dppStatus: "Compliant" | "Pending Documentation" | "Issue - Discrepancy" | "Pending Review" | "Pending Inspection";
  transport: "Ship" | "Truck" | "Plane";
  origin: string;
  destination: string;
}

export const MOCK_TRANSIT_PRODUCTS: TransitProduct[] = [
  { id: "DPP001", name: "EcoSmart Refrigerator X500", stage: "Cleared - Inland Transit (DE)", eta: "2024-08-02", dppStatus: "Compliant", transport: "Truck", origin: "Gdansk, PL", destination: "Berlin, DE" },
  { id: "DPP002", name: "Sustainable Cotton T-Shirt", stage: "At Customs (Rotterdam, NL)", eta: "2024-08-05", dppStatus: "Pending Documentation", transport: "Ship", origin: "Mumbai, IN", destination: "Paris, FR" },
  { id: "DPP003", name: "Recycled Polymer Phone Case", stage: "Airborne - Approaching EU", eta: "2024-08-08", dppStatus: "Compliant", transport: "Plane", origin: "Shenzhen, CN", destination: "Frankfurt, DE" },
  { id: "DPP004", name: "Modular Sofa System", stage: "Awaiting Customs Clearance (Antwerp, BE)", eta: "2024-08-01", dppStatus: "Pending Review", transport: "Ship", origin: "Ho Chi Minh, VN", destination: "Lyon, FR" },
  { id: "DPP005", name: "High-Performance EV Battery", stage: "Pre-Arrival Notification Submitted (Bremerhaven, DE)", eta: "2024-08-15", dppStatus: "Pending Review", transport: "Ship", origin: "Newark, US", destination: "Stuttgart, DE" },
  { id: "PROD789", name: "Smart Thermostat G3", stage: "Approaching EU Border (Hamburg)", eta: "2024-08-10", dppStatus: "Compliant", transport: "Ship", origin: "Shanghai, CN", destination: "Munich, DE" },
  { id: "PROD101", name: "Luxury Handbags Batch B", stage: "Flagged for Inspection (CDG Airport)", eta: "2024-08-03", dppStatus: "Issue - Discrepancy", transport: "Plane", origin: "Milan, IT", destination: "New York, US (Transit EU)"},
  { id: "PROD222", name: "Pharmaceutical Batch Z", stage: "Awaiting Final Clearance (FRA Airport)", eta: "2024-08-06", dppStatus: "Compliant", transport: "Plane", origin: "Zurich, CH", destination: "London, UK"},
  { id: "PROD333", name: "Industrial Machinery Parts", stage: "Customs Declaration Submitted", eta: "2024-08-12", dppStatus: "Pending Review", transport: "Truck", origin: "Prague, CZ", destination: "Madrid, ES"},
  { id: "PROD800", name: "Vintage Electronics Lot", stage: "Delayed at Customs (Antwerp)", eta: "2024-07-25", dppStatus: "Issue - Discrepancy", transport: "Ship", origin: "Hong Kong, HK", destination: "Brussels, BE" },
  { id: "PROD801", name: "Fresh Flowers Batch", stage: "Arrived at Airport (AMS)", eta: new Date().toISOString().split('T')[0], dppStatus: "Pending Inspection", transport: "Plane", origin: "Nairobi, KE", destination: "Amsterdam, NL" },
];

