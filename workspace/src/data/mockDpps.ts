
import type { DigitalProductPassport, EbsiVerificationDetails, BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation, CarbonFootprintData, DigitalTwinData } from '@/types/dpp';

export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    manufacturer: { name: "GreenTech Appliances", did: "did:ebsi:zyxts12345", eori: "DE123456789" },
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
        registryUrl: "https://mock-nft-market.example/token/0xNFTContractForDPP001/1",
        contractAddress: "0xNFTContractForDPP001",
        tokenId: "1",
        chainName: "MockEthereum",
    },
    productDetails: {
      description: "An eco friendly fridge.",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator kitchen",
      materials: [{name: "Recycled Steel", percentage: 70, isRecycled: true}],
      sustainabilityClaims: [{claim: "Energy Star Certified"}, {claim: "Made with 70% recycled materials"}], 
      keyCompliancePoints: "EU Ecodesign Compliant\nEU Energy Labelling Compliant\nEPREL Registered\nRoHS Compliant", 
      specifications: JSON.stringify({ "Capacity (Liters)": "400", "Annual Energy Consumption (kWh)": "150", "Noise Level (dB)": "38", "Dimensions (HxWxD cm)": "180x70x65", "Color": "Stainless Steel" }, null, 2),
      customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"}
      ],
      ethicalSourcingPolicyUrl: "https://greentech.com/ethics/sourcing-policy.pdf", 
      esprSpecifics: { 
        durabilityInformation: "Expected lifespan of 15+ years with proper maintenance. Key components tested for 20,000+ hours of operation.",
        repairabilityInformation: "Modular design. Spare parts (compressor, shelves, door seals) available for 10 years. Repair manual accessible via QR code.",
        recycledContentSummary: "Over 70% of steel used is certified post-consumer recycled content. Internal plastic components incorporate 25% recycled polymers.",
        energyEfficiencySummary: "A+++ EU Energy Label. Smart defrost and adaptive cooling technology minimize energy use. Annual consumption approx. 150 kWh.",
        substanceOfConcernSummary: "Fully RoHS compliant. All components screened for SVHCs above 0.1% w/w as per REACH, none present requiring SCIP notification for the main unit. Control panel assembly details in SCIP."
      },
      carbonFootprint: { 
        value: 350,
        unit: "kg CO2e/unit",
        calculationMethod: "ISO 14067",
        scope1Emissions: 50,
        scope2Emissions: 100,
        scope3Emissions: 200,
        dataSource: "Product LCA Study 2024",
        vcId: "vc:cf:dpp001:total:2024"
      },
      digitalTwin: { 
        uri: "https://twins.greentech.com/refrigerator/X500-ECO/SN12345",
        sensorDataEndpoint: "https://api.greentech.com/iot/X500-ECO/SN12345/data",
        realTimeStatus: "Operational - Optimal Performance. Current Temp: 3°C. Energy Use: Low.",
        predictiveMaintenanceAlerts: "- Compressor efficiency slightly reduced (5%), monitor.\n- Door seal integrity check recommended at next service."
      }
    },
    compliance: {
      eprel: { id: "EPREL_REG_12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-01-18T00:00:00Z" },
      esprConformity: { status: "conformant", assessmentId: "ESPR_ASSESS_001", assessmentDate: "2024-01-01" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Notified', 
        notificationId: 'SCIP-REF-DPP001-1A2B',
        svhcListVersion: '2024/01 (24.0.1)',
        submittingLegalEntity: 'GreenTech Appliances GmbH',
        articleName: 'Refrigerator Control Panel Assembly X500',
        primaryArticleId: 'X500-CTRL-ASSY',
        safeUseInstructionsLink: 'https://greentech.com/sds/X500-CTRL-ASSY-SUI.pdf',
        lastChecked: "2024-07-29T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Verified', 
        declarationId: 'CUST_DECL_XYZ789', 
        hsCode: "84181020", 
        countryOfOrigin: "DE",
        netWeightKg: 75.5,
        grossWeightKg: 80.2,
        customsValuation: { value: 450.00, currency: "EUR" },
        cbamGoodsIdentifier: "CBAM_REF_FRIDGE_STEEL_ALUM_001", 
        lastChecked: "2024-07-28T00:00:00Z" 
      },
    },
    ebsiVerification: {
      status: "verified",
      verificationId: "EBSI_TX_ABC123",
      issuerDid: "did:ebsi:zIssuerXYZ789", 
      schema: "EBSIProductComplianceSchema_v1.2", 
      issuanceDate: "2024-07-24T10:00:00Z", 
      lastChecked: "2024-07-25T00:00:00Z"
    } as EbsiVerificationDetails,
    blockchainIdentifiers: { 
      platform: "MockChain", 
      anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef", 
      contractAddress: "0xNFTContractForDPP001", 
      tokenId: "1",
    },
    consumerScans: 1250,
    lifecycleEvents: [
      {id: "evt1", type: "Manufactured", timestamp: "2024-01-15T00:00:00Z", transactionHash: "0xabc...def", responsibleParty: "GreenTech Appliances"}
    ],
    certifications: [
      {id: "cert1", name: "Energy Star", issuer: "EPA", issueDate: "2024-01-01T11:00:00Z", documentUrl: "#", transactionHash: "0xcertAnchor1", standard: "Energy Star Program Requirements for Refrigerators v6.0"},
      {id: "cert2", name: "ISO 14001", issuer: "TUV Rheinland", issueDate: "2024-01-20T00:00:00Z", expiryDate: "2026-11-14", documentUrl: "#iso14001", vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015"}
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
                certificationStandard: "Energy Star Program Requirements for Refrigerators v6.0",
                certificationStatus: "Active"
            }
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
                expiryDate: "2026-11-14"
            }
        }
    ],
    documents: [
      { name: "User Manual v1.2", url: "#manual_v1.2.pdf", type: "User Manual", addedTimestamp: "2024-01-15T00:00:00Z" },
      { name: "Warranty Card", url: "#warranty.pdf", type: "Warranty", addedTimestamp: "2024-01-15T00:00:00Z" },
    ],
    traceability: {
    originCountry: "DE",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:greentech',
          timestamp: '2024-01-15T00:00:00Z',
          location: 'Factory A',
          transactionHash: '0xstep1'
        }
      ]
    },
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier for EU market. Audited for ethical sourcing." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified post-consumer recycled content." }
    ]
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads", eori: "FR987654321"},
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
      materials: [{name: "Organic Cotton", percentage: 100}],
      sustainabilityClaims: [{claim: "GOTS Certified"}, {claim:"Fair Trade Certified Production"}], 
      keyCompliancePoints: "Textile Labelling Compliant\nSVHC Free (as per REACH)\nFair Wear Foundation Member", 
      specifications: JSON.stringify({ "Fit": "Regular", "GSM": "180", "Origin": "India", "Care": "Machine wash cold" }, null, 2),
      customAttributes: [{key: "Certifications", value: "GOTS, Fair Trade"}, {key: "Care Instructions", value: "Machine wash cold, tumble dry low"}],
      conflictMineralsReportUrl: "https://ecothreads.com/reports/conflict-minerals-na.pdf", 
      fairTradeCertificationId: "FLOID12345", 
      ethicalSourcingPolicyUrl: "https://ecothreads.com/ethics/sourcing-policy.pdf", 
      carbonFootprint: { 
        value: 2.5, unit: "kg CO2e/item", calculationMethod: "Higg MSI",
        dataSource: "Internal Assessment 2024", vcId: "vc:cf:dpp002:total:2024"
      },
    },
    textileInformation: {
      fiberComposition: [
        { fiberName: "Organic Cotton", percentage: 95 },
        { fiberName: "Elastane", percentage: 5 }
      ],
      countryOfOriginLabeling: "India (Spinning, Weaving), Portugal (Making-up)",
      careInstructionsUrl: "https://ecothreads.com/care/ET-TS-ORG-M",
      isSecondHand: false,
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-25T00:00:00Z" },
      eu_espr: { status: "pending" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { status: 'Not Required', lastChecked: "2024-07-25T00:00:00Z", svhcListVersion: "N/A" }, 
      euCustomsData: { 
        status: 'Pending Documents', 
        hsCode: "61091000", 
        countryOfOrigin: "IN",
        netWeightKg: 0.15,
        grossWeightKg: 0.2,
        customsValuation: { value: 8.50, currency: "USD" },
        cbamGoodsIdentifier: "CBAM_TEXTILE_COTTON_002",
        lastChecked: "2024-07-25T00:00:00Z" 
      },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"} as EbsiVerificationDetails,
    consumerScans: 300,
    blockchainIdentifiers: { 
      platform: "MockChain", 
      contractAddress: "0xSomeOtherContract", 
      tokenId: "TOKEN_TSHIRT_002" 
    }, 
    certifications: [
      {id: "cert3", name: "GOTS", issuer: "Control Union", issueDate: "2024-02-20", expiryDate: "2025-02-19", documentUrl: "#gots", standard: "Global Organic Textile Standard 6.0"},
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
              scope: "Organic Cotton T-Shirt"
          }
      }
    ],
    documents: [],
    traceability: {
    originCountry: "IN",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:ecothreads',
          timestamp: '2024-03-05T00:00:00Z',
          location: 'Factory B',
          transactionHash: '0xstep2'
        }
      ]
    },
    supplyChainLinks: [
       { supplierId: "SUP003", suppliedItem: "Organic Cotton Yarn", notes: "GOTS Certified Supplier for all global production." }
    ]
  },
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    manufacturer: { name: "ReCase It", eori: "NL112233445"},
    modelNumber: "RC-POLY-IP15",
    metadata: { 
      last_updated: "2024-07-22T09:15:00Z", 
      status: "flagged", 
      created_at: "2024-04-10T10:00:00Z",
      onChainStatus: "FlaggedForReview", 
      onChainLifecycleStage: "InUse" 
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-22T00:00:00Z" },
      eu_espr: { status: "compliant" },
      us_scope3: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Notified', 
        notificationId: 'SCIP-REF-DPP003-C3D4',
        svhcListVersion: '2023/06 (23.1.0)',
        submittingLegalEntity: 'ReCase It B.V.',
        articleName: 'Phone Case Housing (Recycled Polymer)',
        primaryArticleId: 'RC-POLY-IP15-HOUSING',
        safeUseInstructionsLink: 'https://recaseit.com/sui/RC-POLY-IP15.pdf',
        lastChecked: "2024-07-21T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Cleared', 
        declarationId: 'CUST_IMP_DEF456', 
        hsCode: "39269097", 
        countryOfOrigin: "CN",
        netWeightKg: 0.05,
        grossWeightKg: 0.08,
        customsValuation: { value: 3.50, currency: "EUR" },
        lastChecked: "2024-07-20T00:00:00Z" 
      },
    },
    consumerScans: 2100,
     productDetails: { 
      description: "A recycled phone case.",
      digitalTwin: { 
        uri: "https://twins.recaseit.com/phonecase/RC-POLY-IP15/SN9876",
        realTimeStatus: "In Use - No issues detected."
      }
    },
     blockchainIdentifiers: { platform: "OtherChain", anchorTransactionHash: "0x789polymerAnchorHash000333"},
    documents: [],
    traceability: {
      originCountry: "CN",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:recaseit',
          timestamp: '2024-04-15T00:00:00Z',
          location: 'Factory C',
          transactionHash: '0xstep3'
        }
      ]
    },
    supplyChainLinks: [],
    ebsiVerification: { status: "not_verified", lastChecked: "2024-07-23T00:00:00Z", message: "Connection timeout to EBSI node."} as EbsiVerificationDetails,
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    manufacturer: { name: "Comfy Living"},
    modelNumber: "CL-MODSOFA-01",
    metadata: { 
      last_updated: "2024-07-20T11:00:00Z", 
      status: "archived", 
      created_at: "2023-12-01T10:00:00Z",
      onChainStatus: "Archived", 
      onChainLifecycleStage: "EndOfLife" 
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-20T00:00:00Z" },
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { status: 'Pending Notification', svhcListVersion: '2024/01 (24.0.1)', submittingLegalEntity: 'Comfy Living Designs', articleName: 'Sofa Frame Connector', primaryArticleId: 'CL-MODSOFA-CONN01', lastChecked: "2024-07-19T00:00:00Z" },
      euCustomsData: { 
        status: 'Verified', 
        declarationId: 'CUST_SOFA_777', 
        hsCode: "94016100", 
        countryOfOrigin: "PL",
        netWeightKg: 45.0,
        grossWeightKg: 50.0,
        customsValuation: { value: 350.00, currency: "EUR" },
        lastChecked: "2024-07-18T00:00:00Z" 
      }
    },
    consumerScans: 850,
    productDetails: { description: "A modular sofa."},
    documents: [],
    traceability: {
      originCountry: "SE",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:comfyliving',
          timestamp: '2023-12-10T00:00:00Z',
          location: 'Factory D',
          transactionHash: '0xstep4'
        }
      ]
    },
    supplyChainLinks: [],
    ebsiVerification: { status: "error", lastChecked: "2024-07-19T00:00:00Z", message: "Connection timeout to EBSI node."} as EbsiVerificationDetails,
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    manufacturer: { name: "PowerVolt", eori: "US567890123"},
    modelNumber: "PV-EVB-75KWH",
    metadata: { 
      last_updated: "2024-07-29T08:00:00Z", 
      status: "pending_review", 
      created_at: "2024-05-01T10:00:00Z",
      onChainStatus: "Active",
      onChainLifecycleStage: "QualityAssurance",
    },
    productDetails: {
      description: "A high-performance EV battery module designed for long range and fast charging. Contains NMC 811 chemistry for optimal energy density.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ev battery module electric car",
      materials: [
        { name: "Nickel", percentage: 60, origin: "Various", isRecycled: true, recycledContentPercentage: 15 },
        { name: "Manganese", percentage: 10, origin: "Various" },
        { name: "Cobalt", percentage: 10, origin: "Various", isRecycled: true, recycledContentPercentage: 10 },
        { name: "Lithium", percentage: 5, origin: "Australia", isRecycled: true, recycledContentPercentage: 5 },
        { name: "Graphite (Anode)", percentage: 10, origin: "China" },
        { name: "Aluminum (Casing)", percentage: 5, origin: "Various", isRecycled: true, recycledContentPercentage: 50 },
      ],
      specifications: JSON.stringify({ "Capacity (kWh)": "75", "Nominal Voltage (V)": "400", "Weight (kg)": "450", "Chemistry": "NMC 811", "Cycle Life (80% DoD)": "3000" }, null, 2),
      customAttributes: [
        {key: "Charging Time (0-80%)", value: "30 minutes (DC Fast Charge @ 150kW)"},
        {key: "Energy Density (Wh/kg)", value: "167"},
        {key: "Thermal Management", value: "Liquid Cooled"}
      ],
      conflictMineralsReportUrl: "https://powervolt.com/reports/conflict-minerals-2023.pdf", 
      digitalTwin: { 
        uri: "https://twins.powervolt.com/evbattery/PV-EVB-75KWH/SN001",
        sensorDataEndpoint: "https://api.powervolt.com/iot/evbattery/SN001/data",
        realTimeStatus: "Charging - 75% SoC. Cell Temps Nominal.",
        predictiveMaintenanceAlerts: "- Cooling fan #2 showing reduced RPM. Monitor.\n- Cell group 5 voltage slightly lower than average."
      }
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
            value: 85.5, unit: "kg CO2e/kWh", calculationMethod: "PEFCR for Batteries v1.2", 
            scope1Emissions: 10.2, scope2Emissions: 5.3, scope3Emissions: 70.0, 
            dataSource: "Internal LCA Study Q1 2024", 
            vcId: "vc:cf:dpp005" 
        },
        recycledContent: [
          { material: "Cobalt", percentage: 12, source: "Post-consumer", vcId: "vc:rc:cobalt:dpp005" },
          { material: "Lithium", percentage: 4, source: "Pre-consumer", vcId: "vc:rc:lithium:dpp005" },
          { material: "Nickel", percentage: 10, source: "Post-consumer", vcId: "vc:rc:nickel:dpp005" }
        ],
        stateOfHealth: {value: 100, unit: '%', measurementDate: "2024-07-15T00:00:00Z", measurementMethod: "Direct Measurement Post-Production", vcId: "vc:soh:dpp005"},
        recyclingEfficiencyRate: 70, 
        materialRecoveryRates: { cobalt: 95, lithium: 50, nickel: 90 },
        dismantlingInformationUrl: "https://powervolt.com/manuals/dismantling_pv_evb_75.pdf",
        safetyInformationUrl: "https://powervolt.com/manuals/safety_pv_evb_75.pdf",
        vcId: "vc:battreg:overall:dpp005"
      } as BatteryRegulationDetails,
      eu_espr: { status: "pending" }, 
      scipNotification: { 
        status: 'Pending Notification', 
        svhcListVersion: '2024/01 (24.0.1)',
        submittingLegalEntity: 'PowerVolt Inc.',
        articleName: 'EV Battery Module Assembly',
        primaryArticleId: 'PV-EVB-75KWH-ASSY',
        lastChecked: "2024-07-27T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Pending Documents', 
        hsCode: "85076000", 
        countryOfOrigin: "US",
        netWeightKg: 450.0,
        grossWeightKg: 465.0,
        customsValuation: { value: 8500.00, currency: "USD" },
        cbamGoodsIdentifier: "CBAM_BATTERY_EV_001", 
        lastChecked: "2024-07-29T00:00:00Z" 
      },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-29T00:00:00Z"} as EbsiVerificationDetails,
    consumerScans: 50,
    certifications: [
      {id: "cert_bat_01", name: "UN 38.3 Transport Test", issuer: "TestCert Ltd.", issueDate: "2024-07-01", documentUrl: "#", transactionHash: "0xcertAnchorBat1", standard: "UN Manual of Tests and Criteria, Part III, subsection 38.3"},
      {id: "cert_bat_02", name: "ISO 26262 (ASIL D)", issuer: "AutomotiveSafetyCert", issueDate: "2024-06-15", documentUrl: "#", standard: "ISO 26262-Road vehicles Functional safety", vcId: "vc:iso26262:dpp005"}
    ],
    documents: [
        { name: "Battery Safety Data Sheet (SDS)", url: "#sds_pv_evb_75kwh.pdf", type: "Safety Data Sheet", addedTimestamp: "2024-05-10T00:00:00Z" },
        { name: "Technical Specification Sheet", url: "#techspec_pv_evb_75kwh.pdf", type: "Technical Specification", addedTimestamp: "2024-05-10T00:00:00Z" },
    ],
    traceability: {
      originCountry: "US",
      supplyChainSteps: [
        {
          stepName: 'Cell Manufacturing',
          actorDid: 'did:example:cellmaker',
          timestamp: '2024-05-10T00:00:00Z',
          location: 'Nevada, US',
          transactionHash: '0xcellmfg_tx_hash'
        },
        {
          stepName: 'Module Assembly',
          actorDid: 'did:example:powervolt',
          timestamp: '2024-06-01T00:00:00Z',
          location: 'Michigan, US',
          transactionHash: '0xmoduleassy_tx_hash'
        }
      ]
    },
    blockchainIdentifiers: { 
      platform: "PowerChain Ledger", 
      anchorTransactionHash: "0xevBatteryAnchorHash555AAA", 
      contractAddress: "0xEV_BATTERY_REGISTRY", 
      tokenId: "TOKEN_PV_EVB_75KWH_SN001"
    },
    supplyChainLinks: []
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
      description: "High-performance, sustainable insulation panel made from recycled cellulose fibers and a bio-based binder. Provides excellent thermal resistance (R-value 50).",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "insulation panel construction",
      materials: [
        { name: "Recycled Cellulose Fiber", percentage: 85, isRecycled: true },
        { name: "Bio-based Binder", percentage: 10 },
        { name: "Fire Retardant (Non-halogenated)", percentage: 5 }
      ],
      specifications: JSON.stringify({ "Thermal Resistance (R-value)": "50", "Thickness (mm)": "150", "Density (kg/m^3)": "35", "Fire Rating": "Euroclass B-s1, d0" }, null, 2),
      customAttributes: [
        {key: "Recycled Content Source", value: "Post-consumer paper"},
        {key: "VOC Emissions", value: "Low (A+)"}
      ],
      esprSpecifics: {
        durabilityInformation: "Expected service life of 50+ years when installed according to guidelines. Resistant to mould and pests.",
        repairabilityInformation: "Individual panels can be replaced if damaged. Standard fixing methods apply.",
        recycledContentSummary: "Primarily composed of 85% post-consumer recycled cellulose fibers.",
        energyEfficiencySummary: "Contributes significantly to building energy efficiency due to high R-50 thermal resistance.",
        substanceOfConcernSummary: "Does not contain added formaldehyde. Non-halogenated fire retardants used, below SVHC thresholds."
      },
      digitalTwin: { 
        uri: "https://twins.buildgreen.com/insulation/ESP-R50/Lot789",
        realTimeStatus: "Installed. Performance monitoring active.",
        predictiveMaintenanceAlerts: "- No alerts."
      }
    },
    constructionProductInformation: {
      declarationOfPerformanceId: "DoP_ESP-R50-1200_001",
      ceMarkingDetailsUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf",
      intendedUseDescription: "Thermal insulation for building envelopes (walls, roofs, floors).",
      essentialCharacteristics: [
        { characteristicName: "Thermal Conductivity (λ)", value: "0.030 W/(m·K)", testMethod: "EN 12667" },
        { characteristicName: "Reaction to Fire", value: "Euroclass B-s1, d0", testMethod: "EN 13501-1" },
        { characteristicName: "Water Vapour Diffusion Resistance (µ)", value: "3", testMethod: "EN 12086" }
      ]
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-08-01T00:00:00Z" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { status: 'Not Required', lastChecked: "2024-08-01T00:00:00Z", svhcListVersion: "N/A" },
      esprConformity: { status: "conformant", assessmentId: "CPR_ASSESS_006", assessmentDate: "2024-07-15" },
      euCustomsData: {
        status: "Verified",
        declarationId: "CUST_CPR_DPP006",
        hsCode: "68061000", 
        countryOfOrigin: "BE",
        cbamGoodsIdentifier: "CBAM_INSULATION_MINERALWOOL_003", 
        lastChecked: "2024-07-20T00:00:00Z"
      }
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-08-01T00:00:00Z"} as EbsiVerificationDetails,
    traceability: { originCountry: "BE" },
    consumerScans: 15,
    certifications: [
      {id: "cert_cpr_01", name: "CE Marking (CPR)", issuer: "Notified Body 0123 (BE)", issueDate: "2024-07-15", documentUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf", standard: "EN 13163"},
      {id: "cert_epd_01", name: "Environmental Product Declaration", issuer: "EPD Program Operator XYZ", issueDate: "2024-07-20", documentUrl: "https://buildgreen.com/epd/esp-r50.pdf", standard: "ISO 14025", vcId: "vc:epd:buildgreen:dpp006"}
    ],
  }
];

```
- workspace/src/types/dpp/Product.ts:
```ts

// --- File: Product.ts ---
// Description: Product related type definitions and mock data.

import type { LifecycleEvent, SimpleLifecycleEvent, LifecycleHighlight, IconName as LucideIconName } from './Lifecycle';
import type {
  Certification, EbsiVerificationDetails, SimpleCertification, ProductComplianceSummary, PublicCertification,
  BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation, EsprSpecifics, CarbonFootprintData
} from './Compliance'; 

export const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';
export const USER_SUPPLIERS_LOCAL_STORAGE_KEY = 'norruvaUserSuppliers';
export const TRACKED_PRODUCTS_STORAGE_KEY = 'norruvaTrackedProductIds';

export interface SupplyChainStep {
  stepName: string;
  actorDid?: string;
  timestamp: string;
  location?: string;
  transactionHash?: string;
}

export interface TraceabilityInfo {
  batchId?: string;
  originCountry?: string;
  supplyChainSteps?: SupplyChainStep[];
}

export interface VerifiableCredentialReference {
  id: string;
  type: string[];
  name?: string;
  issuer: string;
  issuanceDate: string;
  credentialSubject: Record<string, any>;
  proof?: any;
  verificationMethod?: string;
}

export interface ProductSupplyChainLink {
  supplierId: string;
  suppliedItem: string;
  notes?: string;
}

export interface CustomAttribute {
  key: string;
  value: string;
}

export interface DocumentReference {
  name: string;
  url: string;
  type: string;
  addedTimestamp: string;
}

export interface OwnershipNftLink {
  registryUrl?: string;
  contractAddress: string;
  tokenId: string;
  chainName?: string;
}

export interface DigitalTwinData { // Conceptual Data for Digital Twin
  uri?: string; 
  sensorDataEndpoint?: string; 
  realTimeStatus?: string; 
  predictiveMaintenanceAlerts?: string; 
}

export interface DigitalProductPassport {
  id: string;
  version?: number;
  productName: string;
  category: string;
  gtin?: string;
  modelNumber?: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
  manufacturer?: {
    name: string;
    did?: string;
    address?: string;
    eori?: string;
  };

  metadata: {
    created_at?: string;
    last_updated: string;
    status: 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked' | 'flagged';
    dppStandardVersion?: string;
    dataSchemaVersion?: string;
    onChainStatus?: string; 
    onChainLifecycleStage?: string; 
  };

  blockchainIdentifiers?: {
    platform?: string;
    contractAddress?: string;
    tokenId?: string;
    anchorTransactionHash?: string;
  };

  authenticationVcId?: string;
  ownershipNftLink?: OwnershipNftLink;

  productDetails?: {
    description?: string;
    imageUrl?: string;
    imageHint?: string;
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean; recycledContentPercentage?: number }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string; verificationDetails?: string }>;
    energyLabel?: string;
    repairabilityScore?: { value: number; scale: number; reportUrl?: string; vcId?: string };
    recyclabilityInformation?: { instructionsUrl?: string; recycledContentPercentage?: number; designForRecycling?: boolean; vcId?: string };
    specifications?: string; 
    customAttributes?: CustomAttribute[];
    conflictMineralsReportUrl?: string; 
    fairTradeCertificationId?: string; 
    ethicalSourcingPolicyUrl?: string; 
    keyCompliancePoints?: string; 
    esprSpecifics?: EsprSpecifics; 
    carbonFootprint?: CarbonFootprintData; 
    digitalTwin?: DigitalTwinData; 
  };

  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  lifecycleEvents?: LifecycleEvent[];
  certifications?: Certification[];
  documents?: DocumentReference[];
  traceability?: TraceabilityInfo;

  compliance: {
    eprel?: {
      id?: string;
      status: string;
      url?: string;
      lastChecked: string;
    };
    esprConformity?: {
      assessmentId?: string;
      status: 'conformant' | 'non_conformant' | 'pending_assessment';
      assessmentDate?: string;
      vcId?: string;
    };
    eu_espr?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string };
    us_scope3?: { status: 'compliant' | 'non_compliant' | 'pending'; reportUrl?: string; vcId?: string };
    battery_regulation?: BatteryRegulationDetails; 
    scipNotification?: ScipNotificationDetails;
    euCustomsData?: EuCustomsDataDetails;
  };

  ebsiVerification?: EbsiVerificationDetails;
  verifiableCredentials?: VerifiableCredentialReference[];
  consumerScans?: number;
  dataController?: string;
  accessControlPolicyUrl?: string;
  privacyPolicyUrl?: string;
  supplyChainLinks?: ProductSupplyChainLink[];
}

export interface DashboardFiltersState {
  status: 'all' | 'draft' | 'published' | 'archived' | 'pending_review' | 'revoked' | 'flagged';
  regulation: 'all' | 'eu_espr' | 'us_scope3' | 'battery_regulation';
  category: 'all' | string;
  searchQuery?: string;
  blockchainAnchored?: 'all' | 'anchored' | 'not_anchored';
}

export type SortableKeys = keyof DigitalProductPassport | 'metadata.status' | 'metadata.last_updated' | 'overallCompliance' | 'ebsiVerification.status' | 'metadata.onChainStatus';

export interface SortConfig {
  key: SortableKeys | null;
  direction: 'ascending' | 'descending' | null;
}

export interface SimpleProductDetail {
  id: string;
  productName: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged';
  manufacturer?: string;
  gtin?: string;
  modelNumber?: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
  description?: string;
  imageUrl?: string;
  imageHint?: string;
  keySustainabilityPoints?: string[];
  keyCompliancePoints?: string; 
  specifications?: string; 
  customAttributes?: CustomAttribute[];
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  complianceSummary?: ProductComplianceSummary;
  lifecycleEvents?: SimpleLifecycleEvent[];
  certifications?: SimpleCertification[];
  documents?: DocumentReference[];
  authenticationVcId?: string; 
  ownershipNftLink?: OwnershipNftLink; 
  blockchainPlatform?: string;
  contractAddress?: string;
  tokenId?: string;
  anchorTransactionHash?: string;
  ebsiStatus?: EbsiVerificationDetails['status']; 
  ebsiVerificationId?: string; 
  onChainStatus?: string; 
  onChainLifecycleStage?: string; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  lastUpdated?: string; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; 
    digitalTwin?: DigitalTwinData; 
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
    description?: string; 
    imageUrl?: string;
    imageHint?: string;
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean; recycledContentPercentage?: number }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string; verificationDetails?: string }>;
    energyLabel?: string;
    repairabilityScore?: { value: number; scale: number; reportUrl?: string; vcId?: string };
    recyclabilityInformation?: { instructionsUrl?: string; recycledContentPercentage?: number; designForRecycling?: boolean; vcId?: string };
    specifications?: string; 
    customAttributes?: CustomAttribute[];
    keyCompliancePoints?: string; 
  };
}

export interface StoredUserProduct extends Omit<ProductFormData, 'batteryRegulation' | 'compliance' | 'productDetails'> {
  id: string;
  status: string; 
  compliance: string; 
  lastUpdated: string;
  productCategory?: string;
  keySustainabilityPoints?: string[]; 
  keyCompliancePoints?: string;
  keyCompliancePointsOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsUsed?: { name: string; percentage?: number; source?: string; isRecycled?: boolean }[];
  energyLabelRating?: string;
  repairability?: { score: number; scale: number; detailsUrl?: string };
  recyclabilityInfo?: { percentage?: number; instructionsUrl?: string };
  supplyChainLinks?: ProductSupplyChainLink[];
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary; 
  
  productDetails?: Partial<ProductFormData['productDetails']>; 
  complianceData?: { 
    eprel?: Partial<ProductFormData['compliance']['eprel']>;
    esprConformity?: Partial<ProductFormData['compliance']['esprConformity']>;
    scipNotification?: Partial<ScipNotificationDetails>;
    euCustomsData?: Partial<EuCustomsDataDetails & { cbamGoodsIdentifier?: string }>;
    battery_regulation?: Partial<ProductFormData['compliance']['battery_regulation']>;
  };
  batteryRegulation?: Partial<BatteryRegulationDetails>; 
  textileInformation?: Partial<TextileInformation>; 
  constructionProductInformation?: Partial<ConstructionProductInformation>; 
  metadata?: Partial<InitialProductFormData>; 
  authenticationVcId?: string; 
  ownershipNftLink?: { registryUrl?: string; contractAddress: string; tokenId: string; chainName?: string; }; 
  blockchainIdentifiers?: InitialProductFormData['blockchainIdentifiers']; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  manufacturerOrigin?: 'AI_EXTRACTED' | 'manual';
  modelNumberOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsOrigin?: 'AI_EXTRACTED' | 'manual';
  sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
  energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
  specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  productDetailsOrigin?: { 
    descriptionOrigin?: 'AI_EXTRACTED' | 'manual';
    materialsOrigin?: 'AI_EXTRACTED' | 'manual';
    sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
    keyCompliancePointsOrigin?: 'AI_EXTRACTED' | 'manual';
    specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
    energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
    imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
    esprSpecificsOrigin?: {
      durabilityInformationOrigin?: 'AI_EXTRACTED' | 'manual';
      repairabilityInformationOrigin?: 'AI_EXTRACTED' | 'manual';
      recycledContentSummaryOrigin?: 'AI_EXTRACTED' | 'manual';
      energyEfficiencySummaryOrigin?: 'AI_EXTRACTED' | 'manual';
      substanceOfConcernSummaryOrigin?: 'AI_EXTRACTED' | 'manual';
    };
    carbonFootprintOrigin?: { 
        valueOrigin?: 'AI_EXTRACTED' | 'manual';
        unitOrigin?: 'AI_EXTRACTED' | 'manual';
        calculationMethodOrigin?: 'AI_EXTRACTED' | 'manual';
        scope1EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        scope2EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        scope3EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        dataSourceOrigin?: 'AI_EXTRACTED' | 'manual';
        vcIdOrigin?: 'AI_EXTRACTED' | 'manual';
    };
    digitalTwinOrigin?: { 
        uriOrigin?: 'AI_EXTRACTED' | 'manual';
        sensorDataEndpointOrigin?: 'AI_EXTRACTED' | 'manual';
        realTimeStatusOrigin?: 'AI_EXTRACTED' | 'manual';
        predictiveMaintenanceAlertsOrigin?: 'AI_EXTRACTED' | 'manual';
    };
  };
  batteryRegulationOrigin?: any; 
}

export interface RichMockProduct {
  id: string;
  productId: string;
  productName: string;
  category?: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged' | 'published' | 'pending_review' | 'revoked';
  compliance: string;
  lastUpdated: string;
  gtin?: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  productDescription?: string; 
  imageUrl?: string;
  imageHint?: string;
  materials?: string;
  sustainabilityClaims?: string; 
  keyCompliancePoints?: string; 
  energyLabel?: string;
  specifications?: string; 
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string; 
  stateOfHealth?: number | null; 
  carbonFootprintManufacturing?: number | null; 
  recycledContentPercentage?: number | null; 
  ebsiVerification?: EbsiVerificationDetails;
  certifications?: Certification[];
  documents?: DocumentReference[];
  supplyChainLinks?: ProductSupplyChainLink[];
  customAttributes?: CustomAttribute[];
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
  authenticationVcId?: string; 
  ownershipNftLink?: OwnershipNftLink; 
  metadata?: Partial<DigitalProductPassport['metadata']>; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; 
    digitalTwin?: DigitalTwinData; 
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
    description?: string; 
    imageUrl?: string;
    imageHint?: string;
    materials?: Array<{ name: string; percentage?: number; origin?: string; isRecycled?: boolean; recycledContentPercentage?: number }>;
    sustainabilityClaims?: Array<{ claim: string; evidenceVcId?: string; verificationDetails?: string }>;
    energyLabel?: string;
    repairabilityScore?: { value: number; scale: number; reportUrl?: string; vcId?: string };
    recyclabilityInformation?: { instructionsUrl?: string; recycledContentPercentage?: number; designForRecycling?: boolean; vcId?: string };
    specifications?: string; 
    customAttributes?: CustomAttribute[];
    keyCompliancePoints?: string; 
  };
}

export interface PublicProductInfo {
  passportId: string;
  productName: string;
  tagline: string;
  imageUrl: string;
  imageHint?: string;
  productStory: string;
  sustainabilityHighlights: Array<{ iconName?: LucideIconName; text: string }>;
  keyCompliancePoints?: string; 
  manufacturerName: string;
  manufacturerWebsite?: string;
  brandLogoUrl?: string;
  learnMoreLink?: string;
  complianceSummary: string;
  compliance?: DigitalProductPassport['compliance']; // Added for CBAM ID on public page
  category: string;
  modelNumber: string;
  sku?: string;
  gtin?: string; 
  nfcTagId?: string;
  rfidTagId?: string;
  anchorTransactionHash?: string;
  blockchainPlatform?: string;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'error';
  ebsiVerificationId?: string;
  lifecycleHighlights?: LifecycleHighlight[];
  certifications?: PublicCertification[];
  customAttributes?: CustomAttribute[];
  documents?: DocumentReference[];
  authenticationVcId?: string; 
  ownershipNftLink?: OwnershipNftLink; 
  contractAddress?: string;
  tokenId?: string;
  onChainStatus?: string; 
  onChainLifecycleStage?: string; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; 
    digitalTwin?: DigitalTwinData; 
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
  };
  status?: DigitalProductPassport['metadata']['status']; 
  lastUpdated?: string; 
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  location?: string;
  materialsSupplied: string;
  status: 'Active' | 'Inactive' | 'Pending Review';
  lastUpdated: string;
}

export interface DisplayableProduct {
  id: string;
  productId?: string;
  productName?: string;
  category?: string;
  productCategory?: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Pending' | 'Flagged' | string;
  compliance: string;
  lastUpdated: string;
  gtin?: string;
  manufacturer?: string;
  modelNumber?: string;
  description?: string;
  productDescription?: string;
  imageUrl?: string;
  imageHint?: string;
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  materials?: string;
  sustainabilityClaims?: string;
  keyCompliancePoints?: string; 
  energyLabel?: string;
  specifications?: string; 
  lifecycleEvents?: SimpleLifecycleEvent[];
  complianceSummary?: ProductComplianceSummary;
  batteryChemistry?: string;
  stateOfHealth?: number | null;
  carbonFootprintManufacturing?: number | null;
  recycledContentPercentage?: number | null;
  ebsiStatus?: 'verified' | 'pending' | 'not_verified' | 'error' | 'N/A';
  supplyChainLinks?: ProductSupplyChainLink[];
  certifications?: SimpleCertification[];
  documents?: DocumentReference[];
  customAttributes?: CustomAttribute[];
  customAttributesJsonString?: string;
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
  authenticationVcId?: string; 
  ownershipNftLink?: OwnershipNftLink; 
  metadata?: Partial<DigitalProductPassport['metadata']>; 
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  batteryRegulation?: BatteryRegulationDetails; 
  conflictMineralsReportUrl?: string; 
  fairTradeCertificationId?: string; 
  ethicalSourcingPolicyUrl?: string; 
  productDetails?: { 
    esprSpecifics?: EsprSpecifics;
    carbonFootprint?: CarbonFootprintData; 
    digitalTwin?: DigitalTwinData; 
    conflictMineralsReportUrl?: string;
    fairTradeCertificationId?: string;
    ethicalSourcingPolicyUrl?: string;
  };
}

export interface AnchorResult {
  productId: string;
  anchorTransactionHash: string;
  platform?: string;
}

// Token Operation Response Types
export interface MintTokenResponse {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  message?: string;
  error?: string; 
}

export interface UpdateTokenMetadataResponse {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  message?: string;
  error?: string; 
}

export interface TokenStatusResponse {
  tokenId: string;
  contractAddress: string;
  ownerAddress: string;
  mintedAt: string; 
  metadataUri?: string | null;
  lastTransactionHash?: string | null;
  status: string; 
  message?: string;
}

export type InitialProductFormData = Omit<ProductFormData, 'productDetailsOrigin' | 'batteryRegulationOrigin'> & {
  productNameOrigin?: 'AI_EXTRACTED' | 'manual';
  productDescriptionOrigin?: 'AI_EXTRACTED' | 'manual';
  manufacturerOrigin?: 'AI_EXTRACTED' | 'manual';
  modelNumberOrigin?: 'AI_EXTRACTED' | 'manual';
  materialsOrigin?: 'AI_EXTRACTED' | 'manual';
  sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
  keyCompliancePointsOrigin?: 'AI_EXTRACTED' | 'manual';
  specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
  energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
  imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
  batteryRegulationOrigin?: any; 
  productDetailsOrigin?: {
    descriptionOrigin?: 'AI_EXTRACTED' | 'manual';
    materialsOrigin?: 'AI_EXTRACTED' | 'manual';
    sustainabilityClaimsOrigin?: 'AI_EXTRACTED' | 'manual';
    keyCompliancePointsOrigin?: 'AI_EXTRACTED' | 'manual';
    specificationsOrigin?: 'AI_EXTRACTED' | 'manual';
    energyLabelOrigin?: 'AI_EXTRACTED' | 'manual';
    imageUrlOrigin?: 'AI_EXTRACTED' | 'manual';
    esprSpecificsOrigin?: {
      durabilityInformationOrigin?: 'AI_EXTRACTED' | 'manual';
      repairabilityInformationOrigin?: 'AI_EXTRACTED' | 'manual';
      recycledContentSummaryOrigin?: 'AI_EXTRACTED' | 'manual';
      energyEfficiencySummaryOrigin?: 'AI_EXTRACTED' | 'manual';
      substanceOfConcernSummaryOrigin?: 'AI_EXTRACTED' | 'manual';
    };
    carbonFootprintOrigin?: { 
        valueOrigin?: 'AI_EXTRACTED' | 'manual';
        unitOrigin?: 'AI_EXTRACTED' | 'manual';
        calculationMethodOrigin?: 'AI_EXTRACTED' | 'manual';
        scope1EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        scope2EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        scope3EmissionsOrigin?: 'AI_EXTRACTED' | 'manual';
        dataSourceOrigin?: 'AI_EXTRACTED' | 'manual';
        vcIdOrigin?: 'AI_EXTRACTED' | 'manual';
    };
    digitalTwinOrigin?: { 
        uriOrigin?: 'AI_EXTRACTED' | 'manual';
        sensorDataEndpointOrigin?: 'AI_EXTRACTED' | 'manual';
        realTimeStatusOrigin?: 'AI_EXTRACTED' | 'manual';
        predictiveMaintenanceAlertsOrigin?: 'AI_EXTRACTED' | 'manual';
    };
  };
  blockchainIdentifiers?: DigitalProductPassport['blockchainIdentifiers'];
};


```
- workspace/src/types/dpp/index.ts:
```ts
export * from './Lifecycle';
export * from './Compliance';
export * from './Product';
export { USER_PRODUCTS_LOCAL_STORAGE_KEY, USER_SUPPLIERS_LOCAL_STORAGE_KEY, TRACKED_PRODUCTS_STORAGE_KEY } from './Product';
```
- workspace/src/types/productFormTypes.ts:
```ts

// --- File: src/types/productFormTypes.ts ---
// Description: Type definitions and Zod schemas for the product form.
"use client";

import { z } from "zod";
import type { EsprSpecifics, CarbonFootprintData, BatteryRegulationDetails, TextileInformation, ConstructionProductInformation, ScipNotificationDetails, EuCustomsDataDetails } from './dpp'; 

export const carbonFootprintSchema: z.ZodType<Partial<CarbonFootprintData>> = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  calculationMethod: z.string().optional(),
  scope1Emissions: z.coerce.number().nullable().optional(),
  scope2Emissions: z.coerce.number().nullable().optional(),
  scope3Emissions: z.coerce.number().nullable().optional(),
  dataSource: z.string().optional(),
  vcId: z.string().optional(),
});

export const recycledContentSchema = z.object({
  material: z.string().optional(),
  percentage: z.coerce.number().nullable().optional(),
  source: z.string().optional(), // Could be enum: z.enum(['Pre-consumer', 'Post-consumer', 'Mixed', 'Unknown']).optional(),
  vcId: z.string().optional(),
});

export const stateOfHealthSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  unit: z.string().optional(),
  measurementDate: z.string().optional(),
  measurementMethod: z.string().optional(),
  vcId: z.string().optional(),
});

export const batteryRegulationDetailsSchema: z.ZodType<Partial<BatteryRegulationDetails>> = z.object({
  status: z.string().optional(),
  batteryChemistry: z.string().optional(),
  batteryPassportId: z.string().optional(),
  ratedCapacityAh: z.coerce.number().nullable().optional(),
  nominalVoltage: z.coerce.number().nullable().optional(),
  expectedLifetimeCycles: z.coerce.number().nullable().optional(),
  manufacturingDate: z.string().optional(),
  manufacturerName: z.string().optional(),
  carbonFootprint: carbonFootprintSchema.optional(),
  recycledContent: z.array(recycledContentSchema).optional(),
  stateOfHealth: stateOfHealthSchema.optional(),
  recyclingEfficiencyRate: z.coerce.number().nullable().optional(),
  materialRecoveryRates: z.object({
    cobalt: z.coerce.number().nullable().optional(),
    lead: z.coerce.number().nullable().optional(),
    lithium: z.coerce.number().nullable().optional(),
    nickel: z.coerce.number().nullable().optional(),
  }).optional(),
  dismantlingInformationUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  safetyInformationUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  vcId: z.string().optional(),
});

export const scipNotificationFormSchema: z.ZodType<Partial<ScipNotificationDetails>> = z.object({
  status: z.string().optional(),
  notificationId: z.string().optional(),
  svhcListVersion: z.string().optional(),
  submittingLegalEntity: z.string().optional(),
  articleName: z.string().optional(),
  primaryArticleId: z.string().optional(),
  safeUseInstructionsLink: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
});

export const customsValuationSchema = z.object({
  value: z.coerce.number().nullable().optional(),
  currency: z.string().optional(),
});

export const euCustomsDataFormSchema: z.ZodType<Partial<EuCustomsDataDetails>> = z.object({
  status: z.string().optional(),
  declarationId: z.string().optional(),
  hsCode: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  netWeightKg: z.coerce.number().nullable().optional(),
  grossWeightKg: z.coerce.number().nullable().optional(),
  customsValuation: customsValuationSchema.optional(),
  cbamGoodsIdentifier: z.string().optional(),
});

export const fiberCompositionEntrySchema = z.object({
  fiberName: z.string().min(1, "Fiber name is required."),
  percentage: z.coerce.number().min(0,"Percentage cannot be negative").max(100, "Percentage cannot exceed 100").nullable(),
});

export const textileInformationSchema: z.ZodType<Partial<TextileInformation>> = z.object({
  fiberComposition: z.array(fiberCompositionEntrySchema).optional(),
  countryOfOriginLabeling: z.string().optional(),
  careInstructionsUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  isSecondHand: z.boolean().optional(),
});

export const essentialCharacteristicSchema = z.object({
  characteristicName: z.string().min(1, "Characteristic name is required."),
  value: z.string().min(1, "Value is required."),
  unit: z.string().optional(),
  testMethod: z.string().optional(),
});

export const constructionProductInformationSchema: z.ZodType<Partial<ConstructionProductInformation>> = z.object({
  declarationOfPerformanceId: z.string().optional(),
  ceMarkingDetailsUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  intendedUseDescription: z.string().optional(),
  essentialCharacteristics: z.array(essentialCharacteristicSchema).optional(),
});

export const esprSpecificsSchema: z.ZodType<Partial<EsprSpecifics>> = z.object({
  durabilityInformation: z.string().optional(),
  repairabilityInformation: z.string().optional(),
  recycledContentSummary: z.string().optional(),
  energyEfficiencySummary: z.string().optional(),
  substanceOfConcernSummary: z.string().optional(),
});

export const digitalTwinSchema: z.ZodType<Partial<DigitalTwinData>> = z.object({
  uri: z.string().url("Must be a valid URI or empty").or(z.literal("")).optional(),
  sensorDataEndpoint: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  realTimeStatus: z.string().optional(),
  predictiveMaintenanceAlerts: z.string().optional(),
});

export const productDetailsSchema = z.object({
    description: z.string().optional(),
    imageUrl: z.string().url("Must be a valid URL or Data URI, or empty").or(z.literal("")).optional(),
    imageHint: z.string().max(60, "Hint should be concise, max 2-3 keywords or 60 chars.").optional(),
    materials: z.string().optional(),
    sustainabilityClaims: z.string().optional(),
    energyLabel: z.string().optional(),
    specifications: z.string().optional(),
    customAttributesJsonString: z.string().optional(),
    keyCompliancePoints: z.string().optional(),
    esprSpecifics: esprSpecificsSchema.optional(),
    conflictMineralsReportUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
    fairTradeCertificationId: z.string().optional(),
    ethicalSourcingPolicyUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
    carbonFootprint: carbonFootprintSchema.optional(),
    digitalTwin: digitalTwinSchema.optional(),
});

export const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters.").optional(),
  gtin: z.string().optional().describe("Global Trade Item Number"),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  sku: z.string().optional(),
  nfcTagId: z.string().optional(),
  rfidTagId: z.string().optional(),
  productCategory: z.string().optional().describe("Category of the product, e.g., Electronics, Apparel."),
  
  productDetails: productDetailsSchema.optional(),

  batteryRegulation: batteryRegulationDetailsSchema.optional(),
  
  compliance: z.object({
    eprel: z.object({
        id: z.string().optional(),
        status: z.string().optional(),
        url: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
        lastChecked: z.string().optional(), 
    }).optional(),
    esprConformity: z.object({
        assessmentId: z.string().optional(),
        status: z.string().optional(), 
        assessmentDate: z.string().optional(), 
        vcId: z.string().optional(),
    }).optional(),
    scipNotification: scipNotificationFormSchema.optional(),
    euCustomsData: euCustomsDataFormSchema.optional(),
    battery_regulation: batteryRegulationDetailsSchema.optional(), 
  }).optional(),
  
  textileInformation: textileInformationSchema.optional(), 
  constructionProductInformation: constructionProductInformationSchema.optional(), 
  onChainStatus: z.string().optional(), 
  onChainLifecycleStage: z.string().optional(), 

  // AI Origin tracking fields (these are for form-level, nested origins are handled separately)
  productNameOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  manufacturerOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  modelNumberOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
  
  productDetailsOrigin: z.object({
    descriptionOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    materialsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    sustainabilityClaimsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    keyCompliancePointsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(), 
    specificationsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    energyLabelOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    imageUrlOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    esprSpecificsOrigin: z.object({
      durabilityInformationOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      repairabilityInformationOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      recycledContentSummaryOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      energyEfficiencySummaryOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
      substanceOfConcernSummaryOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    }).optional(),
    carbonFootprintOrigin: z.object({ 
        valueOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        unitOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        calculationMethodOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        scope1EmissionsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        scope2EmissionsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        scope3EmissionsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        dataSourceOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        vcIdOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    }).optional(),
    digitalTwinOrigin: z.object({
        uriOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        sensorDataEndpointOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        realTimeStatusOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
        predictiveMaintenanceAlertsOrigin: z.enum(['AI_EXTRACTED', 'manual']).optional(),
    }).optional(),
  }).optional(),
  
  batteryRegulationOrigin: z.any().optional(), // Keep as any for deeply nested origin marking flexibility
});

export type ProductFormData = z.infer<typeof formSchema>;

```
- workspace/src/utils/aiFormHelpers.tsx:
```tsx

// --- File: aiFormHelpers.tsx ---
// Description: Utility functions for handling AI-powered suggestions in product forms.


import React from "react"; 
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/types/productFormTypes"; 
import { generateProductName } from "@/ai/flows/generate-product-name-flow";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { suggestSustainabilityClaims } from "@/ai/flows/suggest-sustainability-claims-flow";
import { suggestKeyCompliancePoints } from "@/ai/flows/suggest-key-compliance-points"; 
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import { generateProductSpecifications } from "@/ai/flows/generate-product-specifications-flow";
import { generateCustomAttributes } from "@/ai/flows/generate-custom-attributes-flow"; 
import { suggestCbamIdentifier, type SuggestCbamIdentifierOutput } from "@/ai/flows/suggest-cbam-identifier-flow"; 
import type { CustomAttribute } from "@/types/dpp"; 
import type { ToastInput } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

type ToastFn = (input: ToastInput) => void;

interface AiHandlerOptions<T> {
  aiCall: () => Promise<T>;
  toast: ToastFn;
  setLoadingState: (loading: boolean) => void;
  successToast?: ToastInput | ((result: T) => ToastInput);
  errorTitle: string;
}

async function withAiHandling<T>(options: AiHandlerOptions<T>): Promise<T | null> {
  const { aiCall, toast, setLoadingState, successToast, errorTitle } = options;
  setLoadingState(true);
  try {
    const result = await aiCall();
    if (successToast) {
      const toastInput =
        typeof successToast === "function" ? successToast(result) : successToast;
      toast(toastInput);
    }
    return result;
  } catch (error) {
    console.error(`${errorTitle}:`, error);
    const iconElement = <AlertTriangle className="text-white" />;
    toast({
      title: errorTitle,
      description: error instanceof Error
        ? error.message
        : "An unknown error occurred.",
      variant: "destructive",
      action: iconElement,
    });
    return null;
  } finally {
    setLoadingState(false);
  }
}

export async function handleSuggestNameAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productDetails, productCategory } = form.getValues();
  if (!productDetails?.description && !productCategory) {
    toast({ title: "Input Required", description: "Please provide a product description or category to suggest a name.", variant: "destructive" });
    setLoadingState(false); 
    return null;
  }
  const result = await withAiHandling({
    aiCall: () => generateProductName({
      productDescription: productDetails?.description || "",
      productCategory: productCategory || undefined,
    }),
    toast,
    setLoadingState,
    successToast: (res) => ({
      title: "Product Name Suggested!",
      description: `AI suggested: \"${res.productName}\"`,
      variant: "default",
    }),
    errorTitle: "Error Suggesting Name",
  });
  return result ? result.productName : null;
}

export async function handleSuggestDescriptionAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productName, productCategory, productDetails } = form.getValues();
  if (!productName) {
    toast({ title: "Product Name Required", description: "Please provide a product name to suggest a description.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductDescription({
        productName: productName,
        productCategory: productCategory || undefined,
        keyFeatures: productDetails?.materials || undefined,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Product Description Suggested!",
      description: "AI has generated a product description.",
      variant: "default",
    },
    errorTitle: "Error Suggesting Description",
  });
  return result ? result.productDescription : null;
}

export async function handleSuggestClaimsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  const formData = form.getValues();
  if (!formData.productCategory && !formData.productName && !formData.productDetails?.materials) {
    toast({ title: "Input Required", description: "Please provide product category, name, or materials to suggest claims.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      suggestSustainabilityClaims({
        productCategory: formData.productCategory || "General Product",
        productName: formData.productName,
        productDescription: formData.productDetails?.description,
        materials: formData.productDetails?.materials,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.claims.length === 0
        ? {
            title: "No specific claims suggested.",
            description:
              "Try adding more product details like category or materials.",
          }
        : {
            title: "Sustainability Claims Suggested!",
            description: `${res.claims.length} claims suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Claims",
  });
  return result ? result.claims : null;
}

export async function handleSuggestKeyCompliancePointsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string[] | null> {
  const { productName, productCategory, compliance } = form.getValues();
  if (!productCategory) {
    toast({ title: "Category Required", description: "Please provide a product category to suggest compliance points.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  
  const applicableRegs: string[] = [];
  if (compliance?.battery_regulation?.status && compliance.battery_regulation.status !== 'not_applicable') {
    applicableRegs.push("EU Battery Regulation");
  }
  if (compliance?.esprConformity?.status && compliance.esprConformity.status !== 'not_applicable') { 
    applicableRegs.push("EU ESPR");
  }
  if (compliance?.scipNotification?.status && compliance.scipNotification.status !== 'N/A' && compliance.scipNotification.status !== 'Not Required') {
    applicableRegs.push("SCIP Database");
  }
  
  const result = await withAiHandling({
    aiCall: () =>
      suggestKeyCompliancePoints({
        productName: productName || undefined,
        productCategory: productCategory,
        regulationsApplicable: applicableRegs.join(', ') || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.compliancePoints.length === 0
        ? {
            title: "No specific compliance points suggested.",
            description:
              "Ensure product category and relevant regulations are selected.",
          }
        : {
            title: "Key Compliance Points Suggested!",
            description: `${res.compliancePoints.length} points suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Compliance Points",
  });
  return result ? result.compliancePoints : null;
}


export async function handleGenerateImageAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const formData = form.getValues();
  if (!formData.productName) {
    toast({ title: "Product Name Required", description: "Please enter a product name before generating an image.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductImage({
        productName: formData.productName,
        productCategory: formData.productCategory,
        imageHint: formData.productDetails?.imageHint,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Image Generated Successfully",
      description: "The product image has been generated.",
    },
    errorTitle: "Error Generating Image",
  });
  return result ? result.imageUrl : null;
}

export async function handleSuggestSpecificationsAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<string | null> {
  const { productName, productDetails, productCategory } = form.getValues();
  if (!productName && !productDetails?.description && !productCategory) {
    toast({ title: "Input Required", description: "Please provide product name, description, or category to suggest specifications.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      generateProductSpecifications({
        productName: productName || "",
        productDescription: productDetails?.description || undefined,
        productCategory: productCategory || undefined,
      }),
    toast,
    setLoadingState,
    successToast: {
      title: "Specifications Suggested!",
      description: `AI suggested specifications for "${productName || 'the product'}".`,
      variant: "default",
    },
    errorTitle: "Error Suggesting Specifications",
  });
  return result ? result.specificationsJsonString : null;
}

export async function handleSuggestCustomAttributesAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<CustomAttribute[] | null> {
  const { productName, productCategory, productDetails } = form.getValues();

  if (!productName && !productCategory && !productDetails?.description) {
    toast({
      title: "Input Required",
      description:
        "Please provide product name, category, or description to suggest custom attributes.",
      variant: "destructive",
    });
    setLoadingState(false);
    return null;
  }

  const result = await withAiHandling({
    aiCall: () =>
      generateCustomAttributes({
        productName: productName || "",
        productCategory: productCategory || undefined,
        productDescription: productDetails?.description || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) =>
      res.customAttributes.length === 0
        ? {
            title: "No specific attributes suggested.",
            description: "Try adding more product details.",
          }
        : {
            title: "Custom Attributes Suggested!",
            description: `${res.customAttributes.length} custom attribute(s) suggested by AI.`,
            variant: "default",
          },
    errorTitle: "Error Suggesting Attributes",
  });

  return result ? result.customAttributes : null;
}

export async function handleSuggestCbamIdentifierAI(
  form: UseFormReturn<ProductFormData>,
  toast: ToastFn,
  setLoadingState: (loading: boolean) => void
): Promise<SuggestCbamIdentifierOutput | null> {
  const { productCategory, productDetails } = form.getValues();
  if (!productCategory) {
    toast({ title: "Category Required", description: "Please provide a product category to suggest a CBAM identifier.", variant: "destructive" });
    setLoadingState(false);
    return null;
  }
  const result = await withAiHandling({
    aiCall: () =>
      suggestCbamIdentifier({
        productCategory: productCategory,
        productDescription: productDetails?.description || undefined,
      }),
    toast,
    setLoadingState,
    successToast: (res) => ({
      title: "CBAM Identifier Suggested!",
      description: `AI suggested: "${res.suggestedIdentifier}". Reasoning: ${res.reasoning}`,
      variant: "default",
      duration: 7000,
    }),
    errorTitle: "Error Suggesting CBAM ID",
  });
  return result;
}

```

The CBAM Goods Identifier suggestion AI flow and its integration into the product form are now complete.

I've:
1.  Created `src/ai/flows/suggest-cbam-identifier-flow.ts` with the necessary Genkit logic.
2.  Registered this new flow in `src/ai/dev.ts`.
3.  Added `handleSuggestCbamIdentifierAI` to `src/utils/aiFormHelpers.tsx`.
4.  Updated `src/components/products/form/EuCustomsDataFormSection.tsx` to include:
    *   State for managing the AI suggestion loading state and reasoning display.
    *   A "Suggest CBAM ID with AI" button.
    *   An `onClick` handler that calls `handleSuggestCbamIdentifierAI` and updates the form field with the suggested ID and displays the reasoning.

Users can now get AI assistance in determining a conceptual CBAM Goods Identifier for their products.