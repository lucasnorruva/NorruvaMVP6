
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
  Globe,
  ClipboardList // Added for Customs Dashboard
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dpp-live-dashboard", label: "Live DPPs", icon: LineChart },
  { href: "/products", label: "Products", icon: Package },
  { href: "/products/new", label: "Add Product", icon: ScanLine },
  { href: "/dpp-global-tracker", label: "Global Tracker", icon: Globe },
  { href: "/customs-dashboard", label: "Customs Dashboard", icon: ClipboardList }, 
  { href: "/copilot", label: "AI Co-Pilot", icon: Bot },
  { href: "/compliance/pathways", label: "Compliance Pathways", icon: ListChecks }, // Updated href
  { href: "/gdpr", label: "GDPR Compliance", icon: ShieldCheck },
  { href: "/sustainability", label: "Sustainability Reporting", icon: FileText },
  { href: "/sustainability/compare", label: "Compare Sustainability", icon: BarChartHorizontal },
];

const secondaryNavItems = [
  { href: "/developer", label: "Developer Portal", icon: Code2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();

  const commonButtonClass = (href: string) => {
    let isActive = false;
    // General rule: active if current path starts with item's href
    isActive = pathname.startsWith(href);

    // Specific overrides for more precise matching if needed
    if (href === "/products" && pathname.startsWith("/products/") && pathname.endsWith("/new")) {
      isActive = false; // "/products/new" should not make "/products" active
    } else if (href === "/products" && (pathname === href || (pathname.startsWith(href + "/") && !pathname.endsWith("/new")))) {
       isActive = true;
    } else if (href === "/dashboard" && pathname !== href) { // Exact match for dashboard
      isActive = false;
    } else if (href === "/sustainability" && pathname.startsWith("/sustainability/compare")) {
        isActive = false; // "/sustainability/compare" should not make "/sustainability" active
    } else if (href === "/dpp-global-tracker" && pathname === href) { 
        isActive = true;
    } else if (href === "/customs-dashboard" && pathname === href) { 
        isActive = true;
    } else if (href === "/sustainability/compare" && pathname === href) { 
        isActive = true;
    } else if (href === "/compliance/pathways" && pathname.startsWith("/compliance/pathways/battery-regulation")) {
        // Keep /compliance/pathways active if on a sub-page like battery-regulation
        isActive = true;
    } else if (href === "/compliance/pathways" && pathname !== href) {
        isActive = false; // Ensure only exact match or deeper path makes it active
    }


    return cn(
      "w-full text-sm",
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal text-sidebar-foreground/80",
      sidebarState === 'collapsed' && !isMobile ? "justify-center" : "justify-start"
    );
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
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={commonButtonClass(item.href)}
                  tooltip={sidebarState === 'collapsed' && !isMobile ? item.label : undefined}
                  asChild
                >
                  <a>
                    <item.icon className={commonIconClass} />
                    {(sidebarState === 'expanded' || isMobile) && item.label}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="bg-sidebar-border my-2" />
      <SidebarFooter className="p-2 border-t-0">
         <SidebarMenu className="px-2 space-y-1">
           {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={commonButtonClass(item.href)}
                  tooltip={sidebarState === 'collapsed' && !isMobile ? item.label : undefined}
                  asChild
                >
                  <a>
                    <item.icon className={commonIconClass} />
                    {(sidebarState === 'expanded' || isMobile) && item.label}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
