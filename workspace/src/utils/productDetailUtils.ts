
// --- File: src/utils/productDetailUtils.ts ---
// Description: Utilities for fetching and preparing product details for display.


import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, StoredUserProduct, SimpleProductDetail, ComplianceDetailItem, EbsiVerificationDetails, CustomAttribute, SimpleCertification, Certification, ScipNotificationDetails, EuCustomsDataDetails, BatteryRegulationDetails, TextileInformation, ConstructionProductInformation } from '@/types/dpp';
import { getOverallComplianceDetails } from '@/utils/dppDisplayUtils';

// Helper function to map DigitalProductPassport to SimpleProductDetail
function mapDppToSimpleProductDetail(dpp: DigitalProductPassport): SimpleProductDetail {
    const mapStatus = (status: DigitalProductPassport['metadata']['status']): SimpleProductDetail['status'] => {
        switch (status) {
            case 'published': return 'Active';
            case 'archived': return 'Archived';
            case 'pending_review': return 'Pending';
            case 'draft': return 'Draft';
            case 'revoked': return 'Archived'; // Consider revoked as archived for simple view
            case 'flagged': return 'Flagged'; // Added Flagged status
            default: return 'Draft';
        }
    };

    const specificRegulations: ComplianceDetailItem[] = [];
    
    if (dpp.compliance.eu_espr) {
        specificRegulations.push({
            regulationName: "EU ESPR",
            status: dpp.compliance.eu_espr.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.eu_espr.reportUrl,
            verificationId: dpp.compliance.eu_espr.vcId,
            lastChecked: dpp.metadata.last_updated, 
        });
    }
    if (dpp.compliance.esprConformity) {
         specificRegulations.push({
            regulationName: "ESPR Conformity Assessment",
            status: dpp.compliance.esprConformity.status as ComplianceDetailItem['status'],
            verificationId: dpp.compliance.esprConformity.assessmentId || dpp.compliance.esprConformity.vcId,
            lastChecked: dpp.compliance.esprConformity.assessmentDate || dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.us_scope3) {
        specificRegulations.push({
            regulationName: "US Scope 3 Emissions",
            status: dpp.compliance.us_scope3.status as ComplianceDetailItem['status'],
            detailsUrl: dpp.compliance.us_scope3.reportUrl,
            verificationId: dpp.compliance.us_scope3.vcId,
            lastChecked: dpp.metadata.last_updated, 
        });
    }

    const complianceOverallStatusDetails = getOverallComplianceDetails(dpp);
    const keyCompliancePointsPopulated: string[] = [];
    if (complianceOverallStatusDetails.text && complianceOverallStatusDetails.text.toLowerCase() !== 'n/a' && complianceOverallStatusDetails.text.toLowerCase() !== 'no data') {
        keyCompliancePointsPopulated.push(`Overall Status: ${complianceOverallStatusDetails.text}`);
    }
    if (dpp.ebsiVerification?.status && dpp.ebsiVerification.status.toLowerCase() !== 'n/a') {
        const ebsiStatusText = dpp.ebsiVerification.status.replace(/_/g, ' ');
        const capitalizedEbsiStatus = ebsiStatusText.charAt(0).toUpperCase() + ebsiStatusText.slice(1);
        keyCompliancePointsPopulated.push(`EBSI Status: ${capitalizedEbsiStatus}`);
    }
    if (dpp.compliance.battery_regulation?.status && dpp.compliance.battery_regulation.status.toLowerCase() !== 'not_applicable' && dpp.compliance.battery_regulation.status.toLowerCase() !== 'n/a' && keyCompliancePointsPopulated.length < 3) {
        const batteryStatusText = dpp.compliance.battery_regulation.status.replace(/_/g, ' ');
        const capitalizedBatteryStatus = batteryStatusText.charAt(0).toUpperCase() + batteryStatusText.slice(1);
        keyCompliancePointsPopulated.push(`Battery Reg: ${capitalizedBatteryStatus}`);
    }
    
    specificRegulations.forEach(reg => {
        if (keyCompliancePointsPopulated.length < 3 && reg.status && reg.status.toLowerCase() !== 'n/a' && reg.status.toLowerCase() !== 'not applicable' && reg.status.toLowerCase() !== 'not required') {
            const regStatusText = reg.status.replace(/_/g, ' ');
            const capitalizedRegStatus = regStatusText.charAt(0).toUpperCase() + regStatusText.slice(1);
            keyCompliancePointsPopulated.push(`${reg.regulationName}: ${capitalizedRegStatus}`);
        }
    });
    if (keyCompliancePointsPopulated.length === 0 && (specificRegulations.length > 0 || dpp.compliance.battery_regulation)) {
        keyCompliancePointsPopulated.push("Review Compliance tab for regulation details.");
    }


    const customAttributes = dpp.productDetails?.customAttributes || [];
    const mappedCertifications: SimpleCertification[] = dpp.certifications?.map(cert => ({
        id: cert.id, // Ensure ID is mapped
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
        keySustainabilityPoints: dpp.productDetails?.sustainabilityClaims?.map(c => c.claim).filter(Boolean) || [],
        keyCompliancePoints: keyCompliancePointsPopulated,
        specifications: dpp.productDetails?.specifications,
        customAttributes: customAttributes,
        complianceSummary: {
            overallStatus: complianceOverallStatusDetails.text,
            eprel: dpp.compliance.eprel ? {
                id: dpp.compliance.eprel.id,
                status: dpp.compliance.eprel.status,
                url: dpp.compliance.eprel.url,
                lastChecked: dpp.compliance.eprel.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            ebsi: dpp.ebsiVerification ? {
                status: dpp.ebsiVerification.status,
                verificationId: dpp.ebsiVerification.verificationId,
                lastChecked: dpp.ebsiVerification.lastChecked,
            } : { status: 'N/A', lastChecked: new Date().toISOString() },
            scip: dpp.compliance.scipNotification, 
            euCustomsData: dpp.compliance.euCustomsData, 
            battery: dpp.compliance.battery_regulation,
            specificRegulations: specificRegulations,
        },
        lifecycleEvents: dpp.lifecycleEvents?.map(event => ({
            id: event.id,
            eventName: event.type,
            date: event.timestamp,
            location: event.location,
            notes: event.data ? `Data: ${JSON.stringify(event.data)}` : (event.responsibleParty ? `Responsible: ${event.responsibleParty}` : undefined),
            status: event.transactionHash ? 'Completed' : (event.type.toLowerCase().includes('schedul') || event.type.toLowerCase().includes('upcoming') ? 'Upcoming' : 'In Progress'),
            iconName: event.type.toLowerCase().includes('manufactur') ? 'Factory' :
                      event.type.toLowerCase().includes('ship') ? 'Truck' :
                      event.type.toLowerCase().includes('quality') || event.type.toLowerCase().includes('certif') ? 'ShieldCheck' :
                      event.type.toLowerCase().includes('sale') || event.type.toLowerCase().includes('sold') ? 'ShoppingCart' :
                      'Info',
        })) || [],
        materialsUsed: dpp.productDetails?.materials?.map(m => ({ name: m.name, percentage: m.percentage, source: m.origin, isRecycled: m.isRecycled })),
        energyLabelRating: dpp.productDetails?.energyLabel,
        repairability: dpp.productDetails?.repairabilityScore ? { score: dpp.productDetails.repairabilityScore.value, scale: dpp.productDetails.repairabilityScore.scale, detailsUrl: dpp.productDetails.repairabilityScore.reportUrl } : undefined,
        recyclabilityInfo: dpp.productDetails?.recyclabilityInformation ? { percentage: dpp.productDetails.recyclabilityInformation.recycledContentPercentage, instructionsUrl: dpp.productDetails.recyclabilityInformation.instructionsUrl } : undefined,
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
        batteryRegulation: dpp.compliance.battery_regulation, // Directly map full battery_regulation
        lastUpdated: dpp.metadata.last_updated,
    };
}


export async function fetchProductDetails(productId: string): Promise<SimpleProductDetail | null> {
  // Simulate async fetching
  await new Promise(resolve => setTimeout(resolve, 0)); // Minimal delay for promise resolution

  let foundDpp: DigitalProductPassport | undefined;

  if (productId.startsWith("USER_PROD")) {
    const storedProductsString = typeof window !== 'undefined' ? localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY) : null;
    if (storedProductsString) {
      const userProducts: StoredUserProduct[] = JSON.parse(storedProductsString);
      const userProductData = userProducts.find(p => p.id === productId);
      if (userProductData) {
        let parsedCustomAttributes: CustomAttribute[] = [];
        if (userProductData.customAttributesJsonString) {
            try {
                const parsed = JSON.parse(userProductData.customAttributesJsonString);
                if (Array.isArray(parsed)) parsedCustomAttributes = parsed;
            } catch (e) {
                console.error("Failed to parse customAttributesJsonString from localStorage for USER_PROD:", e);
            }
        }
        const certificationsForUserProd: Certification[] = userProductData.certifications?.map(sc => ({
            id: sc.id || `cert_user_${sc.name.replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2, 7)}`, // Ensure ID exists
            name: sc.name,
            issuer: sc.authority,
            issueDate: sc.issueDate,
            expiryDate: sc.expiryDate,
            documentUrl: sc.documentUrl,
            standard: sc.standard,
            vcId: sc.vcId,
            transactionHash: sc.transactionHash,
        })) || [];
        
        const complianceSummaryFromStorage = userProductData.complianceSummary || { overallStatus: 'N/A' };

        foundDpp = {
          id: userProductData.id,
          productName: userProductData.productName || "N/A",
          category: userProductData.productCategory || "N/A",
          manufacturer: { name: userProductData.manufacturer || "N/A" },
          modelNumber: userProductData.modelNumber,
          sku: userProductData.sku,
          nfcTagId: userProductData.nfcTagId,
          rfidTagId: userProductData.rfidTagId,
          gtin: userProductData.gtin,
          metadata: {
            status: (userProductData.status?.toLowerCase() as DigitalProductPassport['metadata']['status']) || 'draft',
            last_updated: userProductData.lastUpdated || new Date().toISOString(),
            created_at: userProductData.lastUpdated || new Date().toISOString(), 
            onChainStatus: userProductData.metadata?.onChainStatus,
            onChainLifecycleStage: userProductData.metadata?.onChainLifecycleStage,
          },
          productDetails: {
            description: userProductData.productDescription,
            imageUrl: userProductData.imageUrl,
            imageHint: userProductData.imageHint,
            sustainabilityClaims: userProductData.sustainabilityClaims?.split('\n').map(s => ({ claim: s.trim() })).filter(c => c.claim) || [],
            materials: userProductData.materials?.split(',').map(m => ({ name: m.trim() })) || [],
            energyLabel: userProductData.energyLabel,
            specifications: userProductData.specifications, 
            customAttributes: parsedCustomAttributes, 
          },
          compliance: { 
            eprel: userProductData.complianceData?.eprel,
            scipNotification: userProductData.complianceData?.scipNotification, 
            euCustomsData: userProductData.complianceData?.euCustomsData,
            battery_regulation: userProductData.complianceData?.battery_regulation, 
            esprConformity: userProductData.complianceData?.esprConformity, 
          },
          ebsiVerification: complianceSummaryFromStorage.ebsi ? {
            status: complianceSummaryFromStorage.ebsi.status as EbsiVerificationDetails['status'],
            verificationId: complianceSummaryFromStorage.ebsi.verificationId,
            lastChecked: complianceSummaryFromStorage.ebsi.lastChecked,
          } : undefined,
          lifecycleEvents: userProductData.lifecycleEvents?.map(e => ({
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
          constructionProductInformation: userProductData.constructionProductInformation, 
        } as DigitalProductPassport;
      }
    }
  } else {
    foundDpp = MOCK_DPPS.find(dpp => dpp.id === productId);
  }

  if (foundDpp) {
    return mapDppToSimpleProductDetail(foundDpp);
  }
  return null;
}
    

    
