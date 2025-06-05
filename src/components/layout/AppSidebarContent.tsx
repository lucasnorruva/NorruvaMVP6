
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
  LineChart
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
  { href: "/products", label: "Products", icon: Package }, // Renamed
  { href: "/products/new", label: "Add Product", icon: ScanLine }, // Renamed
  { href: "/copilot", label: "AI Co-Pilot", icon: Bot },
  { href: "/gdpr", label: "GDPR Compliance", icon: ShieldCheck },
  { href: "/sustainability", label: "Sustainability", icon: FileText },
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
    if (href === "/products") {
      // Active if it's the main /products list page OR a product detail page like /products/PROD001
      // but NOT if it's /products/new (which is a separate link)
      isActive = pathname === href || (pathname.startsWith(href + "/") && !pathname.endsWith("/new"));
    } else if (href === "/products/new") {
      // Active only if it's exactly /products/new
      isActive = pathname === href;
    } else if (href === "/settings" || href === "/developer") {
      // Active if it's the main page or any sub-page (e.g., /settings/users)
      isActive = pathname === href || pathname.startsWith(href + "/");
    } else {
      // For all other top-level items, an exact match is required.
      isActive = pathname === href;
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
