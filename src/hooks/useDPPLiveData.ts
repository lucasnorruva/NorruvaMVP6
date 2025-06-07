
// --- File: useDPPLiveData.ts ---
// Description: Custom hook to manage data fetching, state, filtering, sorting, and actions for the DPP Live Dashboard.
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { DigitalProductPassport, DashboardFiltersState, SortConfig, SortableKeys } from '@/types/dpp';
import { MOCK_DPPS } from '@/types/dpp'; // Assuming MOCK_DPPS are still needed for base data
import { useToast } from '@/hooks/use-toast';

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

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
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
    
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
        const complianceData = dpp.compliance[filters.regulation as keyof typeof dpp.compliance];
        if (!complianceData || (typeof complianceData === 'object' && 'status' in complianceData && complianceData.status !== 'compliant')) return false;
      }
      if (filters.category !== "all" && dpp.category !== filters.category) return false;
      if (filters.blockchainAnchored === 'anchored' && !dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      if (filters.blockchainAnchored === 'not_anchored' && dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      return true;
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let valA: any, valB: any;
        if (sortConfig.key === 'metadata.status') valA = a.metadata.status;
        else if (sortConfig.key === 'metadata.last_updated') valA = new Date(a.metadata.last_updated).getTime();
        else if (sortConfig.key === 'ebsiVerification.status') valA = a.ebsiVerification?.status;
        else {
             valA = a[sortConfig.key as keyof DigitalProductPassport];
             valB = b[sortConfig.key as keyof DigitalProductPassport];
        }
        
        if (sortConfig.key === 'metadata.status') valB = b.metadata.status;
        else if (sortConfig.key === 'metadata.last_updated') valB = new Date(b.metadata.last_updated).getTime();
        else if (sortConfig.key === 'ebsiVerification.status') valB = b.ebsiVerification?.status;
        // Ensure valB is assigned if not covered by the specific 'else if' blocks for valA
        else if (!valB) {
             valB = b[sortConfig.key as keyof DigitalProductPassport];
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        
        const valAExists = valA !== undefined && valA !== null && valA !== "";
        const valBExists = valB !== undefined && valB !== null && valB !== "";

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
        const regulationChecks = Object.values(dpp.compliance).filter(Boolean);
        if (regulationChecks.length === 0 && Object.keys(dpp.compliance).length > 0) return false; 
        if (regulationChecks.length === 0 && Object.keys(dpp.compliance).length === 0) return true; 
        return regulationChecks.every(r => typeof r === 'object' && r !== null && 'status' in r && r.status === 'compliant');
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
    router, // exposing router for navigation if needed by dialogs
    toast   // exposing toast for dialogs
  };
}
