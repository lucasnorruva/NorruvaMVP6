
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
import { ALL_NAV_ITEMS, roleDashboardPaths, type NavItemConfig } from "@/config/navConfig"; 

export default function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();
  const { currentRole } = useRole();

  const accessibleNavItems = ALL_NAV_ITEMS.filter(item => item.requiredRoles.includes(currentRole));

  const mainNavItems = accessibleNavItems.filter(item => item.group !== 'secondary');
  const secondaryNavItems = accessibleNavItems.filter(item => item.group === 'secondary');

  const currentRoleDashboardPath = roleDashboardPaths[currentRole] || '/dashboard'; // Fallback

  const commonButtonClass = (href: string, isDashboardLink: boolean = false) => {
    let isActive: boolean;

    if (isDashboardLink) {
      isActive = pathname === currentRoleDashboardPath;
    } else if (href === "/products") {
      isActive = (pathname === href || (pathname.startsWith(href + "/") && !pathname.endsWith("/new")));
    } else if (href === "/compliance/pathways") {
      isActive = pathname.startsWith(href);
    } else if (href === "/sustainability") {
      isActive = (pathname === href || pathname.startsWith("/sustainability/"));
    } else {
      isActive = pathname.startsWith(href);
    }

    // Base classes for all buttons
    const baseStyling = "w-full text-sm transition-colors duration-150 ease-in-out group";
    
    // Layout classes based on sidebar state
    const layoutStyling = (sidebarState === 'collapsed' && !isMobile) 
      ? "justify-center px-2" // Padding for collapsed state (icon only)
      : "justify-start px-3"; // Padding for expanded state (icon + text)

    // Active/inactive state styling
    const stateStyling = isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" // Active: primary bg, white text, semibold
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal"; // Inactive: muted text, accent hover

    const className = cn(baseStyling, layoutStyling, stateStyling);
    
    return { className, isActive };
  };

  const commonIconClass = cn("h-5 w-5", (sidebarState === 'expanded' || isMobile) ? "mr-3" : "mr-0");

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border h-auto py-4 flex flex-col items-start px-4">
        {(sidebarState === 'expanded' || isMobile) && (
          <>
            <Link href={currentRoleDashboardPath} className="flex items-center gap-2 text-primary hover:opacity-80">
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
            const isDashboardItem = item.label === "Dashboard";
            const itemHref = isDashboardItem ? currentRoleDashboardPath : item.href;
            const { className, isActive } = commonButtonClass(itemHref, isDashboardItem);
            
            return (
              <SidebarMenuItem key={item.label}> 
                <Link href={itemHref} asChild>
                  <SidebarMenuButton
                    className={cn(className, (sidebarState === 'expanded' || isMobile) && "h-10")} // Set height for expanded/mobile
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
                    className={cn(className, (sidebarState === 'expanded' || isMobile) && "h-10")} // Set height for expanded/mobile
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

