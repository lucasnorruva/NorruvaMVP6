
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/Logo";
import { SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar/Sidebar";
import { SidebarMenu } from "@/components/ui/sidebar/SidebarMenu";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar/SidebarItem";
import { useSidebar } from "@/components/ui/sidebar/SidebarProvider";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useRole } from "@/contexts/RoleContext";
import { ALL_NAV_ITEMS, type NavItemConfig } from "@/config/navConfig"; // Import new config

export default function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();
  const { currentRole } = useRole();

  const accessibleNavItems = ALL_NAV_ITEMS.filter(item => item.requiredRoles.includes(currentRole));

  const mainNavItems = accessibleNavItems.filter(item => item.group !== 'secondary');
  const secondaryNavItems = accessibleNavItems.filter(item => item.group === 'secondary');

  const commonButtonClass = (href: string) => {
    let isActive: boolean;

    if (href === "/dashboard") {
      // Special handling for dashboard link, it's active if any role-specific dashboard is active
      const roleDashboardPaths = {
        admin: "/admin-dashboard",
        manufacturer: "/manufacturer-dashboard",
        supplier: "/supplier-dashboard",
        retailer: "/retailer-dashboard",
        recycler: "/recycler-dashboard",
        verifier: "/verifier-dashboard",
      };
      isActive = pathname === href || Object.values(roleDashboardPaths).includes(pathname);
    } else if (href === "/products") {
      isActive = (pathname === href || (pathname.startsWith(href + "/") && !pathname.endsWith("/new")));
    } else if (href === "/compliance/pathways") {
      isActive = pathname.startsWith(href);
    } else if (href === "/sustainability") {
      isActive = (pathname === href);
    } else if (href === "/sustainability/compare") {
      isActive = (pathname === href);
    } else {
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
      <SidebarHeader className="border-b border-sidebar-border h-auto py-4 flex flex-col items-start px-4">
        {(sidebarState === 'expanded' || isMobile) && (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="text-xs text-sidebar-foreground/70 mt-1.5 ml-0.5">
              Verified Product Trust, Powered at Scale
            </p>
          </>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-1 py-2">
        <SidebarMenu className="px-2 space-y-1">
          {mainNavItems.map((item) => {
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
