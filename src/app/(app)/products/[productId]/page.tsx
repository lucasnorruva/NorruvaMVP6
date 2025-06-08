
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { USER_PRODUCTS_LOCAL_STORAGE_KEY, MOCK_DPPS } from '@/types/dpp';
import type { SimpleProductDetail, ProductSupplyChainLink, StoredUserProduct, DigitalProductPassport, ComplianceDetailItem, EbsiVerificationDetails, CustomAttribute, SimpleCertification } from '@/types/dpp';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { syncEprelData } from '@/ai/flows/sync-eprel-data-flow';
import { getOverallComplianceDetails } from '@/utils/dppDisplayUtils';


// Helper function to map DigitalProductPassport to SimpleProductDetail
function mapDppToSimpleProductDetail(dpp: DigitalProductPassport): SimpleProductDetail {
    const mapStatus = (status: DigitalProductPassport['metadata']['status']): SimpleProductDetail['status'] => {
        switch (status) {
            case 'published': return 'Active';
            case 'archived': return 'Archived';
            case 'pending_review': return 'Pending';
            case 'draft': return 'Draft';
            case 'revoked': return 'Archived'; // Treat revoked as archived for simple display
            default: return 'Draft'; // Default for any unhandled statuses
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
    if (dpp.compliance.battery_regulation) {
        const batteryReg = dpp.compliance.battery_regulation;
        const cfValue = batteryReg.carbonFootprint?.value ?? 'N/A';
        const cfUnit = batteryReg.carbonFootprint?.unit ?? '';
        const notesValue = `CF: ${cfValue} ${cfUnit}`.trim();

        specificRegulations.push({
            regulationName: "EU Battery Regulation",
            status: batteryReg.status as ComplianceDetailItem['status'],
            verificationId: batteryReg.batteryPassportId || batteryReg.vcId,
            lastChecked: dpp.metadata.last_updated, // Comma is critical here
            notes: notesValue
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

    let specificRegCount = 0;
    specificRegulations.forEach(reg => {
        if (specificRegCount < 2 && reg.status && reg.status.toLowerCase() !== 'n/a' && reg.status.toLowerCase() !== 'not applicable') {
            const regStatusText = reg.status.replace(/_/g, ' ');
            const capitalizedRegStatus = regStatusText.charAt(0).toUpperCase() + regStatusText.slice(1);
            keyCompliancePointsPopulated.push(`${reg.regulationName}: ${capitalizedRegStatus}`);
            specificRegCount++;
        }
    });

    if (keyCompliancePointsPopulated.length === 0 && specificRegulations.length > 0) {
        keyCompliancePointsPopulated.push("Review Compliance tab for regulation details.");
    }
    
    const customAttributes = dpp.productDetails?.customAttributes || [];

    const mappedCertifications: SimpleCertification[] = dpp.certifications?.map(cert => ({
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
        description: dpp.productDetails?.description,
        imageUrl: dpp.productDetails?.imageUrl,
        imageHint: dpp.productDetails?.imageHint,
        keySustainabilityPoints: dpp.productDetails?.sustainabilityClaims?.map(c => c.claim).filter(Boolean) || [],
        keyCompliancePoints: keyCompliancePointsPopulated,
        specifications: dpp.productDetails?.materials ? 
            Object.fromEntries(dpp.productDetails.materials.map((m, i) => [`material_${i+1}`, `${m.name} (${m.percentage || 'N/A'}%)`]))
            : undefined,
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
        customAttributes: customAttributes,
    };
}


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined);
  const [isSyncingEprel, setIsSyncingEprel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      let foundDpp: DigitalProductPassport | undefined;

      if (productId.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
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
             const certificationsForUserProd = userProductData.certifications?.map(sc => ({
                id: `cert_user_${sc.name.replace(/\s+/g, '_')}`, // mock an ID
                name: sc.name,
                issuer: sc.authority,
                issueDate: sc.issueDate,
                expiryDate: sc.expiryDate,
                documentUrl: sc.documentUrl,
                standard: sc.standard,
                vcId: sc.vcId,
                transactionHash: sc.transactionHash,
              })) || [];


            // Construct a DigitalProductPassport-like object from StoredUserProduct
            foundDpp = {
              id: userProductData.id,
              productName: userProductData.productName || "N/A",
              category: userProductData.productCategory || "N/A",
              manufacturer: { name: userProductData.manufacturer || "N/A" },
              modelNumber: userProductData.modelNumber,
              gtin: userProductData.gtin,
              metadata: {
                status: (userProductData.status?.toLowerCase() as DigitalProductPassport['metadata']['status']) || 'draft',
                last_updated: userProductData.lastUpdated || new Date().toISOString(),
                created_at: userProductData.lastUpdated || new Date().toISOString(), // Assuming created_at is same as lastUpdated for stored
              },
              productDetails: {
                description: userProductData.productDescription,
                imageUrl: userProductData.imageUrl,
                imageHint: userProductData.imageHint,
                sustainabilityClaims: userProductData.sustainabilityClaims?.split('\n').map(s => ({ claim: s.trim() })).filter(c => c.claim) || [],
                materials: userProductData.materials?.split(',').map(m => ({ name: m.trim() })) || [], // Simplified mapping
                energyLabel: userProductData.energyLabel,
                customAttributes: parsedCustomAttributes,
              },
              compliance: { // Basic compliance from StoredUserProduct
                eprel: userProductData.complianceSummary?.eprel,
              },
              ebsiVerification: userProductData.complianceSummary?.ebsi ? {
                status: userProductData.complianceSummary.ebsi.status as EbsiVerificationDetails['status'],
                verificationId: userProductData.complianceSummary.ebsi.verificationId,
                lastChecked: userProductData.complianceSummary.ebsi.lastChecked,
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
            } as DigitalProductPassport; // Cast as it's a partial reconstruction
          }
        }
      } else {
        foundDpp = MOCK_DPPS.find(dpp => dpp.id === productId);
      }

      setTimeout(() => { // Simulate loading delay
        if (foundDpp) {
          setProduct(mapDppToSimpleProductDetail(foundDpp));
        } else {
          setProduct(null); // Product not found
        }
      }, 300);
    }
  }, [productId]);

  const handleSupplyChainUpdate = (updatedLinks: ProductSupplyChainLink[]) => {
    if (!product) return;

    const updatedProductData = { ...product, supplyChainLinks: updatedLinks };
    setProduct(updatedProductData);

    if (product.id.startsWith("USER_PROD")) {
      try {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          userProducts[productIndex] = {
            ...userProducts[productIndex],
            supplyChainLinks: updatedLinks,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
          toast({
            title: "Supply Chain Updated",
            description: `Supplier links for ${product.productName} saved to local storage.`,
            variant: "default",
          });
        } else {
           toast({ title: "Error Updating Storage", description: "Could not find product in local storage to update supply chain.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Storage Error", description: "Failed to save supply chain updates to local storage.", variant: "destructive" });
        console.error("Error saving supply chain to localStorage:", error);
      }
    } else {
        // For mock products, update in-memory MOCK_DPPS if needed for session persistence beyond this component
        const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
        if (mockDppIndex > -1) {
            MOCK_DPPS[mockDppIndex].supplyChainLinks = updatedLinks;
            MOCK_DPPS[mockDppIndex].metadata.last_updated = new Date().toISOString();
        }
        toast({ title: "Supply Chain Updated (Session Only)", description: "Supply chain links updated for this session (mock product).", variant: "default" });
    }
  };

  const handleSyncEprel = async () => {
    if (!product || !product.modelNumber) {
      toast({ title: "Missing Information", description: "Product model number is required to sync with EPREL.", variant: "destructive" });
      return;
    }
    setIsSyncingEprel(true);
    try {
      const result = await syncEprelData({
        productId: product.id,
        productName: product.productName,
        modelNumber: product.modelNumber,
      });

      const currentComplianceSummary = product.complianceSummary || { overallStatus: "N/A" as SimpleProductDetail['complianceSummary']['overallStatus'] };
      
      let eprelIdToSet: string | undefined = currentComplianceSummary.eprel?.id;
      if (result.syncStatus.toLowerCase().includes('successfully') || result.syncStatus.toLowerCase().includes('mismatch')) {
        eprelIdToSet = result.eprelId; 
      } else if (result.syncStatus.toLowerCase().includes('not found') || result.syncStatus.toLowerCase().includes('error')) {
        eprelIdToSet = undefined; 
      }

      const newEprelData = {
        id: eprelIdToSet,
        status: result.syncStatus,
        lastChecked: result.lastChecked,
        url: currentComplianceSummary.eprel?.url, // Preserve existing URL
      };
      
      const updatedProductData: SimpleProductDetail = {
        ...product,
        complianceSummary: {
          ...currentComplianceSummary,
          eprel: newEprelData,
        },
      };
      setProduct(updatedProductData);

      // Update localStorage for USER_PROD or MOCK_DPPS for session
      if (product.id.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          if (!userProducts[productIndex].complianceSummary) { 
            userProducts[productIndex].complianceSummary = { overallStatus: "N/A" };
          }
          userProducts[productIndex].complianceSummary!.eprel = newEprelData;
          userProducts[productIndex].lastUpdated = result.lastChecked;
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
        }
      } else {
         const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
         if (mockDppIndex > -1 && MOCK_DPPS[mockDppIndex].compliance) {
            MOCK_DPPS[mockDppIndex].compliance.eprel = newEprelData;
            MOCK_DPPS[mockDppIndex].metadata.last_updated = result.lastChecked;
         }
      }
      toast({ title: "EPREL Sync", description: result.message, variant: result.syncStatus.toLowerCase().includes('error') || result.syncStatus.toLowerCase().includes('mismatch') ? "destructive" : "default" });

    } catch (error) {
      toast({ title: "EPREL Sync Error", description: `An unexpected error occurred during EPREL sync. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
      console.error("EPREL Sync Error:", error);
    } finally {
      setIsSyncingEprel(false);
    }
  };

  const canSyncEprel = !!product?.modelNumber;

  if (product === undefined) { // Loading state
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium text-muted-foreground">Loading product details...</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Please wait a moment.</p>
      </div>
    );
  }

  if (!product) { // Product not found after loading
    notFound();
  }

  return (
    <ProductContainer
      product={product}
      onSupplyChainUpdate={handleSupplyChainUpdate}
      onSyncEprel={handleSyncEprel}
      isSyncingEprel={isSyncingEprel}
      canSyncEprel={canSyncEprel}
    />
  );
}

    