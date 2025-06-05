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
  GitFork,
  Info
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/products/new", label: "AI Data Extraction", icon: ScanLine },
  { href: "/gdpr", label: "GDPR Compliance", icon: ShieldCheck },
  { href: "/sustainability", label: "Sustainability", icon: FileText },
];

const secondaryNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppSidebarContent() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border h-16">
        <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-primary-foreground hover:text-sidebar-accent-foreground">
          <Logo className="h-8 w-auto text-sidebar-primary" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu className="p-4">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <a>
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
         <SidebarMenu>
           {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <a>
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
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
