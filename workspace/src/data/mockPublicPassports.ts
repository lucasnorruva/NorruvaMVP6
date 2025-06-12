
import type { PublicProductInfo } from '@/types/dpp';

export const MOCK_PUBLIC_PASSPORTS: Record<string, PublicProductInfo> = {
  "PROD001": {
    passportId: "PROD001",
    productName: "EcoFriendly Refrigerator X2000",
    tagline: "Cool, Efficient, Sustainable.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "refrigerator kitchen",
    productStory: "The EcoFriendly Refrigerator X2000 is designed for the modern, environmentally conscious household. It features our latest FrostFree technology, an A+++ energy rating, and is built with over 70% recycled materials. Its smart features help optimize cooling and reduce energy consumption, contributing to a greener planet one kitchen at a time. This DPP provides full transparency into its lifecycle and sustainability credentials.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "A+++ Energy Rating" },
      { iconName: "Recycle", text: "Made with 70% Recycled Steel" },
      { iconName: "Leaf", text: "Low GWP Refrigerant Used" },
      { iconName: "Award", text: "Certified for 15-year Durability" }
    ],
    manufacturerName: "GreenTech Appliances",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=GreenTech",
    learnMoreLink: "#",
    complianceSummary: "Fully compliant with EU Ecodesign and Energy Labelling directives. EPREL registered. EBSI verification completed for key claims.",
    category: "Appliances",
    modelNumber: "X500-ECO",
    sku: "SKU-X500",
    nfcTagId: "NFC123456",
    rfidTagId: "RFID654321",
    anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef",
    blockchainPlatform: "MockChain (Ethereum L1)",
    contractAddress: "0xMOCK_CONTRACT_FOR_DPP001", // Added
    tokenId: "MOCK_TOKENID_FOR_DPP001_mock1",   // Added
    ebsiStatus: 'verified',
    ebsiVerificationId: "EBSI-VC-XYZ-00123",
    lifecycleHighlights: [
      { stage: "Manufacturing", date: "Jan 2024", details: "Produced in our green-certified facility in Germany.", isEbsiVerified: true, iconName: "Factory" },
      { stage: "Shipped", date: "Feb 2024", details: "Transported via low-emission logistics partners to EU distribution centers.", isEbsiVerified: false, iconName: "Truck" },
      { stage: "Sold", date: "Mar 2024", details: "First retail sale recorded in Paris, France.", isEbsiVerified: false, iconName: "ShoppingCart" },
      { stage: "End-of-Life Path", date: "Est. 2039", details: "Designed for 95% recyclability. Refer to local WEEE collection.", isEbsiVerified: false, iconName: "Recycle" }
    ],
    certifications: [
      { name: "Energy Star", authority: "EPA", isVerified: true, standard: "Energy Star Program Requirements for Refrigerators v6.0", transactionHash: "0xcertAnchor1" },
      { name: "ISO 14001", authority: "TUV Rheinland", expiryDate: "2026-11-14", isVerified: true, vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015" }
    ],
    documents: [
      { name: "User Manual v1.2", url: "#manual_v1.2.pdf", type: "User Manual", addedTimestamp: "2024-01-15T00:00:00Z" },
      { name: "Warranty Card", url: "#warranty.pdf", type: "Warranty", addedTimestamp: "2024-01-15T00:00:00Z" },
    ],
    customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology"},
        {key: "Warranty Period", value: "5 Years"},
        {key: "Country of Origin", value: "Germany"},
    ],
    authenticationVcId: "vc_auth_DPP001_mock123",
    ownershipNftLink: {
        registryUrl: "https://mock-nft-market.example/token/0xNFTContractForDPP001/1",
        contractAddress: "0xNFTContractForDPP001",
        tokenId: "1",
        chainName: "MockEthereum",
    },
  },
  "PROD002": {
    passportId: "PROD002",
    productName: "Smart LED Bulb (4-Pack)",
    tagline: "Illuminate Your World, Sustainably.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "led bulbs packaging",
    productStory: "Brighten your home responsibly with our Smart LED Bulb pack. These energy-efficient bulbs offer customizable lighting and connect to smart home systems. Designed for a long lifespan, reducing waste.",
    sustainabilityHighlights: [
      { iconName: "Zap", text: "Uses 85% less energy than incandescent bulbs" },
      { iconName: "Recycle", text: "Recyclable packaging materials" },
      { iconName: "Leaf", text: "Mercury-free design" },
    ],
    manufacturerName: "BrightSpark Electronics",
    manufacturerWebsite: "#",
    brandLogoUrl: "https://placehold.co/150x50.png?text=BrightSpark",
    learnMoreLink: "#",
    complianceSummary: "Complies with EU energy efficiency and hazardous substance directives. EBSI verification pending.",
    category: "Electronics",
    modelNumber: "BS-LED-S04",
    // This product is NOT anchored, so no anchorTransactionHash, contractAddress, or tokenId
    blockchainPlatform: "MockChain (Polygon Layer 2)", // Platform can still be specified if known for future use
    ebsiStatus: 'pending',
    lifecycleHighlights: [
      { stage: "Manufactured", date: "2024-03-01", details: "Batch #LEDB456 produced in Shenzhen SmartPlant facility.", isEbsiVerified: true, iconName: "Factory" },
      { stage: "Imported to EU", date: "2024-03-15", details: "Cleared customs at Rotterdam Port, Netherlands. Ready for EU distribution.", isEbsiVerified: false, iconName: "Anchor" },
      { stage: "Firmware Update v1.2", date: "2024-08-01", details: "Over-the-air firmware update v1.2 deployed, improving energy efficiency algorithm and security patches.", isEbsiVerified: true, iconName: "UploadCloud" },
      { stage: "Product Registration", date: "2024-03-20", details: "Registered in EPREL database (ID: EPREL_PENDING_002), awaiting final data submission.", isEbsiVerified: false, iconName: "ClipboardCheck" },
    ],
    certifications: [
      { name: "RoHS Compliance", authority: "Self-Certified", isVerified: true },
      { name: "CE Marking", authority: "Self-Certified", isVerified: true },
      { name: "Bluetooth SIG Qualification", authority: "Bluetooth SIG", expiryDate: "2028-01-01", link:"#", isVerified: true },
    ],
    documents: [],
    customAttributes: [
        {key: "Smart Home Compatibility", value: "Google Home, Amazon Alexa, Apple HomeKit"},
        {key: "Light Color Options", value: "RGBW (16 million colors + Tunable White)"},
    ],
    authenticationVcId: "vc_auth_DPP002_mock456",
  },
  "USER_PROD123456": {
    passportId: "USER_PROD123456",
    productName: "Custom Craft Wooden Chair",
    tagline: "Artisan Quality, Sustainable Design.",
    imageUrl: "https://placehold.co/800x600.png",
    imageHint: "wooden chair artisan",
    productStory: "This chair is handcrafted by local artisans using sustainably sourced oak. Its timeless design and durable construction ensure it will be a cherished piece for generations. The natural oil finish is eco-friendly and enhances the wood's natural beauty.",
    sustainabilityHighlights: [
      { iconName: "Leaf", text: "Sustainably Sourced Oak (FSC Certified)" },
      { iconName: "Users", text: "Handcrafted Locally" },
      { iconName: "ShieldCheck", text: "Durable Design for Longevity" },
      { iconName: "Paintbrush", text: "Low VOC Natural Oil Finish" }
    ],
    manufacturerName: "Artisan Woodworks",
    complianceSummary: "TSCA Title VI Compliant (Formaldehyde). Currently undergoing additional certifications.",
    category: "Furniture",
    modelNumber: "CWC-001",
    ebsiStatus: 'not_verified',
    anchorTransactionHash: "0xuserProductAnchorHash123", // Example for user product
    blockchainPlatform: "UserMockNet",
    contractAddress: "0xUserProductContract",
    tokenId: "UP_TOKEN_123",
    certifications: [], 
    documents: [],
    customAttributes: [
        {key: "Wood Type", value: "Oak"},
        {key: "Finish", value: "Natural Oil"},
        {key: "Artisan Name", value: "John Craft"},
        {key: "Lead Time", value: "4-6 Weeks"}
    ],
    authenticationVcId: "vc_auth_USER_PROD123456_mock789",
    ownershipNftLink: {
        contractAddress: "0xUserProdNFTContract",
        tokenId: "101",
        chainName: "MockUserChain",
    },
  }
};
