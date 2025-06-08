
"use client";

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, Users, LogOut, User, Settings as SettingsIcon, Bell } from "lucide-react";
import AppSidebarContent from "./AppSidebarContent";
import { Logo } from "@/components/icons/Logo";
import { useRole, type UserRole } from "@/contexts/RoleContext";
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

interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
}

const generateMockNotifications = (role: UserRole): AppNotification[] => {
  const now = Date.now();
  const baseNotifications: AppNotification[] = [
    { id: `gen_sys_${now+1}`, title: "Platform Update v1.2 Deployed", description: "New features include enhanced reporting and faster DPP generation. See changelog for details.", time: "2h ago" },
    { id: `gen_sec_${now+2}`, title: "Security Tip: Rotate API Keys", description: "Remember to periodically rotate your API keys for enhanced security.", time: "3d ago" },
  ];

  switch (role) {
    case 'admin':
      return [
        { id: `admin_rev_${now}`, title: "Review Queue Update", description: "5 new products are awaiting compliance review in the admin dashboard.", time: "15m ago" },
        { id: `admin_sys_${now+1}`, title: "System Health: Optimal", description: "All platform services are operating normally. Database backup successful.", time: "1h ago" },
        ...baseNotifications.slice(0,2),
      ];
    case 'manufacturer':
      return [
        { id: `mfg_comp_${now}`, title: "ESPR Guidance Updated", description: "New guidance document for ESPR compliance in the 'Textiles' category published.", time: "30m ago" },
        { id: `mfg_sup_${now+1}`, title: "Supplier 'EcoParts Ltd.' Update", description: "Supplier EcoParts Ltd. has updated their material certifications for 'Recycled Polymers'.", time: "4h ago" },
        ...baseNotifications.slice(0,2),
      ];
    case 'supplier':
      return [
        { id: `sup_req_${now}`, title: "Data Request: Acme Corp", description: "Acme Corp has requested updated specifications for 'Component Alpha-7'. Deadline: EOD.", time: "10m ago" },
        { id: `sup_cert_${now+1}`, title: "Certification Expiring Soon", description: "Your 'ISO 14001' certification for 'Eco-Solvents' is due for renewal next month.", time: "2d ago" },
        ...baseNotifications.slice(0,2),
      ];
    case 'retailer':
      return [
        { id: `ret_dpp_${now}`, title: "New Product DPP Available", description: "DPP for 'Smart Toaster Pro X' from 'KitchenWiz' is now published and ready for consumer view.", time: "1h ago" },
        { id: `ret_recall_${now+1}`, title: "Product Safety Alert (Mock)", description: "Minor update for 'Product Y' related to packaging information. No action required for sold units.", time: "1d ago" },
        ...baseNotifications.slice(0,2),
      ];
    default:
      return baseNotifications;
  }
};


export default function AppHeader() {
  const { isMobile, state: sidebarState } = useSidebar();
  const { currentRole, setCurrentRole, availableRoles } = useRole();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications(generateMockNotifications(currentRole));
  }, [currentRole]);


  const handleLogout = () => {
    alert("Mock Logout: User logged out!");
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
            <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground w-[--sidebar-width-mobile]">
              <AppSidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          <SidebarTrigger className="hidden md:flex" />
        )}
        {!isMobile && sidebarState === 'collapsed' && (
          <Logo className="h-8 w-auto text-primary" />
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as UserRole)}>
            <SelectTrigger className="w-[130px] sm:w-[150px] h-9 text-sm focus:ring-primary">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map(role => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
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
              <span>Notifications ({currentRole.charAt(0).toUpperCase() + currentRole.slice(1)})</span>
              {notifications.length > 0 && (
                <Badge variant="secondary" className="text-xs">{notifications.length} New</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map(notification => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 py-2.5 px-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50" onClick={() => alert(`Mock: Navigating to notification ${notification.id}`)}>
                  <div className="flex justify-between w-full items-center">
                    <span className="text-sm font-semibold text-foreground">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground w-full whitespace-normal">{notification.description}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-center text-muted-foreground py-3">
                No new notifications
              </DropdownMenuItem>
            )}
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#" className="flex items-center justify-center text-sm text-primary py-2.5 cursor-pointer hover:underline focus:bg-accent/50">
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
            <DropdownMenuItem onClick={() => alert("Mock: View Profile clicked")}>
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
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

