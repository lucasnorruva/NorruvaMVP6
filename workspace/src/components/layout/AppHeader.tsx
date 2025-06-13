
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } // Removed usePathname as it's not used after simplification
from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar/Sidebar";
import { useSidebar } from "@/components/ui/sidebar/SidebarProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, LogOut, User, Settings as SettingsIcon, Bell } from "lucide-react";
import AppSidebarContent from "./AppSidebarContent";
import { Logo } from "@/components/icons/Logo";
// Removed useRole and roleDashboardPaths as role switching is not handled here
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

const generateMockNotifications = (): AppNotification[] => { // Removed role parameter
  const now = Date.now();
  // Simplified base notifications, not role-specific for this header version
  return [
    { id: `gen_sys_${now+1}`, title: "Platform Update v1.2 Deployed", description: "New features include enhanced reporting and faster DPP generation. See changelog for details.", time: "2h ago" },
    { id: `gen_sec_${now+2}`, title: "Security Tip: Rotate API Keys", description: "Remember to periodically rotate your API keys for enhanced security.", time: "3d ago" },
    { id: `generic_info_${now+3}`, title: "Welcome to Norruva", description: "Explore the platform's features and capabilities.", time: "1w ago" },
  ];
};

export default function AppHeader() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications(generateMockNotifications());
  }, []);


  const handleLogout = () => {
    alert("Mock Logout: User logged out!");
    router.push('/'); // Redirect to homepage after logout
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
          <>
            <SidebarTrigger className="hidden md:flex" />
            {/* Logo now links to a generic /dashboard, redirection will handle role */}
            <Link href="/dashboard" className="flex items-center text-primary">
              <Logo className="h-8 w-auto" />
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
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
            {/* Notification label is now generic */}
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span> 
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
