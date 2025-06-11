
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ScanLine,
  ShieldCheck,
  FileText,
  Settings,
  Bot,
  Info,
  Code2,
  LineChart,
  ListChecks,
  BarChartHorizontal,
  ClipboardList,
  Globe,
  Users
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar/Sidebar";
import { SidebarMenu } from "@/components/ui/sidebar/SidebarMenu";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar/SidebarItem";
import { useSidebar } from "@/components/ui/sidebar/SidebarProvider";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dpp-live-dashboard", label: "Live DPPs", icon: LineChart },
  { href: "/products", label: "Products", icon: Package },
  { href: "/products/new", label: "Add Product", icon: ScanLine },
  { href: "/suppliers", label: "Suppliers", icon: Users },
  // Sustainability Group
  { href: "/sustainability", label: "Sustainability Reporting", icon: FileText },
  { href: "/sustainability/compare", label: "Compare Sustainability", icon: BarChartHorizontal },
  // Compliance Group
  { href: "/compliance/pathways", label: "Compliance Pathways", icon: ListChecks },
  { href: "/copilot", label: "AI Co-Pilot", icon: Bot },
  { href: "/gdpr", label: "GDPR Compliance", icon: ShieldCheck },
  // Specialized Views
  { href: "/customs-dashboard", label: "Customs Dashboard", icon: ClipboardList },
  { href: "/dpp-global-tracker", label: "DPP Global Tracker", icon: Globe },
];

const secondaryNavItems = [
  { href: "/developer", label: "Developer Portal", icon: Code2 },
  { href: "/audit-log", label: "Audit Log", icon: ListChecks },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();

  const commonButtonClass = (href: string) => {
    let isActive: boolean;

    // Handle specific overrides first
    if (href === "/dashboard") {
      isActive = (pathname === href);
    } else if (href === "/products") {
      // Active if on /products OR /products/* (excluding /products/new)
      isActive = (pathname === href || (pathname.startsWith(href + "/") && !pathname.endsWith("/new")));
    } else if (href === "/compliance/pathways") {
      // Active if on /compliance/pathways OR /compliance/pathways/*
      isActive = pathname.startsWith(href);
    } else if (href === "/sustainability") {
      // Active only if exactly on /sustainability, not its sub-pages like /sustainability/compare
      isActive = (pathname === href);
    } else if (href === "/sustainability/compare") {
      // Exact match for /sustainability/compare
      isActive = (pathname === href);
    } else {
      // General rule for all other links (including /developer, /settings, /products/new, /suppliers etc.)
      // Parent link is active if current path starts with the parent's href.
      isActive = pathname.startsWith(href);
    }

    const className = cn(
      "w-full text-sm",
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal text-sidebar-foreground/80",
      sidebarState === 'collapsed' && !isMobile ? "justify-center" : "justify-start"
    );

    return { className, isActive };
  };

  const commonIconClass = cn("h-5 w-5", sidebarState === 'expanded' || isMobile ? "mr-3" : "mr-0");

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        {(sidebarState === 'expanded' || isMobile) && (
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80">
            <Logo className="h-8 w-auto" />
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-1 py-2">
        <SidebarMenu className="px-2 space-y-1">
          {navItems.map((item) => {
            const { className, isActive } = commonButtonClass(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} asChild>
                  <SidebarMenuButton
                    className={className}
                    tooltip={sidebarState === 'collapsed' && !isMobile ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className={commonIconClass} />
                    {(sidebarState === 'expanded' || isMobile) && item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="bg-sidebar-border my-2" />
      <SidebarFooter className="p-2 border-t-0">
         <SidebarMenu className="px-2 space-y-1">
           {secondaryNavItems.map((item) => {
            const { className, isActive } = commonButtonClass(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} asChild>
                  <SidebarMenuButton
                    className={className}
                    tooltip={sidebarState === 'collapsed' && !isMobile ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className={commonIconClass} />
                    {(sidebarState === 'expanded' || isMobile) && item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

    