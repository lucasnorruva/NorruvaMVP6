import type {
  PublicProductInfo,
  CarbonFootprintData,
  DigitalTwinData,
} from "@/types/dpp"; // Added DigitalTwinData

export const MOCK_PUBLIC_PASSPORTS: Record<string, PublicProductInfo> = {
  PROD001: {
    passportId: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    tagline: "Cool, Efficient, Sustainable.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "refrigerator kitchen",
    productStory:
      "The EcoFriendly Refrigerator X2000 is designed for the modern, environmentally conscious household. It features our latest FrostFree technology, an A+++ energy rating, and is built with over 70% recycled materials. Its smart features help optimize cooling and reduce energy consumption, contributing to a greener planet one kitchen at a time. This DPP provides full transparency into its lifecycle and sustainability credentials.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "A+++ Energy Rating" },
      { iconName: "Recycle", text: "Made with 70% Recycled Steel" },
      { iconName: "Leaf", text: "Low GWP Refrigerant Used" },
      { iconName: "Award", text: "Certified for 15-year Durability" },
    ],
    manufacturerName: "GreenTech Appliances",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=GreenTech",
    learnMoreLink: "#",
    complianceSummary:
      "Fully compliant with EU Ecodesign and Energy Labelling directives. EPREL registered. EBSI verification completed for key claims.",
    category: "Appliances",
    modelNumber: "X500-ECO",
    sku: "SKU-X500",
    nfcTagId: "NFC123456",
    rfidTagId: "RFID654321",
    anchorTransactionHash:
      "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef",
    blockchainPlatform: "MockChain (Ethereum L1)",
    contractAddress: "0xMOCK_CONTRACT_FOR_DPP001",
    tokenId: "MOCK_TOKENID_FOR_DPP001_mock1",
    ebsiStatus: "verified",
    ebsiVerificationId: "EBSI-VC-XYZ-00123",
    onChainStatus: "Active",
    onChainLifecycleStage: "InUse",
    status: "published",
    lastUpdated: "2024-07-30T10:00:00Z",
    lifecycleHighlights: [
      {
        stage: "Manufacturing",
        date: "Jan 2024",
        details: "Produced in our green-certified facility in Germany.",
        isEbsiVerified: true,
        iconName: "Factory",
      },
      {
        stage: "Shipped",
        date: "Feb 2024",
        details:
          "Transported via low-emission logistics partners to EU distribution centers.",
        isEbsiVerified: false,
        iconName: "Truck",
      },
      {
        stage: "Sold",
        date: "Mar 2024",
        details: "First retail sale recorded in Paris, France.",
        isEbsiVerified: false,
        iconName: "ShoppingCart",
      },
      {
        stage: "End-of-Life Path",
        date: "Est. 2039",
        details:
          "Designed for 95% recyclability. Refer to local WEEE collection.",
        isEbsiVerified: false,
        iconName: "Recycle",
      },
    ],
    certifications: [
      {
        name: "Energy Star",
        authority: "EPA",
        isVerified: true,
        standard: "Energy Star Program Requirements for Refrigerators v6.0",
        transactionHash: "0xcertAnchor1",
      },
      {
        name: "ISO 14001",
        authority: "TUV Rheinland",
        expiryDate: "2026-11-14",
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
    customAttributes: [
      { key: "Eco Rating", value: "Gold Star (Self-Assessed)" },
      { key: "Special Feature", value: "AI Defrost Technology" },
      { key: "Warranty Period", value: "5 Years" },
      { key: "Country of Origin", value: "Germany" },
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
        durabilityInformation:
          "Expected lifespan of 15+ years with proper maintenance. Key components tested for 20,000+ hours of operation.",
        repairabilityInformation:
          "Modular design. Spare parts (compressor, shelves, door seals) available for 10 years. Repair manual accessible via QR code.",
        recycledContentSummary:
          "Over 70% of steel used is certified post-consumer recycled content. Internal plastic components incorporate 25% recycled polymers.",
        energyEfficiencySummary:
          "A+++ EU Energy Label. Smart defrost and adaptive cooling technology minimize energy use. Annual consumption approx. 150 kWh.",
        substanceOfConcernSummary:
          "Fully RoHS compliant. All components screened for SVHCs above 0.1% w/w as per REACH, none present requiring SCIP notification for the main unit. Control panel assembly details in SCIP.",
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
      digitalTwin: {
        // Added Digital Twin data
        uri: "https://twins.greentech.com/refrigerator/X500-ECO/SN12345",
        sensorDataEndpoint:
          "https://api.greentech.com/iot/X500-ECO/SN12345/data",
        realTimeStatus:
          "Operational - Optimal Performance. Current Temp: 3°C. Energy Use: Low.",
        predictiveMaintenanceAlerts:
          "- Compressor efficiency slightly reduced (5%), monitor.\n- Door seal integrity check recommended at next service.",
      },
    },
    compliance: {
      // Added for Task 21
      euCustomsData: { cbamGoodsIdentifier: "CBAM_REF_FRIDGE_STEEL_ALUM_001" },
    },
  },
  PROD002: {
    passportId: "PROD002",
    productName: "Sustainable Cotton T-Shirt",
    tagline: "Comfortable, Ethical, Eco-Friendly.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "cotton t-shirt apparel",
    productStory:
      "Our Sustainable Cotton T-Shirt is crafted from 100% GOTS certified organic cotton, ensuring a soft feel and minimal environmental impact. Produced in Fair Trade certified facilities, it represents our commitment to ethical fashion. Perfect for everyday wear, combining style with sustainability.",
    sustainabilityHighlights: [
      { iconName: "Leaf", text: "100% GOTS Certified Organic Cotton" },
      { iconName: "Users", text: "Fair Trade Certified Production" },
      { iconName: "Droplet", text: "Reduced Water Usage in Dyeing" },
    ],
    manufacturerName: "EcoThreads",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=EcoThreads",
    learnMoreLink: "#",
    complianceSummary:
      "Complies with EU textile labelling regulations. GOTS certified. EBSI verification pending.",
    category: "Apparel",
    modelNumber: "ET-TS-ORG-M",
    blockchainPlatform: "MockChain (Polygon Layer 2)",
    contractAddress: "0xSomeOtherContract",
    tokenId: "TOKEN_TSHIRT_002",
    ebsiStatus: "pending",
    onChainStatus: "Pending Activation",
    onChainLifecycleStage: "Manufacturing",
    status: "draft",
    lastUpdated: "2024-07-25T14:30:00Z",
    productDetails: {
      carbonFootprint: {
        value: 2.5,
        unit: "kg CO2e/item",
        calculationMethod: "Higg MSI",
        dataSource: "Internal Assessment 2024",
        vcId: "vc:cf:dpp002:total:2024",
      },
    },
    lifecycleHighlights: [
      {
        stage: "Manufacturing",
        date: "2024-03-01",
        details: "Produced in India, Fair Trade facility.",
        isEbsiVerified: true,
        iconName: "Factory",
      },
      {
        stage: "Imported to EU",
        date: "2024-03-15",
        details: "Cleared customs at Rotterdam Port, Netherlands.",
        isEbsiVerified: false,
        iconName: "Anchor",
      },
    ],
    certifications: [
      {
        name: "GOTS",
        authority: "Control Union",
        expiryDate: "2025-02-19",
        isVerified: true,
        standard: "Global Organic Textile Standard 6.0",
      },
      {
        name: "Fair Trade Certified",
        authority: "Fair Trade International",
        isVerified: true,
        standard: "Fair Trade Textile Standard",
      },
    ],
    documents: [],
    customAttributes: [
      { key: "Fit Type", value: "Regular Fit" },
      { key: "GSM (Fabric Weight)", value: "180" },
    ],
    textileInformation: {
      fiberComposition: [
        { fiberName: "Organic Cotton", percentage: 95 },
        { fiberName: "Elastane", percentage: 5 },
      ],
      countryOfOriginLabeling:
        "India (Spinning, Weaving), Portugal (Making-up)",
      careInstructionsUrl: "https://ecothreads.com/care/ET-TS-ORG-M",
      isSecondHand: false,
    },
    authenticationVcId: "vc_auth_DPP002_mock456",
    conflictMineralsReportUrl:
      "https://ecothreads.com/reports/conflict-minerals-na.pdf",
    fairTradeCertificationId: "FLOID12345 (Fair Trade International)",
    ethicalSourcingPolicyUrl:
      "https://ecothreads.com/ethics/sourcing-policy.pdf",
    compliance: {
      // Added for Task 21
      euCustomsData: { cbamGoodsIdentifier: "CBAM_TEXTILE_COTTON_002" },
    },
  },
  PROD006: {
    passportId: "PROD006",
    productName: "EcoSmart Insulation Panel R50",
    tagline: "Superior Insulation, Sustainably Made.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "insulation panel construction",
    productStory:
      "The EcoSmart Insulation Panel R50 offers exceptional thermal resistance for residential and commercial buildings. Made primarily from recycled cellulose fibers and a bio-based binder, it contributes to energy efficiency and a lower carbon footprint in construction projects. Complies with relevant EU Construction Products Regulation.",
    sustainabilityHighlights: [
      { iconName: "Recycle", text: "Made with 85% Recycled Cellulose Fiber" },
      { iconName: "Leaf", text: "Bio-based Binder Technology" },
      { iconName: "Zap", text: "High Thermal Resistance (R-50)" },
      { iconName: "ShieldCheck", text: "Low VOC Emissions (A+)" },
    ],
    manufacturerName: "BuildGreen Systems",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=BuildGreen",
    complianceSummary:
      "Complies with EU Construction Products Regulation (CPR). Declaration of Performance available. CE Marked.",
    category: "Construction Materials",
    modelNumber: "ESP-R50-1200",
    ebsiStatus: "pending_verification",
    onChainStatus: "Active",
    onChainLifecycleStage: "InUse",
    status: "published",
    lastUpdated: "2024-08-01T10:00:00Z",
    productDetails: {
      esprSpecifics: {
        durabilityInformation:
          "Expected service life of 50+ years when installed according to guidelines. Resistant to mould and pests.",
        repairabilityInformation:
          "Individual panels can be replaced if damaged. Standard fixing methods apply.",
        recycledContentSummary:
          "Primarily composed of 85% post-consumer recycled cellulose fibers.",
        energyEfficiencySummary:
          "Contributes significantly to building energy efficiency due to high R-50 thermal resistance.",
        substanceOfConcernSummary:
          "Does not contain added formaldehyde. Non-halogenated fire retardants used, below SVHC thresholds.",
      },
      digitalTwin: {
        // Added Digital Twin data
        uri: "https://twins.buildgreen.com/insulation/ESP-R50/Lot789",
        realTimeStatus: "Installed. Performance monitoring active.",
        predictiveMaintenanceAlerts: "- No alerts.",
      },
    },
    lifecycleHighlights: [
      {
        stage: "Manufacturing",
        date: "July 2024",
        details: "Produced in Belgium adhering to EN 13163.",
        iconName: "Factory",
      },
      {
        stage: "CE Marking Achieved",
        date: "July 2024",
        details: "Conformity assessment completed.",
        iconName: "Award",
      },
    ],
    certifications: [
      {
        name: "CE Marking (CPR)",
        authority: "Notified Body 1234 (BE)",
        isVerified: true,
        standard: "EN 13163",
      },
      {
        name: "Environmental Product Declaration (EPD)",
        authority: "EPD Program Operator XYZ",
        issueDate: "2024-07-20",
        documentUrl: "https://buildgreen.com/epd/esp-r50.pdf",
        standard: "ISO 14025",
      },
    ],
    constructionProductInformation: {
      declarationOfPerformanceId: "DoP_ESP-R50-1200_001",
      ceMarkingDetailsUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf",
      intendedUseDescription:
        "Thermal insulation for building envelopes (walls, roofs, floors).",
      essentialCharacteristics: [
        {
          characteristicName: "Thermal Conductivity (λ)",
          value: "0.030 W/(m·K)",
          testMethod: "EN 12667",
        },
        {
          characteristicName: "Reaction to Fire",
          value: "Euroclass B-s1, d0",
          testMethod: "EN 13501-1",
        },
      ],
    },
    compliance: {
      // Added for Task 21
      euCustomsData: { cbamGoodsIdentifier: "CBAM_INSULATION_MINERALWOOL_003" },
    },
  },
  USER_PROD123456: {
    passportId: "USER_PROD123456",
    productName: "Custom Craft Wooden Chair",
    tagline: "Artisan Quality, Sustainable Design.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "wooden chair artisan",
    productStory:
      "This chair is handcrafted by local artisans using sustainably sourced oak. Its timeless design and durable construction ensure it will be a cherished piece for generations. The natural oil finish is eco-friendly and enhances the wood's natural beauty.",
    sustainabilityHighlights: [
      { iconName: "Leaf", text: "Sustainably Sourced Oak (FSC Certified)" },
      { iconName: "Users", text: "Handcrafted Locally" },
      { iconName: "ShieldCheck", text: "Durable Design for Longevity" },
      { iconName: "Paintbrush", text: "Low VOC Natural Oil Finish" },
    ],
    manufacturerName: "Artisan Woodworks",
    complianceSummary:
      "TSCA Title VI Compliant (Formaldehyde). Currently undergoing additional certifications.",
    category: "Furniture",
    modelNumber: "CWC-001",
    ebsiStatus: "not_verified",
    anchorTransactionHash: "0xuserProductAnchorHash123",
    blockchainPlatform: "UserMockNet",
    contractAddress: "0xUserProdNFTContract",
    tokenId: "UP_TOKEN_123",
    onChainStatus: "Draft",
    onChainLifecycleStage: "Design",
    status: "draft",
    lastUpdated: new Date().toISOString(),
    certifications: [],
    documents: [],
    customAttributes: [
      { key: "Wood Type", value: "Oak" },
      { key: "Finish", value: "Natural Oil" },
      { key: "Artisan Name", value: "John Craft" },
      { key: "Lead Time", value: "4-6 Weeks" },
    ],
    authenticationVcId: "vc_auth_USER_PROD123456_mock789",
    ownershipNftLink: {
      contractAddress: "0xUserProdNFTContract",
      tokenId: "101",
      chainName: "MockUserChain",
    },
    productDetails: {
      esprSpecifics: {
        durabilityInformation:
          "Handcrafted for longevity, joints reinforced. Oak wood chosen for its natural strength.",
        repairabilityInformation:
          "Can be re-sanded and re-oiled. Standard woodworking repairs possible.",
      },
    },
  },
};
