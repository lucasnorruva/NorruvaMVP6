"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar/Sidebar";
import { useSidebar } from "@/components/ui/sidebar/SidebarProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  UserCircle,
  LogOut,
  User,
  Settings as SettingsIcon,
  Bell,
  Briefcase,
  Search,
} from "lucide-react";
import AppSidebarContent from "./AppSidebarContent";
import { Logo } from "@/components/icons/Logo";
import { useRole, type UserRole } from "@/contexts/RoleContext";
import { roleDashboardPaths } from "@/config/navConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
}

const generateMockNotifications = (role: UserRole): AppNotification[] => {
  const now = Date.now();
  const baseNotifications: AppNotification[] = [
    {
      id: `gen_sys_${now + 1}`,
      title: "Platform Update v1.2 Deployed",
      description:
        "New features include enhanced reporting and faster DPP generation. See changelog for details.",
      time: "2h ago",
    },
    {
      id: `gen_sec_${now + 2}`,
      title: "Security Tip: Rotate API Keys",
      description:
        "Remember to periodically rotate your API keys for enhanced security.",
      time: "3d ago",
    },
  ];

  const roleSpecificMessages: Record<UserRole, AppNotification[]> = {
    admin: [
      {
        id: `admin_rev_${now}`,
        title: "Review Queue Update",
        description: "5 new products are awaiting compliance review.",
        time: "15m ago",
      },
      {
        id: `admin_sys_${now + 1}`,
        title: "System Health: Optimal",
        description: "All platform services are operating normally.",
        time: "1h ago",
      },
    ],
    manufacturer: [
      {
        id: `mfg_comp_${now}`,
        title: "ESPR Guidance Updated",
        description: "New guidance for 'Textiles' category published.",
        time: "30m ago",
      },
      {
        id: `mfg_sup_${now + 1}`,
        title: "Supplier 'EcoParts Ltd.' Update",
        description: "Material certs updated.",
        time: "4h ago",
      },
    ],
    supplier: [
      {
        id: `sup_req_${now}`,
        title: "Data Request: Acme Corp",
        description: "Update specs for 'Component Alpha-7'.",
        time: "10m ago",
      },
    ],
    retailer: [
      {
        id: `ret_dpp_${now}`,
        title: "New Product DPP Available",
        description: "DPP for 'Smart Toaster Pro X' published.",
        time: "1h ago",
      },
    ],
    recycler: [
      {
        id: `rec_mat_${now}`,
        title: "Material Alert: High PET Volume",
        description: "Increased PET plastic available for processing.",
        time: "1d ago",
      },
    ],
    verifier: [
      {
        id: `ver_audit_${now}`,
        title: "Audit Reminder: DPP005",
        description: "Scheduled audit for DPP005 is approaching.",
        time: "2d ago",
      },
    ],
    service_provider: [
      {
        id: `serv_job_${now}`,
        title: "New Service Job Assigned",
        description: "Repair required for product PROD-XYZ in Berlin.",
        time: "5m ago",
      },
    ],
    business_analyst: [
      {
        id: `ba_report_${now}`,
        title: "Monthly Insights Report Ready",
        description: "Your DPP analytics report for July is available.",
        time: "1h ago",
      },
      {
        id: `ba_trend_${now + 1}`,
        title: "Trend Alert: Compliance Rate Up",
        description: "Platform-wide compliance rate increased by 2% this week.",
        time: "6h ago",
      },
    ],
  };

  return [
    ...(roleSpecificMessages[role] || []),
    ...baseNotifications.slice(0, 2),
  ];
};

export default function AppHeader() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { currentRole, setCurrentRole, availableRoles } = useRole();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setNotifications(generateMockNotifications(currentRole));
  }, [currentRole]);

  const currentRoleDashboardPath =
    roleDashboardPaths[currentRole] || "/dashboard";

  const handleLogout = () => {
    alert("Mock Logout: User logged out!");
    router.push("/");
  };

  const formatRoleNameForDisplay = (role: UserRole): string => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = (
      e.currentTarget.elements.namedItem("globalSearch") as HTMLInputElement
    )?.value;
    toast({
      title: "Global Search (Conceptual)",
      description: `Search for "${searchInput}" initiated. This feature is coming soon!`,
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col p-0 bg-sidebar text-sidebar-foreground w-[--sidebar-width-mobile]"
            >
              <AppSidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <SidebarTrigger className="hidden md:flex" />
            <Link
              href={currentRoleDashboardPath}
              className="flex items-center text-primary"
            >
              <Logo className="h-8 w-auto" />
            </Link>
          </>
        )}
      </div>

      <div className="flex-1 flex justify-center px-2 sm:px-4">
        <form
          onSubmit={handleGlobalSearchSubmit}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative"
        >
          <Input
            type="search"
            name="globalSearch"
            placeholder="Search DPPs, products..."
            className="h-9 pl-10 pr-4 w-full bg-muted/50 border-border focus:bg-background text-sm"
            aria-label="Global search"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          <span>
            Viewing as:{" "}
            <span className="font-semibold text-foreground">
              {formatRoleNameForDisplay(currentRole)}
            </span>
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full"
                >
                  {notifications.length}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>
                Notifications ({formatRoleNameForDisplay(currentRole)})
              </span>
              {notifications.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {notifications.length} New
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 py-2.5 px-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                  onClick={() =>
                    alert(`Mock: Navigating to notification ${notification.id}`)
                  }
                >
                  <div className="flex justify-between w-full items-center">
                    <span className="text-sm font-semibold text-foreground">
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground w-full whitespace-normal">
                    {notification.description}
                  </p>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem
                disabled
                className="text-center text-muted-foreground py-3"
              >
                No new notifications
              </DropdownMenuItem>
            )}
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="#"
                    className="flex items-center justify-center text-sm text-primary py-2.5 cursor-pointer hover:underline focus:bg-accent/50"
                  >
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">User Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 lg:hidden">
              <Label
                htmlFor="role-switcher-mobile"
                className="text-xs text-muted-foreground mb-1 block"
              >
                Current Role
              </Label>
              <Select
                value={currentRole}
                onValueChange={(value) => setCurrentRole(value as UserRole)}
              >
                <SelectTrigger
                  id="role-switcher-mobile"
                  className="w-full h-9 text-xs focus:ring-primary"
                  data-testid="app-header-role-select-trigger-mobile"
                >
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem
                      key={`mobile-role-${role}`}
                      value={role}
                      className="capitalize text-xs"
                    >
                      {formatRoleNameForDisplay(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenuSeparator className="lg:hidden" />
            <DropdownMenuItem
              onClick={() => alert("Mock: View Profile clicked")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
