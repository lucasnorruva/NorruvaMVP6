import type { DigitalProductPassport } from '@/types/dpp';

export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    manufacturer: { name: "GreenTech Appliances"},
    modelNumber: "X500-ECO",
    sku: "SKU-X500",
    nfcTagId: "NFC123456",
    rfidTagId: "RFID654321",
    metadata: {
      created_at: "2024-01-01T10:00:00Z", 
      last_updated: "2024-07-30T10:00:00Z",
      status: "published", 
      dppStandardVersion: "CIRPASS v0.9 Draft" 
    },
    productDetails: {
      description: "An eco friendly fridge.",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator appliance",
      materials: [{name: "Recycled Steel", percentage: 70, isRecycled: true}],
      specifications: JSON.stringify({ "Capacity (Liters)": "400", "Annual Energy Consumption (kWh)": "150", "Noise Level (dB)": "38", "Dimensions (HxWxD cm)": "180x70x65", "Color": "Stainless Steel" }, null, 2),
      customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"}
      ],
    },
    compliance: {
      eprel: { id: "EPREL_REG_12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-01-18T00:00:00Z" }, 
      esprConformity: { status: "conformant", assessmentId: "ESPR_ASSESS_001", assessmentDate: "2024-01-01" },
      battery_regulation: { status: "not_applicable" },
    },
    ebsiVerification: { 
      status: "verified", 
      verificationId: "EBSI_TX_ABC123", 
      lastChecked: "2024-07-25T00:00:00Z"
    },
    blockchainIdentifiers: { platform: "MockChain", anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef"},
    consumerScans: 1250,
    lifecycleEvents: [
      {id: "evt1", type: "Manufactured", timestamp: "2024-01-15T00:00:00Z", transactionHash: "0xabc...def", responsibleParty: "GreenTech Appliances"}
    ],
    certifications: [
      {id: "cert1", name: "Energy Star", issuer: "EPA", issueDate: "2024-01-01T11:00:00Z", documentUrl: "#", transactionHash: "0xcertAnchor1", standard: "Energy Star Program Requirements for Refrigerators v6.0"},
      {id: "cert2", name: "ISO 14001", issuer: "TUV Rheinland", issueDate: "2024-01-20T00:00:00Z", expiryDate: "2026-11-14", documentUrl: "#iso14001", vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015"}
    ],
    documents: [
      { name: "User Manual v1.2", url: "#manual_v1.2.pdf", type: "User Manual", addedTimestamp: "2024-01-15T00:00:00Z" },
      { name: "Warranty Card", url: "#warranty.pdf", type: "Warranty", addedTimestamp: "2024-01-15T00:00:00Z" },
    ],
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier for EU market. Audited for ethical sourcing." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified post-consumer recycled content." }
    ]
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads"},
    modelNumber: "ET-TS-ORG-M",
    metadata: { last_updated: "2024-07-25T14:30:00Z", status: "draft", created_at: "2024-03-01T10:00:00Z" },
    productDetails: {
      description: "A sustainable t-shirt made from organic cotton.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "cotton t-shirt apparel",
      materials: [{name: "Organic Cotton", percentage: 100}],
      specifications: JSON.stringify({ "Fit": "Regular", "GSM": "180", "Origin": "India", "Care": "Machine wash cold" }, null, 2),
      customAttributes: [{key: "Certifications", value: "GOTS, Fair Trade"}, {key: "Care Instructions", value: "Machine wash cold, tumble dry low"}]
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-25T00:00:00Z" },
      eu_espr: { status: "pending" },
      battery_regulation: { status: "not_applicable" },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"},
    consumerScans: 300,
    blockchainIdentifiers: { platform: "MockChain" },
    certifications: [
      {id: "cert3", name: "GOTS", issuer: "Control Union", issueDate: "2024-02-20", expiryDate: "2025-02-19", documentUrl: "#gots", standard: "Global Organic Textile Standard 6.0"},
    ],
    documents: [],
    supplyChainLinks: [
       { supplierId: "SUP003", suppliedItem: "Organic Cotton Yarn", notes: "GOTS Certified Supplier for all global production." }
    ]
  },
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    manufacturer: { name: "ReCase It"},
    modelNumber: "RC-POLY-IP15",
    metadata: { last_updated: "2024-07-22T09:15:00Z", status: "flagged", created_at: "2024-04-10T10:00:00Z" },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-22T00:00:00Z" },
      eu_espr: { status: "compliant" },
      us_scope3: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
    },
    consumerScans: 2100,
     productDetails: { description: "A recycled phone case."},
     blockchainIdentifiers: { platform: "OtherChain", anchorTransactionHash: "0x789polymerAnchorHash000333"},
     documents: [],
     supplyChainLinks: [],
     ebsiVerification: { status: "not_verified", lastChecked: "2024-07-23T00:00:00Z"},
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    manufacturer: { name: "Comfy Living"},
    modelNumber: "CL-MODSOFA-01",
    metadata: { last_updated: "2024-07-20T11:00:00Z", status: "archived", created_at: "2023-12-01T10:00:00Z" },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-20T00:00:00Z" },
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
    },
    consumerScans: 850,
    productDetails: { description: "A modular sofa."},
    documents: [],
    supplyChainLinks: [],
    ebsiVerification: { status: "error", lastChecked: "2024-07-19T00:00:00Z", message: "Connection timeout to EBSI node."},
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    manufacturer: { name: "PowerVolt"},
    modelNumber: "PV-EVB-75KWH",
    metadata: { last_updated: "2024-07-29T08:00:00Z", status: "pending_review", created_at: "2024-05-01T10:00:00Z" },
    productDetails: {
      description: "A high-performance EV battery module.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ev battery module",
      specifications: JSON.stringify({ "Capacity (kWh)": "75", "Voltage (V)": "400", "Weight (kg)": "450", "Chemistry": "NMC 811" }, null, 2),
      customAttributes: [
        {key: "Cycle Life", value: "3000 cycles @ 80% DoD"},
        {key: "Charging Time (0-80%)", value: "45 minutes (DC Fast Charge)"}
      ]
    },
    compliance: {
      eprel: { status: "Data Mismatch", lastChecked: "2024-07-28T00:00:00Z", id: "EPREL_OLD_ID" },
      battery_regulation: {
        status: "pending",
        carbonFootprint: { value: 120, unit: "kg CO2e/kWh" },
        recycledContent: [{ material: "Cobalt", percentage: 15 }],
        stateOfHealth: {value: 98, unit: '%', measurementDate: "2024-07-15T00:00:00Z"},
      },
      eu_espr: { status: "pending" },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-29T00:00:00Z"},
    consumerScans: 50,
    certifications: [
      {id: "cert_bat_01", name: "UN 38.3 Transport Test", issuer: "TestCert Ltd.", issueDate: "2024-07-01", documentUrl: "#", transactionHash: "0xcertAnchorBat1", standard: "UN Manual of Tests and Criteria, Part III, subsection 38.3"}
    ],
    documents: [],
    blockchainIdentifiers: { platform: "BatteryChain", anchorTransactionHash: "0xevBatteryAnchorHash555AAA"},
    supplyChainLinks: []
  },
];
