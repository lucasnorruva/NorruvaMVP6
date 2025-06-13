
// --- File: src/config/navConfig.ts ---
// Description: Centralized configuration for navigation items and their role-based access.
"use client";

import type { UserRole } from '@/contexts/RoleContext';
import {
  LayoutDashboard, Package, ScanLine, Users, FileText, BarChartHorizontal,
  ListChecks, Bot, ShieldCheck, Fingerprint, ClipboardList, Globe2, Code2, Settings, LineChart, Wrench
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItemConfig {
  href: string;
  label: string;
  icon: LucideIcon;
  group: 'main' | 'sustainability' | 'compliance' | 'specialized' | 'secondary';
  requiredRoles: UserRole[];
}

export const ALL_NAV_ITEMS: NavItemConfig[] = [
  // Main Group
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: 'main', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider'] },
  { href: "/dpp-live-dashboard", label: "Live DPPs", icon: LineChart, group: 'main', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider'] },
  { href: "/products", label: "Products", icon: Package, group: 'main', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier'] },
  { href: "/products/new", label: "Add Product", icon: ScanLine, group: 'main', requiredRoles: ['admin', 'manufacturer'] },
  { href: "/suppliers", label: "Suppliers", icon: Users, group: 'main', requiredRoles: ['admin', 'manufacturer'] },

  // Sustainability Group
  { href: "/sustainability", label: "Sustainability Reporting", icon: FileText, group: 'sustainability', requiredRoles: ['admin', 'manufacturer', 'verifier'] },
  { href: "/sustainability/compare", label: "Compare Sustainability", icon: BarChartHorizontal, group: 'sustainability', requiredRoles: ['admin', 'manufacturer', 'retailer', 'verifier'] },

  // Compliance Group
  { href: "/compliance/pathways", label: "Compliance Pathways", icon: ListChecks, group: 'compliance', requiredRoles: ['admin', 'manufacturer', 'supplier', 'verifier', 'service_provider'] },
  { href: "/copilot", label: "AI Co-Pilot", icon: Bot, group: 'compliance', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider'] },
  { href: "/gdpr", label: "GDPR Compliance", icon: ShieldCheck, group: 'compliance', requiredRoles: ['admin'] },

  // Specialized Views Group
  { href: "/blockchain", label: "Blockchain Management", icon: Fingerprint, group: 'specialized', requiredRoles: ['admin', 'manufacturer'] },
  { href: "/customs-dashboard", label: "Customs Dashboard", icon: ClipboardList, group: 'specialized', requiredRoles: ['admin', 'verifier'] },
  { href: "/dpp-global-tracker-v2", label: "DPP Global Tracker v2", icon: Globe2, group: 'specialized', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'verifier'] },

  // Secondary (Footer) Group
  { href: "/developer", label: "Developer Portal", icon: Code2, group: 'secondary', requiredRoles: ['admin', 'manufacturer'] },
  { href: "/audit-log", label: "Audit Log", icon: ListChecks, group: 'secondary', requiredRoles: ['admin'] },
  { href: "/settings", label: "Settings", icon: Settings, group: 'secondary', requiredRoles: ['admin', 'manufacturer', 'supplier', 'retailer', 'recycler', 'verifier', 'service_provider'] },
];
