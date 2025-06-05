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
  Info // Using Info for About/Help as an example
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"; // Import Separator

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/products/new", label: "AI Data Extraction", icon: ScanLine },
  { href: "/gdpr", label: "GDPR Compliance", icon: ShieldCheck },
  { href: "/sustainability", label: "Sustainability", icon: FileText },
];

const secondaryNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  // Add other items like Help/About if needed
  // { href: "/about", label: "About", icon: Info }, 
];

export default function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar(); // Get sidebar state

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        {/* Conditionally render Logo based on sidebar state */}
        {sidebarState === 'expanded' && (
          <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-primary-foreground hover:text-sidebar-accent-foreground">
            <Logo className="h-8 w-auto text-primary" /> {/* Use primary color for logo in sidebar header */}
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-1 py-2"> {/* Reduced vertical padding for content area */}
        <SidebarMenu className="px-2 space-y-1"> {/* Reduced padding for menu, added space-y for items */}
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-start text-sm", // Ensure consistent text size
                    (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" // Active state style
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal text-sidebar-foreground/80", // Default hover and text
                     sidebarState === 'collapsed' ? "justify-center" : "justify-start" // Center icon when collapsed
                  )}
                  tooltip={sidebarState === 'collapsed' ? item.label : undefined} // Tooltip for collapsed state
                  asChild
                >
                  <a>
                    <item.icon className={cn("h-5 w-5", sidebarState === 'expanded' ? "mr-3" : "mr-0")} />
                    {sidebarState === 'expanded' && item.label}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="bg-sidebar-border my-2" /> {/* Separator before footer items */}
      <SidebarFooter className="p-2 border-t-0"> {/* Remove top border if separator is used */}
         <SidebarMenu className="px-2 space-y-1">
           {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-start text-sm",
                    pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal text-sidebar-foreground/80",
                    sidebarState === 'collapsed' ? "justify-center" : "justify-start"
                  )}
                  tooltip={sidebarState === 'collapsed' ? item.label : undefined}
                  asChild
                >
                  <a>
                    <item.icon className={cn("h-5 w-5", sidebarState === 'expanded' ? "mr-3" : "mr-0")} />
                    {sidebarState === 'expanded' && item.label}
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
