
// --- File: useDPPLiveData.ts ---
// Description: Custom hook to manage data fetching, state, filtering, sorting, and actions for the DPP Live Dashboard.
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { DigitalProductPassport, DashboardFiltersState, SortConfig, SortableKeys } from '@/types/dpp';
import { MOCK_DPPS } from '@/data';
import { getSortValue } from '@/utils/sortUtils';
import { useToast } from '@/hooks/use-toast';
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';

export function useDPPLiveData() {
  const router = useRouter();
  const { toast } = useToast();

  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [filters, setFilters] = useState<DashboardFiltersState>({
    status: "all",
    regulation: "all",
    category: "all",
    searchQuery: "",
    blockchainAnchored: "all",
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Load initial DPPs (combining mocks and localStorage)
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    let userAddedProducts: DigitalProductPassport[] = [];
    if (storedProductsString) {
      try {
        userAddedProducts = JSON.parse(storedProductsString);
      } catch (e) {
        console.error("Failed to parse user products from localStorage", e);
        // Optionally, clear corrupted data: localStorage.removeItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      }
    }
    
    const combinedProducts = [
      ...MOCK_DPPS.filter(mockDpp => !userAddedProducts.find(userDpp => userDpp.id === mockDpp.id)),
      ...userAddedProducts
    ];
    setDpps(combinedProducts);
  }, []);

  const availableCategories = useMemo(() => {
    const categories = new Set(dpps.map(dpp => dpp.category));
    return Array.from(categories).sort();
  }, [dpps]);

  const sortedAndFilteredDPPs = useMemo(() => {
    let filtered = dpps.filter((dpp) => {
      if (filters.searchQuery && !dpp.productName.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      if (filters.status !== "all" && dpp.metadata.status !== filters.status) return false;
      
      if (filters.regulation !== "all") {
        const complianceSection = dpp.compliance;
        let isCompliantForRegulation = false;
        if (filters.regulation === 'eu_espr') {
          isCompliantForRegulation = complianceSection.eu_espr?.status === 'compliant' || complianceSection.esprConformity?.status === 'conformant';
        } else if (filters.regulation === 'us_scope3') {
          isCompliantForRegulation = complianceSection.us_scope3?.status === 'compliant';
        } else if (filters.regulation === 'battery_regulation') {
          isCompliantForRegulation = complianceSection.battery_regulation?.status === 'compliant';
        }
        if (!isCompliantForRegulation) return false;
      }

      if (filters.category !== "all" && dpp.category !== filters.category) return false;
      if (filters.blockchainAnchored === 'anchored' && !dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      if (filters.blockchainAnchored === 'not_anchored' && dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      return true;
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let valA: any = getSortValue(a, sortConfig.key!);
        let valB: any = getSortValue(b, sortConfig.key!);

        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        const valAExists = valA !== undefined && valA !== null && valA !== '';
        const valBExists = valB !== undefined && valB !== null && valB !== '';

        if (!valAExists && valBExists) return sortConfig.direction === 'ascending' ? 1 : -1;
        if (valAExists && !valBExists) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (!valAExists && !valBExists) return 0;

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [dpps, filters, sortConfig]);

  const metrics = useMemo(() => {
    const totalDPPs = dpps.length;
    const fullyCompliantDPPsCount = dpps.filter(dpp => {
        // Consider a DPP compliant if all its *defined* compliance sections are 'compliant' or 'verified' etc.
        const relevantComplianceSections = Object.values(dpp.compliance).filter(
          (section): section is { status: string } => 
            typeof section === 'object' && section !== null && 'status' in section && section.status !== 'not_applicable' && section.status !== 'N/A'
        );
        if (relevantComplianceSections.length === 0 && Object.keys(dpp.compliance).filter(k => dpp.compliance[k as keyof typeof dpp.compliance] !== undefined).length > 0) return false; // If compliance sections exist but all are N/A
        if (relevantComplianceSections.length === 0 && Object.keys(dpp.compliance).filter(k => dpp.compliance[k as keyof typeof dpp.compliance] !== undefined).length === 0) return true; // No applicable regulations, considered compliant
        
        const isEbsiCompliant = !dpp.ebsiVerification || dpp.ebsiVerification.status === 'verified' || dpp.ebsiVerification.status === 'N/A';
        
        return isEbsiCompliant && relevantComplianceSections.every(section => 
            section.status.toLowerCase() === 'compliant' || 
            section.status.toLowerCase() === 'conformant' || 
            section.status.toLowerCase() === 'registered' || 
            section.status.toLowerCase() === 'verified' ||
            section.status.toLowerCase() === 'synced successfully' ||
            section.status.toLowerCase() === 'notified' ||
            section.status.toLowerCase() === 'cleared'
        );
    }).length;
    const compliantPercentage = totalDPPs > 0 ? ((fullyCompliantDPPsCount / totalDPPs) * 100).toFixed(1) + "%" : "0%";
    const pendingReviewDPPs = dpps.filter(d => d.metadata.status === 'pending_review').length;
    const totalConsumerScans = dpps.reduce((sum, dpp) => sum + (dpp.consumerScans || 0), 0);
    const averageConsumerScans = totalDPPs > 0 ? (totalConsumerScans / totalDPPs).toFixed(1) : "0";
    return { totalDPPs, compliantPercentage, pendingReviewDPPs, totalConsumerScans, averageConsumerScans };
  }, [dpps]);

  const handleFiltersChange = useCallback((newFilters: Partial<DashboardFiltersState>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  }, []);

  const handleSort = useCallback((key: SortableKeys) => {
    setSortConfig(prevConfig => {
      const direction: 'ascending' | 'descending' = 
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      return { key, direction };
    });
  }, []);

  const handleDeleteRequest = useCallback((productId: string) => {
    setProductToDeleteId(productId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDeleteProduct = useCallback(() => {
    if (!productToDeleteId) return;
    const productIsUserAdded = productToDeleteId.startsWith("USER_PROD");
    if (productIsUserAdded) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      userProducts = userProducts.filter(p => p.id !== productToDeleteId);
      localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
    }
    setDpps(prevDpps => prevDpps.filter(p => p.id !== productToDeleteId));
    const productName = dpps.find(p=>p.id === productToDeleteId)?.productName || productToDeleteId;
    toast({ title: "Product Deleted", description: `Product "${productName}" has been deleted.` });
    setIsDeleteDialogOpen(false);
    setProductToDeleteId(null);
  }, [productToDeleteId, toast, dpps]);

  return {
    dpps,
    filters,
    sortConfig,
    productToDeleteId,
    isDeleteDialogOpen,
    availableCategories,
    sortedAndFilteredDPPs,
    metrics,
    handleFiltersChange,
    handleSort,
    handleDeleteRequest,
    confirmDeleteProduct,
    setIsDeleteDialogOpen,
    router,
    toast
  };
}
