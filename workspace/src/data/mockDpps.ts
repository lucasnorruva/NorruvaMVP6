import type { Product, ProductStatus, ComplianceStatus, LifecycleStage, DataOrigin } from '@/types/products';

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();

export const MOCK_DPPS: Product[] = [
  {
    id: "DPP001",
    gtin: "01234567890123",
    modelNumber: "X500-ECO",
    productName: { value: "EcoSmart Refrigerator X500", origin: DataOrigin.MANUAL, lastModified: now },
    manufacturer: { value: "GreenTech Appliances", origin: DataOrigin.MANUAL, lastModified: now },
    category: { value: "Appliances", origin: DataOrigin.MANUAL, lastModified: now },
    status: ProductStatus.ACTIVE,
    complianceStatus: ComplianceStatus.COMPLIANT,
    lifecycleStage: LifecycleStage.IN_USE,
    createdAt: yesterday,
    updatedAt: now,
    version: 3,
    tags: ["energy-efficient", "smart-home"],
    metadata: { eori: "DE123456789", onChainTokenId: "1" },
    details: {
      description: { value: "State-of-the-art energy efficient refrigerator, built with sustainable materials.", origin: DataOrigin.MANUAL, lastModified: now },
      materials: {
        value: [{ name: "Recycled Steel", percentage: 70, isRecycled: true }, { name: "Bio-based Polymers", percentage: 15 }],
        origin: DataOrigin.MANUAL,
        lastModified: now
      },
      sustainabilityClaims: { value: ["Energy Star Certified", "Made with 70% recycled steel"], origin: DataOrigin.MANUAL, lastModified: now },
      keyCompliancePoints: { value: ["EU Ecodesign Compliant", "RoHS Compliant"], origin: DataOrigin.MANUAL, lastModified: now },
      specifications: { value: { "Capacity (Liters)": 400, "Annual Energy (kWh)": 150 }, origin: DataOrigin.MANUAL, lastModified: now },
      energyLabel: { value: "A+++", origin: DataOrigin.MANUAL, lastModified: now },
      imageUrl: { value: "https://placehold.co/600x400.png", origin: DataOrigin.MANUAL, lastModified: now },
      imageHint: { value: "refrigerator kitchen", origin: DataOrigin.MANUAL, lastModified: now },
      customAttributes: { value: [{ key: "Warranty", value: "5 Years" }], origin: DataOrigin.MANUAL, lastModified: now },
      carbonFootprint: { value: 350, unit: "kg CO2e/unit", calculationMethod: "ISO 14067" },
      digitalTwin: { uri: "https://example.com/twin/dpp001", realTimeStatus: "Operational - Optimal" },
      ethicalSourcing: { supplierCodeOfConductUrl: "https://example.com/coc" },
      esprSpecifics: { durabilityInformation: "Expected lifespan of 15+ years.", repairabilityInformation: "Modular design for easy repair." },
    }
  },
  {
    id: "DPP002",
    gtin: "09876543210987",
    modelNumber: "ET-TS-ORG-M",
    productName: { value: "Sustainable Cotton T-Shirt", origin: DataOrigin.MANUAL, lastModified: now },
    manufacturer: { value: "EcoThreads", origin: DataOrigin.MANUAL, lastModified: now },
    category: { value: "Apparel", origin: DataOrigin.MANUAL, lastModified: now },
    status: ProductStatus.DRAFT,
    complianceStatus: ComplianceStatus.PENDING,
    lifecycleStage: LifecycleStage.MANUFACTURING,
    createdAt: yesterday,
    updatedAt: now,
    version: 1,
    tags: ["organic", "gots"],
    metadata: { eori: "FR987654321" },
    details: {
      description: { value: "A sustainable t-shirt made from organic cotton.", origin: DataOrigin.MANUAL, lastModified: now },
      materials: { value: [{ name: "Organic Cotton", percentage: 100 }], origin: DataOrigin.MANUAL, lastModified: now },
      sustainabilityClaims: { value: ["GOTS Certified", "Fair Trade Production"], origin: DataOrigin.MANUAL, lastModified: now },
      keyCompliancePoints: { value: ["Textile Labelling Compliant"], origin: DataOrigin.MANUAL, lastModified: now },
      specifications: { value: { "Fit": "Regular", "GSM": 180 }, origin: DataOrigin.MANUAL, lastModified: now },
      energyLabel: { value: "N/A", origin: DataOrigin.SYSTEM_GENERATED, lastModified: now },
      imageUrl: { value: "https://placehold.co/600x400.png", origin: DataOrigin.MANUAL, lastModified: now },
      customAttributes: { value: [], origin: DataOrigin.MANUAL, lastModified: now },
    }
  }
];
