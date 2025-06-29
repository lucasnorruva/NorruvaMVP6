// --- File: src/utils/productDetailUtils.ts ---
// Description: Utilities for fetching and preparing product details for display.

import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import { MOCK_DPPS } from "@/data";
import type {
  DigitalProductPassport,
  StoredUserProduct,
  SimpleProductDetail,
  ComplianceDetailItem,
  EbsiVerificationDetails,
  CustomAttribute,
  SimpleCertification,
  Certification,
  ScipNotificationDetails,
  EuCustomsDataDetails,
  BatteryRegulationDetails,
  EsprSpecifics,
  DigitalTwinData,
} from "@/types/dpp";
import { getOverallComplianceDetails } from "@/utils/dppDisplayUtils";

// Helper function to map DigitalProductPassport to SimpleProductDetail
function mapDppToSimpleProductDetail(
  dpp: DigitalProductPassport,
): SimpleProductDetail {
  const mapStatus = (
    status: DigitalProductPassport["metadata"]["status"],
  ): SimpleProductDetail["status"] => {
    switch (status) {
      case "published":
        return "Active";
      case "archived":
        return "Archived";
      case "pending_review":
        return "Pending";
      case "draft":
        return "Draft";
      case "revoked":
        return "Archived"; // Consider revoked as archived for simple view
      case "flagged":
        return "Flagged"; // Added Flagged status
      default:
        return "Draft";
    }
  };

  const specificRegulations: ComplianceDetailItem[] = [];

  if (dpp.compliance.eu_espr) {
    specificRegulations.push({
      regulationName: "EU ESPR",
      status: dpp.compliance.eu_espr.status as ComplianceDetailItem["status"],
      detailsUrl: dpp.compliance.eu_espr.reportUrl,
      verificationId: dpp.compliance.eu_espr.vcId,
      lastChecked: dpp.metadata.last_updated,
    });
  }
  if (dpp.compliance.esprConformity) {
    specificRegulations.push({
      regulationName: "ESPR Conformity Assessment",
      status: dpp.compliance.esprConformity
        .status as ComplianceDetailItem["status"],
      verificationId:
        dpp.compliance.esprConformity.assessmentId ||
        dpp.compliance.esprConformity.vcId,
      lastChecked:
        dpp.compliance.esprConformity.assessmentDate ||
        dpp.metadata.last_updated,
    });
  }
  if (dpp.compliance.us_scope3) {
    specificRegulations.push({
      regulationName: "US Scope 3 Emissions",
      status: dpp.compliance.us_scope3.status as ComplianceDetailItem["status"],
      detailsUrl: dpp.compliance.us_scope3.reportUrl,
      verificationId: dpp.compliance.us_scope3.vcId,
      lastChecked: dpp.metadata.last_updated,
    });
  }

  const complianceOverallStatusDetails = getOverallComplianceDetails(dpp);

  const customAttributes = dpp.productDetails?.customAttributes || [];
  const mappedCertifications: SimpleCertification[] =
    dpp.certifications?.map((cert) => ({
      id: cert.id,
      name: cert.name,
      authority: cert.issuer,
      standard: cert.standard,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      documentUrl: cert.documentUrl,
      isVerified: !!(cert.vcId || cert.transactionHash),
      vcId: cert.vcId,
      transactionHash: cert.transactionHash,
    })) || [];

  return {
    id: dpp.id,
    productName: dpp.productName,
    category: dpp.category,
    status: mapStatus(dpp.metadata.status),
    manufacturer: dpp.manufacturer?.name,
    gtin: dpp.gtin,
    modelNumber: dpp.modelNumber,
    sku: dpp.sku,
    nfcTagId: dpp.nfcTagId,
    rfidTagId: dpp.rfidTagId,
    description: dpp.productDetails?.description,
    imageUrl: dpp.productDetails?.imageUrl,
    imageHint: dpp.productDetails?.imageHint,
    keySustainabilityPoints:
      dpp.productDetails?.sustainabilityClaims
        ?.map((c) => c.claim)
        .filter(Boolean) || [],
    keyCompliancePoints: dpp.productDetails?.keyCompliancePoints,
    specifications: dpp.productDetails?.specifications,
    customAttributes: customAttributes,
    productDetails: {
      esprSpecifics: dpp.productDetails?.esprSpecifics,
      carbonFootprint: dpp.productDetails?.carbonFootprint,
      digitalTwin: dpp.productDetails?.digitalTwin, // Include digitalTwin
      conflictMineralsReportUrl: dpp.productDetails?.conflictMineralsReportUrl,
      fairTradeCertificationId: dpp.productDetails?.fairTradeCertificationId,
      ethicalSourcingPolicyUrl: dpp.productDetails?.ethicalSourcingPolicyUrl,
    },
    complianceSummary: {
      overallStatus: complianceOverallStatusDetails.text,
      eprel: dpp.compliance.eprel
        ? {
            id: dpp.compliance.eprel.id,
            status: dpp.compliance.eprel.status,
            url: dpp.compliance.eprel.url,
            lastChecked: dpp.compliance.eprel.lastChecked,
          }
        : { status: "N/A", lastChecked: new Date().toISOString() },
      ebsi: dpp.ebsiVerification
        ? {
            status: dpp.ebsiVerification.status,
            verificationId: dpp.ebsiVerification.verificationId,
            lastChecked: dpp.ebsiVerification.lastChecked,
          }
        : { status: "N/A", lastChecked: new Date().toISOString() },
      scip: dpp.compliance.scipNotification,
      euCustomsData: dpp.compliance.euCustomsData,
      battery: dpp.compliance.battery_regulation,
      specificRegulations: specificRegulations,
    },
    lifecycleEvents:
      dpp.lifecycleEvents?.map((event) => ({
        id: event.id,
        eventName: event.type,
        date: event.timestamp,
        location: event.location,
        notes: event.data
          ? `Data: ${JSON.stringify(event.data)}`
          : event.responsibleParty
            ? `Responsible: ${event.responsibleParty}`
            : undefined,
        status: event.transactionHash
          ? "Completed"
          : event.type.toLowerCase().includes("schedul") ||
              event.type.toLowerCase().includes("upcoming")
            ? "Upcoming"
            : "In Progress",
        iconName: event.type.toLowerCase().includes("manufactur")
          ? "Factory"
          : event.type.toLowerCase().includes("ship")
            ? "Truck"
            : event.type.toLowerCase().includes("quality") ||
                event.type.toLowerCase().includes("certif")
              ? "ShieldCheck"
              : event.type.toLowerCase().includes("sale") ||
                  event.type.toLowerCase().includes("sold")
                ? "ShoppingCart"
                : "Info",
      })) || [],
    materialsUsed: dpp.productDetails?.materials?.map((m) => ({
      name: m.name,
      percentage: m.percentage,
      source: m.origin,
      isRecycled: m.isRecycled,
    })),
    energyLabelRating: dpp.productDetails?.energyLabel,
    repairability: dpp.productDetails?.repairabilityScore
      ? {
          score: dpp.productDetails.repairabilityScore.value,
          scale: dpp.productDetails.repairabilityScore.scale,
          detailsUrl: dpp.productDetails.repairabilityScore.reportUrl,
        }
      : undefined,
    recyclabilityInfo: dpp.productDetails?.recyclabilityInformation
      ? {
          percentage:
            dpp.productDetails.recyclabilityInformation
              .recycledContentPercentage,
          instructionsUrl:
            dpp.productDetails.recyclabilityInformation.instructionsUrl,
        }
      : undefined,
    supplyChainLinks: dpp.supplyChainLinks || [],
    certifications: mappedCertifications,
    authenticationVcId: dpp.authenticationVcId,
    ownershipNftLink: dpp.ownershipNftLink,
    blockchainPlatform: dpp.blockchainIdentifiers?.platform,
    contractAddress: dpp.blockchainIdentifiers?.contractAddress,
    tokenId: dpp.blockchainIdentifiers?.tokenId,
    anchorTransactionHash: dpp.blockchainIdentifiers?.anchorTransactionHash,
    ebsiStatus: dpp.ebsiVerification?.status,
    ebsiVerificationId: dpp.ebsiVerification?.verificationId,
    onChainStatus: dpp.metadata.onChainStatus,
    onChainLifecycleStage: dpp.metadata.onChainLifecycleStage,
    textileInformation: dpp.textileInformation,
    constructionProductInformation: dpp.constructionProductInformation,
    batteryRegulation: dpp.compliance.battery_regulation,
    lastUpdated: dpp.metadata.last_updated,
    conflictMineralsReportUrl: dpp.productDetails?.conflictMineralsReportUrl,
    fairTradeCertificationId: dpp.productDetails?.fairTradeCertificationId,
    ethicalSourcingPolicyUrl: dpp.productDetails?.ethicalSourcingPolicyUrl,
  };
}

export async function fetchProductDetails(
  productId: string,
): Promise<SimpleProductDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 0));

  const storedProductsString =
    typeof window !== "undefined"
      ? localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY)
      : null;
  if (storedProductsString) {
    const userProducts: StoredUserProduct[] = JSON.parse(storedProductsString);
    const userProductData = userProducts.find((p) => p.id === productId);
    if (userProductData) {
      let parsedCustomAttributes: CustomAttribute[] = [];
      if (userProductData.productDetails?.customAttributesJsonString) {
        try {
          const parsed = JSON.parse(
            userProductData.productDetails.customAttributesJsonString,
          );
          if (Array.isArray(parsed)) parsedCustomAttributes = parsed;
        } catch (e) {
          console.error(
            "Failed to parse customAttributesJsonString from localStorage for USER_PROD:",
            e,
          );
        }
      }
      const certificationsForUserProd: Certification[] =
        userProductData.certifications?.map((sc) => ({
          id:
            sc.id ||
            `cert_user_${sc.name.replace(/\s+/g, "_")}_${Math.random().toString(36).slice(2, 7)}`,
          name: sc.name,
          issuer: sc.authority,
          issueDate: sc.issueDate,
          expiryDate: sc.expiryDate,
          documentUrl: sc.documentUrl,
          standard: sc.standard,
          vcId: sc.vcId,
          transactionHash: sc.transactionHash,
        })) || [];

      const complianceSummaryFromStorage =
        userProductData.complianceSummary || {
          overallStatus:
            "N/A" as SimpleProductDetail["complianceSummary"]["overallStatus"],
        };
      const ebsiFromStorage = complianceSummaryFromStorage.ebsi;

      const dppEquivalent: DigitalProductPassport = {
        id: userProductData.id,
        productName: userProductData.productName || "N/A",
        category: userProductData.productCategory || "N/A",
        manufacturer: userProductData.manufacturer
          ? { name: userProductData.manufacturer }
          : undefined,
        modelNumber: userProductData.modelNumber,
        sku: userProductData.sku,
        nfcTagId: userProductData.nfcTagId,
        rfidTagId: userProductData.rfidTagId,
        gtin: userProductData.gtin,
        metadata: {
          status:
            (userProductData.status?.toLowerCase() as DigitalProductPassport["metadata"]["status"]) ||
            "draft",
          last_updated: userProductData.lastUpdated || new Date().toISOString(),
          created_at:
            userProductData.metadata?.created_at ||
            userProductData.lastUpdated ||
            new Date().toISOString(),
          onChainStatus: userProductData.metadata?.onChainStatus,
          onChainLifecycleStage:
            userProductData.metadata?.onChainLifecycleStage,
          dppStandardVersion: userProductData.metadata?.dppStandardVersion,
        },
        productDetails: {
          description: userProductData.productDetails?.description,
          imageUrl: userProductData.productDetails?.imageUrl,
          imageHint: userProductData.productDetails?.imageHint,
          sustainabilityClaims:
            userProductData.productDetails?.sustainabilityClaims
              ?.split("\n")
              .map((s) => ({ claim: s.trim() }))
              .filter((c) => c.claim) || [],
          keyCompliancePoints:
            userProductData.productDetails?.keyCompliancePoints,
          materials:
            userProductData.productDetails?.materials
              ?.split(",")
              .map((m) => ({ name: m.trim() })) || [],
          energyLabel: userProductData.productDetails?.energyLabel,
          specifications: userProductData.productDetails?.specifications,
          customAttributes: parsedCustomAttributes,
          conflictMineralsReportUrl:
            userProductData.productDetails?.conflictMineralsReportUrl,
          fairTradeCertificationId:
            userProductData.productDetails?.fairTradeCertificationId,
          ethicalSourcingPolicyUrl:
            userProductData.productDetails?.ethicalSourcingPolicyUrl,
          esprSpecifics: userProductData.productDetails?.esprSpecifics,
          carbonFootprint: userProductData.productDetails?.carbonFootprint,
          digitalTwin: userProductData.productDetails?.digitalTwin, // Added for Task 25
        },
        compliance: {
          eprel:
            userProductData.complianceData?.eprel ||
            complianceSummaryFromStorage.eprel,
          scipNotification:
            userProductData.complianceData?.scipNotification ||
            complianceSummaryFromStorage.scip,
          euCustomsData:
            userProductData.complianceData?.euCustomsData ||
            complianceSummaryFromStorage.euCustomsData,
          battery_regulation:
            userProductData.complianceData?.battery_regulation ||
            userProductData.batteryRegulation ||
            complianceSummaryFromStorage.battery,
          esprConformity: userProductData.complianceData?.esprConformity,
        },
        ebsiVerification: ebsiFromStorage
          ? {
              status:
                ebsiFromStorage.status as EbsiVerificationDetails["status"],
              verificationId: ebsiFromStorage.verificationId,
              lastChecked: ebsiFromStorage.lastChecked,
            }
          : undefined,
        lifecycleEvents: userProductData.lifecycleEvents?.map((e) => ({
          id: e.id,
          type: e.eventName,
          timestamp: e.date,
          location: e.location,
          data: e.notes ? { notes: e.notes } : undefined,
        })),
        certifications: certificationsForUserProd,
        supplyChainLinks: userProductData.supplyChainLinks || [],
        authenticationVcId: userProductData.authenticationVcId,
        ownershipNftLink: userProductData.ownershipNftLink,
        blockchainIdentifiers: userProductData.blockchainIdentifiers,
        textileInformation: userProductData.textileInformation,
        constructionProductInformation:
          userProductData.constructionProductInformation,
      };
      return mapDppToSimpleProductDetail(dppEquivalent);
    }
  }

  let canonicalLookupId = productId;
  if (productId.startsWith("PROD") && !productId.startsWith("USER_PROD")) {
    canonicalLookupId = productId.replace("PROD", "DPP");
  }

  const foundMockDpp = MOCK_DPPS.find((dpp) => dpp.id === canonicalLookupId);
  if (foundMockDpp) {
    return mapDppToSimpleProductDetail(foundMockDpp);
  }

  if (productId !== canonicalLookupId) {
    const foundMockDppOriginalId = MOCK_DPPS.find(
      (dpp) => dpp.id === productId,
    );
    if (foundMockDppOriginalId) {
      return mapDppToSimpleProductDetail(foundMockDppOriginalId);
    }
  }

  return null;
}
