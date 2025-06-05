
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, Users, LogOut, User, Settings as SettingsIcon } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


export default function AppHeader() {
  const { isMobile, state: sidebarState } = useSidebar();
  const { currentRole, setCurrentRole, availableRoles } = useRole();

  const handleLogout = () => {
    // In a real app, you'd clear session, redirect, etc.
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

      <div className="flex items-center gap-4">
        {/* TooltipProvider removed, relying on a higher-level one (e.g., from SidebarProvider) */}
          <Tooltip>
            <TooltipTrigger asChild> {/* Correct usage: asChild is present */}
              <div className="flex items-center gap-2"> {/* This div becomes the trigger element */}
                <Users className="h-5 w-5 text-muted-foreground" />
                <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as UserRole)}>
                  <SelectTrigger className="w-[150px] h-9 text-sm focus:ring-primary">
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
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Simulate User Role (Prototype)</p>
            </TooltipContent>
          </Tooltip>
        {/* TooltipProvider removed */}

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
