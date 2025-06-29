import type {
  SimpleProductDetail,
  EsprSpecifics,
  CarbonFootprintData,
} from "@/types/dpp";

export const SIMPLE_MOCK_PRODUCTS: SimpleProductDetail[] = [
  {
    id: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    category: "Appliances",
    status: "Active",
    manufacturer: "GreenTech Appliances",
    gtin: "01234567890123",
    modelNumber: "X2000-ECO",
    sku: "SKU-X2000",
    nfcTagId: "NFC2000",
    rfidTagId: "RFID2000",
    description:
      "State-of-the-art energy efficient refrigerator, built with sustainable materials and smart energy management. Features advanced frost-free systems and optimized airflow for even temperature distribution.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "modern refrigerator kitchen",
    keySustainabilityPoints: [
      "Energy Star Certified",
      "Made with 70% recycled steel",
      "95% recyclable at end-of-life",
      "Low Global Warming Potential (GWP) refrigerant",
    ],
    keyCompliancePoints:
      "EU Ecodesign Compliant\nEU Energy Labelling Compliant\nEPREL Registered\nRoHS Compliant",
    specifications: JSON.stringify(
      {
        "Capacity (Liters)": "400",
        "Annual Energy Consumption (kWh)": "150",
        "Noise Level (dB)": "38",
        "Dimensions (HxWxD cm)": "180x70x65",
        Color: "Stainless Steel",
      },
      null,
      2,
    ),
    customAttributes: [
      { key: "Eco Rating", value: "Gold Star (Self-Assessed)" },
      { key: "Special Feature", value: "AI Defrost Technology" },
      { key: "Warranty Period", value: "5 Years" },
      { key: "Country of Origin", value: "Germany" },
    ],
    materialsUsed: [
      {
        name: "Recycled Steel",
        percentage: 70,
        source: "Certified Recycler A",
        isRecycled: true,
      },
      {
        name: "Bio-based Polymers (Insulation)",
        percentage: 15,
        source: "EcoPoly Corp",
      },
      {
        name: "Tempered Glass (Shelves)",
        percentage: 10,
        source: "GlassWorld Inc.",
      },
    ],
    energyLabelRating: "A+++",
    repairability: {
      score: 8.5,
      scale: 10,
      detailsUrl: "#repair-details-PROD001",
    },
    recyclabilityInfo: {
      percentage: 95,
      instructionsUrl: "#recycling-PROD001",
    },
    supplyChainLinks: [
      {
        supplierId: "SUP001",
        suppliedItem: "Compressor Unit XJ-500",
        notes: "Primary compressor supplier. Audited for fair labor practices.",
      },
      {
        supplierId: "SUP002",
        suppliedItem: "Recycled Steel Panels (70%)",
        notes: "Certified post-consumer recycled content.",
      },
    ],
    complianceSummary: {
      overallStatus: "Compliant",
      eprel: {
        id: "EPREL12345",
        status: "Registered",
        url: "#eprel-link",
        lastChecked: "2024-07-01T00:00:00Z",
      },
      ebsi: {
        status: "Verified",
        verificationId: "EBSI-VC-XYZ-00123",
        transactionUrl: "#ebsi-tx-001",
        lastChecked: "2024-07-05T00:00:00Z",
      },
      specificRegulations: [
        {
          regulationName: "EU Ecodesign 2019/2019",
          status: "Compliant",
          verificationId: "ECOD001",
          lastChecked: "2024-06-15T00:00:00Z",
          detailsUrl: "#ecodesign-report",
        },
        {
          regulationName: "RoHS Directive 2011/65/EU",
          status: "Compliant",
          lastChecked: "2024-06-10T00:00:00Z",
        },
        {
          regulationName: "WEEE Directive 2012/19/EU",
          status: "Compliant",
          lastChecked: "2024-06-10T00:00:00Z",
        },
      ],
      euCustomsData: { cbamGoodsIdentifier: "CBAM_REF_FRIDGE_STEEL_ALUM_001" },
    },
    lifecycleEvents: [
      {
        id: "lc001",
        eventName: "Manufacturing Complete",
        date: "2024-01-15T00:00:00Z",
        location: "EcoFactory, Germany",
        status: "Completed",
        iconName: "Factory",
      },
      {
        id: "lc002",
        eventName: "Quality Assurance Passed",
        date: "2024-01-16T00:00:00Z",
        location: "EcoFactory, Germany",
        status: "Completed",
        iconName: "ShieldCheck",
        keyDocuments: [
          {
            name: "QA Report Q1-2024",
            type: "PDF",
            url: "#qa-report-q1-2024.pdf",
          },
          {
            name: "Compliance Checklist (Internal)",
            type: "Link",
            url: "#compliance-checklist-internal",
          },
        ],
      },
      {
        id: "lc003",
        eventName: "Shipped to Distributor",
        date: "2024-01-20T00:00:00Z",
        location: "Logistics Hub, Hamburg",
        status: "Completed",
        iconName: "Truck",
      },
      {
        id: "lc004",
        eventName: "First Retail Sale",
        date: "2024-02-10T00:00:00Z",
        location: "Paris, France",
        status: "Completed",
        iconName: "ShoppingCart",
      },
      {
        id: "lc005",
        eventName: "Scheduled Maintenance",
        date: "2025-02-15T00:00:00Z",
        notes: "Filter replacement due.",
        status: "Upcoming",
        iconName: "Wrench",
      },
    ],
    certifications: [
      {
        id: "cert1",
        name: "Energy Star",
        authority: "EPA",
        issueDate: "2024-01-01",
        documentUrl: "#",
        isVerified: true,
        standard: "Energy Star Program Requirements for Refrigerators v6.0",
        transactionHash: "0xcertAnchor1",
      },
      {
        id: "cert2",
        name: "ISO 14001",
        authority: "TUV Rheinland",
        issueDate: "2023-11-15",
        expiryDate: "2026-11-14",
        documentUrl: "#iso14001",
        isVerified: true,
        vcId: "vc:iso:14001:greentech:dpp001",
        standard: "ISO 14001:2015",
      },
    ],
    documents: [
      {
        name: "User Manual v1.2",
        url: "#manual_v1.2.pdf",
        type: "User Manual",
        addedTimestamp: "2024-01-15T00:00:00Z",
      },
      {
        name: "Warranty Card",
        url: "#warranty.pdf",
        type: "Warranty",
        addedTimestamp: "2024-01-15T00:00:00Z",
      },
    ],
    authenticationVcId: "vc_auth_DPP001_mock123",
    ownershipNftLink: {
      registryUrl:
        "https://mock-nft-market.example/token/0xNFTContractForDPP001/1",
      contractAddress: "0xNFTContractForDPP001",
      tokenId: "1",
      chainName: "MockEthereum",
    },
    ethicalSourcingPolicyUrl:
      "https://greentech.com/ethics/sourcing-policy.pdf",
    productDetails: {
      esprSpecifics: {
        durabilityInformation: "Expected lifespan of 15+ years.",
        repairabilityInformation:
          "Modular design, spare parts available for 10 years.",
        recycledContentSummary: "Over 70% recycled steel used.",
        energyEfficiencySummary:
          "A+++ EU Energy Label. Smart defrost technology.",
        substanceOfConcernSummary:
          "RoHS compliant. No SVHCs above 0.1% w/w in main unit.",
      },
      carbonFootprint: {
        value: 350,
        unit: "kg CO2e/unit",
        calculationMethod: "ISO 14067",
        scope1Emissions: 50,
        scope2Emissions: 100,
        scope3Emissions: 200,
        dataSource: "Product LCA Study 2024",
        vcId: "vc:cf:dpp001:total:2024",
      },
    },
  },
];
