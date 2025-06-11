
// --- File: src/data/mockCustomsAlerts.ts ---

export interface CustomsAlert {
  id: string;
  productId: string;
  message: string;
  severity: "High" | "Medium" | "Low";
  timestamp: string; // Human-readable time ago or ISO string
  regulation?: string;
}

export const MOCK_CUSTOMS_ALERTS: CustomsAlert[] = [
  { id: "ALERT001", productId: "PROD101", message: "Flagged at CDG Airport - Potential counterfeit. Physical inspection scheduled.", severity: "High", timestamp: "2 hours ago", regulation: "Anti-Counterfeiting" },
  { id: "ALERT002", productId: "PROD002", message: "Awaiting CBAM declaration for steel components. Shipment delayed at Rotterdam.", severity: "Medium", timestamp: "1 day ago", regulation: "CBAM" }, // Changed to PROD002 for testing
  { id: "ALERT003", productId: "PROD999", message: "Random spot check selected for agricultural products (Batch AGR088). Expected delay: 48h.", severity: "Low", timestamp: "3 days ago", regulation: "SPS Measures" },
  { id: "ALERT004", productId: "PROD333", message: "Incomplete safety certification for machinery parts. Documentation required.", severity: "Medium", timestamp: "5 hours ago", regulation: "Machinery Directive"},
  { id: "ALERT005", productId: "PROD001", message: "Documentation for origin confirmed. Cleared for inland transit.", severity: "Low", timestamp: "6 hours ago", regulation: "Customs Union Tariff" },
];
