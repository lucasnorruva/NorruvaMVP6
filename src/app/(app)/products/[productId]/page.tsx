
// --- File: page.tsx (Product Detail Page) ---
// Description: Main page component for displaying individual product details.
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductContainer from '@/components/products/detail/ProductContainer';
import { SIMPLE_MOCK_PRODUCTS, USER_PRODUCTS_LOCAL_STORAGE_KEY, MOCK_DPPS } from '@/types/dpp'; // Added MOCK_DPPS
import type { SimpleProductDetail, ProductSupplyChainLink, StoredUserProduct, ProductComplianceSummary, DigitalProductPassport, ComplianceDetailItem, SimpleLifecycleEvent, CustomAttribute } from '@/types/dpp';
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
            case 'revoked': return 'Archived';
            default: return 'Draft';
        }
    };

    const specificRegulations: ComplianceDetailItem[] = [];
    if (dpp.compliance.eu_espr) {
        specificRegulations.push({
            regulationName: "EU ESPR",
            status: dpp.compliance.eu_espr.status,
            detailsUrl: dpp.compliance.eu_espr.reportUrl,
            verificationId: dpp.compliance.eu_espr.vcId,
            lastChecked: dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.esprConformity) {
         specificRegulations.push({
            regulationName: "ESPR Conformity Assessment",
            status: dpp.compliance.esprConformity.status,
            verificationId: dpp.compliance.esprConformity.assessmentId || dpp.compliance.esprConformity.vcId,
            lastChecked: dpp.compliance.esprConformity.assessmentDate || dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.us_scope3) {
        specificRegulations.push({
            regulationName: "US Scope 3 Emissions",
            status: dpp.compliance.us_scope3.status,
            detailsUrl: dpp.compliance.us_scope3.reportUrl,
            verificationId: dpp.compliance.us_scope3.vcId,
            lastChecked: dpp.metadata.last_updated,
        });
    }
    if (dpp.compliance.battery_regulation) {
        specificRegulations.push({
            regulationName: "EU Battery Regulation",
            status: dpp.compliance.battery_regulation.status,
            verificationId: dpp.compliance.battery_regulation.batteryPassportId || dpp.compliance.battery_regulation.vcId,
            lastChecked: dpp.metadata.last_updated,
            notes: `Carbon Footprint: ${dpp.compliance.battery_regulation.carbonFootprint?.value || 'N/A'} ${dpp.compliance.battery_regulation.carbonFootprint?.unit || ''}`
        });
    }

    const complianceOverallStatus = getOverallComplianceDetails(dpp);

    const keyCompliancePointsPopulated: string[] = [];
    if (complianceOverallStatus.text && complianceOverallStatus.text.toLowerCase() !== 'n/a' && complianceOverallStatus.text.toLowerCase() !== 'no data') {
        keyCompliancePointsPopulated.push(`Overall Status: ${complianceOverallStatus.text}`);
    }
    if (dpp.ebsiVerification?.status && dpp.ebsiVerification.status.toLowerCase() !== 'n/a') {
        const ebsiStatusText = dpp.ebsiVerification.status.replace(/_/g, ' ');
        const capitalizedEbsiStatus = ebsiStatusText.charAt(0).toUpperCase() + ebsiStatusText.slice(1);
        keyCompliancePointsPopulated.push(`EBSI Status: ${capitalizedEbsiStatus}`);
    }

    let specificRegCount = 0;
    specificRegulations.forEach(reg => {
        if (specificRegCount < 2 && (reg.status.toLowerCase() === 'compliant' || reg.status.toLowerCase() === 'pending' || reg.status.toLowerCase() === 'pending_review' || reg.status.toLowerCase() === 'registered' || reg.status.toLowerCase() === 'conformant')) {
            const regStatusText = reg.status.replace(/_/g, ' ');
            const capitalizedRegStatus = regStatusText.charAt(0).toUpperCase() + regStatusText.slice(1);
            keyCompliancePointsPopulated.push(`${reg.regulationName}: ${capitalizedRegStatus}`);
            specificRegCount++;
        }
    });

    if (keyCompliancePointsPopulated.length === 0 && specificRegulations.length > 0) {
        keyCompliancePointsPopulated.push("Review Compliance tab for regulation details.");
    }


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
        keySustainabilityPoints: dpp.productDetails?.sustainabilityClaims?.map(c => c.claim).filter(Boolean),
        keyCompliancePoints: keyCompliancePointsPopulated,
        specifications: dpp.productDetails?.materials ?
            Object.fromEntries(dpp.productDetails.materials.map((m, i) => [`material_${i+1}`, `${m.name} (${m.percentage || 'N/A'}%)`]))
            : undefined,
        complianceSummary: {
            overallStatus: complianceOverallStatus.text as ProductComplianceSummary['overallStatus'],
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
            status: event.transactionHash ? 'Completed' : 'In Progress',
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
        customAttributes: dpp.productDetails?.customAttributes || [],
    };
}


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<SimpleProductDetail | null | undefined>(undefined); // undefined for loading state
  const [isSyncingEprel, setIsSyncingEprel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      let foundProduct: SimpleProductDetail | undefined;

      if (productId.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        if (storedProductsString) {
          const userProducts: StoredUserProduct[] = JSON.parse(storedProductsString);
          const userProductToDisplay = userProducts.find(p => p.id === productId);
          if (userProductToDisplay) {

            let parsedCustomAttributes: CustomAttribute[] = [];
            if (userProductToDisplay.customAttributesJsonString) {
                try {
                    parsedCustomAttributes = JSON.parse(userProductToDisplay.customAttributesJsonString);
                } catch (e) {
                    console.error("Failed to parse customAttributesJsonString from localStorage", e);
                }
            }

            const tempDppForMapping: Partial<DigitalProductPassport> = {
              id: userProductToDisplay.id,
              productName: userProductToDisplay.productName || "N/A",
              category: userProductToDisplay.productCategory || "N/A",
              manufacturer: { name: userProductToDisplay.manufacturer || "N/A" },
              modelNumber: userProductToDisplay.modelNumber,
              gtin: userProductToDisplay.gtin,
              metadata: {
                status: (userProductToDisplay.status?.toLowerCase() as DigitalProductPassport['metadata']['status']) || 'draft',
                last_updated: userProductToDisplay.lastUpdated || new Date().toISOString(),
              },
              productDetails: {
                description: userProductToDisplay.productDescription,
                imageUrl: userProductToDisplay.imageUrl,
                imageHint: userProductToDisplay.imageHint,
                sustainabilityClaims: userProductToDisplay.sustainabilityClaims?.split('\n').map(s => ({ claim: s.trim() })).filter(c => c.claim) || [],
                materials: userProductToDisplay.materials?.split(',').map(m => ({ name: m.trim() })) || [],
                energyLabel: userProductToDisplay.energyLabel,
                customAttributes: parsedCustomAttributes,
              },
              compliance: {
                eprel: userProductToDisplay.complianceSummary?.eprel,
              },
              ebsiVerification: userProductToDisplay.complianceSummary?.ebsi ? {
                status: userProductToDisplay.complianceSummary.ebsi.status as EbsiVerificationDetails['status'],
                verificationId: userProductToDisplay.complianceSummary.ebsi.verificationId,
                lastChecked: userProductToDisplay.complianceSummary.ebsi.lastChecked,
              } : undefined,
              lifecycleEvents: userProductToDisplay.lifecycleEvents?.map(e => ({
                  id: e.id,
                  type: e.eventName,
                  timestamp: e.date,
                  location: e.location,
                  data: e.notes ? { notes: e.notes } : undefined,
              })),
              supplyChainLinks: userProductToDisplay.supplyChainLinks || [],
            };
            foundProduct = mapDppToSimpleProductDetail(tempDppForMapping as DigitalProductPassport);
          }
        }
      } else {
        const dppFromMocks = MOCK_DPPS.find(dpp => dpp.id === productId);
        if (dppFromMocks) {
            foundProduct = mapDppToSimpleProductDetail(dppFromMocks);
        } else {
            const simpleMockProduct = SIMPLE_MOCK_PRODUCTS.find(p => p.id === productId);
            if(simpleMockProduct) {
                foundProduct = simpleMockProduct;
            }
        }
      }

      setTimeout(() => {
        setProduct(foundProduct || null);
      }, 300);
    }
  }, [productId]);

  const handleSupplyChainUpdate = (updatedLinks: ProductSupplyChainLink[]) => {
    if (!product) return;

    const updatedProduct = { ...product, supplyChainLinks: updatedLinks };
    setProduct(updatedProduct);

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
        const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
        if (mockDppIndex > -1) {
            MOCK_DPPS[mockDppIndex].supplyChainLinks = updatedLinks;
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

      const currentComplianceSummary = product.complianceSummary || { overallStatus: "N/A" };
      const updatedProductData: SimpleProductDetail = {
        ...product,
        complianceSummary: {
          ...currentComplianceSummary,
          overallStatus: currentComplianceSummary.overallStatus,
          eprel: {
            id: result.eprelId || currentComplianceSummary.eprel?.id,
            status: result.syncStatus,
            lastChecked: result.lastChecked,
            url: currentComplianceSummary.eprel?.url,
          },
        },
      };
      setProduct(updatedProductData);

      if (product.id.startsWith("USER_PROD")) {
        const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
        let userProducts: StoredUserProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
        const productIndex = userProducts.findIndex(p => p.id === product.id);
        if (productIndex > -1) {
          if (!userProducts[productIndex].complianceSummary) {
            userProducts[productIndex].complianceSummary = { overallStatus: "N/A" };
          }
          userProducts[productIndex].complianceSummary!.eprel = updatedProductData.complianceSummary?.eprel;
          userProducts[productIndex].lastUpdated = result.lastChecked;
          localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
        }
      } else {
        const mockDppIndex = MOCK_DPPS.findIndex(dpp => dpp.id === product.id);
        if (mockDppIndex > -1 && MOCK_DPPS[mockDppIndex].compliance) {
            MOCK_DPPS[mockDppIndex].compliance.eprel = updatedProductData.complianceSummary?.eprel;
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


  if (product === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium text-muted-foreground">Loading product details...</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Please wait a moment.</p>
      </div>
    );
  }

  if (!product) {
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

    