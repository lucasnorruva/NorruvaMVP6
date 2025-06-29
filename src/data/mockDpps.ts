import type {
  DigitalProductPassport,
  EbsiVerificationDetails,
  BatteryRegulationDetails,
  ScipNotificationDetails,
  EuCustomsDataDetails,
  TextileInformation,
  ConstructionProductInformation,
  CarbonFootprintData,
} from "@/types/dpp";

export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    manufacturer: {
      name: "GreenTech Appliances",
      did: "did:ebsi:zyxts12345",
      eori: "DE123456789",
    },
    modelNumber: "X500-ECO",
    sku: "SKU-X500",
    nfcTagId: "NFC123456",
    rfidTagId: "RFID654321",
    metadata: {
      created_at: "2024-01-01T10:00:00Z",
      last_updated: "2024-07-30T10:00:00Z",
      status: "published",
      dppStandardVersion: "CIRPASS v0.9 Draft",
      onChainStatus: "Active",
      onChainLifecycleStage: "InUse",
    },
    authenticationVcId: "vc_auth_DPP001_mock123",
    ownershipNftLink: {
      registryUrl:
        "https://mock-nft-market.example/token/0xNFTContractForDPP001/1",
      contractAddress: "0xNFTContractForDPP001",
      tokenId: "1",
      chainName: "MockEthereum",
    },
    productDetails: {
      description: "An eco friendly fridge.",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator appliance",
      materials: [{ name: "Recycled Steel", percentage: 70, isRecycled: true }],
      sustainabilityClaims: [
        { claim: "Energy Star Certified" },
        { claim: "Made with 70% recycled materials" },
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
      ethicalSourcingPolicyUrl:
        "https://greentech.com/ethics/sourcing-policy.pdf",
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
        // General Product Carbon Footprint for DPP001
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
    compliance: {
      eprel: {
        id: "EPREL_REG_12345",
        status: "Registered",
        url: "#eprel-link",
        lastChecked: "2024-01-18T00:00:00Z",
      },
      esprConformity: {
        status: "conformant",
        assessmentId: "ESPR_ASSESS_001",
        assessmentDate: "2024-01-01",
      },
      battery_regulation: { status: "not_applicable" },
      scipNotification: {
        status: "Notified",
        notificationId: "SCIP-REF-DPP001-1A2B",
        svhcListVersion: "2024/01 (24.0.1)",
        submittingLegalEntity: "GreenTech Appliances GmbH",
        articleName: "Refrigerator Control Panel Assembly X500",
        primaryArticleId: "X500-CTRL-ASSY",
        safeUseInstructionsLink:
          "https://greentech.com/sds/X500-CTRL-ASSY-SUI.pdf",
        lastChecked: "2024-07-29T00:00:00Z",
      },
      euCustomsData: {
        status: "Verified",
        declarationId: "CUST_DECL_XYZ789",
        hsCode: "84181020",
        countryOfOrigin: "DE",
        netWeightKg: 75.5,
        grossWeightKg: 80.2,
        customsValuation: { value: 450.0, currency: "EUR" },
        cbamGoodsIdentifier: "CBAM_REF_FRIDGE_STEEL_ALUM_001",
        lastChecked: "2024-07-28T00:00:00Z",
      },
    },
    ebsiVerification: {
      status: "verified",
      verificationId: "EBSI_TX_ABC123",
      issuerDid: "did:ebsi:zIssuerXYZ789",
      schema: "EBSIProductComplianceSchema_v1.2",
      issuanceDate: "2024-07-24T10:00:00Z",
      lastChecked: "2024-07-25T00:00:00Z",
    } as EbsiVerificationDetails,
    blockchainIdentifiers: {
      platform: "MockChain",
      anchorTransactionHash:
        "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef",
      contractAddress: "0xMOCK_CONTRACT_FOR_DPP001",
      tokenId: "MOCK_TOKENID_FOR_DPP001_mock1",
    },
    consumerScans: 1250,
    lifecycleEvents: [
      {
        id: "evt1",
        type: "Manufactured",
        timestamp: "2024-01-15T00:00:00Z",
        transactionHash: "0xabc...def",
        responsibleParty: "GreenTech Appliances",
      },
    ],
    certifications: [
      {
        id: "cert1",
        name: "Energy Star",
        issuer: "EPA",
        issueDate: "2024-01-01T11:00:00Z",
        documentUrl: "#",
        transactionHash: "0xcertAnchor1",
        standard: "Energy Star Program Requirements for Refrigerators v6.0",
      },
      {
        id: "cert2",
        name: "ISO 14001",
        issuer: "TUV Rheinland",
        issueDate: "2024-01-20T00:00:00Z",
        expiryDate: "2026-11-14",
        documentUrl: "#iso14001",
        vcId: "vc:iso:14001:greentech:dpp001",
        standard: "ISO 14001:2015",
      },
    ],
    verifiableCredentials: [
      {
        id: "urn:uuid:cred-energy-star-dpp001",
        type: ["VerifiableCredential", "EnergyStarCertification"],
        name: "Energy Star Certificate VC",
        issuer: "did:ebsi:zEnergyStarIssuer",
        issuanceDate: "2024-01-01T11:00:00Z",
        credentialSubject: {
          productId: "DPP001",
          certificationStandard:
            "Energy Star Program Requirements for Refrigerators v6.0",
          certificationStatus: "Active",
        },
      },
      {
        id: "urn:uuid:cred-iso14001-dpp001",
        type: ["VerifiableCredential", "ISOComplianceCredential"],
        name: "ISO 14001 Compliance VC",
        issuer: "did:ebsi:zTuvRheinland",
        issuanceDate: "2024-01-20T00:00:00Z",
        credentialSubject: {
          productId: "DPP001",
          standard: "ISO 14001:2015",
          complianceStatus: "Conformant",
          expiryDate: "2026-11-14",
        },
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
    traceability: {
      originCountry: "DE",
      supplyChainSteps: [
        {
          stepName: "Manufactured",
          actorDid: "did:example:greentech",
          timestamp: "2024-01-15T00:00:00Z",
          location: "Factory A",
          transactionHash: "0xstep1",
        },
      ],
    },
    supplyChainLinks: [
      {
        supplierId: "SUP001",
        suppliedItem: "Compressor Unit XJ-500",
        notes:
          "Primary compressor supplier for EU market. Audited for ethical sourcing.",
      },
      {
        supplierId: "SUP002",
        suppliedItem: "Recycled Steel Panels (70%)",
        notes: "Certified post-consumer recycled content.",
      },
    ],
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads", eori: "FR987654321" },
    modelNumber: "ET-TS-ORG-M",
    metadata: {
      last_updated: "2024-07-25T14:30:00Z",
      status: "draft",
      created_at: "2024-03-01T10:00:00Z",
      onChainStatus: "Pending Activation",
      onChainLifecycleStage: "Manufacturing",
    },
    authenticationVcId: "vc_auth_DPP002_mock456",
    productDetails: {
      description: "A sustainable t-shirt made from organic cotton.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "cotton t-shirt apparel",
      materials: [{ name: "Organic Cotton", percentage: 100 }],
      sustainabilityClaims: [
        { claim: "GOTS Certified" },
        { claim: "Fair Trade Certified Production" },
      ],
      keyCompliancePoints:
        "Textile Labelling Compliant\nSVHC Free (as per REACH)\nFair Wear Foundation Member",
      specifications: JSON.stringify(
        {
          Fit: "Regular",
          GSM: "180",
          Origin: "India",
          Care: "Machine wash cold",
        },
        null,
        2,
      ),
      customAttributes: [
        { key: "Certifications", value: "GOTS, Fair Trade" },
        {
          key: "Care Instructions",
          value: "Machine wash cold, tumble dry low",
        },
      ],
      conflictMineralsReportUrl:
        "https://ecothreads.com/reports/conflict-minerals-na.pdf",
      fairTradeCertificationId: "FLOID12345",
      ethicalSourcingPolicyUrl:
        "https://ecothreads.com/ethics/sourcing-policy.pdf",
      carbonFootprint: {
        // General Product Carbon Footprint for DPP002
        value: 2.5,
        unit: "kg CO2e/item",
        calculationMethod: "Higg MSI",
        dataSource: "Internal Assessment 2024",
        vcId: "vc:cf:dpp002:total:2024",
      },
    },
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
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-25T00:00:00Z" },
      eu_espr: { status: "pending" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: {
        status: "Not Required",
        lastChecked: "2024-07-25T00:00:00Z",
        svhcListVersion: "N/A",
      },
      euCustomsData: {
        status: "Pending Documents",
        hsCode: "61091000",
        countryOfOrigin: "IN",
        netWeightKg: 0.15,
        grossWeightKg: 0.2,
        customsValuation: { value: 8.5, currency: "USD" },
        lastChecked: "2024-07-25T00:00:00Z",
      },
    },
    ebsiVerification: {
      status: "pending_verification",
      lastChecked: "2024-07-20T00:00:00Z",
    } as EbsiVerificationDetails,
    consumerScans: 300,
    blockchainIdentifiers: {
      platform: "MockChain",
      contractAddress: "0xSomeOtherContract",
      tokenId: "TOKEN_TSHIRT_002",
    },
    certifications: [
      {
        id: "cert3",
        name: "GOTS",
        issuer: "Control Union",
        issueDate: "2024-02-20",
        expiryDate: "2025-02-19",
        documentUrl: "#gots",
        standard: "Global Organic Textile Standard 6.0",
      },
    ],
    verifiableCredentials: [
      {
        id: "urn:uuid:cred-gots-dpp002",
        type: ["VerifiableCredential", "GOTSCertification"],
        name: "GOTS Certificate VC",
        issuer: "did:ebsi:zControlUnion",
        issuanceDate: "2024-02-20T00:00:00Z",
        credentialSubject: {
          productId: "DPP002",
          standard: "Global Organic Textile Standard 6.0",
          certificationStatus: "Active",
          scope: "Organic Cotton T-Shirt",
        },
      },
    ],
    documents: [],
    traceability: {
      originCountry: "IN",
      supplyChainSteps: [
        {
          stepName: "Manufactured",
          actorDid: "did:example:ecothreads",
          timestamp: "2024-03-05T00:00:00Z",
          location: "Factory B",
          transactionHash: "0xstep2",
        },
      ],
    },
    supplyChainLinks: [
      {
        supplierId: "SUP003",
        suppliedItem: "Organic Cotton Yarn",
        notes: "GOTS Certified Supplier for all global production.",
      },
    ],
  },
  // ... (other products remain unchanged but would also benefit from having an esprSpecifics field if applicable and a productDetails.carbonFootprint field)
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    manufacturer: { name: "ReCase It", eori: "NL112233445" },
    modelNumber: "RC-POLY-IP15",
    metadata: {
      last_updated: "2024-07-22T09:15:00Z",
      status: "flagged",
      created_at: "2024-04-10T10:00:00Z",
      onChainStatus: "FlaggedForReview",
      onChainLifecycleStage: "InUse",
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-22T00:00:00Z" },
      eu_espr: { status: "compliant" },
      us_scope3: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: {
        status: "Notified",
        notificationId: "SCIP-REF-DPP003-C3D4",
        svhcListVersion: "2023/06 (23.1.0)",
        submittingLegalEntity: "ReCase It B.V.",
        articleName: "Phone Case Housing (Recycled Polymer)",
        primaryArticleId: "RC-POLY-IP15-HOUSING",
        safeUseInstructionsLink: "https://recaseit.com/sui/RC-POLY-IP15.pdf",
        lastChecked: "2024-07-21T00:00:00Z",
      },
      euCustomsData: {
        status: "Cleared",
        declarationId: "CUST_IMP_DEF456",
        hsCode: "39269097",
        countryOfOrigin: "CN",
        netWeightKg: 0.05,
        grossWeightKg: 0.08,
        customsValuation: { value: 3.5, currency: "EUR" },
        lastChecked: "2024-07-20T00:00:00Z",
      },
    },
    consumerScans: 2100,
    productDetails: { description: "A recycled phone case." },
    blockchainIdentifiers: {
      platform: "OtherChain",
      anchorTransactionHash: "0x789polymerAnchorHash000333",
    },
    documents: [],
    traceability: {
      originCountry: "CN",
      supplyChainSteps: [
        {
          stepName: "Manufactured",
          actorDid: "did:example:recaseit",
          timestamp: "2024-04-15T00:00:00Z",
          location: "Factory C",
          transactionHash: "0xstep3",
        },
      ],
    },
    supplyChainLinks: [],
    ebsiVerification: {
      status: "not_verified",
      lastChecked: "2024-07-23T00:00:00Z",
      message: "Connection timeout to EBSI node.",
    } as EbsiVerificationDetails,
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    manufacturer: { name: "Comfy Living" },
    modelNumber: "CL-MODSOFA-01",
    metadata: {
      last_updated: "2024-07-20T11:00:00Z",
      status: "archived",
      created_at: "2023-12-01T10:00:00Z",
      onChainStatus: "Archived",
      onChainLifecycleStage: "EndOfLife",
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-20T00:00:00Z" },
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: {
        status: "Pending Notification",
        svhcListVersion: "2024/01 (24.0.1)",
        submittingLegalEntity: "Comfy Living Designs",
        articleName: "Sofa Frame Connector",
        primaryArticleId: "CL-MODSOFA-CONN01",
        lastChecked: "2024-07-19T00:00:00Z",
      },
      euCustomsData: {
        status: "Verified",
        declarationId: "CUST_SOFA_777",
        hsCode: "94016100",
        countryOfOrigin: "PL",
        netWeightKg: 45.0,
        grossWeightKg: 50.0,
        customsValuation: { value: 350.0, currency: "EUR" },
        lastChecked: "2024-07-18T00:00:00Z",
      },
    },
    consumerScans: 850,
    productDetails: { description: "A modular sofa." },
    documents: [],
    traceability: {
      originCountry: "SE",
      supplyChainSteps: [
        {
          stepName: "Manufactured",
          actorDid: "did:example:comfyliving",
          timestamp: "2023-12-10T00:00:00Z",
          location: "Factory D",
          transactionHash: "0xstep4",
        },
      ],
    },
    supplyChainLinks: [],
    ebsiVerification: {
      status: "error",
      lastChecked: "2024-07-19T00:00:00Z",
      message: "Connection timeout to EBSI node.",
    } as EbsiVerificationDetails,
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    manufacturer: { name: "PowerVolt", eori: "US567890123" },
    modelNumber: "PV-EVB-75KWH",
    metadata: {
      last_updated: "2024-07-29T08:00:00Z",
      status: "pending_review",
      created_at: "2024-05-01T10:00:00Z",
      onChainStatus: "Active",
      onChainLifecycleStage: "QualityAssurance",
    },
    productDetails: {
      description:
        "A high-performance EV battery module designed for long range and fast charging. Contains NMC 811 chemistry for optimal energy density.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ev battery module electric car",
      materials: [
        {
          name: "Nickel",
          percentage: 60,
          origin: "Various",
          isRecycled: true,
          recycledContentPercentage: 15,
        },
        { name: "Manganese", percentage: 10, origin: "Various" },
        {
          name: "Cobalt",
          percentage: 10,
          origin: "Various",
          isRecycled: true,
          recycledContentPercentage: 10,
        },
        {
          name: "Lithium",
          percentage: 5,
          origin: "Australia",
          isRecycled: true,
          recycledContentPercentage: 5,
        },
        { name: "Graphite (Anode)", percentage: 10, origin: "China" },
        {
          name: "Aluminum (Casing)",
          percentage: 5,
          origin: "Various",
          isRecycled: true,
          recycledContentPercentage: 50,
        },
      ],
      specifications: JSON.stringify(
        {
          "Capacity (kWh)": "75",
          "Nominal Voltage (V)": "400",
          "Weight (kg)": "450",
          Chemistry: "NMC 811",
          "Cycle Life (80% DoD)": "3000",
        },
        null,
        2,
      ),
      customAttributes: [
        {
          key: "Charging Time (0-80%)",
          value: "30 minutes (DC Fast Charge @ 150kW)",
        },
        { key: "Energy Density (Wh/kg)", value: "167" },
        { key: "Thermal Management", value: "Liquid Cooled" },
      ],
      conflictMineralsReportUrl:
        "https://powervolt.com/reports/conflict-minerals-2023.pdf",
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-28T00:00:00Z" },
      battery_regulation: {
        status: "pending",
        batteryChemistry: "NMC 811",
        batteryPassportId: "BATT-ID-PV-EVB-75KWH-SN001",
        ratedCapacityAh: 187.5,
        nominalVoltage: 400,
        expectedLifetimeCycles: 3000,
        manufacturingDate: "2024-04-15",
        manufacturerName: "PowerVolt Cell Division",
        carbonFootprint: {
          value: 85.5,
          unit: "kg CO2e/kWh",
          calculationMethod: "PEFCR for Batteries v1.2",
          scope1Emissions: 10.2,
          scope2Emissions: 5.3,
          scope3Emissions: 70.0,
          dataSource: "Internal LCA Study Q1 2024",
          vcId: "vc:cf:dpp005",
        },
        recycledContent: [
          {
            material: "Cobalt",
            percentage: 12,
            source: "Post-consumer",
            vcId: "vc:rc:cobalt:dpp005",
          },
          {
            material: "Lithium",
            percentage: 4,
            source: "Pre-consumer",
            vcId: "vc:rc:lithium:dpp005",
          },
          {
            material: "Nickel",
            percentage: 10,
            source: "Post-consumer",
            vcId: "vc:rc:nickel:dpp005",
          },
        ],
        stateOfHealth: {
          value: 100,
          unit: "%",
          measurementDate: "2024-07-15T00:00:00Z",
          measurementMethod: "Direct Measurement Post-Production",
          vcId: "vc:soh:dpp005",
        },
        recyclingEfficiencyRate: 70,
        materialRecoveryRates: { cobalt: 95, lithium: 50, nickel: 90 },
        dismantlingInformationUrl:
          "https://powervolt.com/manuals/dismantling_pv_evb_75.pdf",
        safetyInformationUrl:
          "https://powervolt.com/manuals/safety_pv_evb_75.pdf",
        vcId: "vc:battreg:overall:dpp005",
      } as BatteryRegulationDetails,
      eu_espr: { status: "pending" },
      scipNotification: {
        status: "Pending Notification",
        svhcListVersion: "2024/01 (24.0.1)",
        submittingLegalEntity: "PowerVolt Inc.",
        articleName: "EV Battery Module Assembly",
        primaryArticleId: "PV-EVB-75KWH-ASSY",
        lastChecked: "2024-07-27T00:00:00Z",
      },
      euCustomsData: {
        status: "Pending Documents",
        hsCode: "85076000",
        countryOfOrigin: "US",
        netWeightKg: 450.0,
        grossWeightKg: 465.0,
        customsValuation: { value: 8500.0, currency: "USD" },
        lastChecked: "2024-07-29T00:00:00Z",
      },
    },
    ebsiVerification: {
      status: "pending_verification",
      lastChecked: "2024-07-29T00:00:00Z",
    } as EbsiVerificationDetails,
    consumerScans: 50,
    certifications: [
      {
        id: "cert_bat_01",
        name: "UN 38.3 Transport Test",
        issuer: "TestCert Ltd.",
        issueDate: "2024-07-01",
        documentUrl: "#",
        transactionHash: "0xcertAnchorBat1",
        standard: "UN Manual of Tests and Criteria, Part III, subsection 38.3",
      },
      {
        id: "cert_bat_02",
        name: "ISO 26262 (ASIL D)",
        issuer: "AutomotiveSafetyCert",
        issueDate: "2024-06-15",
        documentUrl: "#",
        standard: "ISO 26262-Road vehicles Functional safety",
        vcId: "vc:iso26262:dpp005",
      },
    ],
    documents: [
      {
        name: "Battery Safety Data Sheet (SDS)",
        url: "#sds_pv_evb_75kwh.pdf",
        type: "Safety Data Sheet",
        addedTimestamp: "2024-05-10T00:00:00Z",
      },
      {
        name: "Technical Specification Sheet",
        url: "#techspec_pv_evb_75kwh.pdf",
        type: "Technical Specification",
        addedTimestamp: "2024-05-10T00:00:00Z",
      },
    ],
    traceability: {
      originCountry: "US",
      supplyChainSteps: [
        {
          stepName: "Cell Manufacturing",
          actorDid: "did:example:cellmaker",
          timestamp: "2024-05-10T00:00:00Z",
          location: "Nevada, US",
          transactionHash: "0xcellmfg_tx_hash",
        },
        {
          stepName: "Module Assembly",
          actorDid: "did:example:powervolt",
          timestamp: "2024-06-01T00:00:00Z",
          location: "Michigan, US",
          transactionHash: "0xmoduleassy_tx_hash",
        },
      ],
    },
    blockchainIdentifiers: {
      platform: "PowerChain Ledger",
      anchorTransactionHash: "0xevBatteryAnchorHash555AAA",
      contractAddress: "0xEV_BATTERY_REGISTRY",
      tokenId: "TOKEN_PV_EVB_75KWH_SN001",
    },
    supplyChainLinks: [],
  },
  {
    id: "DPP006",
    productName: "EcoSmart Insulation Panel R50",
    category: "Construction Materials",
    manufacturer: { name: "BuildGreen Systems", eori: "BE0123456789" },
    modelNumber: "ESP-R50-1200",
    metadata: {
      created_at: "2024-07-01T00:00:00Z",
      last_updated: "2024-08-01T10:00:00Z",
      status: "published",
      dppStandardVersion: "CPR EN 13163",
      onChainStatus: "Active",
      onChainLifecycleStage: "InUse",
    },
    productDetails: {
      description:
        "High-performance, sustainable insulation panel made from recycled cellulose fibers and a bio-based binder. Provides excellent thermal resistance (R-value 50).",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "insulation panel construction",
      materials: [
        { name: "Recycled Cellulose Fiber", percentage: 85, isRecycled: true },
        { name: "Bio-based Binder", percentage: 10 },
        { name: "Fire Retardant (Non-halogenated)", percentage: 5 },
      ],
      specifications: JSON.stringify(
        {
          "Thermal Resistance (R-value)": "50",
          "Thickness (mm)": "150",
          "Density (kg/m^3)": "35",
          "Fire Rating": "Euroclass B-s1, d0",
        },
        null,
        2,
      ),
      customAttributes: [
        { key: "Recycled Content Source", value: "Post-consumer paper" },
        { key: "VOC Emissions", value: "Low (A+)" },
      ],
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
    },
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
        {
          characteristicName: "Water Vapour Diffusion Resistance (µ)",
          value: "3",
          testMethod: "EN 12086",
        },
      ],
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-08-01T00:00:00Z" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: {
        status: "Not Required",
        lastChecked: "2024-08-01T00:00:00Z",
        svhcListVersion: "N/A",
      },
      esprConformity: {
        status: "conformant",
        assessmentId: "CPR_ASSESS_006",
        assessmentDate: "2024-07-15",
      },
      euCustomsData: {
        status: "Verified",
        declarationId: "CUST_CPR_DPP006",
        hsCode: "68061000",
        countryOfOrigin: "BE",
        lastChecked: "2024-07-20T00:00:00Z",
      },
    },
    ebsiVerification: {
      status: "pending_verification",
      lastChecked: "2024-08-01T00:00:00Z",
    } as EbsiVerificationDetails,
    traceability: { originCountry: "BE" },
    consumerScans: 15,
    certifications: [
      {
        id: "cert_cpr_01",
        name: "CE Marking (CPR)",
        issuer: "Notified Body 0123 (BE)",
        issueDate: "2024-07-15",
        documentUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf",
        standard: "EN 13163",
      },
      {
        id: "cert_epd_01",
        name: "Environmental Product Declaration",
        issuer: "EPD Program Operator XYZ",
        issueDate: "2024-07-20",
        documentUrl: "https://buildgreen.com/epd/esp-r50.pdf",
        standard: "ISO 14025",
        vcId: "vc:epd:buildgreen:dpp006",
      },
    ],
  },
];
