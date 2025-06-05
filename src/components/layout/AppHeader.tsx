"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle } from "lucide-react";
import AppSidebarContent from "./AppSidebarContent"; 
import { Logo } from "@/components/icons/Logo"; // Import Logo

export default function AppHeader() {
  const { isMobile, state: sidebarState } = useSidebar();

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
            <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground w-[240px]"> {/* Width from guidelines */}
              <AppSidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          <SidebarTrigger className="hidden md:flex" />
        )}
        {/* Show logo in header if sidebar is collapsed on desktop */}
        {!isMobile && sidebarState === 'collapsed' && (
          <Logo className="h-8 w-auto text-primary" />
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Future elements like search, notifications, user menu can go here */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">User Profile</span>
        </Button>
      </div>
    </header>
  );
}
