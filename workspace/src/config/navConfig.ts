// --- File: src/config/navConfig.ts ---
// Description: Centralized configuration for navigation items and their role-based access.
"use client";

import type { UserRole } from '@/contexts/RoleContext';
import {
  LayoutDashboard, Package, ScanLine, Users, FileText, BarChartHorizontal,
  ListChecks, Bot, ShieldCheck, Fingerprint, ClipboardList, Globe2, Code2, Settings, LineChart, Wrench,
  Bookmark, BarChartBig, Scale as ScaleIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItemConfig {
  href: string;
  label: string;
  icon: LucideIcon;
  group: 'main' | 'sustainability' | 'compliance' | 'specialized' | 'secondary' | 'analytics'; // Added analytics group
  requiredRoles: UserRole[];
}

// Centralized mapping of roles to their specific dashboard paths
export const roleDashboardPaths: Record<UserRole, string> = {
  admin: "/admin-dashboard",
  manufacturer: "/manufacturer-dashboard",
  supplier: "/supplier-dashboard",
  retailer: "/retailer-dashboard",
  recycler: "/recycler-dashboard",
  verifier: "/verifier-dashboard",
  service_provider: "/service-provider-dashboard",
  business_analyst: "/data-insights-dashboard", 
};

export const ALL_NAV_ITEMS: NavItemConfig[] = [
  // Main Group
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: 'main', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider', 'business_analyst'] },
  { href: "/dpp-live-dashboard", label: "Live DPPs", icon: LineChart, group: 'main', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider', 'business_analyst'] },
  { href: "/products", label: "Products", icon: Package, group: 'main', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider', 'business_analyst'] },
  { href: "/products/new", label: "Add Product", icon: ScanLine, group: 'main', requiredRoles: ['admin', 'manufacturer'] },
  { href: "/suppliers", label: "Suppliers", icon: Users, group: 'main', requiredRoles: ['admin', 'manufacturer'] },
  { href: "/my-products", label: "My Tracked Products", icon: Bookmark, group: 'main', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider', 'business_analyst'] }, 

  // Analytics Group
  { href: "/data-insights-dashboard", label: "Data Insights", icon: BarChartBig, group: 'analytics', requiredRoles: ['admin', 'business_analyst'] },

  // Sustainability Group
  { href: "/sustainability", label: "Sustainability Reporting", icon: FileText, group: 'sustainability', requiredRoles: ['admin', 'manufacturer', 'verifier', 'business_analyst'] },
  { href: "/sustainability/compare", label: "Compare Sustainability", icon: BarChartHorizontal, group: 'sustainability', requiredRoles: ['admin', 'manufacturer', 'retailer', 'verifier', 'business_analyst'] },

  // Compliance Group
  { href: "/compliance/pathways", label: "Compliance Pathways", icon: ListChecks, group: 'compliance', requiredRoles: ['admin', 'manufacturer', 'supplier', 'verifier', 'service_provider', 'business_analyst'] },
  { href: "/copilot", label: "AI Co-Pilot", icon: Bot, group: 'compliance', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider', 'business_analyst'] },
  { href: "/gdpr", label: "GDPR Compliance", icon: ShieldCheck, group: 'compliance', requiredRoles: ['admin'] },

  // Specialized Views Group
  { href: "/blockchain", label: "Blockchain Management", icon: Fingerprint, group: 'specialized', requiredRoles: ['admin', 'manufacturer'] },
  { href: "/customs-dashboard", label: "Customs Dashboard", icon: ClipboardList, group: 'specialized', requiredRoles: ['admin', 'verifier'] },
  { href: "/dpp-global-tracker-v2", label: "DPP Global Tracker v2", icon: Globe2, group: 'specialized', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'verifier', 'service_provider', 'business_analyst'] },

  // Secondary (Footer) Group
  { href: "/developer", label: "Developer Portal", icon: Code2, group: 'secondary', requiredRoles: ['admin', 'manufacturer'] },
  { href: "/admin/regulations", label: "Regulation Management", icon: ScaleIcon, group: 'secondary', requiredRoles: ['admin'] },
  { href: "/audit-log", label: "Audit Log", icon: ListChecks, group: 'secondary', requiredRoles: ['admin'] },
  { href: "/settings", label: "Settings", icon: Settings, group: 'secondary', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider', 'business_analyst'] },
];
