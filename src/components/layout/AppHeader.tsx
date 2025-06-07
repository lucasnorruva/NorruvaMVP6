
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, Users, LogOut, User, Settings as SettingsIcon, Bell } from "lucide-react"; // Added Bell
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
import { Badge } from "@/components/ui/badge"; // Added Badge
import { cn } from "@/lib/utils";


const mockNotifications = [
  { id: "notif1", title: "Compliance Update", description: "Product PROD001 status changed to 'Compliant'.", time: "5m ago" },
  { id: "notif2", title: "New API Key", description: "Sandbox key 'sand_sk_...cdef' generated.", time: "1h ago" },
  { id: "notif3", title: "System Maintenance", description: "Scheduled for Sunday 2 AM UTC.", time: "1d ago" },
  { id: "notif4", title: "Data Request", description: "Manufacturer 'EcoGoods Inc.' requests data for Component Z.", time: "2d ago" },
];

export default function AppHeader() {
  const { isMobile, state: sidebarState } = useSidebar();
  const { currentRole, setCurrentRole, availableRoles } = useRole();

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
              {mockNotifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full"
                >
                  {mockNotifications.length}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {mockNotifications.length > 0 && (
                <Badge variant="secondary" className="text-xs">{mockNotifications.length} New</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.length > 0 ? (
              mockNotifications.slice(0, 4).map(notification => ( // Show max 4 notifications
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 py-2 px-3 cursor-pointer hover:bg-muted/50">
                  <div className="flex justify-between w-full items-center">
                    <span className="text-sm font-semibold text-foreground">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground w-full truncate">{notification.description}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-center text-muted-foreground py-3">
                No new notifications
              </DropdownMenuItem>
            )}
            {mockNotifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="#" className="flex items-center justify-center text-sm text-primary py-2 cursor-pointer">
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
